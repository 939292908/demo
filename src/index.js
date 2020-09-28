function init() {
    const broadcast = require('./broadcast/broadcast');
    const utils = require('./util/utils').default;
    const models = require('./models');
    const m = require('mithril');
    // require('./api/index.js');
    // 主题颜色
    require("./styles/index");
    // UI库
    require('./styles/bluma.scss');

    if ((navigator.userAgent.indexOf('iPhone') > -1 || navigator.userAgent.indexOf('Mac OS') > -1)) {
        require('./styles/Adaptive.css');
    }
    // 极验
    import('./libs/gt');

    // 重写console.log
    // require('@/util/log');
    window.onresize = function (arg) {
        // 判断是否是移动端
        broadcast.emit({ cmd: broadcast.ONRESIZE_UPD, data: { Ev: broadcast.ONRESIZE_UPD } });
    };

    const index = require('./views/index');
    const root = document.querySelector('#app');
    m.mount(root, index.default);
    // iconfont
    import('./assets/iconfont/iconfont.js');
    import('./assets/iconfont/iconfont.css');
    require('@/router/index');
    models.getFunList();
    if (utils.getItem('ex-session')) {
        models.getUserInfo();
    }
}

const plusReady = function(arg) {
    console.log('red-packet plus is ready', arg);
    const Rpc = require('./models/plus/rpc/rpc.js');
    Rpc.init();
    init();
};
if (window.navigator.userAgent.includes('Html5Plus')) {
    if (window.plus) {
        plusReady();
    }
    document.addEventListener("plusready", plusReady, false);
} else {
    init();
}
