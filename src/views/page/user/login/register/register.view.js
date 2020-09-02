const m = require('mithril');
const Register = require('./register.model');
const InputWithComponent = require('../../../../components/inputWithComponent/inputWithComponent.view');
const AreaCodeSelect = require('../areaCodeSelect/areaCodeSelect.view');
const config = require('@/config');
const I18n = require('@/languages/I18n').default;
const regExp = require('@/models/validate/regExp');

import('../login.css');

module.exports = {
    oninit() {
        Register.oninit();
    },
    onremove() {
        Register.onremove();
    },
    oncreate() {

    },
    view() {
        return m('div.is-align-items-center.has-bg-level-1.pa-8.theme--light',
            {}, [
                m('div.box.has-bg-level-2.views-page-login-box-width.px-7.py-8',
                    {}, [
                        Register.isvalidate ? [
                            m('div.title-large.views-page-login-title.opacity',
                                {}, [config.exchName]),
                            m('div.title-large.has-text-title', {},
                                ['注册验证']),
                            m('div.py-0.mb-7.body-3.has-text-level-3', {}, ['您正在注册账户，请完成以下验证']),
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
                                        [Register.smsCd > 0 ? `${Register.smsCd} s` : I18n.$t('10214')/* '获取验证码' */]
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
                                        m('a', {
                                            onclick: () => {
                                                Register.type = 'phone';
                                                Register.cleanUp();
                                            }
                                        }, ['手机'])
                                    ]),
                                    m('li', { class: Register.type === 'email' ? 'is-active' : '' }, [
                                        m('a', {
                                            onclick: () => {
                                                Register.type = 'email';
                                                Register.cleanUp();
                                            }
                                        }, ['邮箱'])
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
                                            Register.showLoginNameValidate = true;
                                        },
                                        onblur: e => {
                                            Register.showLoginNameValidate = true;
                                        },
                                        value: Register.loginName
                                    }
                                })
                                : m('input.input[type=text]', {
                                    oninput: e => {
                                        Register.loginName = e.target.value;
                                        Register.showLoginNameValidate = true;
                                    },
                                    value: Register.loginName
                                }, []),
                            m('div.body-3.mt-2.has-text-tip-error', {
                                hidden: !Register.showLoginNameValidate
                            }, [regExp.validAccount(Register.type, Register.loginName)]),
                            m('div.py-0.mb-2.has-text-level-1.body-3.mt-5', {},
                                ['密码']),
                            m(InputWithComponent, {
                                hiddenLine: true,
                                options: {
                                    type: Register.showPassword ? 'text' : 'password',
                                    oninput: e => {
                                        Register.password = e.target.value;
                                    },
                                    onkeyup: e => {
                                        Register.showPasswordValidate = true;
                                        if (e.keyCode === 13) {
                                            Register.submit();
                                        }
                                    },
                                    onblur: e => {
                                        Register.showPasswordValidate = true;
                                    },
                                    value: Register.password
                                },
                                rightComponents: m('i.iconfont.mx-2', {
                                    onclick: () => { Register.showPassword = !Register.showPassword; },
                                    class: Register.showPassword ? 'icon-yincang' : 'icon-zichanzhengyan'
                                })
                            }),
                            m('div.body-3.mt-2.has-text-tip-error', {
                                hidden: !Register.showPasswordValidate
                            }, [regExp.validPassword(Register.password)]),
                            m('div.py-0.mb-2.has-text-level-1.body-3.mt-5', {},
                                [`邀请码${Register.mustInvited() ? '(必填)' : '(选填)'}`]),
                            m('input.input.mb-6', {
                                oninput: e => {
                                    Register.refereeId = e.target.value;
                                },
                                onkeyup: e => {
                                    if (e.keyCode === 13) {
                                        Register.submit();
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
                                        Register.submit();
                                    },
                                    disabled: !Register.valid(),
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