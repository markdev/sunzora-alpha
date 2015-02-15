console.log("loaded: sunzora module");

// Insert modules here
// Original model only used this for CSS and the custom player

angular
	.module('sun')

	.config( ['$routeProvider', function($routeProvider) {
		console.log("configuring angular module");
	}] )
/*
	.run( function($rootScope, $location) {
		// register listener to watch route changes
		$rootScope.$on( "$routeChangeStart", function(event, next, current) {
			if ( $rootScope.loggedUser == null ) {
			// no logged user, we should be going to #login
				if ( next.templateUrl == "partials/login.html" ) {
					// already going to #login, no redirect needed
				} else {
					// not going to #login, we should redirect now
					$location.path( "/login" );
				}
			}         
		});
	})
*/
	;
