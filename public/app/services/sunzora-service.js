console.log("loaded: sunzora services");

'use strict'
// this will probably be useful for authentication:
// http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication
angular
	.module('sun')

	.factory('SunzoraFactory', ['$http', '$q', function($http, $q) {

		var urlBase = "/api/users/login"
		var SunzoraFactory = {};

		SunzoraFactory.login = function(postData) {
			var deferred = $q.defer();
			console.log("postdata from factory");
			console.log(postData);
			$http.post("/api/login", postData)
				.success(function(response) {
					if (response.success) {
						deferred.resolve(response);
					} else {
						deferred.resolve(response);
					}
				})
				.error(function(err, user) {
					deferred.resolve(err);
				});
			return deferred.promise;		
		}

		SunzoraFactory.logout = function() {
			var deferred = $q.defer();
			$http.post("/api/logout")
				.success(function(response){
					console.log(response);
					deferred.resolve(response);
				})
			return deferred.promise;			
		}

		SunzoraFactory.getAllContests = function() {
			var deferred = $q.defer();
			$http.get("/api/contests")
				.success(function(contests) {
					deferred.resolve(contests)
				})
			return deferred.promise;
		}

		SunzoraFactory.createContest = function(postData) {
			var deferred = $q.defer();
			$http.post("/api/contests", postData)
				.success(function(response) {
					deferred.resolve(response)
				})
			return deferred.promise;
		}

		SunzoraFactory.getContestById = function(id) {
			var deferred = $q.defer();
			$http.get("/api/contests/" + id)
				.success(function(contest) {
					deferred.resolve(contest)					
				})
			return deferred.promise;
		}

		SunzoraFactory.getEntriesAndScoresByContestId = function(id) {
			var deferred = $q.defer();
			$http.get("/api/entriesAndScores/" + id)
				.success(function(response) {
					deferred.resolve(response)					
				})
			return deferred.promise;
		}

		SunzoraFactory.createEntry = function(postData) {
			var deferred = $q.defer();
			$http.post("/api/entry", postData)
				.success(function(response) {
					deferred.resolve(response)					
				})
			return deferred.promise;
		}

		SunzoraFactory.getNewEntry = function(contestId) {
			var deferred = $q.defer();
			$http.get("/api/randomEntryByContestId/" + contestId)
				.success(function(response) {
					deferred.resolve(response)					
				})
			return deferred.promise;
		}

		SunzoraFactory.addRating = function(postData) {
			var deferred = $q.defer();
			$http.post("/api/addRating", postData)
				.success(function(response) {
					deferred.resolve(response)
				})
			return deferred.promise;
		}

		SunzoraFactory.getResultsByContestId = function(id) {
			var deferred = $q.defer();
			$http.get("/api/resultsByContest/" + id)
				.success(function(response) {
					deferred.resolve(response)					
				})
			return deferred.promise;
		}


		return SunzoraFactory;
	}])
	;