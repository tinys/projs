/**
 * pack.js
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-06-17 14:58:19
 * @version $Id$
 */
(function(module) {
  var pack = {
    "version": "0.0.2",
    "css": {
      "default": require('./plugins/css/import'),
      'less': require('./plugins/css/less'),
      'sass': require('./plugins/css/sass')
    },
    "js": {
      "default": require('./plugins/js/default'),
      "import": require('./plugins/js/STK'),
      "projs": require('./plugins/js/Pro')
    }
  };

  module.exports = pack;
})(module);