/**
 *  projs 主js
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-07-29 10:36:35
 * @version 0.0.1
 */
var conf = require('./lib/config');
var server= require('./lib/server');
var fs = require('fs');
var path = require('path');
var parseJSON = require('./lib/util/parseJSON');
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
  getPackage: function(){
    var data = fs.readFileSync(path.normalize(__dirname+'/package.json'), 'utf-8');
    return parseJSON(data);
  },
  setConfig: conf.setConfig,
  getConfig: conf.getConfig
};