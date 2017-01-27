var express = require('express'); //server side framework
var mongoose=require("mongoose"); //connect with mongoDB
var bodyParser=require("body-parser"); //parse post req body
var ejs=require("ejs"); //access ejs

var port     = process.env.PORT || 2020;
var passport = require('passport');
var flash    = require('connect-flash');
var configDB = require('./config/database.js');

//initialize  express
var app=express();


/*
//to receive post req body
app.use(bodyParser.urlencoded({ extended: false }));



//set values
app.set("view engine",'ejs');
*/

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.configure(function() {

    // set up our express application
    app.use(express.logger('dev')); // log every request to the console
    app.use(express.cookieParser()); // read cookies (needed for auth)
    app.use(express.bodyParser()); // get information from html forms
    //to link external css/js
    app.use(express.static("public"));

    app.set('view engine', 'ejs'); // set up ejs for templating

    // required for passport
    app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session

});

// routes ======================================================================
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

//creating server
app.listen(port,function () {
   console.log("Connections established.. http://localhost:2020");
});

