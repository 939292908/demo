const webApi = require('@/api').webApi;
const m = require('mithril');
const geetest = require('@/models/validate/geetest').default;
const md5 = require('md5');
const utils = require('@/util/utils').default;
const I18n = require('@/languages/I18n').default;
const broadcast = require('@/broadcast/broadcast');
const errCode = require('@/util/errCode').default;
const config = require('@/config');
const validate = require('@/models/validate/validate').default;
const models = require('@/models');

module.exports = {
    account: '', // 账号
    password: '', // 密码
    loginType: 'phone', // 账号类型 phone 手机，email 邮箱
    loading: false, // 按钮loading
    showPassword: false, // 显示密码
    is2fa: false, // 2fa验证状态
    /**
     * 邮箱字段验证
     */
    rulesEmail: {
        required: value => !!value || '该字段不能为空', // 该字段不能为空
        email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || I18n.$t('10668'); // 邮箱格式不正确
        }
    },
    /**
     * 手机字段验证
     */
    rulesPhone: {
        required: value => !!value || '该字段不能为空', // 该字段不能为空
        phone: value => {
            const pattern = /^[1][0-9]{10}$/;
            return pattern.test(value) || I18n.$t('10669'); // 手机号码不正确
        }
    },
    /**
     * 全部验证
     */
    rulesAll: {
        required: value => !!value || '该字段不能为空' // 该字段不能为空
    },
    /**
     * 密码验证
     */
    rulesPwd: {
        required: value => !!value || '该字段不能为空' // 该字段不能为空
    },
    /**
     * 登录按钮disable状态
     * @returns {boolean}
     */
    valid() {
        return !!(this.password && this.account);
    },
    /**
     * 登录
     */
    login() {
        const that = this;
        if (/@/.test(this.account)) {
            this.loginType = 'email';
        } else {
            this.loginType = 'phone';
        }
        if (this.valid) {
            this.loading = true;
            geetest.verify(() => {
                that.loading = false;
            });
        }
    },
    /**
     * 登录检查接口（检查是否2fa登录验证）
     */
    loginFn() {
        webApi.loginCheckV2({
            loginType: this.loginType,
            loginName: this.account,
            pass: md5(this.password),
            exChannel: config.exchId
        }).then(res => {
            if (res.result.code === 0) {
                console.log(res, '[][][][][]');
                // 2fa 设置: email2fa, phone2fa, ga2fa
                if (!!res.result.phone && !!res.result.googleId) {
                    this.loading = false;
                    // 手机和谷歌
                    validate.activeSmsAndGoogle({
                        securePhone: utils.hideMobileInfo(res.result.phone),
                        phoneNum: res.result.phone
                    }, () => {
                        this.loginEnter();
                    });
                    this.is2fa = true;
                    m.redraw();
                } else if (res.result.phone) {
                    this.loading = false;
                    // 手机
                    validate.activeSms({
                        securePhone: utils.hideMobileInfo(res.result.phone),
                        phoneNum: res.result.phone
                    },
                    () => {
                        this.loginEnter();
                    });
                    this.is2fa = true;
                    m.redraw();
                } else if (res.result.googleId) {
                    this.loading = false;
                    // 谷歌
                    validate.activeGoogle(() => {
                        this.loginEnter();
                    });
                    this.is2fa = true;
                    m.redraw();
                } else {
                    this.getUserInfo();
                }
                // this.loginSms = res.result.loginSms;
            } else {
                this.loading = false;
                window.$message({
                    content: errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }).catch(err => {
            window.console.log('tlh', err);
            window.$message({
                content: I18n.$t('10683') + '(请求异常)',
                type: 'danger'
            });
            this.loading = false;
            m.redraw();
        });
    },
    /**
     * 登录接口
     */
    loginEnter() {
        webApi.loginWebV2({}).then(res => {
            if (res.result.code === 0) {
                this.checkAccountPwd();
                this.getUserInfo();
            } else {
                window.$message({
                    content: I18n.$t('10683') + `(${res.result.code})`,
                    type: 'danger'
                });
                this.loading = false;
                m.redraw();
            }
        }).catch(err => {
            window.console.log('tlh', err);
            window.$message({
                content: I18n.$t('10683') + '(请求异常)',
                type: 'danger'
            });
            this.loading = false;
            m.redraw();
        });
    },
    /**
     * 获取用户信息
     */
    getUserInfo() {
        models.getUserInfo();
    },
    // 判断是否设置资产密码
    checkAccountPwd(self) {

    },
    /**
     * 加载极验
     */
    initGeetest() {
        geetest.init(() => {
        });
        broadcast.onMsg({
            key: 'login',
            cmd: 'geetestMsg',
            cb: res => {
                if (res === 'success') {
                    this.loginFn(self);
                } else {
                    this.loading = false;
                    m.redraw();
                }
            }
        });
    },
    oninit() {
        if (utils.getItem('loginState') && utils.getItem('ex-session')) {
            window.router.push('/home');
            return;
        }
        if (utils.getItem('userAccount')) {
            this.account = utils.getItem('userAccount');
        }
        this.initGeetest();
        broadcast.onMsg({
            key: 'login',
            cmd: broadcast.GET_USER_INFO_READY,
            cb: res => {
                if (res) {
                    this.loading = false;
                    utils.setItem('loginState', true);
                    window.router.push('/home');
                } else {
                    this.loading = false;
                    m.redraw();
                }
            }
        });
    },
    onremove() {
        this.is2fa = false;
        this.showPassword = false;
        validate.close();
        broadcast.offMsg({
            key: 'login',
            cmd: 'geetestMsg',
            isall: true
        });
        broadcast.offMsg({
            key: 'login',
            cmd: 'getUserInfo',
            isall: true
        });
    }
};