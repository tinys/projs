/**
 *
 * @authors Stri (stri.vip@gmail.com)
 * @date    2014-01-02 19:19:19
 * @version $Id$
 */
define(function(module) {
	var feedList = require('../../../../module/feed/index@1.0');
	var postsModel = require('../../../../module/model/posts')

	// api
	var api = {};
	api.all = require('../../../../api/get_posts/index');
	api.category = require('../../../../api/get_category_posts/index');


	module.exports = function(Opts) {
		var that,
			baseInit,
			bindEvent;
		that = feedList($.extend({
			trans: api.all
		}, Opts));

		baseInit = that.init;

		bindEvent = function() {
			that.http.evt.onSuccess.add(function(source) {
				that.maxPageCount = source.data.pages || 1;
			});
		};

		that.init = function() {
			var conf = that.getConfig();

			// 如果有请求参数的配置的话
			if (conf.requestParam) {
				$.each(conf.requestParam, function(key, value) {
					that.http.addParam(key, value);
				});

				// 如果有分类
				if (conf.requestParam.type == 'category') {
					that.http.setConfig(api.category);
				}
			}

			bindEvent();
			baseInit();

			that.http.response = postsModel;
			that.fetch();
		}

		return that;
	}
});