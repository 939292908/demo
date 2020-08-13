const m = require('mithril');
const myWalletTable = require('@/views/pages/Myassets/assetRecords/myWalletTable');

require('@/styles/pages/Myassets/assetRecords.scss');
const contractAccount = {
    assetValuation: function () {
        return m('div', {}, [
            m(myWalletTable)
        ]);
    }
};
module.exports = {
    oninit: function () {
    },
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-contractAccount' }, [
            contractAccount.assetValuation()
        ]);
    }
};