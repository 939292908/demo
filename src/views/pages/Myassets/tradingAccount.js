
// import broadcast from '@/broadcast/broadcast';
const m = require('mithril');
const broadcast = require('@/broadcast/broadcast');

require('@/styles/pages/Myassets/tradingAccount.scss');
const tradingAccountContract = require('@/views/pages/Myassets/tradingAccount_contract');
const tradingAccountCoin = require('@/views/pages/Myassets/tradingAccount_coin');
const tradingAccountLegal = require('@/views/pages/Myassets/tradingAccount_legal');

const tradingAccount = {
    // 0：合约账户，1：币币账户，2：法币账户
    pageFlag: 0,
    setPageFlag: function (param) {
        this.pageFlag = param;
    },
    switchContent: function () {
        switch (this.pageFlag) {
        case 0:
            return m(tradingAccountContract);
        case 1:
            return m(tradingAccountCoin);
        case 2:
            return m(tradingAccountLegal);
        }
    },
    navAry: ['合约账户', '币币账户', '法币账户'],
    tradingAccountPage: function () {
        return m('div.tradingAccount mb-3', {}, [
            m('ul.tradingAccount_nav ml-5 tabs', [
                tradingAccount.navAry.map((item, index) => {
                    return m('li', { class: 'cursor-pointer mr-8 ' + (tradingAccount.pageFlag === index ? "is-active" : ''), onclick: function () { tradingAccount.setPageFlag(index); } }, m('a', {}, item));
                })
            ]),
            // m('ul.tradingAccount_nav ml-5', [
            //     tradingAccount.navAry.map((item, index) => {
            //         return m('li', { class: 'cursor-pointer mr-8 ' + (tradingAccount.pageFlag === index ? "has-text-primary" : ''), onclick: function () { tradingAccount.setPageFlag(index); } }, item);
            //     })
            // ]),
            tradingAccount.switchContent()
        ]);
    }
};
module.exports = {
    oninit: function () {
        console.log("%c nzm %c", 'color:red');
        let page = 0;
        broadcast.onMsg({
            key: 'tradingAccount',
            cmd: broadcast.MA_CHANGE_TRADE_PAGE,
            cb: function (arg) {
                if (arg !== null) {
                    page = arg;
                }
            }
        });
        tradingAccount.setPageFlag(page);
    },
    view: function () {
        return m('div', { class: 'views-pages-myassets-tradingAccount pt-4' }, [
            tradingAccount.tradingAccountPage()
        ]);
    },
    onremove: function () {
        broadcast.offMsg({
            key: 'tradingAccount',
            isall: true
        });
    }
};