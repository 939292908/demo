const m = require('mithril');
const md5 = require('md5');
const geetest = require('@/libs/geetestTwo');

module.exports = {
    loginType: 'phone',
    loginName: '',
    selectList: [{ cn_name: '中国', code: '86', support: '1', us_name: 'China' }],
    validateCode: [],
    areaCode: '86',
    isValidate: false,
    password1: '',
    password2: '',
    is2fa: false,
    valid() {
        return !!(this.loginName &&
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                this.loginName));
    },
    valid1() {
        return !!this.loginName;
    },
    submitReset() {
        this.loading = true;
        m.redraw();
        window.gWebApi.resetPassword({
            Passwd1: md5(this.password1),
            Passwd2: md5(this.password2),
            exChannel: window.exchId
        }, res => {
            this.loading = false;
            m.redraw();
            if (res.result.code === 0) {
                // '您的密码已修改成功，现在为您跳转登录界面'
                window.$message({
                    content: '修改成功',
                    type: 'success'
                });
                window.router.push('/login');
            } else {
                window.$message({
                    content: window.errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }, () => {
            this.loading = false;
            m.redraw();
        });
    },
    submitEmail() {
        const that = this;
        if (this.valid) {
            this.loading = true;
            geetest.verify(() => { that.loading = false; });
        }
    },
    submitPhone() {
        const that = this;
        if (this.valid1) {
            this.loading = true;
            geetest.verify(() => { that.loading = false; });
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
            m.redraw();
            if (res.result.code === 0) {
                if (res.exists === 1) {
                    this.check(res);
                } else {
                    window.$message({
                        content: '用户不存在',
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
            m.redraw();
        });
    },
    /**
     * 2fa验证
     * @param res
     */
    check(res) {
        if (this.loginType === "phone") {
            if (res.ga !== '' && res.email !== '') { // 谷歌和邮箱
                window.validate.activeEmailAndGoogle({
                    secureEmail: res.email,
                    host: window.exchConfig.official,
                    fn: 'be',
                    lang: window.gI18n.locale
                }, () => {
                    this.nextPhoneValidate(res.phone);
                });
            } else if (res.ga === '' && res.email !== '') { // 邮箱
                window.validate.activeEmail({
                    secureEmail: res.email,
                    host: window.exchConfig.official,
                    fn: 'be',
                    lang: window.gI18n.locale
                }, () => {
                    this.nextPhoneValidate(res.phone);
                });
            } else if (res.ga !== '' && res.email === '') { // 谷歌
                window.validate.activeGoogle(() => { this.nextPhoneValidate(res.phone); });
            } else {
                this.nextPhoneValidate(res.phone);
            }
        } else {
            if (res.ga !== '' && res.phone !== '') { // 谷歌和手机
                window.validate.activeSmsAndGoogle({
                    securePhone: res.phone,
                    resetPwd: true,
                    areaCode: '00' + this.areaCode,
                    phone: res.phone,
                    lang: window.gI18n.locale
                }, () => {
                    this.nextEmailValidate(res.email);
                });
            } else if (res.ga === '' && res.phone !== '') { // 手机
                window.validate.activeSms({
                    securePhone: res.phone,
                    resetPwd: true,
                    areaCode: '00' + this.areaCode,
                    phone: res.phone,
                    lang: window.gI18n.locale
                }, () => {
                    this.nextEmailValidate(res.email);
                });
            } else if (res.ga !== '' && res.phone === '') { // 谷歌
                window.validate.activeGoogle(() => { this.nextEmailValidate(res.email); });
            } else {
                this.nextEmailValidate(res.email);
            }
        }
        this.is2fa = true;
        m.redraw();
    },
    /**
     * 下一步手机验证
     */
    nextPhoneValidate(phone) {
        window.validate.activeSms({
            securePhone: phone,
            resetPwd: true,
            areaCode: '00' + this.areaCode,
            phone: this.loginName,
            lang: window.gI18n.locale,
            mustCheckFn: 'resetPasswd'
        }, () => {
            this.isValidate = true;
            m.redraw();
        });
        window.gBroadcast.emit({ cmd: 'redrawValidate', data: '' });
    },
    /**
     * 下一步邮箱验证
     */
    nextEmailValidate(email) {
        window.validate.activeEmail({
            secureEmail: email,
            host: window.exchConfig.official,
            fn: 'rpw',
            lang: window.gI18n.locale,
            resetPwd: true,
            mustCheckFn: 'resetPasswd'
        }, () => {
            this.isValidate = true;
            m.redraw();
        });
        window.gBroadcast.emit({ cmd: 'redrawValidate', data: '' });
    },
    getCountryList () {
        window.gWebApi.getCountryList({}, res => {
            if (res.result.code === 0) {
                this.selectList = res.result.data;
                m.redraw();
            }
        }, () => {
        });
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
                    m.redraw();
                }
            }
        });
    },
    oninit() {
        this.initGeetest();
        this.getCountryList();
    },
    onremove() {
        this.isValidate = false;
        this.is2fa = false;
        this.password1 = '';
        this.password2 = '';
        window.validate.close();
        window.gBroadcast.offMsg({
            key: 'forgetPassword',
            cmd: 'geetestMsg',
            isall: true
        });
    }
};