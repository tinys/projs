/**
 * Pro.js core
 * @authors Stri (Stri@gmail.com)
 * @date    2013-05-24 12:55:44
 * @version 1.0
 */
;(function(win){
  var // define Module Param 
    define,
    require
    moduleList = {};

  /*
   * define a Module
   * @param id {String} module's id
   * @param callback {Function || object} define function or object for this module
   */
  define = function(id,callback){
    var args = arguments;

    // if arguments's length !=2 or id in moduleList
    if(args.length != 2 || (id in moduleList)){
      console.error('Module define error:'+(args.length == 2 ? "conflict." : "param."));
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
        callback.call(win,module,module.exports,require);
      }catch(e){
        console.error(id,' module is error: ',e.message);
      }
    }

    moduleList[id] = module;
  };

  /*
   * require a Module 
   * @param id {String} Module's id
   */
  require = function(id){
    return moduleList[id].exports;
  };

  win.define = win.define || define;
  win.require = win.require || require;
})(window);
