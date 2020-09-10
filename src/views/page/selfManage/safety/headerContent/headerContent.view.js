const m = require('mithril');

module.exports = {
    view: function () {
        return m('div.safety-header-cotent py-8', [
            m('div.mb-3 title-small safety-title', '账户安全'),
            m('div.body-1 has-text-level-4 safrty-sub', '完成安全设置提高您的账户安全')
        ]);
    }
};