var api = require('../controllers/sunzora');

module.exports = function(app) {

	app.post('/api/login' 					, api.login);
	app.post('/api/logout' 					, api.logout);
	app.get('/api/contests'					, api.getAllContests);
	app.get('/api/contestsActive'			, api.getAllActiveContests);
	app.get('/api/contestsComplete'			, api.getAllCompletedContests);
	app.get('/api/contests/:cid'			, api.getContestById);
	app.get('/api/entriesAndScores/:uid/:cid'	, api.getEntriesAndScoresByUserIdAndContestId);
	app.post('/api/user'  					, api.createUser);
	app.post('/api/contests'				, api.createNewContest);
	app.post('/api/entry' 					, api.createEntry);
	app.post('/api/randomEntryByUserIdAndContestId/', api.randomEntryByUserIdAndContestId);
	app.post('/api/addRating' 				, api.addRating);
	app.get('/api/resultsByContest/:cid' 		, api.getResultsByContest);

	app.get('/views/*', function(req, res) {
		var file = req.params[0];
		res.render('../../public/app/views/' + file);
	});

	//render layout
	app.get('*', function(req, res) {
		var currentUser = {};
		console.log("req.user=");
		console.log(req.user);
		if(req.user) {
			currentUser = {
				  id: req.user.id
				, email: req.user.email
				, permissions: req.user.permissions
			}
		}
		res.render('layout', {
			currentUser: currentUser
		});
	});

}







