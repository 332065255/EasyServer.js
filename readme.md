# 简单的服务器
## 继承自express的简单服务器，不需要为路由而烦恼
### [测试项目](https://github.com/332065255/easy_test)

## 目录约束
### config目录（必须）
* 该目录是config模块自动加载，根据NODE_ENV进行主动加载对应的.js or .json文件
* 不管NODE_ENV是什么，默认加载default.js or default.json
* default.js 默认应有内容
	* 	"rootPath": ''    这是给框架提供项目根目录 (默认已有，如不必须，不用写该参数)
	*  "port":9889       项目启动端口号

	
### routes（路由目录，必须,重要！！！！！请仔细阅读）
* routes目录下应都为文件夹
* routes目录下不能有.js文件
* http://domain/ 请求的路由地址为 /routes/index/index.js 下的indexAction
* http://domain/user/index/ 请求的路由地址为 /routes/user/index.js 下的indexAction

* http://domain/user 请求的路由地址为 /routes/user/index.js 下的indexAction

* http://domain/user/index 请求的路由地址为 /routes/user/index.js 下的indexAction
* http://domain/user/getname 请求的路由地址为 /routes/user/index.js 下的getnameAction
* http://domain/user/reg/ 请求的路由地址为 /routes/user/reg.js 下的indexAction
* http://domain/user/reg/logup 请求的路由地址为 /routes/user/reg.js 下的logupAction
* routes目录下所有.js文件必须都继承自Router
	
### views(静态文件目录，必须)
* views目录下对应routes，1对1对应
* routes目录下.js文件 对应views同目录下.html文件



## API
### EasyServer
* start()方法 启动服务器，默认端口是9889

### Router（此类应为被继承类，建议不要直接使用）
* before（）方法，请求进入该对象后，第一个执行的方法，返回FALSE，即立即结束后续操作
* xxxAction（）子类自定义方法，使用方式如下
	* http://domain/user/index/getUser 请求的路由地址为 /routes/user/index.js 下的getUserAction()方法
	* 该方法返回false，即立即结束后续操作
	* 该方法应都为post请求
	* xxx应全部为小写，因为浏览器地址栏不支持大写
* __call() 方法，如果请求路由没有击中任何xxxAction()方法，那么默认执行该方法，返回false，即立即结束后续操作
* after()方法，最后执行方法
	



## 安装方式
```
npm install easyserver.js -S

import {EasyServer,Router} from 'EasyServer'
let server = new EasyServer();
server.start();
```

## Licence

MIT