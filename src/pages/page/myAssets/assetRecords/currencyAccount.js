const m = require('mithril');
const accountTable = require('./accountTable');
const commonSelectionBox = require('./commonSelectionBox');

module.exports = {
    oninit: function () {
    },
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-currencyAccount' }, [
            m(commonSelectionBox, { num: '02' }),
            m(accountTable, { num: '02' })
        ]);
    }
};