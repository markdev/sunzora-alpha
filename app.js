// Declare variables
var express         = require('express')
  , os              = require('os')
  , path			      = require('path')
  , pg 				      = require('pg')
  ,	bodyParser 		  = require('body-parser')
  , cookieParser    = require('cookie-parser')
  , serveStatic     = require('serve-static')
  , expressSession  = require('express-session')
  , passport		    = require('passport')
  , LocalStrategy   = require('passport-local').Strategy
  , multer			    = require('multer')
  , RedisStore      = require('connect-redis')(expressSession)
  , fs              = require('fs')
  , vhostManager    = require("express-vhost-manager")
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
  console.log("serializing user: ");
  console.log(user);
	if(user) {
		done(null, user);
	}
});

var SunzoraconString = "postgres://postgres:irdlhajbis@localhost:5432/sunzora";
/*
passport.deserializeUser(function(id, done) {
  console.log("deserializeUser:");
  console.log(id);
	return done(null, false);	
});
*/
passport.deserializeUser(function(userObj, done) {
	console.log("Deserializing User");
  console.log(userObj);
    pg.connect(SunzoraconString, function(err, client, psDone) {
      if(err) {
          return console.error('Sunzora connection issue: ', err);
      } else {
        //var sql = "SELECT * FROM public.users WHERE users.user_id = " + userObj.id;
        var sql = "SELECT users.user_id, users.email, permission.name FROM public.users, public.permission, public.permission_link WHERE users.user_id = permission_link.user_id AND permission.permission_id = permission_link.permission_id AND users.email = '" + userObj.email + "'";
        console.log(sql);
        client.query(sql, function(err, result) {
          psDone();
          if (result.rows) {
            var user = result.rows[0];
            user.permissions = [];
            for (var i = 0; i<result.rows.length; i++) {
              user.permissions[user.permissions.length] = result.rows[i].name;
            }
            console.log("authenticated!");
            return done(null, {id: user.user_id, email: user.email, permissions: user.permissions });
          } else {
            return done(null, false);
          }            
        });
      }
	  });
  });
  



passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	function(username, password, done) {
    console.log("debug2");
    pg.connect(SunzoraconString, function(err, client, psDone) {
      if(err) {
          return console.error('Sunzora connection issue: ', err);
      } else {
        var sql = "SELECT users.user_id, users.email, permission.name FROM public.users, public.permission, public.permission_link WHERE users.user_id = permission_link.user_id AND permission.permission_id = permission_link.permission_id AND users.email = '" + username + "' AND users.password = '" + password + "'";
        console.log(sql);
        client.query(sql, function(err, result) {
          psDone();
            if (result.rows[0]) {
              var user = result.rows[0];
              user.permissions = [];
              for (var i = 0; i<result.rows.length; i++) {
                user.permissions[user.permissions.length] = result.rows[i].name;
              }
              console.log(permissions);
              console.log("authenticated!");
              return done(null, {id: user.user_id, email: user.email, permissions: user.permissions });
            } else {
              console.log("not found");
              return done(null, false);
            }
        })
      }
    });
  }
));    


    /*
    pg.connect(SunzoraconString, function(err, client, done) {
      if(err) {
        return console.error('Sunzora connection issue: ', err);
      } else {
        //shit, this should also contain the permissions
        client.query('SELECT * FROM users WHERE email="' + username + '" AND password="' + password + '"', function(err, result) {
          if (username==result.rows.email && password==result.rows.password) {
            console.log("authenticated!");
            // permissions must be serialized into an array of some sort
            return done(null, {id: result.rows.id, email: result.rows.email, permissions: result.rows.permissions });
          } else {
            console.log("not found");
            return done(null, false);
          }
      }
    */

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






