const m = require('mithril');
const broadcast = require('@/broadcast/broadcast');
const assetRecordsWallet = require('./assetRecordsWallet');
const tradingAccount = require('../assetTable/assetTable.view');

module.exports = {
    switchValue: 0,
    switchEvnet: function (val) {
        this.switchValue = val;
    },
    inheritEvent(event) {
        if (event.target.tagName !== 'BUTTON') {
            broadcast.emit({ cmd: 'displaySelect', data: 1 });
        }
    },
    switchContent: function () {
        switch (this.switchValue) {
        case 0:
            return m(assetRecordsWallet);
        case 1:
            return m(tradingAccount);
        }
    }
};