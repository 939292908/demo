const m = require('mithril');
const l180n = require('@/languages/I18n').default;
require('./index.scss');

module.exports = {
    back: function () {
        window.router.go(-1);
    },
    toUrl: function () {
        m.route.set("/myWalletIndex");
    },
    view: function (vNode) {
        return m('div.level-3-navigation has-bg-level-2', [
            m('div.content-width nav-content', [
                m('div.title-medium dis-flex', [
                    m('div.itemNav', { onclick: this.back }, m('i', { class: `iconfont icon-Return has-text-title` })),
                    m('div.itemNav', { onclick: this.toUrl }, m('span', l180n.$t('10057')/* '提币' */))
                ])
            ])
        ]);
    }
};