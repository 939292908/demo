const m = require('mithril');
require('@/views/page/selfManage/bindGoogle/bindGoogle.scss');
const openGLogic = require('@/views/page/selfManage/bindGoogle/bindGoogle.logic');
const I18n = require('@/languages/I18n').default;
const broadcast = require('@/broadcast/broadcast');
const VerifyView = require('@/views/components/dialogVerify/dialogVerify.view');
const config = require('@/config.js');
const Header = require('@/views/components/indexHeader/indexHeader.view');
const InputWithComponent = require('@/views/components/inputWithComponent/inputWithComponent.view');

const openGView = {
    // totalFlag: false, /* 是否满足校验  默认false不满足 */
    showPassword1: false, /* 是否显示登录密码 */
    oninit: () => {
        openGLogic.currentOperation = 'bind';
        openGLogic.initFn();

        broadcast.onMsg({
            key: 'views-page-accountSecurity-bindGoogle-open',
            cmd: broadcast.MSG_LANGUAGE_UPD,
            cb: () => {
                openGView.initNav();
            }
        });
        openGView.initNav();
        openGView.checkFlag = 1; /* 步驟初始化 */
    },
    nav: [], /* 导航（下载App，扫描二维码，备份密钥，开启谷歌验证） */
    checkFlag: 1, /* 当前选中哪个步骤 */
    myWidth: 25, /* '进度'使用百分比 */
    initNav() {
        openGView.nav = [
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
            openGView.checkFlag = openGView.checkFlag - 1;
            openGView.myWidth = openGView.myWidth - 25;
        } else {
            openGView.checkFlag = openGView.checkFlag + 1;
            openGView.myWidth = openGView.myWidth + 25;
        }
    },
    copyText(type) { /* 复制文字 */
        let ele;
        type === 'one' ? ele = document.getElementsByClassName('keyText')[0] : ele = document.getElementsByClassName('keyText')[1];
        ele.select(); /* 选择对象 */
        document.execCommand("copy", false, null);
        return window.$message({ title: I18n.$t('10410') /* '提示' */, content: I18n.$t('10546') /* '复制成功' */, type: 'success' });
    },
    view: () => {
        return m('div', { class: `views-page-accountSecurity-bindGoogle-open theme--light pb-8` }, [
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
                    m('span', { class: `has-text-title my-4 ml-4 title-medium` }, I18n.$t('10250') /* '您正在绑定谷歌验证' */)
                ])
            ]),
            m('div', { class: `center content-width has-bg-level-2 margin-LRauto` }, [
                m('div', { class: `center-top` }, [
                    openGView.nav.map(item => {
                        return m('div', { class: `column my-7 ${item.id <= openGView.checkFlag ? `has-text-primary` : `has-line-level-4`}`, key: item.id }, [
                            m('span', { class: `title-small` }, item.id),
                            m('span', { class: `body-5` }, item.title)
                        ]);
                    })
                ]),
                m('div', { class: `my-progress has-bg-sub-level-2`, style: { width: `${openGView.myWidth}%` } }),
                m('div', { class: `center-center` }, [
                    m('div', { class: `stepOne pt-7`, style: { display: `${openGView.checkFlag === 1 ? `` : `none`}` } }, [
                        m('div', { class: `desc1 body-5 mb-3` }, I18n.$t('10255') /* '下载谷歌验证器' */),
                        m('div', { class: `desc2 body-5` }, I18n.$t('10511') /* '扫码下载或者在应用商店中搜索“Google Authentication”应用' */),
                        m('div', { class: `stepOne-qrcode mt-6` }, [
                            m('div', { class: `stepOne-qrcode-left mr-8` }, [
                                m('div', { class: `qrcodeIOS mb-3` }, [
                                    m('img', { class: ``, src: openGLogic.IOSDLAddQrCodeSrc })
                                ]),
                                m('span', {}, 'IOS')
                            ]),
                            m('div', { class: `stepOne-qrcode-right` }, [
                                m('div', { class: `qrcodeAndroid mb-3` }, [
                                    m('img', { class: ``, src: openGLogic.AndroidDLAddQrCodeSrc })
                                ]),
                                m('span', {}, 'Android')
                            ])
                        ])
                    ]),
                    m('div', { class: `stepTwo pt-8`, style: { display: `${openGView.checkFlag === 2 ? `` : `none`}` } }, [
                        m('div', { class: `desc1 body-5` }, I18n.$t('10256') /* '使用谷歌验证App扫描以下二维码' */),
                        m('div', { class: `stepTwo-qrcode my-7 margin-LRauto` }, [
                            m('img', { class: ``, src: openGLogic.secretQrCodeSrc })
                        ]),
                        m('div', { class: `desc2 body-5 mb-3 has-text-level-4` }, I18n.$t('10257') /* '如果您无法扫描这个二维码，请在App中手动输入这串字符' */),
                        m('div', { class: `key` }, [
                            m('input', { class: `keyText title-small`, type: 'text', readOnly: `readOnly`, value: openGLogic.secret }),
                            m('i', { class: `iconfont icon-copy has-text-primary cursor-pointer`, onclick: () => { openGView.copyText('one'); } })
                        ])
                    ]),
                    m('div', { class: `stepThree pt-8`, style: { display: `${openGView.checkFlag === 3 ? `` : `none`}` } }, [
                        m('div', { class: `mb-1` }, `密钥用于遗失谷歌验证器时找回绑定的谷歌验证，绑定前请务必将该密钥备份保存`),
                        m('div', { class: `mb-7 has-text-level-4` }, I18n.$t('10260') /* '如果该密钥丢失，需要联系客服处理，这通常需要一定的时间' */),
                        m('div', { class: `key` }, [
                            m('input', { class: `keyText title-small`, type: 'text', readOnly: `readOnly`, value: openGLogic.secret }),
                            m('i', { class: `iconfont icon-copy has-text-primary`, onclick: () => { openGView.copyText('two'); } })
                        ])
                    ]),
                    m('div', { class: `stepFour pt-7`, style: { display: `${openGView.checkFlag === 4 ? `` : `none`}` } }, [
                        m('div', { class: `desc1 title-small mb-7` }, I18n.$t('10261') /* '完成以下验证，开启谷歌验证' */),
                        m('div', { class: `pwdDiv margin-LRauto mb-5` }, [
                            m('span', { class: `body-5` }, I18n.$t('10512') /* '登录密码' */),
                            m('br'),
                            m(InputWithComponent, {
                                hiddenLine: true,
                                addClass: `mt-2`,
                                options: {
                                    type: openGView.showPassword1 ? 'text' : 'password',
                                    oninput: e => {
                                        openGLogic.openLcPWd = e.target.value;
                                    },
                                    value: openGLogic.openLcPWd
                                },
                                rightComponents: m('i.iconfont.mx-2', {
                                    onclick: () => { openGView.showPassword1 = !openGView.showPassword1; },
                                    class: openGView.showPassword1 ? 'icon-yincang' : 'icon-zichanzhengyan'
                                })
                            })
                        ]),
                        m('div', { class: `codeDiv margin-LRauto mb-8` }, [
                            m('span', { class: `body-5 mb-2` }, I18n.$t('10119') /* '谷歌验证码' */),
                            m('br'),
                            m(InputWithComponent, {
                                hiddenLine: true,
                                options: {
                                    addClass: `mt-2`,
                                    oninput: e => {
                                        openGLogic.openLcCode = e.target.value;
                                    },
                                    value: openGLogic.openLcCode
                                }
                            })
                        ]),
                        /* m('div', { class: `tips mt-3` }, [
                            m('span', { class: ``, style: { display: openGLogic.pwdTipFlag ? `` : `none` } }, '登录密码错误请重新输入!'),
                            m('span', { class: ``, style: { display: openGLogic.codeTipFlag ? `` : `none` } }, '谷歌验证码输入错误或已过期，请重新输入!')
                        ]), */
                        m('div', { class: `btn mt-3 margin-LRauto` }, [
                            m('button', { class: `has-bg-primary cursor-pointer`, onclick: () => { openGLogic.confirmBtn(); } }, I18n.$t('10337') /* '确定' */)
                        ])
                    ])
                ]),
                m('div', { class: `center-btn px-7` }, [
                    m('button', {
                        class: `prev mt-6 border-radius-small cursor-pointer has-bg-level-2 has-line-primary px-4 py-2`,
                        style: { display: (openGView.checkFlag === 1 ? 'none' : '') },
                        onclick: () => { openGView.modifyCheckFlag('prev'); }
                    }, I18n.$t('10258') /* '上一步' */),
                    m('button', {
                        class: `next mt-6 has-bg-primary border-radius-small cursor-pointer px-4 py-2`,
                        style: { display: (openGView.checkFlag === 4 ? 'none' : '') },
                        onclick: () => { openGView.modifyCheckFlag('next'); }
                    }, I18n.$t('10206') /* '下一步') */)
                ])
            ]),
            openGLogic.isShowVerifyView ? m(VerifyView, {
                close: () => openGLogic.switchSafetyVerifyModal(false),
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
        openGLogic.removeFn();
    }
};
module.exports = openGView;