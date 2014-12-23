// Declare variables
var express 		= require('express')
  , os 				= require('os')
  , path			= require('path')
  ,	bodyParser 		= require('body-parser')
  , cookieParser    = require('cookie-parser')
  , serveStatic     = require('serve-static')
  , expressSession  = require('express-session')
  , mongoose        = require('mongoose')
  , passport		= require('passport')
  , LocalStrategy   = require('passport-local').Strategy
  , multer			= require('multer')
  , RedisStore      = require('connect-redis')(expressSession)
  ;

var app = express();
var config = require('./server/config')

//initialize database
require('./server/db')(config);

//init User model
var UserSchema = require('./server/models/User').User
  , User = mongoose.model('User')

// Configure express
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

passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	function(username, password, done) {
		console.log("DEBUG 2");
		console.log("Email: " + username);
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
	}
));

app.use(multer({
	dest: "./images/tmp"
}));

//configure routes
require('./server/routes/api-routes')(app);

app.listen(config.port);
console.log("app is listening on port " + config.port + "...");