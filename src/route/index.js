import m from "mithril";

// m.mount(document.body,require('../views/main'))


// import main from '../views/main'

// //引入合约记录三个组件
// import delegation from '../views/components/contractRrecord/historicalDelegation'
// import deal from '../views/components/contractRrecord/historicalDeal'
// import contractbill from '../views/components/contractRrecord/contractBill'
// import details from '../views/components/contractRrecord/details'
// import languages from '../views/components/contractRrecord/languages'
// import switchLines from '../views/components/contractRrecord/switchLines'

const defaultRoutePath = "/future"

m.route(document.body, "/future",{
    "/future": {
        onmatch: function (vnode){
            return import('../views/main')
        },
    }, //require('../views/main'),
    "/delegation": {
        onmatch: function (vnode){
            return import('../views/components/contractRrecord/historicalDelegation')
        },
    },
    "/details":{
        onmatch:function(vnode){
            return import('../views/components/contractRrecord/details')//m(details,vnode.attrs)
        }
    },
    "/deal": {
        onmatch:function (vnode){
            return import('../views/components/contractRrecord/historicalDeal')//m(deal,vnode.attrs)
        }
    },
    "/contractbill": {
        onmatch:function (vnode){
            return import('../views/components/contractRrecord/contractBill')//m(contractbill,vnode.attrs)
        }
    },
    "/setlanguages": {
        onmatch:function (vnode){
            return import('../views/components/contractRrecord/languages')//m(languages,vnode.attrs)
        },
    },
    "/switchLines": {
        onmatch:function (vnode){
            return import('../views/components/contractRrecord/switchLines')//m(switchLines,vnode.attrs)
        },
    },
    "/currency": {
        onmatch:function (vnode){
            return import('../views/components/currency')//币币交易页面
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
        this.historyRouteList = new Array()
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
    push(param, replace = true){
        console.log(param)
        if(typeof param == 'string'){
            if(replace && this.path && this.path != param){
                this.historyRouteList.unshift({path: this.path, data: this.params})
            }
            console.log('router.push', param)
            this.path = param
            this.route.set(param)
        }else{
            if(replace && this.path && this.path != param.path){
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
        let routeData = this.historyRouteList.splice(0,1)
        routeData = routeData[0] || {path: defaultRoutePath}
        console.log('router back', routeData, routeData[0], this.historyRouteList)
        this.path = null
        this.params = {}
        this.push(routeData, false)
        
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
        console.log('router go', param, route, this.historyRouteList)
        this.path = null
        this.params = {}
        this.push(route, false)
    }
}

window.router = new router()



