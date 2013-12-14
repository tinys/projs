### 安装包插件

> 支持版本: `0.3.0`

#### 包的定义


	module.exports = {
		type: 'js', // 要合并的代码类型，默认为js,
		author: 'xxx', // 作者
		desc: '合并XX的代码',
		version: '0.1.0', // 版本
		combine: function(Opts,callback){}
	};
	

> 如上所示，`combine`为合并方法，其中只接受两个参数，如下

##### `Opts{Object}`

* `config`: 配置的所有参数
* `file`: 
	* `path`: 文件的绝对路径
	* `type`: 文件的类型
	* `contentType`: 文件的`contentType`
* `req`: 请求对象(`Express`的)
* `res`: 返回对象(`Express`的)
* `baseDir`: JS或CSS的根目录
* `util`: 工具函数包
	* `getFileCodeStr`: 根据路径，获取文件内容
	* `getSourceByCompress`: 压缩代码
	* `getMd5Str`： 获取中的`MD5`值
	

##### `callback{Function}`

> 包合并完的回调，参数是内容。
	
##### `安装插件`

* 如果是本地的，安装如下：

		projs install /user/mac/doc/plugins/xx.js

* 如果是网络的，安装如下

		projs install https://xx.com/xx.js

