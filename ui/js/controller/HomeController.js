LasertagConfigurator.controller('HomeController', ['$scope', 'FeedService', function($scope, FeedService) {

	var gui = require('nw.gui');

	$scope.posts = FeedService.get();

	$scope.menu = [
		{
			name: 'Configurator',
			icon: 'fa-wrench',
			sref: 'configurator'
		}, {
			name: 'Developer',
			icon: 'fa-code',
			sref: 'developer'
		}
	];

	$scope.openInBrowser = function(link) {
		gui.Shell.openExternal(link);
	};

}]);