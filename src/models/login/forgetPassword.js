// const m = require('mithril');
const geetest = require('@/libs/geetestTwo');

module.exports = {
    loginType: 'phone',
    loginName: '',
    validInput: [],
    validateCode: [],
    areaCode: '86',
    valid() {
        return !!(this.loginName &&
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                this.loginName));
    },
    valid1() {
        return !!this.loginName;
    },
    submitEmail() {
        const that = this;
        if (this.valid) {
            this.loading = true;
            geetest.verify(function() { that.loading = false; });
        }
    },
    submitPhone() {
        const that = this;
        if (this.valid1) {
            this.loading = true;
            geetest.verify(function() { that.loading = false; });
        }
    },
    // 查询是否注册顾过
    queryUserInfo() {
        window.gWebApi.queryUserInfo({
            loginType: this.loginType,
            loginName: this.loginName,
            nationNo: '00' + this.areaCode,
            exChannel: window.exchId
        }, res => {
            this.loading = false;
            if (res.result.code === 0) {
                if (res.exists === 1) {
                    if (this.loginType === "phone") {
                        this.forgotPwdSmsCheck();
                    } else if (this.loginType === "email") {
                        this.forgotPwdEmailCheck();
                    }
                } else {
                    window.$message({ content: window.gI18n.$t('10227'), type: 'danger' });// 用户不存在
                }
            } else {
                window.$message({ content: window.errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
            }
        }, () => {
            window.$message({ content: '网络异常，请稍后重试', type: 'danger' });
            this.loading = false;
        });
    },
    // 重置邮件验证
    forgotPwdEmailCheck() {
        window.validate.activeEmail({
            email: this.loginName,
            host: this.config.href,
            fn: 'rpw',
            lang: window.gI18n.locale,
            resetPwd: true,
            mustCheckFn: 'resetPasswd'
        }, this.toResetPwd);
    },
    // 重置密码短信
    forgotPwdSmsCheck() {
        window.validate.activeSms({
            phoneNum: this.areaCode + this.loginName,
            resetPwd: true,
            areaCode: '00' + this.areaCode,
            phone: this.loginName,
            mustCheckFn: 'resetPasswd'
        }, this.toResetPwd);
    },
    toResetPwd() {
        window.validate.close();
        // this.$router.push(`/resetPasswd`);
    },
    initGeetest() {
        const self = this;
        geetest.init(() => {});
        window.gBroadcast.onMsg({
            key: 'forgetPassword',
            cmd: 'geetestMsg',
            cb: res => {
                if (res === 'success') {
                    self.queryUserInfo();
                } else {
                    self.loading = false;
                }
            }
        });
    }
};