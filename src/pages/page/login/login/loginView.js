const m = require('mithril');
const Validate = require('../../../components/validate/validateView');
const InputWithComponent = require('../../../components/inputWithComponent/inputWithComponentView');
const Login = require('./loginModel');
const config = require('@/config');
const I18n = require('@/languages/I18n').default;

import('@/styles/pages/login/login.css');

module.exports = {
    oninit() {
        Login.oninit();
    },
    onremove() {
        Login.onremove();
    },
    view() {
        return m('div.is-align-items-center.has-bg-level-1.pa-8.theme--light', {}, [
            m('div.box.has-bg-level-2.views-page-login-box-width.px-7.py-8', {},
                Login.is2fa
                    ? [m(Validate, { is2fa: Login.is2fa })]
                    : [
                        m('div.title-large.views-page-login-title.opacity', {}, [config.exchName]),
                        m('div.mb-8.title-large.has-text-title', {},
                            [`登录`]),
                        m('div.has-text-level-1.body-3.mb-2', {}, ['手机/邮箱']),
                        m('input.input[type=text].mb-5', {
                            oninput: e => {
                                Login.account = e.target.value;
                            },
                            value: Login.account
                        }, []),
                        m('div.body-3.has-text-level-1.mb-2', {}, ['密码']),
                        m(InputWithComponent, {
                            hiddenLine: true,
                            options: {
                                type: Login.showPassword ? 'text' : 'password',
                                oninput: e => {
                                    Login.password = e.target.value;
                                },
                                onkeyup: e => {
                                    if (e.keyCode === 13) { Login.login(); }
                                },
                                value: Login.password
                            },
                            rightComponents: m('i.iconfont.mx-2', {
                                onclick: () => { Login.showPassword = !Login.showPassword; },
                                class: Login.showPassword ? 'icon-yincang' : 'icon-zichanzhengyan'
                            })
                        }),
                        m('div.mb-5.has-text-right', {}, [
                            m('a.has-text-primary', {
                                onclick: () => {
                                    window.router.push('/forgetPassword');
                                }
                            }, ['忘记密码？'])]),
                        m('button.button.my-3.has-bg-primary.button-medium.is-fullwidth.mb-2.has-text-white', {
                            onclick: () => { Login.login(); },
                            disabled: !Login.valid(),
                            class: Login.loading ? 'is-loading' : ''
                        }, [I18n.$t('10136')/* '登录' */]),
                        m('div.has-text-centered.body-3.has-text-level-2', {}, [
                            '还没账号？去',
                            m('a.has-text-primary', {
                                onclick: () => {
                                    window.router.push('/register');
                                }
                            }, ['注册'])
                        ])
                    ])
        ]);
    }
};