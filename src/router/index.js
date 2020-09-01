import m from 'mithril';
import utils from '@/util/utils';

class Router {
    defaultRoutePath = "/home";
    routerList = {
        '/home': {
            // 是否需要需要身份验证
            requireAuth: false,
            onmatch: function () {
                return import('@/views/page/home/index');
            }
        },
        '/login': {
            requireAuth: false,
            onmatch: function () {
                return import('@/views/page/user/login/login/login.view');
            }
        },
        '/register': {
            requireAuth: false,
            onmatch: function () {
                return import('@/views/page/user/login/register/register.view');
            }
        },
        '/forgetPassword': {
            requireAuth: false,
            onmatch: function () {
                return import('@/views/page/user/login/forgetPassword/forgetPassword.view');
            }
        },
        '/myWalletIndex': {
            requireAuth: true,
            onmatch: function () {
                return import('@/views/page/myAssets/myWalletIndex/MyWalletIndexView');
            }
        },
        '/recharge': {
            requireAuth: true,
            onmatch: function () {
                return import('@/views/page/myAssets/myWalletIndex/children/recharge/recharge.view');
            }
        },
        '/assetRecords': {
            requireAuth: true,
            onmatch: function () {
                return import('@/views/page/myAssets/assetRecords/assetRecords.view');
            }
        },
        '/extractCoin': {
            requireAuth: true,
            onmatch: () => import('@/views/page/myAssets/extractCoin/index')
        },
        '/accountSecurity': {
            requireAuth: true,
            onmatch: () => import('@/views/page/accountSecurity/modifyLoginPassword/changePassword.view')
        },
        '/bindEmail': {
            requireAuth: true,
            onmatch: () => import('@/views/page/user/bind/bindEmail/bindEmail.view')
        },
        '/bindPhone': {
            requireAuth: true,
            onmatch: () => import('@/views/page/user/bind/bindEmail/bindEmail.view')
        },
        '/openGoogleVerify': {
            requireAuth: true,
            onmatch: () => import('@/views/page/bindGoogle/open/openGoogleVerify.view')
        }
    };

    loginState = false;

    constructor() {
        this.path = this.defaultRoutePath;
        this.params = {};
        this.route = m.route;
        this.historyRouteList = new Array([]);

        this.route(document.querySelector('body .route-box'), this.defaultRoutePath, this.routerList);
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
        console.log(param);
        if (typeof param === 'string') {
            if (this.routerList[param] && this.routerList[param].requireAuth && !utils.getItem('loginState')) {
                this.route.set('/login');
                return;
            }
            if (!replace && this.path && this.path !== param) {
                this.historyRouteList.unshift({ path: this.path, data: this.params });
            }
            this.path = param;
            this.route.set(param);
        } else {
            if (this.routerList[param.path] && this.routerList[param.path].requireAuth && !utils.getItem('loginState')) {
                this.route.set('/login');
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
        this.path = null;
        this.params = {};
        this.push(routeData, false);
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
        this.path = null;
        this.params = {};
        this.push(route, false);
    }
}

window.router = new Router();