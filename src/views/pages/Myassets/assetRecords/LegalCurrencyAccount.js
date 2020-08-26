const m = require('mithril');
const accountTable = require('./accountTable');
const commonSelectionBox = require('./commonSelectionBox');

module.exports = {
    oninit: function () {
    },
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-LegalCurrencyAccount' }, [
            m(commonSelectionBox, { num: '04' }),
            m(accountTable, { num: '04' })
        ]);
    }
};