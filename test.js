(function(module) {
	var server = require('./index');
	try{
		server.stop();
	}catch(e){}
	server.start();
	
	// server.pack.install('https://raw.github.com/stri/projs_plugins_manage/master/test.js');
})(module)