LasertagConfigurator.directive('folderPath', [function() {
	return {
		restrict: 'E',
		templateUrl: 'ui/templates/directives/folderPath.html',
		scope: {
			changed: '='
		},
		link: function($scope, element) {
			$(element).find('.directory-chooser').on('change', function() {
				$scope.changed($(this).val());
			});

			$scope.add = function() {
				$(element).find('.directory-chooser').click();
			}
		}
	}
}]);