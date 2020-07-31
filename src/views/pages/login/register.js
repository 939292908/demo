let m = require('mithril')
let Register = require('@/models/login/register')

module.exports = {
    oninit() {
    },
    onremove() {
    },
    view() {
        return m('div.pa', {width: '769px'}, [
            m('div.box.has-bg-level-2', {}, [
                m('div.columns', {}, [
                    m('div.column', {}, []),
                    m('div.column', {}, []),
                    m('div.column', {}, [
                        m('div.box.has-bg-level-3.views-pages-login-index-box', {}, [
                            m('div.mb-5.title-2.has-text-level-1', {}, ['注册']),
                            m('div.tabs', {}, [
                                m('ul', {}, [
                                    m('li', {
                                        class: Register.type === 'phone' ? 'is-active' : ''
                                    }, [
                                        m('a', {
                                            onclick: () => {
                                                Register.type = 'phone';
                                            }
                                        }, ['手机'])
                                    ]),
                                    m('li', {
                                        class: Register.type === 'mail' ? 'is-active' : ''
                                    }, [
                                        m('a', {
                                            onclick: () => {
                                                Register.type = 'mail';
                                            }
                                        }, ['邮箱'])
                                    ])
                                ]),
                            ]),
                            m('input.input[type=text].mb-6', {}, []),
                            m('div.columns.body-3.has-text-level-1.mb-2', {}, [
                                m('div.column.py-0', {}, ['密码']),
                                m('div.column.has-text-primary.has-text-right.py-0', {}, ['忘记密码？']),
                            ]),
                            m('input.input[type=password].mb-7', {}, []),
                            m('button.button.my-3.is-primary.is-fullwidth.mb-2', {}, ['登录']),
                            m('div.has-text-centered.body-3.has-text-level-1', {}, [
                                '已有账号？去',
                                m('a.has-text-primary', {
                                    onclick: () => {
                                        window.router.push('/login')
                                    }
                                }, ['登录'])
                            ]),
                        ])
                    ]),
                ])
            ])
        ]);
    }
}