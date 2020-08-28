const m = require('mithril');
const header = require('../header/header.view');
const AssetRecords = require('./assetRecords.model');
const assetTable = require('../assetTable/assetTable.view');
const walletTable = require('../walletTable/walletTable.view');

require('./assetRecords.scss');

module.exports = {
    oninit: function () {
        // AssetRecords.initAssetList();
    },
    view: function () {
        const table = AssetRecords.switchValue === '03'
            ? m(walletTable)
            : m(assetTable, {
                switchValue: AssetRecords.switchValue,
                onSwitchValue: val => { AssetRecords.switchValue = val; }
            });
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
                                class: "cursor-pointer mr-7" + (AssetRecords.switchValue === '03' ? ' has-text-primary header-highlight' : ''),
                                onclick: function () {
                                    AssetRecords.setSwitchValue('03');
                                }
                            }, ['我的钱包']),
                            m('div', {
                                class: "cursor-pointer mr-7" + (AssetRecords.tradeAccount.includes(AssetRecords.switchValue) ? ' has-text-primary header-highlight' : ''),
                                onclick: function () {
                                    AssetRecords.setSwitchValue('01');
                                }
                            }, ['交易账户']),
                            m('div', {}, ['其他账户'])
                        ]),
                        table
                    ])
                ])
            ])

        ]);
    }
};
