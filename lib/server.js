/**
 * sever node服务环境
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-05-30 11:34:51
 * @version 0.1
 */

(function(module) {
  var express = require('express'),
    parseParam = require('./util/parseParam'),
    path = require('path'),
    cluster = require('cluster'),
    combine = require('./combine/index');

  module.exports = createProjectServer;

  var pid;

  process.on('SIGINT', function(err) {
    console.log('kill process pid:'+pid);
    process.kill(pid);
    process.exit(0);
  });

  /** 
   * 创建一个工程服务器
   * @param  {Object} Opts [配置参数]
   */
  function createProjectServer(Opts){
    var that = {},
      init,
      bindEvent,
      config,
      app,
      destory;
    config = getProjectParam(Opts); // 参数
    app = express();

    // 内部逻辑
    bindEvent = function(){
    };

    /**
     * start process
     */
    function start(){
      if(pid){
        process.kill(pid);
      }
      app.use(app.router);
      app.use(addRequestListen);
      process.title = "前端开发环境projs";
      pid = process.pid;

      if(config.root){
        app.use(express['static'](config.root));
        app.use(express['directory'](config.root));
      }
      
      app.listen(config.port);
    }

    /** 
     * stop process
     * @return  {[type]}  [description]
     */
    function stop(){
      app.abort();
      if(pid){
        process.kill(pid);
        process.exit(0);
      }
    }

    /**
     * 监听express的request
     */
    function addRequestListen(req,res,next){
      var fileType = getFileCombineType(req.url,config);

      if(fileType.status){
        res.header("Content-type",fileType.contentType);

        var newConfig = parseParam(config);

        // 合并
        res.write(combine({
          config: newConfig, // 配置参数
          file : {
            path: path.normalize(newConfig.root+req.url.split('?')[0]),// 路径
            type: fileType.type,
            contentType: fileType.contentType
          },
          req: 0,
          res: 0
        }));

        return res.end();
      }else{
        next();
      }
    }

    /**
     * 获取projectDataParam
     * @param {Object} [全局配置参数]
     */
    function getProjectParam(config){
      return parseParam({
        root : "/",
        port : 8080,
        origin: config
      },config);
    }

    /**
     * 获取文件类型
     * @param  {String} filePath [文件路径]
     * @param {String} [charset] [编码]，默认为utf-8
     */
    function getFileCombineType(uri,config){
      var type,
        uri = uri.toLowerCase().split('?')[0],
        len = uri.length,
        hash = {};

      uri = uri.split('.').reverse();

      if(uri[0] == 'js'){
        type = "js";
      }else if(uri[0] == 'css'){
        type = "css";
      }else{
        type = false;
      }

      if(type){
        var charset = config.origin[type+'_charset'] || 'UTF-8';
        charset = charset.toUpperCase();
        hash.js = "application/x-javascript;Charset="+charset;
        hash.css = "text/css;Charset="+charset;
      }

      return {
        status: !!type,
        type: type,
        contentType: hash[type]
      };
    }

    // destroy;
    destroy = function(){
      app.abort();
    };

    // 定义初始化
    init = function(){
      bindEvent();
    };

    // 初始化
    init();

    that.destroy = destroy;
    that.start = start;
    that.stop = stop;
    
    return that;
  }

})(module);