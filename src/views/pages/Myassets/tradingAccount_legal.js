const m = require('mithril');
const table = require('@/views/pages/Myassets/tradeTable');

module.exports = {
    currency: 'BTC',
    setCurrency: function (param) {
        this.currency = param;
    },
    oninit: function () {
        window.gBroadcast.onMsg({
            key: 'tradingAccount_legal',
            cmd: window.gBroadcast.CHANGE_SW_CURRENCY,
            cb: (arg) => {
                this.setCurrency(arg);
            }
        });
    },
    view: function () {
        return m('div', {}, [
            m(table, { type: 'legalColumnData', typeData: 'legalData' })
        ]);
    },
    onremove: function () {
        window.gBroadcast.offMsg({
            key: 'tradingAccount_legal',
            isall: true
        });
    }
};