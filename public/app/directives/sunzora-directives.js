console.log("loaded: sunzora directives");

'use strict'

angular
	.module('sun')

	.directive("ngFileSelect", function() {    
		return {
			link: function($scope,el) {
				el.bind("change", function(e) {
					$scope.file = (e.srcElement || e.target).files[0];
					$scope.getFile();
				});
			}
		}
	})

	.directive('scroller', function ($rootScope, $compile, $interpolate) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.bind('scroll', function () {
					angular.forEach(angular.element('.imageFrame'), function(value, key) {
						var entry = angular.element(value);
						if (entry.position().left > 200 && entry.position().left < 560) {
							scope.callFocus(key);
							entry.addClass('active');
							$compile(entry)(scope);
						} else {
							if (entry.hasClass('active')) {
	                    		entry.removeClass('active');
	                    	}
						}
						scope.$apply();
					});
					var callLimit = 600;
					var lPos = element.find('td.entryCell').last().position().left;
					if (lPos < callLimit) {
						$rootScope.$broadcast('loadANewEntry');
					}
				});
			}
		};
	})

	.directive('entryTextFrame', function($compile, $rootScope) {
		return {
			restrict: 'E',
			scope: {
				entry: '=',
				callFocus: '&'
			},
			replace: true,
			template: '<div><div class="imageFrame"><p>{{entry.content}}</p></div></div>',
			link: function(scope, element, attrs) {
				element.bind("click", function() {
					console.log(element.position().left);
				})
				scope.$on('scrolling', function (event, result) {
					console.log("scrolling from directive");
				});
			},
			controller: function($scope) {
			}
		}
	})

	.directive('entryImageFrame', function($compile, $rootScope) {
		return {
			restrict: 'E',
			scope: {
				entry: '=',
				callFocus: '&'
			},
			replace: true,
			template: '<div><div class="imageFrame"><img ng-src="/api/entry/realContent/{{entry._id}}" /></div></div>',
			link: function(scope, element, attrs) {
				element.bind("click", function() {
					console.log(element.position().left);
				})
				scope.$on('scrolling', function (event, result) {
					console.log("scrolling from directive");
				});
			},
			controller: function($scope) {
			}
		}
	})

	.directive('rateButton', function() {
		return {
			restrict: 'E',
			scope: {
				value: '=',
				rate: '&',  // let's cycle through the options
				active: '@'
			},
			replace: true,
			template: '<div><div class="rateButton {{active}}" id="star{{value}}" ng-click="rate({{value}})">{{value}}</button></div>',
			link: function(scope, element, attrs) {
				scope.$on('markAsRated', function(event, data) {
					var testId = "star" + data.score;
					var button = element.find("button");
					if (button.attr('id') == testId) {
						console.log(testId);
						button.addClass('clicked');
					} else {
						button.removeClass('clicked')
					}
				})
			}
		}
	})
	;