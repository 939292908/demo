let m = require('mithril')

require('@/styles/pages/home.css')


module.exports = {
    oncreate: function () {
        
    },
    view: function () {
        return m('div', [
            m('h1.title.is-1', ['home']),
            m('a', {
                class: "home-link",
                onclick: function () {
                    window.router.push('/userCenter')
                }
            }, [
                'to userCenter'
            ]),
            m('br'),
            m('button.button', {
                onclick: function () {
                    window.$message({content: "这是一条消息！", type: "success"})
                }
            }, [
                'message'
            ])
        ])
    }
}