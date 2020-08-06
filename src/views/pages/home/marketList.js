let m = require('mithril')

let market = require('@/models/market/market')

module.exports = {
    oncreate: function(){
        market.init()
        market.initHomeNeedSub()
        gBroadcast.onMsg({
            key: 'marketList',
            cmd: gBroadcast.MSG_ASSETD_UPD,
            cb: function(arg){
                market.initHomeNeedSub()
            }
        })
        
    },
    view: function(){
        return m('div.view-pages-home-marketlist', {}, [
            '行情列表',
            JSON.stringify(market.tickData)
        ])
    },
    onremove: function(){
        market.remove()
        gBroadcast.offMsg({
            key: 'marketList',
            isall: true
        })
    }
}