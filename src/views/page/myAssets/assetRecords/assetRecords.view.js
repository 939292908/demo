const m = require('mithril');
const assetTable = require('../assetTable/assetTable.view');
const AssetRecords = require('@/models/asset/assetsRecords');
const assetSelectBox = require('../assetSelectBox/assetSelectBox.view');
const header = require('../../../components/indexHeader/indexHeader.view');
const I18n = require('@/languages/I18n').default;
require('./assetRecord.scss');
module.exports = {
    oninit() {
        AssetRecords.init('03');
        AssetRecords.setLanguageListen();
    },
    onremove() {
        AssetRecords.destroy();
    },
    view() {
        return m('div.theme--light', {}, [
            m('div.px-3.has-bg-sub-level-1.is-align-items-center', {}, [
                m('div.content-width', {}, [
                    m(header, {
                        highlightFlag: 1,
                        navList: [{ to: '/myWalletIndex', title: I18n.$t('10052')/* '我的资产' */ }, { to: '/assetRecords', title: I18n.$t('10053')/* '资金记录' */ }]
                    })
                ])
            ]),
            m('div.theme--light.page-myAssets-assetRecord', {}, [
                m('div.has-bg-level-1.is-align-items-center.py-7', {}, [
                    m('div.has-bg-level-2.content-width', {}, [
                        m('div.tabs.mb-0', {}, [
                            m('ul', {}, [
                                m('li', { class: AssetRecords.aType === '03' ? 'is-active' : '' }, [
                                    m('a.pa-0.mx-4', {
                                        onclick: e => {
                                            if (AssetRecords.aType === '03') return;
                                            AssetRecords.init('03');
                                        }
                                    }, [I18n.$t('10055')/* '我的钱包' */])
                                ]),
                                m('li', { class: AssetRecords.tradeAccount.includes(AssetRecords.aType) ? 'is-active' : '' }, [
                                    m('a.pa-0.mx-4', {
                                        onclick: e => {
                                            if (AssetRecords.tradeAccount.includes(AssetRecords.aType)) return;
                                            AssetRecords.init('01');
                                        }
                                    }, [I18n.$t('10060')/* '交易账户' */])
                                ]),
                                m('li', {}, [
                                    m('a.pa-0.mx-4', {
                                        onclick: e => {
                                            window.$message({ title: I18n.$t('10410')/* '提示' */, content: I18n.$t('10513')/* '暂未开放' */, type: 'primary' });
                                        }
                                    }, [I18n.$t('10061')/* '其他账户' */])
                                ])
                            ])
                        ]),
                        m('div.tabs.mb-0', {
                            style: `display:${AssetRecords.tradeAccount.includes(AssetRecords.aType) ? 'initial' : 'none'}`
                        }, [
                            m('ul', {}, [
                                m('li', { class: AssetRecords.aType === '01' ? 'is-active' : '' }, [
                                    m('a.pa-0.mx-4', {
                                        onclick: e => {
                                            if (AssetRecords.aType === '01') return;
                                            AssetRecords.init('01');
                                        }
                                    }, [I18n.$t('10072')/* '合约账户' */])
                                ]),
                                m('li', { class: AssetRecords.aType === '02' ? 'is-active' : '' }, [
                                    m('a.pa-0.mx-4', {
                                        onclick: e => {
                                            if (AssetRecords.aType === '02') return;
                                            AssetRecords.init('02');
                                        }
                                    }, [I18n.$t('10073')/* '币币账户' */])
                                ]),
                                m('li', { class: AssetRecords.aType === '04' ? 'is-active' : '' }, [
                                    m('a.pa-0.mx-4', {
                                        onclick: e => {
                                            if (AssetRecords.aType === '04') return;
                                            AssetRecords.init('04');
                                        }
                                    }, [I18n.$t('10074')/* '法币账户' */])
                                ])
                            ])
                        ]),
                        m('div.table-bg.px-5.pb-5', {}, [
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
                                typeList: AssetRecords.recordTypeName()[AssetRecords.aType],
                                type: AssetRecords.type,
                                onSelectType(type) {
                                    AssetRecords.onSelectType(type);
                                }
                            }),
                            m(assetTable, {
                                class: 'mt-7',
                                list: AssetRecords.showList,
                                loading: AssetRecords.loading,
                                aType: AssetRecords.aType
                            })
                        ])
                    ])
                ])
            ])
        ]);
    }
};