/************Create Master Process and Starts Worker Processes*************/


//Include Cluster
/*var cluster = require('cluster');

//Code to run if we're in the master process
if(cluster.isMaster){

// Count the machine's CPUs
var cpuCount = require('os').cpus().length;


// Create a worker for each CPU
for (var i=0; i< cpuCount; i += 1) {
  cluster.fork();
}

cluster.on('exit', function (worker) {

  //Replace the dead worker,
  //we're not sentimental
  console.log('Worker ' + worker.id + ' died :(');
    cluster.fork();

});
*/
/******************************Worker Processes************************/
//}else {


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
  , portscanner     = require('portscanner')
  , LocalStrategy   = require('passport-local').Strategy
  , multer			    = require('multer')
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
  console.log(user);
	if(user) {
		done(null, user);
	}
});

var SunzoraconString = "postgres://postgres:irdlhajbis@localhost:5432/sunzora";

passport.deserializeUser(function(userObj, done) {
	console.log("Deserializing User");
  console.log(userObj);
    pg.connect(SunzoraconString, function(err, client, psDone) {
      if(err) {
          return console.error('Sunzora connection issue: ', err);
      } else {
        var sql = "SELECT users.user_id, users.email, permission.name FROM public.users, public.permission, public.permission_link WHERE users.user_id = permission_link.user_id AND permission.permission_id = permission_link.permission_id AND users.email = '" + userObj.email + "'";
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
              console.log(user.permissions);
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


//Initiate Connection: Postgres DB
/*pg.connect(config.postgresconString, function(err, client, done) {
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
});*/

require('./server/routes/api-routes')(app);

portscanner.findAPortNotInUse(2343, 2345, '127.0.0.1', function(error, port2) {
  app.listen(port2);
  console.log("app " /*+ cluster.worker.id */+ " is listening on port " + port2 + "...");
})

//app.listen(config.port);
//console.log("app " + cluster.worker.id + " is listening on port " + config.port + "...");

//}




