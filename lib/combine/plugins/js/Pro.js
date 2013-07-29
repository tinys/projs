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
    util = require('../../util');

  var regRequire = /require\s*\(\s*(['|"])([\w\-\.\/]+)\1\s*\)\s*?/gi, 
    regRequireTemp = /requireTop\s*\(\s*(['|"])([\w\-\.\/]+)\1\s*\)\s*?/gi;
  path.existsSync = fs.existsSync ? function(uri) {
    return fs.existsSync.call(fs, uri)
  } : path.existsSync;

  /** 
   * 打包方法
   * @param  {[Object]} fileMap    [要打包的文件列表]，可以为空
   * @param  {[Opts]} Opts       [配置参数]
   * @param  {[Object]} beCombined [已经打过的文件列表]
   */
  function combine(fileMap,Opts,beCombineMap){
    var defaultCode = '';

    // 如果beCombineMap为空
    if(Object.keys(beCombineMap).length == 0){
      defaultCode = util.getFileCodeStr(path.normalize(__dirname+'../../../../framework/pro.js'), Opts);
    }

    var filePath = Opts.file.path, 
      codeStr = fileMap[filePath] || util.getFileCodeStr(filePath,Opts), 
      matchArr = codeStr.match(regRequire),
      isStrict = codeStr.match(/define\s*\(/gi) && codeStr.match(/define\s*\(/gi).length,
      baseDir = Opts.baseDir;

    // 如果没有define时，添加一个
    if(!isStrict){
      codeStr = 'define (function(module){'+codeStr+'});\n';
    }

    codeStr = defaultCode + codeStr.replace(/define\s*\(/gi, 'define("' + filePath.replace(baseDir, '') + '",');

    if (matchArr && matchArr.length) {
      matchArr.forEach(function(key) {
        var baseKey = key,
          key = baseKey.replace('require', 'requireTop'), 
          importKey;

        codeStr = key + codeStr;

        if (importKey = util.getImportValue(key)) {
          var relativePath = util.getRelativePathByKey(importKey,filePath,baseDir);
          codeStr = codeStr.replace(baseKey, 'require("' + relativePath+ '")');
        }
      });
    }

    beCombineMap[filePath] = 1; // 已经合并过了
    return codeStr.replace(regRequireTemp,function(){
      var key = arguments[2];
      if (key) {
        var uri = util.getAbsolutePathByKey(key,filePath);
        Opts.file.path = uri;
        return beCombineMap[uri] == 1 ? '' : combine(fileMap,Opts,beCombineMap)+'\n';
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