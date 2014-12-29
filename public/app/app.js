'use strict'

console.log("Angular application loaded");

angular
	.module('sun', [
		// add in custom dependencies here
		  'ngRoute'
		, 'ngTouch'
		, 'ui.router'
	])
	.run(function($rootScope) {
		$rootScope.currentUser = window.currentUser;
		console.log($rootScope.currentUser);
        // this is a hacky way to do a redirect, but $state.go() doesn't work for some reason
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if (jQuery.isEmptyObject($rootScope.currentUser) && toState.name != 'login' && toState.name != 'signup') {
                window.location.replace('/login');
            }
        })
	})

// end file
;