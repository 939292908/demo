const m = require('mithril');
const InputWithComponent = require('@/views/components/inputWithComponent');
const Validate = require('@/models/login/validate');
/**
 * 验证码
 * @param validateCode 验证码
 * [
 *      {
 *          key: window.validate.sms,
 *          name: '手机验证码',
 *          code: '',
 *          config: {
 *              phoneNum: this.areaCode + this.loginName,
 *              resetPwd: true,
 *              areaCode: '00' + this.areaCode,
 *              phone: this.loginName,
 *              mustCheckFn: 'resetPasswd'
 *          }
 *      },
 *      ...
 * ]
 */
module.exports = {
    oninit (vnode) {
        Validate.oninit();
    },
    onremove (vnode) {
        Validate.onremove();
    },
    view (vnode) {
        const validInput = [];
        for (const item of vnode.attrs.validateCode) {
            validInput.push(m('div.py-0.mb-2', {}, [item.name]));
            switch (item.key) {
            case window.validate.sms:
                validInput.push(m(InputWithComponent, {
                    options: {
                        oninput: e => {
                            item.code = e.target.value;
                        },
                        value: item.code
                    },
                    rightComponents: m('a.body-1.register-send-code-width.px-2', {
                        onclick: () => {
                            if (Validate.smsCd > 0) return;
                            Validate.sendSmsCode();
                        }
                    }, [Validate.smsCd > 0 ? `${Validate.smsCd}` : window.gI18n.$t('10214')/* '获取验证码' */])
                }));
                break;
            case window.validate.email:
                validInput.push(m(InputWithComponent, {
                    options: {
                        oninput: e => {
                            item.code = e.target.value;
                        },
                        value: item.code
                    },
                    rightComponents: m('a.body-1.register-send-code-width.px-2', {
                        onclick: () => {
                            if (Validate.emailCd > 0) return;
                            Validate.sendEmailCode();
                        }
                    }, [Validate.emailCd > 0 ? `${Validate.emailCd}` : window.gI18n.$t('10214')/* '获取验证码' */])
                }));
                break;
            case window.validate.google:
                validInput.push(m('input.input[type=text].mb-6', {
                    oninput: e => {
                        item.code = e.target.value;
                    },
                    value: item.code
                }, []));
                break;
            }
        }

        return m('div.box.has-bg-level-3.views-pages-login-index-box', {}, [
            m('div.mb-5.title-2.has-text-level-1', {}, ['验证码']),
            m('div', {}, validInput),
            m('button.button.my-3.is-primary.is-fullwidth.mb-2', {
                onclick: () => {
                    window.validate.checkAll(vnode.attrs.validateCode);
                }
            }, ['确定'])

        ]);
    }
};