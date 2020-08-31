const m = require('mithril');
require('./index.scss');
const InputWithComponent = require('../inputWithComponent/inputWithComponent.view.js');
const Validate = require('./dialogVerify.logic');
const I18n = require('@/languages/I18n').default;

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

module.exports = {
    oninit(vNode) {
        console.log(vNode);
        vNode.attrs.isHandleVerify && Validate.oninit();
    },
    onremove(vNode) {
        vNode.attrs.isHandleVerify && Validate.onremove();
    },
    handlecloseDialog: function () {
        this.props.close();
    },
    headerVnode: function () {
        return m('div.headerPrompt dis-flex', [
            m('div.title-medium', [
                m('div.logotext', this.props.title.logo || 'Vbit'),
                m('div.promptTitle', this.props.title.text)
            ]),
            m('div', { onclick: this.handlecloseDialog.bind(this) }, m('i.iconfont icon-TurnOff'))
        ]);
    },
    promptText: function () {
        return m('div.mainPrompt', [
            m('div.promptText', this.props.content || '已提交提币申请，请前往邮件进行提币确认，邮件确认 后才能进入出金环节。'),
            !this.props.doubleButton ? m('div.butBox', { onclick: this.props.buttonClick || this.handlecloseDialog.bind(this) }, m('button.button is-info is-fullwidth', this.props.buttonText || '知道了')) : this.doubleButtonVnode()
        ]);
    },
    verifyContentTitle: function () { // 验证 title
        return m('.dis-flex verifyContentTitle', [
            m('.has-text-level-2.body-3.mb-2', Validate.selectName),
            Validate.anotherType.length && m('div.has-text-right.mt-2', {}, [
                m('a.has-text-primary', {
                    onclick: () => { Validate.changeValidate(); }
                }, [Validate.anotherName])
            ])
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
            m('.right-click-but', { onclick: () => { Validate.smsCd <= 0 && Validate.sendSmsCode(); } }, m('div', Validate.smsCd > 0 ? `${Validate.smsCd}` : I18n.$t('10214')/* '获取验证码' */))
        ]);
    },
    doubleButtonVnode: function () {
        return m('div.butBox dis-flex', [
            m('div.itemBut', '谷歌验证'),
            m('div.itemBut bgBut', '手机验证')
        ]);
    },
    verifyVnode: function () {
        const validInput = [];
        validInput.push(this.verifyContentTitle());
        switch (Validate.selectType) {
        case 'sms':
            validInput.push(this.smsVerifyContent());
            break;
        case 'email':
            validInput.push(m(InputWithComponent, {
                options: {
                    oninput: e => {
                        Validate.code = e.target.value.replace(/[^\d]/g, '');
                    },
                    onkeyup: e => {
                        if (e.keyCode === 13) Validate.check();
                    },
                    maxlength: '6',
                    value: Validate.code
                },
                rightComponents: m('a.body-1.views-page-login-send-code.px-2',
                    {
                        onclick: () => {
                            if (Validate.emailCd > 0) return;
                            Validate.sendEmailCode();
                        }
                    }, [Validate.emailCd > 0 ? `${Validate.emailCd}` : I18n.$t('10214')/* '获取验证码' */])
            }));
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

        validInput.push(m('div.butBox', { onclick: () => { Validate.check(); } }, m('button.button is-info is-fullwidth', this.props.buttonText || '确定')));
        return m('div.mainPrompt', validInput);
    },
    view: function (vNode) {
        this.props = vNode.attrs;
        return m('div.components-dialog-verify', [
            m('div.dialog-content warmPrompt', m('div', [
                vNode.attrs?.title?.text ? this.headerVnode() : null,
                vNode.attrs.isHandleVerify ? this.verifyVnode() : this.promptText()
            ]))
        ]);
    }
};