//历史成交
let m = require("mithril")

let historicalDeal = require("../orderList/historyTrade").default
let publicHeader = require("../publicHeader_m").default
let message = require('../message').default

module.exports = {
    oninit: function(vnode){

    },
    oncreate: function(vnode){

    },
    view:function(vnode){
        return m("div",{class:""},[
            m(historicalDeal),
            m(message)
          ])
    }
}