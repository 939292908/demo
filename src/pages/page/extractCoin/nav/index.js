const m = require('mithril');
const Back = require('./Return.png').default;
require('./index.scss');

module.exports = {
    view: function (vNode) {
        return m('div.level-3-navigation has-bg-level-2', [
            m('div.content-width nav-content', [
                m('div.title-medium dis-flex', [
                    m('div.itemNav', m('img', { src: Back })),
                    m('div.itemNav', m('span', '提币'))
                ])
            ])
        ]);
    }
};