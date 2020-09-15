const m = require('mithril');
require('@/views/page/selfManage/modifyFundPassword/modifyFundPassword.scss');
const modifyFPLogic = require('@/views/page/selfManage/modifyFundPassword/modifyFundPassword.logic');
const I18n = require('@/languages/I18n').default;
// const broadcast = require('@/broadcast/broadcast');
// const VerifyView = require('@/views/components/dialogVerify/dialogVerify.view');
// const config = require('@/config.js');
const Header = require('@/views/components/indexHeader/indexHeader.view');
const InputWithComponent = require('@/views/components/inputWithComponent/inputWithComponent.view');

const modifyFPView = {
    showPassword1: false, /* 是否显示密码 */
    showPassword2: false, /* 是否显示密码 */
    showPassword3: false, /* 是否显示密码 */
    oninit: () => {
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
                    m('span', { class: `has-text-title my-4 ml-4 title-medium` }, I18n.$t('10289') /* '您正在绑定谷歌验证' */)
                ])
            ]),
            m('div', { class: `warning mb-3 pl-7 content-width container` }, [
                m('i', { class: `iconfont icon-Tooltip pr-2 has-text-primary cursor-pointer` }),
                m('span', { class: `has-text-level-3` }, I18n.$t('10290') /* '资产密码将用于转账、法币交易、红包等功能，请妥善保管，避免泄露. 请不要忘记自己的资产密码，资产密码遗忘后，需要将身份证及个人信息发送至客服邮箱，客服在24小时内处理' */)
            ]),
            m('div', { class: `center content-width container has-bg-level-2 margin-LRauto pt-7` }, [
                m('div', { class: `center-content content-width container` }, [
                    m('div', { class: `oldPwdDiv mb-5` }, [
                        m('span', { class: `body-5` }, I18n.$t('10276') /* '原密码' */),
                        m('br'),
                        m(InputWithComponent, {
                            hiddenLine: true,
                            addClass: `mt-2`,
                            options: {
                                type: modifyFPView.showPassword1 ? 'text' : 'password',
                                oninput: e => {
                                    modifyFPLogic.oldFUndPwd = e.target.value;
                                },
                                value: modifyFPLogic.oldFUndPwd
                            },
                            rightComponents: m('i.iconfont.mx-2', {
                                onclick: () => { modifyFPView.showPassword1 = !modifyFPView.showPassword1; },
                                class: modifyFPView.showPassword1 ? 'icon-yincang' : 'icon-zichanzhengyan'
                            })
                        })
                    ]),
                    m('div', { class: `newPwdDiv mb-5` }, [
                        m('span', { class: `body-5 mb-2` }, I18n.$t('10128') /* '资金密码' / '新密码' */),
                        m('br'),
                        m(InputWithComponent, {
                            hiddenLine: true,
                            addClass: `my-2`,
                            options: {
                                type: modifyFPView.showPassword2 ? 'text' : 'password',
                                oninput: e => {
                                    modifyFPLogic.newFunPwd = e.target.value;
                                },
                                // onblur: () => { modifyFPView.newPwdCheck(); },
                                value: modifyFPLogic.newFunPwd
                            },
                            rightComponents: m('i.iconfont.mx-2', {
                                onclick: () => { modifyFPView.showPassword2 = !modifyFPView.showPassword2; },
                                class: modifyFPView.showPassword2 ? 'icon-yincang' : 'icon-zichanzhengyan'
                            })
                        })
                        // m('span', { class: `has-text-tip-error`, style: { display: modifyFPView.oldAndnewIsDifferent ? `` : `none` } }, '新密码与原密码不可相同')
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
                                // onblur: () => { modifyFPView.confirmPWdCheck(); },
                                value: modifyFPLogic.confirmFunPwd
                            },
                            rightComponents: m('i.iconfont.mx-2', {
                                onclick: () => { modifyFPView.showPassword3 = !modifyFPView.showPassword3; },
                                class: modifyFPView.showPassword3 ? 'icon-yincang' : 'icon-zichanzhengyan'
                            })
                        })
                        // m('span', { class: `has-text-tip-error`, style: { display: modifyFPView.pwdIsDifferent ? `` : `none` } }, I18n.$t('10277') /* '密码不一致' */)
                    ]),
                    m('div', { class: `btn mt-7` }, [
                        m('button', { class: `has-bg-primary cursor-pointer` }, I18n.$t('10337') /* '确定' */)
                    ])
                ])
            ])
        ]);
    },
    onremove: () => {
    }
};
module.exports = modifyFPView;