const m = require('mithril');

/**
 * 验证码
 * @param validateCode 验证码
 * [
 *      {
 *          key: window.validate.sms,
 *          name: '手机验证码',
 *          code: ''
 *      },
 *      ...
 * ]
 */
module.exports = {
    oninit (vnode) {
    },
    oncreate (vnode) {
    },
    view (vnode) {
        const validInput = [];
        for (const item of vnode.attrs.validateCode) {
            validInput.push(m('div.py-0.mb-2', {}, [item.name]));
            validInput.push(m('input.input[type=text].mb-6', {
                oninput: e => {
                    item.code = e.target.value;
                },
                value: item.code
            }, []));
        }

        return m('div.box.has-bg-level-3.views-pages-login-index-box', {}, [
            m('div.mb-5.title-2.has-text-level-1', {}, ['验证码']),
            m('div', {}, validInput),
            m('button.button.my-3.is-primary.is-fullwidth.mb-2', {
                onclick: () => {
                    window.validate.checkAll(vnode.attrs.validateCode);
                }
            }, [window.gI18n.$t('10136')/* '登录' */])

        ]);
    }
};