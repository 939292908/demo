//历史委托

let m = require("mithril")

let historyOrd = require('../orderList/historyOrd').default
let message = require('../message').default



module.exports = {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){

    },
    view:function(vnode){
        return m("div",{class:"historical-delegation"},[
            m(historyOrd),
            m(message)
          ])
      }
}