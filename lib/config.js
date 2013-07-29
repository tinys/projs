(function(module) {
	var fs = require('fs'),
		path = require('path'),
		parseParam = require('./util/parseParam'),
		parseJSON = require('./util/parseJSON'),
		pack = require('./combine/pack'),
		evt = require('events').EventEmitter,
		formatJSONString = require('./util/formatJSONString');

	// 配置文件
	var projectSettingFile = path.normalize(__dirname + '/../config/setting.json');
	var projectsSysFile = path.normalize(__dirname + '/../config/projects.json');

	/*
	 * 获取配置文件
	 */
	function getConf(filePath) {
		var data;
		data = fs.readFileSync(filePath, 'utf-8');

		// 简单判断
		if (filePath == projectsSysFile && !/list/gi.test(data)) {
			data = '\{\"list\":[]\}';
		}
		
		return parseJSON(data);
	}

	/** 
	 * 设置配置文件
	 */

	function setConf(filePath, data) {
		var str;
		str = JSON.stringify(data);
		fs.writeFileSync(filePath, formatJSONString(str));
	}

	// 提供方法
	module.exports = {
		/**
		 * 获取全局配置
		 * @param {String} [name] [名称] 可选，如果没有，则为获取全部
		 */
		getConfig: function(name) {
			var conf = getConf(projectSettingFile);

			if(name && conf.hasOwnProperty(name)){
				return conf[name];
			}

			if(name && !conf.hasOwnProperty(name)){
				evt.emit('getConfig',{
					code: 2,
					msg: '没有这个参数'
				});
			}
			
			if(!name){
				return conf;
			}
		},
		/**
		 * 设置配置
		 * @param   {[string]}  name   [description]
		 * @param   {[string]}  value  [description]
		 */
		setConfig: function(name,value){
			var oldConfig = this.getConfig();
			if(oldConfig.hasOwnProperty(name)){
				oldConfig[name] = value;
				setConf(projectSettingFile,oldConfig);
				evt.emit('setConfig',{
					code: 1,
					data: {
						name: name,
						value: value,
						config: oldConfig
					}
				});
			}
			evt.emit('setConfig',{
				code: 2,
				msg: '没有这个参数'
			});
		}
	};
})(module);