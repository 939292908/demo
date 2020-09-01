const m = require('mithril');
const model = require('./changePassword.logic.js');
require('@/views/page/accountSecurity/modifyLoginPassword/changePassword.scss');

module.exports = {
    oninit: vnode => model.oninit(vnode),
    oncreate: vnode => model.oncreate(vnode),
    onremove: vnode => model.onremove(vnode),
    onupdate: vnode => model.onupdate(vnode),
    view: function () {
        return m('div.views-page-accountsecurity-modifyLoginPassword-changePassword theme--light', {}, [
            m('', { class: 'is-hidden-mobile has-bg-sub-level-1 ' + ("") }, [
                m('div.navbar-start', { class: 'container has-text-sub-level-3 ' }, [
                    m('', {
                        class: "navbar-item has-text-primary-hover cursor-pointer has-text-sub-level-3",
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        '个人总览'
                    ]),
                    m('div.navbar-item.cursor-pointer', { class: `has-text-primary-hover ` }, [
                        m('', {
                            class: "navbar-item has-text-primary-hover cursor-pointer has-text-sub-level-3 ",
                            onclick: function () {
                                window.router.push('/');
                            }
                        }, [
                            '账户安全'
                        ])
                    ]),
                    m('', {
                        class: "navbar-item has-text-primary-hover cursor-pointer has-text-sub-level-3 ",
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        '身份认证'
                    ]),
                    m('', {
                        class: "navbar-item has-text-primary-hover cursor-pointer has-text-sub-level-3 ",
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        'API管理'
                    ]),
                    m('', {
                        class: "navbar-item has-text-primary-hover cursor-pointer has-text-sub-level-3 ",
                        onclick: function () {
                            window.router.push('/accountSecurity');
                        }
                    }, [
                        '邀请反佣'
                    ])
                ])
            ]),
            m('div', { class: `bind-content has-bg-level-1 pb-7` }, [
                // 标题
                m('div', { class: `bind-content-title has-bg-level-2 py-4` }, [
                    m('p', { class: `container title-small has-text-level-1 ` }, [
                        m('span', { class: `mr-7` }, "←"),
                        m('span', { class: `` }, [
                            "您正在修改登录密码"
                        ])
                    ])
                ]),
                // 内容
                m('div', { class: `container has-bg-level-2 mt-7 py-8` }, [
                    m('div', { class: `bind-content-main my-form` }, [
                        // 原密码
                        m('div', { class: `form-item` }, [
                            m('div', { class: `form-item-title` }, [
                                "原密码"
                            ]),
                            m('div', { class: `form-item-content` }, [
                                m('input', {
                                    class: `input`,
                                    placeholder: '请输入原密码',
                                    value: model.password1,
                                    type: "password",
                                    oninput(e) {
                                        model.password1 = e.target.value;
                                    }
                                })
                            ])
                        ]),
                        // 新密码
                        m('div', { class: `form-item pb-0` }, [
                            m('div', { class: `form-item-title` }, [
                                "新密码"
                            ]),
                            m('div', { class: `form-item-content` }, [
                                m('input', {
                                    class: `input`,
                                    placeholder: '请输入新密码',
                                    value: model.password2,
                                    type: "password",
                                    oninput(e) {
                                        model.password2 = e.target.value;
                                    }
                                })
                            ])
                        ]),
                        // 确认密码
                        m('div', { class: `form-item mt-4` }, [
                            m('div', { class: `form-item-title` }, [
                                "确认密码"
                            ]),
                            m('div', { class: `form-item-content` }, [
                                m('input', {
                                    class: `input`,
                                    placeholder: '请确认新密码',
                                    value: model.password3,
                                    type: "password",
                                    oninput(e) {
                                        model.password3 = e.target.value;
                                    }
                                })
                            ])
                        ]),
                        // 确定按钮
                        m("button", {
                            class: "button bind-save-btn is-primary font-size-2 has-text-white button-large mt-8",
                            onclick() {
                                model.submitReset();
                            }
                        }, [
                            "确定"
                        ])
                    ])
                ])
            ])
        ]);
    }
};