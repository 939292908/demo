const m = require('mithril');
const LegalCurrencyAccount = require('./LegalCurrencyAccount');
const contractAccount = require('./contractAccount');
const currencyAccount = require('./currencyAccount');

const tradingAccount = {
    switchValue: 0,
    switchEvnet: function (val) {
        this.switchValue = val;
    },
    switchContent: function () {
        switch (this.switchValue) {
        case 0:
            return m(contractAccount);
        case 1:
            return m(currencyAccount);
        case 2:
            return m(LegalCurrencyAccount);
        }
    },
    assetValuation: function () {
        return ('div', { class: 'views-pages-Myassets-assetRecords-tradingAccount-wrapper' }, [
            m('div', { class: 'cursor-pointer mb-7 columns-flex-warp views-pages-Myassets-assetRecords-tradingAccount-wrapper-head ' }, [
                m('div', {
                    class: "cursor-pointer mr-7" + (tradingAccount.switchValue === 0 ? ' has-text-primary header-highlight' : ''),
                    onclick: function () {
                        tradingAccount.switchEvnet(0);
                    }
                }, ['合约账户']),
                m('div', {
                    class: "cursor-pointer mr-7" + (tradingAccount.switchValue === 1 ? ' has-text-primary header-highlight' : ''),
                    onclick: function () {
                        tradingAccount.switchEvnet(1);
                    }
                }, ['币币账户']),
                m('div', {
                    class: "cursor-pointer" + (tradingAccount.switchValue === 2 ? ' has-text-primary header-highlight' : ''),
                    onclick: function () {
                        tradingAccount.switchEvnet(2);
                    }
                }, ['法币账户'])
            ]),
            // m(commonSelectionBox),
            tradingAccount.switchContent()
        ]);
    }
};
module.exports = {
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-tradingAccount px-4' }, [
            tradingAccount.assetValuation()
        ]);
    }
};