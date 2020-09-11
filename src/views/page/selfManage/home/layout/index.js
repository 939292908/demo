const m = require('mithril');
require('./layout.scss');

module.exports = {
    view: function (vnode) {
        return m('.manageLayOut', [
            m('.header has-bg-sub-level-1', m('.content-width marg-auto', [
                m.fragment(vnode.attrs.nav),
                m('div.pad-bottom', m.fragment(vnode.attrs.content))
            ])),
            m('.main', m('.content-width marg-auto mainBody pb-7', vnode.children))
        ]);
    }
};