const m = require('mithril');
const myWalletTable = require('./myWalletTable');
const commonSelectionBox = require('./commonSelectionBox');

const assetRecordsWallet = {
    assetValuation: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-myWallet-wrapper' }, [
            m('div', { class: 'cursor-pointer mb-3 has-text-primary' }, [
                m('span', {}, ['我的钱包'])
            ]),
            m(commonSelectionBox),
            m(myWalletTable)
        ]);
    }
};
module.exports = {
    oninit: function () {
    },
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-assetRecordsWallet' }, [
            assetRecordsWallet.assetValuation()
        ]);
    }
};