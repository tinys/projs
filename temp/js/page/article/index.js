// 文章页

define(function(module){
	var page = require('../index'),
		staticHost = page.module.loader.getSourceHost();

	// widget
	page.module.loader.define({
		require: ['./widget/pageScroll.js'],
		platform: !!page.module.os.ipad,
		loadTime: 'DOMContentLoaded',
		initialize: true
	});

	page.module.loader.define({
		require: ['/page/comment/index.scss','./widget/comment.js'],
		platform: !page.module.os.ipad,
		loadTime: 'DOMContentLoaded',
		initialize: true
	});

	// 更新访问量
	page.module.loader.define({
		require: ['./widget/pageVisitCount.js'],
		loadTime: 'DOMContentLoaded',
		initialize: true
	});

	page.module.loader.start();
});