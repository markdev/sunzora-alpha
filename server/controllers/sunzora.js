var passport 	= require('passport');

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

exports.logout = function(req, res, next) {
	req.logout();
	res.end();
}

exports.getAllContests =  function(req, res, next) {
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
		}
	];
	res.send({success: true, contests: contests});
}

exports.getContestById  = function(req, res, next) {
	var contest = {
			id: 1, 
			title: "this is a contest",
			description: "Enter suggestions for how to use this thing and blah blah"
		};
	res.send({success: true, contest: contest});
}

exports.getEntriesAndScoresByContestId = function(req, res, next) {
	var entries = [
			{ content: "Use it to make more xontests about how to use it", score: 3.4 },
			{ content: "Make group decisions in the Fire Triangle", score: 5.4 },
			{ content: "American Idol style contests for different street performers", score: 7.3 },
			{ content: "Heebie jeebies", score: 7.3 }
		];
	res.send({success: true, entries: entries});
}

exports.createNewContest = function(req, res, next) {
	console.log(req.body);
	res.send({success: true});
}

exports.createEntry = function(req, res, next) {
	console.log(req.body);
	res.send({success: true});
}

exports.randomEntryByContestId = function(req, res, next) {
	console.log(req.param("id"));
	var entry = { title: "This shit was dynamically generated", rating: null };
	res.send({success: true, entry: entry});
}

exports.addRating = function(req, res, next) {
	console.log(req.body);
	res.send({success: true});
}

exports.getResultsByContest = function(req, res, next) {
	console.log("Here I am");
	var entries = [
			{ content: "American Idol style contests for different street performers", score: 7.3 },
			{ content: "Make group decisions in the Fire Triangle", score: 5.4 },
			{ content: "Use it to make more xontests about how to use it", score: 3.4 }
		];
	res.send({success: true, entries: entries});
}
