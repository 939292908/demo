const m = require('mithril');
require('@/views/page/selfManage/modifyLoginPassword/modifyLoginPassword.scss');
const modifyLPLogic = require('@/views/page/selfManage/modifyLoginPassword/modifyLoginPassword.logic');
const I18n = require('@/languages/I18n').default;
const config = require('@/config.js');
const VerifyView = require('@/views/components/dialogVerify/dialogVerify.view');
const Header = require('@/views/components/indexHeader/indexHeader.view');
const InputWithComponent = require('@/views/components/inputWithComponent/inputWithComponent.view');
const regExp = require('@/models/validate/regExp');

const modifyLPView = {
    totalFlag: false, /* 是否通过校验 */
    showPassword1: false, /* 是否显示密码 */
    showPassword2: false, /* 是否显示密码 */
    showPassword3: false, /* 是否显示密码 */
    tip1: null, /* 原密码下方提示 */
    tip2: null, /* 新密码下方提示 */
    tip3: null, /* 确认密码下方提示 */
    oninit: () => {
        modifyLPLogic.initFn();
    },
    oldLpwdCheck() {
        /* 是否为空  */
        const tip = regExp.validPassword(modifyLPLogic.oldLpwd);
        if (tip) {
            modifyLPView.totalFlag = false;
            modifyLPView.tip1 = tip;
            return;
        }
        modifyLPView.tip1 = '';
    },
    /* 校验【新密码与原密码不可相同】 */
    newPwdCheck() {
        /* 是否为空  */
        const tip = regExp.validPassword(modifyLPLogic.newLpwd);
        if (tip) {
            modifyLPView.totalFlag = false;
            modifyLPView.tip2 = tip;
            return;
        }
        /* 新旧密码是否是一致 */
        if (modifyLPLogic.oldLpwd === modifyLPLogic.newLpwd) {
            modifyLPView.totalFlag = false;
            modifyLPView.tip2 = I18n.$t('10596'); /* '新密码与原密码不可一致' */
            return;
        }
        modifyLPView.tip2 = '';
        modifyLPView.totalFlag = true; // 通过校验
    },
    /* 校验新与确认【密码不一致】 */
    confirmPWdCheck() {
        /* 是否为空 校验新与确认【密码不一致】  */
        const tip = regExp.validTwoPassword(modifyLPLogic.newLpwd, modifyLPLogic.confirmLpwd);
        if (tip) {
            modifyLPView.totalFlag = false;
            modifyLPView.tip3 = tip;
            return;
        }
        modifyLPView.tip3 = '';
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
                    { to: '/selfManage', title: I18n.$t('10051') /* '个人总览' */ },
                    { to: '/securityManage', title: I18n.$t('10181') /* '账户安全' */ }
                    // { to: '', title: I18n.$t('10182') /* '身份认证' */ },
                    // { to: '', title: I18n.$t('10183') /* 'API管理' */ },
                    // { to: '', title: I18n.$t('10184') /* '邀请返佣' */ }
                ]
            }),
            m('div', { class: `operation mb-7 has-bg-level-2` }, [
                m('div', { class: `content-width container` }, [
                    m('i', { class: `iconfont icon-Return has-text-title cursor-pointer`, onclick: () => { window.router.go(-1); } }),
                    m('span', { class: `has-text-title my-4 ml-4 title-medium` }, I18n.$t('10275') /* '您正在绑定谷歌验证' */)
                ])
            ]),
            m('div', { class: `center content-width container has-bg-level-2 pt-8 pb-8` }, [
                m('div', { class: `center-center margin-LRauto` }, [
                    m('div', { class: `oldPwdDiv mb-5` }, [
                        m('span', { class: `body-5` }, I18n.$t('10276') /* '原密码' */),
                        m('br'),
                        m(InputWithComponent, {
                            hiddenLine: true,
                            addClass: `mt-2`,
                            options: {
                                type: modifyLPView.showPassword1 ? 'text' : 'password',
                                oninput: e => {
                                    modifyLPLogic.oldLpwd = e.target.value;
                                },
                                onblur: () => { modifyLPView.oldLpwdCheck(); },
                                value: modifyLPLogic.oldLpwd
                            },
                            rightComponents: m('i.iconfont.mx-2', {
                                onclick: () => { modifyLPView.showPassword1 = !modifyLPView.showPassword1; },
                                class: modifyLPView.showPassword1 ? 'icon-yincang' : 'icon-zichanzhengyan'
                            })
                        }),
                        m('span', { class: `has-text-tip-error`, style: { display: modifyLPView.tip1 ? `` : `none` } }, modifyLPView.tip1)
                    ]),
                    m('div', { class: `newPwdDiv mb-5` }, [
                        m('span', { class: `body-5 mb-2` }, I18n.$t('10210') /* '新密码' */),
                        m('br'),
                        m(InputWithComponent, {
                            hiddenLine: true,
                            addClass: `my-2`,
                            options: {
                                type: modifyLPView.showPassword2 ? 'text' : 'password',
                                oninput: e => {
                                    modifyLPLogic.newLpwd = e.target.value;
                                },
                                onblur: () => { modifyLPView.newPwdCheck(); },
                                value: modifyLPLogic.newLpwd
                            },
                            rightComponents: m('i.iconfont.mx-2', {
                                onclick: () => { modifyLPView.showPassword2 = !modifyLPView.showPassword2; },
                                class: modifyLPView.showPassword2 ? 'icon-yincang' : 'icon-zichanzhengyan'
                            })
                        }),
                        m('span', { class: `has-text-tip-error`, style: { display: modifyLPView.tip2 ? `` : `none` } }, modifyLPView.tip2)
                    ]),
                    m('div', { class: `confirmPWdDiv mb-5` }, [
                        m('span', { class: `body-5 mb-2` }, I18n.$t('10211') /* '确认密码' */),
                        m('br'),
                        m(InputWithComponent, {
                            hiddenLine: true,
                            addClass: `my-2`,
                            options: {
                                type: modifyLPView.showPassword3 ? 'text' : 'password',
                                oninput: e => {
                                    modifyLPLogic.confirmLpwd = e.target.value;
                                },
                                onblur: () => { modifyLPView.confirmPWdCheck(); },
                                value: modifyLPLogic.confirmLpwd
                            },
                            rightComponents: m('i.iconfont.mx-2', {
                                onclick: () => { modifyLPView.showPassword3 = !modifyLPView.showPassword3; },
                                class: modifyLPView.showPassword3 ? 'icon-yincang' : 'icon-zichanzhengyan'
                            })
                        }),
                        m('span', { class: `has-text-tip-error`, style: { display: modifyLPView.tip3 ? `` : `none` } }, modifyLPView.tip3)
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
        modifyLPLogic.removeFn();
    }
};
module.exports = modifyLPView;