const m = require('mithril');
const broadcast = require('@/broadcast/broadcast');
const table = require('@/pages/page/myAssets/tradeTable/tradeTableIndex');

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