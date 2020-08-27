const m = require('mithril');

require('@/styles/pages/Myassets/tradingAccount.scss');

module.exports = function (props, vnode) {
    const { tradingAccount } = props;
    return m('div', { class: 'views-pages-myassets-tradingAccount pt-4' }, [
        m('div.tradingAccount mb-3 tabs', {}, [
            m('ul.tradingAccount_nav mx-5', [
                tradingAccount.navAry.map((item) => {
                    return m('li', { class: '' + (tradingAccount.pageFlag === item.idx ? "is-active" : ''), onclick: function () { tradingAccount.setPageFlag(item.idx); } }, m('a', {}, item.val));
                })
            ])
        ]),
        tradingAccount.switchContent()
    ]);
};