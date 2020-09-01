const m = require('mithril');
const md5 = require('md5');
const geetest = require('@/models/validate/geetest').default;
const Http = require('@/api').webApi;
const config = require('@/config');
const I18n = require('@/languages/I18n').default;
const errCode = require('@/util/errCode').default;
const broadcast = require('@/broadcast/broadcast');
const validate = require('@/models/validate/validate').default;
const regExp = require('@/models/validate/regExp');

module.exports = {
    loginType: 'phone', // 账号类型 phone 手机，email 邮箱
    loginName: '', // 账号
    selectList: [{ cn_name: '中国', code: '86', support: '1', us_name: 'China' }], // 区号列表
    areaCode: '86', // 区号 默认86
    isValidate: true, // 验证状态
    password1: '', // 新密码
    password2: '', // 第二次输入密码
    is2fa: false, // 2fa状态
    showPassword1Validate: false,
    showPassword2Validate: false,
    showAccountValidate: false,
    /**
     * 重置密码接口
     */
    submitReset() {
        if (regExp.validPassword(this.password1) || regExp.validTwoPassword(this.password1, this.password2)) {
            return;
        }
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
    /**
     * 打开验证
     */
    submit() {
        const that = this;
        if (!regExp.validAccount(this.loginType, this.loginName)) {
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
    /**
     * 获取区号列表
     */
    getCountryList () {
        Http.getCountryList({}).then(res => {
            if (res.result.code === 0) {
                this.selectList = res.result.data;
                m.redraw();
            }
        });
    },
    /**
     * 加载极验
     */
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
    cleanUp() {
        this.loginName = '';
        this.password1 = '';
        this.password2 = '';
        this.is2fa = false;
        this.isValidate = false;
        this.showPassword1Validate = false;
        this.showPassword2Validate = false;
        this.showAccountValidate = false;
    },
    onremove() {
        this.cleanUp();
        validate.close();
        broadcast.offMsg({
            key: 'forgetPassword',
            cmd: 'geetestMsg',
            isall: true
        });
    }
};