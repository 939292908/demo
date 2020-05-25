import m from "mithril";




import main from '../views/main'

//引入合约记录三个组件
import delegation from '../views/components/contractRrecord/historicalDelegation'
import deal from '../views/components/contractRrecord/historicalDeal'
import contractbill from '../views/components/contractRrecord/contractBill'
import details from '../views/components/contractRrecord/details'
import languages from '../views/components/contractRrecord/languages'

const defaultRoutePath = "/future"

m.route(document.body, defaultRoutePath,{
    "/future": {
        render: function (vnode) {
            return m(main,vnode.attrs)
        }
    },
    "/delegation": {
        render: function (vnode){
            return m(delegation,vnode.attrs)
        },
    },
    "/details":{
        render:function(vnode){
            return m(details,vnode.attrs)
        }
    },
    "/deal": {
        render:function (vnode){
            return m(deal,vnode.attrs)
        }
    },
    "/contractbill": {
        render:function (vnode){
            return m(contractbill,vnode.attrs)
        }
    },
    "/setlanguages": {
        render:function (vnode){
            return m(languages,vnode.attrs)
        },

    },
})
class router {
    path = defaultRoutePath
    params = {}
    route = null
    historyRouteList = []


    constructor(){
        this.route = m.route
    }

    /**
     * 路由跳转
     * @param {String || Object} param 路由跳转参数
     * 如果是String直接写路由；
     * 如果是Object： {
        path: "/future",
        data: {},
        options: {
            replace: false,
            state: {},
            title: ""
        }
    }
     * 详细： http://www.mithriljs.net/route.html#mrouteset
     */
    push(param){
        console.log(param)
        if(typeof param == 'string'){
            if(this.path != param){
                this.historyRouteList.unshift({path: this.path, data: this.params})
            }
            console.log('router.push', param)
            this.path = param
            this.route.set(param)
        }else{
            if(this.path != param.path){
                this.historyRouteList.unshift({path: this.path, data: this.params})
            }
            console.log('router.push', param)
            this.path = param.path
            this.params = param.data
            this.route.set(param.path, param.data, param.options)
        }
        console.log(this.historyRouteList)
    }

    /**
     * 路由返回
     */
    back(){
        let routeData = this.historyRouteList.splice(0, 1)
        routeData = routeData[0] || {path: defaultRoutePath}
        console.log('router back', routeData, routeData.path, routeData.data)
        this.route.set(routeData.path, routeData.data)
    }

    /**
     * 路由返回
     * @param {Number} param 默认-1，参数需填负数，-1代表跳转到历史列队下标为1的路由
     */
    go(param){
        param = param || -1
        let i = Math.abs(param) -1
        let n = Math.abs(param)
        let routeData = this.historyRouteList.splice(i,n)
        let route = routeData[routeData.length - 1] || {path: defaultRoutePath}
        if(!route){
            return 
        }
        this.route.set(route.path, route.data)
    }
}

window.router = new router()



