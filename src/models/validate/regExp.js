const I18n = require('@/languages/I18n').default;
module.exports = {
    email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    phone: /^[0-9]{5,11}$/,
    password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/,
    code: /^[0-9]{6}$/,
    validAccount(loginType, account) {
        if (!account) {
            return I18n.$t('10015'); /* '该字段不能为空' */
        } else if (loginType === 'phone' && !this.phone.test(account)) {
            return I18n.$t('10669'); /* '手机号码不正确' */
        } else if (loginType === 'email' && !this.email.test(account)) {
            return I18n.$t('10668'); /* '邮箱格式不正确' */
        } else {
            return '';
        }
    },
    validPassword(password) {
        if (!password) {
            return I18n.$t('10015'); /* '该字段不能为空' */
        } else if (!this.password.test(password)) {
            return I18n.$t('10028'); /* '至少6个字符，必须是字母和数字' */
        } else {
            return '';
        }
    },
    validTwoPassword(password1, password2) {
        if (!password2) {
            return I18n.$t('10015'); /* '该字段不能为空' */
        } else if (password1 !== password2) {
            return I18n.$t('10173'); /* '两次输入密码不一致!' */
        } else {
            return '';
        }
    }
};