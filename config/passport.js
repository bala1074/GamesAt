// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy  = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User       		= require('./../models/user');
var MyyGamesModel = require('./../models/mygames');
var MyProfile = require('./../models/profile');


// load the auth variables
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));



    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

            clientID        : configAuth.googleAuth.clientID,
            clientSecret    : configAuth.googleAuth.clientSecret,
            callbackURL     : configAuth.googleAuth.callbackURL,

        },
        function(token, refreshToken, profile, done) {

            console.log(profile);

            // try to find the user based on their google id
            User.findOne({ 'google.email' : profile.emails[0].value}, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    User.findOneAndUpdate({ 'google.email' : profile.emails[0].value},{'google.name' : profile.displayName,
                    'google.picture' : profile._json.picture}, {upsert:true}, function(err, profile){
                        if (err)
                            console.log("Failed at passport gmail profile update");
                        else{
                            console.log("Got profile data : "+profile);
                        }
                    });
                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();
                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email
                    newUser.google.picture = profile._json.picture;
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });


                    //initialize mygames
                    var mygames=MyyGamesModel();
                    mygames.email=newUser.google.email;
                    mygames.save(function (err,mygames) {
                        if(err)
                            console.log("Failed to initialize!!");
                        else
                            console.log("Successfully initialized!! " +mygames);
                    });

                    ////initialize MyProfile
                    var myprofile=MyProfile();
                    myprofile.email=newUser.google.email;
                    myprofile.name=newUser.google.name;
                    myprofile.nickname=profile._json.family_name;
                    myprofile.save(function (err,mygames) {
                        if(err)
                            console.log("Failed to initialize!!");
                        else
                            console.log("Successfully initialized!! " +mygames);
                    });
                }
            });

        }));

};
