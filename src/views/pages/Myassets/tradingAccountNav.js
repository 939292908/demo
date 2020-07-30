let m = require('mithril')

require('@/styles/Myassets/tradingAccountNav.css')

let tradingAccountNav = {
    currency:'BTC',
    tradingAccountNavPage:function(){
        return m('div',{},[
            m('div',{},'合约账户'),
            m('div',{},'币币账户'),
            m('div',{},'法币账户')
        ])
    }
}
module.exports = {
    view: function () {
        return m('div',{class:'tradingAccountNav'},[
            tradingAccountNav.tradingAccountNavPage()
        ])
    }
}