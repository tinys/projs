/**
 * task
 * @authors bangbang (bangbang@staff.sina.com.cn)
 * @date    2013-10-01 09:56:06
 * @version $Id$
 */
(function(module) {
	var path = require('path');
	var spawn = require('child_process').spawn;
	var exec = require('child_process').exec;
	var fs = require('fs');
	var path = require('path');
	var util = require('../combine/util');
	var combine = require('../combine/index');
	var dirWalk = require('./dirWalk');
	path.existsSync = fs.existsSync ? function(uri){
	  return fs.existsSync.call(fs,uri);
	} : path.existsSync;

	/**
	 * 压缩
	 * @param {String} [varname] [description]
	 * @return  {[type]}  [description]
	 */

	function compress(from, to, config, isEmpty) {
		from = from ? path.normalize(from+'/') : null;
		to = path.normalize(to+'/');

		// 如果没有目录，创建目录
		if(!path.existsSync(to)){
			execute('mkdir',['-p',to],{
				onComplete: function(data){
					compress(from,to,config,isEmpty);
				}	
			});
			return;
		}

		// 清空目录
		if(!isEmpty && from){
			removeFolder(to,{
				onComplete: function(){
					compress(from, to, config, true);
				}
			});
			return;
		}

		console.log('compress start....');

		var _compress = function(data){
			var files = dirWalk(to),
				errorMsg = [],
				len = files.js.length + files.css.length,
				fileMap = {},
				startTime = new Date().getTime();

			// 读取
			['js','css'].forEach(function(fileType){
				// 读取文件
				files[fileType].forEach(function(uri) {
					uri = path.normalize(uri);
					try{
						fileMap[uri] = util.getSourceByCompress(fs.readFileSync(uri,'utf-8'),{
							config: config,
							file:{
								type: fileType
							},
							isMini: true
						});
					}catch(e){
						var msg = 'error '+uri+' '+e.message
						console.log(msg);
						errorMsg.push(msg);
					}
					console.log('read',uri);
				});
			});

			console.log('read file time diff is :', (new Date().getTime() - startTime).toFixed(4)/1000 +'s');

			// 压缩
			[{
				type: 'js',
				contentType: 'application/x-javascript;Charset=utf-8'
			},{
				type: 'css',
				contentType: 'text/css;Charset=utf-8'
			}].forEach(function(file){
				files[file.type].forEach(function(uri) {
					var code,
						lastTime = new Date().getTime();
					try{
						code = combine(fileMap,{
							config: config,
							file: {
								path: uri,
								contentType: file.contentType,
								type: file.type
							}
						});
					}catch(e){
						var msg = 'error '+uri+' '+e.message
						console.log(msg);
						errorMsg.push(msg);
					}
					console.log('compress',uri,(new Date().getTime() - lastTime).toFixed(4)/1000 +'s');
					fs.writeFileSync(uri,code);
				});
			});

			// 如果有错误时
			if(errorMsg.length){
				console.log('compress fail');
				console.log(errorMsg.length+' error:');
				errorMsg.forEach(function(msg){
					console.log('  '+msg);
				});
			}else{
				console.log('compress success!');
				console.log('compress '+len+' files\'s time is', (new Date().getTime() - startTime).toFixed(4)/1000+'s');
			}
		};

		if(from){
			// 复制并压缩
			execute('cp', ['-rf',from, to], {
				onComplete: _compress
			});
		}else{
			_compress();
		}
	}

	/**
	 * SVN export
	 * @param   {[type]}  url       [description]
	 * @param   {[type]}  username  [description]
	 * @param   {[type]}  password  [description]
	 * @param   {[type]}  target    [description]
	 * @param   {[type]}  Opts      [description]
	 * @return  {[type]}            [description]
	 */
	function svnExport(url, username, password, target, Opts) {
		Opts = Opts || {};
		if(path.existsSync(target)){
			console.log('SVN export '+url+' ...\n'+'to '+target);
			removeFolder(target, {
				onComplete: function(data) {
					var params = ['export','--non-interactive','--force','--username',username,'--password',password,url,target];
					Opts.onProgress = function(data,code){
						data.toString().split('\n').forEach(function(msg){
							msg && console.log(msg);
						});
					};
					execute('svn',params,Opts);
				},
				onError: function(data){
					data.toString().split('\n').forEach(function(msg){
						msg && console.log(msg);
					});
				}
			});
		}else{
			console.log('found out '+ target);
			console.log('mkdir '+target);
			execute('mkdir',['-p',target],{
				onComplete: function(data){
					svnExport(url,username,password,target,Opts);
				}	
			});
		}
	}

	/**
	 * 清空文件
	 * @param   {[type]}    uri       [description]
	 * @param   {Function}  callback  [description]
	 * @return  {[type]}              [description]
	 */

	function removeFolder(uri, Opts) {
		execute('rm', ['-rf', uri], Opts);
	}

	/**
	 * 执行代码
	 * @param   {[type]}    cmd       [description]
	 * @param   {[type]}    params    [description]
	 * @param   {[type]}    Opts       [description]
	 */

	function execute(cmd, params, Opts) {
		Opts = Opts || {};
		var spawnedProcess = spawn(cmd, params);
		spawnedProcess.stdout.on('data', Opts.onProgress || function(){});
		spawnedProcess.stderr.on('data', Opts.onError || function(){});
		spawnedProcess.on('exit', Opts.onComplete || function(){});
	}

	module.exports = {
		compress: compress,
		svnExport: svnExport,
		removeFolder: removeFolder,
		execute: execute
	};
})(module);