const m = require('mithril');
require('./index.scss');
const close = require('./Failure.png').default;
const InputWithComponent = require('@/pages/components/inputWithComponent/inputWithComponentView');
const Validate = require('./validateModel');
const I18n = require('@/languages/I18n').default;
module.exports = {
    oninit() {
        Validate.oninit();
    },
    onremove() {
        Validate.onremove();
    },
    handlecloseDialog: function () {
        this.props.close();
    },
    headerVnode: function () {
        return m('div.headerPrompt dis-flex', [
            m('div.title-medium', [
                m('div.logotext', 'Vbit'),
                m('div.promptTitle', '温馨提示')
            ]),
            m('div', { onclick: this.handlecloseDialog.bind(this) }, m('img', { src: close }))
        ]);
    },
    promptText: function () {
        return m('div.mainPrompt', [
            m('div.promptText', '已提交提币申请，请前往邮件进行提币确认，邮件确认 后才能进入出金环节。'),
            m('div.butBox', { onclick: this.handlecloseDialog.bind(this) }, m('button.button is-info is-fullwidth', '知道了'))
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
            m('.right-click-but', { onclick: () => { Validate.smsCd <= 0 && Validate.sendSmsCode(); } }, Validate.smsCd > 0 ? `${Validate.smsCd}` : I18n.$t('10214')/* '获取验证码' */)
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

        validInput.push(m('div.butBox', { onclick: () => { Validate.check(); } }, m('button.button is-info is-fullwidth', '确定')));
        return m('div.mainPrompt', validInput);
    },
    view: function (vNode) {
        this.props = vNode.attrs;
        return m('div.components-dialog-verify', [
            m('div.dialog-content warmPrompt', m('div', [
                this.headerVnode(),
                // this.promptText(),
                this.verifyVnode()
            ]))
        ]);
    }
};