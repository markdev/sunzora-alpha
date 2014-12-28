console.log("loaded: sunzora services");

'use strict'
// this will probably be useful for authentication:
// http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication
angular
	.module('sun')

	.factory('SunzoraFactory', ['$http', '$q', function($http, $q) {

		var urlBase = "/api/users/login"
		var SunzoraFactory = {};

		SunzoraFactory.getAllContests = function() {
			console.log("Getting contests");
			var deferred = $q.defer();
			$http.get("/api/contests")
				.success(function(contests) {
					deferred.resolve(contests)
				})
			return deferred.promise;
		}

		SunzoraFactory.createContest = function(postData) {
			console.log("Getting contests");
			var deferred = $q.defer();
			$http.post("/api/contests", postData)
				.success(function(response) {
					deferred.resolve(response)
				})
			return deferred.promise;
		}

		/*
		SunzoraFactory.test = function() {
			return "this came from the sunzora factory";
		}

		SunzoraFactory.getCurrentUser = function() {
			var currentUser = window.currentUser;
			return currentUser;
		}

		SunzoraFactory.submit = function(postData) {
			console.log("Submit email and password to login");
			var deferred = $q.defer();
			$http.post(urlBase, postData)
				.success(function(data){
					console.log(data);
				})
		}

		SunzoraFactory.logout = function() {
			console.log("Logging out the user");
			var deferred = $q.defer();
			$http.post("/api/users/logout")
				.success(function(data){
					console.log(data);
				})
		}
		*/

		return SunzoraFactory;
	}])
	;