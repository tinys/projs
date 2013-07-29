/**
 *  projs 主js
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-07-29 10:36:35
 * @version 0.0.1
 */
var conf = require('./lib/config');
var server= require('./lib/server');
var httpd;

module.exports = {
  start: function () {
    var config = conf.getConfig();
    httpd = httpd ? httpd : server(config);
    
    httpd.start()
  },
  stop: function(){
    return httpd && httpd.stop();
  },
  setConfig: conf.setConfig,
  getConfig: conf.getConfig
};