var m = require("mithril")

let obj = {
    
}


let header = require("./header").default
let message = require("./message").default

module.exports = {
    oninit: function (vnode) {

    },
    oncreate: function (vnode) {
        
    },
    view: function (vnode) {
        return m('section',[
            m(header),
            '币币交易',
            m(message),
        ])
    },
    onremove: function (vnode) {

    },
}