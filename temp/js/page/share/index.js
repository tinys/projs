/**
 * 分享JS
 * @authors Stri (stri.vip@gmail.com)
 */
define(function(module) {
	var page = require('../index'),
		os = page.module.os,
		URL = require('URL'),
		json = require('JSON'),
		query = URL.parse(location.href).query,
		share = require('../../module/share/index');

	var shareObj = share({
		box: $('#pl-share-publish-box'),
		formData: json.queryToJson(query)
	});

	shareObj.init();
});