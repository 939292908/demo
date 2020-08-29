const m = require('mithril');
const broadcast = require('@/broadcast/broadcast');
const wlt = require('@/models/wlt/wlt');

module.exports = {
    vnode: {},
    currency: 'BTC',
    pageFlag: '01', // 01：合约账户，02：币币账户，04：法币账户
    oldValue: '01',
    accountBanlance: 0, // 交易账户中表格右上角的币种总额
    accountTitle: '', // 交易账户中表格右上角的币种
    setPageFlag: function (param) {
        this.pageFlag = param;
        this.vnode.attrs.setIdx(param);
    },
    setCurrency: function (param) {
        this.currency = param;
    },
    setOldValue: function (param) {
        this.oldValue = param;
    },
    navAry: [{ idx: '01', val: '合约账户' }, { idx: '02', val: '币币账户' }, { idx: '04', val: '法币账户' }],
    setAccountBanlanceAndTitle: function() {
        if (this.pageFlag === '01') {
            this.accountTitle = '合约账户';
            this.accountBanlance = this.currency === 'BTC' ? wlt.contractTotalValueForBTC : wlt.contractTotalValueForUSDT;
        } else if (this.pageFlag === '02') {
            this.accountTitle = '币币账户';
            this.accountBanlance = this.currency === 'BTC' ? wlt.coinTotalValueForBTC : wlt.coinTotalValueForUSDT;
        } else if (this.pageFlag === '04') {
            this.accountTitle = '法币账户';
            this.accountBanlance = this.currency === 'BTC' ? wlt.legalTotalValueForBTC : wlt.legalTotalValueForUSDT;
        }
    },
    initFn: function (vnode) {
        wlt.init();
        this.vnode = vnode;
        this.setPageFlag('01');
        broadcast.onMsg({
            key: 'tradeAccountIndex',
            cmd: broadcast.CHANGE_SW_CURRENCY,
            cb: (arg) => {
                this.setCurrency(arg);
            }
        });
    },
    updateFn: function (vnode) {
        // false：通过交易tab进来
        if (this.oldValue !== vnode.attrs.idx) { // 作用：不与导航点击冲突
            this.setPageFlag(vnode.attrs.idx);
            m.redraw();
        }
        this.setOldValue(vnode.attrs.idx);
        this.setAccountBanlanceAndTitle();
    },
    removeFn: function () {
        broadcast.offMsg({
            key: 'tradeAccountIndex',
            isall: true
        });
    }
};