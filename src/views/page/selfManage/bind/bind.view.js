const m = require('mithril');
const model = require('./bind.logic');
const VerifyView = require('@/views/components/dialogVerify/dialogVerify.view');
const config = require('@/config.js');
const InputWithComponent = require('@/views/components/inputWithComponent/inputWithComponent.view');
const AreaCodeSelect = require('@/views/page/user/login/areaCodeSelect/areaCodeSelect.view');
const header = require('@/views/page/selfManage/header/header');
const regExp = require('@/models/validate/regExp');
// const Modal = require('@/views/components/common/Modal');
const Title = require('../goBackTitle/goBackTitle.view');
const I18n = require('@/languages/I18n').default;
require('./bind.scss');

module.exports = {
    oninit: () => model.oninit(m.route.param().type),
    onremove: vnode => model.onremove(vnode),
    view(vnode) {
        return m('div.bind-content', { class: `theme--light` }, [
            m(header),
            m(Title, {
                title: m.route.param().type === 'phone'
                    ? I18n.$t('10267')/* "您正在绑定手机验证" */
                    : I18n.$t('10268')/* "您正在绑定邮箱验证" */
            }),
            m('div.has-bg-level-1.pb-7', {}, [
                // 内容
                m('div', { class: `container has-bg-level-2 mt-7 py-8` }, [
                    m('div', { class: `bind-content-main my-form` }, [
                        // 登录密码
                        m('div', { class: `form-item` }, [
                            m('div', { class: `form-item-title` }, [
                                I18n.$t('10512')/* "登录密码" */
                            ]),
                            m('div.form-item-content', {}, [
                                m(InputWithComponent, {
                                    hiddenLine: true,
                                    options: {
                                        class: `input[type]`,
                                        placeholder: I18n.$t('10571')/* '请输入登录密码' */,
                                        type: model.showPassword ? 'text' : 'password',
                                        value: model.password,
                                        oninput(e) {
                                            model.showPasswordValidate = true;
                                            model.password = e.target.value;
                                        },
                                        onblur() {
                                            model.showPasswordValidate = true;
                                        }
                                    },
                                    rightComponents: m('i.iconfont.mx-2', {
                                        onclick: () => { model.showPassword = !model.showPassword; },
                                        class: model.showPassword ? 'icon-yincang' : 'icon-zichanzhengyan'
                                    })
                                })
                            ]),
                            m('div.body-3.has-text-tip-error', {
                                hidden: !model.showPasswordValidate
                            }, [regExp.validPassword(model.password)])
                        ]),
                        m.route.param().type === 'phone'
                            // 手机号
                            ? m('div', { class: `form-item pb-0` }, [
                                m('div', { class: `form-item-title` }, [
                                    I18n.$t('10121')/* "手机号" */
                                ]),
                                m('div', { class: `form-item-content` }, [
                                    m(InputWithComponent, {
                                        leftComponents: m(AreaCodeSelect, {
                                            selectList: model.selectList, //
                                            areaCode: model.areaCode, //
                                            onSelect: areaCode => { model.areaCode = areaCode; } //
                                        }),
                                        options: {
                                            oninput: e => {
                                                model.showPhoneValidate = true;
                                                model.bind = e.target.value;
                                            },
                                            onblur: e => {
                                                model.showPhoneValidate = true;
                                            },
                                            onkeyup: e => {
                                                if (regExp.validAccount(m.route.param().type, model.bind) || regExp.validPassword(model.password)) return;
                                                if (e.keyCode === 13) { model.saveClick(); }
                                            },
                                            placeholder: I18n.$t('10573')/* '请输入手机号' */,
                                            value: model.bind
                                        }
                                    })
                                ]),
                                m('div.body-3.has-text-tip-error', {
                                    hidden: !model.showPhoneValidate
                                }, [regExp.validAccount('phone', model.bind)])
                            ])
                            // 邮箱号
                            : m('div', { class: `form-item pb-0` }, [
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
                                        },
                                        onkeyup: e => {
                                            if (regExp.validAccount(m.route.param().type, model.bind) || regExp.validPassword(model.password)) return;
                                            if (e.keyCode === 13) { model.saveClick(); }
                                        }
                                    })
                                ]),
                                m('div.body-3.has-text-tip-error', {
                                    hidden: !model.showEmailValidate
                                }, [regExp.validAccount('email', model.bind)])
                            ]),
                        // 确定按钮
                        m("button.button.bind-save-btn.is-primary.font-size-2.has-text-white.button-large.mt-8", {
                            class: model.loading ? 'is-loading' : '',
                            onclick () {
                                model.saveClick();
                            },
                            disabled: regExp.validAccount(m.route.param().type, model.bind) || regExp.validPassword(model.password)
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
                loading: model.loading,
                isHandleVerify: true,
                title: {
                    logo: config.exchName,
                    text: I18n.$t('10113')/* "安全验证" */
                }
            }) : null
        ]);
    }
};
