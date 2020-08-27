const broadcast = require('@/broadcast/broadcast');

module.exports = {
    currency: 'BTC',
    setCurrency: function (param) {
        this.currency = param;
    },
    initFn: function () {
        broadcast.onMsg({
            key: 'myWallet',
            cmd: broadcast.CHANGE_SW_CURRENCY,
            cb: (arg) => {
                this.setCurrency(arg);
            }
        });
    },
    removeFn: function () {
        broadcast.offMsg({
            key: 'myWallet',
            isall: true
        });
    }
};