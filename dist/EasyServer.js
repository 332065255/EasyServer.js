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

var _InCome = require('./InCome');

var _InCome2 = _interopRequireDefault(_InCome);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var http = require('http');
class EasyServer {
    constructor() {
        this.app = (0, _express2.default)();
        this.server = http.createServer(this.app);
        this.d_Console = (0, _debug2.default)('debug');
        this.e_Console = (0, _debug2.default)('EasyServer');
        this.d_router = {};

        Object.assign(_default2.default, _config2.default);
    }
    async start() {
        this.e_Console('=======================================');
        this.e_Console('EasyServer version ' + _package2.default.version);
        try {
            let result = await this.begin();
            this.e_Console('EasyServer Start at ' + _default2.default.port);
            this.inCome = new _InCome2.default();
            this.app.get("/*", this.inCome.rootPath.bind(this.inCome));
            this.app.post("/*", this.inCome.rootPath.bind(this.inCome));
        } catch (e) {
            this.e_Console('EasyServer Error: ' + e);
        }
        this.e_Console('=======================================');
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
        });
    }
}
module.exports = EasyServer;