const m = require('mithril');
const geetest = require('@/libs/geetestTwo');
const cryptoChar = require('@/util/cryptoChar');
const config = require('@/config');
const md5 = require('md5');

module.exports = {
    type: 'phone',
    refereeId: '',
    loginName: '13482854047',
    password: 'a123456',
    code: '',
    areaCode: '86',
    selectList: [m('option', { value: '86' }, [`+86`])],
    refereeType: '',
    prom: '',
    os: '',
    isvalidate: false,
    waiting: false,
    smsCd: 0, // 激活短信按钮倒计时
    exchInfo: {}, // 渠道信息
    mustInvited () {
        return Boolean(parseInt(this.exchInfo.mustInvited));
    },
    valid () {
        const uid = cryptoChar.decrypt(this.refereeId);
        let valid = false;
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
            return this.checkbox && valid;
        } else {
            return valid;
        }
    },
    valid1 () {
        const uid = cryptoChar.decrypt(this.refereeId);
        let valid = false;
        if (this.mustInvited) {
            valid = this.loginName && this.password &&
                /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(this.password) &&
                !(uid <= 1000000 || uid > 100000000) && /^\d+$/.test(uid);
        } else {
            valid = this.loginName && this.password &&
                /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(this.password);
        }
        if (this.exchInfo.helpCenter.website && this.exchInfo.helpCenter.termsServiceId && this.exchInfo.helpCenter.privacyPolicyId) {
            return this.checkbox && valid;
        } else {
            return valid;
        }
    },
    // 邮箱注册处理
    submitEmail () {
        const that = this;
        if (this.valid) {
            this.loading = true;
            geetest.verify(() => {
                that.loading = false;
            });
        }
    },
    // 手机注册处理
    submitPhone () {
        const that = this;
        if (this.valid1) {
            this.loading = true;
            geetest.verify(() => {
                that.loading = false;
            });
        }
    },
    // 邮箱注册
    registerEmailFn () {
        window.validate.activeEmail({
            email: this.loginName,
            host: config.official,
            fn: 'aa',
            lang: window.gI18n.locale,
            mustCheckFn: 'register'
        }, () => {
            this.register();
        });
    },
    // 手机注册
    registerPhoneFn () {
        window.validate.activeSms({
            phoneNum: '00' + this.areaCode + '-' + this.loginName,
            mustCheckFn: 'register'
        }, () => {
            this.register();
        });
    },
    // 查询是否注册顾过
    queryUserInfo () {
        window.gWebApi.queryUserInfo({
            loginType: this.type,
            loginName: this.loginName,
            nationNo: '00' + this.areaCode,
            exChannel: window.exchId
        }, res => {
            this.loading = false;
            if (res.result.code === 0) {
                if (res.exists === 1) {
                    window.$message({ content: window.gI18n.$t('10281'), type: 'danger' }); // 用户已存在
                } else {
                    this.isvalidate = true;
                    m.redraw();
                    if (this.type === "phone") {
                        this.registerPhoneFn(this);
                    } else if (this.type === "email") {
                        this.registerEmailFn(this);
                    }
                }
            } else {
                window.$message({ content: window.errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
            }
        }, () => {
            window.$message({ content: '网络异常，请稍后重试', type: 'danger' });
            this.loading = false;
        });
    },
    register () {
        window.gWebApi.usersRegister({
            loginType: this.type,
            loginName: this.loginName,
            pass: md5(this.password),
            refereeId: this.refereeId,
            refereeType: this.refereeType,
            prom: this.prom,
            os: this.os,
            nationNo: '00' + this.areaCode,
            exChannel: window.exchId
        }, res => {
            if (res.result.code === 0) {
                // 注册成功
                window.$message({ content: '注册成功', type: 'success' });
                window.router.push('/login');
            } else {
                // 输入信息有误
                window.$message({ content: window.errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
            }
        }, () => {
            window.$message({ content: '网络异常，请稍后重试', type: 'danger' });
        });
    },
    sendSmsCode () {
        this.waiting = true;
        window.validate.sendSmsCode(res => {
            if (res.result.code === 0) {
                this.waiting = false;
                if (!this.int) {
                    this.setSmsCd();
                }
            } else if (res.data.result.code === -1) {
                // this.geetestCallBackType = 'sms'
                geetest.verify();
            } else {
                window.$message({ content: window.errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
            }
        }, () => {
            this.waiting = false;
        });
    },
    sendEmailCode () {
        this.waiting = true;
        window.validate.sendEmailCode(res => {
            if (res.result.code === 0) {
                this.waiting = false;
                if (!this.int) {
                    this.setSmsCd();
                }
            } else if (res.result.code === -1) {
                // self.geetestCallBackType = 'email'
                geetest.verify();
            } else {
                window.$message({ content: window.errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
            }
        }, () => {
            this.waiting = false;
        });
    },
    setSmsCd () {
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

    getCountryList () {
        window.gWebApi.getCountryList({}, res => {
            if (res.result.code === 0) {
                this.selectList = [];
                for (const item of res.result.data) {
                    if (item.support === '1') this.selectList.push(m('option', { value: item.code }, [`+${item.code}`]));
                }
                m.redraw();
            }
        }, () => {
        });
    },

    initGeetest () {
        const self = this;
        geetest.init(() => {
        });
        window.gBroadcast.onMsg({
            key: 'register',
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
    oninit () {
        this.initGeetest();
        this.getCountryList();
    },
    onremove () {
        this.isvalidate = false;
        window.gBroadcast.offMsg({
            key: 'register',
            cmd: 'geetestMsg',
            isall: true
        });
    }
};