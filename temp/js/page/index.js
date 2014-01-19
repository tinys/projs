/**
 * 全站基础JS
 * @authors Stri (stri.vip@gmail.com)
 */
define(function(module){
	var _Module = require('pro@3.2'),
		cache = require('../common/applicationCache/index')(),
		fix = require('../module/fix/comment'),
		html = $('html');

	// 如果是ipad
	if (_Module.os.ipad) {
		html.addClass('ipad');
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	  if('onorientationchange' in window){
	    $(window).bind('orientationchange',function(){
	    	$('html.ipad,body').scrollTop(1);
	    });
	  }
	}

	_Module.loader.define({
		require: ['./widget/chromeMsg'],
		loadTime: 'DOMContentLoaded',
		initialize: true
	});

	module.exports = {
		module:_Module,
		applicationCache: cache,
		widget: {}
	};
});