let m = require('mithril')
const { default: _console } = require('../../log/log')

require('@/styles/pages/home.css')


module.exports = {
    oncreate: function () {
        window._console.trace('ht')
    },
    view: function () {
        return m('div.application', [
            m('h1.title.is-1', ['home']),
            m('a', {
                class: "home-link",
                onclick: function () {
                    window.router.push('/userCenter')
                }
            }, [
                'to userCenter'
            ])
        ])
    }
}