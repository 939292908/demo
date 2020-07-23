let m = require('mithril')

require('@/styles/pages/home.css')
let demo = require('@/views/pages/demo')


module.exports = {
    oncreate: function () {
        
    },
    view: function () {
        return m('div.container.views-pages-home-index', [
            m('h1.title.is-1.has-text-title', ['home']),
            m(demo)
        ])
    }
}