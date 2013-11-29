/**
 * 按钮状态组件
 * @date 2013.10.28
 * @version 1.0
 */
define(function(module){
	var widget = require('widget');
	/** 
   * 按钮状态
   * @param {String} [nodeDataType] [判断状态并添加状态数据到这里的自定义标识，默认为action-data]
   * @param {String} [activeClass] [激活时的样式]
   * @param {String} [notActiveClass] [未激活时的样式]
   * @param {String} [activeHTML] [激活时的内部HTML]
   * @param {String} [notActiveHTML] [未激活的内部HTML]
   */
	module.exports = function(Opts){
    var that = {},
      init,
      conf,
      bindEvent,
      destroy;

    // param
    conf = $.extend({
      box: null,
      selector: '',
      nodeDataType: 'action-data',
      activeClass: '', // 激活的样式
      notActiveClass: '', // 没有激活的样式
      activeHTML: '', // 激活时的内部HTML
      notActiveHTML: '', // 没有激活时的内部HTML
      activeLoadingClass: '', // 中间状态的样式
      activeLoadingHTML: '', // 中间状态的内部HTML
      notActiveLoadingClass: '', // 中间状态的样式
      notActiveLoadingHTML: '' // 中间状态的内部HTML
    },Opts);

    that = widget(conf);

    /** 
     * 设置action-data
     * @param  {[HTMLElemnt]}  target  [目标节点]
     * @param  {[Object]}  data    [数据]
     */

    function setActionData(target, data, nodeType) {
    	var conf = that.getConfig();
      $(target).attr(nodeType || conf.nodeDataType, $.param(data));
    }

    /** 
     * 获取节点的action-data
     * @param   {[HTMLElemnt]}  target  [目标节点]
     */
    function getActionData(target,nodeType) {
    	var conf = that.getConfig();
      return $.queryToJson($(target).attr(nodeType || conf.nodeDataType) || '',true);
    }

    /** 
     * 重新设置action-data
     * @param   {[HTMLElemnt]}  target  [description]
     * @param   {[Object]}  data    [数据]
     */

    function resetActionData(target, data) {
      var originData = getActionData(target),
      	conf = that.getConfig();
      that.setActionData(target, $.extend(originData, data));
    }

    /** 
     * 设置节点状态
     * @param {HTMLElement} [target] [节点对象]
     * @param {Boolean}  status 
     */
    function setTargetStatus(target, status) {
      var buttonLoading = $(target).data('button.loading');
      var conf = that.getConfig();

      // 去除buttonLoading
      if(buttonLoading){
        $(target).data('button.loading',false);
      }

      if(status){
        conf.activeClass && $(target).addClass(conf.activeClass);
        conf.notActiveClass && $(target).removeClass(conf.notActiveClass);
      }else{
        conf.activeClass && $(target).removeClass(conf.activeClass);
        conf.notActiveClass && $(target).addClass(conf.notActiveClass);
      }

      that.evt.onChange.fire({
        target: target,
        status: !!status
      });
    }

    /** 
     * 根据节点，获取当前状态
     */
    function getTargetStatus(target) {
      return that.getActionData(target).status;
    }

    /** 
     * 设置节点为active节点
     */
    function setActiveTarget(target) {
      that.setActiveTargetHTML(target);
      that.setTargetStatus(target, true);
      that.resetActionData(target, {
        status: 1
      });
    }

    /** 
     * 设置已激活的HTML
     * @param  {[type]}  target  [description]
     */
    function setActiveTargetHTML(target){
    	var conf = that.getConfig();
      conf.activeHTML && $(target).html(conf.activeHTML);
    }

    /** 
     * 设置节点为unactive节点
     */
    function setNotActiveTarget(target) {
      that.setNotActiveTargetHTML(target);
      that.setTargetStatus(target, false);
      that.resetActionData(target, {
        status: 0
      });
    }

    /** 
     * 设置未激活的HTML
     * @param  {[type]}  target  [description]
     */
    function setNotActiveTargetHTML(target){
    	var conf = that.getConfig();
      conf.notActiveHTML && $(target).html(conf.notActiveHTML);
    }

    /**
     * 设置激活时的loadingr节点
     * @param  {[type]}  target  [description]
     */
    function setActiveLoadingTarget(target){
    	var conf = that.getConfig();
      $(target).data('button.loading',true); // 设置为loading
      that.setActiveLoadingTargetHTML(target);
      conf.notActiveLoadingClass && $(target).removeClass(conf.notActiveLoadingClass);
      conf.activeLoadingClass && $(target).addClass(conf.activeLoadingClass);
    }

    /**
     * 设置未激活时的loading节点
     * @param  {[type]}  target  [description]
     */
    function setNotActiveLoadingTarget(target){
    	var conf = that.getConfig();
      $(target).data('button.loading',true); // 设置为loading
      that.setNotActiveLoadingTargetHTML(target);
      conf.notActiveLoadingClass && $(target).addClass(conf.notActiveLoadingClass);
      conf.activeLoadingClass && $(target).removeClass(conf.activeLoadingClass);
    }

    /**
     * 设置激活时的loading效果
     * @param  {[type]}  target  [description]
     */
    function setActiveLoadingTargetHTML(target){
    	var conf = that.getConfig();
      conf.activeLoadingHTML && $(target).html(conf.activeLoadingHTML);
    }

    /**
     * 设置未激活时的loading效果
     * @param  {[type]}  target  [description]
     */
    function setNotActiveLoadingTargetHTML(target){
    	var conf = that.getConfig();
      conf.notActiveLoadingHTML && $(target).html(conf.notActiveLoadingHTML);
    }

    /**
     * 判断节点是否正在loading
     * @param   {[type]}   target  [description]
     * @return  {Boolean}          [description]
     */
    function isLoadingTarget(target){
      return $(target).data('button.loading') == true;
    }

    /**
     * [isActived description]
     * @return  {Boolean}  [description]
     */
    function isActivedTarget(target){
      return that.getTargetStatus(target) == 1;
    }

    /**
     * 获取容器
     * @return  {[type]}  [description]
     */
    function getBox(){
    	var conf = that.getConfig();
      return conf.box || document.body;
    }

    /** 
     * 根据数据查找节点
     * @param   {[type]}  key    [description]
     * @param   {[type]}  value  [description]
     * @return  {[type]}         [description]
     */
    function getTargetNodeByData(key,value){
    	var conf = that.getConfig();
      var box = that.getBox(),
        nodes = [];

      // 如果是对象
      if(typeof key == 'object'){
        $.each(key,function(name,value){
          nodes = nodes.concat(that.getTargetNodeByData(name,value));
        });
        return nodes;
      }

      var allNodes = that.getAllTargetNode();

      // 其它查找
      allNodes.each(function(index,node){
        var data = that.getActionData(node);
        if(data.hasOwnProperty(key) && data[key] == value){
          nodes.push(node);
        }
      });

      return nodes;
    }

    /** 
     * 获取所有状态节点
     * @return  {[type]}  [description]
     */
    function getAllTargetNode(){
    	var conf = that.getConfig();
      return $(conf.selector,$(that.getBox()));
    }

    // bindEvent
    bindEvent = function(){

    };

    // destroy
    destroy = function(){};

    // init
    init = function(){
      bindEvent();
    };

    // api
    that.destroy = destroy;
    that.getBox = getBox;
    that.setActionData = setActionData;
    that.getActionData = getActionData;
    that.resetActionData = resetActionData;
    that.setTargetStatus = setTargetStatus;
    that.getTargetStatus = getTargetStatus;
    that.isActivedTarget = isActivedTarget;
    that.setActiveTarget = setActiveTarget;
    that.setActiveLoadingTarget = setActiveLoadingTarget;
    that.setNotActiveLoadingTarget = setNotActiveLoadingTarget;
    that.setActiveLoadingTargetHTML = setActiveLoadingTargetHTML;
    that.setNotActiveLoadingTargetHTML = setNotActiveLoadingTargetHTML;
    that.isLoadingTarget = isLoadingTarget;
    that.setNotActiveTarget = setNotActiveTarget;
    that.setActiveTargetHTML = setActiveTargetHTML;
    that.setNotActiveTargetHTML = setNotActiveTargetHTML;
    that.getTargetNodeByData = getTargetNodeByData;
    that.getAllTargetNode = getAllTargetNode;
    that.init = init;
    that.evt = {
      onChange: $.Callbacks()
    };

    return that;
  };
});