var passport 	= require('passport')
 , pg   		= require('pg')
 ;

var SunzoraconString = "postgres://postgres:irdlhajbis@localhost:5432/sunzora";

var config = require('../config')
/**
	Notes:
	- I've used the convention uid, cid, and eid to refer to user id, contest id, and entry id
	- All POST api's take a JSON object as a parameter
	  - they can be found in req.body so if you get something that gives you { email: "foo@bar.com" }, the email is called with req.body.email
	- Some GET api's take one or two params from the url string that can be accessed with req.param("uid");
	- All api's send back a JSON object of this format
	   { success: true, records: records }
	  - Some API's will just return { success: true } or { success: false } (in the case of failure)
*/



/**
	Goal: Logs the user in
	Parameters:
	{
		email: "foo@bar.com",
		password: "foo123"
	}
	Returns:
	{
		uid: 123,
		email: "foo@bar.com",
		permissions: ['submit_entry', 'create_contest']
	}
	Notes:
	- This one is tricky because it is closely involved with express's overly complicated logging system.
	- I'll take care of this one after you've got a few SQL statements running
*/
exports.login = function(req, res, next) {
	console.log("debug1");
	req.body.email = req.body.email.toLowerCase();
	passport.authenticate('local', function(err, user) {
		console.log("123");
		if(err) {
			console.log("debug 1");
			res.send({success:false, message: "Error authenticating user."});
		}
		if(!user) {
			console.log("debug 2");
			res.send({success:false, message: "Matching user not found."});
		}
		req.logIn(user, function(err) {
			if(err) {return next(err);}
			console.log("debug 3");
			res.send({success:true, user: user});
		});
	})(req, res, next);
}



/**
	Goal: Logs the user out
	Parameters: nothing
	Returns: nothing
	Notes: No SQL needed here
*/
exports.logout = function(req, res, next) {
	console.log(req.user);
	req.logout();
	res.send({success: true})
}



/**
	Goal: Gets all contests, sorted by deadline
	Parameters: nothing
	Returns: contests =
	[
		{
			id: 1234,
			title: "Contest1",
			deadline: "1/31/2015 11:46:13",
			completed: false
		},
		{
			id: 1235,
			title: "Contest2",
			deadline: "12/29/2014 11:46:13",
			completed: true
		}
	]
	Notes:
	- Active contests at the top, expired contests at the bottom
*/
exports.getAllContests =  function(req, res, next) {
	pg.connect(SunzoraconString, function(err, client, done) {
		if(err) {
      		return console.error('Sunzora connection issue: ', err);
    	} else {
    		client.query('SELECT * FROM public.contest ORDER BY contest.end_date DESC;', function(err, result) {
      			done();
      			if(err) {
          			console.log('error:', err);
          			res.send({success: false});
      			} else {
    				res.send({success: true, contests: result.rows});
      			}
    		});
    	}
    });
}



/**
	Goal: Gets all active contests, sorted by deadline
	Parameters: nothing
	Returns: contests =
	[
		{
			id: 1234,
			title: "Contest1",
			deadline: "1/31/2015 11:46:13",
		},
		{
			id: 1235,
			title: "Contest2",
			deadline: "1/29/2015 11:46:13",
		}
	]
	Notes:
	- Active contests at the top, expired contests at the bottom
*/
exports.getAllActiveContests =  function(req, res, next) {

	pg.connect(SunzoraconString, function(err, client, done) {
		if(err) {
      		return console.error('Sunzora connection issue: ', err);
    	} else {
    		client.query('SELECT contest.contest_id AS id, contest.title AS title, contest.end_date AS deadline FROM public.contest WHERE contest.end_date > current_timestamp;', function(err, result) {
      			done();
      			if(err) {
          			console.log('error:', err);
          			res.send({success: false});
      			} else {
    				res.send({success: true, contests: result.rows});
      			}
    		});
    	}
    });
}




/**
	Goal: Gets all completed contests, sorted by deadline
	Parameters: nothing
	Returns: contests =
	[
		{
			id: 1234,
			title: "Contest1",
			deadline: "1/31/2014 11:46:13",
		},
		{
			id: 1235,
			title: "Contest2",
			deadline: "1/29/2014 11:46:13",
		}
	]
	Notes:
	- Active contests at the top, expired contests at the bottom
*/
exports.getAllCompletedContests =  function(req, res, next) {
	pg.connect(SunzoraconString, function(err, client, done) {
		if(err) {
      		return console.error('Sunzora connection issue: ', err);
    	} else {
    		client.query('SELECT * FROM public.contest WHERE contest.end_date <= current_timestamp;', function(err, result) {
      			done();
      			if(err) {
          			console.log('error:', err);
          			res.send({success: false});
      			} else {
    				res.send({success: true, contests: result.rows});
      			}
    		});
    	}
    });
}



