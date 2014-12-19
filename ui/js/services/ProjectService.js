LasertagConfigurator.service('ProjectService', ['$rootScope', 'DataStoreService', function($rootScope, DataStoreService) {

	var store = DataStoreService.get('projects');

	return {
		create: function(name, path) {
			return store.create({
				name: name,
				path: path
			}, path);
		},
		getAll: store.getAll,
		remove: store.remove
	};
}]);