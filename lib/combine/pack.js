/**
 * pack.js
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-06-17 14:58:19
 * @version $Id$
 */
(function(module) {
  module.exports = {
    "version": "0.0.1",
    "css": {
      "import": require('./plugins/css/import')
    },
    "js": {
      "import": require('./plugins/js/STK'),
      "require": require('./plugins/js/Pro')
    }
  };
})(module);