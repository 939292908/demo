const m = require('mithril');
const table = require('@/views/pages/Myassets/tradeTable');

module.exports = {
    currency: 'BTC',
    setCurrency: function (param) {
        this.currency = param;
    },
    oninit: function () {
        window.gBroadcast.onMsg({
            key: 'tradingAccount_contract',
            cmd: window.gBroadcast.CHANGE_SW_CURRENCY,
            cb: (arg) => {
                this.setCurrency(arg);
            }
        });
    },
    view: function () {
        return m('div', {}, [
            m(table, { type: 'contractColumnData', typeData: 'contractData' })
        ]);
    },
    onremove: function () {
        window.gBroadcast.offMsg({
            key: 'tradingAccount_contract',
            isall: true
        });
    }
};