(function(module) {
	var fs = require('fs'),
		path = require('path'),
		parseParam = require('./util/parseParam'),
		parseJSON = require('./util/parseJSON'),
		pack = require('./combine/pack'),
		task = require('./task'),
		formatJSONString = require('./util/formatJSONString');

	// 配置文件
	var projectSettingFile = path.normalize(__dirname + '/../config/setting.json');

	/*
	 * 获取配置文件
	 */
	function getConf(filePath) {
		var data;
		data = fs.readFileSync(filePath, 'utf-8');

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

			if (name && conf.hasOwnProperty(name)) {
				return conf[name];
			}

			if (name && !conf.hasOwnProperty(name)) {
				task.emit('getConfig', {
					code: 2,
					msg: name + ' is found out!'
				});
			}

			if (!name) {
				return conf;
			}
		},
		/**
		 * 设置配置
		 * @param   {[string]}  name   [description]
		 * @param   {[string]}  value  [description]
		 */
		setConfig: function(name, value) {
			var oldConfig = this.getConfig();
			
			if (oldConfig.hasOwnProperty(name)) {
				oldConfig[name] = value;
				setConf(projectSettingFile, oldConfig);
				task.emit('setConfig', {
					code: 1,
					data: {
						name: name,
						value: value,
						config: oldConfig
					}
				});
			} else {
				task.emit('setConfig', {
					code: 2,
					msg: name + ' is found out!'
				});
			}
		}
	};
})(module);