// Declare variables
var express 		= require('express')
  , os 				= require('os')
  , path			= require('path')
  , pg 				= require('pg')
  ,	bodyParser 		= require('body-parser')
  , cookieParser    = require('cookie-parser')
  , serveStatic     = require('serve-static')
  , expressSession  = require('express-session')
  , passport		= require('passport')
  , LocalStrategy   = require('passport-local').Strategy
  , multer			= require('multer')
  , RedisStore      = require('connect-redis')(expressSession)
  , fs              = require('fs')
  ;

var app = express();
var config = require('./server/config')
var dbsetup = fs.readFileSync('./dbsetup.sql').toString();

app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({
	store: new RedisStore({
		host: config.redis.host,
		port: config.redis.port
	}),
	secret: process.env.SESSION_SECRET || 'foobarbaz'
//  , resave: false //
//  , saveUninitialized: false	
}));

app.use(passport.initialize());
app.use(passport.session());

//allow the angular ui-views to be written in Jade
app.use(serveStatic(__dirname + '/public'));

passport.serializeUser(function(user, done) {
	if(user) {
		done(null, user._id);
	}
});

/*
passport.deserializeUser(function(id, done) {
	console.log("Deserializing User");
	User.findOne({_id:id}).exec(function(err, user) {
		if(user) {
			// consider not putting in the whole user
			return done(null, user);
		} else {
			return done(null, false);
		}
	})
});
*/
passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	function(username, password, done) {
		console.log("DEBUG 2");
		console.log("Email: " + username);
		/*
		User.findOne({email:username}).exec(function(err, user) {
			console.log("DEBUG 3");
			if (user && user.authenticate(password)) {
				console.log("authenticated!");
				return done(null, user);
			} else {
				console.log("not found");
				return done(null, false);
			}
		});
		*/
	}
));

pg.connect(config.preconString, function(err, client, done) {//connect to default DB
  	if(err) {
    	return console.error('error fetching client from pool', err);//exception for connecting
  	}
  	client.query('CREATE DATABASE sunzora WITH OWNER = postgre;', function(err, result) {//Attempt to create Sunzora
       	done();// close connection

    	if(err) {
    	  console.log('sunzora DB already set up');//ignore error if sunzora already set up
   		}

   		pg.connect(config.postconString, function(err, client0rg, done) {//connect to Sunzora DB

   			if (err) {
   				return console.error('error fetching client from pool', err);//exception for connecting to Sunzora
   			}
   			//Run the SQL statements
    		client0rg.query('SELECT * FROM public.contest', function(err, result0) {
    		done();
    		//Run the SQL statements
    		if (err) {
    			return console.error('error running query', err);//exception if SQL fails
    		}

    	console.log(result0.rows);
    	//output: 1
    		});
  		});
	});
});

app.listen(config.port);
console.log("app is listening on port " + config.port + "...");



/*
Let's keep things simple and just put the api here
*/
app.get('/views/*', function(req, res) {
	var file = req.params[0];
	res.render('../../public/app/views/' + file);
});

//render layout
app.get('*', function(req, res) {
	var currentUser = {};
	if(req.user) {
		currentUser = {
			_id: req.user._id
			, firstName: req.user.firstName
			, lastName: req.user.lastName
			, email: req.user.email
			, roles: req.user.roles
		}
	}
	res.render('layout', {
		currentUser: currentUser
	});
});












