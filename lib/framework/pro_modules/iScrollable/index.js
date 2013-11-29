/**
 * 滚动组件
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-11-23 18:57:24
 * @version $Id$
 */
define(function(module){
	var parseParam = require('parseParam'),
		json = require('JSON'),
		widget = require('widget'),
		iScroll = require('IScroll'),
		iScrollFix = require('IScroll@ie');

	var iScrollable = function(Opts){
		var that,
			conf,
			iScrollParam,
			lastIndicator = {},
			init,
			bindEvent,
			destroy;

		// param
		conf = parseParam({
			box: null,
			response: false,
			eventType: 'click',
			activeClass: '',
			autoScroll: false,
			indicatorSelector: '[action-type="scroll"]',
			autoScrollInerval: 5,
			pageX: 0,
			pageY: 0,
			pageCount: 0,
			loop: true
		},Opts);

		// Obj
		that = widget(conf);

		that.iScroll = null;

		/**
		 * 获取指示器节点列表
		 * @return  {[type]}  [description]
		 */
		function getAllPointerNodes(){
			var conf = that.getConfig();
			return $(conf.indicatorSelector,$(conf.box));
		}

		/**
		 * 设置指标器的样式
		 * @param  {[type]}  x  [description]
		 * @param  {[type]}  y  [description]
		 */
		function setPointerActiveClass(x,y){
			var param = that.getScrollParam(),
				nodes = that.getAllPointerNodes();

			if(nodes.length == 0) return;

			x = parseInt(x) || 0;
			y = parseInt(y) || 0;

			if(lastIndicator.x == x && lastIndicator.y == y) return;
			
			lastIndicator = {
				x: x,
				y: y
			};

			$.each(nodes,function(index,node){
				var data = json.queryToJson($(node).attr('action-data') || (param.scrollX ? 'x=' : 'y=')+index );

				data.x = parseInt(data.x) || 0;
				data.y = parseInt(data.y) || 0;

				if(data.x == x && data.y == y){
					$(node).addClass(conf.activeClass);
				}else{
					$(node).removeClass(conf.activeClass);
				}
			});
		}

		/**
		 *监听window的resize事件
		 * @return  {[type]}  [description]
		 */
		function _bindWinResizeEvent(){
			var timer;
			$(window).on('resize',function(){
				clearTimeout(timer);
				timer = setTimeout(function(){
					that.refresh();
				},20);
			});
		}

		/**
		 * 获取scroll参数
		 * @return  {[type]}  [description]
		 */
		function getScrollParam(){
			var conf = that.getConfig();

			if(conf.scrollX){
				conf.eventPassthrough = true;
			}

			return parseParam({
				scrollX: true,
				scrollY: false,
				eventPassthrough: false,
				momentum: false,
				snap: true
			},Opts);
		}

		/**
		 * 获取一共多少个
		 * @return  {[type]}  [description]
		 */
		function getPageCount(){
			var param = that.getScrollParam();
			return param.scrollX ? that.iScroll.pages.length : that.iScroll.pages[0].length;
		}

		/**
		 * 获取一次滚动几个
		 * @return  {[type]}  [description]
		 */
		function getPageSizeCount(){
			var pageSizeCount = 1,
				param = that.getScrollParam(),
				scrollOffset = that.getScrollOffset(),
				conf = that.getConfig();

			if( (conf.pageX || conf.pageY) && conf.pageCount ){
				pageSizeCount = 1
			}else{
				pageSizeCount = that.iScroll.wrapperWidth / $(that.iScroll.scroller).children().first().width();
			}

			return pageSizeCount;
		}

		/**
		 * 获取总长度
		 * @return  {[type]}  [description]
		 */
		function getScrollOffset(){
			var conf = that.getConfig(),
				param = that.getScrollParam(),
				width = 0,
				height = 0;

			if( (conf.pageX || conf.pageY) && conf.pageCount ){
				if(param.scrollX){
					width = conf.pageX * conf.pageCount;
				}

				if(param.scrollY){
					height = conf.pageY * conf.pageCount;
				}

			}else{
				$.map($(that.iScroll.scroller).children(),function(node){
					var w,h;
					if(param.scrollX){
						if(conf.response){
							w = $(conf.box).width();
							$(node).css('width',w+'px');
						}else{
							w = parseInt($(node).width());
						}
						width += w;
					}

					if(param.scrollY){
						if(conf.response){
							h = $(conf.box).height();
							$(node).css('height',h+'px');
						}else{
							h = parseInt($(node).height());
						}
						height += h;
					}
				});
			}
			return {
				width: width,
				height: height
			};
		}

		/**
		 * 更新位置
		 * @return  {[type]}  [description]
		 */
		function updatePosition(){
			var param = getScrollParam(),
				scroller = $(that.iScroll.scroller),
				scrollOffset = that.getScrollOffset();

			// 如果是横向scroll
			if(param.scrollX){
				scroller.css('width',scrollOffset.width+'px');
			}

			// 如果是纵向scroll
			if(param.scrollY){

				scroller.css('height',scrollOffset.height/that.getPageSizeCount()+'px');
			}
		}

		/**
		 * 刷新
		 * @return  {[type]}  [description]
		 */
		function refresh(){
			that.updatePosition();
			that.iScroll.refresh();
		}

		/**
		 * 环形循环时，前后结点添加
		 * @return  {[type]}  [description]
		 */
		function _prependAndAppend(box,count){
			var maxCount,
				start = [],
				end = [];
			count = count || 1;

			maxCount = box.children().size();

			// clone
			$.each(box.children(),function(index,node){
				if(index < count){
					start.push($(node).clone());
				}

				if(index > maxCount - 1 -count){
					end.push($(node).clone());
				}
			});

			$.map(start,function(node){
				box.append(node);
			});

			$.map(end.reverse(),function(node){
				box.prepend(node);
			});
		}

		/**
		 * 初始化iScroll
		 * @return  {[type]}  [description]
		 */
		function _initScroll(){
			var conf = that.getConfig(),
				param = that.getScrollParam(),
				box = conf.box,
				_x = conf.loop && param.scrollX ? 1 : 0,
				_y = conf.loop && param.scrollY ? 1 : 0;
			that.iScroll = new iScroll(box[0],getScrollParam());

			if(conf.loop){
				_prependAndAppend($(that.iScroll.scroller),that.getPageSizeCount());
			}

			that.refresh();

			if(conf.loop){
				that.iScroll.goToPage(_x,_y,0);
			}
		}

		// bindEvent
		bindEvent = function(){
			var conf = that.getConfig(),
				param = that.getScrollParam(),
				lastCurrentPage = {},
				box = conf.box;

			// 向后
			$(box).on((conf.eventType),'[action-type="next"]',function(e){
				var target = e.currentTarget,
					data = json.queryToJson($(this).attr('action-data') || '');
				that.evt.onNext.fire({
					data: data,
					target: target,
					originEvent: e
				});
				e.preventDefault();
			});

			// 向前
			$(box).on((conf.eventType),'[action-type="prev"]',function(e){
				var target = e.currentTarget,
					data = json.queryToJson($(this).attr('action-data') || '') || {};
				that.evt.onPrev.fire({
					data: data,
					target: target,
					originEvent: e
				});
				e.preventDefault();
			});

			// 向某一页
			$(box).on(conf.eventType,'[action-type="scroll"]',function(e){
				var target = e.currentTarget,
					data = json.queryToJson($(this).attr('action-data') || ((param.scrollX ?　'x=' : 'y=')+ $(target).index()) );

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
			that.evt.onNext.add(function(source){
				var data = source.data;
				that.iScroll.next(data.time,data.easing);
			});


			// 切换
			that.evt.onSwitch.add(function(source){
				var data = source.data;
				data.x = parseInt(data.x) || 0;
				data.y = parseInt(data.y) || 0;

				// 如果是循环的话
				if(conf.loop){
					if(param.scrollX){
						data.x = data.x + 1;
					}

					if(param.scrollY){
						data.y = data.y + 1;
					}
				}

				that.iScroll.goToPage(data.x,data.y,data.time,data.easing);
			});

			// iScroll的切换
			that.iScroll.on('scrollEnd',function(){
				var currentPage = that.iScroll.currentPage,
					param = that.iScroll.options,
					pageX = currentPage.pageX,
					pageY = currentPage.pageY,
					pageCount = that.getPageCount(),
					_x,
					_y,
					_pageCount = (pageX || pageY) + 1;


				if(conf.loop){
					if( _pageCount == pageCount){
						_x = param.scrollX ? 1 : 0;
						_y = param.scrollY ? 1 : 0;
						return that.iScroll.goToPage(_x,_y,0);
					}

					if( (param.scrollX && pageX == 0) || (param.scrollY && pageY == 0) ){
						_x = param.scrollX ? pageCount - 2 : 0;
						_y = param.scrollY ? pageCount - 2 : 0;

						return that.iScroll.goToPage(_x,_y,0);
					}
				}
			});

			// goToPage
			$.map(['scrollTo','goToPage'],function(type){
				that.iScroll.on(type,function(){
					var currentPage = that.iScroll.currentPage,
						param = that.getScrollParam(),
						pageX = currentPage.pageX,
						pageY = currentPage.pageY,
						len = that.getPageCount(),
						minPageX = 0,
						maxPageX = len - 1,
						minPageY = 0,
						maxPageY = len - 1;

					// 校准
					minPageX = conf.loop ? 1 : minPageX;
					maxPageX = conf.loop ? maxPageX - 1 : maxPageX;
					minPageY = conf.loop ? 1 : minPageY;
					maxPageY = conf.loop ? maxPageY - 1 : maxPageY;

					if(pageX > maxPageX){
						pageX = minPageX;
					}

					if(pageX < minPageX){
						pageX = maxPageX;
					}

					if(pageY > maxPageY){
						pageY = minPageY;
					}

					if(pageY < minPageY){
						pageY = maxPageY;
					}


					if(conf.activeClass){
						if(conf.loop){
							if(param.scrollX){
								pageX--;
								pageY = 0;
							}

							if(param.scrollY){
								pageY--;
								pageX = 0;
							}
						}

						that.setPointerActiveClass(pageX,pageY);
					}
				});
			});
		};

		// destroy
		destroy = function(){};

		// init
		init = function(){
			var conf = that.getConfig();

			// 初始化iScroll
			_initScroll();

			bindEvent();

			// 响应式监听
			if(conf.response){
				_bindWinResizeEvent();
			}
		};

		// api
		that.destroy = destroy;
		that.refresh = refresh;
		that.setPointerActiveClass = setPointerActiveClass;
		that.getAllPointerNodes = getAllPointerNodes;
		that.getScrollParam = getScrollParam;
		that.getScrollOffset = getScrollOffset;
		that.getPageSizeCount = getPageSizeCount;
		that.getPageCount = getPageCount;
		that.updatePosition = updatePosition;
		that.init = init;
		that.evt = {
			onNext: $.Callbacks(),
			onPrev: $.Callbacks(),
			onSwitch: $.Callbacks()
		};

		return that;
	};

	module.exports = iScrollable;
});