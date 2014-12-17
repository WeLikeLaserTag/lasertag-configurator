LasertagConfigurator.service('LoggerService', ['$rootScope', function($rootScope) {

	function parseLog(str, type) {

		type = type || 'info';

		if(str.indexOf('aborting') !== -1) {
			type = 'error';
		}

		if(str.indexOf('avrdude done') !== -1) {
			type = 'success';
			str = 'Firmware upload complete';
		}

		console.log({
			data: str,
			type: type,
			time: new Date().getTime()
		});

		return {
			data: str,
			type: type,
			time: new Date().getTime()
		}
	}

	function logger() {
		var log = [];
		return Object.freeze({
			fill: function(str, type) {
				var data = parseLog(str, type);
				log.push(data);
				if(!$rootScope.$$phase) $rootScope.$apply();
			},
			get: function() {
				return log;
			}
		});
	}

	return logger();
}]);