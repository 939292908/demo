const m = require('mithril');
const myWalletTable = require('@/views/pages/Myassets/assetRecords/myWalletTable');

require('@/styles/pages/Myassets/assetRecords.scss');
module.exports = {
    oninit: function () {
    },
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-currencyAccount' }, [
            m(myWalletTable)
        ]);
    }
};