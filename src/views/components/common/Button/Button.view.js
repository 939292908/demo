// 参数说明
// width (选填)
// text (选填)
// onclick (选填)
// loading (选填)
// class: 'is-rounded'(半圆按钮) 'is-outlined'(镂空)
var m = require("mithril");
require('./Button.scss');
const logic = require('./Button.logic.js');

module.exports = {
    view (vnode) {
        return m('button', {
            class: logic.getClass(vnode),
            style: logic.getStyle(vnode),
            disabled: typeof vnode.attrs.disabled === 'function' ? vnode.attrs.disabled() : vnode.attrs.disabled,
            onclick() {
                vnode.attrs.onclick && vnode.attrs.onclick(vnode.attrs);
            }
        }, vnode.attrs.label || '确定');
    }
};
