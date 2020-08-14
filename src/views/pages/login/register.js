const m = require('mithril');
const Register = require('@/models/login/register');
const InputWithComponent = require('@/views/components/inputWithComponent');

import('@/styles/pages/login/login.css');

module.exports = {
    oninit() {
        Register.oninit();
    },
    onremove() {
        Register.onremove();
    },
    view() {
        return m('div.is-align-items-center.pa-8', {}, [
            m('div.box.views-page-login-box-width.px-7.py-8', {}, [
                Register.isvalidate ? [
                    m('div.title-x-large-1.views-page-login-title.opacity', {}, [window.exchConfig.exchName]),
                    m('div.mb-5.title-x-large-1.has-text-title', {}, ['注册验证']),
                    m('div.py-0.mb-2.has-text-level-1.body-3', {},
                        [Register.type === 'phone' ? '手机验证码' : '邮箱验证码']),
                    m('div.control.has-icons-right.mb-6', {}, [
                        m(InputWithComponent, {
                            options: {
                                oninput: e => {
                                    Register.code = e.target.value.replace(/[^\d]/g, '');
                                },
                                onkeyup: e => {
                                    if (e.keyCode === 13) {
                                        Register.type === 'phone'
                                            ? window.validate.checkSmsCode(Register.code)
                                            : window.validate.checkEmailCode(Register.code);
                                    }
                                },
                                maxlength: '6',
                                value: Register.code
                            },
                            rightComponents: m(
                                'a.body-1.views-page-login-send-code.px-2',
                                {
                                    onclick: () => {
                                        if (Register.smsCd > 0) { return; }
                                        Register.type === 'phone'
                                            ? Register.sendSmsCode()
                                            : Register.sendEmailCode();
                                    }
                                }, [
                                    Register.smsCd > 0
                                        ? `${Register.smsCd}`
                                        : window.gI18n.$t(
                                            '10214')/* '获取验证码' */])
                        })
                    ]),
                    m('button.button.my-3.has-bg-primary.button-medium.is-fullwidth.has-text-white.mb-2',
                        {
                            onclick: () => {
                                Register.type === 'phone'
                                    ? window.validate.checkSmsCode(Register.code)
                                    : window.validate.checkEmailCode(Register.code);
                            }
                        }, ['注册'])
                ] : [
                    m('div.title-x-large-1.views-page-login-title.opacity', {}, [window.exchConfig.exchName]),
                    m('div.mb-5.title-x-large-1.has-text-title', {}, ['注册']),
                    m('div.tabs.mb-7', {}, [
                        m('ul', {}, [
                            m('li', { class: Register.type === 'phone' ? 'is-active' : '' },
                                [m('a', { onclick: () => { Register.type = 'phone'; } }, ['手机'])]),
                            m('li', { class: Register.type === 'email' ? 'is-active' : '' },
                                [m('a', { onclick: () => { Register.type = 'email'; } }, ['邮箱'])])
                        ])
                    ]),
                    m('div.py-0.mb-2.has-text-level-1.body-3', {},
                        [Register.type === 'phone' ? '手机号' : '邮箱']),
                    Register.type === 'phone'
                        ? m(InputWithComponent, {
                            addClass: 'mb-5',
                            leftComponents: m('span.select.px-1', {}, [
                                m('select.without-border.register-national-select',
                                    {
                                        value: Register.areaCode,
                                        onchange: e => {
                                            Register.areaCode = e.target.value;
                                        }
                                    }, Register.selectList)
                            ]),
                            options: {
                                oninput: e => {
                                    Register.loginName = e.target.value;
                                },
                                value: Register.loginName
                            }
                        })
                        : m('input.input[type=text].mb-5', {
                            oninput: e => {
                                Register.loginName = e.target.value;
                            },
                            value: Register.loginName
                        }, []),
                    m('div.py-0.mb-2.has-text-level-1.body-3', {}, ['密码']),
                    m('input.input[type=password].mb-5', {
                        oninput: e => {
                            Register.password = e.target.value;
                        },
                        onkeyup: e => {
                            if (e.keyCode === 13) {
                                Register.type === 'phone'
                                    ? Register.submitEmail()
                                    : Register.submitPhone();
                            }
                        },
                        value: Register.password
                    }, []),
                    m('div.py-0.mb-2.has-text-level-1.body-3', {}, ['邀请码（选填）']),
                    m('input.input[type=password].mb-6', {
                        oninput: e => {
                            Register.refereeId = e.target.value;
                        },
                        onkeyup: e => {
                            if (e.keyCode === 13) {
                                Register.type === 'phone'
                                    ? Register.submitEmail()
                                    : Register.submitPhone();
                            }
                        },
                        value: Register.refereeId
                    }, []),
                    m('button.button.my-3.has-bg-primary.button-medium.is-fullwidth.has-text-white.mb-2',
                        {
                            onclick: () => {
                                Register.type === 'phone'
                                    ? Register.submitEmail()
                                    : Register.submitPhone();
                            },
                            disabled: Register.type === 'phone' ? !Register.valid1() : !Register.valid(),
                            class: Register.loading ? 'is-loading' : ''
                        }, ['注册']),
                    m('div.has-text-centered.body-3.has-text-level-2',
                        {}, [
                            '已有账号？去',
                            m('a.has-text-primary', {
                                onclick: () => {
                                    window.router.push('/login');
                                }
                            }, [window.gI18n.$t('10136')/* '登录' */])
                        ])
                ]
            ])

        ]);
    }
};