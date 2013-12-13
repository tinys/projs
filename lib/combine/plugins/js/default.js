/**
 * 默认
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-05-30 18:20:43
 * @version $Id$
 */
(function(module){
  var fs = require('fs'),
    path = require('path'),
    util = require('../../util');

  /** 
   * 打包方法
   * @param  {[Object]} fileMap    [要打包的文件列表]，可以为空
   * @param  {[Opts]} Opts       [配置参数]
   * @param  {[Object]} beCombined [已经打过的文件列表]
   */
  function combine(fileMap,Opts,beCombineMap){
    var filePath = path.normalize(Opts.file.path), 
      codeStr = fileMap[filePath] || util.getFileCodeStr(filePath,Opts);
    return codeStr;
  }

  module.exports = {
    combine: function(fileMap,Opts,beCombineMap,callback){
      var code = combine(fileMap,Opts,beCombineMap);
      callback(code);
    }
  };
})(module);