const m = require('mithril');
const header = require('@/views/header');
const footer = require('@/views/footer');
const message = require('@/views/message');

module.exports = {
    oninit: function(vnode) {
        window._console.log("ht", "initialized");
    },
    oncreate: function(vnode) {
        window._console.log("ht", "DOM created");
    },
    onupdate: function(vnode) {
        window._console.log("ht", "DOM updated");
    },
    onremove: function(vnode) {

    },
    view: function() {
        return m('section.section' + (window.themeDark ? " #theme--dark" : " #theme--light"), [
            m(header),
            m('div.route-box'),
            m(footer),
            m(message)
        ]);
    }
};