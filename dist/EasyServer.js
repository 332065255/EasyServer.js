'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _package = require('./../package.json');

var _package2 = _interopRequireDefault(_package);

var _default = require('./default');

var _default2 = _interopRequireDefault(_default);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _timers = require('timers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var http = require('http');
class EasyServer {
    constructor() {
        this.app = (0, _express2.default)();
        this.server = http.createServer(this.app);
        this.r_Console = (0, _debug2.default)('router');
        this.d_Console = (0, _debug2.default)('debug');
        this.e_Console = (0, _debug2.default)('EasyServer');
        this.f_Console = (0, _debug2.default)('fileChange');
        this.d_router = {};
        this.shoot = false;
        Object.assign(_default2.default, _config2.default);
    }
    async start() {
        this.e_Console('=======================================');
        this.e_Console('EasyServer version ' + _package2.default.version);
        try {
            let result = await this.begin();
            this.e_Console('EasyServer Start at ' + _default2.default.port);
        } catch (e) {
            this.e_Console('EasyServer Error: ' + e);
        }
        this.e_Console('=======================================');
        if (process.env.NODE_ENV === 'dev') {
            _chokidar2.default.watch(_default2.default.rootPath + 'routes/').on('change', path => {
                this.cleanCache(path);
                this.d_Console(path, "reCompile");
                var _class = require(path).default;
                var rout = new _class();
                rout.compilePhyPath(path);
                this.d_router[rout.nickName] = rout;
            });
        }

        try {
            let jsDone = await this.compileJs();
        } catch (e) {}
        return true;
    }
    async begin() {
        return new Promise((res, rej) => {

            this.server.on('error', function (error) {

                if (error.syscall !== 'listen') {
                    throw error;
                }

                var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

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
            });
            this.server.on('listening', () => {

                res();
            });

            this.server.listen(_default2.default.port);
            this.app.get("/*", this.rootPath.bind(this));
            this.app.post("/*", this.rootPath.bind(this));
        });
    }
    /**
     * 所有路由主入口
     * @param {*} req 
     * @param {*} res 
     */
    rootPath(req, res) {
        this.shoot = false;

        var path = req.path.substr(0, req.path.lastIndexOf('/') + 1) + "*";
        for (let rot in this.d_router) {

            if (this.d_router[rot].path === path) {
                this.shoot = true;
                this.d_router[rot].default(req, res);
            }
        }
        if (!this.shoot) {
            res.send("<h1>404</h1>");
        }
    }
    async compileJs() {
        return new Promise((res, rej) => {
            let filePath = _path2.default.resolve(_default2.default.rootPath + 'routes/');
            this.fileDisplay(filePath);
            res();
        });
    }
    cleanCache(modulePath) {
        delete require.cache[modulePath];
    }
    fileDisplay(filePath) {

        //根据文件路径读取文件，返回文件列表  
        _fs2.default.readdir(filePath, (err, files) => {
            if (err) {
                this.d_Console(err);
            } else {
                //遍历读取到的文件列表  
                files.forEach(filename => {
                    //获取当前文件的绝对路径  
                    var filedir = _path2.default.join(filePath, filename);
                    //根据文件路径获取文件信息，返回一个fs.Stats对象  
                    _fs2.default.stat(filedir, (eror, stats) => {
                        if (eror) {
                            this.d_Console('获取文件stats失败');
                        } else {
                            var isFile = stats.isFile(); //是文件  
                            var isDir = stats.isDirectory(); //是文件夹  
                            if (isFile) {
                                var _class = require(filedir).default;
                                var rout = new _class();
                                rout.compilePhyPath(filedir);
                                // console.log(rout,rout.nickName,rout.path);
                                this.d_router[rout.nickName] = rout;
                            }
                            if (isDir) {
                                this.fileDisplay(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件  
                            }
                        }
                    });
                });
            }
        });
    }
}
module.exports = EasyServer;