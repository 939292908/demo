const m = require('mithril');
const I18n = require('@/languages/I18n').default;
require('./shareH5.scss');
const utils = require('@/util/utils').default;

module.exports = {
    view(vnode) {
        return m('div', { class: `share-h5 has-bg-primary has-text-centered pb-7` }, [
            m('div', { class: `share-h5-title pt-5 font-weight-bold` }, I18n.$t('20050')/* 分享红包 */),
            m('div', { class: `share-h5-title-box` }, [
                m('div', { class: `share-h5-title-2 has-text-level-1 px-7 mt-2` }, I18n.$t('20051')/* 红包资产可用来提现，交易 */)
            ]),
            m('img', { class: "mt-7", src: require("@/assets/img/shareBgH5.svg").default }),
            // m('img', { class: ``, src: require("@/assets/img/shareBgH5.png").default }),
            m('div', { class: `share-h5-link-box mt-8 mb-7 pa-3 mx-6 border-radius-small` }, [
                m('div', { class: `share-h5-link-content pa-7 has-bg-level-1 has-text-level-3 body-4` }, [
                    m('div', { class: `share-h5-link no-wrap` }, m.route.param().link)
                ])
            ]),
            m('div', {
                class: `share-h5-copy-link border-radius-small py-3 mx-6 font-weight-bold body-4 has-text-level-1`,
                onclick() {
                    utils.copyText(m.route.param().link);
                }
            }, I18n.$t('20031')/* 复制链接 */)
        ]);
    }
};