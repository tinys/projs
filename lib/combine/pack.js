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
      'less': require('./plugins/css/less'),
      "import": require('./plugins/css/import')
    },
    "js": {
      "import": require('./plugins/js/STK'),
      "require": require('./plugins/js/Pro')
    }
  };

  module.exports = pack;
})(module);