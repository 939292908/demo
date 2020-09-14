const m = require('mithril');
const l180n = require('@/languages/I18n').default;
module.exports = {
    view: function () {
        return m('div.safety-header-cotent py-8', [
            m('div.mb-3 title-small safety-title', l180n.$t('10181') /* '账户安全' */),
            m('div.body-1 has-text-level-4 safrty-sub', l180n.$t('10595') /* '完成安全设置提高您的账户安全' */)
        ]);
    }
};