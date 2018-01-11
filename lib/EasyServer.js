import express from 'express';
import debug from 'debug';
import config from 'config';
import pj from './../package.json';
import def from './default';

export default class EasyServer extends express {
    constructor() {
        super();
        this.app=this;
        this.r_Console = debug('router');
        this.d_Console = debug('debug');
        this.e_Console = debug('EasyServer');
        this.d_router = {};
        Object.assign(def, config);
    };
    async start() {
        this.e_Console('=======================================');
        this.e_Console('EasyServer version' + pj.version);
        try {
            let result = await begin();
            this.e_Console('EasyServer Start at ' + def.port);
        } catch (e) {
            this.e_Console('EasyServer Error: ' + e);
        }
        this.e_Console('=======================================');

        try {
            let jsDone = await compileJs();
        } catch (e) {

        }
        return;
    }
    async begin() {
        return new Promise((res, rej) => {
            this.app.listen(def.port);
            this.app.on('error', function (error) {
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
            this.on('listening', () => {
                res();
            });
        })
    }
    async compileJs() {
        return new Promise((res, rej) => {

        })
    }
}