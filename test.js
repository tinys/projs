var config = require('./lib/config');
var cluster = require('cluster');
var express = require('express');

// config.getSetting(function(data) {
//   console.log(data['work_space_path']);
// });

// console.log(process.env);

 // console.log(process.versions);

 // console.log(process.pid);

// console.log(process.platform);

// console.log( process.uptime());

/*process.stdin.resume();  
process.stdin.setEncoding('utf8');  

process.on('exit',function(a,b){
  process.nextTick(function(){
    console.log('exit');
    console.log(a,b);
  });
});
process.stdin.on('data', function (chunk) {  
  process.stdout.write('data: ' + chunk);  
});  
  
process.stdin.on('end', function () {  
  process.stdout.write('end');  
})

process.on('SIGINT', function () {  
  console.log('Got SIGINT.  Press Control-D to exit.');  
});*/

// console.log(cluster.isMaster);

/*process.argv.forEach(function (val, index, array) {  
  console.log(index + ': ' + val);  
});*/

var config = require('./lib/config');
var server = require('./lib/server');

// config.getSetting(function(data){
//   server(data);
// });

// JSONFile.readFile('image_md5',function(data){
//   console.log('data',data);
// });
// 
// JSONFile.writeFile('image_md5','{"aaa":"b"}',function(err,data){
//   console.log('写入成功',err,data);
// });

var task = require('./lib/task')
  projectTask = task();

server(config.getSetting());
