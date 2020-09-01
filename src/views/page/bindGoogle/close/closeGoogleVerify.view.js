const m = require('mithril');
require('@/views/page/bindGoogle/bindGoogle.scss');
const closeGLogic = require('@/views/page/bindGoogle/close/closeGoogleVerify.logic');

const closeGView = {
    oninit: () => {
        closeGLogic.initFn();
    },
    view: () => {
        return m('div', { class: `views-page-accountSecurity-bindGoogle-close theme--light` }, [
            m('div', { class: `operation mb-7 has-bg-level-2` }, [
                m('i', { class: `iconfont icon-Return has-text-title` }),
                m('span', { class: `has-text-title my-4 ml-4 title-medium` }, '您正在解绑谷歌验证')
            ]),
            m('div', { class: `center content-width` }, [
                m('div', { class: `warning` }, [
                    m('i', { class: `iconfont icon-Tooltip` }),
                    m('span', {}, '出于安全考虑，修改账户安全项之后，24h内禁止提币')
                ]),
                m('div', { class: `closeOperation mt-3` }, [
                    m('div', { class: `pwdDiv` }, [
                        m('span', { class: `body-5` }, '登录密码'),
                        m('br'),
                        m('input', { class: `border-radius-small mb-5 mt-2 pwd`, type: `text` })
                    ]),
                    m('div', { class: `codeDiv` }, [
                        m('span', { class: `body-5 mb-2` }, '谷歌验证码'),
                        m('br'),
                        m('input', { class: `border-radius-small mt-2 code`, type: `text` })
                    ]),
                    m('div', { class: `btn mt-8` }, [
                        m('button', { class: `has-bg-primary`, onclick: () => { closeGLogic.bind(); } }, '确定')
                    ])
                ])
            ])
        ]);
    },
    onremove: () => {

    }
};
module.exports = closeGView;