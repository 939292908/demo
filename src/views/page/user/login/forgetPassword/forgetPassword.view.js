const m = require('mithril');
const Validate = require('../../validate/validate.view');
const InputWithComponent = require('../../../../components/inputWithComponent/inputWithComponent.view');
const ForgetPassword = require('./forgetPassword.model');
const AreaCodeSelect = require('../areaCodeSelect/areaCodeSelect.view');
const regExp = require('@/models/validate/regExp');

import('../login.css');

module.exports = {
    oninit() {
        ForgetPassword.oninit();
    },
    onremove() {
        ForgetPassword.onremove();
    },
    view() {
        return m('div.is-align-items-center.has-bg-level-1.pa-8.theme--light', {}, [
            m('div.box.has-bg-level-2.views-page-login-box-width.px-7.py-8', {},
                ForgetPassword.isValidate ? [
                    m('div.mb-2.title-4.has-text-level-1.title-large.has-text-title', {},
                        ['重置密码']),
                    m('p.body-3.has-text-primary.mb-7', {},
                        ['出于安全考虑，修改账户安全项之后，24h内禁止提币、内部转出与卖币操作']),
                    m('div.has-text-level-1.body-3.mb-2', {}, ['新密码']),
                    m('input.input[type=password]', {
                        oninput: e => {
                            ForgetPassword.password1 = e.target.value;
                            ForgetPassword.showPassword1Validate = true;
                        },
                        onblur: e => { ForgetPassword.showPassword1Validate = true; },
                        value: ForgetPassword.password1
                    }, []),
                    m('div.body-3.mt-2.has-text-tip-error', {
                        hidden: !ForgetPassword.showPassword1Validate
                    }, [regExp.validPassword(ForgetPassword.password1)]),
                    m('div.has-text-level-1.body-3.mb-2.mt-4', {}, ['确认密码']),
                    m('input.input[type=password]', {
                        oninput: e => {
                            ForgetPassword.password2 = e.target.value;
                            ForgetPassword.showPassword2Validate = true;
                        },
                        onkeyup: e => {
                            if (e.keyCode === 13) { ForgetPassword.submitReset(); }
                        },
                        onblur: e => { ForgetPassword.showPassword2Validate = true; },
                        value: ForgetPassword.password2
                    }, []),
                    m('div.body-3.mt-2.has-text-tip-error', {
                        hidden: !ForgetPassword.showPassword2Validate
                    }, [regExp.validTwoPassword(ForgetPassword.password1, ForgetPassword.password2)]),
                    m('button.button.has-bg-primary.button-medium.is-fullwidth.has-text-white.mb-2.mt-6', {
                        onclick: () => {
                            ForgetPassword.submitReset();
                        },
                        class: ForgetPassword.loading ? 'is-loading' : '',
                        disabled: regExp.validPassword(ForgetPassword.password1) || regExp.validTwoPassword(ForgetPassword.password1, ForgetPassword.password2)
                    }, ['确定'])
                ] : ForgetPassword.is2fa ? m(Validate, {})
                    : [
                        m('div.mb-2.title-large.has-text-title', {},
                            ['忘记密码']),
                        m('p.body-3.has-text-primary.mb-7', {},
                            ['出于安全考虑，修改账户安全项之后，24h内禁止提币、内部转出与卖币操作']),
                        m('div.body-3.mb-6', {}, [
                            m('a.mr-7.has-text-level-1', {
                                class: ForgetPassword.loginType === 'phone' ? 'has-text-primary' : '',
                                onclick: () => {
                                    ForgetPassword.loginType = 'phone';
                                    ForgetPassword.cleanUp();
                                }
                            }, ['手机']),
                            m('a.has-text-level-1', {
                                class: ForgetPassword.loginType === 'email' ? 'has-text-primary' : '',
                                onclick: () => {
                                    ForgetPassword.loginType = 'email';
                                    ForgetPassword.cleanUp();
                                }
                            }, ['邮箱'])
                        ]),
                        m('div.has-text-level-1.body-3.mb-2', {}, [ForgetPassword.loginType === 'phone' ? '手机号' : '邮箱']),
                        ForgetPassword.loginType === 'phone'
                            ? m(InputWithComponent, {
                                leftComponents: m(AreaCodeSelect, {
                                    selectList: ForgetPassword.selectList,
                                    areaCode: ForgetPassword.areaCode,
                                    onSelect: areaCode => { ForgetPassword.areaCode = areaCode; }
                                }),
                                options: {
                                    oninput: e => {
                                        ForgetPassword.loginName = e.target.value;
                                        ForgetPassword.showAccountValidate = true;
                                    },
                                    onkeyup: e => {
                                        if (e.keyCode === 13) {
                                            ForgetPassword.submit();
                                        }
                                    },
                                    onblur: e => { ForgetPassword.showAccountValidate = true; },
                                    value: ForgetPassword.loginName
                                }
                            })
                            : m('input.input[type=text]', {
                                oninput: e => {
                                    ForgetPassword.loginName = e.target.value;
                                    ForgetPassword.showAccountValidate = true;
                                },
                                onkeyup: e => {
                                    if (e.keyCode === 13) {
                                        ForgetPassword.submit();
                                    }
                                },
                                onblur: e => { ForgetPassword.showAccountValidate = true; },
                                value: ForgetPassword.loginName
                            }, []),
                        m('div.body-3.mt-2.has-text-tip-error', {
                            hidden: !ForgetPassword.showAccountValidate
                        }, [regExp.validAccount(ForgetPassword.loginType, ForgetPassword.loginName)]),
                        m('button.button.my-3.has-bg-primary.button-medium.is-fullwidth.has-text-white.mt-7', {
                            onclick: () => {
                                ForgetPassword.submit();
                            },
                            disabled: regExp.validAccount(ForgetPassword.loginType, ForgetPassword.loginName),
                            class: ForgetPassword.loading ? 'is-loading' : ''
                        }, ['下一步'])
                    ]
            )
        ]);
    }
};