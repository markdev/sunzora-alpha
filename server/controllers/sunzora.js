var passport 	= require('passport')
 , pg   		= require('pg')
 ;

var config = require('./server/config')
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
	console.log(req.body);
	req.body.email = req.body.email.toLowerCase();
	passport.authenticate('local', function(err, user) {
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
	var contests = [
		{ 
			id: 1,
			title: "How should we use sunzora??????",
			deadline: "Feb 2, 2015",
			completed: false
		},
		{ 
			id: 2,
			title: "HHow can sunzora make money?",
			deadline: "January 15, 2015",
			completed: false
		},
		{ 
			id: 3,
			title: "What's the first thing sunzora should do?",
			deadline: "Feb 3, 2015",
			completed: true
		},
	];

	res.send({success: true, contests: contests});
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
	var contests = [
		{ 
			id: 1,
			title: "How should we use sunzora??",
			deadline: "Feb 1, 2015",
			completed: false
		},
		{ 
			id: 2,
			title: "HHow can sunzora make money?",
			deadline: "January 15, 2015",
			completed: false
		},
		{ 
			id: 3,
			title: "What's the first thing sunzora should do?",
			deadline: "Feb 3, 2015",
			completed: true
		},
	];

		pg.connect(config.postgresconString, function(err, client, done) {
		if(err) {
      		return console.error('Sunzora connection issue: ', err);
    	}
    		client.query('SELECT * FROM public.contest;', function(err, result) {
      			done();

      			if(err) {
          			console.log('error:', err);
      			}
     
    		console.log(result.rows);
    		});
    });

	res.send({success: true, contests: contests});
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
	var contests = [
		{ 
			id: 1,
			title: "How should we use sunzora?",
			deadline: "Feb 1, 2015",
			completed: false
		},
		{ 
			id: 2,
			title: "HHow can sunzora make money?",
			deadline: "January 15, 2015",
			completed: false
		},
		{ 
			id: 3,
			title: "What's the first thing sunzora should do?",
			deadline: "Feb 3, 2015",
			completed: true
		},
	];
	res.send({success: true, contests: contests});
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
	console.log("cid: " + cid);
	var contest = {
			id: 1, 
			title: "this is a contest",
			description: "Enter suggestions for how to use this thing and blah blah"
		};
	res.send({success: true, contest: contest});
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
*/
exports.getEntriesAndScoresByUserIdAndContestId = function(req, res, next) {
	var uid = req.param("uid");
	var cid = req.param("cid");
	console.log(uid + " " + cid);
	var entries = [
			{ content: "Use it to make more xontests about how to use it", score: 3.4 },
			{ content: "Make group decisions in the Fire Triangle", score: 5.4 },
			{ content: "American Idol style contests for different street performers", score: 7.3 },
			{ content: "Heebie jeebies", score: 7.3 }
		];
	res.send({success: true, entries: entries});
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
*/
exports.createNewContest = function(req, res, next) {
	console.log(req.body);
	res.send({success: true});
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
	res.send({success: true});
}




/**
	Goal: Gets a random entry that the user has not yet rated
	Parameters: req.param('uid'), req.param('cid')
	Returns:
	{
		title: "This is an entry",
		rating: null
	}
	Notes:
	- if no such entry, return {success: false}
*/
exports.randomEntryByUserIdAndContestId = function(req, res, next) {
	var uid = req.param("uid");
	var cid = req.param("cid");
	console.log(uid + " " + cid);
	var entry = { title: "This shit was dynamically generated", rating: null };
	res.send({success: true, entry: entry});
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
*/
exports.addRating = function(req, res, next) {
	res.send({success: true});
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
*/
exports.getResultsByContest = function(req, res, next) {
	var cid = req.param("cid");
	console.log("cid: " + cid);
	var entries = [
			{ content: "American Idol style contests for different street performers", score: 7.3 },
			{ content: "Make group decisions in the Fire Triangle", score: 5.4 },
			{ content: "Use it to make more xontests about how to use it", score: 3.4 }
		];
	res.send({success: true, entries: entries});
}
