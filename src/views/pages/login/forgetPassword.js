const m = require('mithril');
const Validate = require('./validate');
const ForgetPassword = require('@/models/login/forgetPassword');

import('@/styles/pages/login/forgetPassword.css');

module.exports = {
    oninit() {
    },
    onremove() {
        ForgetPassword.onremove();
    },
    view() {
        return m('div.box.has-bg-level-2.content-width', {}, [
            m('div.columns.is-3', {}, [
                m('div.column.is-three-fifths', {}, []),
                m('div.column.forget-password-margin', {},
                    ForgetPassword.isValidate ? [
                        m('div.mb-2.title-3.has-text-level-1', {},
                            ['重置密码']),
                        m('p.body-3.has-text-primary.mb-8', {},
                            ['出于安全考虑，修改账户安全项之后，24h内禁止提币、内部转出与卖币操作']),
                        m('div.has-text-level-1.body-3.mb-2', {}, ['新密码']),
                        m('input.input[type=password].mb-4', {
                            oninput: e => {
                                ForgetPassword.password1 = e.target.value;
                            },
                            value: ForgetPassword.password1
                        }, []),
                        m('div.has-text-level-1.body-3.mb-2', {}, ['确认密码']),
                        m('input.input[type=password].mb-8', {
                            oninput: e => {
                                ForgetPassword.password2 = e.target.value;
                            },
                            value: ForgetPassword.password2
                        }, []),
                        m('button.button.my-3.has-bg-primary.btn-2.is-fullwidth.mb-2', {
                            onclick: () => {
                                ForgetPassword.submitReset();
                            }
                        }, ['确定'])
                    ] : ForgetPassword.validateCode.length
                        ? m(Validate, { validateCode: ForgetPassword.validateCode })
                        : [
                            m('div.mb-2.title-3.has-text-level-1', {},
                                ['忘记密码']),
                            m('p.body-3.has-text-primary.mb-8', {},
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
                            m('div.has-text-level-1.body-3.mb-2', {}, [
                                ForgetPassword.loginType === 'phone' ? '手机号' : '邮箱']),
                            m('input.input[type=text].mb-8', {
                                oninput: e => {
                                    ForgetPassword.loginName = e.target.value;
                                },
                                value: ForgetPassword.loginName
                            }, []),
                            m('button.button.my-3.has-bg-primary.btn-2.is-fullwidth.mb-2', {
                                onclick: () => {
                                    ForgetPassword.queryUserInfo();
                                }
                            }, ['下一步'])
                        ]
                )
            ])
        ]);
    }
};