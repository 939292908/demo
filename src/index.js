import broadcast from './broadcast/broadcast';
import utils from './util/utils';
import models from './models';
import m from 'mithril';
// 主题颜色
require("./styles/index");
// UI库
require('./styles/bluma.scss');

// 轮播
// import('swiper/swiper-bundle.css');
// 极验
// import('./libs/gt');
// import('./libs/echarts');

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
// import('./assets/iconfont/iconfont.js');
// import('./assets/iconfont/iconfont.css');
require('@/router/index');
models.getFunList();
if (utils.getItem('ex-session')) {
    models.getUserInfo();
}
