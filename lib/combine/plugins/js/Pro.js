/**
 * pro.js
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-05-30 14:58:28
 * @version $Id$
 */
(function(module) {
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


  var compressFileCache = {};
  var filePathKeys = [];
  var filePathCache = {};

  /**
   * 获取indexKey
   * @param   {[type]}  str  [description]
   * @return  {[type]}       [description]
   */
  function getIndexKey(str) {
    var indexKey = str;
    for (var key in filePathCache) {
      if (str.split(key).length > 1) {
        indexKey = key;
      }
    }
    return indexKey;
  }

  /**
   * 根据串获取其索引值，用于显示在打包的代码中
   * @param   {[type]}  str  [description]
   * @return  {[type]}       [description]
   */
  function getKey(str, Opts) {
    var index,
      key;

    str = path.normalize(str),
    indexKey = getIndexKey(path.normalize(Opts.file.path)),
    filePathCacheObj = filePathCache[indexKey] || {},
    filePathArray = filePathCacheObj.list || (filePathCacheObj.list = []);

    index = filePathArray.indexOf(str);
    key = filePathKeys.indexOf(str);

    if (key == -1) {
      filePathKeys[key = filePathKeys.length] = str;
    }

    if (index == -1) {
      filePathCacheObj.list[index = filePathArray.length] = str;
    }

    // 去除JS工程路径
    str = str.replace(Opts.baseDir, '');

    // 去除自带的pro_modules工程路径
    str = str.replace(path.normalize(Opts.config.origin.pro_module_path), '*');

    return Opts.config.origin.js_compress_level === 3 ? key : '"' + str + '"';
  }

  /**
   * 根据的文件的key获取文件的绝对path
   * @param {String} [key] [文件的key值]
   * @param {Object} [Opts] [配置文件]
   */
  function getKeyPath(key, Opts) {
    var keys = key.split('@'),
      name = keys[0],
      version = keys[1] || '',
      module_path = Opts.config.origin.pro_module_path;

    if (version) {
      version = '@' + version;
    }

    // 从项目目录获取index文件
    var uri = path.normalize(Opts.baseDir + '/pro_modules/' + name + '/index' + version + '.js');

    // 从项目目录获取key文件
    if (!path.existsSync(uri)) { 
      uri = path.normalize(Opts.baseDir + '/pro_modules/' + key + '.js');
    }

    // 从公共包目录获取index文件
    if (!path.existsSync(uri)) {
      uri = path.normalize(module_path + name + '/index' + version + '.js')
    }

    // 从公共包目录获取key文件
    if (!path.existsSync(uri)) {
      uri = path.normalize(module_path+ key + '.js')
    }

    return uri;
  }

  /** 
   * 打包方法
   * @param  {[Opts]} Opts       [配置参数]
   * @param  {[Object]} beCombined [已经打过的文件列表]
   */
  function combine(Opts, key) {
    var defaultCode = '';
    var filePath = Opts.file.path,
      indexKey = getIndexKey(Opts.indexKey),
      codeStr = defaultCode,
      requirekeys = [],
      key = key || '',
      matchArr,
      isStrict,
      baseDir;

    codeStr += util.getFileCodeStr(filePath, Opts),
    matchArr = codeStr.match(regRequire),
    isStrict = codeStr.match(/define\s*\(/gi) && codeStr.match(/define\s*\(/gi).length,
    baseDir = Opts.baseDir;

    // 如果没有define时，添加一个
    if (!isStrict && key.split('@')[0] != 'pro') {
      codeStr = 'define (function(module){' + codeStr + '});';
    }

    codeStr = codeStr.replace(/^define\s*\(/gi, 'define(' + getKey(filePath, Opts) + ',');

    if (matchArr && matchArr.length) {
      matchArr.forEach(function(key) {
        var baseKey = key,
          key = baseKey.replace('require', 'requireTop'),
          importKey;
        requirekeys.push(key);
        if (importKey = util.getImportValue(key)) {
          var relativePath,
            isStrKey = !/\//gi.test(importKey);
          if (isStrKey) {
            relativePath = getKeyPath(importKey, Opts);
          } else {
            relativePath = util.getRelativePathByKey(importKey, filePath);
          }
          codeStr = codeStr.replace(baseKey, 'require(' + getKey(relativePath, Opts) + ')');
        }
      });
    }

    if (requirekeys.length) {
      codeStr = requirekeys.join('') + codeStr;
    }

    filePathCache[indexKey] = filePathCache[indexKey] || {};
    filePathCache[indexKey]['beCombineMap'] = filePathCache[indexKey]['beCombineMap'] || {};
    filePathCache[indexKey]['beCombineMap'][filePath] = 1; // 已经合并过了

    return codeStr.replace(regRequireTemp, function() {
      var key = arguments[2];
      if (key) {
        var uri,
          isStrKey = !/\//gi.test(key);

        if (isStrKey) {
          uri = getKeyPath(key, Opts);
        } else {
          uri = util.getAbsolutePathByKey(key, filePath);
        }

        Opts.file.path = uri;
        return (filePathCache[indexKey]['beCombineMap'][uri] == 1) ? '' : combine(Opts, key) + '\n';
      }
    });
  }

  module.exports = {
    combine: function(Opts, callback) {
      var arr = Opts.file.path.split('/').reverse(),
        name = arr.shift();

      Opts.indexKey = arr.reverse().join('');

      if (Opts.hasOwnProperty('req') && /^index/gi.test(name) || (Opts.req && Opts.req.query && Opts.req.query.cache == 0)) {
        filePathCache = {};
        filePathCache[Opts.indexKey] = null;
        filePathCache[Opts.indexKey] = {
          list: [],
          beCombineMap: {}
        };
      }

      callback(combine(Opts));
    }
  };
})(module);