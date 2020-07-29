let geetest = require('@/libs/geetestTwo')

module.exports = {
    account: '',
    password: '',
    rulesEmail: {
        required: value => !!value || gI18n.$t("10015"), //该字段不能为空
        email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || gI18n.$t("10668"); // 邮箱格式不正确
        }
    },
    rulesPhone: {
        required: value => !!value || gI18n.$t("10015"), //该字段不能为空
        phone: value => {
            const pattern = /^[1][0-9]{10}$/;
            return pattern.test(value) || gI18n.$t("10669"); // 手机号码不正确
        }
    },
    rulesAll: {
        required: value => !!value || gI18n.$t("10015") //该字段不能为空
    },
    rulesPwd: {
        required: value => !!value || gI18n.$t("10015") //该字段不能为空
    },
    valid() {
        return !!(this.password && this.account);
    },
    login: function(){
        if (this.valid) {
            geetest.verify(function(){})
        }
    },
    initGeetest() {
        geetest.init(() => {})
    }
}