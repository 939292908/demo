//历史成交
let m = require("mithril")

import historicalDeal from "../orderList/historyTrade"
import publicHeader from "../publicHeader_m"

export default {
    oninit: function(vnode){

    },
    oncreate: function(vnode){

    },
    view:function(vnode){
        return m("div",{class:""},[
            m(historicalDeal)
          ])
    }
}