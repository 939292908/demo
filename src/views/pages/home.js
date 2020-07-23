let m = require('mithril')

require('@/styles/pages/home.css')
let demo = require('@/views/pages/demo')


module.exports = {
    oncreate: function () {
        
    },
    view: function () {
        return m('div.container', [
            m('h1.title.is-1', ['home']),
            m(demo)
        ])
    }
}