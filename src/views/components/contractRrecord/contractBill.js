//合约账单

let m = require("mithril")

let wltRec = require("../orderList/wltRec").default
let publicHeader = require("../publicHeader_m").default
let message = require('../message').default

module.exports = {
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