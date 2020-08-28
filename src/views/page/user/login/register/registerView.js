const m = require('mithril');
const Register = require('./registerModel');
const InputWithComponent = require(
    '@/views/components/inputWithComponent/inputWithComponentView');
const AreaCodeSelect = require(
    '@/views/components/areaCodeSelect/areaCodeSelectView');
const config = require('@/config');
const I18n = require('@/languages/I18n').default;

import('@/styles/pages/login/login.css');

module.exports = {
    oninit() {
        Register.oninit();
    },
    onremove() {
        Register.onremove();
    },
    view() {
        return m('div.is-align-items-center.has-bg-level-1.pa-8.theme--light',
            {}, [
                m('div.box.has-bg-level-2.views-page-login-box-width.px-7.py-8',
                    {}, [
                        Register.isvalidate ? [
                            m('div.title-large.views-page-login-title.opacity',
                                {}, [config.exchName]),
                            m('div.mb-5.title-large.has-text-title', {},
                                ['注册验证']),
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
                                        },
                                        [Register.smsCd > 0 ? `${Register.smsCd}` : I18n.$t('10214')/* '获取验证码' */]
                                    )
                                })
                            ]),
                            m('button.button.my-3.has-bg-primary.button-medium.is-fullwidth.has-text-white.mb-2',
                                {
                                    onclick: () => { Register.checkCode(); }
                                }, ['注册'])
                        ] : [
                            m('div.title-large.views-page-login-title.opacity',
                                {}, [config.exchName]),
                            m('div.mb-5.title-large.has-text-title', {},
                                ['注册']),
                            m('div.tabs.mb-7', {}, [
                                m('ul', {}, [
                                    m('li', { class: Register.type === 'phone' ? 'is-active' : '' }, [
                                        m('a', { onclick: () => { Register.type = 'phone'; } }, ['手机'])
                                    ]),
                                    m('li', { class: Register.type === 'email' ? 'is-active' : '' }, [
                                        m('a', { onclick: () => { Register.type = 'email'; } }, ['邮箱'])
                                    ])
                                ])
                            ]),
                            m('div.py-0.mb-2.has-text-level-1.body-3', {},
                                [Register.type === 'phone' ? '手机号' : '邮箱']),
                            Register.type === 'phone'
                                ? m(InputWithComponent, {
                                    leftComponents: m(AreaCodeSelect, {
                                        selectList: Register.selectList,
                                        areaCode: Register.areaCode,
                                        onSelect: areaCode => { Register.areaCode = areaCode; }
                                    }),
                                    options: {
                                        oninput: e => {
                                            Register.loginName = e.target.value;
                                        },
                                        value: Register.loginName
                                    }
                                })
                                : m('input.input[type=text]', {
                                    oninput: e => {
                                        Register.loginName = e.target.value;
                                    },
                                    value: Register.loginName
                                }, []),
                            m('div.body-3.mt-2.has-text-tip-error', {}, [
                                Register.type === 'phone'
                                    ? Register.rulesPhone.required(Register.loginName) === true
                                        ? Register.rulesPhone.phone(Register.loginName)
                                        : Register.rulesPhone.required(Register.loginName)
                                    : Register.rulesEmail.required(Register.loginName) === true
                                        ? Register.rulesEmail.email(Register.loginName)
                                        : Register.rulesEmail.required(Register.loginName)
                            ]),
                            m('div.py-0.mb-2.has-text-level-1.body-3.mt-5', {},
                                ['密码']),
                            m('input.input[type=password]', {
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
                            m('div.body-3.mt-2.has-text-tip-error', {}, [
                                Register.rulesPwd.required(Register.password) === true
                                    ? Register.rulesPwd.password(Register.password)
                                    : Register.rulesPwd.required(Register.password)
                            ]),
                            m('div.py-0.mb-2.has-text-level-1.body-3.mt-5', {},
                                ['邀请码（选填）']),
                            m('input.input.mb-6', {
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
                            m('label.checkbox.body-3', {}, [
                                m('input.mr-2', {
                                    hidden: !(Register.exchInfo.helpCenter.website &&
                                        Register.exchInfo.helpCenter.termsServiceId &&
                                        Register.exchInfo.helpCenter.privacyPolicyId),
                                    type: 'checkbox',
                                    onclick: e => {
                                        Register.checkbox = e.target.value;
                                    },
                                    value: Register.checkbox
                                }, []),
                                m('div', {
                                    hidden: !(Register.exchInfo.helpCenter.website &&
                                        Register.exchInfo.helpCenter.termsServiceId &&
                                        Register.exchInfo.helpCenter.privacyPolicyId)
                                }, [
                                    `接受${config.exchName}的`,
                                    m('a.has-text-primary', {
                                        onclick: () => {
                                            Register.toHelpService(
                                                'termsServiceId');
                                        }
                                    }, ['《服务条款》']),
                                    '及',
                                    m('a.has-text-primary', {
                                        onclick: () => {
                                            Register.toHelpService(
                                                'privacyPolicyId');
                                        }
                                    }, ['《隐私保护政策》'])
                                ])
                            ]),
                            m('button.button.my-3.has-bg-primary.button-medium.is-fullwidth.has-text-white.mb-2',
                                {
                                    onclick: () => {
                                        Register.type === 'phone' ? Register.submitEmail() : Register.submitPhone();
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
                                    }, [I18n.$t('10136')/* '登录' */])
                                ])
                        ]
                    ])

            ]);
    }
};