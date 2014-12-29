console.log("loaded: sunzora controllers");

angular
	.module('sun')

	.controller('SunzoraCtrl', ['$scope', function($scope) {
		console.log('SunzoraCtrl loaded');
	}])

	.controller('SunzoraRootCtrl', ['$scope', '$state', function($scope, $state) {
		$state.go('contests.list');
	}])

	.controller('LoginCtrl', ['$scope', '$state', '$rootScope', 'SunzoraFactory', function($scope, $state, $rootScope, SunzoraFactory) {
		$scope.email = "mark.karavan@gmail.com";
		$scope.password = "mark";
		$scope.submit = function() {
			console.log("sub");
			var postData = {};
			postData.email = $scope.email;
			postData.password = $scope.password;
			SunzoraFactory.login(postData)
				.then(function(response) {
					if (response.success == true) {
						$rootScope.currentUser = response.user;
						$state.go('contests.list');
					} else {
						console.log("fail");
					}
				})
		};
	}])

	.controller('LogoutCtrl', ['$scope', function($scope) {
		console.log('LogoutCtrl loaded');
	}])

	.controller('ContestListCtrl', ['$scope', 'SunzoraFactory', function($scope, SunzoraFactory) {
		$scope.foo = "this is foo";
		SunzoraFactory.getAllContests()
			.then(function(response) {
				if (response.success == true) {
					$scope.contests = response.contests;
				}
			})
	}])

	.controller('ContestDetailsCtrl', ['$scope', '$stateParams', 'SunzoraFactory', function($scope, $stateParams, SunzoraFactory) {
		SunzoraFactory.getContestById($stateParams.id)
			.then(function(response){
				if (response.success == true) {
					console.log(response.contest);
					$scope.contest = response.contest;
				}
			})
		SunzoraFactory.getEntriesAndScoresByContestId($stateParams.id)
			.then(function(response){
				if (response.success == true) {
					$scope.entries = response.entries;
				}
			})
	}])

	.controller('ContestCreateCtrl', ['$scope', '$state', 'SunzoraFactory', function($scope, $state, SunzoraFactory) {
		$scope.ctitle = "My contest"; // calling it ctitle to avoid collisions with top level title
		$scope.description = "this be the desc of my contest";
		$scope.deadline = "1/1/2011";
		$scope.submit = function() {
			var postData = {};
			postData.title = $scope.ctitle;
			postData.description = $scope.description;
			postData.deadline = $scope.deadline;
			SunzoraFactory.createContest(postData)
				.then(function(response) {
					if (response.success == true) {
						$state.go("contests.list")
					}
				})
		}
	}])

	.controller('ContestAddEntryCtrl', ['$scope', '$stateParams', 'SunzoraFactory', function($scope, $stateParams, SunzoraFactory) {
		SunzoraFactory.getContestById($stateParams.id)
			.then(function(response){
				if (response.success == true) {
					$scope.contest = response.contest;
				}
			})
	}])

	.controller('ContestJudgeCtrl', ['$scope', function($scope) {
		console.log('ContestJudgeCtrl loaded');
	}])

	.controller('ContestResultsCtrl', ['$scope', function($scope) {
		console.log('ContestResultsCtrl loaded');
	}])

	.controller('AboutCtrl', ['$scope', function($scope) {
		console.log('AboutCtrl loaded');
	}])