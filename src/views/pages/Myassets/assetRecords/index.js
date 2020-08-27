const m = require('mithril');
const assetRecordsWallet = require('./assetRecordsWallet');
const tradingAccount = require('./tradingAccount');
const header = require('@/views/pages/Myassets/header');
const broadcast = require('@/broadcast/broadcast');

require('@/styles/pages/Myassets/assetRecords.scss');

const assetRecords = {
    switchValue: 0,
    switchEvnet: function (val) {
        this.switchValue = val;
    },
    inheritEvent(event) {
        if (event.target.tagName !== 'BUTTON') {
            broadcast.emit({ cmd: 'displaySelect', data: 1 });
        }
    },
    switchContent: function () {
        switch (this.switchValue) {
        case 0:
            return m(assetRecordsWallet);
        case 1:
            return m(tradingAccount);
        }
    },
    assetValuation: function () {
        return m('div', {
            onclick: function () {
                assetRecords.inheritEvent(event);
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
                                class: "cursor-pointer mr-7" + (assetRecords.switchValue === 0 ? ' has-text-primary header-highlight' : ''),
                                onclick: function () {
                                    assetRecords.switchEvnet(0);
                                }
                            }, ['我的钱包']),
                            m('div', {
                                class: "cursor-pointer mr-7" + (assetRecords.switchValue === 1 ? ' has-text-primary header-highlight' : ''),
                                onclick: function () {
                                    assetRecords.switchEvnet(1);
                                }
                            }, ['交易账户']),
                            m('div', {}, ['其他账户'])
                        ]),
                        assetRecords.switchContent()
                    ])
                ])
            ])
        ]);
    }
};
module.exports = {
    oninit: function () {
        // assetRecords.initAssetList();
    },
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords' }, [
            assetRecords.assetValuation()
        ]);
    }
};
