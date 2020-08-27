const m = require('mithril');
const table = require('@/pages/page/myAssets/tradeTable/tradeTableView');
const myWalletIndex = require('@/pages/page/myAssets/myWallet/MyWalletIndexMin');

module.exports = {
    oninit: () => {
        myWalletIndex.initFn();
    },
    view: () => {
        return m('div', {}, [
            m(table, { type: 'walletColumnData', typeData: 'walletData' })
        ]);
    },
    onremove: () => {
        myWalletIndex.removeFn();
    }
};