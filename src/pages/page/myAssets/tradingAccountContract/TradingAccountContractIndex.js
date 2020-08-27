const broadcast = require('@/broadcast/broadcast');

module.exports = {
    currency: 'BTC',
    setCurrency: function (param) {
        this.currency = param;
    },
    initFn: function () {
        broadcast.onMsg({
            key: 'tradingAccount_contract',
            cmd: broadcast.CHANGE_SW_CURRENCY,
            cb: (arg) => {
                this.setCurrency(arg);
            }
        });
    },
    removeFn: function () {
        broadcast.offMsg({
            key: 'tradingAccount_contract',
            isall: true
        });
    }
};