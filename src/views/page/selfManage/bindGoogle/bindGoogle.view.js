const m = require('mithril');
require('@/views/page/selfManage/bindGoogle/bindGoogle.scss');
const googleLogic = require('@/views/page/selfManage/bindGoogle/bindGoogle.logic');
const I18n = require('@/languages/I18n').default;
const broadcast = require('@/broadcast/broadcast');
const VerifyView = require('@/views/components/dialogVerify/dialogVerify.view');
const config = require('@/config.js');
const header = require('@/views/page/selfManage/header/header');
const Title = require('../goBackTitle/goBackTitle.view');
const InputWithComponent = require('@/views/components/inputWithComponent/inputWithComponent.view');

const googleView = {
    oninit: () => {
        googleLogic.initFn();
        broadcast.onMsg({
            key: 'views-page-accountSecurity-bindGoogle-open',
            cmd: broadcast.MSG_LANGUAGE_UPD,
            cb: () => {
                googleView.initNav();
            }
        });
        googleView.initNav();
        googleView.checkFlag = 1; /* 步驟初始化 */
        googleView.myWidth = 25; /* '进度'初始化 */
    },
    nav: [], /* 导航（下载App，扫描二维码，备份密钥，开启谷歌验证） */
    checkFlag: 1, /* 当前选中哪个步骤 */
    myWidth: 25, /* '进度'使用百分比 */
    initNav() {
        googleView.nav = [
            {
                id: 1,
                title: I18n.$t('10251') /* '下载APP' */
            },
            {
                id: 2,
                title: I18n.$t('10252') /* '扫描二维码' */
            },
            {
                id: 3,
                title: I18n.$t('10253') /* '备份密钥' */
            },
            {
                id: 4,
                title: I18n.$t('10510') /* '开启谷歌验证' */
            }
        ];
    },
    modifyCheckFlag(type) { /* 上一步 下一步 */
        if (type === 'prev') {
            /* 初始化 start */
            googleLogic.LcCode = '';
            googleLogic.LcPWd = '';
            googleLogic.tip1 = '';
            googleLogic.tip2 = '';
            /* 初始化 end */

            googleView.checkFlag = googleView.checkFlag - 1;
            googleView.myWidth = googleView.myWidth - 25;
        } else {
            googleView.checkFlag = googleView.checkFlag + 1;
            googleView.myWidth = googleView.myWidth + 25;
        }
    },
    copyText() { /* 复制文字 */
        var div = document.getElementsByClassName('keyText')[0];
        if (this.rechargeAddr !== '') {
            if (document.body.createTextRange) {
                const range = document.body.createTextRange();
                range.moveToElementText(div);
                range.select();
            } else if (window.getSelection) {
                var selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(div);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                console.warn("none");
            }
            document.execCommand("Copy"); // 执行浏览器复制命令
            return window.$message({ title: I18n.$t('10410') /* '提示' */, content: I18n.$t('10546') /* '复制成功' */, type: 'success' });
        }
    },
    view: () => {
        return m('div', { class: `views-page-accountSecurity-bindGoogle theme--light pb-8` }, [
            m(header),
            m(Title, { title: googleLogic.currentOperation === 'bind' ? I18n.$t('10250') /* '您正在绑定谷歌验证' */ : I18n.$t('10262') /* '您正在解绑谷歌验证' */ }),
            googleLogic.currentOperation === 'bind'
                ? m('div', { class: `views-page-accountSecurity-bindGoogle-open` }, [
                    m('div.mt-7', { class: `center content-width has-bg-level-2 margin-LRauto` }, [
                        m('div', { class: `center-top` }, [
                            googleView.nav.map(item => {
                                return m('div', { class: `column my-7 ${item.id <= googleView.checkFlag ? `has-text-primary` : `has-line-level-4`}`, key: item.id }, [
                                    m('span', { class: `title-small` }, item.id),
                                    m('span', { class: `body-5` }, item.title)
                                ]);
                            })
                        ]),
                        m('div', { class: `my-progress has-bg-sub-level-2`, style: { width: `${googleView.myWidth}%` } }),
                        m('div', { class: `center-center` }, [
                            m('div', { class: `stepOne pt-7`, style: { display: `${googleView.checkFlag === 1 ? `` : `none`}` } }, [
                                m('div', { class: `desc1 body-5 mb-3 weightSix` }, I18n.$t('10255') /* '下载谷歌验证器' */),
                                m('div', { class: `desc2 body-5` }, I18n.$t('10511') /* '扫码下载或者在应用商店中搜索“Google Authentication”应用' */),
                                m('div', { class: `stepOne-qrcode mt-6` }, [
                                    m('div', { class: `stepOne-qrcode-left mr-8` }, [
                                        m('div', { class: `qrcodeIOS mb-3` }, [
                                            m('img', { class: ``, src: googleLogic.IOSDLAddQrCodeSrc })
                                        ]),
                                        m('span', {}, 'IOS')
                                    ]),
                                    m('div', { class: `stepOne-qrcode-right` }, [
                                        m('div', { class: `qrcodeAndroid mb-3` }, [
                                            m('img', { class: ``, src: googleLogic.AndroidDLAddQrCodeSrc })
                                        ]),
                                        m('span', {}, 'Android')
                                    ])
                                ])
                            ]),
                            m('div', { class: `stepTwo pt-8`, style: { display: `${googleView.checkFlag === 2 ? `` : `none`}` } }, [
                                m('div', { class: `desc1 body-5 weightSix` }, I18n.$t('10256') /* '使用谷歌验证App扫描以下二维码' */),
                                m('div', { class: `stepTwo-qrcode my-7 margin-LRauto` }, [
                                    m('img', { class: ``, src: googleLogic.secretQrCodeSrc })
                                ]),
                                m('div', { class: `desc2 body-5 mb-3 has-text-level-4` }, I18n.$t('10257') /* '如果您无法扫描这个二维码，请在App中手动输入这串字符' */),
                                m('div', { class: `key` }, [
                                    m('div', { class: `keyText title-small mr-1` }, googleLogic.secret),
                                    m('i', { class: `iconfont icon-copy has-text-primary cursor-pointer`, onclick: () => { googleView.copyText(); } })
                                ])
                            ]),
                            m('div', { class: `stepThree pt-8`, style: { display: `${googleView.checkFlag === 3 ? `` : `none`}` } }, [
                                m('div', { class: `mb-1 weightSix` }, I18n.$t('10597') /* `密钥用于遗失谷歌验证器时找回绑定的谷歌验证，绑定前请务必将该密钥备份保存` */),
                                m('div', { class: `mb-7 has-text-level-4` }, I18n.$t('10260') /* '如果该密钥丢失，需要联系客服处理，这通常需要一定的时间' */),
                                m('div', { class: `key` }, [
                                    m('div', { class: `keyText title-small mr-1` }, googleLogic.secret),
                                    m('i', { class: `iconfont icon-copy has-text-primary cursor-pointer`, onclick: () => { googleView.copyText(); } })
                                ])
                            ]),
                            m('div', { class: `stepFour pt-7`, style: { display: `${googleView.checkFlag === 4 ? `` : `none`}` } }, [
                                m('div', { class: `desc1 title-small mb-7` }, I18n.$t('10603') /* '完成以下验证，开启谷歌验证' */),
                                m('div', { class: `pwdDiv margin-LRauto mb-5` }, [
                                    m('span', { class: `body-5` }, I18n.$t('10512') /* '登录密码' */),
                                    m('br'),
                                    m(InputWithComponent, {
                                        hiddenLine: true,
                                        addClass: `mt-2`,
                                        options: {
                                            type: googleLogic.showPassword ? 'text' : 'password',
                                            oninput: e => {
                                                googleLogic.LcPWd = e.target.value;
                                            },
                                            onblur: () => { googleLogic.LcPWdCheck(); },
                                            value: googleLogic.LcPWd
                                        },
                                        rightComponents: m('i.iconfont.mx-2', {
                                            onclick: () => { googleLogic.showPassword = !googleLogic.showPassword; },
                                            class: googleLogic.showPassword ? 'icon-yincang' : 'icon-zichanzhengyan'
                                        })
                                    }),
                                    m('span', { class: `has-text-tip-error`, style: { display: googleLogic.tip1 ? `` : `none` } }, googleLogic.tip1)
                                ]),
                                m('div', { class: `codeDiv margin-LRauto mb-8` }, [
                                    m('span', { class: `body-5 mb-2` }, I18n.$t('10119') /* '谷歌验证码' */),
                                    m('br'),
                                    m(InputWithComponent, {
                                        hiddenLine: true,
                                        options: {
                                            addClass: `mt-2`,
                                            oninput: e => {
                                                googleLogic.LcCode = e.target.value;
                                            },
                                            onblur: () => { googleLogic.LcCodeCheck(); },
                                            value: googleLogic.LcCode,
                                            maxlength: 6
                                        }
                                    }),
                                    m('span', { class: `has-text-tip-error`, style: { display: googleLogic.tip2 ? `` : `none` } }, googleLogic.tip2)
                                ]),
                                m('div', { class: `btn mt-3 margin-LRauto` }, [
                                    m('button', { class: `has-bg-primary cursor-pointer`, onclick: () => { googleLogic.confirmBtn(); } }, I18n.$t('10337') /* '确定' */)
                                ])
                            ])
                        ]),
                        m('div', { class: `center-btn px-7` }, [
                            m('button', {
                                class: `prev mt-6 border-radius-small cursor-pointer has-bg-level-2 has-line-primary px-4 py-2`,
                                style: { display: (googleView.checkFlag === 1 ? 'none' : '') },
                                onclick: () => { googleView.modifyCheckFlag('prev'); }
                            }, I18n.$t('10258') /* '上一步' */),
                            m('button', {
                                class: `next mt-6 has-bg-primary border-radius-small cursor-pointer px-4 py-2`,
                                style: { display: (googleView.checkFlag === 4 ? 'none' : '') },
                                onclick: () => { googleView.modifyCheckFlag('next'); }
                            }, I18n.$t('10206') /* '下一步') */)
                        ])
                    ])
                ])
                : m('div', { class: `views-page-accountSecurity-bindGoogle-close` }, [
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
                                        type: googleLogic.showPassword ? 'text' : 'password',
                                        oninput: e => {
                                            googleLogic.LcPWd = e.target.value;
                                        },
                                        onblur: () => { googleLogic.LcPWdCheck(); },
                                        value: googleLogic.LcPWd
                                    },
                                    rightComponents: m('i.iconfont.mx-2', {
                                        onclick: () => { googleLogic.showPassword = !googleLogic.showPassword; },
                                        class: googleLogic.showPassword ? 'icon-yincang' : 'icon-zichanzhengyan'
                                    })
                                }),
                                m('span', { class: `has-text-tip-error`, style: { display: googleLogic.tip1 ? `` : `none` } }, googleLogic.tip1)
                            ]),
                            m('div', { class: `codeDiv margin-LRauto` }, [
                                m('span', { class: `body-5 mb-2` }, I18n.$t('10264') /* '原谷歌验证码' */),
                                m('br'),
                                m(InputWithComponent, {
                                    hiddenLine: true,
                                    addClass: `mt-2`,
                                    options: {
                                        oninput: e => {
                                            googleLogic.LcCode = e.target.value;
                                        },
                                        onblur: () => { googleLogic.LcCodeCheck(); },
                                        value: googleLogic.LcCode,
                                        maxlength: 6
                                    }
                                }),
                                m('span', { class: `has-text-tip-error`, style: { display: googleLogic.tip2 ? `` : `none` } }, googleLogic.tip2)
                            ]),
                            m('div', { class: `btn mt-8 margin-LRauto` }, [
                                m('button', { class: `has-bg-primary cursor-pointer`, onclick: () => { googleLogic.confirmBtn(); } }, I18n.$t('10337') /* '确定' */)
                            ])
                        ])
                    ])
                ]),
            googleLogic.isShowVerifyView ? m(VerifyView, {
                close: () => googleLogic.switchSafetyVerifyModal(false),
                isHandleVerify: true,
                title: {
                    logo: config.exchName,
                    text: I18n.$t('10113') /* "安全验证" */
                }
            }) : null
        ]);
    },
    onremove: () => {
        broadcast.offMsg({
            key: 'views-page-accountSecurity-bindGoogle-open',
            cmd: broadcast.MSG_LANGUAGE_UPD,
            isall: true
        });
        googleLogic.removeFn();
    }
};
module.exports = googleView;