/**
	Goal: Get a particular contest
	Parameters: req.param('id')
	Returns: contest = 
	{
		id: 1234,
		title: "Contest1",
		deadline: "1/31/2015 11:46:13",
		completed: false
	}
*/
exports.getContestById  = function(req, res, next) {
	var cid = req.param('cid');

	pg.connect(SunzoraconString, function(err, client, done) {
		if(err) {
      		return console.error('Sunzora connection issue: ', err);
    	} else {
    		client.query('SELECT contest_id AS id, title AS title, description AS description, end_date AS deadline FROM public.contest WHERE contest.contest_id = ' + cid + ';', function(err, result) {
      			done();
      			if(err) {
          			console.log('error:', err);
      			} else {
      				console.log("here's the result");
		    		console.log(result);
		    		var contest = result.rows[0];
		    		res.send({success: true, contest: contest});
      			}
    		});
    	}
    });
}




/**
	Goal: Gets a user's entries to a particular contest and current average scores for those entries
	Parameters: req.param('uid'), req.param('cid')
	Returns: entries = 
	[
		{
			content: "This is the first entry",
			score: 3.54
		},
		{
			content: "This is the second entry",
			score: 6.34
		},
	]
	Notes:
	- gets entries of the user for a particular contest, along with averaged scores
	- Grab text details for contest and user
		SELECT entry.text_details, AVG(rating.selected_rating) FROM public.rating, public.entry WHERE rating.entry_id = entry.entry_id AND entry.user_id = uid AND entry.contest_id = cid GROUP BY entry.text_details;
*/
exports.getEntriesAndScoresByUserIdAndContestId = function(req, res, next) {
	var uid = req.param("uid");
	var cid = req.param("cid");
	pg.connect(SunzoraconString, function(err, client, done) {
		if(err) {
      		return console.error('Sunzora connection issue: ', err);
    	} else {
    		client.query('SELECT entry.text_details AS content, CAST(AVG(rating.selected_rating) AS DECIMAL(10,2)) AS score FROM public.rating, public.entry WHERE rating.entry_id = entry.entry_id AND entry.user_id = ' + uid + ' AND entry.contest_id = ' + cid + ' GROUP BY entry.text_details;', function(err, result) {
      			done();
      			if(err) {
          			console.log('error:', err);
		    		res.send({success: false});
      			} else {
		    		console.log(result.rows);
		    		res.send({success: true, entries: result.rows});
      			}
    		});
    	}
    });
}





/**
	Goal: Creates a new contest
	Parameters:
	{
		uid: 123,
		title: "This is my contest",
		description: "This is how the contest works",
		deadline: "1/31/2015 11:46:13",
	}
	Returns: nothing
	Notes:
	- Just returns a {success: true} if the object inserts correctly
	- Insert Contest
		INSERT INTO contest 
		VALUES (title, description,end_date,start_date);
*/

exports.createNewContest = function(req, res, next) {
	console.log(req.body);
	pg.connect(SunzoraconString, function(err, client, done) {
		if(err) {
      		return console.error('Sunzora connection issue: ', err);
    	} else {
    		var sql = "INSERT INTO contest (user_id, title, description, start_date, end_date) VALUES (\'" + req.body.uid + "\', \'" + req.body.title + "\', \'" + req.body.description + "\', now(), \'" + req.body.deadline + "\')";
    		console.log(sql);
    		client.query(sql, function(err, result) {
      			done();
      			if(err) {
          			console.log('error:', err);
          			res.send({success: false});
      			} else {
	    			console.log(result);
	    			res.send({success: true});
      			}
    		});
    	}
    });
}





/**
	Goal: Creates a new entry for a particular contest
	Parameters:
	{
		uid: 123,
		cid: 456,
		content: "This is an entry"
	}
	Returns: nothing
	Notes:
	- Just returns a {success: true} if the object inserts correctly
*/
exports.createEntry = function(req, res, next) {
	console.log(req.body);
	pg.connect(SunzoraconString, function(err, client, done) {
		if(err) {
      		return console.error('Sunzora connection issue: ', err);
    	} else {
    		var sql = "INSERT INTO entry (contest_id, user_id, text_details) VALUES (\'" + req.body.cid + "\', \'" + req.body.uid + "\', \'" + req.body.content + "\')";
    		console.log(sql);
    		client.query(sql, function(err, result) {
      			done();
      			if(err) {
          			console.log('error:', err);
          			res.send({success: false});
      			} else {
    				res.send({success: true});
      			}
      		});
    	}
    });
}





