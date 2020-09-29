const m = require('mithril');
require('./Header.scss');

module.exports = {
    view(vnode) {
        return m('div', { class: `pub-header is-between is-align-center ${vnode.attrs.class || ''}` }, [
            // 左
            m('button.button', { onclick() { vnode.attrs.left?.onclick && vnode.attrs.left?.onclick(); } }, [
                vnode.attrs.left?.label || m('i', { class: `iconfont icon-arrow-left has-text-level-1` })
            ]),
            // 中
            m('button.button.has-text-level-1', { onclick() { vnode.attrs.center?.onclick && vnode.attrs.center?.onclick(); } }, [
                vnode.attrs.center?.label || ''
            ]),
            // 右
            m('button.button', { class: `pr-3 ${vnode.attrs.right?.loading ? 'is-loading' : ''}`, onclick() { vnode.attrs.right?.onclick && vnode.attrs.right?.onclick(); } }, [
                vnode.attrs.right?.label || ''
            ])
        ]);
    }
};