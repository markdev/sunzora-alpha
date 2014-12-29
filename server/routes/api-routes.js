var api = require('../controllers/sunzora');

module.exports = function(app) {

	app.post('/api/login' 					, api.login);
	app.get('/api/contests'					, api.getAllContests);
	app.get('/api/contests/:id?'			, api.getContestById);
	app.get('/api/entriesAndScores/:id?'	, api.getEntriesAndScoresByContestId);
	app.post('/api/contests'				, api.createNewContest);

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

}




