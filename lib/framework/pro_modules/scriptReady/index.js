/**
 * 基础script加载完毕
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-11-28 13:02:04
 * @version $Id$
 */
define(function(module){
  /**
   * 添加响应式回调
   */
  function loader(){
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
	  	console.log('gogo')
	  	try{
	  		window.Pro.init();
	  	}catch(e){}
	  });
  };

  loader();
});

