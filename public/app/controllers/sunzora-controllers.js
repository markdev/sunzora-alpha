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
		$scope.submit();
	}])

	.controller('LogoutCtrl', ['$scope', '$rootScope', '$state', 'SunzoraFactory', function($scope, $rootScope, $state, SunzoraFactory) {
		SunzoraFactory.logout()
			.then(function(data) {
				$rootScope.currentUser = {};
				$state.go('login');
			})
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

	.controller('ContestAddEntryCtrl', ['$scope', '$state', '$stateParams', 'SunzoraFactory', function($scope, $state, $stateParams, SunzoraFactory) {
		$scope.content = "This is the entry";
		SunzoraFactory.getContestById($stateParams.id)
			.then(function(response){
				if (response.success == true) {
					$scope.contest = response.contest;
				}
			})
		$scope.submit = function() {
			console.log("submitting");
			var postData = {};
			postData.content = $scope.content;
			postData.contest = $stateParams.id;
			SunzoraFactory.createEntry(postData)
				.then(function(response) {
					if (response.success == true) {
						$state.go("contests.details", { id: $stateParams.id } );
					}
				})
		};
	}])

	.controller('ContestJudgeCtrl', ['$scope', '$stateParams', 'SunzoraFactory', function($scope, $stateParams, SunzoraFactory) {
		SunzoraFactory.getContestById($stateParams.id)
			.then(function(response){
				if (response.success == true) {
					$scope.contest = response.contest;
				}
			})
		$scope.current = 0;
		$scope.first = true;
		$scope.last = null;
		$scope.entries = [
			{ title: "This is the first entry", rating: null },
			{ title: "This is the second entry", rating: null },
			{ title: "This is the third entry", rating: null },
			{ title: "This is the fourth entry", rating: null },
			{ title: "This is the fifth entry", rating: null }
		];
		var adjustButtons = function() {
			$scope.first = ($scope.current == 0)?  true : false;
			$scope.last = ($scope.current == ($scope.entries.length-1))? true : false;
		}
		var getNewEntry = function() {
			SunzoraFactory.getNewEntry($stateParams.id)
				.then(function(response) {
					if (response.success) {
						$scope.entries[$scope.entries.length] = response.entry;
					} 
				})
		}
		$scope.slideLeft = function() {
			$scope.current -= 1;
			adjustButtons();
		}
		$scope.slideRight = function() {
			$scope.current += 1;
			if ($scope.entries.length - $scope.current < 3) {
				getNewEntry();
			}
			adjustButtons();
		}

		console.log($scope.entries.length);		
	}])

	.controller('ContestResultsCtrl', ['$scope', function($scope) {
		console.log('ContestResultsCtrl loaded');
	}])

	.controller('AboutCtrl', ['$scope', function($scope) {
		console.log('AboutCtrl loaded');
	}])