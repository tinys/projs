(function(module) {
	var fs = require('fs'),
		path = require('path'),
		parseParam = require('./util/parseParam'),
		parseJSON = require('./util/parseJSON'),
		pack = require('./combine/pack'),
		formatJSONString = require('./util/formatJSONString');

	// 配置文件
	var projectSettingFile = path.normalize(__dirname + '/../config/setting.json');
	var projectsSysFile = path.normalize(__dirname + '/../config/projects.json');

	/*
	 * 获取配置文件
	 */
	function getConfig(filePath) {
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

	function setConfig(filePath, data) {
		var str;
		str = JSON.stringify(data);
		fs.writeFileSync(filePath, formatJSONString(str));
	}

	// 提供方法
	module.exports = {
		/**
		 * 获取全局配置
		 */
		getSetting: function() {
			return getConfig(projectSettingFile);
		},
		/**
		 * 获取工程列表
		 */
		getProjects: function() {
			return getConfig(projectsSysFile);
		},
		/**
		 * 添加工程
		 * @param {String} [str] [新工程的串]
		 */
		addProject: function(str) {
			var oldConfig = this.getProjects(),
				newProject = parseJSON(str),
				newSetting = this.getSetting();
			newProject['id'] = new Date().getTime();
			newProject['idStr'] = 'iproject_' + new Date().getTime();
			newProject['created_at'] = new Date();

			for(var key in newProject){
				newSetting[key] = newProject[key];
			}
			oldConfig.list.push(newSetting);

			setConfig(projectsSysFile, oldConfig);
		},
		/** 
		 * 移除工程
		 * @param {String} [id] [description]
		 */
		removeProject: function(id) {
			var oldConfig = this.getProjects();
			oldConfig.list.forEach(function(value,key) {
				if (value.id == id) {
					oldConfig.list.splice(key, 1);
				}
			});

			setConfig(projectsSysFile, oldConfig);
		},
		/**
		 * 设置工程
		 * @param {String} [id] [工程id]
		 * @param {Object} [conf] [配置内容]
		 * @param {Boolean} [isOverride] [是否全部重写,默认为false]
		 */
		setProject: function(id, conf, isOverride) {
			var oldConfig = this.getProjects();
			oldConfig.list.forEach(function(value) {
				if (value.id == id) {
					oldConfig[key] = isOverride ? conf : parseParam(value, conf);
				}
			});
			setConfig(projectsSysFile, oldConfig);
		},
		/** 
		 * 获取工程
		 * @param   {[String]}  id  [工程id]
		 */
		getProject: function(id) {
			var oldConfig = this.getProjects(),
				project;

			oldConfig.list.forEach(function(value) {
				if (value.id == id) {
					project = value; //oldConfig[key] = isOverride ? conf : parseParam(value,conf);
				}
			});
			return project;
		},
		/** 
		 * 获取包的参数列表
		 */
		getPackParamList: function(){
			var params = pack.js,
				re = {};
			for(var key in params){
				re[key] = {};
				re[key]['project.name'] = {
					name : "项目名称",
					value : "项目名称"
				};

				re[key]['project.repository'] = {
					name : "代码地址",
					value : "svn地址或git地址"
				};

				re[key]['project.exports'] = {
					name: "输出路径",
					value: "打包输出路径"
				};

				re[key]['project.username'] = {
					name: "用户名",
					value: "svn用户名或git用户名"
				};

				re[key]['project.password'] = {
					name: "密码"
				};

				for(var p in params["params"] || {}){
					re[key][p] = params[key]['params'][p];
				}
			}

			return re;
		},
		/** 
		 * 根据类型获取相应的配置参数
		 * @param   {String}  type  [类型名称]
		 */
		getPackParamByStyle : function(type){
			var params = this.getPackParamList();
			return params[type];
		},
		/** 
		 * 清空工工程
		 */
		emptyProject: function(){
			setConfig(projectsSysFile, '');
		}
	};
})(module);