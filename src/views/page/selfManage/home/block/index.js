const m = require('mithril');
require('./block.scss');

module.exports = {
    view: function (vnode) {
        return m('.leezBlock dis-flex justify-between align-center py-7 px-8', { onclick: vnode.attrs.onclick }, [
            m('.leftDom dis-flex align-center', [
                m('div.Icon mr-5', vnode.attrs.Icon),
                m('div.content-block', [
                    m('.blockTitle title-small has-text-title', vnode.attrs.title),
                    m('.blockSubhead body-5 has-text-level-3', vnode.attrs.subhead)
                ])
            ]),
            m('.rightDom', vnode.children)
        ]);
    }
};