const m = require('mithril');
const InputWithComponent = require('@/views/components/inputWithComponent/inputWithComponent.view');
const Validate = require('./validate.model');
const validateModel = require('@/models/validate/validate').default;
const utils = require('@/util/utils').default;
const Button = require('@/views/components/common/Button/Button.view');

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
        validInput.push(m('div.has-text-level-2.body-5.mb-2', {}, [
            Validate.selectName()[Validate.selectType],
            m('span.ml-2.body-2.has-text-level-4', {}, [
                Validate.selectType === 'sms' ? `(${utils.hideAccountNameInfo(validateModel.smsConfig.securePhone)})`
                    : Validate.selectType === 'email' ? `(${utils.hideAccountNameInfo(validateModel.emailConfig.secureEmail)})`
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
                        if (e.keyCode === 13) Validate.check();
                    },
                    placeholder: "短信验证码",
                    maxlength: '6',
                    value: Validate.code
                },
                rightComponents: m('a.body-1.has-text-primary.px-2',
                    {
                        onclick: () => {
                            if (Validate.smsCd > 0) return;
                            Validate.sendSmsCode();
                        }
                    }, [
                        Validate.smsCd > 0
                            ? `${Validate.smsCd} s`
                            : '获取验证码'])
            }));
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
                    placeholder: "邮箱验证码",
                    maxlength: '6',
                    value: Validate.code
                },
                rightComponents: m('a.body-1.has-text-primary.px-2',
                    {
                        onclick: () => {
                            if (Validate.emailCd > 0) return;
                            Validate.sendEmailCode();
                        }
                    }, [
                        Validate.emailCd > 0
                            ? `${Validate.emailCd} s`
                            : '获取验证码'])
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

        if (Validate.anotherType.length) {
            validInput.push(m('div.has-text-right.mt-2', {}, [
                m('a.has-text-primary', {
                    onclick: () => { Validate.changeValidate(); }
                }, [Validate.anotherName()[Validate.anotherType]])
            ]));
        }

        validInput.push(
            m(Button, {
                label: "领取",
                class: `is-primary mt-5 ${Validate.loading ? 'is-loading' : ''}`,
                width: 1,
                onclick() {
                    Validate.check();
                }
            })
        );
        return m('div', {}, validInput);
    }
};