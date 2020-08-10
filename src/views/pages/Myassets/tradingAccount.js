const m = require('mithril');

require('@/styles/pages/Myassets/tradingAccount.css');
const tradingAccountContract = require('./tradingAccount_contract');
const tradingAccountCoin = require('./tradingAccount_coin');
const tradingAccountLegal = require('./tradingAccount_legal');

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
    tradingAccountPage: function () {
        return m('div.tradingAccount', {}, [
            m('div.tradingAccount_nav', [
                m('div', { class: "" + (tradingAccount.pageFlag === 0 ? "is-cyan" : ''), onclick: function () { tradingAccount.setPageFlag(0); } }, '合约账户'),
                m('div', { class: "" + (tradingAccount.pageFlag === 1 ? "is-purple" : ''), onclick: function () { tradingAccount.setPageFlag(1); } }, '币币账户'),
                m('div', { class: "" + (tradingAccount.pageFlag === 2 ? "is-red" : ''), onclick: function () { tradingAccount.setPageFlag(2); } }, '法币账户')
            ]),
            tradingAccount.switchContent()
        ]);
    }
};
module.exports = {
    view: function () {
        return m('div', { class: 'tradingAccount' }, [
            tradingAccount.tradingAccountPage()
        ]);
    }
};