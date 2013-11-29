/**
 * Pro 3.1版本
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-11-27 17:12:02
 * @version $Id$
 */
;(function(win){
  var Pro = {},
    _prefix = 'pro'+(new Date().getTime()),
    _init,
    moduleList = {},
    scriptReady = ScriptReady(),
    origin = {
      define: win.define,
      require: win.require
    };

  // prefix
  Pro.prefix = _prefix;

  /*
   * define a Module
   * @param id {String} module's id
   * @param dependencies {Array} 依赖[可选]
   * @param callback {Function || object} define function or object for this module
   */
  define = function(id,dependencies,callback){
    var args = arguments,
      _id = _prefix+'_'+id;

    // if arguments's length !=2
    if(args.length != 2){
      console.error('Module define error');
    }

    callback = dependencies;

    // if id in moduleList
    if(_id in moduleList){
      return;
    }

    // 默认module属性
    var module = {
      id: id,
      exports: {}
    };

    // if is object, the module's exports == callback;
    if(typeof callback == 'object'){
      module.exports = callback;
    }else{
      scriptReady.add(function(){
      	try{
      		callback.apply(win,[module,module.exports,require]);
      	}catch(e){
      		console.error(_id+': ',e.message);
      	}
      });
    }

    moduleList[_id] = module;
  };

  /*
   * require a Module 
   * @param id {String} Module's id
   */
  require = function(id){
    var _id = _prefix+'_'+id,
      _module = moduleList[_id];
    return _module && _module.exports;
  };

  /**
   * 基础框架是否加载完
   * @param   {[type]}  calllback  [description]
   * @return  {[type]}             [description]
   */
  function ScriptReady(callback){
  	var arr = [],
  		isFire;

  	return {
  		add: function(callback){
  			if(isFire){
  				callback();
  			}else{
  				arr.push(callback);
  			}
  		},
  		fire: function(){
  			var fn;

  			while(fn = arr.shift()){
  				fn();
  			}

  			isFire = true;
  		}
  	};
  }

  /**
   * 是否有responsive标签
   * @return  {Boolean}  [description]
   */
  function hasResponsive(){
  	var i = 0,
  		re,
  		nodes = document.getElementsByTagName('meta');

  	for(; i < nodes.length;i++){
  		if(nodes[i].name == 'responsive'){
  			re = true;
  		}
  	}

  	return true;
  }

  /**
   * 初始化
   * @return  {[type]}  [description]
   */
  function init(){
  	scriptReady.fire();
  }

  // api
  Pro.define = define;
  Pro.require = require;
  Pro.init = init;

  // 如果页面已存在，则fire
  if(win.Pro || !hasResponsive()){
  	Pro.init();
  }

  // 私有属性(for 兼容CMD和AMD规范)
  Pro.define.pro = Pro.require.pro = {
    version: '3.1',
    origin: origin,
    _Pro: win.Pro || null
  };

  win.Pro = win.Pro || Pro;
  win.define = win.define || Pro.define;
  win.require = win.require || Pro.require;
})(window);

(function(){
  var isIE = /msie/.test(navigator.userAgent.toLowerCase()),
    scriptURL = getDocumentResponsiveMode()[isIE ? 'IE' : '!IE'],
    scriptCallback = [],
    isBindScript = false,
    isScriptReady = false;

  // 如果没有script  URL
  if(!scriptURL){
    isScriptReady = true;
  }

  /**
   * 获取文档的响应式模式
   * @return  {[type]}  [description]
   */
  function getDocumentResponsiveMode(){
    var nodes = document.getElementsByTagName('meta'),
      contents,
      keys
      re = false;
      i = 0,
      j = 0;
    for(;i < nodes.length;i++){
      if(nodes[i].name == 'responsive'){
        re = {};
        contents = nodes[i].content.split(',');
        for(; j < contents.length;j++){
          keys = contents[j].split('=');
          re[keys[0]] = keys[1]
        }
        nodes[i].name = 'responsive-loaded';
      }
    }
    return re;
  }

  /**
   * 加载script
   * @param   {[type]}    url       [description]
   * @param   {Function}  callback  [description]
   * @param   {[type]}    charset   [description]
   * @return  {[type]}              [description]
   */
  function loadScript(url,callback,charset){
    var that,
      init,
      headNode = document.getElementsByTagName('head')[0],
      scriptObjOnload,
      createScript;

    // create script object
    createScriptObj = function(Opts){
      var Opts = Opts || {},
          charset = Opts.charset || 'UTF-8',
          url = Opts.url,
          re;
         
         re = document.createElement('script');
         re.type = "text/javascript";
         re.src = url;
         re.charset = charset;
       return re;
    };

    // script onload callback
    scriptObjOnload = function(node,callback){
      if( isIE && node['onreadystatechange']){
        node['onreadystatechange'] = function(){
          if(node.readyState.toLowerCase() == 'loaded' || node.readyState.toLowerCase() == 'complete') {
            try{
              node['onreadystatechange'] = null;
            }catch(e){}
             
            try{
              callback();
            }catch(e){}
          }
        };
      }else{
        node['onload'] = node['onerror'] = function(){
          try{
            callback();
          }catch(e){
          }
        };
      }

      headNode.appendChild(node);
    };

    scriptObjOnload(createScriptObj({
      url: url,
    }),callback);
  }
  
  loadScript(scriptURL,function(){
    try{
      window.Pro.init();
    }catch(e){}
  });
})();
