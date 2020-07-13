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
        return m('div',[
            m(header),

            m(message),
        ])
    },
    onremove: function (vnode) {

    },
}