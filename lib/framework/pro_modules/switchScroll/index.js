/**
 * 基于iScroll的切换
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-10-16 12:20:56
 * @version 0.0.1
 */
define(function(module){
	var widget = require('widget'),
		_JSON = require('JSON'),
		IScroll = require('IScroll');

	module.exports = function(Opts){
		var that,
			conf,
			init,
			bindEvent,
			destroy;

		// param
		conf = $.extend({
			scrollBoxSelector: '',
			scrollWidth: 0,
			cellWidth: 0,
			cellHeight: 0,
			stepCellCount: 1,
			scrollX: true,
			scrollY: true,
			momentum: false,
			snap: true,
		},Opts);

		that = widget(conf);

		/**
		 * 创建iScroll
		 * @param   {[type]}  Opts  [description]
		 * @return  {[type]}        [description]
		 */
		function createIScroll(box,conf){
			setTimeout(that.setBoxOffset,15);
			// 设置容器的高与宽
			that.iScroll = new IScroll(box[0],conf);
		}

		/**
		 * 获取scroll box
		 * @return  {[type]}  [description]
		 */
		function getScrollBox(){
			var conf = that.getConfig(),
				box = conf.box;
			return conf.scrollBoxSelector ? $(conf.scrollBoxSelector,$(box)) : $(box).children(0);
		}

		/**
		 * 更新
		 * @return  {[type]}  [description]
		 */
		function refresh(){
			try{
				that.setBoxOffset();
			}catch(e){
				console.log(e.message)
			}
			if(that.iScroll){
				that.iScroll.refresh();
			}
		}

		/**
		 * 获取scrollBox的高与宽
		 */
		function setBoxOffset(){
			var cellNode,
				cellCount,
				conf = that.getConfig(),
				scrollBox = that.getScrollBox();

			cellNode = scrollBox.children(0).eq(0);
			cellCount = scrollBox.children().size();
			conf.cellWidth = conf.cellWidth || (cellNode ? parseInt($(cellNode).css('width')) : 0) || $(scrollBox).outerWidth();
			conf.cellHeight = conf.cellHeight || (cellNode ? parseInt($(cellNode).css('height'))  : 0) || $(scrollBox).outerHeight();

			// 设置scroller宽度
			if(!conf.scrollWidth){
				$(scrollBox).css({
					width: conf.cellWidth * cellCount+'px'
				});
			}

			// 设置scroller高度
			if(!conf.scrollHeight){
				$(scrollBox).css({
					width: conf.scrollHeight * 1+'px'
				});
			}
		}

		// bindEvent
		bindEvent = function(){
			var conf = that.getConfig(),
				box = conf.box;

			// 向后
			$(box).delegate('[action-type="next"]','click',function(e){
				var target = e.currentTarget,
					data = _JSON.queryToJson($(target).attr('action-data')) || {};
				that.evt.onNext.fire({
					data: data,
					target: target,
					originEvent: e
				});
				e.preventDefault();
			});

			// 向前
			$(box).delegate('[action-type="prev"]','click',function(e){
				var target = e.currentTarget,
					data = _JSON.queryToJson($(target).attr('action-data')) || {};
				that.evt.onPrev.fire({
					data: data,
					target: target,
					originEvent: e
				});
				e.preventDefault();
			});

			// 向某一页
			$(box).delegate('[action-type="scroll"]','click',function(e){
				var target = e.currentTarget,
					data = _JSON.queryToJson($(data).attr('action-data')) || {};
				that.evt.onSwitch.fire({
					data: data,
					target: target,
					originEvent: e
				});
				e.preventDefault();
			});

			// 向前切换
			that.evt.onPrev.add(function(source){
				var data = source.data;
				that.iScroll.prev(data.time,data.easing);
			});

			// 向后切换
			that.evt.onPrev.add(function(source){
				var data = source.data;
				that.iScroll.next(data.time,data.easing);
			});

			// 切换
			that.evt.onSwitch.add(function(source){
				var data = source.data;
				that.iScroll.goToPage(data.x,data.y,data.time,data.easing);
			});
		};

		// destroy
		destroy = function(){
		};

		// init
		init = function(){
			var conf = that.getConfig(),
				box = conf.box;
			// 生成iScroll
			createIScroll(box,conf);
			bindEvent();
		};

		// api
		that.destroy = destroy;
		that.setBoxOffset = setBoxOffset;
		that.refresh = refresh;
		that.getScrollBox = getScrollBox;
		that.init = init;
		that.evt = {
			onSwitch: $.Callbacks(),
			onPrev: $.Callbacks(),
			onNext: $.Callbacks()
		};

		return that;
	};
});