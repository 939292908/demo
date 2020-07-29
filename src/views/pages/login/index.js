let m = require('mithril')
let login = require('./login')

require('@/styles/pages/login.css')

module.exports = {
    view: function () {
        return m('div.pa', {width: '769px'}, [
            m('div.box.has-bg-level-2', {}, [
                m('div.columns', {}, [
                    m('div.column', {}, []),
                    m('div.column', {}, [m(login)]),
                ])
            ])
        ])
    }
}