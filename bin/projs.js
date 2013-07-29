#!/usr/bin/env node
var projs = require('../index');
var argv = require('optimist').argv;
var task = require('../lib/task');

task.on('setConfig',function(data) {
  if(data.code == '2'){
    console.log('\n  Error: '+data.msg+'\n');
  }
});

// 配置
if(argv.c || argv.config){
  var conf = '';
  if(argv._.length == 2){
    return projs.setConfig(argv._[0],argv._[1]);
  }else if(argv._.length == 1){
    var conf = projs.getConfig(argv._[0]);
    return conf;
  }else{
    console.log('\nprojs\'s config is:\n');
    conf = projs.getConfig();
    return console.log(JSON.stringify(conf).replace(/{|}/gi,'\n  ').replace(/\,\"/gi,'\n\n  "'));
  }
}

// 开启
if(argv._[0] == 'start' || argv.start){
  projs.start();
  return;
}

// 停止
if(argv._[0] == 'stop' || argv.stop){
  projs.stop();
  return;
}

if(argv.h || argv.help){
  return console.log(getDefaultText());
}

console.log(getDefaultText());

function getDefaultText(){
  var text = [];
  var conf = projs.getConfig();
  text.push('Usage: projs <command>');
  text.push('');
  text.push('where <command> is one of :');
  text.push(' '+Object.keys(conf).join(','));
  text.push(' ');
  text.push('projs -h       quick help on!');
  text.push('projs -c       display full config');
//  text.push('projs -v       quick display projs\'s version');
  text.push('projs -help    help on!');
  text.push('projs -start   start server!');
  text.push('projs -stop    stop server!');
  text.push('projs start    start server!');
  text.push('projs stop     stop server!');
//  text.push('projs -version display projs\'s version');

  return text.join('\n');
}