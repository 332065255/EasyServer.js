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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class EasyServer extends _express2.default {
    constructor() {
        super();
        this.app = this;
        this.r_Console = (0, _debug2.default)('router');
        this.d_Console = (0, _debug2.default)('debug');
        this.e_Console = (0, _debug2.default)('EasyServer');
        this.d_router = {};
        Object.assign(_default2.default, _config2.default);
    }
    async start() {
        this.e_Console('=======================================');
        this.e_Console('EasyServer version' + _package2.default.version);
        try {
            let result = await this.begin();
            this.e_Console('EasyServer Start at ' + _default2.default.port);
        } catch (e) {
            this.e_Console('EasyServer Error: ' + e);
        }
        this.e_Console('=======================================');

        try {
            let jsDone = await this.compileJs();
        } catch (e) {}
        return;
    }
    async begin() {
        return new Promise((res, rej) => {
            this.app.listen(_default2.default.port);
            this.app.on('error', function (error) {
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
            this.on('listening', () => {
                res();
            });
        });
    }
    async compileJs() {
        return new Promise((res, rej) => {});
    }
}
module.exports = EasyServer;