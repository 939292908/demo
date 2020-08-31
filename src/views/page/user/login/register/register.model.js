const m = require('mithril');
const geetest = require('@/models/validate/geetest').default;
const cryptoChar = require('@/util/cryptoChar');
const config = require('@/config');
const md5 = require('md5');
const Http = require('@/api').webApi;
const I18n = require('@/languages/I18n').default;
const errCode = require('@/util/errCode').default;
const broadcast = require('@/broadcast/broadcast');
const validate = require('@/models/validate/validate').default;
const helpCenter = require('@/util/helpCenter').default;

const register = {
    type: 'phone', // 账号类型 phone 手机，email 邮箱
    refereeId: '', // 邀请码
    loginName: '', // 账号
    password: '', // 密码
    code: '', // 验证码
    areaCode: '86', // 区号，默认86
    showPassword: false, // 显示密码
    showPasswordValidate: false, // 显示密码字段验证提示
    showLoginNameValidate: false, // 显示登陆字段验证提示
    selectList: [{ cn_name: '中国', code: '86', support: '1', us_name: 'China' }], // 区号选择列表
    refereeType: '', // 邀请类型
    prom: '',
    os: '', // 系统
    isvalidate: false, // 验证状态
    waiting: false, // 等待状态
    smsCd: 0, // 激活短信按钮倒计时
    exchInfo: config.exchInfo, // 渠道信息
    checkbox: false, // 条款同意
    /**
     * 必须填写验证码
     * @returns {boolean}
     */
    mustInvited() {
        if (!this.exchInfo) return false;
        return Boolean(parseInt(this.exchInfo.mustInvited));
    },
    /**
     * 邮箱验证
     */
    rulesEmail: {
        required: value => !!value || '该字段不能为空', // 该字段不能为空
        email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || '邮箱格式不正确'; // 邮箱格式不正确
        }
    },
    /**
     * 手机号验证
     */
    rulesPhone: {
        required: value => !!value || '该字段不能为空', // 该字段不能为空
        phone: value => {
            const pattern = /^[0-9]{5,11}$/;
            return pattern.test(value) || '手机号码不正确'; // 手机号码不正确
        }
    },
    /**
     * 密码验证
     */
    rulesPwd: {
        required: value => !!value || '该字段不能为空', // 该字段不能为空
        password: value => {
            const pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;
            return pattern.test(value) || '至少6个字符，必须是字母和数字'; // 至少6个字符，必须是字母和数字
        }
    },
    /**
     * 注册验证
     * @returns {boolean|boolean}
     */
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
        if (this.exchInfo.helpCenter.website && this.exchInfo.helpCenter.termsServiceId && this.exchInfo.helpCenter.privacyPolicyId) {
            return this.checkbox && valid;
        } else {
            return valid;
        }
    },
    /**
     * 注册验证
     * @returns {string|boolean|boolean}
     */
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
        if (this.exchInfo.helpCenter.website && this.exchInfo.helpCenter.termsServiceId && this.exchInfo.helpCenter.privacyPolicyId) {
            return this.checkbox && valid;
        } else {
            return valid;
        }
    },
    /**
     * 打开条款
     * @param id 方法名
     */
    toHelpService(id) {
        helpCenter.openArticle(this.exchInfo.helpCenter[id]);
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
    /**
     * 最终注册接口
     */
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
    /**
     * 发送短信验证码
     */
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
    /**
     * 发送邮箱验证码
     */
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
    /**
     * 设置验证码发送冷却
     */
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
    /**
     * 获取区号列表
     */
    getCountryList() {
        Http.getCountryList({}).then(res => {
            if (res.result.code === 0) {
                this.selectList = res.result.data;
                m.redraw();
            }
        });
    },
    /**
     * 获取渠道信息
     */
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
    /**
     * 加载极验
     */
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
        helpCenter.init(this.exchInfo);
        this.getExchInfo();
    },
    onremove() {
        this.password = '';
        this.loginName = '';
        this.showPasswordValidate = false;
        this.showLoginNameValidate = false;
        this.isvalidate = false;
        this.showPassword = false;
        broadcast.offMsg({
            key: 'register',
            cmd: 'geetestMsg',
            isall: true
        });
    }
};

module.exports = register;