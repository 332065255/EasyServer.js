import express from 'express';
import debug from 'debug';
import config from 'config';
import pj from './../package.json';
import def from './default';
import path from 'path';
import fs from 'fs';
var http = require('http');
class EasyServer {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.r_Console = debug('router');
        this.d_Console = debug('debug');
        this.e_Console = debug('EasyServer');
        this.d_router = {};
        Object.assign(def, config);
    }
    async start() {
        this.e_Console('=======================================');
        this.e_Console('EasyServer version ' + pj.version);
        try {
            let result = await this.begin();
            this.e_Console('EasyServer Start at ' + def.port);
        } catch (e) {
            this.e_Console('EasyServer Error: ' + e);
        }
        this.e_Console('=======================================');

        try {
            let jsDone = await this.compileJs();
        } catch (e) {

        }
        return true;
    };
    async begin() {
        return new Promise((res, rej) => {

            this.server.on('error', function (error) {

                if (error.syscall !== 'listen') {
                    throw error;
                }

                var bind = typeof port === 'string' ?
                    'Pipe ' + port :
                    'Port ' + port;

                // handle specific listen errors with friendly messages
                switch (error.code) {
                    case 'EACCES':
                        rej(bind + ' requires elevated privileges');
                        process.exit(1);
                        break;
                    case 'EADDRINUSE':
                        rej(bind + ' is already in use');
                        process.exit(1);
                        break;
                    default:
                        throw error;
                }
            })
            this.server.on('listening', () => {

                res();
            });

            this.server.listen(def.port);

        })
    }
    async compileJs() {
        return new Promise((res, rej) => {
            let filePath = path.resolve(def.rootPath + 'routes/');
            // console.log(filePath);
            this.fileDisplay(filePath);
            // console.log(this.d_router);
        })
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
                                var _class=require(filedir).default;
                                var rout=new _class();
                                rout.compilePhyPath(filedir);
                                // console.log(rout,rout.nickName,rout.path);
                                this.d_router[rout.nickName] = rout;
                                this.app.get(rout.path,rout.default.bind(rout))
                                this.app.post(rout.path,rout.default.bind(rout))
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
module.exports = EasyServer;