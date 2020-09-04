const webApi = require('@/api').webApi;
const m = require('mithril');
const geetest = require('@/models/validate/geetest').default;
const md5 = require('md5');
const utils = require('@/util/utils').default;
// const I18n = require('@/languages/I18n').default;
const broadcast = require('@/broadcast/broadcast');
const errCode = require('@/util/errCode').default;
const config = require('@/config');
const validate = require('@/models/validate/validate').default;
const models = require('@/models');
const regExp = require('@/models/validate/regExp');

module.exports = {
    account: '', // 账号
    password: '', // 密码
    loginType: 'phone', // 账号类型 phone 手机，email 邮箱
    loading: false, // 按钮loading
    showPassword: false, // 显示密码
    showValidAccount: false,
    showValidPassword: false,
    is2fa: false, // 2fa验证状态
    changeType() {
        if (/@/.test(this.account)) {
            this.loginType = 'email';
        } else {
            this.loginType = 'phone';
        }
    },
    /**
     * 登录
     */
    login() {
        const that = this;
        if (!regExp.validAccount(this.loginType, this.account) && !regExp.validPassword(this.password)) {
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
                content: '系统繁忙请稍后再试(请求异常)',
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
                    content: `系统繁忙请稍后再试(${res.result.code})`,
                    type: 'danger'
                });
                this.loading = false;
                m.redraw();
            }
        }).catch(err => {
            window.console.log('tlh', err);
            window.$message({
                content: '系统繁忙请稍后再试(请求异常)',
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
        models.getUserInfo(true);
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
            window.router.push(window.router.defaultRoutePath);
            return;
        }
        if (utils.getItem('userAccount')) {
            this.account = utils.getItem('userAccount');
            this.changeType();
        }
        this.initGeetest();
        broadcast.onMsg({
            key: 'login',
            cmd: broadcast.GET_USER_INFO_READY,
            cb: res => {
                if (res) {
                    this.loading = false;
                    utils.setItem('loginState', true);
                    window.router.push(window.router.defaultRoutePath);
                } else {
                    this.loading = false;
                    m.redraw();
                }
            }
        });
    },
    cleanUp() {
        this.is2fa = false;
        this.showPassword = false;
        this.showValidAccount = false;
        this.showValidPassword = false;
        this.account = '';
        this.password = '';
    },
    onremove() {
        this.cleanUp();
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