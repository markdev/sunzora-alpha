exports.getAllContests =  function(req, res, next) {
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