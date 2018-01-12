import fs from 'fs';
import chokidar from 'chokidar';
import config from 'config';
import def from './default';
import debug from 'debug';
import path from 'path';
import chalk from 'chalk';
export default class Loader {
    constructor() {
        this.middleList = {};
        this.routerList = {};
        this.f_Console = debug('fileChange');
        this.r_Console = debug('router regeist');
        this.r_Console2 = debug('router regeist ERROR');
        this.d_Console = debug('debug');
        this.r_Console2.enabled=this.f_Console.enabled = this.r_Console.enabled = this.d_Console.enabled = true;
        def.rootPath = path.join(process.cwd(), "/");
        Object.assign(def, config);
        if (def.rootPath.indexOf('.') === 0) {
            def.rootPath = path.join(process.cwd(), def.rootPath)
        }
        //启动目录监听
        if (process.env.NODE_ENV === 'dev') {
            chokidar.watch(path.join(def.rootPath,'routes/')).on('change', (path) => {
                this.cleanCache(path);
                this.f_Console(path, "reCompile");
                var _class = require(path).default;
                var rout = new _class();
                rout.compilePhyPath(path);
                this.routerList[rout.nickName] = rout;
            });
        }
        this.loadMiddleware();
        this.loadRouter();
    }
    loadRouter() {
        this.compileJs();
    }
    loadMiddleware() {

    }

    async compileJs() {
        return new Promise((res, rej) => {
            let filePath = path.resolve(path.join(def.rootPath,'routes/'));
            this.fileDisplay(filePath);
            res();
        })
    }
    cleanCache(modulePath) {
        delete require.cache[modulePath];
    }
    fileDisplay(filePath) {

        //根据文件路径读取文件，返回文件列表  
        fs.readdir(filePath, (err, files) => {
            if (err) {
                this.d_Console(err)
            } else {
                //遍历读取到的文件列表  
                files.forEach((filename) => {
                    //获取当前文件的绝对路径  
                    var filedir = path.join(filePath, filename);
                    //根据文件路径获取文件信息，返回一个fs.Stats对象  
                    fs.stat(filedir, (eror, stats) => {
                        if (eror) {
                            this.d_Console('获取文件stats失败');
                        } else {
                            var isFile = stats.isFile(); //是文件  
                            var isDir = stats.isDirectory(); //是文件夹  
                            if (isFile) {
                                if((filePath.lastIndexOf('routes')+6)!=filePath.length){
                                    this.cleanCache(filedir);
                                    var _class = require(filedir).default;
                                    var rout = new _class();
                                    rout.compilePhyPath(filedir);
                                    this.r_Console(rout.fullpath+" and " +rout.path +" and " + rout.middlepath+' is registered')
                                    this.routerList[rout.nickName] = rout;
                                }else{
                                    this.r_Console2(chalk.red("Error: "+filedir + ' is not registered!!!! Because it is in the routes directory!!!'))
                                }
                            }
                            if (isDir) {
                                this.fileDisplay(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件  
                            }
                        }
                    })
                });
            }
        });
    }
}