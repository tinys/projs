// 在基本版本的基础上，加如下功能
// * 加入自动加载功能，配置参数autoLoad为true时
// * 加入切换功能，配置参数pageScroll
// 			* 加入页码功能，配置参数为pageNumber
define(function(module) {
	var widget = require('widget');
	var feedList = require('./index');
	var parseParam = require('parseParam');
	var autoLoad = require('../../../../module/feed/plugins/autoLoad');
	var pageScroll = require('../../../../module/pageScroll/index');
	var pageNumber = require('../../../../module/pageScroll/plugins/pageNumber/index');

	module.exports = function(Opts) {
		var that = {},
			conf,
			init,
			bindEvent,
			destroy;

		// param
		conf = $.extend({}, Opts);

		that = widget(conf);

		// bindEvent
		bindEvent = function(){
			var pageScrollInit;
			that.feedList.list.evt.insert.add(function(){
				if (that.pageScroll){
					if (!pageScrollInit) {
						pageScrollInit = true
						that.pageScroll.init();
					}else {
						that.pageScroll.scroll.refresh(1);
					}
				}
			});
		};

		// destroy
		destroy = function() {
			that.feedList.destroy();
			that.pageScroll.destroy();
		};

		// init
		init = function() {
			var conf = that.getConfig();

			// 基本feed
			that.feedList = feedList(conf.feedList);
			that.feedList.init();

			// 自动加载
			if (conf.autoLoad) {
				that.feedList = autoLoad(that.feedList, conf.autoLoad);
			}

			// 加入切屏
			if (conf.pageScroll) {
				that.pageScroll = pageScroll(conf.pageScroll);

				if ((typeof conf.pageScroll == 'object') && conf.pageScroll.pageNumber) {
					that.pageScroll = pageNumber(that.pageScroll, parseParam({
						selector: '.page-number'
					}, conf.pageScroll.pageNumber));
				}
			}

			bindEvent();
		};

		// api
		that.destroy = destroy;
		that.init = init;

		return that;
	}
});