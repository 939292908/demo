import m from 'mithril';

const defaultRoutePath = "/home";

m.route(document.querySelector('body .route-box'), defaultRoutePath, {
    '/home': {
        onmatch: function () {
            return import('@/pages/page/home/index');
        }
    },
    '/login': {
        onmatch: function () {
            return import('@/pages/page/login/login/loginView');
        }
    },
    '/register': {
        onmatch: function () {
            return import('@/pages/page/login/register/registerView');
        }
    },
    '/forgetPassword': {
        onmatch: function () {
            return import('@/pages/page/login/forgetPassword/forgetPasswordView');
        }
    },
    '/myWalletIndex': {
        onmatch: function() {
            return import('@/pages/page/myAssets/myWalletIndex/MyWalletIndexView');
        }
    },
    '/table': {
        onmatch: function() {
            return import('@/pages/page/myAssets/tradeTable/TradeTableView');
        }
    },
    '/assetRecords': {
        onmatch: function () {
            return import('@/pages/page/myAssets/assetRecords/index');
        }
    },
    '/extractCoin': {
        onmatch: () => import('@/pages/page/extractCoin/index')
    }
});

class Router {
    constructor() {
        this.path = defaultRoutePath;
        this.params = {};
        this.route = m.route;
        this.historyRouteList = new Array([]);
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
    push(param, replace = true) {
        if (typeof param === 'string') {
            if (replace && this.path && this.path !== param) {
                this.historyRouteList.unshift({ path: this.path, data: this.params });
            }
            this.path = param;
            this.route.set(param);
        } else {
            if (replace && this.path && this.path !== param.path) {
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
        routeData = routeData[0] || { path: defaultRoutePath };
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
        const route = routeData[routeData.length - 1] || { path: defaultRoutePath };
        if (!route) {
            return;
        }
        this.path = null;
        this.params = {};
        this.push(route, false);
    }
}

window.router = new Router();