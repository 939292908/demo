const m = require('mithril');
require('@/views/page/bindGoogle/bindGoogle.scss');
const closeGLogic = require('@/views/page/bindGoogle/bindGoogle.logic');
const I18n = require('@/languages/I18n').default;
const VerifyView = require('@/views/components/dialogVerify/dialogVerify.view');
const config = require('@/config.js');
const Header = require('@/views/components/indexHeader/indexHeader.view');

const closeGView = {
    oninit: () => {
        closeGLogic.currentOperation = 'unbind';
        closeGLogic.initFn();
    },
    view: () => {
        return m('div', { class: `views-page-accountSecurity-bindGoogle-close theme--light pb-7` }, [
            m(Header, {
                highlightFlag: 1,
                navList: [
                    { to: '', title: I18n.$t('10051') /* '个人总览' */ },
                    { to: '', title: I18n.$t('10181') /* '账户安全' */ },
                    { to: '', title: I18n.$t('10182') /* '身份认证' */ },
                    { to: '', title: I18n.$t('10183') /* 'API管理' */ },
                    { to: '', title: I18n.$t('10184') /* '邀请返佣' */ }
                ]
            }),
            m('div', { class: `operation mb-7 has-bg-level-2` }, [
                m('div', { class: `content-width container` }, [
                    m('i', { class: `iconfont icon-Return has-text-title` }),
                    m('span', { class: `has-text-title my-4 ml-4 title-medium` }, I18n.$t('10262') /* '您正在解绑谷歌验证' */)
                ])
            ]),
            m('div', { class: `center content-width margin-LRauto` }, [
                m('div', { class: `warning mb-3 pl-7` }, [
                    m('i', { class: `iconfont icon-Tooltip pr-2 has-text-primary` }),
                    m('span', { class: `has-text-level-3` }, I18n.$t('10263') /* '出于安全考虑，修改账户安全项之后，24h内禁止提币' */)
                ]),
                m('div', { class: `closeOperation pt-8 has-bg-level-2` }, [
                    m('div', { class: `pwdDiv margin-LRauto` }, [
                        m('span', { class: `body-5` }, I18n.$t('10512') /* '登录密码' */),
                        m('br'),
                        m('input', { class: `border-radius-small mb-5 mt-2 pwd has-line-level-3`, type: `password` })
                    ]),
                    m('div', { class: `codeDiv margin-LRauto` }, [
                        m('span', { class: `body-5 mb-2` }, I18n.$t('10264') /* '原谷歌验证码' */),
                        m('br'),
                        m('input', { class: `border-radius-small mt-2 code has-line-level-3`, type: `text` })
                    ]),
                    m('div', { class: `btn mt-8 margin-LRauto` }, [
                        m('button', { class: `has-bg-primary cursor-pointer`, onclick: () => { closeGLogic.confirmBtn(); } }, I18n.$t('10337') /* '确定' */)
                    ])
                ])
            ]),
            closeGLogic.isShowVerifyView ? m(VerifyView, {
                close: () => closeGLogic.switchSafetyVerifyModal(false),
                isHandleVerify: true,
                title: {
                    logo: config.exchName,
                    text: I18n.$t('10113') /* "安全验证" */
                }
            }) : null
        ]);
    },
    onremove: () => {

    }
};
module.exports = closeGView;