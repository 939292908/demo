const m = require('mithril');
const InputWithComponent = require('../../../components/inputWithComponent/inputWithComponent.view');
const Validate = require('./validate.model');
const validateModel = require('@/models/validate/validate').default;
const I18n = require('@/languages/I18n').default;
const utils = require('@/util/utils').default;
console.log(Validate);
/**
 * 验证码
 */
module.exports = {
    oninit() {
        Validate.oninit();
    },
    onremove() {
        Validate.onremove();
    },
    view() {
        const validInput = [];
        validInput.push(m('div.title-large.has-text-title', {}, [I18n.$t('10113')/* '安全验证' */]));
        validInput.push(m('div.py-0.mb-7.body-5.has-text-level-4', {}, [I18n.$t('10534')/* '为了您的账户安全，请完成以下验证' */]));
        validInput.push(m('div.has-text-level-2.body-5.mb-2', {}, [
            Validate.selectName()[Validate.selectType],
            m('span.ml-2.body-2.has-text-level-4', {}, [
                Validate.selectType === 'sms' && validateModel.smsConfig.securePhone ? `(${utils.hideAccountNameInfo(validateModel.smsConfig.securePhone)})`
                    : Validate.selectType === 'email' && validateModel.emailConfig.secureEmail ? `(${utils.hideAccountNameInfo(validateModel.emailConfig.secureEmail)})`
                        : ''
            ])
        ]));
        switch (Validate.selectType) {
        case 'sms':
            validInput.push(m(InputWithComponent, {
                options: {
                    oninput: e => {
                        Validate.code = e.target.value.replace(/[^\d]/g, '');
                    },
                    onkeyup: e => {
                        if (!Validate.canConfirm && Validate.selectType !== 'google') return;
                        if (e.keyCode === 13) Validate.check();
                    },
                    maxlength: '6',
                    value: Validate.code
                },
                rightComponents: m('a.body-1.views-page-login-send-code.px-2',
                    {
                        onclick: () => {
                            if (Validate.smsCd > 0) return;
                            Validate.sendSmsCode();
                        }
                    }, [
                        Validate.smsCd > 0
                            ? `${Validate.smsCd} s`
                            : I18n.$t('10117')/* '获取验证码' */])
            }));
            break;
        case 'email':
            validInput.push(m(InputWithComponent, {
                options: {
                    oninput: e => {
                        Validate.code = e.target.value.replace(/[^\d]/g, '');
                    },
                    onkeyup: e => {
                        if (!Validate.canConfirm && Validate.selectType !== 'google') return;
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
                    }, [
                        Validate.emailCd > 0
                            ? `${Validate.emailCd} s`
                            : I18n.$t('10117')/* '获取验证码' */])
            }));
            break;
        case 'google':
            validInput.push(m('input.input[type=text]', {
                oninput: e => {
                    Validate.code = e.target.value.replace(/[^\d]/g, '');
                },
                onkeyup: e => {
                    if (!Validate.canConfirm && Validate.selectType !== 'google') return;
                    if (e.keyCode === 13) Validate.check();
                },
                maxlength: '6',
                value: Validate.code
            }, []));
            break;
        }

        if (Validate.anotherType.length) {
            validInput.push(m('div.has-text-right.mt-2', {}, [
                m('a.has-text-primary', {
                    onclick: () => { Validate.changeValidate(); }
                }, [Validate.anotherName()[Validate.anotherType]])
            ]));
        }

        validInput.push(m('button.button.my-3.has-bg-primary.button-medium.is-fullwidth.has-text-white.mb-2.mt-7', {
            onclick: () => {
                Validate.check();
            },
            class: Validate.loading || validateModel.loading ? 'is-loading' : '',
            disabled: !Validate.canConfirm && Validate.selectType !== 'google'
        }, [I18n.$t('10337')/* '确定' */]));

        return m('div', {}, validInput);
    }
};
