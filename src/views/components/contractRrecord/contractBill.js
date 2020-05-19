//合约账单

let m = require("mithril")

import wltRec from "../orderList/wltRec"
import publicHeader from "../publicHeader_m"
import message from '../message'

export default {
    oninit: function(vnode){

    },
    oncreate: function(vnode){

    },
    view:function(vnode){
        return m("div",{class:""},[
            m(wltRec),
            m(message)
          ])
    }
}