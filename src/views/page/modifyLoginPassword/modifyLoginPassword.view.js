const m = require('mithril');
require('@/views/page/modifyLoginPassword/modifyLoginPassword.scss');
const modifyLPLogic = require('@/views/page/modifyLoginPassword/modifyLoginPassword.logic');
const I18n = require('@/languages/I18n').default;
const config = require('@/config.js');
const VerifyView = require('@/views/components/dialogVerify/dialogVerify.view');

const modifyLPView = {
    oninit: () => {
        modifyLPLogic.initFn();
    },
    view: () => {
        return m('div', { class: `views-page-accountSecurity-modifyLoginPassword theme--light` }, [
            m('div', { class: `operation mb-7 has-bg-level-2` }, [
                m('div', { class: `content-width container` }, [
                    m('i', { class: `iconfont icon-Return has-text-title` }),
                    m('span', { class: `has-text-title my-4 ml-4 title-medium` }, I18n.$t('10275') /* '您正在绑定谷歌验证' */)
                ])
            ]),
            m('div', { class: `center content-width container has-bg-level-2` }, [
                m('div', { class: `oldPwdDiv margin-LRauto` }, [
                    m('span', { class: `body-5` }, I18n.$t('10276') /* '原密码' */),
                    m('br'),
                    m('input', { class: `border-radius-small mb-5 mt-2 oldPwd`, type: `text` })
                ]),
                m('div', { class: `newPwdDiv margin-LRauto` }, [
                    m('span', { class: `body-5 mb-2` }, I18n.$t('10210') /* '新密码' */),
                    m('br'),
                    m('input', { class: `border-radius-small mt-2 newPwd`, type: `text` })
                ]),
                m('div', { class: `confirmPWdDiv margin-LRauto` }, [
                    m('span', { class: `body-5 mb-2` }, I18n.$t('10211') /* '确认密码' */),
                    m('br'),
                    m('input', { class: `border-radius-small mt-2 confirmPWd`, type: `text` })
                ]),
                m('div', { class: `btn mt-8 margin-LRauto` }, [
                    m('button', { class: `has-bg-primary cursor-pointer`, onclick: () => { modifyLPLogic.confirmBtn('unbind'); } }, '确定')
                ])
            ]),
            modifyLPLogic.isShowVerifyView ? m(VerifyView, {
                close: () => modifyLPLogic.switchSafetyVerifyModal(false),
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
module.exports = modifyLPView;