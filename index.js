/**
 *  projs 主js
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-07-29 10:36:35
 * @version 0.0.1
 */
var conf = require('./lib/config');
var server = require('./lib/server');
var fs = require('fs');
var path = require('path');
var parseJSON = require('./lib/util/parseJSON');
var task = require('./lib/util/task');
var pack = require('./lib/pack');
var httpd;
path.existsSync = fs.existsSync ? function(uri) {
	return fs.existsSync.call(fs, uri)
} : path.existsSync;

module.exports = {
	pack: pack,
	start: function() {
		this.getConfig(function(config) {
			httpd = httpd ? httpd : server(config);
			httpd.start();
		});
	},
	stop: function() {
		return httpd && httpd.stop();
	},
	getPackage: function() {
		var data = fs.readFileSync(path.normalize(__dirname + '/package.json'), 'utf-8');
		return parseJSON(data);
	},
	compress: function(from, to, username, password) {
		conf.getConfig(function(config) {
			if (/^http/gi.test(from)) {
				task.svnExport(from, username, password, to, {
					config: config,
					onComplete: function() {
						task.compress(null, to, config);
					}
				});
			} else {
				if (!path.existsSync(to)) {
					console.log(to + ' is exit.');
				} else {
					task.compress(from, to, config);
				}
			}
		});
	},
	installConfig: function(uri,callback){
		console.log(uri);
		return conf.installConfig(uri,callback);
	},
	setConfig: function(name, value, force) {
		return conf.setConfig(name, value, force)
	},
	getConfig: function(name, callback) {
		return conf.getConfig(name, callback);
	}
};