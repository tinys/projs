define(function(module){
	var widget = require('widget'),
		_JSON = require('JSON'),
		viewPage = require('./viewPage@1.0'),
		parseParam = require('parseParam'),
		switchScroll = require('switchScroll');

	/**
	 * viewPages
	 * @param   {[type]}  Opts  [description]
	 * @return  {[type]}        [description]
	 */
	module.exports = function(Opts){
		var that,
			conf,
			init,
			currentPageName = null,
			channel,
			viewPages = {},
			bindEvent,
			destroy;

		// conf
		conf = $.extend({},Opts);

		// switchScroll
		conf.switchScroll = $.extend({
			snap: true,
			snapSpeed: 500,
			disableTouch: true,
			disableMouse: true,
			disablePointer: true,
			scrollBoxNodeType: 'switch-scroll-box',
			scrollBoxSelector: '[node-type="switch-scroll-box"]'
		},conf.switchScroll);

		that = widget(conf);
		that.switchScroll = switchScroll(conf.switchScroll);

		/**
		 * 创建一个viewPage
		 * @return  {[type]}  [description]
		 */
		function createViewPage(Opts){
			var conf = that.getConfig(), 
				param = parseParam({
					name: 'index',
					source: {},
					template: ''
				},$.extend({},conf,Opts)), 
				viewPageObj = viewPage(param),
				pageName = param.name;

			viewPageObj.setConfig('box',that.switchScroll.getScrollBox());
			viewPageObj.init();
			viewPageObj.hide();
			viewPages[pageName] = viewPageObj;

			return viewPageObj;
		}

		/**
		 * 获取所有的viewPage
		 * @return  {[type]}  [description]
		 */
		function getViewPages(){
			return viewPages;
		}

		/**
		 * 获取指定的viewPage
		 * @return  {[type]}  [description]
		 */
		function getViewPagesByName(name){
			return viewPages[name];
		}

		/**
		 * 判断是否有此name的viewPage
		 * @return  {Boolean}  [description]
		 */
		function hasViewPageName(name){
			return viewPages.hasOwnProperty(name);
		};

		/**
		 * [runViewPageBySwitchScroll description]
		 * @param   {[type]}  name  [description]
		 * @return  {[type]}        [description]
		 */
		function runViewPageBySwitchScroll(name,config){
			var name = name || 'index', 
				arr = [currentPageName,name],
				viewPageObj,
				lastCurrentPageName = currentPageName,
				i = 0,
				indexArr = [];

			// 如果没有name，则创建
			if( !(viewPageObj = that.getViewPagesByName(name)) ){
				viewPageObj = createViewPage(config);
			}

			if(name && config && config.channel){
				channel = config.channel;
			}

			// 派发事件
			var dataParam = {
				url: (config.channel || channel)+'/'+name,
				currentPageName: name,
				lastCurrentPageName: lastCurrentPageName,
				name: name,
				viewPageObj: viewPageObj,
				wrapper: viewPageObj.getWrapper(),
				config: config
			};

			that.evt.onPageShow.fire(dataParam);

			if(lastCurrentPageName){
				that.evt.onPageHide.fire(dataParam);
			}

			// 如果没有当前page
			if(!currentPageName || currentPageName == name){
				that.switchScroll.refresh();
			}else{
				$.each(that.getViewPages(),function(name,obj){
					if($.inArray(name,arr) == -1){
						obj.hide();
					}else{
						indexArr.push(name);
						obj.show();
					}
					i++;
				});

				that.switchScroll.refresh();

				if($.inArray(arr[0],indexArr) == 0){
					that.switchScroll.iScroll.next();
				}else{
					that.switchScroll.iScroll.prev();
				}
			}

			// 重置
			currentPageName = name;
		}

		/**
		 * 初始化ScrollWrappr
		 * @return  {[type]}  [description]
		 */
		function _initSwitchScrolll(){
			var conf = that.getConfig(),
				box = conf.box,
				scrollWrapper = $('<div class="clearfix" node-type="'+conf.switchScroll.scrollBoxNodeType+'">'),
				scrollBox = $('<div>');
			scrollBox.append(scrollWrapper);
			$(box).append(scrollBox);
			that.switchScroll.setConfig('box',scrollBox);
			that.switchScroll.init();
		}

		// bindEvent
		bindEvent = function(){
			var conf = that.getConfig(),
				box = conf.box;

			// 切换事件
			$(box).delegate('[action-type="page"]','click',function(e){
				var target = e.currentTarget,
					data = _JSON.queryToJson($(target).attr('action-data')),
					name = data.name;
				that.goPage(name,data);
				e.preventDefault();
			});
		};

		// destroy
		destroy = function(){
			that.switchScroll.destroy();
		};

		// init
		init = function(){
			var conf = that.getConfig();

			// 初始化switchScroll
			_initSwitchScrolll();

			bindEvent();
		};

		// api
		that.destroy = destroy;
		that.hasViewPageName = hasViewPageName;
		that.getViewPages = getViewPages;
		that.goPage = runViewPageBySwitchScroll;
		that.getViewPagesByName = getViewPagesByName;
		that.init = init;
		that.evt = {
			onPageShow: $.Callbacks(),
			onPageHide: $.Callbacks()
		};

		return that;
	};
});