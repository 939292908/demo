const m = require('mithril');
const TradeAccountIndex = require('@/views/page/myAssets/myWalletIndex/children/tradeAccount/TradeAccountIndex');
require('@/views/page/myAssets/myWalletIndex/children/tradeAccount/TradingAccount.scss');
const table = require('@/views/page/myAssets/myWalletIndex/tradeTable/tradeTableView');
const wlt = require('@/models/wlt/wlt');

module.exports = {
    oninit: vnode => {
        wlt.init();
        TradeAccountIndex.initFn(vnode);
    },
    view: () => {
        return m('div', { class: 'views-pages-myassets-tradingAccount pt-4' }, [
            // m('div.tradingAccount mb-3 tabs', {}, [
            //     m('ul.tradingAccount_nav mx-5', [
            //         TradeAccountIndex.navAry.map((item) => {
            //             return m('li', { class: '' + (TradeAccountIndex.pageFlag === item.idx ? "is-active" : ''), onclick: () => { TradeAccountIndex.setPageFlag(item.idx); } }, m('a', {}, item.val));
            //         })
            //     ])
            // ]),
            TradeAccountIndex.pageFlag === '01' ? m(table, {
                tableData: wlt.wallet['01'],
                tableType: 'contract',
                accountTitle: '合约账户',
                hideZeroFlag: false,
                accountBanlance:
                    TradeAccountIndex.currency === 'BTC' ? wlt.contractTotalValueForBTC : wlt.contractTotalValueForUSDT
            })
                : (TradeAccountIndex.pageFlag === '02' ? m(table, {
                    tableData: wlt.wallet['02'],
                    tableType: 'coin',
                    accountTitle: '币币账户',
                    hideZeroFlag: false,
                    accountBanlance:
                        TradeAccountIndex.currency === 'BTC' ? wlt.coinTotalValueForBTC : wlt.coinTotalValueForUSDT
                })
                    : m(table, {
                        tableData: wlt.wallet['04'],
                        tableType: 'legal',
                        accountTitle: '法币账户',
                        hideZeroFlag: false,
                        accountBanlance:
                            TradeAccountIndex.currency === 'BTC' ? wlt.legalTotalValueForBTC : wlt.legalTotalValueForUSDT
                    }))
        ]);
    },
    onupdate: (vnode) => {
        TradeAccountIndex.updateFn(vnode);
    },
    onremove: () => {
        TradeAccountIndex.removeFn();
    }
};