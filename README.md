## projs

>基于`nodejs`的前端开发环境工具，包含了前端开发过程中的代码合并、代码压缩等功能，目的是使前端开发工程师更专注于代码上的开发和其它事上来。另外针对不同团队前端代码包的合并方式不同，增加扩展功能，用于自定义自己团队的包合并方式。更多功能，请查看功能列表。

#### 最新版本

`0.3.9` 	[更新历史及功能列表](https://github.com/stri/projs/issues/5)

    
#### 特色一：功能众多，使用简单


第一步、安装

	npm install projs -g
	
第二步、配置要启动服务的目录（此目录是http要访问的目录）

	projs root /Users/mac/Documents/projs-demo-workspace/ --config
	
第三步、配置CSS包合并的方式，默认为原生，如果你使用是的`LESS`预编译,则

	projs css_package_depend_style less --config
	
第三步、配置JS包合并的方式，默认为`default`(没有包的引用)，如果你使用的是`$import`的方式，则

	projs js_package_depend_style import --config
	
第四步、可以进行了开发了。

第五步、开发完之后，进入测试，并部署仿真环境

	projs js_compress true --config // 设置压缩JS
	projs css_compress true --config // 设置压缩CSS
	projs css_image_version true --config // CSS图片使用版本号
	projs css_cache true --config // 设置CSS缓存，只进行一次合并
	projs js_cache true --config // 设置JS缓存，只进行一次合并
	projs --start // 启动服务

第六步、打包上线

	projs js_compress_path /page/ // 设置JS要打包的目录，多个用逗号隔开
	projs css_compress_path /page/ // 设置css要打包的目录，多个用逗号隔开
	projs https://svn.xx.com/ /page/ --compress --username stri --password 123456
	
第七步、OK


#### 特色二：可扩展包的合并方式
	
> 供使用者进行打包方式扩展使用，可扩展自定义的包合并方法，具体参考：[https://github.com/stri/projs/issues/6](https://github.com/stri/projs/issues/6)

	porjs install http:xx.con/import.js

#### 特色三： `Pro.js`

> 可以像`nodejs`一样写前端JS，更多详情：[基本版](https://github.com/stri/projs/issues/1)、[Pro.js 3系](https://github.com/stri/projs/issues/3);