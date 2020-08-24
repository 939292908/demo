const m = require('mithril');
const geetest = require('@/models/validate/geetest').default;
const cryptoChar = require('@/util/cryptoChar');
const config = require('@/config');
const md5 = require('md5');
const Http = require('@/newApi');
const I18n = require('@/languages/I18n').default;
const errCode = require('@/util/errCode').default;
const broadcast = require('@/broadcast/broadcast');
const validate = require('@/models/validate/validate').default;

const register = {
    type: 'phone',
    refereeId: '',
    loginName: '',
    password: '',
    code: '',
    areaCode: '86',
    selectList: [{ cn_name: '中国', code: '86', support: '1', us_name: 'China' }],
    refereeType: '',
    prom: '',
    os: '',
    isvalidate: false,
    waiting: false,
    smsCd: 0, // 激活短信按钮倒计时
    exchInfo: null, // 渠道信息
    mustInvited() {
        if (!this.exchInfo) return false;
        return Boolean(parseInt(this.exchInfo.mustInvited));
    },
    valid() {
        const uid = cryptoChar.decrypt(this.refereeId);
        let valid = false;
        if (this.mustInvited()) {
            valid = this.loginName && this.password &&
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.loginName) &&
                /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(this.password) &&
                !(uid <= 1000000 || uid > 100000000) && /^\d+$/.test(uid);
        } else {
            valid = this.loginName && this.password &&
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.loginName) &&
                /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(this.password);
        }
        if (!this.exchInfo) return valid;
        if (this.exchInfo.helpCenter.website && this.exchInfo.helpCenter.termsServiceId && this.exchInfo.helpCenter.privacyPolicyId) {
            return this.checkbox && valid;
        } else {
            return valid;
        }
    },
    valid1() {
        const uid = cryptoChar.decrypt(this.refereeId);
        let valid = false;
        if (this.mustInvited()) {
            valid = this.loginName && this.password &&
                /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(this.password) &&
                !(uid <= 1000000 || uid > 100000000) && /^\d+$/.test(uid);
        } else {
            valid = this.loginName && this.password &&
                /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(this.password);
        }
        if (!this.exchInfo) return valid;
        if (this.exchInfo.helpCenter.website && this.exchInfo.helpCenter.termsServiceId && this.exchInfo.helpCenter.privacyPolicyId) {
            return this.checkbox && valid;
        } else {
            return valid;
        }
    },
    // 邮箱注册处理
    submitEmail() {
        const that = this;
        if (this.valid) {
            this.loading = true;
            geetest.verify(() => {
                that.loading = false;
            });
        }
    },
    // 手机注册处理
    submitPhone() {
        const that = this;
        if (this.valid1) {
            this.loading = true;
            geetest.verify(() => {
                that.loading = false;
            });
        }
    },
    // 邮箱注册
    registerEmailFn() {
        validate.activeEmail({
            email: this.loginName,
            host: config.official,
            fn: 'aa',
            lang: I18n.getLocale(),
            mustCheckFn: 'register'
        }, this.register);
    },
    // 手机注册
    registerPhoneFn() {
        validate.activeSms({
            phoneNum: '00' + this.areaCode + '-' + this.loginName,
            mustCheckFn: 'register'
        }, this.register);
    },
    // 查询是否注册顾过
    queryUserInfo() {
        const self = this;
        Http.queryUserInfo({
            loginType: this.type,
            loginName: this.loginName,
            nationNo: '00' + this.areaCode,
            exChannel: config.exchId
        }).then(res => {
            this.loading = false;
            if (res.result.code === 0) {
                if (res.exists === 1) {
                    window.$message({ content: I18n.$t('10281'), type: 'danger' }); // 用户已存在
                } else {
                    self.isvalidate = true;
                    m.redraw();
                    if (self.type === "phone") {
                        self.registerPhoneFn(self);
                    } else if (this.type === "email") {
                        self.registerEmailFn(self);
                    }
                }
            } else {
                window.$message({ content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
            }
        }).catch(() => {
            window.$message({ content: '网络异常，请稍后重试', type: 'danger' });
            self.loading = false;
            m.redraw();
        });
    },
    register() {
        Http.usersRegister({
            loginType: register.type,
            loginName: register.loginName,
            pass: md5(register.password),
            refereeId: register.refereeId,
            refereeType: register.refereeType,
            prom: register.prom,
            os: register.os,
            nationNo: '00' + register.areaCode,
            exChannel: config.exchId
        }).then(res => {
            if (res.result.code === 0) {
                // 注册成功
                window.$message({ content: '注册成功', type: 'success' });
                window.router.push('/login');
            } else {
                // 输入信息有误
                window.$message({ content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
            }
        }).catch(() => {
            window.$message({ content: '网络异常，请稍后重试', type: 'danger' });
        });
    },
    sendSmsCode() {
        this.waiting = true;
        validate.sendSmsCode().then(res => {
            if (res.result.code === 0) {
                this.waiting = false;
                if (!this.int) {
                    this.setSmsCd();
                }
            } else if (res.data.result.code === -1) {
                // this.geetestCallBackType = 'sms'
                geetest.verify();
            } else {
                window.$message({ content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
            }
        }).catch(() => {
            this.waiting = false;
        });
    },
    sendEmailCode() {
        this.waiting = true;
        validate.sendEmailCode().then(res => {
            if (res.result.code === 0) {
                this.waiting = false;
                if (!this.int) {
                    this.setSmsCd();
                }
            } else if (res.result.code === -1) {
                // self.geetestCallBackType = 'email'
                geetest.verify();
            } else {
                window.$message({ content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
            }
        }).catch(() => {
            this.waiting = false;
        });
    },
    setSmsCd() {
        this.smsCd = 60;
        m.redraw();
        this.int = setInterval(() => {
            this.smsCd--;
            m.redraw();
            if (this.smsCd === 0) {
                clearInterval(this.int);
                this.int = null;
                m.redraw();
            }
        }, 1000);
    },

    getCountryList() {
        Http.getCountryList({}).then(res => {
            if (res.result.code === 0) {
                this.selectList = res.result.data;
                m.redraw();
            }
        });
    },

    getExchInfo() {
        Http.getExchInfo({ exchannel: config.exchId }).then(res => {
            if (res.result.code === 0) {
                this.exchInfo = res.result.data;
            }
        });
    },
    // 检查验证码
    checkCode() {
        this.type === 'phone'
            ? validate.checkSmsCode(this.code)
            : validate.checkEmailCode(this.code);
    },
    initGeetest() {
        const self = this;
        geetest.init(() => {
        });
        broadcast.onMsg({
            key: 'register',
            cmd: 'geetestMsg',
            cb: res => {
                if (res === 'success') {
                    self.queryUserInfo();
                } else {
                    self.loading = false;
                    m.redraw();
                }
            }
        });
    },
    oninit() {
        this.initGeetest();
        this.getCountryList();
        this.getExchInfo();
    },
    onremove() {
        this.isvalidate = false;
        broadcast.offMsg({
            key: 'register',
            cmd: 'geetestMsg',
            isall: true
        });
    }
};

module.exports = register;