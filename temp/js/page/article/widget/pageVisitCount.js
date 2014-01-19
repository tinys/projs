// 更新访问量
define(function(module){
	var updatePageVisitCount = require('../../../module/pageVisitCount/update/index');

	module.exports = {
		init: function(){
			var obj = updatePageVisitCount({
				id: $SCOPE.id
			});
			obj.init();
		}
	};
});