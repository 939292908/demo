const m = require('mithril');
const Register = require('@/models/login/register');
const InputWithComponent = require('@/components/inputWithComponent');

import('@/styles/pages/register.css');

module.exports = {
    oninit () {
        Register.oninit();
    },
    onremove () {
        Register.onremove();
    },
    view () {
        return m('div.pa', { width: '769px' }, [
            m('div.box.has-bg-level-2', {}, [
                m('div.columns', {}, [
                    m('div.column', {}, []),
                    m('div.column', {}, []),
                    m('div.column', {}, [
                        Register.isvalidate ? m('div.box.has-bg-level-3.views-pages-login-index-box', {}, [
                            m('div.mb-5.title-2.has-text-level-1', {}, ['验证码']),
                            m('div.control.has-icons-right.mb-6', {}, [
                                InputWithComponent({
                                    options: {
                                        oninput: e => {
                                            Register.code = e.target.value;
                                        },
                                        value: Register.code
                                    },
                                    rightComponents: m('a.body-1.register-send-code-width.px-2', {
                                        onclick: () => {
                                            Register.type === 'phone'
                                                ? Register.sendSmsCode()
                                                : Register.sendEmailCode();
                                        }
                                    }, ['获取验证码'])
                                })
                            ]),
                            m('button.button.my-3.is-primary.is-fullwidth.mb-2', {
                                onclick: () => {
                                    Register.type === 'phone'
                                        ? window.validate.checkSmsCode(Register.code)
                                        : window.validate.checkEmailCode(Register.code);
                                }
                            }, ['注册'])
                        ]) : m('div.box.has-bg-level-3.views-pages-login-index-box', {}, [
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
                                        class: Register.type === 'email' ? 'is-active' : ''
                                    }, [
                                        m('a', {
                                            onclick: () => {
                                                Register.type = 'email';
                                            }
                                        }, ['邮箱'])
                                    ])
                                ])
                            ]),
                            m('div.py-0.mb-2', {}, [Register.type === 'phone' ? '手机号' : '邮箱']),
                            Register.type === 'phone'
                                ? InputWithComponent({
                                    addClass: 'mb-5',
                                    leftComponents: m('span.select.px-1', {}, [
                                        m('select.without-border.register-national-select', {
                                            value: Register.areaCode,
                                            onchange: e => {
                                                Register.areaCode = e.target.value;
                                            }
                                        }, Register.selectList)
                                    ]),
                                    options: {
                                        oninput: e => {
                                            Register.code = e.target.value;
                                        },
                                        value: Register.code
                                    }
                                })
                                : m('input.input[type=text].mb-5', {
                                    oninput: e => {
                                        Register.loginName = e.target.value;
                                    },
                                    value: Register.loginName
                                }, []),
                            m('div.py-0.mb-2', {}, ['密码']),
                            m('input.input[type=password].mb-5', {
                                oninput: e => {
                                    Register.password = e.target.value;
                                },
                                value: Register.password
                            }, []),
                            m('div.py-0.mb-2', {}, ['邀请码（选填）']),
                            m('input.input[type=password].mb-6', {
                                oninput: e => {
                                    Register.refereeId = e.target.value;
                                },
                                value: Register.refereeId
                            }, []),
                            m('button.button.my-3.is-primary.is-fullwidth.mb-2', {
                                onclick: () => {
                                    Register.type === 'phone' ? Register.submitEmail() : Register.submitPhone();
                                }
                            }, ['注册']),
                            m('div.has-text-centered.body-3.has-text-level-1', {}, [
                                '已有账号？去',
                                m('a.has-text-primary', {
                                    onclick: () => {
                                        window.router.push('/login');
                                    }
                                }, ['登录'])
                            ])
                        ])
                    ])
                ])
            ])
        ]);
    }
};