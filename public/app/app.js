'use strict'

console.log("Angular application loaded");

angular
	.module('sun', [
		// add in custom dependencies here
		  'ngRoute'
		, 'ngTouch'
		, 'ui.router'
		, 'facebook'
	])
	.config([
		'FacebookProvider',
		function(FacebookProvider) {
			var myAppId = '385531211607503';

			// You can set appId with setApp method
			// FacebookProvider.setAppId('myAppId');

			/**
			* After setting appId you need to initialize the module.
			* You can pass the appId on the init method as a shortcut too.
			*/
			FacebookProvider.init(myAppId);

		}	
	])
	.run(function($rootScope) {
		$rootScope.currentUser = window.currentUser;
		console.log("Current user");
		console.log($rootScope.currentUser);
        // this is a hacky way to do a redirect, but $state.go() doesn't work for some reason
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if ((jQuery.isEmptyObject($rootScope.currentUser) || $rootScope.currentUser.email == undefined) && toState.name != 'login' && toState.name != 'signup') {
                window.location.replace('/login');
            }
        })
	})

// end file
;
