const m = require('mithril');
const table = require('@/pages/page/myAssets/tradeTable/tradeTableView');
const tradingAccountLegalIndex = require('@/pages/page/myAssets/tradingAccountLegal/tradingAccountLegalIndex');

module.exports = {
    oninit: () => {
        tradingAccountLegalIndex.initFn();
    },
    view: () => {
        return m('div', {}, [
            m(table, { type: 'legalColumnData', typeData: 'legalData' })
        ]);
    },
    onremove: () => {
        tradingAccountLegalIndex.removeFn();
    }
};