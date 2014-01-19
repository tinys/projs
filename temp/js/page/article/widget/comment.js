// 评论组件
define(function(module){
	var comment = require('../../../module/comment/index');
	module.exports = {
		init: function(){
			var bodyer = $('.bodyer'),
				box = $('<div>'),
				that;
			box.attr('id','comment-content-box');
			bodyer.append(box);
			that = comment({
				box: box
			});

			if (window.$SCOPE && $SCOPE.id){
				that.http.addParam('id',$SCOPE.id);
			}
			that.init();
		}
	};
});