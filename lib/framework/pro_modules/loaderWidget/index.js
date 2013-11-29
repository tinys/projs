/**
 * 加载器
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-11-28 11:34:38
 * @version $Id$
 */
define(function(module){
	var parseParam = require('parseParam'),
		Callbacks = require('Callbacks'),
		loaderScriptStyle = require('loaderScriptStyle'),
		inVisibleArea = require('inVisibleArea'),
		lazyload = require('lazyload'),
		media = require('media'),
		widget = require('widget'),
		_widget = require('./widget/index');

	/**
	 * widget
	 * @return  {[type]}  [description]
	 */
	
	module.exports = function(Opts){
		var that,
			conf,
			init,
			define,
			widgets = [],
			widgetStack = [],
			_eventHash = {},
			_fireEventList = [],
			visibleWidgetStack = [],
			widgetLoadedStack = [],
			bindEvent,
			destroy;

		// param
		conf = parseParam({},Opts);

		that = widget(conf);
		that.media = media;

		/**
		 * 定义widget
		 * @param   {[type]}  widget  [description]
		 * @return  {[type]}          [description]
		 */
		define = function(widget){
			widgets.push(widget);
		}

    /** 
     * 判断类型是否为media类型
     * @return  {Boolean}  [description]
     */
    function isMediaEvent(type){
      return type.split('=').length > 1;
    }

    /** 
     * 监听模块加载事件
     * @param type {String} 事件类型
     * @param callback {Function} 回调
     */
    function addEvent(type,callback){
      var evt;
      if(typeof(type) == 'string'){
        
        // 支持多个事件类型
        if(type.split('|').length > 1){
          $.map(type.split('|'),function(time){
            that.addEvent(time,callback);
          });
          return;
        }
        evt = _eventHash[type] || (_eventHash[type] = Callbacks('once memory'));

        if($.isFunction(callback)){
          if(type == 'DOMContentLoaded'){
            $(document).ready(callback);
          }else{
            evt.add(callback);

            // 如果已经fire过的事件，则再次fire告诉
            if(that.isFiredEvent(type)){
              that.fireEvent(type);
            }
          }
        }
      }
    };

    /** 
     * 派发模块加载事件
     * @param type {String} 事件类型
     */
    function fireEvent(type){
      var evt;
      
      // 如果是media事件的
      if(isMediaEvent(type)){
        that.fireMediaEvent(type);
        return;
      }

      if(typeof(type) == 'string'){
        if($.inArray(type,_fireEventList) == -1){
          _fireEventList.push(type);
        }

        if(evt = _eventHash[type]){
          evt.fire();
        }
      }
    };

    /** 
     * 派发media事件
     * @param   {[type]}  type  [description]
     * @return  {[type]}        [description]
     */
    function fireMediaEvent(type){
      $.each(_eventHash,function(key,evt){
        // valid
        if(!isMediaEvent(key)) return;

        // 即当type发生必然导致key发生时 type=>key，或者者说 key包含了type
        if(that.media.isContain(key,type)){
          if($.inArray(type,_fireEventList) == -1){
            _fireEventList.push(key);
          }
          evt.fire();
        }
      });
    };
    
    /**
     * 判断类型是否fired
     * @param   {[type]}   type  [description]
     * @return  {Boolean}        [description]
     */
    function isFiredEvent(type){
      return $.inArray(type,_fireEventList) != -1;
    };

    /**
     * 初始化widget
     * @param   {[type]}  widget  [description]
     * @return  {[type]}          [description]
     */
    function initWidget(widget){
    	var conf = widget.getConfig(),
    		fn = function(){
    			try{
    				conf.exports(conf);
    			}catch(e){
    				console.log(e.message);
    			}
    		};

    	if(conf.initTime){
    		that.addEvent(conf.initTime,fn);
    	}else{
    		fn();
    	}
    }

    /**
     * 加载widget
     * @param   {[type]}  widget  [description]
     * @return  {[type]}          [description]
     */
    function loadWidget(widget,callback){
    	var conf = widget.getConfig(),
    			ajaxConf = [],
    			require = conf.require || [],
    			fn;
    	
    	// 转换成数组
    	require = $.isArray(require) ? require : [require];

    	// 如果已经加载过了，不在处理
    	if($.inArray(widget,widgetLoadedStack) != -1){
    		if($.isFunction(callback)){
    			callback();
    		}
    		return;
    	}

    	widgetLoadedStack.push(widget);

    	// 加载完的回调
    	fn = function(){
    		if($.isFunction(callback)){
    			callback();
    		}

    		// 初始化widget
    		that.initWidget(widget);
    	};

    	if(require.length){
    		// 添加到队列中
    		$.map(require,function(url,index){
    			ajaxConf.push({
    				url: url,
    				data: $.extend({},conf.requireParam && conf.requireParam[index])
    			});
    		})

    		// 加载script
    		loaderScriptStyle(ajaxConf,{
    			cache: true,
    			isDepend: conf.isDepend,
          onSuccess: fn
    		});
    	}else{
    		fn();
    	}
    }

		/**
		 * 开始加载
		 * @return  {[type]}  [description]
		 */
		function start(){     
      // 创建
      createWidgetToStack();
      // 按照优化级排序
      sortWidgetsByRate();

			var _stack = [].concat(widgetStack),
				widget,
				addWidgetListener = function(widget){
					var conf = widget.getConfig(),
						box = conf.box,
						fn = function(){
							loadWidget(widget);
						};

          // 监听事件
          if(conf.loadTime){
            that.addEvent(conf.loadTime,fn);
          }else if(box && inVisibleArea(box)){
            visibleWidgetStack.push(widget);
          }else if(box){
            // 延迟加载
            lazyload(box.node,fn);
          }else{
          	fn();
          }
				};

			// 遍历进行监听并处理加载(可视区别不进行监听)
			while(widget = widgetStack.shift()){
				var conf = widget.getConfig();
				if(conf.platform){
					if(that.media.isSupportMedia() && conf.media){
						that.addEvent(conf.media,function(){
							addWidgetListener(widget);
						});
					}else{
						addWidgetListener(widget);
					}
				}
			}

			// 首屏资源
      (function(){
        var widget,
            conf,
            args = arguments;
        if(widget = visibleWidgetStack.shift()){
        	conf = widget.getConfig();
        	if(conf.async){
        		loadWidget(widget);
        	}else{
        		loadWidget(widget,args.callee);
        	}
        }else{
        	that.channel.fire('load/firstViewLoaded');
        }
      })();
		}

		/**
		 * 对widgets进行排序
		 * @return  {[type]}  [description]
		 */
		function sortWidgetsByRate(){
      widgetStack.sort(function(a,b){
        return a.rate - b.rate < 0
      });
		}

		/**
		 * 创建widget
		 * @return  {[type]}  [description]
		 */
		function createWidgetToStack(Opts){
			var conf = that.getConfig();
			$.map([].concat(widgets).concat(conf.widgets),function(value){
				if(value){
					widgetStack.push(_widget(value));
				}
			});
		}

		// bindEvent
		bindEvent = function(){
      // 绑定DOMContentLoaded事件
      $(document).ready(function(){
        that.fireEvent('DOMContentLoaded');
      });

      // onload
      $(window).on('load',function(){
        that.fireEvent('onload');
      });
    };

		// destroy
		destroy = function(){};

		// init
		init = function(){
      bindEvent();
		};

		// api
		that.start = start;
		that.define = define;
		that.initWidget = initWidget;
		that.loadWidget = loadWidget;
		that.fireEvent = fireEvent;
		that.fireMediaEvent = fireMediaEvent;
		that.addEvent = addEvent;
		that.isFiredEvent = isFiredEvent;

    init();

		return that;
	};
});

