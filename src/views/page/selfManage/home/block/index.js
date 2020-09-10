const m = require('mithril');
require('./block.scss');

module.exports = {
    view: function (vnode) {
        return m('.block dis-flex justify-between align-center', { onclick: vnode.attrs.onclick }, [
            m('.leftDom dis-flex align-center', [
                m('div.Icon', m('.imgBox', vnode.attrs.Icon)),
                m('div.content-block', [
                    m('.blockTitle', vnode.attrs.title),
                    m('.blockSubhead', vnode.attrs.subhead)
                ])
            ]),
            m('.rightDom', vnode.children)
        ]);
    }
};