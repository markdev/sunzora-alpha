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
var sunzoracreate = fs.readFileSync('sunzora_create_db.sql').toString();
var sunzoradrop = fs.readFileSync('sunzora_drop_db.sql').toString();
var tablecreate = fs.readFileSync('sunzora_create_tables.sql').toString();

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
		done(null, user);
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
		if (username=="mark.karavan@gmail.com" && password=="mark") {
			console.log("authenticated!");
			return done(null, {email: 'mark.karavan@gmail.com'});
		} else {
			console.log("not found");
			return done(null, false);
		}
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

/* initialization of database
Connect to Postgres{
  Drop Sunzora{
    Create Sunzora{
      Connect to Sunzora{
        Create Tables{
        } 
      }
    }
  }
}*/
//Initiate Connection: Postgres DB
pg.connect(config.postgresconString, function(err, client, done) {
    if(err) {
      return console.error('Postgres connection issue: ', err);//exception for connecting
    }
    //DROP Sunzora DB
    client.query(sunzoradrop, function(err, result) {
      done();

      if(err) {
          console.log('dropping sunzora:', err);//ignore error if sunzora does not exist
      }

        //CREATE Sunzora DB
        client.query(sunzoracreate, function(err, result) {

          done();

          if(err) {
            console.log('creating sunzora:', err);//ignore error if sunzora already set up
          }
    		//Initiate Connection: Sunzora DB
            pg.connect(config.sunzoraconString, function(err, client, done) {

                if (err) {
                  return console.error('Sunzora connection issue: ', err);//exception for connecting
                }
                //CREATE Sunzora Tables
                client.query(tablecreate, function(err, result) {
                  done();
        
                  if (err) {
                    return console.error('error running query', err);//exception if SQL fails
                  }

                console.log(result.rows);
                });
            });
      //output: 1
        });
    });
});

require('./server/routes/api-routes')(app);

app.listen(config.port);
console.log("app is listening on port " + config.port + "...");






