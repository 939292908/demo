
// import broadcast from '@/broadcast/broadcast';
const m = require('mithril');
const broadcast = require('@/broadcast/broadcast');

require('@/styles/pages/Myassets/tradingAccount.scss');
const tradingAccountContract = require('@/views/pages/Myassets/tradingAccount_contract');
const tradingAccountCoin = require('@/views/pages/Myassets/tradingAccount_coin');
const tradingAccountLegal = require('@/views/pages/Myassets/tradingAccount_legal');

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
    navAry: [{ idx: 1, val: '合约账户' }, { idx: 2, val: '币币账户' }, { idx: 4, val: '法币账户' }],
    tradingAccountPage: function (vnode) {
        return m('div.tradingAccount mb-3', {}, [
            m('ul.tradingAccount_nav ml-5 tabs', [
                tradingAccount.navAry.map((item) => {
                    return m('li', { class: 'cursor-pointer ' + (tradingAccount.pageFlag === item.idx ? "is-active" : ''), onclick: function () { tradingAccount.setPageFlag(item.idx); } }, m('a', {}, item.val));
                })
            ]),
            // m('ul.tradingAccount_nav ml-5', [
            //     tradingAccount.navAry.map((item, index) => {
            //         return m('li', { class: 'cursor-pointer mr-8 ' + (tradingAccount.pageFlag === item.idx ? "has-text-primary" : ''), onclick: function () { tradingAccount.setPageFlag(item.idx); } }, item.val);
            //     })
            // ]),
            vnode.attrs.idx,
            tradingAccount.switchContent()
        ]);
    }
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
        return m('div', { class: 'views-pages-myassets-tradingAccount pt-4' }, [
            tradingAccount.tradingAccountPage(vnode)
        ]);
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