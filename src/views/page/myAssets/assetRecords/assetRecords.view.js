const m = require('mithril');
const header = require('../header/header.view');
const assetTable = require('../assetTable/assetTable.view');
const walletTable = require('../walletTable/walletTable.view');
const accountSelect = require('@/models/asset/accountSelect');
const AssetsRecords = require('../../../../models/asset/assetsRecords');

require('./assetRecords.scss');

module.exports = {
    oninit: function () {
        AssetsRecords.oninit();
    },
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords' }, [
            m('div', { class: 'columns-flex-warp has-bg-sub-level-1' }, [
                m('div.container', [
                    m(header, { highlightFlag: 1 })
                ])
            ]),
            m('div.pt-7', { class: ' theme--light' }, [
                m('div', { class: 'container pb-7 ' }, [
                    m('div', { class: 'has-bg-level-2 border-radius-small' }, [
                        m('div', { class: 'columns-flex-warp views-pages-Myassets-assetRecords-head px-4' }, [
                            m('div', {
                                class: "cursor-pointer mr-7" + (accountSelect.getAccount() === '03' ? ' has-text-primary header-highlight' : ''),
                                onclick: function () {
                                    accountSelect.setAccount('03');
                                    AssetsRecords.getAllList();
                                }
                            }, ['我的钱包']),
                            m('div', {
                                class: "cursor-pointer mr-7" + (accountSelect.tradeAccount.includes(accountSelect.getAccount()) ? ' has-text-primary header-highlight' : ''),
                                onclick: function () {
                                    accountSelect.setAccount('01');
                                    AssetsRecords.getAllList();
                                }
                            }, ['交易账户']),
                            m('div', {}, ['其他账户'])
                        ]),
                        accountSelect.getAccount() === '03'
                            ? m(walletTable, {
                                datadisplayvalue: AssetsRecords.datadisplayvalue,
                                dataArrObj: AssetsRecords.dataArrObj,
                                grossValue: AssetsRecords.grossValue,
                                displayValue: AssetsRecords.displayValue,
                                displayEvnet: AssetsRecords.displayEvnet
                            })
                            : m(assetTable, {
                                datadisplayvalue: AssetsRecords.datadisplayvalue,
                                dataArrObj: AssetsRecords.dataArrObj,
                                grossValue: AssetsRecords.grossValue,
                                changeSelect: () => {
                                    AssetsRecords.getAllList();
                                }
                            })
                    ])
                ])
            ])

        ]);
    },
    onremove: function () {
        AssetsRecords.onremove();
    }
};
