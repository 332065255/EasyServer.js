'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _default = require('./default');

var _default2 = _interopRequireDefault(_default);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Loader {
    constructor() {
        this.middleList = {};
        this.routerList = {};
        this.f_Console = (0, _debug2.default)('fileChange');
        this.r_Console = (0, _debug2.default)('router regeist');
        this.d_Console = (0, _debug2.default)('debug');
        this.f_Console.enabled = this.r_Console.enabled = this.d_Console.enabled = true;
        if (process.env.NODE_ENV === 'dev') {
            _chokidar2.default.watch(_default2.default.rootPath + 'routes/').on('change', path => {
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
    loadMiddleware() {}

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
                                this.r_Console(rout.path + ' is registered');
                                this.routerList[rout.nickName] = rout;
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
exports.default = Loader;