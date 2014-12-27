console.log("loaded: sunzora controllers");

angular
	.module('sun')

	.controller('SunzoraCtrl', ['$scope', function($scope){
		console.log('SunzoraCtrl loaded...');
	}])