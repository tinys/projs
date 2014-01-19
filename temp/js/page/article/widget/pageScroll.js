// 分页滚动
define(function(module) {
	var pageScroll = require('../../../module/pageScroll/index'),
		pageNumber = require('../../../module/pageScroll/plugins/pageNumber/index');
	module.exports = {
		init: function() {
			var that = pageScroll();
			// 添加分页插件
			that = pageNumber(that, {
				selector: '.page-number'
			});

			that.init();
		}
	};
});