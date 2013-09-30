/**
 * combine 合并CSS和JS
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-05-30 14:30:00
 * @version $Id$
 */
(function(module){
  var parseParam = require('../util/parseParam'),
    fs = require('fs'),
    util = require('./util'),
    path = require('path'),
    pack = require('./pack');

  /**
   * 合并
   * @param  {Object} fileMap [文件列表]
   * @param {Object} [Opts] [配置参数]
   */
  function combine(fileMap,Opts){
    // 如果没有fileMap
    if(arguments.length == 1){
      Opts = fileMap;
      fileMap = {};
    }

    var filePath = path.normalize(Opts.file.path),
      root = path.normalize(Opts.config.root),
      fileType = Opts.file.type,
      originConf = Opts.config.origin,
      packStyle = originConf.js_package_depend_style,
      baseDir = path.normalize(filePath.split('/'+fileType+'/')[0]),
      beCombineMap = {};
    // 设置JS或CSS的根目录
    Opts.baseDir = baseDir + '/'+fileType+'/';

    // 是否压缩
    Opts.isMini = originConf[fileType+'_compress'] == 'true';

    // 是否给CSS里的图片添加版本号
    Opts.addImageVersion = originConf['css_image_version'] == 'true';

    // 压缩后的注释
    Opts.commentText = originConf[fileType+'_comment_text'] == 'true';

    // 如果不支持，就报错
    if(fileType == 'js' && !pack[fileType][packStyle]){
      return "found out pack combine device about "+packStyle;
    }

    if(fileType == "css"){
      packStyle = "import";
    }

    return util.getSourceByCompress(pack[fileType][packStyle].combine(fileMap,Opts,beCombineMap),Opts);
  }


  module.exports = combine;
})(module);