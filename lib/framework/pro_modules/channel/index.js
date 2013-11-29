/**
 * 频道模块（用于模块间的通信）
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-10-11 14:33:56
 * @version $Id$
 */
define(function(module) {
	var evts = {};

	module.exports = {
		/**
		 * 监听频道
		 * @param  {[type]}    channel   [频道名]
		 * @param  {Function}  callback  [description]
		 */
		add: function(channel, callback) {
			var evt = evts[channel] || (evts[channel] = $.Callbacks());
			evt.add(callback);
		},
		/**
		 * 取消监听
		 * @param   {[type]}    channel   [description]
		 * @param   {Function}  callback  [description]
		 * @return  {[type]}              [description]
		 */
		remove: function(channel, callback) {
			var evt = evts[channel] || (evts[channel] = $.Callbacks());
			evt.remove(callback);
		},
		/**
		 * 清空频道
		 * @param   {[type]}  channel  [description]
		 * @return  {[type]}           [description]
		 */
		empty: function(channel) {
			var evt = evts[channel] || (evts[channel] = $.Callbacks());
			evt.empty();
		},
		/**
		 * 触发频道
		 * @return  {[type]}  [description]
		 */
		fire: function() {
			var args = $.makeArray(arguments),
				channel = args.shift();
			try {
				evts[channel].fire.apply(evts[channel], args);
			} catch (e) {}
		},
		/**
		 * 给组件或对象绑定频道
		 * @param   {[type]}  base         [description]
		 * @param   {[type]}  channelList  [description]
		 * @return  {[type]}               [description]
		 */
		bind: function(base, channelList) {
			channelList = channelList || {};
			var _this = this;
			if (base && base.evt) {
				$.each(base.evt, function(key) {
					var name = channelList[key];
					if (name) {
						base.evt[key].add(function() {
							var args = [name].concat($.makeArray(arguments));
							_this.fire.apply(_this, args);
						});
					}
				});
			}
			return base;
		}
	};
});