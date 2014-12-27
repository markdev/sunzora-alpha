console.log("loaded: sunzora controllers");

angular
	.module('sun')

	.controller('SunzoraCtrl', ['$scope', function($scope) {
		console.log('SunzoraCtrl loaded');
	}])

	.controller('LoginCtrl', ['$scope', function($scope) {
		console.log('LoginCtrl loaded');
	}])

	.controller('LogoutCtrl', ['$scope', function($scope) {
		console.log('LogoutCtrl loaded');
	}])

	.controller('ContestDetailsCtrl', ['$scope', function($scope) {
		console.log('ContestDetailsCtrl loaded');
	}])

	.controller('ContestCreateCtrl', ['$scope', function($scope) {
		console.log('ContestCreateCtrl loaded');
	}])

	.controller('ContestAddEntryCtrl', ['$scope', function($scope) {
		console.log('ContestAddEntryCtrl loaded');
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