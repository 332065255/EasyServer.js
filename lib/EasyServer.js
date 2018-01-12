import express from 'express';
import debug from 'debug';
import config from 'config';
import pj from './../package.json';
import def from './default';
import InCome from './InCome'

var http = require('http');
class EasyServer {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.d_Console = debug('debug');
        this.e_Console = debug('EasyServer');
        this.d_router = {};

        
    }
    async start() {
        this.e_Console('=======================================');
        this.e_Console('EasyServer version ' + pj.version);
        try {
            let result = await this.begin();
            this.e_Console('EasyServer Start at ' + def.port);
            this.inCome = new InCome();
            this.app.get("/*", this.inCome.rootPath.bind(this.inCome))
            this.app.post("/*", this.inCome.rootPath.bind(this.inCome))
        } catch (e) {
            this.e_Console('EasyServer Error: ' + e);
        }
        this.e_Console('=======================================');
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
}
module.exports = EasyServer;