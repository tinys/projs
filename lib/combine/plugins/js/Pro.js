/**
 * pro.js
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-05-30 14:58:28
 * @version $Id$
 */
(function(module){
  var fs = require('fs'),
    path = require('path'),
    uglify = require('uglify-js'),
    STK = require('./STK'),
    util = require('../../util');

  var regRequire = /require\s*\(\s*(['|"])([\w\-\.\/\@]+)\1\s*\)\s*?/gi, 
    reg = /\$Import\s*\(\s*(['|"])([\w\-\.\/\@]*)\1\s*\)\s*;?/gi,
    regRequireTemp = /requireTop\s*\(\s*(['|"])([\w\-\.\/\@]+)\1\s*\)\s*?/gi;
  path.existsSync = fs.existsSync ? function(uri) {
    return fs.existsSync.call(fs, uri)
  } : path.existsSync;


  var filePathArray = [];

  /**
   * h获取索引
   * @param   {[type]}  str  [description]
   * @return  {[type]}       [description]
   */
  function getKey(str,Opts){
    var index;
    str = path.normalize(str);
    index = filePathArray.indexOf(str);
    if(index == -1){
      filePathArray[index = filePathArray.length] = str;
    }

    // 去除JS工程路径
    str = str.replace(Opts.baseDir,'');

    // 去除自带的pro_modules工程路径
    str = str.replace(path.normalize(__dirname+'../../../../framework/pro_modules'),'*');

    // 去掉上级目录
    str = str.replace(path.normalize(__dirname+'../../../../framework/'),'./*/');

    return Opts.isMini ? index: '"'+str+'"';
  }

  /**
   * getPath
   */
  function getKeyPath(key,Opts){
    var uri = path.normalize(Opts.baseDir+'/pro_modules/'+key+'/index.js');

    if(!path.existsSync(uri)){
      uri = path.normalize(Opts.baseDir+'/pro_modules/'+key+'.js');
    }

    if(!path.existsSync(uri)){
      uri = path.normalize(__dirname+'../../../../framework/pro_modules/'+key+'/index.js')
    }

    if(!path.existsSync(uri)){
      uri = path.normalize(__dirname+'../../../../framework/pro_modules/'+key+'.js')
    }

    if(!path.existsSync(uri)){
      uri = path.normalize(__dirname+'../../../../framework/'+key+'.js')
    }

    return uri;
  }

  /** 
   * 打包方法
   * @param  {[Object]} fileMap    [要打包的文件列表]，可以为空
   * @param  {[Opts]} Opts       [配置参数]
   * @param  {[Object]} beCombined [已经打过的文件列表]
   */
  function combine(fileMap,Opts,beCombineMap,key){
    var defaultCode = '';
    var filePath = Opts.file.path,
      codeStr = defaultCode,
      requirekeys = [],
      codeStr = fileMap[filePath] || util.getFileCodeStr(filePath,Opts), 
      matchArr = codeStr.match(regRequire),
      isStrict = codeStr.match(/define\s*\(/gi) && codeStr.match(/define\s*\(/gi).length,
      baseDir = Opts.baseDir;

    // 如果没有define时，添加一个
    if(!isStrict && key != 'pro'){
      codeStr = 'define (function(module){'+codeStr+'});';
    }

    codeStr = codeStr.replace(/define\s*\(/gi, 'define(' + getKey(filePath,Opts) + ',');

    if (matchArr && matchArr.length) {
      matchArr.forEach(function(key) {
        var baseKey = key,
          key = baseKey.replace('require', 'requireTop'), 
          importKey;
        requirekeys.push(key);
        if (importKey = util.getImportValue(key)) {
          var relativePath,
            isStrKey = !/\//gi.test(importKey);
          if(isStrKey){
            relativePath = getKeyPath(importKey,Opts);
          }else{
            relativePath = util.getRelativePathByKey(importKey,filePath);
          }
          codeStr = codeStr.replace(baseKey, 'require(' + getKey(relativePath,Opts)+ ')');
        }
      });
    }

    if(requirekeys.length){
      codeStr = requirekeys.join('') + codeStr;
    }

    beCombineMap[filePath] = 1; // 已经合并过了

    return codeStr.replace(regRequireTemp,function(){
      var key = arguments[2];
      if (key) {
        var uri,
          isStrKey = !/\//gi.test(key);

        if(isStrKey){
          uri = getKeyPath(key,Opts);
        }else{
          uri = util.getAbsolutePathByKey(key,filePath);
        }

        Opts.file.path = uri;
        return beCombineMap[uri] == 1 ? '' : combine(fileMap,Opts,beCombineMap,key)+'\n';
      }
    });
  }

  module.exports = {
    combine: combine,
    params: {
      "lib" : {
        name: "包路径"
      }
    }
  };
})(module);