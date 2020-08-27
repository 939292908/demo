const m = require('mithril');
const table = require('@/pages/page/myAssets/tradeTable/tradeTableView');
const tradingAccountCoinIndex = require('@/pages/page/myAssets/tradingAccountCoin/tradingAccountCoinIndex');

module.exports = {
    oninit: () => {
        tradingAccountCoinIndex.initFn();
    },
    view: () => {
        return m('div', {}, [
            m(table, { type: 'coinColumnData', typeData: 'coinData' })
        ]);
    },
    onremove: () => {
        tradingAccountCoinIndex.removeFn();
    }
};