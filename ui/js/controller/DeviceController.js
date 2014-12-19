LasertagConfigurator.controller('DeviceController', ['$scope', 'PlatformioService', 'LoggerService', '$timeout', 'ProjectService', 'ConfigStore', function($scope, PlatformioService, LoggerService, $timeout, ProjectService, ConfigStore) {

	$scope.setupWizardDone = ConfigStore.get('setupWizardDone');
	$scope.log = LoggerService.get();
	$scope.ports = [];
	$scope.projectFolder = '';
	$scope.projects = ProjectService.getAll();
	$scope.unknownPorts = {};

	$scope.boards = [
		{ name: 'Arduino Diecimila or Duemilanove (ATmega168)', type: 'diecimilaatmega168'},
		{ name: 'Arduino Diecimila or Duemilanove (ATmega328)', type: 'diecimilaatmega328'},
		{ name: 'Arduino Fio', type: 'fio'},
		{ name: 'Arduino Leonardo', type: 'leonardo'},
		{ name: 'Arduino LilyPad USB', type: 'LilyPadUSB'},
		{ name: 'Arduino LilyPad (ATmega168)', type: 'lilypadatmega168'},
		{ name: 'Arduino LilyPad (ATmega328)', type: 'lilypadatmega328'},
		{ name: 'Arduino Mega (ATmega1280)', type: 'megaatmega1280'},
		{ name: 'Arduino Mega (ATmega2560)', type: 'megaatmega2560'},
		{ name: 'Arduino Mega ADK', type: 'megaADK'},
		{ name: 'Arduino Micro', type: 'micro'},
		{ name: 'Arduino Mini (ATmega168)', type: 'miniatmega168'},
		{ name: 'Arduino Mini (ATmega328P)', type: 'miniatmega328'},
		{ name: 'Arduino Nano (ATmega168)', type: 'nanoatmega168'},
		{ name: 'Arduino Nano (ATmega328P)', type: 'nanoatmega328'},
		{ name: 'Arduino Pro or Pro Mini (ATmega168, 3.3V)', type: 'pro8MHzatmega168'},
		{ name: 'Arduino Pro or Pro Mini (ATmega168, 5V)', type: 'pro16MHzatmega168'},
		{ name: 'Arduino Pro or Pro Mini (ATmega328P, 3.3V)', type: 'pro8MHzatmega328'},
		{ name: 'Arduino Pro or Pro Mini (ATmega328P, 5V)', type: 'pro16MHzatmega328'},
		{ name: 'Arduino Uno', type: 'uno'}
	];

	$scope.upload = function(name) {
		PlatformioService.upload(name);
	};

	$scope.folderSelected = function(path) {
		var parts = path.split('/');
		$scope.projects =  ProjectService.create(parts[parts.length - 1], path);
	};

	$scope.removeProject = function(doc) {
		$scope.projects = ProjectService.remove(doc);
	};

	$scope.build = function(name, path) {
		PlatformioService.build(name, path, getPortsArr());
	};

	$scope.buildAndUpload = function(name, path) {
		PlatformioService.build(name, path, getPortsArr(), function() {
			PlatformioService.upload(name);
		});
	};

	$scope.setupContinue = function() {
		getPorts(function (ports) {
			// now we ignore these ports in the future
			ports.forEach(function(port) {
				var hash = generateHash(joinPortData(port));
				ConfigStore.set('port:' + hash, {
					ignore: true,
					portData: port
				})
			});

			ConfigStore.set('setupWizardDone', true);
			$scope.setupWizardDone = true;
			if(!$scope.$$phase) $scope.$digest();
		});
	};

	$scope.ignorePort = function(port, hash) {
		ConfigStore.set('port:' + hash, {
			ignore: true,
			portData: port
		});
		delete $scope.unknownPorts[hash];
	};

	$scope.savePort = function(port, hash) {
		ConfigStore.set('port:' + hash, {
			ignore: false,
			portData: port
		});
		delete $scope.unknownPorts[hash];
	};

	function getPortsArr() {
		return $scope.ports;
	}

	var serialPort = require("serialport");

	function getPortByHash(hash) {
		return ConfigStore.get('port:' + hash);
	}

	function generateHash(str) {
		var hash = 0, i, chr, len;
		if (str.length == 0) return hash;
		for (i = 0, len = str.length; i < len; i++) {
			chr   = str.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	}

	function joinPortData(port) {
		var str = '';
		for(var key in port) {
			str += port[key];
		}
		return str;
	}

	function getPorts(cb) {
		serialPort.list(function (err, ports) {
			cb(ports);
		});
	}

	function checkPorts() {
		getPorts(function (ports) {
			$scope.ports.length = 0;
			ports.forEach(function(port) {
				var hash = generateHash(joinPortData(port));
				var portData = getPortByHash(hash);
				if(!portData) {
					if(typeof $scope.unknownPorts[hash] !== 'undefined') {
						return false;
					}
					// this port is unknown
					// let the user decide how to treat that port
					$scope.unknownPorts[hash] = port;
					$scope.unknownPorts[hash].name = '';
					$scope.unknownPorts[hash].board = '';
					return false;
				}
				if(portData.ignore) {
					console.log('ignored', port);
					// port is ignored
					return false;
				}

				$scope.ports.push(portData.portData);
			})
		});
	}

	(function pingPorts() {
		setTimeout(pingPorts, 1000);

		// setup wizard must be finished before we start checking for boards
		if(!$scope.setupWizardDone) return;

		checkPorts();

		if(!$scope.$$phase) $scope.$digest();
	})();

}]);