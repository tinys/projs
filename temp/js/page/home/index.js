/**
 * 首页JS
 * @authors Stri (stri.vip@gmail.com)
 */
define(function(module) {
	var page = require('../index'),
		os = page.module.os;

	require('../../module/feed/index@1.0');

	// widget
	page.module.loader.define({
		require: ['./widget/feed/index'+(os.ipad ? '@1.2' : '@1.1')],
		loadTime: 'DOMContentLoaded',
		exports: function(Opts, feedObj) {
			var that,
				param;

			// param
			param = {
				feedList: {
					box: $('#feed-list'),
					template: $('#tpl-feed-list').html(),
					requestParam: {
						type: $SCOPE.category ? 'category' : 'all',
						id: $SCOPE.category && $SCOPE.category.id
					}
				},
				autoLoad: true,
				pageScroll: {
					pageNumber: true
				}
			};

			that = feedObj(os.ipad ? param : param.feedList);

			that.init();
		}
	});

	page.module.loader.start();
});