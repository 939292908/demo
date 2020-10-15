const m = require('mithril');
require('@/views/page/selfManage/bindGoogle/bindGoogle.scss');
const closeGLogic = require('@/views/page/selfManage/bindGoogle/bindGoogle.logic');
const I18n = require('@/languages/I18n').default;
const VerifyView = require('@/views/components/dialogVerify/dialogVerify.view');
const config = require('@/config.js');
const header = require('@/views/page/selfManage/header/header');
const Title = require('../goBackTitle/goBackTitle.view');
const InputWithComponent = require('@/views/components/inputWithComponent/inputWithComponent.view');

const closeGView = {
    oninit: () => {
        closeGLogic.currentOperation = 'unbind';
        closeGLogic.initFn();
    },
    view: () => {
        return m('div', { class: `views-page-accountSecurity-bindGoogle-close theme--light pb-7` }, [
            m(header),
            m(Title, { title: I18n.$t('10262') /* '您正在解绑谷歌验证' */ }),
            m('div.mt-7', { class: `center content-width margin-LRauto` }, [
                m('div', { class: `warning mb-3 pl-7` }, [
                    m('i', { class: `iconfont icon-Tooltip pr-2 has-text-primary cursor-pointer` }),
                    m('span', { class: `has-text-level-3` }, I18n.$t('10263') /* '出于安全考虑，修改账户安全项之后，24h内禁止提币' */)
                ]),
                m('div', { class: `closeOperation pt-8 has-bg-level-2` }, [
                    m('div', { class: `pwdDiv margin-LRauto mb-5` }, [
                        m('span', { class: `body-5` }, I18n.$t('10512') /* '登录密码' */),
                        m('br'),
                        m(InputWithComponent, {
                            hiddenLine: true,
                            addClass: `mt-2`,
                            options: {
                                type: closeGLogic.showPassword ? 'text' : 'password',
                                oninput: e => {
                                    closeGLogic.LcPWd = e.target.value;
                                },
                                onblur: () => { closeGLogic.LcPWdCheck(); },
                                value: closeGLogic.LcPWd
                            },
                            rightComponents: m('i.iconfont.mx-2', {
                                onclick: () => { closeGLogic.showPassword = !closeGLogic.showPassword; },
                                class: closeGLogic.showPassword ? 'icon-yincang' : 'icon-zichanzhengyan'
                            })
                        }),
                        m('span', { class: `has-text-tip-error`, style: { display: closeGLogic.tip1 ? `` : `none` } }, closeGLogic.tip1)
                    ]),
                    m('div', { class: `codeDiv margin-LRauto` }, [
                        m('span', { class: `body-5 mb-2` }, I18n.$t('10264') /* '原谷歌验证码' */),
                        m('br'),
                        m(InputWithComponent, {
                            hiddenLine: true,
                            addClass: `mt-2`,
                            options: {
                                oninput: e => {
                                    closeGLogic.LcCode = e.target.value;
                                },
                                onblur: () => { closeGLogic.LcCodeCheck(); },
                                value: closeGLogic.LcCode,
                                maxlength: 6
                            }
                        }),
                        m('span', { class: `has-text-tip-error`, style: { display: closeGLogic.tip2 ? `` : `none` } }, closeGLogic.tip2)
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
        closeGLogic.removeFn();
    }
};
module.exports = closeGView;
