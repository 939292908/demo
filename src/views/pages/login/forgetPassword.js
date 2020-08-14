const m = require('mithril');
const Validate = require('./validate');
const InputWithComponent = require('@/views/components/inputWithComponent');
const ForgetPassword = require('@/models/login/forgetPassword');

import('@/styles/pages/login/login.css');

module.exports = {
    oninit() {
        ForgetPassword.oninit();
    },
    onremove() {
        ForgetPassword.onremove();
    },
    view() {
        return m('div.is-align-items-center.pa-8', {}, [
            m('div.box.views-page-login-box-width.px-7.py-8', {},
                ForgetPassword.isValidate ? [
                    m('div.mb-2.title-4.has-text-level-1', {},
                        ['重置密码']),
                    m('p.body-3.has-text-primary.mb-7', {},
                        ['出于安全考虑，修改账户安全项之后，24h内禁止提币、内部转出与卖币操作']),
                    m('div.has-text-level-1.body-3.mb-2', {}, ['新密码']),
                    m('input.input[type=password].mb-4', {
                        oninput: e => {
                            ForgetPassword.password1 = e.target.value;
                        },
                        value: ForgetPassword.password1
                    }, []),
                    m('div.has-text-level-1.body-3.mb-2', {}, ['确认密码']),
                    m('input.input[type=password].mb-6', {
                        oninput: e => {
                            ForgetPassword.password2 = e.target.value;
                        },
                        onkeyup: e => {
                            if (e.keyCode === 13) { ForgetPassword.submitReset(); }
                        },
                        value: ForgetPassword.password2
                    }, []),
                    m('button.button.my-3.has-bg-primary.btn-2.is-fullwidth.mb-2', {
                        onclick: () => {
                            ForgetPassword.submitReset();
                        },
                        class: ForgetPassword.loading ? 'is-loading' : ''
                    }, ['确定'])
                ] : ForgetPassword.is2fa ? m(Validate, {})
                    : [
                        m('div.mb-2.title-4.has-text-level-1', {},
                            ['忘记密码']),
                        m('p.body-3.has-text-primary.mb-7', {},
                            ['出于安全考虑，修改账户安全项之后，24h内禁止提币、内部转出与卖币操作']),
                        m('div.body-3.mb-6', {}, [
                            m('a.mr-7.has-text-level-1', {
                                class: ForgetPassword.loginType === 'phone' ? 'has-text-primary' : '',
                                onclick: () => {
                                    ForgetPassword.loginType = 'phone';
                                }
                            }, ['手机']),
                            m('a.has-text-level-1', {
                                class: ForgetPassword.loginType === 'email' ? 'has-text-primary' : '',
                                onclick: () => {
                                    ForgetPassword.loginType = 'email';
                                }
                            }, ['邮箱'])
                        ]),
                        m('div.has-text-level-1.body-3.mb-2', {}, [ForgetPassword.loginType === 'phone' ? '手机号' : '邮箱']),
                        ForgetPassword.loginType === 'phone'
                            ? m(InputWithComponent, {
                                addClass: 'mb-5',
                                leftComponents: m('span.select.px-1', {}, [
                                    m('select.without-border.register-national-select',
                                        {
                                            value: ForgetPassword.areaCode,
                                            onchange: e => {
                                                ForgetPassword.areaCode = e.target.value;
                                            }
                                        }, ForgetPassword.selectList)
                                ]),
                                options: {
                                    oninput: e => {
                                        ForgetPassword.loginName = e.target.value;
                                    },
                                    onkeyup: e => {
                                        if (e.keyCode === 13) {
                                            ForgetPassword.loginType === 'phone' ? ForgetPassword.submitPhone() : ForgetPassword.submitEmail();
                                        }
                                    },
                                    value: ForgetPassword.loginName
                                }
                            })
                            : m('input.input[type=text].mb-5', {
                                oninput: e => {
                                    ForgetPassword.loginName = e.target.value;
                                },
                                onkeyup: e => {
                                    if (e.keyCode === 13) {
                                        ForgetPassword.loginType === 'phone' ? ForgetPassword.submitPhone() : ForgetPassword.submitEmail();
                                    }
                                },
                                value: ForgetPassword.loginName
                            }, []),
                        m('button.button.my-3.has-bg-primary.btn-2.is-fullwidth.mb-2', {
                            onclick: () => {
                                ForgetPassword.loginType === 'phone' ? ForgetPassword.submitPhone() : ForgetPassword.submitEmail();
                            },
                            class: ForgetPassword.loading ? 'is-loading' : ''
                        }, ['下一步'])
                    ]
            )
        ]);
    }
};