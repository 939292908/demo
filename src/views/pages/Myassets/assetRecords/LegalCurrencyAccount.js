const m = require('mithril');
const accountTable = require('./accountTable');
const commonSelectionBox = require('./commonSelectionBox');

require('@/styles/pages/Myassets/assetRecords.scss');
module.exports = {
    oninit: function () {
    },
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-LegalCurrencyAccount' }, [
            m(commonSelectionBox, { num: 3 }),
            m(accountTable)
        ]);
    }
};