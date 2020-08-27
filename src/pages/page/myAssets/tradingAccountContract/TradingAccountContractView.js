const m = require('mithril');
const table = require('@/pages/page/myAssets/tradeTable/tradeTableView');
const tradingAccountContractIndex = require('@/pages/page/myAssets/tradingAccountContract/tradingAccountContractIndex');

module.exports = {
    oninit: () => {
        tradingAccountContractIndex.initFn();
    },
    view: () => {
        return m('div', {}, [
            m(table, { type: 'contractColumnData', typeData: 'contractData' })
        ]);
    },
    onremove: () => {
        tradingAccountContractIndex.removeFn();
    }
};