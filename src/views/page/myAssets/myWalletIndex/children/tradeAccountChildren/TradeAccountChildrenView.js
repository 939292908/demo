const m = require('mithril');
const table = require('@/Views/page/myAssets/myWalletIndex/children/tradeTable/tradeTableView');
const TradeAccountChildrenIndex = require('@/Views/page/myAssets/myWalletIndex/children/TradeAccountChildren/TradeAccountChildrenIndex');

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