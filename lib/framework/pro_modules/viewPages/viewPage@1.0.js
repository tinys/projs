/**
 * viewBox
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-10-15 21:00:20
 * @version $Id$
 */
define(function(module){
	var $ET = require('easyTemplate'),
		builder = require('builder'),
		widget = require('widget');
	
	module.exports = function(Opts){
		var that = {},
			conf,
			box,
			bindEvent,
			destroy;

		// param
		conf = $.extend({
			source: null,
			template: null
		},Opts);

		that = widget(conf);

		/**
		 * 获取容器
		 * @return  {[type]}  [description]
		 */
		function getWrapper(){
			var conf = that.getConfig(),
				builder = conf.builder;
			return builder && builder.list && builder.list['view-page-wrapper'][0] || conf.box;
		}

		/**
		 * 获取viewBox
		 * @return  {[type]}  [description]
		 */
		function getViewBox(){
			var conf = that.getConfig(),
				builder = conf.builder;
			return builder && builder.list && builder.list['view-page-box'][0];
		}

		/**
		 * 显示
		 * @return  {[type]}  [description]
		 */
		function show(){
			var viewBox = that.getViewBox();
			$(viewBox).show();
		}

		/**
		 * 隐藏
		 * @return  {[type]}  [description]
		 */
		function hide(){
			var viewBox = that.getViewBox();
			$(viewBox).show();
		}

		/**
		 * destroy
		 */
		function destroy(){
			var conf = that.getConfig(),
				box = conf.box;
			box.html('');
		}

		/**
		 * 初始化模板
		 * @return  {[type]}  [description]
		 */
		function initTemplate(){
			var conf = that.getConfig(),
				box = conf.box, 
				html = $ET(conf.template,conf.source || {}).toString(),
				_builder = builder(html);
			that.setConfig('builder',_builder);
			conf.template && box.append(_builder.box);
		}

		// api
		that.getWrapper = getWrapper;
		that.getViewBox = getViewBox;
		that.init = initTemplate;
		that.show = show;
		that.hide = hide;
		that.destroy = destroy;

		return that;
	}
});