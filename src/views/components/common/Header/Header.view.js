const m = require('mithril');
require('./Header.scss');
// const header = require('./header.logic.js');

module.exports = {
    oncreate() {
    },
    view(vnode) {
        return m('div', { class: `pub-header is-between is-align-center` }, [
            m('div', { onclick() { vnode.attrs.left?.onclick && vnode.attrs.left?.onclick(); } }, vnode.attrs.left?.label || '←'),
            m('div', { onclick() { vnode.attrs.center?.onclick && vnode.attrs.center?.onclick(); } }, vnode.attrs.center?.label || ''),
            m('div', { onclick() { vnode.attrs.right?.onclick && vnode.attrs.right?.onclick(); } }, vnode.attrs.right?.label || '')
        ]);
    }
};