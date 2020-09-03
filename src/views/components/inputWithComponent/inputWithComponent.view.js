const m = require('mithril');

import('./inputWithComponent.scss');

/**
 * 输入框扩展
 * @param options 输入框属性
 * @param leftComponents 左组件
 * @param rightComponents 右组件
 * @param addClass 添加的样式class
 */
module.exports = {
    oninit (vnode) {
    },
    oncreate (vnode) {
    },
    view (vnode) {
        const inside = [];
        if (vnode.attrs.leftComponents) {
            inside.push(vnode.attrs.leftComponents);
            if (!vnode.attrs.hiddenLine) { inside.push(m('span.line', {}, [])); }
        }
        inside.push(m('input.input.without-border.in-input', vnode.attrs.options, []));
        if (vnode.attrs.rightComponents) {
            if (!vnode.attrs.hiddenLine) { inside.push(m('span.line', {}, [])); }
            inside.push(vnode.attrs.rightComponents);
        }

        return m('div.input-with-components', {
            class: vnode.attrs.addClass
        }, [
            m('div.input.px-1', {}, inside)
        ]);
    }
};