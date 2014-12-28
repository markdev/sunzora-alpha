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

passport.deserializeUser(function(id, done) {
	return done(null, false);	
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

pg.connect(config.conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT * FROM test_table', function(err, result) {
    //call `done()` to release the client back to the pool
    done();

    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows);
    //output: 1
  });
});

app.listen(config.port);
console.log("app is listening on port " + config.port + "...");



/*
Let's keep things simple and just put the api here
*/
app.get('/api/contests', function(req, res, next) {
	var contests = [
		{ 
			id: 1,
			title: "How should we use sunzora?",
			deadline: "Feb 1, 2015"
		},
		{ 
			id: 2,
			title: "HHow can sunzora make money?",
			deadline: "January 15, 2015"
		},
		{ 
			id: 3,
			title: "What's the first thing sunzora should do?",
			deadline: "Feb 3, 2015"
		}
	];
	res.send({success: true, contests: contests});
})

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












