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

  var webRoutes = require('./web/routes');
  module.exports = createProjectServer;
  var pid;

  process.on('SIGINT', function(err) {
    // console.log('kill process pid:'+pid);
    // 退出时，干掉
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
      
      app.use(app.router);
    //  app.set('views',__dirname+'/web/view')
    //  app.set('view engine', 'ejs');


    
      // 工程web
    /*
      app.get('/~/',function(req,res,next){
        res.redirect('/~/home');
      });
      app.get('/~/:pagename',webRoutes.html);
      app.get('/~/js/:jsname',addRequestListen);
      app.get('/~/css/:cssname',addRequestListen);
      app.use(addRequestListen);
    //  app.get('/~/image/:imagename',webRoutes.css);
      app.get('/~/api/:apiname',webRoutes.api);
*/
      app.use(addRequestListen);
      process.title = "iproject的进程";
      pid = process.pid;

      if(config.root){
        app.use(express['static'](config.root));
        app.use(express['directory'](config.root));
      }
      app.listen(config.port);
    };

    /**
     * 监听express的request
     */
    function addRequestListen(req,res,next){
      console.log(req.url);
      var fileType = getFileCombineType(req.url,config);


      if(fileType.status){
        res.header("Content-type",fileType.contentType);

        var newConfig = parseParam(config);

        // 本地CSS进行相应处理
        if(req.params && (req.params.cssname || req.params.jsname)){
          newConfig.root = __dirname+'/web/';
        }

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
        uri = uri.toLowerCase(),
        hash = {};

      if(uri.lastIndexOf('.js') !== -1){
        type = "js";
      }else if(uri.lastIndexOf('.css') !== -1){
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
    
    return that;
  }

})(module);