## projs.4.0.beta

> 开发中...

### 目标

> 让操作更简单，功能更加大

### 计划

1. 抽离`Pro.js`的`package`并构建为单独的模块`pjpm`，`Pro.js`项目可以依赖`pjpm`的包进行开发；
2. 优化`Pro.js`包的合并方式；
3. 在`1`完成后，添加`pro_module_path`用于配置`Pro.js`的包路径；

	> 以上工作都已完成，正在项目考验中...

5. 对`sass`中`@import`规则进行优化，当`@import`为一个不是`css`后缀的文件时，会默认此文件是以`.scss`后缀，可以这样使用(* 不过仍然推荐加后缀，增加其可读性，不要为了省事，给后人debug时留坑 *)：

	以前必须：
	
		 @import url(index.scss)

	现在可以这样：
	
		@import url(index)
		
6. 对`sass`进行优化，当寻找CSS`xx/xxx/index.css`没有找到时，会重新以`xx/xxx/index.scss`进行匹配，这样做的好处，如下：

	页面上引用一个CSS
		
		<link rel="stylesheet" href="http:/aa.com/css/page/index.css">
	
	但你的开发目录里没有这个`index.css`文件，那么将会把`index.scss`当前目标对象，进行合并编译等操作；
	

7. 对`sass`打包进行优化，`.scss`文件打包后，直接是`.css`文件，这样可在开发目录里是`.scss`文件，打包压缩后是`.css`文件，开发上线两不误，妥妥的；

8. 对`sass`报错添加行号提示，方便调试；

	> 以上工作已完成，正在项目考验中...	


9. 重构`命令行`操作，提高了使用的方便性

		Usage: projs 

		Options:
		  -r, --run      run the server.                   
		  -d, --deploy   deploy the project.               
		  -c, --config   set or get the config.            
		  -i, --install  install plugin.                   
		  -v, --version  the version.                      
		  -h, --help     Doc: https://github.com/stri/projs

		Not enough non-option arguments: got 0, need at least 1
		
10. 添加导入配置文件功能（支持http和路径导入），如下：

		projs path --install --config