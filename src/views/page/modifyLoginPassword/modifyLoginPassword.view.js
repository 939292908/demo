const m = require('mithril');
require('@/views/page/modifyLoginPassword/modifyLoginPassword.scss');
const modifyLPLogic = require('@/views/page/modifyLoginPassword/modifyLoginPassword.logic');
const I18n = require('@/languages/I18n').default;
const config = require('@/config.js');
const VerifyView = require('@/views/components/dialogVerify/dialogVerify.view');

const modifyLPView = {
    pwdIsDifferent: false, // 新密码与确认密码是否一致提示是否显示
    oldAndnewIsDifferent: false, // 原密码与新密码是否一致提示是否显示
    newPwdCheck() {
        const oldPwd = document.getElementsByClassName('oldPwd')[0].value;
        const newPwd = document.getElementsByClassName('newPwd')[0].value;
        oldPwd === newPwd ? modifyLPView.oldAndnewIsDifferent = true : modifyLPView.oldAndnewIsDifferent = false;
    },
    confirmPWdCheck() {
        const newPwd = document.getElementsByClassName('newPwd')[0].value;
        const confirmPWd = document.getElementsByClassName('confirmPWd')[0].value;
        newPwd !== confirmPWd ? modifyLPView.pwdIsDifferent = true : modifyLPView.pwdIsDifferent = false;
    },
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
            m('div', { class: `center content-width container has-bg-level-2 pt-8` }, [
                m('div', { class: `center-center margin-LRauto` }, [
                    m('div', { class: `oldPwdDiv` }, [
                        m('span', { class: `body-5` }, I18n.$t('10276') /* '原密码' */),
                        m('br'),
                        m('input', {
                            class: `border-radius-small mb-5 mt-2 oldPwd has-line-level-3`,
                            type: `password`
                        })
                    ]),
                    m('div', { class: `newPwdDiv` }, [
                        m('span', { class: `body-5 mb-2` }, I18n.$t('10210') /* '新密码' */),
                        m('br'),
                        m('input', {
                            class: `border-radius-small mt-2 newPwd has-line-level-3 mb-5`,
                            oninput: () => { modifyLPView.newPwdCheck(); },
                            type: `password`
                        }),
                        m('span', { class: `has-text-tip-error`, style: { display: modifyLPView.oldAndnewIsDifferent ? `` : `none` } }, '原密码与新密码不可相同')
                    ]),
                    m('div', { class: `confirmPWdDiv` }, [
                        m('span', { class: `body-5 mb-2` }, I18n.$t('10211') /* '确认密码' */),
                        m('br'),
                        m('input', {
                            class: `border-radius-small mt-2 confirmPWd has-line-level-3`,
                            oninput: () => { modifyLPView.confirmPWdCheck(); },
                            type: `password`
                        }),
                        m('span', { class: `has-text-tip-error`, style: { display: modifyLPView.pwdIsDifferent ? `` : `none` } }, '密码不一致')
                    ]),
                    m('div', { class: `btn mt-8` }, [
                        m('button', { class: `has-bg-primary cursor-pointer`, onclick: () => { modifyLPLogic.confirmBtn('unbind'); } }, I18n.$t('10337') /* '确定' */)
                    ])
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