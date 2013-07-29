### projs

基于`nodejs`的前端开发工具包，包括前端开发环境的构建，前端`JavaScript`/`CSS`的打包。

### 安装命令

    npm install projs -g

### 使用方法

`projs -c` 用于查看当前配置，如

    projs -c

`projs name value -c`用于设置参数（参数列表如下）

##### 参数列表

名称|默认|说明
-------|------|-----
root||projs服务的目录
port|8080|服务的端口
js_package_depend_style|Pro|JavaScript包合并方式
css_compress|false|CSS是否压缩
js_compress|false|JS是否压缩
css_image_version|false|CSS里的图片版本号是否添加
css_charset|utf-8|合并后的CSS的文件编码格式
js_charset|utf-8|合并后的JS的文件编码格式
css_comment_text|无|合并后的注释文案
js_comment_text|无|合并后的注释文案

例如：

1. 设置服务目录
        
        projs root 'D:\workSpace' -c 
 
2. 设置服务端口

        projs port 80 -c

3. 设置JS合并方式（现只支持`STK`,`Pro`）两种

        projs js_pack_depend_style 'STK'
        
4. 设置压缩CSS

        projs css_compress true
        
5. 设置压缩JS

        projs js_compress true
       






### 版本列表

##### 版本0.0.5

时间： 2013.7.29

* 添加命令行支持


##### 版本0.0.1

时间：2013.7.29

* 支持`$import`,`require`的方式的打包，默认支持`require`的打包，如需要`$import`方式打包，需配置参数`js_package_depend_style`为`import`
* 前端环境包括开发与仿真两种环境，开发环境下，需配置`css_compress`和`js_compress`,默认为`false`，不压缩，还有参数`css_image_version`，如果为true,则在打包CSS时，会自动检测样式的MD5，并添加相应的版本号（现只支持图片目录为相对路径的方式）
* 其它配置参数，还有`css_charset`,`js_charset`，设置合并或压缩后的CSS,JS的编码（默认为`utf-8`）;`css_comment_text`,`js_comment_text`，设置合并或压缩后的CSS,JS的注释(默认为空)；
