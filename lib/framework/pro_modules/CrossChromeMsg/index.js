/**
 * 构建页面与chrome插件的消息通信
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-10-16 12:20:56
 * @version 0.0.1
 */
define(function(module){

	/**
	 * [CrossChromeMsg description]
	 * @param  {[type]}  Opts  [description]
	 */
	function CrossChromeMsg(Opts){
		var that = {},
			init,
			conf,
			timer,
			_Event,
			_Target,
			status = 0, // 链接状态
			bindEvent,
			destroy;

		// param
		conf = $.extend({
			id: 'chrome-message-box',
			eventType: 'onChromeMessage'
		},Opts);

		/**
		 * 判断是否链接成功
		 * @return  {[type]}  [description]
		 */
		function isConnect(){
			return status == 1;
		}

		/**
		 * 创建事件
		 * @return  {[type]}  [description]
		 */
		function createCustEvent(){
			var _Event
			_Event = document.createEvent('Event');
			_Event.initEvent(conf.eventType, true, true);
			return _Event;
		}

		/**
		 * 添加自定义事件监听
		 */
		function createCustEventTarget(){
			var _Target;
			$(document.body).append(_Target = $('<div style="display:none;">'));
			_Target.attr('id',conf.id);
			return _Target;
		}

		/**
		 * 触发事件监听
		 * @param   {[type]}  data  [description]
		 * @return  {[type]}        [description]
		 */
		function fireCustEvent(data){
			that.stringifyMessage(data);

			if(!_Event){
				_Event = createCustEvent();
			}

			if(!_Target){
				_Target = createCustEventTarget();
			}
			
			_Target[0].dispatchEvent(_Event);
		}

		/**
		 * 解析消息结点
		 * @return  {[type]}  [description]
		 */
		function parseMessage(){
			var re = {};
			if(_Target){
				re.msgDataType = _Target.attr('msg-data-type');
				re.html = _Target.html();
			}

			if(re.msgDataType && re.msgDataType != 'param' && re.html){
				try{
					re.source = re.html ? JSON.parse(re.html) : null;
				}catch(e){}
			}

			if(_Target){
				_Target.attr('msg-data-type','');
				_Target.html('');
			}

			if(re.source && re.msgDataType){
				return $.extend({
					channel: null,
					data: null
				},re.source);
			}
		}

		/**
		 * 构建消息结点
		 * @return  {[type]}  [description]
		 */
		function stringifyMessage(data){
			if(_Target){
				_Target.attr('msg-data-type','param');
				_Target.text(JSON.stringify(data));
			}
		}

		/**
		 * 开始轮询消息
		 * @return  {[type]}  [description]
		 */
		function pollMessage(){
			clearInterval(timer);
			timer = setInterval(function(){
				var msg = that.parseMessage();
				if(msg){
					that.evt.onMessage.fire(msg.channel,msg.data);
				}
			},conf.pollTime);
		}

		/**
		 * 发送数据
		 * @param   {[type]}  channel  [description]
		 * @param   {[type]}  param    [description]
		 * @return  {[type]}           [description]
		 */
		function postMessage(channel,data){
			var args = arguments;
			if(!that.isConnect()){
				that.evt.onMessage.add(function(channel){
					if(channel == 'init/success'){
						args.callee.apply(that,[channel,data]);
						that.evt.onMessage.remove(arguments.callee);
					}
				});
				return;
			}
			that.fireCustEvent({
				channel: channel,
				data: data || {}
			});
		}

		// bindEvent
		bindEvent = function(){
			// 初始化成功
			that.evt.onMessage.add(function(channel,source){
				if(channel == 'init/success'){
					status = 1;
					that.evt.initSuccess.fire(source);
					that.evt.onMessage.remove(arguments.callee);
				}
			});
		};

		// destroy
		destroy = function(){
			clearInterval(timer);
			$(_Target).remove();
		}

		// init
		init = function(){
			_Target = createCustEventTarget();
			bindEvent();
			that.pollMessage();
		};

		// api
		that.destroy = destroy;
		that.isConnect = isConnect;
		that.postMessage = postMessage;
		that.pollMessage = pollMessage;
		that.parseMessage = parseMessage;
		that.stringifyMessage = stringifyMessage;
		that.fireCustEvent = fireCustEvent;
		that.evt = {
			initSuccess: $.Callbacks(),
			onMessage: $.Callbacks()
		};

		init();

		return that;
	}

	module.exports = CrossChromeMsg();
});