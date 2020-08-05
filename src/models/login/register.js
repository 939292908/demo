let m = require('mithril')
let geetest = require('@/libs/geetestTwo')
let cryptoChar = require('@/util/cryptoChar')
let config = require('@/config')
let md5 = require('md5')

module.exports = {
    type: 'phone',
    refereeId: '',
    loginName: '13482854047',
    password: 'a123456',
    code: '',
    areaCode: '0086',
    refereeType: '',
    prom: '',
    os: '',
    isValidate: false,
    waiting: false,
    smsCd: 0,//激活短信按钮倒计时
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
            geetest.verify(() => {
                that.loading = false
            });
        }
    },
    // 手机注册处理
    submitPhone() {
        let that = this
        if (this.valid1) {
            this.loading = true;
            geetest.verify(() => {
                that.loading = false
            });
        }
    },
    // 邮箱注册
    registerEmailFn() {
        validate.activeEmail({
            email: this.loginName,
            host: config.official,
            fn: 'aa',
            lang: gI18n.locale,
            mustCheckFn: 'register'
        }, () => {
            this.register();
        });
    },
    // 手机注册
    registerPhoneFn() {
        validate.activeSms({
            phoneNum: this.areaCode + '-' + this.loginName,
            mustCheckFn: 'register'
        }, () => {
            this.register();
        });
    },
    // 查询是否注册顾过
    queryUserInfo() {
        gWebApi.queryUserInfo({
            loginType: this.type,
            loginName: this.loginName,
            nationNo: '00' + this.areaCode,
            exChannel: exchId
        }, res => {
            this.loading = false;
            console.log(res);
            this.loading = false;
            console.log(res);
            if (res.result.code == 0) {
                if (res.exists == 1) {
                    $message({content: gI18n.$t('10228'), type: 'danger'}); // 用户已存在
                } else {
                    this.isValidate = true;
                    m.redraw();
                    if (this.type === "phone") {
                        this.registerPhoneFn(this)
                    } else if (this.type === "email") {
                        this.registerEmailFn(this);
                    }
                }
            } else {
                $message({content: errCode.getWebApiErrorCode(res.result.code), type: 'danger'});
            }
        }, err => {
            $message({content: '网络异常，请稍后重试' + err, type: 'danger'});
            this.loading = false;
        });
    },
    register() {
        gWebApi.usersRegister({
            loginType: this.type,
            loginName: this.loginName,
            pass: md5(this.password),
            refereeId: this.refereeId,
            refereeType: this.refereeType,
            prom: this.prom,
            os: this.os,
            nationNo: '00' + this.areaCode,
            exChannel: exchId,
        }, res => {
            console.log("注册信息", res.data);
            if (res.result.code === 0) {
                // 注册成功
                // 记录邮箱和密码
                $message({content: gI18n.$t('10630')/*'注册成功'*/, type: 'success'});

            } else {
                // 输入信息有误
                $message({content: errCode.getWebApiErrorCode(res.result.code), type: 'danger'});
            }
        }, err => {
            $message({content: '网络异常，请稍后重试' + err, type: 'danger'});
        });
    },
    sendSmsCode() {
        this.waiting = true;
        validate.sendSmsCode(res => {
            if (res.result.code == 0) {
                this.waiting = false;
                if (!this.int) {
                    this.setSmsCd();
                }
            } else if (res.data.result.code == -1) {
                // this.geetestCallBackType = 'sms'
                geetest.verify();
            } else {
                $message({content: errCode.getWebApiErrorCode(res.result.code), type: 'danger'});
            }
        }, () => {
            this.waiting = false;
        });
    },
    sendEmailCode() {
        this.waiting = true;
        validate.sendEmailCode(res => {
            if (res.result.code == 0) {
                this.waiting = false;
                if (!this.int) {
                    this.setSmsCd();
                }
            } else if (res.result.code == -1) {
                // self.geetestCallBackType = 'email'
                geetest.verify();
            } else {
                $message({content: errCode.getWebApiErrorCode(res.result.code), type: 'danger'});
            }
        }, () => {
            this.waiting = false;
        });
    },
    setSmsCd() {
        this.smsCd = 60;
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
    initGeetest() {
        let self = this;
        geetest.init(() => {
        });
        gBroadcast.onMsg({
            key: 'register',
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
    onremove() {
        gBroadcast.offMsg({
            key: 'register',
            cmd: 'geetestMsg',
            isall: true
        })
    },
}