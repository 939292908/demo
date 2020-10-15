// 参数说明
// width (选填)
// text (选填)
// onclick (选填)
// loading (选填)
// size (选填) size-1 / size-2
// class: 'is-rounded'(半圆按钮) 'is-outlined'(镂空)
var m = require("mithril");
const I18n = require('@/languages/I18n').default;
require('./Button.scss');
const logic = {
    // class
    getClass (vnode) {
        var classStr = `my-button button ${typeof vnode.attrs.class === 'function' ? vnode.attrs.class() : (vnode.attrs.class || '')} `;
        // 大小
        if (!vnode.attrs.size) { // 默认
            classStr += 'py-3 ';
        } else {
            if (vnode.attrs.size === 'size-1') classStr += 'py-3 ';
            if (vnode.attrs.size === 'size-2') classStr += 'py-2 ';
        }
        // loading
        if (vnode.attrs.loading) classStr += 'is-loading ';
        return classStr;
    },
    // style
    getStyle (vnode) {
        var styleStr = vnode.attrs.style || '';
        if (vnode.attrs.width) styleStr += 'width:' + (vnode.attrs.width <= 1 ? vnode.attrs.width * 100 + '%;' : vnode.attrs.width + 'px;');
        return styleStr;
    }
};

module.exports = {
    view (vnode) {
        return m('button', {
            class: logic.getClass(vnode),
            style: logic.getStyle(vnode),
            disabled: typeof vnode.attrs.disabled === 'function' ? vnode.attrs.disabled() : vnode.attrs.disabled,
            onclick() {
                vnode.attrs.onclick && vnode.attrs.onclick(vnode.attrs);
            }
        }, vnode.attrs.label || I18n.$t('20006'/* 确定 */));
    }
};
