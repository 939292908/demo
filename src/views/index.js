let m = require('mithril')

let header = require('@/views/header')
let footer = require('@/views/footer')
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
        return m('section.section'+(window.themeDark?" #theme--dark":" #theme--light"), [
            m(header),
            m('div.route-box'),
            m(footer),
            m(message)
        ])
    }
}