const m = require('mithril');
require('./index.scss');
const close = require('./Failure.png').default;
const InputWithComponent = require('@/pages/components/inputWithComponent/inputWithComponentView');
const Validate = require('./validateModel');
const I18n = require('@/languages/I18n').default;

/**
 * @param: props: {
 *   close: [function] 关闭组件函数
 *   isHandleVerify: [boolean] 显示 [true]安全验证组件 或[false]提示弹框组件
*     title: [string] 弹框首部title --- 默认为 温馨提示
*     content: [string] 弹框内容 --- isHandleVerify: false 存在
*     buttonText: [string] 确认按钮文字 ---- 默认为 确定
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
                m('div.logotext', 'Vbit'),
                m('div.promptTitle', this.props.promptConfig?.title || '温馨提示')
            ]),
            m('div', { onclick: this.handlecloseDialog.bind(this) }, m('img', { src: close }))
        ]);
    },
    promptText: function () {
        return m('div.mainPrompt', [
            m('div.promptText', '已提交提币申请，请前往邮件进行提币确认，邮件确认 后才能进入出金环节。'),
            m('div.butBox', { onclick: this.handlecloseDialog.bind(this) }, m('button.button is-info is-fullwidth', this.props.promptConfig?.buttonText || '知道了'))
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

        validInput.push(m('div.butBox', { onclick: () => { Validate.check(); } }, m('button.button is-info is-fullwidth', this.props.promptConfig?.buttonText || '确定')));
        return m('div.mainPrompt', validInput);
    },
    view: function (vNode) {
        this.props = vNode.attrs;
        return m('div.components-dialog-verify', [
            m('div.dialog-content warmPrompt', m('div', [
                this.headerVnode(),
                vNode.attrs.isHandleVerify ? this.verifyVnode() : this.promptText()
            ]))
        ]);
    }
};