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
        // 接参数：http://localhost:8080/#!/myWalletIndex?id=03
        '/myWalletIndex': {
            requireAuth: true,
            onmatch: function () {
                return import('@/views/page/myAssets/myWalletIndex/MyWalletIndex.view');
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
        '/closeGoogleVerify': {
            requireAuth: true,
            onmatch: () => import('@/views/page/selfManage/bindGoogle/closeGoogleVerify.view')
        },
        '/accountSecurity': {
            requireAuth: true,
            onmatch: () => import('@/views/page/accountSecurity/modifyLoginPassword/changePassword.view')
        },
        '/bind': {
            requireAuth: true,
            onmatch: () => import('@/views/page/selfManage/bind/bind.view')
        },
        '/openGoogleVerify': {
            requireAuth: true,
            onmatch: () => import('@/views/page/selfManage/bindGoogle/openGoogleVerify.view')
        },
        '/modifyLoginPassword': {
            requireAuth: true,
            onmatch: () => import('@/views/page/selfManage/modifyLoginPassword/modifyLoginPassword.view')
        },
        '/selfManage': {
            requireAuth: true,
            onmatch: () => import('@/views/page/selfManage/home/index')
        },
        '/apiManager': {
            requireAuth: true,
            onmatch: () => import('@/views/page/selfManage/apiManager/apiManager.view')
        },
        '/securityManage': {
            requireAuth: true,
            onmatch: () => import('@/views/page/selfManage/safety/index')
        },
        '/antiFishingCode': {
            requireAuth: true,
            onmatch: () => import('@/views/page/selfManage/antiFishingCode/antiFishingCode.view')
        },
        '/modifyFundPassword': {
            requireAuth: true,
            onmatch: () => import('@/views/page/selfManage/modifyFundPassword/modifyFundPassword.view')
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
        window.addEventListener("popstate", (e) => {
            this.checkRoute(this.getUrlInfo());
        });
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
            // 带参数的路由，解析路由参数
            if (param.includes('?')) {
                const paramStr = param.split('?');
                const paramsArr = paramStr[1].split('&');
                const params = {};
                for (const item of paramsArr) {
                    const key = item.split('=')[0];
                    const data = item.split('=')[1];
                    params[key] = data;
                }
                this.path = paramStr[0];
                this.params = params;
            } else {
                this.path = param;
            }
            if (!replace && this.path && this.path !== param) {
                this.historyRouteList.unshift({ path: this.path, data: this.params });
            }
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
            this.push('/login');
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
