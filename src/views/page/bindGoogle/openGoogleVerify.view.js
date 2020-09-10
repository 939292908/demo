const m = require('mithril');
require('@/views/page/bindGoogle/bindGoogle.scss');
const openGLogic = require('@/views/page/bindGoogle/bindGoogle.logic');
const I18n = require('@/languages/I18n').default;
const broadcast = require('@/broadcast/broadcast');
const VerifyView = require('@/views/components/dialogVerify/dialogVerify.view');
const config = require('@/config.js');

const openGView = {
    oninit: () => {
        openGLogic.initFn();

        broadcast.onMsg({
            key: 'views-page-accountSecurity-bindGoogle-open',
            cmd: broadcast.MSG_LANGUAGE_UPD,
            cb: () => {
                openGView.initNav();
            }
        });
        openGView.initNav();
        openGView.checkFlag = 1;
    },
    // 上方导航（下载App，扫描二维码，备份密钥，开启谷歌验证）
    nav: [],
    // 当前选中哪个步骤
    checkFlag: 2,
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
    // 上一步 下一步
    modifyCheckFlag(type) {
        type === 'prev' ? openGView.checkFlag = openGView.checkFlag - 1 : openGView.checkFlag = openGView.checkFlag + 1;
    },
    // 复制文字
    copyText(type) {
        let ele;
        if (type === 'one') {
            ele = document.getElementsByClassName('keyText')[0];
        } else if (type === 'two') {
            ele = document.getElementsByClassName('keyText')[1];
        }
        // 选择对象
        ele.select();
        document.execCommand("copy", false, null);
        return window.$message({ title: I18n.$t('10410') /* '提示' */, content: I18n.$t('10546') /* '复制成功' */, type: 'success' });
    },
    view: () => {
        return m('div', { class: `views-page-accountSecurity-bindGoogle-open theme--light pb-8` }, [
            m('div', { class: `operation mb-7 has-bg-level-2` }, [
                m('div', { class: `content-width container` }, [
                    m('i', { class: `iconfont icon-Return has-text-title` }),
                    m('span', { class: `has-text-title my-4 ml-4 title-medium` }, I18n.$t('10250') /* '您正在绑定谷歌验证' */)
                ])
            ]),
            m('div', { class: `center content-width has-bg-level-2 margin-LRauto` }, [
                m('div', { class: `center-top mt-7` }, [
                    openGView.nav.map(item => {
                        return m('div', { class: `column my-7 pb-7 ` + (item.id <= openGView.checkFlag ? 'is-active has-text-primary  has-line-primary' : ''), key: item.id }, [
                            m('span', { class: `title-small` }, item.id),
                            m('span', { class: `body-5` }, item.title)
                        ]);
                    })
                ]),
                m('div', { class: `center-center` }, [
                    m('div', { class: `stepOne pt-7`, style: { display: (openGView.checkFlag === 1 ? '' : 'none') } }, [
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
                    m('div', { class: `stepTwo pt-7`, style: { display: (openGView.checkFlag === 2 ? '' : 'none') } }, [
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
                    m('div', { class: `stepThree pt-7`, style: { display: (openGView.checkFlag === 3 ? '' : 'none') } }, [
                        m('div', { class: `mb-1` }, I18n.$t('10257') + `!` /* '请妥善保管好该密钥，以免丢失' */),
                        m('div', { class: `mb-7` }, I18n.$t('10260') /* '如果该密钥丢失，需要联系客服处理，这通常需要一定的时间' */),
                        m('div', { class: `key` }, [
                            m('input', { class: `keyText title-small`, type: 'text', readOnly: `readOnly`, value: openGLogic.secret }),
                            m('i', { class: `iconfont icon-copy has-text-primary`, onclick: () => { openGView.copyText('two'); } })
                        ])
                    ]),
                    m('div', { class: `stepFour pt-7`, style: { display: (openGView.checkFlag === 4 ? '' : 'none') } }, [
                        m('div', { class: `desc1 title-small mb-7` }, I18n.$t('10261') /* '完成以下验证，开启谷歌验证' */),
                        m('div', { class: `pwdDiv margin-LRauto` }, [
                            m('span', { class: `body-5` }, I18n.$t('10512') /* '登录密码' */),
                            m('br'),
                            m('input', { class: `border-radius-small mb-5 mt-2 pwd has-line-level-3`, type: `password`, oninput: function() { openGLogic.check('pwd', this.value); } })
                        ]),
                        m('div', { class: `codeDiv margin-LRauto` }, [
                            m('span', { class: `body-5 mb-2` }, I18n.$t('10119') /* '谷歌验证码' */),
                            m('br'),
                            m('input', { class: `border-radius-small mt-2 code has-line-level-3`, type: `text`, oninput: function() { openGLogic.check('code', this.value); } })
                        ]),
                        m('div', { class: `tips mt-3` }, [
                            m('span', { class: ``, style: { display: openGLogic.pwdTipFlag ? `` : `none` } }, '登录密码错误请重新输入!'),
                            m('span', { class: ``, style: { display: openGLogic.codeTipFlag ? `` : `none` } }, '谷歌验证码输入错误或已过期，请重新输入!')
                        ]),
                        m('div', { class: `btn mt-3 margin-LRauto` }, [
                            m('button', { class: `has-bg-primary cursor-pointer`, onclick: () => { openGLogic.confirmBtn('bind'); } }, I18n.$t('10337') /* '确定' */)
                        ])
                    ])
                ]),
                m('div', { class: `center-btn px-7`, style: { display: (openGView.checkFlag !== 4 ? '' : 'none') } }, [
                    m('button', {
                        class: `prev mt-6 border-radius-small cursor-pointer has-bg-level-2 has-line-primary px-4 py-2`,
                        style: { display: (openGView.checkFlag === 1 || openGView.checkFlag === 4 ? 'none' : '') },
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
    }
};
module.exports = openGView;