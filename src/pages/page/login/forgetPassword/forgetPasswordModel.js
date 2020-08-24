const m = require('mithril');
const md5 = require('md5');
const geetest = require('@/models/validate/geetest').default;
const Http = require('@/newApi');
const config = require('@/config');
const I18n = require('@/languages/I18n').default;
const errCode = require('@/util/errCode').default;
const broadcast = require('@/broadcast/broadcast');
const validate = require('@/models/validate/validate').default;

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
        Http.resetPassword({
            Passwd1: md5(this.password1),
            Passwd2: md5(this.password2),
            exChannel: config.exchId
        }).then(res => {
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
                    content: errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }).catch(() => {
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
        Http.queryUserInfo({
            loginType: this.loginType,
            loginName: this.loginName,
            nationNo: '00' + this.areaCode,
            exChannel: config.exchId
        }).then(res => {
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
                    content: errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }).catch(() => {
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
                validate.activeEmailAndGoogle({
                    secureEmail: res.email,
                    host: config.official,
                    fn: 'be',
                    lang: I18n.getLocale()
                }, () => {
                    this.nextPhoneValidate(res.phone);
                });
            } else if (res.ga === '' && res.email !== '') { // 邮箱
                validate.activeEmail({
                    secureEmail: res.email,
                    host: config.official,
                    fn: 'be',
                    lang: I18n.getLocale()
                }, () => {
                    this.nextPhoneValidate(res.phone);
                });
            } else if (res.ga !== '' && res.email === '') { // 谷歌
                validate.activeGoogle(() => { this.nextPhoneValidate(res.phone); });
            } else {
                this.nextPhoneValidate(res.phone);
            }
        } else {
            if (res.ga !== '' && res.phone !== '') { // 谷歌和手机
                validate.activeSmsAndGoogle({
                    securePhone: res.phone,
                    resetPwd: true,
                    areaCode: '00' + this.areaCode,
                    phone: res.phone,
                    lang: I18n.getLocale()
                }, () => {
                    this.nextEmailValidate(res.email);
                });
            } else if (res.ga === '' && res.phone !== '') { // 手机
                validate.activeSms({
                    securePhone: res.phone,
                    resetPwd: true,
                    areaCode: '00' + this.areaCode,
                    phone: res.phone,
                    lang: I18n.getLocale()
                }, () => {
                    this.nextEmailValidate(res.email);
                });
            } else if (res.ga !== '' && res.phone === '') { // 谷歌
                validate.activeGoogle(() => { this.nextEmailValidate(res.email); });
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
        validate.activeSms({
            securePhone: phone,
            resetPwd: true,
            areaCode: '00' + this.areaCode,
            phone: this.loginName,
            lang: I18n.getLocale(),
            mustCheckFn: 'resetPasswd'
        }, () => {
            this.isValidate = true;
            m.redraw();
        });
        broadcast.emit({ cmd: 'redrawValidate', data: '' });
    },
    /**
     * 下一步邮箱验证
     */
    nextEmailValidate(email) {
        validate.activeEmail({
            secureEmail: email,
            host: config.official,
            fn: 'rpw',
            lang: I18n.getLocale(),
            resetPwd: true,
            mustCheckFn: 'resetPasswd'
        }, () => {
            this.isValidate = true;
            m.redraw();
        });
        broadcast.emit({ cmd: 'redrawValidate', data: '' });
    },
    getCountryList () {
        Http.getCountryList({}).then(res => {
            if (res.result.code === 0) {
                this.selectList = res.result.data;
                m.redraw();
            }
        });
    },
    initGeetest() {
        const self = this;
        geetest.init(() => {});
        broadcast.onMsg({
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
        validate.close();
        broadcast.offMsg({
            key: 'forgetPassword',
            cmd: 'geetestMsg',
            isall: true
        });
    }
};