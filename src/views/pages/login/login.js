let m = require('mithril')
let Login = require('@/models/login/login')

module.exports = {
    oninit() {
        Login.oninit();
    },
    onremove() {
        Login.onremove();
    },
    view() {
        return m('div.pa', {width: '769px'}, [
            m('div.box.has-bg-level-2', {}, [
                m('div.columns', {}, [
                    m('div.column', {}, []),
                    m('div.column', {}, []),
                    m('div.column', {}, [
                        Login.isValidate ?
                            m('div.box.has-bg-level-3.views-pages-login-index-box', {}, [
                                m('div.mb-5.title-2.has-text-level-1', {}, ['谷歌验证']),
                                m('input.input[type=text].mb-6', {
                                    oninput: e => {
                                        Login.code = e.target.value
                                    },
                                    value: Login.code
                                }, []),

                                m('button.button.my-3.is-primary.is-fullwidth.mb-2', {
                                    onclick: () => {

                                        validate.checkGoogleCode(Login.code);
                                    }
                                }, ['登录']),

                            ]) :
                            m('div.box.has-bg-level-3.views-pages-login-index-box', {}, [
                                m('div.mb-5.title-2.has-text-level-1', {}, ['登录']),
                                m('div.tabs', {}, [
                                    m('ul', {}, [
                                        m('li', {
                                            class: Login.loginType === 'phone' ? 'is-active' : ''
                                        }, [
                                            m('a',{
                                                onclick:()=>{
                                                    Login.loginType = 'phone';
                                                }
                                            },['手机'])
                                        ]),
                                        m('li', {
                                            class: Login.loginType === 'mail' ? 'is-active' : ''
                                        }, [
                                            m('a',{
                                                onclick:()=>{
                                                    Login.loginType = 'mail';
                                                }
                                            },['邮箱'])
                                        ])
                                    ]),
                                ]),
                                m('input.input[type=text].mb-6', {
                                    oninput: e => {
                                        Login.account = e.target.value
                                    },
                                    value: Login.account
                                }, []),
                                m('div.columns.body-3.has-text-level-1.mb-2', {}, [
                                    m('div.column.py-0', {}, ['密码']),
                                    m('div.column.has-text-primary.has-text-right.py-0', {}, ['忘记密码？']),
                                ]),
                                m('input.input[type=password].mb-7', {
                                    oninput: e => {
                                        Login.password = e.target.value
                                    },
                                    value: Login.password
                                }, []),
                                m('button.button.my-3.is-primary.is-fullwidth.mb-2', {
                                    onclick: () => {
                                        Login.login();
                                    }
                                }, ['登录']),
                                m('div.has-text-centered.body-3.has-text-level-1', {}, [
                                    '还没账号？去',
                                    m('a.has-text-primary', {
                                        onclick: () => {
                                            window.router.push('/register')
                                        }
                                    }, ['注册'])
                                ]),
                            ])
                    ]),
                ])
            ])
        ]);
    }
}