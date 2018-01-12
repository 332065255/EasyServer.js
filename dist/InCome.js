'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Loader = require('./Loader');

var _Loader2 = _interopRequireDefault(_Loader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 所有消息的入口
 */
class InCome {
    constructor() {
        this.loader = new _Loader2.default();
        this.shoot = false;
    }
    //主路由
    rootPath(req, res) {
        this.shoot = false;
        var path = req.path.substr(0, req.path.lastIndexOf('/') + 1) + "*";
        for (let rot in this.loader.routerList) {
            if (this.loader.routerList[rot].path === path) {
                this.shoot = true;
                this.loader.routerList[rot].default(req, res);
            }
        }
        if (!this.shoot) {
            res.send("<h1>404</h1>");
        }
    }
}
exports.default = InCome;