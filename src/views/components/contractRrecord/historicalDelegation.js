//历史委托

let m = require("mithril")

let historyOrd = require('../orderList/historyOrd').default
let goodsHistoryOrd = require('../goodsList/goodsHistoryOrd').default
let message = require('../message').default



module.exports = {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){

    },
    view:function(vnode){
        return m("div",{class:"historical-delegation"},[
            window.gMkt.CtxPlaying.pageTradeStatus == 2 ? m(goodsHistoryOrd) : m(historyOrd),
            m(message)
          ])
      }
}