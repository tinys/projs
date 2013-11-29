/**
 * 状态结点组件
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-10-07 18:37:47
 * @version $Id$
 */
define(function(module){
  var $ET = require('easyTemplate'),
    widget = require('widget'),
    $builder = require('builder');

  /**
   * 状态结点组件
   * @param   {[type]}  Opts  [description]
   *  @param {Number} [mode] [模式，0为single模式，即在添加状态点时，会判断当前位置有没有，如果有，则先移除；当mode=1时
   *                         会先判断这个节点状态名称+位置，如果都符合，则移除]
   *  @param {Object} [tplCache] {模板list}
   *  @param {HTMLElement} [box] [容器]
   */
  module.exports = function(Opts){
     var that = {},
      init,
      conf,
      tplCache = {},
      currentName = '',
      nodeCache = {}, // 结点缓存
      bindEvent,
      destroy;

    conf = $.extend({
      mode: 0, // 默认为0,1时，single模式
      box: null,
      tplCache: {}
    },Opts);

    // 继承widget类
    that = widget(conf);

    // 模板缓存
    tplCache = conf.tplCache;

    /** 
     * setTemplate
     * @param  {[type]}  name  [description]
     * @param  {[type]}  tpl   [description]
     */
    function setTemplate(name,tpl){
      tplCache[name] = tpl;
    };

    /** 
     * getTemplate
     * @param   {[type]}  name  [description]
     * @return  {[type]}        [description]
     */
    function getTemplate(name){
      return tplCache[name];
    }

    /**
     * 获取状态结点
     * @param {String} [name] [名称]
     * @param {String} [position] [位置],默认为center
     */
    function getStateNode(name,position){
      position = position || 'center';
      return nodeCache[name+'_'+position] || null;
    }

    /**
     * 移除所有节点
     */
    function removeAll(){
      $.each(nodeCache,function(key,node){
        var _arr = key.split('_');
        that.remove({
          name: _arr[0],
          position: _arr[1]
        });
      });
    }

    /** 
     * 添加状态节点
     * @param {Object} [Opts] [description]
     *  @param {String} [name] [状态节点名称]
     *  @param {String} [position] [位置，默认为center]
     *  @param {Object} [source] [数据]
     *  @param {HTMLElement} [target] [相对的结点]
     */
    function addStateNode(Opts){
      var newHTML = '',
        box = that.getBox(),
        newNode,
        _hash,
        _id,
        _conf;

      // param
      _conf = $.extend({
        name: '',
        source: {},
        target: '',
        position: 'center'
      },Opts);

      // id
      _id = _conf.name+'_'+_conf.position;

      // 如果有id，先移除
      if(nodeCache[_id]){
        that.remove(_conf);
      }

      if(conf.mode == 0){
        $.each(nodeCache,function(key){
          if(key && (key.split('_')[1] == _conf.position)){
            that.remove({
              name: key.split('_')[0],
              position: _conf.position
            });
          }
        })
      }

      // 新的HTML
      newHTML = $ET(that.getTemplate(_conf.name),$.extend({},conf.source,_conf.source || {})).toString();
      newNode = $builder(newHTML).box;
      newNode = $(newNode).children(1)[0];

      // cache
      nodeCache[_id] = newNode;

      // _hash
      _hash = {
        top: 'before',
        bottom: 'after',
        center: 'replaceWith'
      };

      if(_conf.target){
        $(_conf.target)[_hash[_conf.position]](newNode);
      }else if(box){
        $(box).append(newNode);
      }

      that.evt.add.fire({
        newNode: newNode,
        conf: _conf
      });
      return that;
    }

    /** 
     * 移除状态节点
     * @param {Object} [Opts] [description]
     *  @param {String} [name] [节点状态名称]
     *  @param {String} [position] [节点的位置，默认为center]
     */
    function removeStateNode(Opts){
      var _conf,
        _id;

      // param
      _conf = $.extend({
        name: '',
        position: 'center'
      },Opts);

      _id = _conf.name+'_'+_conf.position;

      if(!nodeCache[_id]) return;

      $(nodeCache[_id]).remove();
      
      that.evt.remove.fire(_conf);
      return that;
    }

    // bindEvent
    bindEvent = function(){};

    // destroy
    destroy = function(){};

    // init
    init = function(){
      bindEvent();
    };

    // api
    that.destroy = destroy;
    that.add = addStateNode;
    that.remove = removeStateNode;
    that.getStateNode = getStateNode;
    that.removeAll = removeAll;
    that.setTemplate = setTemplate;
    that.getTemplate = getTemplate;
    that.init = init;
    that.evt = {
      add: $.Callbacks(),
      remove: $.Callbacks()
    };

    return that;
  };
});
