const { getUserInfo, loginCheckV2, loginWebV2 } = require('@/newApi');
const m = require('mithril');
const geetest = require('@/models/validate/geetest').default;
const md5 = require('md5');
const utils = require('@/util/utils').default;
const I18n = require('@/languages/I18n').default;
const broadcast = require('@/broadcast/broadcast');
const errCode = require('@/util/errCode').default;
const config = require('@/config');
const validate = require('@/models/validate/validate').default;

module.exports = {
    account: '233233233',
    password: 'a123456',
    loginType: 'phone',
    loading: false,
    is2fa: false,
    rulesEmail: {
        required: value => !!value || '该字段不能为空', // 该字段不能为空
        email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || I18n.$t('10668'); // 邮箱格式不正确
        }
    },
    rulesPhone: {
        required: value => !!value || '该字段不能为空', // 该字段不能为空
        phone: value => {
            const pattern = /^[1][0-9]{10}$/;
            return pattern.test(value) || I18n.$t('10669'); // 手机号码不正确
        }
    },
    rulesAll: {
        required: value => !!value || '该字段不能为空' // 该字段不能为空
    },
    rulesPwd: {
        required: value => !!value || '该字段不能为空' // 该字段不能为空
    },
    valid() {
        return !!(this.password && this.account);
    },
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
    loginFn() {
        loginCheckV2({
            loginType: this.loginType,
            loginName: this.account,
            pass: md5(this.password),
            exChannel: config.exchId
        }).then(res => {
            if (res.result.code === 0) {
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
    loginEnter() {
        loginWebV2({}).then(res => {
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
    getUserInfo() {
        getUserInfo({}).then(data => {
            utils.setItem('loginState', true);
            self.loading = false;
            if (data.result.code === 0) {
                utils.setItem('userAccount', data.account.accountName);
                utils.setItem('userInfo', data.account);
                // broadcast.emit({cmd: 'setShowPhone', data: !!res.result.account.phone});
                // broadcast.emit({cmd: 'setShowGoogle', data: !!res.result.account.googleId});self.$store.dispatch("setIsLogin", true);
                // 获取个人信息成功
                // broadcast.emit({cmd: "addAccount", data: data.account});

                // 发送登录邮件、短信
                // self.sendloginTip(data.account)

                // if (store.state.httpResCheckCfg.state[10] == 2) {
                //     this.$set(store.state.httpResCheckCfg.state, 10, 0)
                // }
                // broadcast.emit({cmd: "getDeivceInfo", data: {op: 'login'}});
                utils.setItem('loginState', true);
                window.router.push('/home');
            } else if (data.result.code === 1001) {
                // 获取个人信息不成功
                // broadcast.emit({cmd: "setIsLogin", data: false});
            }
        }).catch(err => {
            window.$message({
                content: `网络异常，请稍后重试 ${err}`,
                type: 'danger'
            });
            this.loading = false;
            m.redraw();
        });
    },
    // 判断是否设置资产密码
    checkAccountPwd(self) {

    },
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
    },
    onremove() {
        this.is2fa = false;
        validate.close();
        broadcast.offMsg({
            key: 'login',
            cmd: 'geetestMsg',
            isall: true
        });
    }
};