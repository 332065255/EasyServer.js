import debugs from 'debug';
import pj from './../package.json';
class Router {
    constructor() {
        this.debug = debugs('router');
        this.err_Console = debugs('Error');
        this.req = null;
        this.res = null;
    }
    default (req, res) {
        res.set('EasyServer', pj.version);
        this.req = req;
        this.res = res;
        this.debug(req.path);
        let actName = this.getPathToAction(req.path);
        if (!this.before()) {
            if (!this.res.headersSent) {
                this.res.send('')
            }
            return;
        }
        try {
            if (!this[actName]()) {
                return;
            }
        } catch (e) {
            this.err_Console(e.toString());
            if (!this.__call()) {
                if (!this.res.headersSent) {
                    this.res.send('')
                }
                return;
            }
        }
        this.after();


    }
    display() {

    }
    getPathToAction(path) {
        let name = path.substr(path.lastIndexOf('/') + 1)
        return name == "" ? "indexAction" : (name + "Action");
    }
    __call() {
        this.debug('__call')
        if (!this.res.headersSent)
            this.res.send('nothing')
        return true;
    }
    before() {
        this.debug('before')
        return true;
    }
    after() {
        this.debug('after')
        if (!this.res.headersSent) {
            this.res.send('')
        }
        return true;
    }
    compilePhyPath(path) {
        var arr = path.split('/');
        var index = -1;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == 'routes') {
                index = i + 1;
            }
        }
        this.allPath = path;
        this.path = "/" + arr.slice(index).join('/');
        this.path = this.path.replace('.js', '/*');
        this.nickName = arr.slice(index).join('_');
    }
}
module.exports = Router;