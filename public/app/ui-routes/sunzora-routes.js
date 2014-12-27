console.log("loaded: sunzora routes");

angular
	.module('sun')

	.config(function($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider){
		console.log('loaded default router');
		
		//seems to get rid of the "#" in the url
		$locationProvider.html5Mode(true);

		// add a route to 404 page here
		$urlRouterProvider.otherwise('/');

		$stateProvider

			.state('root', {
				  abstract: true
				, url: '/'
				, templateUrl: '/views/default'
			})

			.state('root.home', {
				  url: ''
				, parent: 'root'
				, templateUrl: '/views/test'
			})

			// log in
			.state('login', {
				  url: '/login'
				, templateUrl: '/views/login'
				, controller: 'LoginCtrl'
			})

			// log out
			.state('logout', {
				  url: '/logout'
				, controller: 'LogoutCtrl'
			})

			// contests
			.state('contests', {
				  abstract: true
				, url: '/contest'
				, templateUrl: '/views/default'
				, controller: function($scope) {
					$scope.title = 'contests';
				}
			})

			// contests
			.state('contests.list', {
				  url: '/contest'
				, templateUrl: '/views/contestList'
				, controller: 'ContestListCtrl'
			})


			// contest details
			.state('contests.details', {
				  url: '/:id'
				, templateUrl: '/views/contestDetails'
				, controller: 'ContestDetailsCtrl'
			})

			// create new contest
			.state('contests.create', {
				  url: '/create'
				, templateUrl: '/views/createContest'
				, controller: 'ContestCreateCtrl'
			})

			// add entry
			.state('contests.addEntry', {
				  url: '/addEntry/:id'
				, templateUrl: '/views/addEntry'
				, controller: 'ContestAddEntryCtrl'
			})

			// judge contests
			.state('contests.judge', {
				  url: '/judge/:id'
				, templateUrl: '/views/judgeContest'
				, controller: 'ContestJudgeCtrl'
			})

			// contest results
			.state('contests.results', {
				  url: '/results/:id'
				, templateUrl: '/views/contestResults'
				, controller: 'ContestResultsCtrl'
			})

			// contests
			.state('about', {
				  abstract: true
				, url: '/about'
				, templateUrl: '/views/default'
				, controller: function($scope) {
					$scope.title = 'about';
				}
			})

			// about
			.state('about.sunzora', {
				  url: ''
				, templateUrl: '/views/about'
				, controller: 'AboutCtrl'
			})


	// end state config
	})

	// end file
	;