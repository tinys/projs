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
				bodyer = that.getBodyBox();
			return bodyer || conf.box;
		}

		/**
		 * 获取viewBox
		 * @return  {[type]}  [description]
		 */
		function getViewBox(){
			var conf = that.getConfig(),
				builder = conf.builder;
			return builder && builder.list && builder.list['view-box'][0];
		}

		/**
		 * 获取viewWrapper
		 * @return  {[type]}  [description]
		 */
		function getViewWrapper(){
			var conf = that.getConfig(),
				builder = conf.builder;
			return builder && builder.list && builder.list['view-wrapper'][0];
		}

		/**
		 * 获取标题容器
		 * @return  {[type]}  [description]
		 */
		function getTitleBox(){
			var conf = that.getConfig(),
				builder = conf.builder;
			return builder && builder.list && builder.list['view-title'][0];
		}

		/**
		 * 获取bodyBox容器
		 * @return  {[type]}  [description]
		 */
		function getBodyBox(){
			var conf = that.getConfig(),
				builder = conf.builder;
			return builder && builder.list && builder.list['view-body'][0];
		}

		/**
		 * 获取footBox容器
		 * @return  {[type]}  [description]
		 */
		function getFootBox(){
			var conf = that.getConfig(),
				builder = conf.builder;
			return builder && builder.list && builder.list['view-foot'][0];
		}

		/**
		 * 设置标题
		 * @param  {[type]}  title  [description]
		 */
		function setTitle(title){
			var titleBox = that.getTitleBox();
			$(titleBox).html(title);
		}

		/**
		 * 设置body内容
		 * @param  {[type]}  html  [description]
		 */
		function setBodyContent(html){
			var bodyBox = that.getBodyBox();
			$(bodyBox).html(html)
		}

		/**
		 * 设置body内容
		 * @param  {[type]}  html  [description]
		 */
		function setFootContent(html){
			var footBox = that.getFootBox();
			$(footBox).html(html)
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
		that.init = initTemplate;
		that.show = show;
		that.hide = hide;
		that.getViewBox = getViewBox;
		that.getViewWrapper = getViewWrapper;
		that.getBodyBox = getBodyBox;
		that.setBodyContent = setBodyContent;
		that.getTitleBox = getTitleBox;
		that.setTitle = setTitle;
		that.getFootBox = getFootBox;
		that.setFootContent = setFootContent;
		that.destroy = destroy;

		return that;
	}
});