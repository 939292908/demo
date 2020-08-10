//内部转账
let m = require('mithril')

require('@/styles/pages/Myassets/internalTransfer.css')

let internalTransfer = {
    internalTransferPage: function () {
        return m('div.internalTransfer',{},[

        ])
    }
}

module.exports = {
    view: function () {
        return internalTransfer.internalTransferPage();
    }
}