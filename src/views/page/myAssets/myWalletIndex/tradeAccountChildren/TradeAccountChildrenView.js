const m = require('mithril');
const table = require('@/views/page/myAssets/myWalletIndex/tradeTable/tradeTableView');
const TradeAccountChildrenIndex = require('@/views/page/myAssets/myWalletIndex/TradeAccountChildren/TradeAccountChildrenIndex');

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