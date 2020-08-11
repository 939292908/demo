const m = require('mithril');
const Validate = require('./validate');
const Login = require('@/models/login/login');

import('@/styles/pages/login/login.css');

module.exports = {
    oninit() {
        Login.oninit();
    },
    onremove() {
        Login.onremove();
    },
    view() {
        return m('div.is-align-items-center', {}, [
            m('div.box.views-page-login-box-width.px-7.py-8', {},
                Login.validateCode.length
                    ? [m(Validate, { validateCode: Login.validateCode })]
                    : [
                        m('div.title-4.has-text-level-4', {},
                            [window.exchConfig.exchName]),
                        m('div.mb-8.title-4.has-text-level-1', {},
                            [`登录${window.exchConfig.exchName}账号`]),
                        m('div.has-text-level-1.body-3.mb-2', {}, ['手机/邮箱']),
                        m('input.input[type=text].mb-5', {
                            oninput: e => {
                                Login.account = e.target.value;
                            },
                            value: Login.account
                        }, []),
                        m('div.body-3.has-text-level-1.mb-2', {}, ['密码']),
                        m('input.input[type=password].mb-2', {
                            oninput: e => {
                                Login.password = e.target.value;
                            },
                            value: Login.password
                        }, []),
                        m('div.mb-5.has-text-right', {}, [
                            m('a.has-text-primary', {
                                onclick: () => {
                                    window.router.push('/forgetPassword');
                                }
                            }, ['忘记密码？'])]),
                        m('button.button.my-3.has-bg-primary.btn-2.is-fullwidth.mb-2',
                            {
                                onclick: () => {
                                    Login.login();
                                }
                            }, [window.gI18n.$t('10136')/* '登录' */]),
                        m('div.has-text-centered.body-3.has-text-level-1',
                            {}, [
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