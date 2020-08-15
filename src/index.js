import config from '@/config';
import _console from '@/log/log';
// 全局广播
import Broadcast from '@/broadcast/broadcast';
// 多语言
import I18n from '@/languages/dI18n';
// 工具库
import utils from '@/util/utils';
// 错误码库
import errCode from '@/util/errCode';
import Validate from '@/libs/validate';
// 请求接口配置
import Conf from "@/api/apiConf";

window.exchId = config.exchId;

window.exchConfig = config;

// log日志管理
window._console = new _console();

// 全局广播
window.gBroadcast = new Broadcast();

// 多语言
window.gI18n = new I18n();

// 工具库
window.utils = utils;

// 错误码库
window.errCode = errCode;

window.validate = new Validate();

// 请求接口配置
const instConf = new Conf(process.env.BUILD_ENV);
const api = instConf.GetActive();
instConf.updateNetLines();

const m = require('mithril');
// 主题颜色
import("@/styles/index");
// UI库
import('@/styles/bluma.scss');
// 公用样式
import('@/styles/common_size.scss');
import('@/styles/common_color.scss');
import('@/styles/common_other.scss');

// iconfont
import('@/assets/iconfont/iconfont.js');
import('@/assets/iconfont/iconfont.css');
// 轮播
import('swiper/swiper-bundle.css');
// 极验
import('@/libs/gt');
// 全局API请求
const WebApi = require('@/api/webApi');
window.gWebApi = new WebApi({ baseUrl: api.WebAPI });

const Interval = 1000;
const WSApi = require('@/api/wsApi');
window.gWsApi = new WSApi({
    baseUrl: api.WSMKT,
    Typ: 'mkt'
});
setInterval(function () {
    window.gWsApi.stately.do(window.gWsApi);
}, Interval);

window.onresize = function (arg) {
    // 判断是否是移动端
    window.isMobile = utils.isMobile();
    window.gBroadcast.emit(window.gBroadcast.ONRESIZE_UPD, { Ev: window.gBroadcast.ONRESIZE_UPD });
};
// 判断是否是移动端
window.isMobile = utils.isMobile();

import('@/views/index').then(arg => {
    const root = document.body;
    m.mount(root, arg.default);
    import('@/route/index');
});
