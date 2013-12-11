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

		var compressPath = {
			js: config.js_compress_path ? config.js_compress_path.split(',') : false,
			css: config.css_compress_path ? config.css_compress_path.split(',') : false
		};

		var fileTypes = {
			js: config.js_file_type ? config.js_file_type.split(',') : false,
			css: config.css_file_type ? config.css_file_type.split(',') : false
		};

		console.log('\033[01;37mprojs\033[0m','\033[01;32mstart...\033[0m',compressPath);

		var _compress = function(data){
			var files = dirWalk(to,null,fileTypes),
				errorMsg = [],
				len = files.js.length + files.css.length,
				fileMap = {},
				startTime = new Date().getTime();

			// // 读取
			// ['js','css'].forEach(function(fileType){
			// 	// 读取文件
			// 	files[fileType].forEach(function(uri) {
			// 		uri = path.normalize(uri);
			// 		try{
			// 			var code = fs.readFileSync(uri,'utf-8');
			// 			fileMap[uri] = util.getSourceByCompress(code,{
			// 				config: config,
			// 				file:{
			// 					path: uri,
			// 					type: fileType
			// 				},
			// 				isMini: config[fileType+'_compress'] == 'true'
			// 			});
			// 		}catch(e){
			// 			var msg = 'error '+uri+' '+e.message
			// 			console.log(msg);
			// 			errorMsg.push(msg);
			// 		}
			// 		console.log('read',uri);
			// 	});
			// });

			// console.log('read file time diff is :', (new Date().getTime() - startTime).toFixed(4)/1000 +'s');

			// 压缩
			[{
				type: 'js',
				contentType: 'application/x-javascript;Charset=utf-8'
			},{
				type: 'css',
				contentType: 'text/css;Charset=utf-8'
			}].forEach(function(file){


				files[file.type].forEach(function(uri) {
					var lastTime = new Date().getTime(),
						_uri = uri.replace(to,'');

					if(compressPath[file.type] && !isCompressFilePath(_uri,compressPath[file.type],file.type)) return;
					try{
						combine(fileMap,{
							config: config,
							file: {
								path: uri,
								contentType: file.contentType,
								type: file.type
							}
						},function(code){
							fs.writeFileSync(uri,code);
						});
					}catch(e){
						var msg = e.message;
						console.log('\033[22;37mprojs\033[0m','\033[01;32mCompress\033[0m','\033[22;31mError \033[0m',_uri);
						errorMsg.push({
							uri: uri,
							_uri: _uri,
							msg: msg.replace(to,'')
						});
					}
					console.log('\033[01;37mprojs\033[0m','\033[01;32mCompress\033[0m','\033[01;33m'+((new Date().getTime() - lastTime)/1000).toFixed(3) +'s\033[0m',_uri);
				});
			});

			// 如果有错误时
			if(errorMsg.length){
				console.log('\033[01;37mprojs\033[0m','\033[22;31mCompress fail');
				console.log(errorMsg.length+' Error:');
				errorMsg.forEach(function(msg){
				 	console.log(msg._uri+':\n\t'+msg.msg);
				});
				console.log('\033[0m');
			}else{
				execute('chmod',['777',to,'-R'],{
					onComplete: function(){
						console.log('Compress success!');
						console.log('Compress '+len+' files\'s time is', ((new Date().getTime() - startTime)/1000).toFixed(3)+'s');	
					}
				});
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

	/**
	 * 不打包
	 * @return  {Boolean}  [description]
	 */
	function isCompressFilePath(uri,files,type){
		var re = false;

		if(files.length){
			files.forEach(function(value){
				if(uri.indexOf(type+''+value) != -1){
					re = true;
				}
			});
		}

		return re;
	}

	module.exports = {
		compress: compress,
		svnExport: svnExport,
		removeFolder: removeFolder,
		execute: execute
	};
})(module);