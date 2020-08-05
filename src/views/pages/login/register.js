let m = require('mithril')
let Register = require('@/models/login/register')
let InputWithSelect = require('@/components/inputWithSelect')

module.exports = {
    oninit() {
        Register.oninit();
    },
    onremove() {
        Register.onremove();
    },
    view() {
        return m('div.pa', {width: '769px'}, [
            m('div.box.has-bg-level-2', {}, [
                m('div.columns', {}, [
                    m('div.column', {}, []),
                    m('div.column', {}, []),
                    m('div.column', {}, [
                        Register.isValidate ? m('div.box.has-bg-level-3.views-pages-login-index-box', {}, [
                                m('div.mb-5.title-2.has-text-level-1', {}, ['验证码']),
                                m('input.input[type=text].mb-6', {
                                    oninput: e => {
                                        Register.code = e.target.value
                                    },
                                    value: Register.code
                                }, []),

                                m('button.button.my-3.is-primary.is-fullwidth.mb-2', {
                                    onclick: () => {
                                        Register.type === 'phone' ?
                                            validate.checkSmsCode(Register.code) :
                                            validate.checkEmailCode(Register.code);
                                    }
                                }, ['注册']),

                            ]) :
                            m('div.box.has-bg-level-3.views-pages-login-index-box', {}, [
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
                                            class: Register.type === 'mail' ? 'is-active' : ''
                                        }, [
                                            m('a', {
                                                onclick: () => {
                                                    Register.type = 'mail';
                                                }
                                            }, ['邮箱'])
                                        ]),
                                    ]),
                                ]),
                                m('div.py-0.mb-2', {}, [Register.type === 'phone' ? '手机号' : '邮箱']),
                                Register.type === 'phone' ?
                                    InputWithSelect({
                                        selectList: ['+86', '+0', '+1'],
                                        selectedOptions: {},
                                        componentOptions: {class: 'mb-5'},
                                        inputOptions: {
                                            type: 'text',
                                            oninput: e => {
                                                Register.loginName = e.target.value;
                                            },
                                            value: Register.loginName,
                                        }
                                    }) :
                                    m('input.input[type=text].mb-5', {
                                        oninput: e => {
                                            Register.loginName = e.target.value;
                                        },
                                        value: Register.loginName,
                                    }, []),
                                m('div.py-0.mb-2', {}, ['密码']),
                                m('input.input[type=password].mb-5', {
                                    oninput: e => {
                                        Register.password = e.target.value;
                                    },
                                    value: Register.password,
                                }, []),
                                m('div.py-0.mb-2', {}, ['邀请码（选填）']),
                                m('input.input[type=password].mb-6', {
                                    oninput: e => {
                                        Register.refereeId = e.target.value;
                                    },
                                    value: Register.refereeId,
                                }, []),
                                m('button.button.my-3.is-primary.is-fullwidth.mb-2', {
                                    onclick: () => {
                                        Register.submitEmail();
                                    }
                                }, ['注册']),
                                m('div.has-text-centered.body-3.has-text-level-1', {}, [
                                    '已有账号？去',
                                    m('a.has-text-primary', {
                                        onclick: () => {
                                            window.router.push('/login')
                                        }
                                    }, ['登录'])
                                ]),
                            ])
                    ]),
                ]),
            ]),
        ]);
    }
}