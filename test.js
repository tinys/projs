(function(module) {
  var server = require('./index');
  var fs = require('fs');
  var path = require('path');
  var combine = require('./lib/combine/index');
  var dirWalk = require('./lib/util/dirWalk');
  var task = require('./lib/util/task');
 // server.start();
 	
 	var workSpace = '/Users/mac/Documents/sina_video_space/live_c/live_c/trunk';
 	var compressSpace = server.getConfig().root+'/test3'
 	var config = server.getConfig();

 	task.compress(workSpace,compressSpace,config);
})(module)