/**
	Goal: Gets a random entry that the user has not yet rated
	Parameters:
	{
		uid: 1,
		cid: 2,
		previous: [23,53,63,61]
	}
	Returns:
	{
		eid: 6
		title: "This is an entry",
		rating: null
	}
	Notes:
	- if no such entry, return {success: false}
*/
exports.randomEntryByUserIdAndContestId = function(req, res, next) {

	//var uid = req.param("uid");
	var uid = req.body.uid;
	//var cid = req.param("cid");
	var cid = req.body.cid;
	var previous = req.body.previous;

	pg.connect(SunzoraconString, function(err, client, done) {
		if(err) {
      		return console.error('Sunzora connection issue: ', err);
    	} else {
    		var sql = 'SELECT entry.entry_id AS eid, entry.text_details AS content FROM public.entry WHERE contest_id = ' + cid + ' AND entry_id NOT IN (SELECT entry.entry_id FROM public.rating, public.entry WHERE rating.user_id = ' + uid + ' AND rating.entry_id = entry.entry_id) AND entry_id NOT IN (SELECT entry.entry_id FROM public.entry WHERE entry.entry_id = ANY($1::int[])) ORDER BY random() LIMIT 1;'
    		console.log(sql);
    		client.query(sql, [previous], function(err, result) {
      			done();
      			if(err) {
          			console.log('error:', err);
 		    		res.send({success: false});
      			} else {
		    		console.log(result.rows);
		    		res.send({success: true, entry: result.rows[0]});
      			}
    		});
    	}
    });
}




/**
	Goal: Adds a rating by a particular user to a particular entry
	Parameters:
	{
		uid: 123,
		eid: 456,
		rating: 6
	}
	Returns: nothing
	Notes:
	- Trickier than it looks; if there is already a rating by this user for this entry, update.  If not, insert.  (In mongo, there is an action called "upsert" for things like this, but not in SQL)
	- Use more than one query if you need to for the prototype.
	- Postgres may have a system for transactions with conditions for things like this, and that would be useful to know, but give that a low priority to the easy solution.

	Identify if rating exists

*/
exports.addRating = function(req, res, next) {
	console.log(req.body);
	pg.connect(SunzoraconString, function(err, client, done) {
		if(err) {
      		return console.error('Sunzora connection issue: ', err);
    	} else {
    		var sql = 'SELECT rating_upsert(' + req.body.eid + ', ' + req.body.uid + ', CAST(' + req.body.rating + ' AS INT2));';
    		console.log(sql);
    		client.query(sql, function(err, result) {
      			done();
      			if(err) {
          			console.log('error:', err);
					res.send({success: false});
      			} else {
		    		console.log(result.rows);
		    		res.send({success: true});
      			}
    		});
    	}
    });
}




/**
	Goal: Gets the entries for a contest, ordered by average score descending
	Parameters: req.param("cid")
	Returns: entries =
	[
		{
			content: "Entry 1",
			score: 8.4
		},
		{
			content: "Entry 2",
			score: 7.6
		}
	]
	Notes:
	- Grab text details for contest and user
		SELECT entry.text_details, AVG(rating.selected_rating) FROM public.rating, public.entry WHERE rating.entry_id = entry.entry_id AND entry.contest_id = cid GROUP BY entry.text_details;	
*/
exports.getResultsByContest = function(req, res, next) {
	var cid = req.param("cid");
	pg.connect(SunzoraconString, function(err, client, done) {
		if(err) {
      		return console.error('Sunzora connection issue: ', err);
    	} else {
    		var sql = 'SELECT entry.text_details AS content, CAST(AVG(rating.selected_rating) AS DECIMAL(10,2)) AS score FROM public.rating, public.entry WHERE rating.entry_id = entry.entry_id AND entry.contest_id = ' + cid + ' GROUP BY entry.text_details;' 
    		client.query(sql, function(err, result) {
      			done();
      			if(err) {
          			console.log('error:', err);
          			res.send({success: false});
      			} else {
		    		console.log(result.rows);
		    		res.send({success: true, entries: result.rows});
      			}
    		});
    	}
    });
}
