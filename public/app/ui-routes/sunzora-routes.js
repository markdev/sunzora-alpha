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
				, controller: function($scope){
					$scope.title = 'home';
				}
			})

	// end state config
	})

	// end file
	;