LasertagConfigurator.filter('positiveNegative', [function() {
	return function(num) {
		if(typeof num === 'boolean') {
			if(num) return 'enabled';
			if(!num) return 'disabled';
		}
		if(num == 0) {
			return 0;
		}
		if(num > 0) {
			return '+' + num;
		}
		return num;
	}
}]);