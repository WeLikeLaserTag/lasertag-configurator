var LasertagConfigurator = angular.module('LasertagConfigurator', ['pouchdb', 'ui.router']);

LasertagConfigurator.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	'use strict';

	$urlRouterProvider.otherwise('/home');

	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'ui/templates/home.html',
			controller: 'HomeController'
		})
		.state('developer', {
			url: '/developer',
			templateUrl: 'ui/templates/developer.html',
			controller: 'DeviceController'
		})
		.state('configurator', {
			url: '/configurator',
			templateUrl: 'ui/templates/configurator.html',
			controller: 'ConfiguratorController'
		})
}]);

LasertagConfigurator.run(['$rootScope', 'ConfigStore', 'ProjectService', 'FeedService', 'pouchdb', function($rootScope, ConfigStore, ProjectService, FeedService, pouchdb) {

}]);