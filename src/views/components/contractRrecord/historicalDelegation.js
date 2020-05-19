//历史委托

let m = require("mithril")

import historyOrd from '../orderList/historyOrd'
import message from '../message'



export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){

    },
    view:function(vnode){
        return m("div",{class:""},[
            m(historyOrd),
            m(message)
          ])
      }
}