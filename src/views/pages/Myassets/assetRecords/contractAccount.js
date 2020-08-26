const m = require('mithril');
const accountTable = require('./accountTable');
const commonSelectionBox = require('./commonSelectionBox');

module.exports = {
    oninit: function () {
    },
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-contractAccount' }, [
            m(commonSelectionBox, { num: '01' }),
            m(accountTable, { num: '01' })
        ]);
    }
};