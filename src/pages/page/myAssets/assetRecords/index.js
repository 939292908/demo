const m = require('mithril');
const header = require('@/pages/page/myAssets/header/HeaderView');
const AssetRecords = require('./assetRecordsModel');

require('@/styles/pages/Myassets/assetRecords.scss');

module.exports = {
    oninit: function () {
        // AssetRecords.initAssetList();
    },
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords' }, [
            m('div', {
                onclick: function () {
                    AssetRecords.inheritEvent(event);
                }
            }, [
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
                                    class: "cursor-pointer mr-7" + (AssetRecords.switchValue === 0 ? ' has-text-primary header-highlight' : ''),
                                    onclick: function () {
                                        AssetRecords.switchEvnet(0);
                                    }
                                }, ['我的钱包']),
                                m('div', {
                                    class: "cursor-pointer mr-7" + (AssetRecords.switchValue === 1 ? ' has-text-primary header-highlight' : ''),
                                    onclick: function () {
                                        AssetRecords.switchEvnet(1);
                                    }
                                }, ['交易账户']),
                                m('div', {}, ['其他账户'])
                            ]),
                            AssetRecords.switchContent()
                        ])
                    ])
                ])
            ])
        ]);
    }
};
