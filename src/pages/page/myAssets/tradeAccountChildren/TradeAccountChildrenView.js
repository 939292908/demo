const m = require('mithril');
const table = require('@/pages/page/myAssets/tradeTable/tradeTableView');
const TradeAccountChildrenIndex = require('@/pages/page/myAssets/TradeAccountChildren/TradeAccountChildrenIndex');

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