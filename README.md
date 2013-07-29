### projs

基于`nodejs`的前端开发工具包，包括前端开发环境的构建，前端`JavaScript`/`CSS`的打包。



### 历史版本


##### 版本0.0.1

时间：2013.7.29

* 支持`$import`,`require`的方式的打包，默认支持`require`的打包，如需要`$import`方式打包，需配置参数`js_package_depend_style`为`import`
* 前端环境包括开发与仿真两种环境，开发环境下，需配置`css_compress`和`js_compress`,默认为`false`，不压缩，还有参数`css_image_version`，如果为true,则在打包CSS时，会自动检测样式的MD5，并添加相应的版本号（现只支持图片目录为相对路径的方式）
* 其它配置参数，还有`css_charset`,`js_charset`，设置合并或压缩后的CSS,JS的编码（默认为`utf-8`）;`css_comment_text`,`js_comment_text`，设置合并或压缩后的CSS,JS的注释(默认为空)；
