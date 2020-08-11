const m = require('mithril');
const geetest = require('@/libs/geetestTwo');

module.exports = {
    loginType: 'phone',
    loginName: '',
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
                    this.nextStep();
                } else {
                    window.$message({
                        content: window.gI18n.$t('10227'),
                        type: 'danger'
                    });// 用户不存在
                }
            } else {
                window.$message({
                    content: window.errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }, () => {
            window.$message({
                content: '网络异常，请稍后重试',
                type: 'danger'
            });
            this.loading = false;
        });
    },
    toResetPwd() {
        window.validate.close();
        window._console.log('tlh', '验证完成');
        // this.$router.push(`/resetPasswd`);
    },
    nextStep() {
        switch (this.loginType) {
        case 'phone':
            this.validateCode = [
                {
                    key: window.validate.sms,
                    name: '手机验证码',
                    code: '',
                    config: {
                        phoneNum: this.areaCode + this.loginName,
                        resetPwd: true,
                        areaCode: '00' + this.areaCode,
                        phone: this.loginName,
                        mustCheckFn: 'resetPasswd'
                    }
                }
            ];
            break;
        case 'email':
            this.validateCode = [
                {
                    key: window.validate.email,
                    name: '邮箱验证码',
                    code: '',
                    config: {
                        phoneNum: this.areaCode + this.loginName,
                        resetPwd: true,
                        areaCode: '00' + this.areaCode,
                        phone: this.loginName,
                        mustCheckFn: 'resetPasswd'
                    }
                }
            ];
            break;
        }
        m.redraw();
        window.validate.activeAll(
            this.validateCode,
            () => {
                this.toResetPwd();
            }
        );
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
    },
    onremove() {
        this.validateCode = [];
        window.validate.close();
        window.gBroadcast.offMsg({
            key: 'forgetPassword',
            cmd: 'geetestMsg',
            isall: true
        });
    }
};