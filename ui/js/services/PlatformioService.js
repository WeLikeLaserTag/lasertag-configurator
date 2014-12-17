LasertagConfigurator.service('PlatformioService', ['LoggerService', function(LoggerService) {

	var pio = require('./modules/platformio.js')({
		debug: true
	});

	return Object.freeze({
		build: function(name, path, ports, done) {
			done = done || function() {};
			LoggerService.fill('Building for devices: ' + ports.map(function(port) {
				return port.name;
			}).join(' '));
			LoggerService.fill('Cloning source files to temp folder..');
			console.log(arguments);
			// copy source project files to tmp folder
			pio.copyProjectFiles(name, path, function(success) {

				if(!success) {
					return LoggerService.fill('Cloning of source files failed', 'error');
				}

				LoggerService.fill('Cloning of source files complete', 'success');

				// build ini environment file for platformio
				LoggerService.fill('Creating environment config file');
				pio.createIniFile(name, ports);

				LoggerService.fill('Compiling..');
				// compile the code
				var proc = pio.compile(name);

				// send compile output to logger
				proc.on('line', function(line) {
					//LoggerService.fill(line);
				});
				proc.on('error', function(line) {
					LoggerService.fill(line, 'error');
				});

				proc.on('success', function() {
					LoggerService.fill('Build complete', 'success');
					done();
				});

			});
		},
		upload: function(name) {
			var proc = pio.upload(name);
			proc.on('line', function(line) {
				LoggerService.fill(line);
			});
			proc.on('error', function(line) {
				LoggerService.fill(line, 'error');
			});
		}
	});
}]);