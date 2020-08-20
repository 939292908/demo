import broadcast from './broadcast/broadcast';
import utils from './util/utils';
import m from 'mithril';
// 主题颜色
import("./styles/index");
// UI库
import('./styles/bluma.scss');
// 公用样式
import('./styles/common_size.scss');
import('./styles/common_color.scss');
import('./styles/common_other.scss');

// iconfont
import('./assets/iconfont/iconfont.js');
import('./assets/iconfont/iconfont.css');
// 轮播
import('swiper/swiper-bundle.css');
// 极验
import('./libs/gt');

window.onresize = function (arg) {
    // 判断是否是移动端
    window.isMobile = utils.isMobile();
    broadcast.emit({ cmd: 'ONRESIZE_UPD', data: { Ev: 'ONRESIZE_UPD' } });
    // window.gBroadcast.emit(window.gBroadcast.ONRESIZE_UPD, { Ev: window.gBroadcast.ONRESIZE_UPD });
};

import('./pages/home/index').then(arg => {
    const root = document.body;
    m.mount(root, arg.default);
    import('@/router/index');
});
