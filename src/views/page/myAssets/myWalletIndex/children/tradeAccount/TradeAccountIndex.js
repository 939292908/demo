const m = require('mithril');
const broadcast = require('@/broadcast/broadcast');
const TradeAccountChildrenView = require('@/views/page/myAssets/myWalletIndex/tradeAccountChildren/TradeAccountChildrenView');

module.exports = {
    // 01：合约账户，02：币币账户，04：法币账户
    pageFlag: '01',
    oldValue: '01',
    setPageFlag: function (param) {
        this.pageFlag = param;
    },
    setOldValue: function (param) {
        this.oldValue = param;
    },
    switchContent: function () {
        switch (this.pageFlag) {
        case '01':
            return m(TradeAccountChildrenView, { tableType: 'contractColumnData', tableTypeData: 'contractData' });
        case '02':
            return m(TradeAccountChildrenView, { tableType: 'coinColumnData', tableTypeData: 'coinData' });
        case '04':
            return m(TradeAccountChildrenView, { tableType: 'legalColumnData', tableTypeData: 'legalData' });
        default:
            break;
        }
    },
    navAry: [{ idx: '01', val: '合约账户' }, { idx: '02', val: '币币账户' }, { idx: '04', val: '法币账户' }],
    initFn: function () {
        this.setPageFlag('01');
    },
    updateFn: function (vnode) {
        // false：通过交易tab进来
        if (this.oldValue !== vnode.attrs.idx) { // 作用：不与导航点击冲突
            this.setPageFlag(vnode.attrs.idx);
            m.redraw();
        }
        this.setOldValue(vnode.attrs.idx);
    },
    removeFn: function () {
        broadcast.offMsg({
            key: 'this',
            isall: true
        });
    }
};