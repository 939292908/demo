const m = require('mithril');
require('@/views/page/selfManage/modifyFundPassword/modifyFundPassword.scss');
const modifyFPLogic = require('@/views/page/selfManage/modifyFundPassword/modifyFundPassword.logic');
const I18n = require('@/languages/I18n').default;
// const broadcast = require('@/broadcast/broadcast');
const Header = require('@/views/components/indexHeader/indexHeader.view');
const InputWithComponent = require('@/views/components/inputWithComponent/inputWithComponent.view');
const VerifyView = require('@/views/components/dialogVerify/dialogVerify.view');
const config = require('@/config.js');
const regExp = require('@/models/validate/regExp');
const Modal = require('@/views/components/common/Modal');

const modifyFPView = {
    tipModalIsShow: true, /* 修改资金密码提示框 */
    totalFlag: false, /* 是否通过校验 */
    showPassword1: false, /* 是否显示密码 */
    showPassword2: false, /* 是否显示密码 */
    showPassword3: false, /* 是否显示密码 */
    tip1IsShow: false, // 原密码下方提示是否显示
    tip2IsShow: false, // 新密码下方提示是否显示
    tip3IsShow: false, // 确认密码下方是否显示
    tip1: null, /* 原密码下方提示 */
    tip2: null, /* 新密码/资金密码下方提示 */
    tip3: null, /* 确认密码下方提示 */
    oldFundPwdCheck() {
        /* 是否为空  */
        const tip = regExp.validPassword(modifyFPLogic.oldFundPwd);
        if (tip) {
            modifyFPView.totalFlag = false;
            modifyFPView.tip1 = tip;
            modifyFPView.tip1IsShow = true;
            return;
        }
        modifyFPView.tip1IsShow = false;
        modifyFPView.totalFlag = true;
    },
    newFunPwdCheck() {
        /* 是否为空  */
        const tip = regExp.validPassword(modifyFPLogic.newFunPwd);
        if (tip) {
            modifyFPView.totalFlag = false;
            modifyFPView.tip2 = tip;
            modifyFPView.tip2IsShow = true;
            return;
        }
        /* 新旧密码是否是一致 */
        if (modifyFPLogic.oldFundPwd === modifyFPLogic.newFunPwd) {
            modifyFPView.totalFlag = false;
            modifyFPView.tip2 = '新密码与原密码不可一致';
            modifyFPView.tip2IsShow = true;
            return;
        }
        modifyFPView.tip2IsShow = false;
        modifyFPView.totalFlag = true;
    },
    confirmFunPwdCheck() {
        /* 是否为空 校验新与确认【密码不一致】  */
        const tip = regExp.validTwoPassword(modifyFPLogic.newFunPwd, modifyFPLogic.confirmFunPwd);
        if (tip) {
            modifyFPView.totalFlag = false;
            modifyFPView.tip3 = tip;
            modifyFPView.tip3IsShow = true;
            return;
        }
        modifyFPView.tip3IsShow = false; // 隐藏提示
        modifyFPView.totalFlag = true; // 通过校验
    },
    /* 确认按钮事件 */
    confirmBtn: function() {
        // console.log(modifyLPView.totalFlag);
        if (!modifyFPView.totalFlag) {
            // alert("不满足要求");
            return;
        }
        modifyFPLogic.confirmBtn();
    },
    oninit: () => {
        /* 是否显示密码初始化 start */
        this.showPassword1 = false;
        this.showPassword2 = false;
        this.showPassword3 = false;
        /* 是否显示密码初始化 end */

        /* 密码下方提示是否显示初始化 start */
        this.tip1IsShow = false;
        this.tip2IsShow = false;
        this.tip3IsShow = false;
        /* 密码下方提示是否显示初始化 end */

        modifyFPLogic.initFn();
    },
    view: () => {
        return m('div', { class: `views-page-selfManage-modifyFundPassword theme--light pb-8` }, [
            m(Header, {
                highlightFlag: 1,
                navList: [
                    { to: '/selfManage', title: I18n.$t('10051') /* '个人总览' */ },
                    { to: '/securityManage', title: I18n.$t('10181') /* '账户安全' */ },
                    { to: '', title: I18n.$t('10182') /* '身份认证' */ },
                    { to: '', title: I18n.$t('10183') /* 'API管理' */ },
                    { to: '', title: I18n.$t('10184') /* '邀请返佣' */ }
                ]
            }),
            m('div', { class: `operation mb-7 has-bg-level-2` }, [
                m('div', { class: `content-width container` }, [
                    m('i', { class: `iconfont icon-Return has-text-title cursor-pointer`, onclick: () => { window.router.go(-1); } }),
                    m('span', { class: `has-text-title my-4 ml-4 title-medium` }, I18n.$t('10289') /* '您正在设置资金密码' */)
                ])
            ]),
            m('div', { class: `warning mb-3 pl-7 content-width container` }, [
                m('i', { class: `iconfont icon-Tooltip pr-2 has-text-primary cursor-pointer` }),
                m('span', { class: `has-text-level-3` },
                    modifyFPLogic.modifyFlag === 0
                        ? I18n.$t('10290') /* '资产密码将用于转账、法币交易、红包等功能，请妥善保管，避免泄露. 请不要忘记自己的资产密码，资产密码遗忘后，需要将身份证及个人信息发送至客服邮箱，客服在24小时内处理' */
                        : I18n.$t('10205') /* '出于安全考虑，修改账户安全项之后，24h内禁止提币、内部转出与卖币操作' */
                )
            ]),
            m('div', { class: `center content-width container has-bg-level-2 margin-LRauto pt-7` }, [
                m('div', { class: `center-content content-width container` }, [
                    m('div', { class: `oldPwdDiv mb-5`, style: { display: `${modifyFPLogic.modifyFlag === 0 ? `none` : ``}` } }, [
                        m('span', { class: `body-5` }, I18n.$t('10276') /* '原密码' */),
                        m('br'),
                        m(InputWithComponent, {
                            hiddenLine: true,
                            addClass: `mt-2`,
                            options: {
                                type: modifyFPView.showPassword1 ? 'text' : 'password',
                                oninput: e => {
                                    modifyFPLogic.oldFundPwd = e.target.value;
                                },
                                onblur: () => { modifyFPView.oldFundPwdCheck(); },
                                value: modifyFPLogic.oldFundPwd
                            },
                            rightComponents: m('i.iconfont.mx-2', {
                                onclick: () => { modifyFPView.showPassword1 = !modifyFPView.showPassword1; },
                                class: modifyFPView.showPassword1 ? 'icon-yincang' : 'icon-zichanzhengyan'
                            })
                        }),
                        m('span', { class: `has-text-tip-error`, style: { display: modifyFPView.tip1IsShow ? `` : `none` } }, modifyFPView.tip1)
                    ]),
                    m('div', { class: `newPwdDiv mb-5` }, [
                        m('span', { class: `body-5 mb-2` }, modifyFPLogic.modifyFlag === 0 ? I18n.$t('10128') /* '资金密码' */ : I18n.$t('10210') /* '新密码' */),
                        m('br'),
                        m(InputWithComponent, {
                            hiddenLine: true,
                            addClass: `my-2`,
                            options: {
                                type: modifyFPView.showPassword2 ? 'text' : 'password',
                                oninput: e => {
                                    modifyFPLogic.newFunPwd = e.target.value;
                                },
                                onblur: () => { modifyFPView.newFunPwdCheck(); },
                                value: modifyFPLogic.newFunPwd
                            },
                            rightComponents: m('i.iconfont.mx-2', {
                                onclick: () => { modifyFPView.showPassword2 = !modifyFPView.showPassword2; },
                                class: modifyFPView.showPassword2 ? 'icon-yincang' : 'icon-zichanzhengyan'
                            })
                        }),
                        m('span', { class: `has-text-tip-error`, style: { display: modifyFPView.tip2IsShow ? `` : `none` } }, modifyFPView.tip2)
                    ]),
                    m('div', { class: `confirmPWdDiv mb-5` }, [
                        m('span', { class: `body-5 mb-2` }, I18n.$t('10211') /* '确认密码' */),
                        m('br'),
                        m(InputWithComponent, {
                            hiddenLine: true,
                            addClass: `my-2`,
                            options: {
                                type: modifyFPView.showPassword3 ? 'text' : 'password',
                                oninput: e => {
                                    modifyFPLogic.confirmFunPwd = e.target.value;
                                },
                                onblur: () => { modifyFPView.confirmFunPwdCheck(); },
                                value: modifyFPLogic.confirmFunPwd
                            },
                            rightComponents: m('i.iconfont.mx-2', {
                                onclick: () => { modifyFPView.showPassword3 = !modifyFPView.showPassword3; },
                                class: modifyFPView.showPassword3 ? 'icon-yincang' : 'icon-zichanzhengyan'
                            })
                        }),
                        m('span', { class: `has-text-tip-error`, style: { display: modifyFPView.tip3IsShow ? `` : `none` } }, modifyFPView.tip3)
                    ]),
                    m('div', { class: `btn mt-7` }, [
                        m('button', { class: `has-bg-primary cursor-pointer`, onclick: () => { modifyFPView.confirmBtn(); } }, I18n.$t('10337') /* '确定' */)
                    ])
                ])
            ]),
            // 修改资金密码提示框
            m(Modal, {
                isShow: modifyFPView.tipModalIsShow, // 弹框显示/隐藏
                slot: { // 插槽
                    header: m('div', {}, [
                        m('div', {}, I18n.$t('10410') /* '提示' */)
                    ]),
                    body: m('div', {}, I18n.$t('10290') /* '资产密码将用于转账、法币交易、红包等功能，请妥善保管，避免泄露. 请不要忘记自己的资产密码，资产密码遗忘后，需要将身份证及个人信息发送至客服邮箱，客服在24小时内处理' */)
                },
                // 弹框确认
                onOk() {
                    modifyFPView.tipModalIsShow = false;
                }
            }),
            modifyFPLogic.isShowVerifyView ? m(VerifyView, {
                close: () => modifyFPLogic.switchSafetyVerifyModal(false),
                isHandleVerify: true,
                title: {
                    logo: config.exchName,
                    text: I18n.$t('10113') /* "安全验证" */
                }
            }) : null
        ]);
    },
    onremove: () => {
        modifyFPLogic.removeFn();
    }
};
module.exports = modifyFPView;