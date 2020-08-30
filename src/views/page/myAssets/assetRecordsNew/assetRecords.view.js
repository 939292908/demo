const m = require('mithril');
const assetTable = require('../assetTableNew/assetTable.view');
const AssetRecords = require('@/models/asset/assetsRecordsNew');
const assetSelectBox = require('../assetSelectBox/assetSelectBox.view');
require('./assetRecord.scss');
module.exports = {
    oninit() {
        AssetRecords.init('03');
    },
    view() {
        return m('div.theme--light.page-myAssets-assetRecord', {}, [
            m('div.has-bg-level-1.is-align-items-center.py-7', {}, [
                m('div.has-bg-level-2.content-width.pa-5', {}, [
                    m('div.tabs.mb-0', {}, [
                        m('ul', {}, [
                            m('li.is-active', {}, [
                                m('a', {}, ['我的钱包'])
                            ]),
                            m('li', {}, [
                                m('a', {}, ['交易账户'])
                            ]),
                            m('li', {}, [
                                m('a', {}, ['其他账户'])
                            ])
                        ])
                    ]),
                    m('div.tabs.mb-0', {
                        hidden: !AssetRecords.tradeAccount.includes(AssetRecords.aType)
                    }, [
                        m('ul', {}, [
                            m('li.is-active', {}, [
                                m('a', {}, ['合约账户'])
                            ]),
                            m('li', {}, [
                                m('a', {}, ['币币账户'])
                            ]),
                            m('li', {}, [
                                m('a', {}, ['法币账户'])
                            ])
                        ])
                    ]),
                    m('div.table-bg', {}, [
                        m(assetSelectBox, {
                            class: 'mt-7',
                            coinList: AssetRecords.coinList[AssetRecords.aType],
                            coin: AssetRecords.coin,
                            onSelectCoin(coin) {
                                AssetRecords.onSelectCoin(coin);
                            },
                            onSelectTime(time) {
                                AssetRecords.onSelectTime(time);
                            },
                            typeList: AssetRecords.recordTypeName[AssetRecords.aType],
                            type: AssetRecords.type,
                            onSelectType(type) {
                                AssetRecords.onSelectType(type);
                            }
                        }),
                        m(assetTable, { class: 'mt-7', list: AssetRecords.showList })
                    ])
                ])
            ])
        ]);
    }
};