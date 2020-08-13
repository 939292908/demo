const m = require('mithril');
const InputWithComponent = require('@/views/components/inputWithComponent');
const Validate = require('@/models/login/validate');
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
        validInput.push(m('div.mb-5.title-2.has-text-level-1', {}, ['验证码']));
        validInput.push(m('div.has-text-level-1.body-3.mb-2', {}, [Validate.selectName]));
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
                            ? `${Validate.smsCd}`
                            : window.gI18n.$t('10214')/* '获取验证码' */])
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
                            ? `${Validate.emailCd}`
                            : window.gI18n.$t('10214')/* '获取验证码' */])
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
            validInput.push(m('div.mb-5.has-text-right', {}, [
                m('a.has-text-primary', {
                    onclick: () => { Validate.changeValidate(); }
                }, [Validate.anotherName])
            ]));
        }

        validInput.push(m('button.button.my-3.has-bg-primary.btn-2.is-fullwidth.mb-2', {
            onclick: () => {
                Validate.check();
            }
        }, ['确定']));

        return m('div', {}, validInput);
    }
};