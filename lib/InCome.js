import Loader from './Loader';

/**
 * 所有消息的入口
 */
export default class InCome{
    constructor(){
        this.loader=new Loader();
        this.shoot = false;
    }
    //主路由
    rootPath(req,res){
        this.shoot = false;
        var path = req.path.substr(0, req.path.lastIndexOf('/') + 1) + "*";
        for (let rot in this.loader.routerList) {
            if (this.loader.routerList[rot].path === path) {
                this.shoot = true;
                this.loader.routerList[rot].default(req,res);
            }
        }
        if(!this.shoot){
            res.send("<h1>404</h1>");
        }
    }
}