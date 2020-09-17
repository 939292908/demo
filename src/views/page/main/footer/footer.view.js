const m = require('mithril');
require('./footer.scss');
const I18n = require("../../../../languages/I18n").default;
// const logic = require("./footer.logic");

module.exports = {
    view() {
        return m('div.views-pages-home-footer.container', [
            m('p', { class: `bottom-copyright is-hidden-mobile my-3` }, [
                `©2018-2020 XMEX.co${I18n.$t('10505' /** 保留所有权利 */)}`
            ])
        ]);
    }
};