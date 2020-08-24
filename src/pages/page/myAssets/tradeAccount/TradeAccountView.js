const m = require('mithril');

require('@/styles/pages/Myassets/tradingAccount.scss');
// const tradeAccount = require('@/pages/page/myAssets/tradeAccount/tradeAccount');

module.exports = function (props, vnode) {
    const { tradingAccount } = props;
    return m('div', { class: 'views-pages-myassets-tradingAccount pt-4' }, [
        m('div.tradingAccount mb-3', {}, [
            m('ul.tradingAccount_nav ml-5 tabs', { style: { marginBottom: '-10px' } }, [
                tradingAccount.navAry.map((item) => {
                    return m('li', { class: 'cursor-pointer ' + (tradingAccount.pageFlag === item.idx ? "is-active" : ''), onclick: function () { tradingAccount.setPageFlag(item.idx); } }, m('a', {}, item.val));
                    // return m('li', { class: 'cursor-pointer ' + (tradingAccount.pageFlag === (vnode.attrs.idx === null ? item.idx : vnode.attrs.idx) ? "is-active" : ''), onclick: function () { tradingAccount.setPageFlag(item.idx); } }, m('a', {}, item.val));
                })
            ]),
            // m('ul.tradeAccount_nav ml-5', [
            //     tradingAccount.navAry.map((item, index) => {
            //         return m('li', { class: 'cursor-pointer mr-8 ' + (tradingAccount.pageFlag === item.idx ? "has-text-primary is-checkLi" : ''), onclick: function () { tradingAccount.setPageFlag(item.idx); } }, item.val);
            //     })
            // ]),
            // vnode.attrs.idx,
            tradingAccount.switchContent()
        ])
    ]);
};