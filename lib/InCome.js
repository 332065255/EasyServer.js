import Loader from './Loader';
import paths from 'path';
import fs from 'fs';
/**
 * 所有消息的入口
 */
export default class InCome {
    constructor() {
        this.loader = new Loader();
        this.shoot = false;
    }
    //主路由
    rootPath(req, res) {
        this.shoot = false;
        if (req.path === '/') {
            var path = '/index';
        } else if (req.path.lastIndexOf('/') === req.path.indexOf('/')) {
            var path = req.path
        } else {
            var path = req.path.substr(0, req.path.lastIndexOf('/') + 1);
        }
        for (let rot in this.loader.routerList) {
            if (this.loader.routerList[rot].path === path || this.loader.routerList[rot].fullpath === path || this.loader.routerList[rot].middlepath === path) {
                this.shoot = true;
                this.loader.routerList[rot].default(req, res);
            }
        }
        if (!this.shoot) {
            if (path.indexOf('/static') === 0) {
                res.status(404);
                // res.end();
            }
            fs.readFile(paths.join(global.e_rootPath, "/views/404.html"), 'utf-8', function (err, data) { //读取内容
                if (err) {
                    res.send("<h1>404</h1>");
                } else {
                    res.send(data);
                }
            });
        }
    }
}