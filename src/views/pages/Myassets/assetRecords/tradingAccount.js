const m = require('mithril');
const tradingAccount = {
    switchValue: 0,
    switchEvnet: function (val) {
        this.switchValue = val;
    },
    assetValuation: function () {
        return ('div', { class: 'views-pages-Myassets-assetRecords-tradingAccount-wrapper' }, [
            m('div', { class: 'cursor-pointer  mb-3' }, [
                m('span', {
                    class: "cursor-pointer mr-3" + (tradingAccount.switchValue === 0 ? ' has-text-primary' : ''),
                    onclick: function () {
                        tradingAccount.switchEvnet(0);
                    }
                }, ['合约账户']),
                m('span', {
                    class: "cursor-pointer mr-3" + (tradingAccount.switchValue === 1 ? ' has-text-primary' : ''),
                    onclick: function () {
                        tradingAccount.switchEvnet(1);
                    }
                }, ['币币账户']),
                m('span', {
                    class: "cursor-pointer" + (tradingAccount.switchValue === 2 ? ' has-text-primary' : ''),
                    onclick: function () {
                        tradingAccount.switchEvnet(2);
                    }
                }, ['法币账户'])
            ])
        ]);
    }
};
module.exports = {
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-tradingAccount' }, [
            tradingAccount.assetValuation()
        ]);
    }
};