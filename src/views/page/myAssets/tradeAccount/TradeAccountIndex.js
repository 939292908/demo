
const m = require('mithril');
const broadcast = require('@/broadcast/broadcast');

const tradingAccountContract = require('@/pages/page/myAssets/tradingAccountContract/TradingAccountContractIndex');
const tradingAccountCoin = require('@/pages/page/myAssets/tradingAccountCoin/TradingAccountCoinIndex');
const tradingAccountLegal = require('@/pages/page/myAssets/tradingAccountLegal/TradingAccountLegalIndex');
const TradeAccountView = require('@/pages/page/myAssets/tradeAccount/TradeAccountView');

const tradingAccount = {
    // 01：合约账户，02：币币账户，04：法币账户
    pageFlag: 1,
    setPageFlag: function (param) {
        console.log('nzm', 'setPageFlag......', 'param--', param);
        this.pageFlag = param;
    },
    oldValue: 1,
    setOldValue: function (param) {
        this.oldValue = param;
    },
    switchContent: function () {
        switch (this.pageFlag) {
        case 1:
            return m(tradingAccountContract);
        case 2:
            return m(tradingAccountCoin);
        case 4:
            return m(tradingAccountLegal);
        }
    },
    navAry: [{ idx: 1, val: '合约账户' }, { idx: 2, val: '币币账户' }, { idx: 4, val: '法币账户' }]
};
module.exports = {
    oninit: function () {
        tradingAccount.setPageFlag(1);
    },
    view: function (vnode) {
        const props = {
            tradingAccount: tradingAccount
        };
        return TradeAccountView(props, vnode);
    },
    onupdate: function (vnode) {
        // false：通过交易tab进来
        if (tradingAccount.oldValue !== vnode.attrs.idx) {
            tradingAccount.setPageFlag(vnode.attrs.idx);
            m.redraw();
        }
        // vnode.attrs.name = tradingAccount.pageFlag;
        tradingAccount.setOldValue(vnode.attrs.idx);
    },
    onremove: function () {
        broadcast.offMsg({
            key: 'tradingAccount',
            isall: true
        });
    }
};