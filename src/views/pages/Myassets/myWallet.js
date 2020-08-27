const m = require('mithril');
const table = require('@/views/pages/Myassets/tradeTable');
const broadcast = require('@/broadcast/broadcast');

module.exports = {
    currency: 'BTC',
    setCurrency: function (param) {
        this.currency = param;
    },
    oninit: function () {
        broadcast.onMsg({
            key: 'myWallet',
            cmd: broadcast.CHANGE_SW_CURRENCY,
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
        broadcast.offMsg({
            key: 'myWallet',
            isall: true
        });
    }
};