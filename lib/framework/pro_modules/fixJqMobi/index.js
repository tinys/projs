/**
 * fix jQ.Mobi的一些api
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-11-29 19:00:03
 * @version $Id$
 */
define(function(){
	$.type = $.type || function(obj){
		return typeof obj;
	};
	$.inArray = $.inArray || function(a,arr){
		return arr.indexOf(a);
	};
	$.makeArray = $.makeArray || function(list){
		var re = [];
		for(var i = 0; i< list.length;i++){
			re.push(list[i]);
		}
		return re;
	};
});

