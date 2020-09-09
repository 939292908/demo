const m = require('mithril');
const model = require('../bind.logic');
const VerifyView = require('@/views/components/dialogVerify/dialogVerify.view');
const config = require('@/config.js');
const header = require('@/views/components/indexHeader/indexHeader.view');
require('@/views/page/user/bind/bind.scss');
require('./bindEmail.scss');
const regExp = require('@/models/validate/regExp');
// const Modal = require('@/views/components/common/Modal');
const I18n = require('@/languages/I18n').default;

module.exports = {
    oninit: () => model.oninit('email'),
    onremove: vnode => model.onremove(vnode),
    view(vnode) {
        return m('div', { class: `theme--light` }, [
            m('div.px-3.has-bg-sub-level-1.is-align-items-center', {}, [
                m('div.content-width', {}, [
                    m(header, {
                        highlightFlag: 1,
                        navList: [
                            { to: '/', title: I18n.$t('10051')/* '个人总览' */ },
                            { to: '/', title: I18n.$t('10181')/* '账户安全' */ },
                            { to: '/', title: I18n.$t('10182')/* '身份认证' */ },
                            { to: '/', title: I18n.$t('10183')/* 'API管理' */ },
                            { to: '/', title: I18n.$t('10184')/* '邀请返佣' */ }
                        ]
                    })
                ])
            ]),
            m('div', { class: `bind-content has-bg-level-1 pb-7` }, [
                // 标题
                m('div', { class: `bind-content-title has-bg-level-2 py-4` }, [
                    m('p', { class: `container title-small has-text-level-1 ` }, [
                        m('span', {
                            class: `mr-7`,
                            onclick: () => {
                                window.router.go(-1);
                            }
                        }, [
                            m('i.iconfont.icon-Return.iconfont-medium', {}, [])
                        ]),
                        m('span', { class: `` }, [
                            I18n.$t('10268')/* "您正在绑定邮箱验证" */
                        ])
                    ])
                ]),
                // 内容
                m('div', { class: `container has-bg-level-2 mt-7 py-8` }, [
                    m('div', { class: `bind-content-main my-form` }, [
                        // 登录密码
                        m('div', { class: `form-item` }, [
                            m('div', { class: `form-item-title` }, [
                                I18n.$t('10512')/* "登录密码" */
                            ]),
                            m('div', { class: `form-item-content` }, [
                                m('input', {
                                    class: `input`,
                                    placeholder: I18n.$t('10571')/* '请输入登录密码' */,
                                    type: 'password',
                                    value: model.password,
                                    oninput(e) {
                                        model.showPasswordValidate = true;
                                        model.password = e.target.value;
                                    },
                                    onblur() {
                                        model.showPasswordValidate = true;
                                    }
                                })
                            ]),
                            m('div.body-3.has-text-tip-error', {
                                hidden: !model.showPasswordValidate
                            }, [regExp.validPassword(model.password)])
                        ]),
                        // 邮箱号
                        m('div', { class: `form-item pb-0` }, [
                            m('div', { class: `form-item-title` }, [
                                I18n.$t('10122')/* "邮箱号" */
                            ]),
                            m('div', { class: `form-item-content` }, [
                                m('input', {
                                    class: `input`,
                                    placeholder: I18n.$t('10572')/* '请输入邮箱号' */,
                                    value: model.bind,
                                    oninput(e) {
                                        model.showEmailValidate = true;
                                        model.bind = e.target.value;
                                    },
                                    onblur() {
                                        model.showEmailValidate = true;
                                    }
                                })
                            ]),
                            m('div.body-3.has-text-tip-error', {
                                hidden: !model.showEmailValidate
                            }, [regExp.validAccount('email', model.bind)])
                        ]),
                        // 确定按钮
                        m("button", {
                            class: "button bind-save-btn is-primary font-size-2 has-text-white button-large mt-8",
                            onclick () {
                                model.saveClick();
                            },
                            disabled: regExp.validAccount('email', model.bind) || regExp.validPassword(model.password)
                        }, [
                            I18n.$t('10337')/* "确定" */
                        ])
                    ])
                ])
            ]),
            model.showValid ? m(VerifyView, {
                close: () => {
                    model.showValid = false;
                },
                isHandleVerify: true,
                title: {
                    logo: config.exchName,
                    text: I18n.$t('10113')/* "安全验证" */
                }
            }) : null
        ]);
    }
};