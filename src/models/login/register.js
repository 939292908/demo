let geetest = require('@/libs/geetestTwo')
let cryptoChar = require('@/util/cryptoChar')

module.exports = {
    type: 'mail',
    refereeId: "",
    loginName: "",
    password: "",
    exchInfo: {},//渠道信息
    mustInvited() {
        return Boolean(parseInt(this.exchInfo.mustInvited));
    },
    valid() {
        let uid = cryptoChar.decrypt(this.refereeId);
        let valid = false
        if (this.mustInvited) {
            valid = this.loginName && this.password &&
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.loginName) &&
                /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(this.password) &&
                !(uid <= 1000000 || uid > 100000000) && /^\d+$/.test(uid);
        } else {

            valid = this.loginName && this.password &&
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.loginName) &&
                /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(this.password);
        }
        if (this.exchInfo.helpCenter.website && this.exchInfo.helpCenter.termsServiceId && this.exchInfo.helpCenter.privacyPolicyId) {
            return this.checkbox && valid
        } else {
            return valid
        }

    },
    valid1() {
        let uid = cryptoChar.decrypt(this.refereeId);
        let valid = false
        if (this.mustInvited) {
            valid = this.loginName && this.password &&
                /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(this.password) &&
                !(uid <= 1000000 || uid > 100000000) && /^\d+$/.test(uid);
        } else {
            valid = this.loginName && this.password &&
                /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(this.password);
        }
        if (this.exchInfo.helpCenter.website && this.exchInfo.helpCenter.termsServiceId && this.exchInfo.helpCenter.privacyPolicyId) {
            return this.checkbox && valid
        } else {
            return valid
        }
    },
    // 邮箱注册处理
    submitEmail() {
        let that = this
        if (this.valid) {
            this.loading = true;
            geetest.verify(function () {
                that.loading = false
            })
        }
    },
    // 手机注册处理
    submitPhone() {
        let that = this
        if (this.valid1) {
            this.loading = true;
            geetest.verify(function () {
                that.loading = false
            })
        }
    },
    // 邮箱注册
    registerEmailFn(self) {
        // this.validate.activeEmail({
        //     email: this.loginName,
        //     host: this.config.href,
        //     fn: 'aa',
        //     lang: this.$i18n.locale,
        //     mustCheckFn: 'register'
        // }, this.register);
    },
    // 手机注册
    registerPhoneFn(self) {
        // this.validate.activeSms({
        //     phoneNum: this.areaCode + this.loginName,
        //     mustCheckFn: 'register'
        // }, this.register);
    },
    // 查询是否注册顾过
    queryUserInfo() {

    },
    register() {

    },
    initGeetest() {
        let self = this;
        geetest.init(() => {
        });
        gBroadcast.onMsg({
            key: 'login',
            cmd: 'geetestMsg',
            cb: res => {
                if (res == 'success') {
                    self.queryUserInfo();
                } else {
                    self.loading = false;
                }
            }
        });
    },
    oninit() {
        this.initGeetest();
    },

}