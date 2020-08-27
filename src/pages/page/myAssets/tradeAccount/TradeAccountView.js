const m = require('mithril');
const TradeAccountIndex = require('@/pages/page/myAssets/tradeAccount/TradeAccountIndex');
require('@/styles/pages/Myassets/tradingAccount.scss');

module.exports = {
    oninit() {
        TradeAccountIndex.initFn();
    },
    view() {
        return m('div', { class: 'views-pages-myassets-tradingAccount pt-4' }, [
            m('div.tradingAccount mb-3 tabs', {}, [
                m('ul.tradingAccount_nav mx-5', [
                    TradeAccountIndex.navAry.map((item) => {
                        return m('li', { class: '' + (TradeAccountIndex.pageFlag === item.idx ? "is-active" : ''), onclick: () => { TradeAccountIndex.setPageFlag(item.idx); } }, m('a', {}, item.val));
                    })
                ])
            ]),
            TradeAccountIndex.switchContent()
        ]);
    },
    onupdate(vnode) {
        TradeAccountIndex.updateFn(vnode);
    },
    onremove() {
        TradeAccountIndex.removeFn();
    }
};