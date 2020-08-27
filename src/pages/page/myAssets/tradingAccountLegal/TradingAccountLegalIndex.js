const m = require('mithril');
const broadcast = require('@/broadcast/broadcast');
const table = require('@/pages/page/myAssets/tradeTable/tradeTableView');
module.exports = {
    currency: 'BTC',
    setCurrency: function (param) {
        this.currency = param;
    },
    oninit: function () {
        broadcast.onMsg({
            key: 'tradingAccount_legal',
            cmd: broadcast.CHANGE_SW_CURRENCY,
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
        broadcast.offMsg({
            key: 'tradingAccount_legal',
            isall: true
        });
    }
};