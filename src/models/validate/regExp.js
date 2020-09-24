const I18n = require('@/languages/I18n').default;
module.exports = {
    email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    phone: /^[0-9]{5,11}$/,
    password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/,
    code: /^[0-9]{6}$/,
    apiIP: /^(([0-9]|[0-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.([0-9]|[0-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.([0-9]|[0-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.([0-9]|[0-9]\d|1\d{2}|2[0-4]\d|25[0-5]),?)*$/,
    validAccount(loginType, account) {
        if (!account) {
            // return '该字段不能为空'; /* '该字段不能为空' */
            return I18n.$t('10416');
        } else if (loginType === 'phone' && !this.phone.test(account)) {
            // return '手机号码不正确'; /* '手机号码不正确' */
            return I18n.$t('10533');
        } else if (loginType === 'email' && !this.email.test(account)) {
            // return '邮箱格式不正确'; /* '邮箱格式不正确' */
            return I18n.$t('10441');
        } else {
            return '';
        }
    },
    validPassword(password) {
        if (!password) {
            // return '该字段不能为空'; /* '该字段不能为空' */
            return I18n.$t('10416');
        } else if (!this.password.test(password)) {
            // return '至少6个字符，必须是字母和数字';
            return I18n.$t('10532');
        } else {
            return '';
        }
    },
    validTwoPassword(password1, password2) {
        if (!password2) {
            // return '该字段不能为空'; /* '该字段不能为空' */
            return I18n.$t('10416');
        } else if (password1 !== password2) {
            // return '两次输入密码不一致!'; /* '两次输入密码不一致!' */
            return I18n.$t('10442');
        } else {
            return '';
        }
    },
    validAPIIP(ip) {
        if (!ip) {
            return '';
        } else if (!this.apiIP.test(ip)) {
            // return 'IP格式不正确';
            return I18n.$t('10612');
        } else {
            return '';
        }
    },
    validAPIKeyName(name) {
        if (!name) {
            // return '该字段不能为空'; /* '该字段不能为空' */
            return I18n.$t('10416');
        } else if (name.length > 10) {
            // return '备注名不能超过10个字符';
            return I18n.$t('10613', { value: 10 });
        } else {
            return '';
        }
    }
};
