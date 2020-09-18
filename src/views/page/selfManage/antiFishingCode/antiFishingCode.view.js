const m = require('mithril');
require('@/views/page/selfManage/antiFishingCode/antiFishingCode.scss');
const antiFCLogic = require('@/views/page/selfManage/antiFishingCode/antiFishingCode.logic');
const I18n = require('@/languages/I18n').default;
const Header = require('@/views/components/indexHeader/indexHeader.view');
const InputWithComponent = require('@/views/components/inputWithComponent/inputWithComponent.view');
const VerifyView = require('@/views/components/dialogVerify/dialogVerify.view');
const config = require('@/config.js');
const theBindingOrNot = require('@/views/components/theBindingOrNot/theBindingOrNot.view');

const antiFCView = {
    totalFlag: false, /* 是否通过验证 */
    tip1: null, /* 新钓鱼码提示内容 */
    tip2: null, /* 新钓鱼码提示内容 */
    oninit: () => {
        antiFCLogic.initFn();
    },
    /* 校验 */
    check(value, type) {
        const reg = /^[a-z0-9A-Z]{4,20}$/;
        /* 是否为空  */
        if (!value) {
            antiFCView.totalFlag = false;
            antiFCView[type] = I18n.$t('10416'); /* '该字段不能为空' */
            return;
        }
        /* 请输入4-20位字母或数字 */
        if (!reg.test(value)) {
            antiFCView.totalFlag = false;
            antiFCView[type] = I18n.$t('10607'); /* '请输入4-20位字母或数字' */
            return;
        }
        antiFCView[type] = '';
        antiFCView.totalFlag = true;
    },
    /* 新钓鱼码校验是否符合规则 */
    newAntiFishingCodeValueCheck() {
        antiFCView.check(antiFCLogic.newAntiFishingCodeValue, 'tip1');
    },
    /* 钓鱼码校验是否符合规则 */
    antiFishingCodeValueCheck() {
        antiFCView.check(antiFCLogic.antiFishingCodeValue, 'tip2');
    },
    // 确认按钮事件
    confirmBtn: function() {
        if (!antiFCView.totalFlag) {
            // alert("不满足要求");
            return;
        }
        antiFCLogic.confirmBtn();
    },
    view: () => {
        return m('div', { class: `views-page-selfManage-antiFishingCode theme--light pb-7` }, [
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
                    m('span', { class: `has-text-title my-4 ml-4 title-medium` }, antiFCLogic.antiFishCodeFlag === undefined ? I18n.$t('10278') /* '您正在设置防钓鱼码' */ : I18n.$t('10285') /* '您正在修改防钓鱼码' */)
                ])
            ]),
            m('div', { class: `center container content-width has-bg-level-2 pt-7` }, [
                m('div', { class: `leftDiv` }, [
                    m('div', { class: `mb-5` }, [
                        m('span', { class: `body-5 weightSix mb-1` }, I18n.$t('10286') /* '原防钓鱼码' */),
                        m('br'),
                        m('span', { class: `` }, antiFCLogic.antiFishCodeFlag)
                    ]),
                    m('div', { class: `mb-5 ${antiFCLogic.antiFishCodeFlag !== undefined ? `` : `is-hidden`}` }, [
                        m('span', { class: `` }, I18n.$t('10287') /* '新防钓鱼码' */),
                        m(InputWithComponent, {
                            hiddenLine: true,
                            addClass: `mt-2`,
                            options: {
                                oninput: e => {
                                    antiFCLogic.newAntiFishingCodeValue = e.target.value;
                                },
                                onblur: antiFCView.newAntiFishingCodeValueCheck,
                                value: antiFCLogic.newAntiFishingCodeValue
                            }
                        }),
                        m('span', { class: `has-text-tip-error ${antiFCView.tip1 ? `` : `is-hidden`}` }, antiFCView.tip1)
                    ]),
                    m('div', { class: `` }, [
                        m('span', { class: `` },
                            antiFCLogic.antiFishCodeFlag === undefined
                                ? I18n.$t('10232') /* '防钓鱼码' */
                                : I18n.$t('10288') /* '确认新防钓鱼码' */
                        ),
                        m(InputWithComponent, {
                            hiddenLine: true,
                            addClass: `mt-2`,
                            options: {
                                oninput: e => {
                                    antiFCLogic.antiFishingCodeValue = e.target.value;
                                },
                                onblur: antiFCView.antiFishingCodeValueCheck,
                                value: antiFCLogic.antiFishingCodeValue
                            }
                        }),
                        m('span', { class: `has-text-tip-error ${antiFCView.tip2 ? `` : `is-hidden`}` }, antiFCView.tip2)
                    ]),
                    m('div', { class: `mt-8` }, [
                        m('button', { class: `has-bg-primary cursor-pointer`, onclick: () => { antiFCView.confirmBtn(); } }, I18n.$t('10337') /* '确定' */)
                    ])
                ]),
                m('div', { style: `width:140px` }),
                m('div', { class: `rightDiv ${antiFCLogic.antiFishCodeFlag === undefined ? `` : `is-hidden`}` }, [
                    m('div', { class: `` }, [
                        m('span', { class: `body-5 weightSix mb-2` }, I18n.$t('10280') /* '什么是防钓鱼码？' */),
                        m('span', { class: `body-4 mb-7` }, I18n.$t('10281') /* '防钓鱼码是用户设置的一串字符，能够帮助识别仿冒本平台的网站或者邮件' */),
                        m('span', { class: `body-5 weightSix mb-2` }, I18n.$t('10282') /* '防钓鱼码在哪显示？' */),
                        m('span', { class: `body-4` }, I18n.$t('10283') /* '设置好后，每一封本平台发给用户的邮件都会带此串字符。' */)
                    ]),
                    m('img', { class: `mt-7`, src: require(`@/assets/img/selfManage/antiFishCode.svg`).default })
                ])
            ]),
            m(theBindingOrNot),
            antiFCLogic.isShowVerifyView ? m(VerifyView, {
                close: () => antiFCLogic.switchSafetyVerifyModal(false),
                isHandleVerify: true,
                title: {
                    logo: config.exchName,
                    text: I18n.$t('10113') /* "安全验证" */
                }
            }) : null
        ]);
    },
    onremove: antiFCLogic.removeFn
};
module.exports = antiFCView;