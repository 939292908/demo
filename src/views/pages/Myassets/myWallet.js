const m = require('mithril');
const table = require('@/views/pages/Myassets/tradeTable');

module.exports = {
    currency: 'BTC',
    setCurrency: function (param) {
        this.currency = param;
    },
    oninit: function () {
        window.gBroadcast.onMsg({
            key: 'myWallet',
            cmd: window.gBroadcast.CHANGE_SW_CURRENCY,
            cb: (arg) => {
                this.setCurrency(arg);
            }
        });
    },
    view: function () {
        return m('div', {}, [
            m(table, { type: 'walletColumnData', typeData: 'walletData' })
        ]);
    },
    onremove: function () {
        window.gBroadcast.offMsg({
            key: 'myWallet',
            isall: true
        });
    }
};