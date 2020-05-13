//历史委托

let m = require("mithril")

import historyOrd from '../orderList/historyOrd'
import publicHeader from "../publicHeader_m"



export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){

    },
    view:function(vnode){
        return m("div",{class:""},[
          // m(publicHeader),
          m("div",{class:"headerBack-two"}),
          m("div",{class:"columns",style: "padding :25px 25px 10px 25px"},[
            m(historyOrd)
          ])
        ])
      }
}