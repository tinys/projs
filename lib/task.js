/**
 * task
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-06-14 10:34:44
 * @version 1.0
 * @example
 *   var iProjectTask = task();
 *   iProject.register({})
 */
(function(module) {
  var parseParam = require('./util/parseParam'),
    config = require('./config');

  function task(Opts){
    var that,
      init,
      Opts = Opts || {}, // default Options
      bindEvent,
      destroy;

    that = {};

    // 组件事件逻辑
    bindEvent = function(){
    };

    /** 
     * 注册任务
     * @param   {[Object]}  conf  [配置]
     */
    function register(conf){
      var newConfig = {};

      for(var key in conf){
        newConfig[key] = conf[key];
      }

      config.addProject(JSON.stringify(newConfig));
    }

    /** 
     * 解除注册
     */
    function unregister(id){
      config.removeProject(id);
    }

    /** 
     * 获取task
     * @param   {[string]}  name  [名称]
     */
    function getTask(id){
      return config.getProject(id);
    }

    /** 
     * 设置task
     * @param  {[String]}  name  [名称]
     */
    function setTask(id,conf){
      config.setProject(id,conf);
    }

    /** 
     * 获取所有task
     */
    function getTaskList(){
      return config.getProjects();
    }

    /** 
     * 获取打包参数列表
     */
    function getPackParamList(){
      return config.getPackParamList();
    }

    // 根据类型获取相应的style
    function getPackParamByStyle(type){
      return config.getPackParamByStyle(type);
    }

    // destroy = 
    destroy = function(){

    };

    // init
    init = function(){
      bindEvent();
    }

    that.register = register;
    that.unregister = unregister;
    that.getTask = getTask;
    that.setTask = setTask;
    that.getTaskList = getTaskList;
    that.getPackParamList = getPackParamList;
    that.getPackParamByStyle = getPackParamByStyle;

    init();

    return that;
  }


  module.exports = task;
})(module);