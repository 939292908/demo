const m = require('mithril');
const model = require('./bindPhone.logic.js');
const VerifyView = require('@/views/components/dialogVerify/dialogVerify.view');
const InputWithComponent = require('@/views/components/inputWithComponent/inputWithComponent.view');
const AreaCodeSelect = require('@/views/page/user/login/areaCodeSelect/areaCodeSelect.view');
require('@/views/page/user/bind/bind.scss');
require('./bindPhone.scss');
// const Modal = require('@/views/components/common/Modal');
// const I18n = require('@/languages/I18n').default;

module.exports = {
    oninit: vnode => model.oninit(vnode),
    oncreate: vnode => model.oncreate(vnode),
    onremove: vnode => model.onremove(vnode),
    onupdate: vnode => model.onupdate(vnode),
    view(vnode) {
        return m('div', { class: `theme--light` }, [
            m('div', { class: `bind-content has-bg-level-1 pb-7` }, [
                // 标题
                m('div', { class: `bind-content-title has-bg-level-2 py-4` }, [
                    m('p', { class: `container title-small has-text-level-1 ` }, [
                        m('span', { class: `mr-7` }, "←"),
                        m('span', { class: `` }, [
                            "您正在绑定手机验证"
                        ])
                    ])
                ]),
                // 内容
                m('div', { class: `container has-bg-level-2 mt-7 py-8` }, [
                    m('div', { class: `bind-content-main my-form` }, [
                        // 登录密码
                        m('div', { class: `form-item` }, [
                            m('div', { class: `form-item-title` }, [
                                "登录密码"
                            ]),
                            m('div', { class: `form-item-content` }, [
                                m('input', {
                                    class: `input`,
                                    placeholder: '请输入登录密码',
                                    value: model.form.password,
                                    oninput(e) {
                                        model.onInputPassword(e);
                                    }
                                })
                            ])
                        ]),
                        // 手机号
                        m('div', { class: `form-item pb-0` }, [
                            m('div', { class: `form-item-title` }, [
                                "手机号"
                            ]),
                            m('div', { class: `form-item-content` }, [
                                // m('input', {
                                //     class: `input`,
                                //     placeholder: '请输入手机号',
                                //     value: model.form.email,
                                //     oninput(e) {
                                //         model.onInputEmail(e);
                                //     }
                                // })
                                m(InputWithComponent, {
                                    leftComponents: m(AreaCodeSelect, {
                                        selectList: model.selectList, //
                                        areaCode: model.form.areaCode, //
                                        onSelect: areaCode => { model.form.areaCode = areaCode; } //
                                    }),
                                    options: {
                                        oninput: e => {
                                            model.phone = e.target.value;
                                            // model.showLoginNameValidate = true;
                                        },
                                        onblur: e => {
                                            // model.showLoginNameValidate = true;
                                        },
                                        value: model.phone
                                    }
                                })
                            ])
                        ]),
                        // 确定按钮
                        m("button", {
                            class: "button bind-save-btn is-primary font-size-2 has-text-white button-large mt-8",
                            onclick () {
                                model.saveClick();
                            }
                        }, [
                            "确定"
                        ])
                    ])
                ])
            ]),
            model.isShowVerifyView ? m(VerifyView, {
                close: () => model.setVerifyViewModal(false),
                isHandleVerify: true,
                title: {
                    logo: "Vbit",
                    text: "安全验证"
                }
            }) : null
        ]);
    }
};