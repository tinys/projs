// 1.1版
// 在1.1版本的基础上，添加访问量
define(function(module){
	var feedList = require('./index');
	var pageVisitCount = require('../../../../module/feed/plugins/pageVisitCount');
	var updatePageVisitCount = require('../../../../module/feed/plugins/updatePageVisitCount')

	module.exports = function(Opts){
		var that = feedList(Opts),
			init,
			baseInit = that.init;

		init = function(){
			var conf = that.getConfig();

			if (!conf.disablePageVisitCount){
				that = pageVisitCount(that,Opts);
			}

			if (!conf.disablePageVisitEvent){
				that = updatePageVisitCount(that,Opts);
			}

			baseInit();
		};

		that.init = init;

		return that;
	}
});