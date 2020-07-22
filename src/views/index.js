let m = require('mithril')

let header = require('@/views/header')
let message = require('@/views/message')

module.exports = {
    oninit: function(vnode) {
        _console.log("ht","initialized")
    },
    oncreate: function(vnode) {
        _console.log("ht","DOM created")
    },
    onupdate: function(vnode) {
        _console.log("ht","DOM updated")
    },
    onremove: function(vnode) {

    },
    view: function(){
        return m('div.application.has-navbar-fixed-top', [
            m(header),
            m('div.content'),
            m(message)
        ])
    }
}