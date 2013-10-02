/**
 * 工程web routes
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-06-14 14:35:37
 * @version $Id$
 */ (function(module) {
  var path = require('path');
  var config = require('../config');
  var task = require('../task')();
  var jsPath = path.normalize(__dirname + '/js/');
  var cssPath = path.normalize(__dirname + '/css/');

  function pageRoutes(req, res, next) {
    var pagename = req.params.pagename;
    if (pagename) {
      res.render(pagename, {
        title: '测试',
        site: req.url
      });
    } else {
      res.end('没有这个页面。');
    }
  };

  var apiRule = {};

  // 获取list
  apiRule['getTaskList'] = function(req){
    return task.getTaskList();
  };

  // 添加
  apiRule['register'] = function(req){
    return task.register(req.param);
  };

  // 移除
  apiRule['unRegister'] = function(req){
    var id = req.param('id',null);
    return id && task.unRegister(id);
  };

  // 获取
  apiRule['getTask'] = function(req){
    var id = req.param('id',null);
    return id && task.getTask(id);
  };

  // 设置
  apiRule['setTask'] = function(req){
    var id = req.param('id',null);
    return id && task.setTask(id);
  };

  // 获取参数列表
  apiRule['getPackParamList'] = function(req){
    return task.getPackParamList();
  }

  // 根据参数获取getPackParamByStyle
  apiRule['getPackParamByStyle'] = function(req){
    var type = req.param('style',null);
    return type && task.getPackParamByStyle(type);
  }

  /**
   * api接口
   */
  function apiRoutes(req, res, next) {
    var apiname = req.params.apiname,
      _apiFn,
      data = {};
    data["code"] = "A0001";
    data["msg"] = "";

    // JSON格式
    res.writeHead(200, {
      contentType: 'application/json;charset=utf-8;'
    });

    // 如果是可用接口
    if (!!(_apiFn = apiRule[apiname.split('.json')[0]])){
      var apiData = _apiFn(req);
      if(apiData){
        data['data'] = apiData;
      }else{
        data["code"] = "A0003";
        data["msg"] = "参数不正确";
      }
    }else {
      data["code"] = "A0002";
      data["msg"] = "接口异常";
    }

    res.write(JSON.stringify(data));
    res.end();
  }


  module.exports = {
    html: pageRoutes,
    api: apiRoutes
  };
})(module);