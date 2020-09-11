const m = require('mithril');
require('@/views/page/modifyLoginPassword/modifyLoginPassword.scss');
const modifyLPLogic = require('@/views/page/modifyLoginPassword/modifyLoginPassword.logic');
const I18n = require('@/languages/I18n').default;
const config = require('@/config.js');
const VerifyView = require('@/views/components/dialogVerify/dialogVerify.view');
const Header = require('@/views/components/indexHeader/indexHeader.view');
const InputWithComponent = require('@/views/components/inputWithComponent/inputWithComponent.view');

const modifyLPView = {
    pwdIsDifferent: false, // 【密码不一致】提示是否显示
    oldAndnewIsDifferent: false, // 【原密码与新密码不可相同】提示是否显示
    totalFlag: false, /* 是否通过校验 */
    showPassword1: false, /* 是否显示密码 */
    showPassword2: false, /* 是否显示密码 */
    showPassword3: false, /* 是否显示密码 */
    oninit: () => {
        modifyLPLogic.initFn();
    },
    /* 校验【原密码与新密码不可相同】 */
    newPwdCheck() {
        const oldPwd = document.getElementsByTagName('input')[0].value;
        const newPwd = document.getElementsByTagName('input')[1].value;

        /* 是否为空 新旧密码是否是一致 */
        if (!oldPwd || !newPwd || oldPwd === newPwd) {
            modifyLPView.totalFlag = false;
            modifyLPView.oldAndnewIsDifferent = true;
            return;
        }
        modifyLPView.oldAndnewIsDifferent = false;
        modifyLPView.totalFlag = true; // 通过校验
    },
    /* 校验新与确认【密码不一致】 */
    confirmPWdCheck() {
        const newPwd = document.getElementsByTagName('input')[1].value;
        const confirmPWd = document.getElementsByTagName('input')[2].value;
        /* 是否为空 新 确认密码是否输入一致 */
        if (!newPwd || !confirmPWd || newPwd !== confirmPWd) {
            modifyLPView.totalFlag = false;
            modifyLPView.pwdIsDifferent = true;
            return;
        }
        modifyLPView.pwdIsDifferent = false;
        modifyLPView.totalFlag = true; // 通过校验
    },
    /* 确认按钮事件 */
    confirmBtn: function() {
        // console.log(modifyLPView.totalFlag);
        if (!modifyLPView.totalFlag) {
            // alert("不满足要求");
            return;
        }
        modifyLPLogic.confirmBtn();
    },
    view: () => {
        return m('div', { class: `views-page-accountSecurity-modifyLoginPassword theme--light pb-7` }, [
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
                    m('span', { class: `has-text-title my-4 ml-4 title-medium` }, I18n.$t('10275') /* '您正在绑定谷歌验证' */)
                ])
            ]),
            m('div', { class: `center content-width container has-bg-level-2 pt-8` }, [
                m('div', { class: `center-center margin-LRauto` }, [
                    m('div', { class: `oldPwdDiv mb-5` }, [
                        m('span', { class: `body-5` }, I18n.$t('10276') /* '原密码' */),
                        m('br'),
                        m(InputWithComponent, {
                            hiddenLine: true,
                            addClass: `mt-2`,
                            options: {
                                type: modifyLPView.showPassword1 ? 'text' : 'password'
                            },
                            rightComponents: m('i.iconfont.mx-2', {
                                onclick: () => { modifyLPView.showPassword1 = !modifyLPView.showPassword1; },
                                class: modifyLPView.showPassword1 ? 'icon-yincang' : 'icon-zichanzhengyan'
                            })
                        })
                    ]),
                    m('div', { class: `newPwdDiv mb-5` }, [
                        m('span', { class: `body-5 mb-2` }, I18n.$t('10210') /* '新密码' */),
                        m('br'),
                        m(InputWithComponent, {
                            hiddenLine: true,
                            addClass: `mt-2 mb-2`,
                            options: {
                                type: modifyLPView.showPassword2 ? 'text' : 'password',
                                onblur: () => { modifyLPView.newPwdCheck(); }
                            },
                            rightComponents: m('i.iconfont.mx-2', {
                                onclick: () => { modifyLPView.showPassword2 = !modifyLPView.showPassword2; },
                                class: modifyLPView.showPassword2 ? 'icon-yincang' : 'icon-zichanzhengyan'
                            })
                        }),
                        m('span', { class: `has-text-tip-error`, style: { display: modifyLPView.oldAndnewIsDifferent ? `` : `none` } }, '原密码与新密码不可相同')
                    ]),
                    m('div', { class: `confirmPWdDiv mb-5` }, [
                        m('span', { class: `body-5 mb-2` }, I18n.$t('10211') /* '确认密码' */),
                        m('br'),
                        m(InputWithComponent, {
                            hiddenLine: true,
                            addClass: `mt-2 mb-2`,
                            options: {
                                type: modifyLPView.showPassword3 ? 'text' : 'password',
                                onblur: () => { modifyLPView.confirmPWdCheck(); }
                            },
                            rightComponents: m('i.iconfont.mx-2', {
                                onclick: () => { modifyLPView.showPassword3 = !modifyLPView.showPassword3; },
                                class: modifyLPView.showPassword3 ? 'icon-yincang' : 'icon-zichanzhengyan'
                            })
                        }),
                        m('span', { class: `has-text-tip-error`, style: { display: modifyLPView.pwdIsDifferent ? `` : `none` } }, '密码不一致')
                    ]),
                    m('div', { class: `btn mt-8` }, [
                        m('button', { class: `has-bg-primary cursor-pointer`, onclick: () => { modifyLPView.confirmBtn(); } }, I18n.$t('10337') /* '确定' */)
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