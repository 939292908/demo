const m = require('mithril');
require('./index.scss');
const Validate = require('./dialogVerify.logic');
const I18n = require('@/languages/I18n').default;
const utils = require('@/util/utils').default;
const validateModel = require('@/models/validate/validate').default;
const QRCode = require('qrcode');
const config = require('@/config.js');
const { ActiveLine } = require('../../../api/config/index.js');
/**
 * @param: props: {
 *   close: [function|必传] 关闭组件函数
 *   isHandleVerify: [boolean|必传] 显示 [true]安全验证组件 或[false]提示弹框组件
*    title: [object|必传] { 弹框首部title
 *       logo: [string] Vbit,
 *       text: [text|必传]
 *     }
 *   buttonText: [string] 确认按钮文字 ---- 默认为 确定
 *   buttonClick: [function] 按钮确认事件 默认关闭弹框

 *   isLinshiErWeiMa: 临时 app二维码 引导
 *   content: [string] 弹框内容 --- isHandleVerify: false 存在
 *   doubleButton: [boolean] false ---- 底部按钮是否为两个
 *   doubleButtonCof: [
 *      {
 *        text: [string], //按钮文字
 *        click: [function] // 点击事件
 *      }
 *    ]
 *
 * }
 */
const linShiToApp = {
    showErCode: false,
    base64Url: ''
};
module.exports = {
    oninit(vNode) {
        this.handleBase64Url();
        vNode.attrs.isHandleVerify && Validate.oninit();
    },
    onremove(vNode) {
        linShiToApp.showErCode = false;
        vNode.attrs.isHandleVerify && Validate.onremove();
    },
    handlecloseDialog: function () {
        this.props.close();
    },
    headerVnode: function () {
        return m('div.headerPrompt dis-flex', [
            m('div.title-medium', [
                m('div.logotext', this.props.title.logo || config.exchName),
                m('div.promptTitle', this.props.title.text)
            ]),
            m('div.icomBox', { onclick: this.handlecloseDialog.bind(this) }, m('i.iconfont icon-TurnOff'))
        ]);
    },
    handleBase64Url: function () { // 临时 二维码
        QRCode.toDataURL(ActiveLine.WEBSITE + '/m/#/downloadApp', (err, url) => {
            if (!err) linShiToApp.base64Url = url;
        });
    },
    isLinshiErWeiMaVnode: function () { // 临时
        return m('div.mainPrompt', [
            m('div.promptText', this.props.content),
            m('div.butBox', { onclick: () => { linShiToApp.showErCode = !linShiToApp.showErCode; } }, m('button.button  is-fullwidth has-bg-primary', I18n.$t('10395')/* '请前往APP完成' */)),
            linShiToApp.showErCode ? m('div', { style: ' position: absolute; left: 50%; top: 100%; transform: translate(-50%, -1px);border-radius: 2px;width: 152px; height: 160px; padding: 20px 32px; box-sizing: border-box;background-color: #fff;' }, [
                m('img', { src: linShiToApp.base64Url }),
                m('div', 'iOS&Android')
            ]) : null
        ]);
    },
    promptText: function () {
        if (this.props.isLinshiErWeiMa) return this.isLinshiErWeiMaVnode(); // 临时
        return m('div.mainPrompt', [
            m('div.promptText', this.props.content || I18n.$t('10396')/* '已提交提币申请，请前往邮件进行提币确认，邮件确认 后才能进入出金环节。' */),
            !this.props.doubleButton ? m('div.butBox', { onclick: this.props.buttonClick || this.handlecloseDialog.bind(this) }, m('button.button is-fullwidth has-bg-primary', this.props.buttonText || I18n.$t('10415')/* '知道了' */)) : this.doubleButtonVnode()
        ]);
    },
    verifyContentTitle: function () { // 验证 title
        console.log(validateModel.linshiConfig);
        return m('.dis-flex verifyContentTitle', [
            m('.has-text-level-2.body-5.mb-2', [
                Validate.selectName,
                m('span.ml-2.body-2.has-text-level-4', {}, [
                    Validate.selectType === 'sms' && validateModel.smsConfig.securePhone ? `(${utils.hideAccountNameInfo(validateModel.smsConfig.securePhone)})`
                        : Validate.selectType === 'email' && validateModel.emailConfig.secureEmail ? `(${utils.hideAccountNameInfo(validateModel.emailConfig.secureEmail)})`
                            : ''
                ])
            ]),
            Validate.anotherType.length ? m('div.has-text-right.mt-2', {}, [
                m('a.has-text-primary', {
                    onclick: () => { Validate.changeValidate(); }
                }, [Validate.anotherName])
            ]) : null
        ]);
    },
    smsVerifyContent: function () {
        return m('.control has-icons-right', [
            m('input.input', {
                oninput: e => { Validate.code = e.target.value.replace(/[^\d]/g, ''); },
                onkeyup: e => { if (e.keyCode === 13) Validate.check(); },
                maxlength: '6',
                value: Validate.code
            }),
            m('.right-click-but', { onclick: () => { Validate.smsCd <= 0 && Validate.sendSmsCode(); } }, m('div.has-text-primary', Validate.smsCd > 0 ? `${Validate.smsCd} s` : I18n.$t('10117')/* '获取验证码' */))
        ]);
    },
    emailVerifyContent: function () {
        return m('.control has-icons-right', [
            m('input.input', {
                oninput: e => { Validate.code = e.target.value.replace(/[^\d]/g, ''); },
                onkeyup: e => { if (e.keyCode === 13) Validate.check(); },
                maxlength: '6',
                value: Validate.code
            }),
            m('.right-click-but', {
                onclick: () => {
                    Validate.emailCd <= 0 && Validate.sendEmailCode();
                }
            }, m('div', Validate.emailCd > 0 ? `${Validate.emailCd} s` : I18n.$t('10117')/* '获取验证码' */))
        ]);
    },
    doubleButtonVnode: function () {
        return m('div.butBox dis-flex', [
            this.props.doubleButtonCof.map(item => m('div.itemBut', { class: item.issolid ? 'bgBut' : '', onclick: item.click }, item.text))
        ]);
    },
    verifyVnode: function (vNode) {
        const validInput = [];
        validInput.push(this.verifyContentTitle());
        switch (Validate.selectType) {
        case 'sms':
            validInput.push(this.smsVerifyContent());
            break;
        case 'email':
            validInput.push(this.emailVerifyContent());
            break;
        case 'google':
            validInput.push(m('input.input[type=text]', {
                oninput: e => {
                    Validate.code = e.target.value.replace(/[^\d]/g, '');
                },
                onkeyup: e => {
                    if (e.keyCode === 13) Validate.check();
                },
                maxlength: '6',
                value: Validate.code
            }, []));
            break;
        }

        validInput.push(m('div.butBox', { onclick: () => { Validate.check(); } },
            m('button.button is-fullwidth has-bg-primary', {
                class: vNode.attrs.loading ? 'is-loading' : ''
            }, this.props.buttonText || I18n.$t('10337')/* '确定' */)));
        return m('div.mainPrompt', validInput);
    },
    view: function (vNode) {
        this.props = vNode.attrs;
        return m('div.components-dialog-verify', [
            m('div.dialog-content warmPrompt', m('div', [
                vNode.attrs?.title?.text ? this.headerVnode() : null,
                vNode.attrs.isHandleVerify ? this.verifyVnode(vNode) : this.promptText()
            ]))
        ]);
    }
};