/**
 * Pro.js core
 * @authors Stri (Stri@gmail.com)
 * @date    2013-05-24 12:55:44
 * @version 1.0
 */
;(function(win){
  var // define Module Param 
    define,
    require,
    Pro = {},
    _prefix = 'pro',
    moduleList = {};

  // version
  Pro.version = '1.0';

  // prefix
  Pro.prefix = _prefix;

  /*
   * define a Module
   * @param id {String} module's id
   * @param callback {Function || object} define function or object for this module
   */
  define = function(id,callback){
    var args = arguments,
      _id = _prefix+''+id;

    // if arguments's length !=2
    if(args.length != 2){
      console.error('Module define error');
    }

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
      try{
        callback.apply(win,[module,module.exports,require]);
      }catch(e){
        console.log(module,module.exports,callback);
        console.error(_id,' Module exports error: ',e.message);
      }
    }

    moduleList[_id] = module;
  };

  /*
   * require a Module 
   * @param id {String} Module's id
   */
  require = function(id){
    var _id = _prefix+''+id,
      _module = moduleList[_id];
    return _module && _module.exports;
  };

  // api
  Pro.define = define;
  Pro.require = require;
  Pro.moduleList = moduleList;
  Pro._Pro = win.Pro || null;

  // global api
  win.define = win.define || Pro.define;
  win.require = win.require || Pro.require;
  win.Pro = Pro;

})(window);
