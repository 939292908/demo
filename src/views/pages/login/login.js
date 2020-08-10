const m = require('mithril');
const Login = require('@/models/login/login');

module.exports = {
    oninit () {
        Login.oninit();
    },
    onremove () {
        Login.onremove();
    },
    view () {
        return m('div.pa', { width: '1218px' }, [
            m('div.box.has-bg-level-2', {}, [
                m('div.columns', {}, [
                    m('div.column', {}, []),
                    m('div.column', {}, []),
                    m('div.column', {}, [
                        Login.validateCode.length
                            ? m('div.box.has-bg-level-3.views-pages-login-index-box', {}, [
                                m('div.mb-5.title-2.has-text-level-1', {}, ['验证码']),
                                m('div', {}, Login.validInput),
                                m('button.button.my-3.is-primary.is-fullwidth.mb-2', {
                                    onclick: () => {
                                        Login.validateAll();
                                    }
                                }, [window.gI18n.$t('10136')/* '登录' */])

                            ]) : m('div.box.has-bg-level-3.views-pages-login-index-box', {}, [
                                m('div.mb-5.title-2.has-text-level-1', {}, [window.gI18n.$t('10136')/* '登录' */]),
                                m('div.py-0.mb-2', {}, ['手机/邮箱']),
                                m('input.input[type=text].mb-6', {
                                    oninput: e => {
                                        Login.account = e.target.value;
                                    },
                                    value: Login.account
                                }, []),
                                m('div.columns.body-3.has-text-level-1.mb-2', {}, [
                                    m('div.column.py-0', {}, ['密码']),
                                    m('a.column.has-text-primary.has-text-right.py-0', {
                                        onclick: () => {
                                            window.router.push('/forgetPassword');
                                        }
                                    }, ['忘记密码？'])
                                ]),
                                m('input.input[type=password].mb-7', {
                                    oninput: e => {
                                        Login.password = e.target.value;
                                    },
                                    value: Login.password
                                }, []),
                                m('button.button.my-3.is-primary.is-fullwidth.mb-2', {
                                    onclick: () => {
                                        Login.login();
                                    }
                                }, [window.gI18n.$t('10136')/* '登录' */]),
                                m('div.has-text-centered.body-3.has-text-level-1', {}, [
                                    '还没账号？去',
                                    m('a.has-text-primary', {
                                        onclick: () => {
                                            window.router.push('/register');
                                        }
                                    }, ['注册'])
                                ])
                            ])
                    ])
                ])
            ])
        ]);
    }
};