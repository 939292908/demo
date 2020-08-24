
// import broadcast from '@/broadcast/broadcast';
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
        console.log(param);
        this.pageFlag = param;
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
    oninit: function (vnode) {
        if (vnode.attrs.idx !== 0) {
            tradingAccount.setPageFlag(vnode.attrs.idx);
        } else {
            tradingAccount.setPageFlag(1);
        }
    },
    view: function (vnode) {
        const props = {
            tradingAccount: tradingAccount
        };
        return TradeAccountView(props, vnode);
    },
    // 一直刷新
    // onupdate: function (vnode) {
    //     console.log('update/..nzm');
    //     tradingAccount.setPageFlag(vnode.attrs.idx);
    //     m.redraw();
    // },
    onremove: function () {
        broadcast.offMsg({
            key: 'tradingAccount',
            isall: true
        });
    }
};