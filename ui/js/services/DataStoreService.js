LasertagConfigurator.service('DataStoreService', ['$rootScope', 'pouchdb', function($rootScope, pouchdb) {

	var stores = {};

	function dataStore(dbName) {

		var db = pouchdb.create(dbName);
		var docs = [];

		function fill() {
			db.allDocs({include_docs: true}, function(err, data) {
				if(docs.length !== 0) {
					docs.length = 0;
				}
				data.rows.forEach(function(row) {
					docs.push(row.doc);
				});
			});
		}

		fill();

		return Object.freeze({
			create: function(doc, id) {
				db.put(doc, id).then(function() {
					fill();
				});
				return docs;
			},
			getAll: function() {
				fill();
				return docs;
			},
			remove: function(doc) {
				db.remove(doc, function() {
					fill();
				});
				return docs;
			}
		});
	}

	return {
		get: function(dbName) {
			if(!stores[dbName]) {
				stores[dbName] = dataStore(dbName);
			}

			return stores[dbName];
		}
	}
}]);