const m = require('mithril');
const TradeAccountIndex = require('@/views/page/myAssets/myWalletIndex/children/tradeAccount/TradeAccountIndex');
require('@/views/page/myAssets/myWalletIndex/children/tradeAccount/TradingAccount.scss');
const table = require('@/views/page/myAssets/myWalletIndex/tradeTable/TradeTable.view');
const wlt = require('@/models/wlt/wlt');
const I18n = require('@/languages/I18n').default;

module.exports = {
    oninit: vnode => {
        TradeAccountIndex.initFn(vnode);
    },
    view: () => {
        return m('div', { class: 'views-pages-myassets-tradingAccount pt-4' }, [
            TradeAccountIndex.pageFlag === '01' ? m(table, {
                tableData: wlt.wallet['01'],
                tableType: 'contract',
                accountTitle: I18n.$t('10072') /* '合约账户' */,
                hideZeroFlag: false,
                accountBanlance:
                    TradeAccountIndex.currency === 'BTC' ? wlt.contractTotalValueForBTC : wlt.contractTotalValueForUSDT
            })
                : (TradeAccountIndex.pageFlag === '02' ? m(table, {
                    tableData: wlt.wallet['02'],
                    tableType: 'coin',
                    accountTitle: I18n.$t('10073') /* '币币账户' */,
                    hideZeroFlag: false,
                    accountBanlance:
                        TradeAccountIndex.currency === 'BTC' ? wlt.coinTotalValueForBTC : wlt.coinTotalValueForUSDT
                })
                    : m(table, {
                        tableData: wlt.wallet['04'],
                        tableType: 'legal',
                        accountTitle: I18n.$t('10074') /* '法币账户' */,
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