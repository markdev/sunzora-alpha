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
		$scope.password = "pass4321";
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

	.controller('ContestNavCtrl', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {
		// because dynamic ui-srefs don't work.  Angular sucks
		$scope.goToDetails = function () {
			$state.go("contests.details", { id: $stateParams.id } );
		}
		$scope.goToJudge = function () {
			$state.go("contests.judge", { id: $stateParams.id } );			
		}
		$scope.goToAddEntry = function () {
			$state.go("contests.addEntry", { id: $stateParams.id } );			
		}
	}])

	.controller('ContestListCtrl', ['$scope', '$state', '$rootScope', 'SunzoraFactory', function($scope, $state, $rootScope, SunzoraFactory) {
		$scope.canCreate = ($rootScope.currentUser.permissions.indexOf('create_contest') > -1)? true : false;
		$scope.go = function () {
			console.log("bang bang");
		}
		SunzoraFactory.getAllActiveContests()
			.then(function(response) {
				if (response.success == true) {
					$scope.activeContests = response.contests;
					console.log($scope.activeContests);
				}
			})
		SunzoraFactory.getAllCompletedContests()
			.then(function(response) {
				if (response.success == true) {
					$scope.completedContests = response.contests;
				}
			})
	}])

	.controller('ContestDetailsCtrl', ['$scope', '$rootScope', '$stateParams', 'SunzoraFactory', function($scope, $rootScope, $stateParams, SunzoraFactory) {
		SunzoraFactory.getContestById($stateParams.id)
			.then(function(response){
				if (response.success == true) {
					$scope.contest = response.contest;
				}
			})
		SunzoraFactory.getEntriesAndScoresByContestId($rootScope.currentUser.id, $stateParams.id)
			.then(function(response){
				console.log(response);
				if (response.success == true) {
					console.log("here be the entries");
					$scope.entries = response.entries;
				}
			})
	}])

	.controller('ContestCreateCtrl', ['$scope', '$state', 'SunzoraFactory', function($scope, $state, SunzoraFactory) {
		$scope.ctitle = "My contest"; // calling it ctitle to avoid collisions with top level title
		$scope.description = "this be the desc of my contest";

		$scope.months = [ {name: "Jan", num: 1}, {name: "Feb", num: 2}, {name: "Mar", num: 3}, {name: "Apr", num: 4}, {name: "May", num: 5}, {name: "Jun", num: 6}, {name: "Jul", num: 7}, {name: "Aug", num: 8}, {name: "Sep", num: 9}, {name: "Oct", num: 10}, {name: "Nov", num: 11}, {name: "Dec", num: 12} ];
		$scope.myMonth = $scope.months[0];
		$scope.days = [ {name: "1"}, {name: "2"}, {name: "3"}, {name: "4"}, {name: "5"}, {name: "6"}, {name: "7"}, {name: "8"}, {name: "9"}, {name: "10"}, {name: "11"}, {name: "12"}, {name: "13"}, {name: "14"}, {name: "15"}, {name: "16"}, {name: "17"}, {name: "18"}, {name: "19"}, {name: "20"}, {name: "21"}, {name: "22"}, {name: "23"}, {name: "24"}, {name: "25"}, {name: "26"}, {name: "27"}, {name: "28"}, {name: "29"}, {name: "30"}, {name: "31"} ];
		$scope.myDay = $scope.days[0];
		$scope.years = [{name: "2014"}, {name: "2015"}, {name: "2016"}];
		$scope.myYear = $scope.years[0];
		$scope.hours = [ {name: "00"}, {name: "01"}, {name: "02"}, {name: "03"}, {name: "04"}, {name: "05"}, {name: "06"}, {name: "07"}, {name: "08"}, {name: "09"}, {name: "10"}, {name: "11"}, {name: "12"}, {name: "13"}, {name: "14"}, {name: "15"}, {name: "16"}, {name: "17"}, {name: "18"}, {name: "19"}, {name: "20"}, {name: "21"}, {name: "22"}, {name: "23"} ];
		$scope.myHour = $scope.hours[0];
		$scope.minutes = [ {name: "00"}, {name: "05"}, {name: "10"}, {name: "15"}, {name: "20"}, {name: "25"}, {name: "30"}, {name: "35"}, {name: "40"}, {name: "45"},{name: "50"},{name: "55"} ];
		$scope.myMinute = $scope.minutes[0];

		$scope.deadline = $scope.myYear;
	
		$scope.submit = function() {
			var yyyy = $scope.myYear.name;
			var mm = $scope.myMonth.num;
			var dd = $scope.myDay.name;
			var hh = $scope.myHour.name;
			var min = $scope.myMinute.name;

			var timestamp = yyyy + "-" + mm + "-" + dd + " " + hh + ":" + min + ":00-05";

			var postData = {};
			postData.deadline = timestamp;
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

	.controller('ContestAddEntryCtrl', ['$scope', '$state', '$rootScope', '$stateParams', 'SunzoraFactory', function($scope, $state, $rootScope, $stateParams, SunzoraFactory) {
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
			postData.cid = $stateParams.id;
			postData.uid = $rootScope.currentUser.id;
			SunzoraFactory.createEntry(postData)
				.then(function(response) {
					if (response.success == true) {
						$state.go("contests.details", { id: $stateParams.id } );
					}
				})
		};
	}])

	.controller('ContestJudgeCtrl', ['$scope', '$rootScope', '$stateParams', 'SunzoraFactory', function($scope, $rootScope, $stateParams, SunzoraFactory) {
		SunzoraFactory.getContestById($stateParams.id)
			.then(function(response){
				if (response.success == true) {
					$scope.contest = response.contest;
				}
			})
		$scope.current = 0;
		$scope.first = true;
		$scope.last = null;
		$scope.entries = [];
		var adjustButtons = function() {
			$scope.first = ($scope.current == 0)?  true : false;
			$scope.last = ($scope.current == ($scope.entries.length-1))? true : false;
		}
		var getNewEntry = function() {
			SunzoraFactory.getNewEntry($rootScope.currentUser.id, $stateParams.id)
				.then(function(response) {
					if (response.success) {
						console.log(response);
						$scope.entries[$scope.entries.length] = {
							id: response.entry.eid,
							title: response.entry.content,
							rating: null	
						};
					} 
				})
		}
		//initialize with the first entry
		getNewEntry();
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
		$scope.rateThis = function(score) {
			var postData = {};
			console.log($scope.entries);
			postData.uid = $rootScope.currentUser.id;
			postData.rating = score;
			postData.eid = $scope.entries[$scope.current].id;
			SunzoraFactory.addRating(postData)
				.then(function(response) {
					$scope.entries[$scope.current].rating = score;
				})
		}	
	}])

	.controller('ContestResultsCtrl', ['$scope', '$stateParams', 'SunzoraFactory', function($scope, $stateParams, SunzoraFactory) {
		SunzoraFactory.getContestById($stateParams.id)
			.then(function(response){
				if (response.success == true) {
					console.log(response.contest);
					$scope.contest = response.contest;
				}
			})
		SunzoraFactory.getResultsByContestId($stateParams.id)
			.then(function(response){
				if (response.success == true) {
					$scope.entries = response.entries;
				}
			})
	}])

	.controller('AboutCtrl', ['$scope', function($scope) {
		// this is probably going to be static text
	}])