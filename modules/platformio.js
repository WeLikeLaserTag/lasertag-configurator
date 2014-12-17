var EventEmitter = require('events').EventEmitter;
var util = require('util');
var path = require('path');
var ncp = require('ncp').ncp;
var fs = require('fs');
var ini = require('ini');

function platformIO (options) {

	options = options || {};
	var debug = options.debug || false;

	var tmpPath = process.cwd() + '/tmp/';

	function ProcessRunner (cmd, args, path) {

		EventEmitter.call(this);

		var spawn = require('child_process').spawn;
		var child = spawn(cmd, args, {
			cwd: path || '.'
		});
		var that = this;
		var data = '';

		child.on('error', function (err) {
			console.log(arguments);
		});

		child.stdout.on('data', function (buffer) {
			var line = buffer.toString();
			data += line;
			that.emit('line', line);
		});
		child.stdout.on('end', function () {
			that.emit('success', data);
		});
		child.stderr.on('data', function (buffer) {
			var line = buffer.toString();
			data += line;
			that.emit('error', data);
		});
	}

	util.inherits(ProcessRunner, EventEmitter);

	function copySourceFiles(sourceFolder, destination, cb) {
		ncp(sourceFolder, destination, function (err) {
			cb(err);
		});
	}

	return Object.freeze({
		copyProjectFiles: function(name, source, cb) {
			var projTmpPath = tmpPath + name;
			new ProcessRunner('rm', ['-rf', projTmpPath]).on('success', function() {
				copySourceFiles(source, projTmpPath, function(err) {
					var success = true;
					if(err) {
						success = false;
					}
					cb(success);
				});
			});
		},
		createIniFile: function(name, serialPorts) {
			var config = {};
			serialPorts.forEach(function(port, i) {
				var name = 'env:port_' + i;
				config[name] = {
					board: port.board.type,
					framework: 'arduino',
					platform: 'atmelavr',
					upload_port: port.comPort
				};
			});
			fs.writeFileSync(tmpPath + name + '/platformio.ini', ini.stringify(config))
		},
		compile: function (name, opts) {
			var args = ['run'];
			var opts = opts || {};

			if(opts.env) {
				args.push('-e');
				args.push(opts.env);
			}

			var proc = new ProcessRunner('platformio', args, tmpPath + name);

			if(debug) {
				proc.on('line', function(data) {
					console.log(data);
				});
				proc.on('error', function(data) {
					console.log(data);
				});
			}

			return proc;
		},

		upload: function(name) {
			var args = ['run', '--target', 'upload'];
			var proc = new ProcessRunner('platformio', args, tmpPath + name);
			return proc;
		}
	});
}

module.exports = platformIO;