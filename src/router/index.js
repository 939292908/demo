import m from 'mithril';
import utils from '@/util/utils';

class Router {
    defaultRoutePath = "/";
    routerList = {
        // 发红包
        '/give': {
            // 是否需要需要身份验证
            requireAuth: false,
            onmatch: function () {
                return import('@/views/page/giveRedPacket/giveRedPacket.view');
            }
        },
        // 领取红包
        '/': {
            // 是否需要需要身份验证
            requireAuth: false,
            onmatch: function () {
                return import('@/views/page/receiveRedPacket/receiveRedPacket.view');
            }
        },
        // 领取红包结果
        '/receiveResult': {
            // 是否需要需要身份验证
            requireAuth: false,
            onmatch: function () {
                return import('@/views/page/receiveRedPacket/receiveResult/receiveResult.view');
            }
        },
        // 我的红包
        '/myRedPacket': {
            // 是否需要需要身份验证
            requireAuth: false,
            onmatch: function () {
                return import('@/views/page/myRedPacket/myRedPacket.view');
            }
        },
        // 红包详情
        '/redPacketDetail': {
            // 是否需要需要身份验证
            requireAuth: false,
            onmatch: function () {
                return import('@/views/page/myRedPacket/redPacketDetail/redPacketDetail.view');
            }
        }
    };

    loginState = false;

    constructor() {
        this.path = this.defaultRoutePath;
        this.params = {};
        this.route = m.route;
        this.historyRouteList = [];

        this.route(document.querySelector('body .route-box'), this.defaultRoutePath, this.routerList);
        // 获取地址栏参数，并验证路由
        const info = this.getUrlInfo();
        this.path = info.path;
        this.params = info.params;
        this.checkRoute(this.getUrlInfo());
    }

    /**
     * 路由跳转
     * @param {Object} param 路由跳转参数
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
    push(param, replace = false) {
        if (typeof param === 'string') {
            if (this.checkRoute({ path: param })) {
                return;
            }
            if (!replace && this.path && this.path !== param) {
                this.historyRouteList.unshift({ path: this.path, data: this.params });
            }
            this.path = param;
            this.route.set(param, {}, { replace });
        } else {
            if (this.checkRoute(param)) {
                return;
            }
            if (!replace && this.path && this.path !== param.path) {
                this.historyRouteList.unshift({ path: this.path, data: this.params });
            }
            this.path = param.path;
            this.params = param.data;
            this.route.set(param.path, param.data, param.options);
        }
    }

    /**
     * 路由返回
     */
    back() {
        let routeData = this.historyRouteList.splice(0, 1);
        routeData = routeData[0] || { path: this.defaultRoutePath };
        this.path = routeData.path;
        this.params = routeData.data || {};
        // this.push(routeData, false);
        history.back();
    }

    /**
     * 路由返回
     * @param {Number} param 默认-1，参数需填负数，-1代表跳转到历史列队下标为1的路由
     */
    go(param) {
        param = param || -1;
        const i = Math.abs(param) - 1;
        const n = Math.abs(param);
        const routeData = this.historyRouteList.splice(i, n);
        const route = routeData[routeData.length - 1] || { path: this.defaultRoutePath };
        if (!route) {
            return;
        }
        this.path = route.path;
        this.params = route.data || {};
        // this.push(route, false);
        history.go(param);
    }

    /**
     * 验证路由
     * @param {Object} param 路由对象
     */
    checkRoute(param) {
        // console.log('ht', 'checkRoute ', param, this.routerList[param.path], !utils.getItem('loginState'));
        if (this.routerList[param.path] && this.routerList[param.path].requireAuth && !utils.getItem('loginState')) {
            this.route.set('/login');
            return true;
        }
        return false;
    }

    /**
     * 获取浏览器地址栏路由和参数
     */
    getUrlInfo() {
        const arr = window.location.href.split(this.route.prefix);
        const path = arr[1].split('?')[0];
        const queryStr = arr[1].split('?')[1];
        const queryArr = (queryStr && queryStr.split('&')) || [];
        const queryObj = {};
        for (const item of queryArr) {
            queryObj[item.split('=')[0]] = item.split('=')[1];
        }
        return {
            path,
            params: queryObj
        };
    }
}

window.router = new Router();