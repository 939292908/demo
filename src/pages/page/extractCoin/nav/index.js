const m = require('mithril');
require('./index.scss');
module.exports = {
    view: function (vNode) {
        return m('div.level-3-navigation has-bg-level-2', [
            m('div.content-width nav-content', [
                m('div.title-medium ', [
                    m('div', [
                        m('i', { class: 'iconfont' }, '←'),
                        m('span', '充币')
                    ])
                ])
            ])
        ]);
    }
};