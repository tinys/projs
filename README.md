### projs

基于`nodejs`的前端开发工具包，包括前端开发环境的构建，前端`JavaScript`/`CSS`的打包。

### 最新版本

`0.1.9`

### 安装命令

    npm install projs -g
    
### 约定

1. 其中的`js`和`css`目录必须放在同一目录中,如:

		project/
		------js/
		------css/

2. CSS的打包中，有对图片版本的处理，即如在配置中设置`css_image_version`后，则打包时，会把图片的md5值的前16位当做版本号（当然，只适用于和css同一工程的图片）

3. JS的合并规则，即配置中的`js_package_depend_style`,现版本支持两种方式,请查看下面

	名称|说明|支持的版本
----|----|----
require|1.遵循`AMD`[部分规范](https://github.com/stri/projs/issues/1)|0.1.0+
import|合并`$import`引入的JS文件|0.1.0+



### 使用方法

#### 一、所有参数
##### 命令说明：

	Usage: projs <command>
		-h    获取帮助信息
		-c    获取配置参数或设置配置参数
		-v    获取版本号
		-f    要打包的目录或代码仓库地址
		-t    打包后输出的目录
		-u    代码仓库的用户名
		-p    代码仓库的密码
		start 启动服务

#### 二、配置参数

##### 命令说明：
	<command>: projs [name][value] -c
	<description>: 设置name的value或获取name的value值 [name]有如下:root,port,js_package_depend_style,css_compress,js_compress,css_image_version,css_charset,js_charset,css_comment_text,js_comment_text


##### 参数列表：

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

#### 三、打包项目

##### 命令说明：
	<command>: projs -f [form|uri][可选] -t [target][必选] -u [username][可选] -p [password][可选]
	<description>:
      1) 如果-f是SVN地址，则-u,-p,是[必选]
      2) 如果只有一个参数，则为-t,即打包当前目录

##### 例子：
1.	把SVN地址里的代码打包
		
		projs -f "http://svn.xx" -t "/target/" -u "username" -p "12346"

2.	把A目录的项目打到B目录中

		projs -f A -t B 
3. 把A目录里的文件打包

		projs -f A

