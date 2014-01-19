// 构建与Chrome通信
define(function(module){
	var chromeMsg = require('CrossChromeMsg'),
		widget = require('widget');

	module.exports = {
		init: function(Opts){
			var that = widget(Opts),
				lists = [],
				isReady = false;

			that.channel.add('chrome/init/success',function(source){
				console.log('与Chrome插件通信链接成功！');
				isReady = true;
				var fn;
				while( fn = lists.shift()){
					try{
						fn();
					}catch(e){}
				}
			});

			that.channel.add('chrome/postMessage',function(){
				if (!isReady){
					list.push(function(){
						chromeMsg.postMessage.apply(chromeMsg,$.makeArray(arguments));
					});
				}else{
					chromeMsg.postMessage.apply(chromeMsg,$.makeArray(arguments));
				}
				
			});
			return that;
		}
	};
});