let m = require('mithril')
let Login = require('@/models/login/login')

module.exports = {
    oninit: function () {
        Login.initGeetest();
    },
    view: function () {
        return m('div.box.has-bg-level-3', {}, [
            m('div.mb-5.title-2.has-text-level-1', {}, ['登录']),
            m('div.body-3.mb-2.has-text-level-1', {}, ['手机/邮箱']),
            m('input.input[type=text].mb-6', {
                oninput: function (e) {Login.account = e.target.value},
                value: Login.account
            }, []),
            m('div.columns.body-3.has-text-level-1.mb-2', {}, [
                m('div.column.py-0', {}, ['密码']),
                m('div.column.has-text-primary.has-text-right.py-0', {}, ['忘记密码？']),
            ]),
            m('input.input[type=password].mb-7', {
                oninput: function (e) {Login.password = e.target.value},
                value: Login.password
            }, []),
            m('button.button.my-3.is-primary.is-fullwidth.mb-2', {
                onclick: function () {
                    Login.login();
                }
            }, ['登录']),
            m('div.has-text-centered.body-3.has-text-level-1', {}, [
                '还没账号？去',
                m('span.has-text-primary', {}, ['注册'])
            ]),
        ]);
    }
}