const m = require('mithril');
const model = require('./changePassword.logic.js');
require('@/views/page/accountSecurity/modifyLoginPassword/changePassword.scss');

module.exports = {
    oninit: vnode => model.oninit(vnode),
    oncreate: vnode => model.oncreate(vnode),
    onremove: vnode => model.onremove(vnode),
    onupdate: vnode => model.onupdate(vnode),
    view: function () {
        return m('div.views-page-accountsecurity-modifyLoginPassword-changePassword ', {}, [
            m('', { class: 'is-hidden-mobile has-bg-sub-level-1 ' + ("") }, [
                m('div.navbar-start', { class: 'container' }, [
                    m('', {
                        class: "navbar-item has-text-primary-hover cursor-pointer ",
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        '个人总览'
                    ]),
                    m('div.navbar-item.cursor-pointer', { class: `has-text-primary-hover ` }, [
                        m('', {
                            class: "navbar-item has-text-primary-hover cursor-pointer ",
                            onclick: function () {
                                window.router.push('/');
                            }
                        }, [
                            '账户安全'
                        ])
                    ]),
                    m('', {
                        class: "navbar-item has-text-primary-hover cursor-pointer ",
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        '身份认证'
                    ]),
                    m('', {
                        class: "navbar-item has-text-primary-hover cursor-pointer ",
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        'API管理'
                    ]),
                    m('', {
                        class: "navbar-item has-text-primary-hover cursor-pointer ",
                        onclick: function () {
                            window.router.push('/accountSecurity');
                        }
                    }, [
                        '邀请反佣'
                    ])
                ])
            ]),
            m('div', { class: `container` }, [
                m('div', { class: `iconfont icon-Return mt-4 has-text-primary title-large font-weight-regular ` }, ["您正在修改登录密码"])
            ]),
            m('div', { class: `changePassword_background has-bg-level-2 container` }, [
                m('div', { class: `changePassword_Input container` }, [
                    m('div', { class: `has-text-level-1 body-3 mb-2 container` }, ["原密码"]),
                    m('input', { class: `mb-5`, type: "text" }, []),
                    m('div', { class: `has-text-level-1 body-3 mb-2 container` }, ["新密码"]),
                    m('input', { class: `mb-5`, type: "text" }, []),
                    m('div', { class: `has-text-level-1 body-3 mb-2 container` }, ["确认密码"]),
                    m('input', { class: `mb-5`, type: "text" }, []),
                    m('button', { class: `button my-3 has-bg-primary button-medium is-fullwidth has-text-white ` }, ["确定"])
                ])
            ])
        ]);
    }
};