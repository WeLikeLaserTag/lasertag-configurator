LasertagConfigurator.directive('logger', [function() {
	return {
		templateUrl: 'ui/templates/directives/logger.html',
		restrict: 'E',
		scope: {
			'log': '='
		},
		link: function() {

		}
	}
}]);