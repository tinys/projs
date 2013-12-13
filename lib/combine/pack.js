/**
 * pack.js
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-06-17 14:58:19
 * @version $Id$
 */
(function(module) {
  var pack = {
    "css": {
      "default": require('./plugins/css/import'),
      'less': require('./plugins/css/less'),
      'sass': require('./plugins/css/sass')
    },
    "js": {
      "default": require('./plugins/js/default'),
      "import": require('./plugins/js/STK'),
      "projs": require('./plugins/js/Pro')
    },
    add: function(type, name, app) {
      pack[type][name] = app;
    },
    remove: function(type,name){
      pack[type][name] = null;
    }
  };

  module.exports = pack;
})(module);