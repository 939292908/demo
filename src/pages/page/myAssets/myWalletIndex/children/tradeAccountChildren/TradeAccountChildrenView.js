const m = require('mithril');
const table = require('@/pages/page/myAssets/myWalletIndex/children/tradeTable/tradeTableView');
const TradeAccountChildrenIndex = require('@/pages/page/myAssets/myWalletIndex/children/tradeAccountChildren/TradeAccountChildrenIndex');

module.exports = {
    oninit: () => {
        TradeAccountChildrenIndex.initFn();
    },
    view: (vnode) => {
        return m('div', {}, [
            m(table, { type: vnode.attrs.tableType, typeData: vnode.attrs.tableTypeData })
        ]);
    },
    onremove: () => {
        TradeAccountChildrenIndex.removeFn();
    }
};