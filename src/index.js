import broadcast from './broadcast/broadcast';
import utils from './util/utils';
import models from './models';
import m from 'mithril';
// 主题颜色
import("./styles/index");
// UI库
import('./styles/bluma.scss');
// 公用样式
// import('./styles/common_size.scss');
// import('./styles/common_color.scss');
// import('./styles/common_other.scss');

// 轮播
import('swiper/swiper-bundle.css');
// 极验
import('./libs/gt');

// 重写console.log
// require('@/util/log');
window.onresize = function (arg) {
    // 判断是否是移动端
    broadcast.emit({ cmd: broadcast.ONRESIZE_UPD, data: { Ev: broadcast.ONRESIZE_UPD } });
};

import('./views/index').then(arg => {
    const root = document.body;
    m.mount(root, arg.default);
    // iconfont
    import('./assets/iconfont/iconfont.js');
    import('./assets/iconfont/iconfont.css');
    import('@/router/index');
    models.getFunList();
    if (utils.getItem('loginState') && utils.getItem('ex-session')) {
        models.getUserInfo();
    }
});
