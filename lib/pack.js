(function(module){
	var packCache = require('./combine/pack'),
		fs = require('fs'),
    path = require('path'),
    http = require('https'),
		task = require('./util/task');

	path.existsSync = fs.existsSync ? function(uri) {
	  return fs.existsSync.call(fs, uri)
	} : path.existsSync;

	var PLUGINS_PATH = path.normalize(__dirname+'/../plugins/');
	var isURL = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/g;

	module.exports = {
		/**
		 * 获取所有列表
		 * @return  {[type]}  [description]
		 */
		getList: function(){
			var list = [];
			['css','js'].forEach(function(type){
				for(var p in packCache[type]){
					list.push({
						name: p,
						type: type,
						author: packCache[type].author || '',
						desc: packCache[type].desc || '',
						version: packCache[type].version || ''
					});
				}
			});
			return list;
		},
		/**
		 * 安装插件
		 * @param   {[type]}    uri       [description]
		 * @param   {Function}  callback  [description]
		 * @return  {[type]}              [description]
		 */
		install: function(uri,callback){
			var name = path.basename(uri),
				_this = this;

			// 如果是url的话，先请求
			if(isURL.test(uri)){
				http.get(uri,function(res){
					console.log('200:'+res);
				}).on('error',function(e){
					console.log(e.message);
				});
				return;
			}

			if(path.existsSync(uri)){
				task.execute('cp',[uri,PLUGINS_PATH],{
					onComplete: function(){
						var _pack = require('../plugins/'+name),
						_name = path.basename(name,'.js'),
						_type = _pack.type || 'js';
						packCache.add(_type,_name,_pack);
						callback && callback({
							type: _type,
							name: name,
							pack: pack
						});
					}
				});
			}else {
				console.log('file is exit.');
			}
		}
	};
})(module);