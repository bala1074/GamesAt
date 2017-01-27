var MyGames = require('./../models/mygames');
var MyProfile = require('./../models/profile');
var Games = require('./../models/games');
// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('./index.ejs'); // load the index.ejs file
	});

	/*
	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('./copy/login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/mygames', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('./copy/signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('./copy/profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
	*/

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/home',
            failureRedirect : '/'
        }));



	/*// =====================================
	// FACEBOOK ROUTES =====================
	// =====================================
	// route for facebook authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));
	 */

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.render('logout');
	});




	//Games AT routes
	/**********************************************************/
	///////////                Routers                //////////
	/*********************************************************/

    app.get("/",function(req,res){
        res.render("index");
    });

    app.get("/home",isLoggedIn,function(req,res){
    	console.log(req.user.google.email);
    	MyProfile.findOne({email:req.user.google.email},function (err,userdata) {

    		if(err)
    			console.log("Failed at /home");
    		else {
                console.log("userdata : "+userdata);
                res.render("home", {
                    user: req.user, // get the user out of session and pass to template
                    nickname: userdata.nickname
                });
                res.redirect("/mygames");
            }
        });
    });

    app.get("/games",isLoggedIn,function(req,res){
        var gameType = req.query.game;
        if(gameType == "" || gameType==null)
            gameType="cricket";
      /*  Games.find({game:gameType},function (err,games) {

        });*/
        if(req.user.google.email != "" && req.user.google.email!=null) {
            Games.find({game: gameType}).sort({time: 1}).exec(function (err, games) {
                if (err)
                    console.log("Failed at /games");
                else {
                    console.log("games : " + games);
                    MyGames.findOne({email: req.user.google.email}, function (err, mygames) {
                        if (err)
                            console.log("Failed at /games");
                        else {
                            var flag = 0;
                            if (mygames.cricket == 1)
                                flag = 1;
                            else if (mygames.badminton == 1)
                                flag = 1;
                            else if (mygames.tabletennis == 1)
                                flag = 1;
                            else if (mygames.chess == 1)
                                flag = 1;
                            else if (mygames.bowling == 1)
                                flag = 1;
                            else if (mygames.gokarting == 1)
                                flag = 1;
                            else if (mygames.basketball == 1)
                                flag = 1;
                            res.render("games", {gamedata: gameType, gamesdata: games, flagValue: flag});
                        }
                    });
                }
            });
        }
        else
            res.redirect("/");
        //Games.find({game:gameType}).sort({lastModifiedDate:1})
    });
    app.get("/joingame",isLoggedIn,function(req,res){
        var gameHostid = req.query.id;
        console.log(gameHostid+" in /joingame");
        Games.findOneAndUpdate({_id:gameHostid},{$push: {"joins": req.user.google.email}}, {upsert:true},function(err,games){
            if(err)
                console.log("Failed at /joingame");
            else{
                console.log("games : "+games);
                res.redirect("/games");
                //res.render("games",{gamedata:gameType,gamesdata:games});
            }
        });
        //Games.find({game:gameType}).sort({lastModifiedDate:1})
    });

    app.get("/notjoingame",isLoggedIn,function(req,res){
        var gameHostid = req.query.id;
        console.log(gameHostid+" in /joingame");
        Games.findOneAndUpdate({_id:gameHostid},{$pull: {"joins": req.user.google.email}},function(err,games){
            if(err)
                console.log("Failed at /notjoingame");
            else{
                console.log("games : "+games);
                res.redirect("/games");
                //res.render("games",{gamedata:gameType,gamesdata:games});
            }
        });
        //Games.find({game:gameType}).sort({lastModifiedDate:1})
    });

    app.get("/hostgame",isLoggedIn,function(req,res){
        var gameType = req.query.game;
        if(gameType == "" || gameType==null)
        	gameType="cricket";

        var gameQuery={};
        var flag=1;
        if(gameType=='cricket')
            gameQuery={cricket:flag};
        else if(gameType=='badminton')
            gameQuery={badminton:flag};
        else if(gameType=='tabletennis')
            gameQuery={tabletennis:flag};
        else if(gameType=='chess')
            gameQuery={chess:flag};
        else if(gameType=='bowling')
            gameQuery={bowling:flag};
        else if(gameType=='gokarting')
            gameQuery={gokarting:flag};
        else if(gameType=='basketball')
            gameQuery={basketball:flag};

        MyGames.find(gameQuery,function (err,players) {
			if(err)
				console.log("Failed at /hostgame");
			else{
				console.log("Players : "+players);
				var playersProfile=[];
				var lenght=players.length;
				var temp=0;
				if(lenght==0){
                    res.render("hostgame", {
                        hostgamedata: gameType,
                        playersProfileList: []
                    });
				}
				else {
                    players.forEach(function (player) {
                        MyProfile.findOne({email: player.email}, function (err, profile) {
                            if (err)
                                console.log("Failed at /hostgame inside");
                            else {
                                temp++;
                                playersProfile.push(profile);
                                if (temp == lenght) {
                                    console.log("playera profile : " + playersProfile);
                                    res.render("hostgame", {
                                        hostgamedata: gameType,
                                        playersProfileList: playersProfile
                                    });
                                }
                            }
                        });
                    });
                }
			}
        });


    });

    app.post("/hostinggame",isLoggedIn,function (req,res) {
        ////initialize hosting game
        console.log(req.body.gametype+" game is hosting "+JSON.stringify(req.body));
        var state="active";
        var time="2017/01/27 16:30:40";

        //time
        var date=req.body.date;
        var time=req.body.time;
        var am_pm=req.body.am_pm;
        if(am_pm != 'am'){
            var t=time.split(":");
            time=(Number(t[0])+12)+":"+t[1]+":00";
            date=date+" "+time;
        }
        else{
            time=time+":00";
            date=date+" "+time;
        }
        console.log("formatted date : "+date);
        //end time

        var games=new Games();
        games.email=req.user.google.email;
        games.title=req.body.title;
        games.location=req.body.location;
        games.description=req.body.description;
        games.time=new Date(date);
        games.game=req.body.gametype;
        games.state=state;
        if(games.email!="" && games.email!=null) {
            games.save(function (err, game) {
                if (err)
                    console.log("Failed to initialize!! " + err);
                else
                    console.log("Successfully initialized!! " + game);
            });
        }
    });

    /*
    app.get("/mygames",isLoggedIn,function(req,res){
        MyGames.find({email:req.user.google.email},function (err,mygames) {
			if(err)
				console.log("Failed at /mygames");
			else
				console.log("Got mygames data : "+mygames);
				res.render("mygames", {mygamesdata:mygames});
        });
    });
	*/
    app.get("/mygames",isLoggedIn,function(req,res){

    	var gameType = req.query.game;
    	var flag = req.query.flag;
        console.log(gameType+" "+flag);
        var updateGameFlag={};
		if(gameType=='cricket')
			updateGameFlag={cricket:flag};
		else if(gameType=='badminton')
            updateGameFlag={badminton:flag};
        else if(gameType=='tabletennis')
            updateGameFlag={tabletennis:flag};
        else if(gameType=='chess')
            updateGameFlag={chess:flag};
        else if(gameType=='bowling')
            updateGameFlag={bowling:flag};
        else if(gameType=='gokarting')
            updateGameFlag={gokarting:flag};
        else if(gameType=='basketball')
            updateGameFlag={basketball:flag};
		console.log(updateGameFlag);

        MyGames.findOneAndUpdate({email:req.user.google.email},updateGameFlag, {upsert:true}, function(err, mygames){
            if (err)
                console.log("Failed at /mygames/:game/:flag");
			else{
                console.log("Got mygames data : "+mygames);
            	res.render("mygames",{mygamesdata:[mygames]});
            }
        });
    });


    app.get("/rankings",isLoggedIn,function(req,res){
        var gameType = req.query.game;
        if(gameType == "" || gameType==null)
            gameType="cricket";
        res.render("rankings",{rankingsdata:gameType});
    });
    app.get("/profile",isLoggedIn,function(req,res){
        MyProfile.findOne({email:req.user.google.email},function(err, profile){
            if (err)
                console.log("Failed at get /profile");
            else{
                console.log("Got profile data : "+profile);
                res.render("profile",{profiledata:[profile]});
            }
        });
    });
    app.post("/profile",isLoggedIn,function(req,res){
    	var email = req.user.google.email;
    	var name = req.user.google.name;
    	var nickname = req.body.nickname;
    	var gender = req.body.gender;
    	var mobile = req.body.mobile;
    	console.log(email+" "+gender+" "+mobile+" "+nickname);
        MyProfile.findOneAndUpdate({email:req.user.google.email},{nickname:nickname,gender:gender,mobile:mobile}, {upsert:true}, function(err, profile){
            if (err)
                console.log("Failed at post /profile");
            else{
                console.log("Got profile data : "+profile);
                res.render("profile",{profiledata:[profile]});
            }
        });
    });
    app.get("/about",function(req,res){
        res.render("about");
    });
    app.get("/contact",function(req,res){
        res.render("contact");
    });


};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
