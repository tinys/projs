// 插件对象
(function(module) {
	var fs = require('fs'),
		path = require('path'),
		https = require('https'),
		http = require('http'),
		log = require('./util/log'),
		task = require('./util/task');

	var PLUGINS_PATH = path.normalize(__dirname + '/../plugins/');
	var isURL = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/g;

	module.exports = {
		/**
		 * 安装插件
		 * @param   {[type]}    uri       [description]
		 * @param   {Function}  callback  [description]
		 * @return  {[type]}              [description]
		 */
		install: function(uri, callback) {
			var name = path.basename(uri),
				extname = path.extname(uri),
				_packUri = PLUGINS_PATH + '' + name,
				codeStr,
				_this = this,
				createFile = function(code) {
					var _pack;
					fs.writeFileSync(_packUri, code);
					log.log2('install', 'success');
				};

			if (extname != '.js') {
				console.log('格式不支持.');
				return;
			}

			log.log2('install', 'start');

			// 如果是url的话，先请求
			if (isURL.test(uri)) {
				log.log2('install', 'get', uri);
				var _http = /^https/gi.test(uri) ? https : http;
				_http.get(uri, function(res) {
					res.on('data', function(d) {
						createFile(d.toString());
					});
				}).on('error', function(e) {
					log.log3('install', 'error');
				});
				return;
			}

			if (path.existsSync(uri)) {
				codeStr = fs.readFileSync(uri, 'utf-8');
				createFile(codeStr);
			} else {
				log.log3('install', 'error', 'file is exit');
			}
		},
		extend: function(callback) {
			var arr = fs.readdirSync(PLUGINS_PATH) || [];

			arr.forEach(function(uri) {
				var name = path.basename(uri),
					extname = path.extname(uri),
					obj;

				if (extname == '.js') {
					obj = require('../plugins/' + name);
					callback && callback(obj);
				}
			});
		}
	};
})(module);