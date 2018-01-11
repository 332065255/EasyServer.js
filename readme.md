# 简单的服务器
## 继承自express
## 简单的路由系统，不需要写路由监听
### 在项目文件夹下建立routes目录
### routes目录下的.js文件的完全路径即为路由路径
    * /routes/index/index.js 
    * 访问路由就是 127.0.0.1:[自定义端口]/index/index/
### routes目录下.js文件需要继承Router类
### routes目录下.js文件 包含以下方法(ps.举例声明的.js文件路径为/routes/index/index.js)
    * before() 请求前置执行，如果返回FALSE，后面不再执行
    * xxxAction() 用户自定义api请求
        * 假设定义为 indexAction
        * 那么访问路由就是 127.0.0.1:[自定义端口]/index/index/
        * 假设定义为 getListAction
        * 那么访问路由就是 127.0.0.1:[自定义端口]/index/index/getList
    * xxxAction()如果返回false，后面不再执行
    * __call() 如果访问路由没有击中任何一个xxxAction(）则默认执行该方法，如果返回false，后面不再执行
    * after()最后执行
    * display()方法，对应展示/views/目录下的（路由）.html文件（未实现）
### 在项目文件夹下建立config目录
### 默认会读取/config/default.js 文件
### 项目rootPath为__dirname+"/../../" 即为项目根目录，因为node_modules/EasyServer
### 项目默认端口port 为9889;
### 以上配置皆可在/config/default.js文件中重写，定义为自己的，注意，rootPath必须是可以访问到routes目录，因为这样才能自动去检索代码并注册路由

## 安装方式（还未发npm）
```
npm install easyserver.js -S

import {EasyServer,Router} from 'EasyServer'
let server = new EasyServer();
server.start();
```

## Licence

MIT