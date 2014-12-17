LasertagConfigurator.service('ProjectService', ['$rootScope', 'pouchdb', function($rootScope, pouchdb) {
	var db = pouchdb.create('projects');

	var projects = [];

	function fill() {
		db.allDocs({include_docs: true}, function(err, data) {
			if(projects.length !== 0) {
				projects.length = 0;
			}
			data.rows.forEach(function(row) {
				projects.push(row.doc);
			});
		});
	}

	fill();

	return {
		create: function(name, path) {
			var that = this;
			db.put({
				name: name,
				path: path
			}, path).then(function() {
				fill();
			});
			return projects;
		},
		getAll: function() {
			fill();
			return projects;
		},
		remove: function(doc) {
			db.remove(doc, function() {
				fill();
			});
			return projects;
		}
	};
}]);