const m = require('mithril');
const assetRecordsWallet = require('./assetRecordsWallet');
const tradingAccount = require('./tradingAccount');

require('@/styles/pages/Myassets/assetRecords.scss');

const assetRecords = {
    switchValue: 0,
    switchEvnet: function (val) {
        this.switchValue = val;
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
        return m('div', {}, [
            m('div', { class: 'mb-3 columns-flex-warp' }, [
                m('div', { class: 'cursor-pointer' }, ['我的资产']),
                m('div', { class: 'cursor-pointer has-text-primary ml-4' }, ['资产记录'])
            ]),
            m('div', { class: 'columns-flex-warp mb-3' }, [
                m('div', {
                    class: "cursor-pointer mr-6" + (assetRecords.switchValue === 0 ? ' has-text-primary' : ''),
                    onclick: function () {
                        assetRecords.switchEvnet(0);
                    }
                }, ['我的钱包']),
                m('div', {
                    class: "cursor-pointer mr-6" + (assetRecords.switchValue === 1 ? ' has-text-primary' : ''),
                    onclick: function () {
                        assetRecords.switchEvnet(1);
                    }
                }, ['交易账户']),
                m('div', {
                    class: "cursor-pointer mr-6" + (assetRecords.switchValue === 2 ? ' has-text-primary' : ''),
                    onclick: function () {
                        assetRecords.switchEvnet(2);
                    }
                }, ['其他账户'])
            ]),
            assetRecords.switchContent()
        ]);
    }
};
module.exports = {
    oninit: function () {
        // assetRecords.initAssetList();
    },
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords commonAuto common-width' }, [
            assetRecords.assetValuation()
        ]);
    }
};
