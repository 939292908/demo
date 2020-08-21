const m = require('mithril');
const geetest = require('@/libs/oldGeetestTwo');
const md5 = require('md5');

module.exports = {
    account: '',
    password: '',
    loginType: 'phone',
    loading: false,
    is2fa: false,
    /**
     * 验证码列表
     * [
     *      {
     *          key: window.validate.sms,
     *          name: '手机验证码',
     *          code: ''
     *      },
     *      ...
     * ]
     */
    // validateCode: [], // 验证码列表
    rulesEmail: {
        required: value => !!value || '该字段不能为空', // 该字段不能为空
        email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || window.gI18n.$t('10668'); // 邮箱格式不正确
        }
    },
    rulesPhone: {
        required: value => !!value || '该字段不能为空', // 该字段不能为空
        phone: value => {
            const pattern = /^[1][0-9]{10}$/;
            return pattern.test(value) || window.gI18n.$t('10669'); // 手机号码不正确
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
        window.gWebApi.loginCheckV2({
            loginType: this.loginType,
            loginName: this.account,
            pass: md5(this.password),
            exChannel: window.exchId
        }, res => {
            if (res.result.code === 0) {
                // 2fa 设置: email2fa, phone2fa, ga2fa
                if (!!res.result.phone && !!res.result.googleId) {
                    this.loading = false;
                    // 手机和谷歌
                    window.validate.activeSmsAndGoogle({
                        securePhone: window.utils.hideMobileInfo(res.result.phone),
                        phoneNum: res.result.phone
                    }, () => {
                        this.loginEnter();
                    });
                    this.is2fa = true;
                    m.redraw();
                } else if (res.result.phone) {
                    this.loading = false;
                    // 手机
                    window.validate.activeSms({
                        securePhone: window.utils.hideMobileInfo(res.result.phone),
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
                    window.validate.activeGoogle(() => {
                        this.loginEnter();
                    });
                    this.is2fa = true;
                    m.redraw();
                } else {
                    this.getUserInfo();
                }
                // this.loginSms = res.result.loginSms;
            } else {
                window.$message({
                    content: window.errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }, err => {
            window._console.log('tlh', err);
            window.$message({
                content: window.gI18n.$t('10683') + '(请求异常)',
                type: 'danger'
            });
            this.loading = false;
            m.redraw();
        });
    },
    loginEnter() {
        window.gWebApi.loginWebV2({}, res => {
            if (res.result.code === 0) {
                this.checkAccountPwd();
                this.getUserInfo();
            } else {
                window.$message({
                    content: window.gI18n.$t('10683') + `(${res.result.code})`,
                    type: 'danger'
                });
                this.loading = false;
                m.redraw();
            }
        }, err => {
            window._console.log('tlh', err);
            window.$message({
                content: window.gI18n.$t('10683') + '(请求异常)',
                type: 'danger'
            });
            this.loading = false;
            m.redraw();
        });
    },
    getUserInfo() {
        window.gWebApi.getUserInfo({}, data => {
            window.gWebApi.loginState = true;
            self.loading = false;
            if (data.result.code === 0) {
                window.utils.setItem('userAccount', data.account.accountName);
                window.utils.setItem('userInfo', data.account);
                // window.gBroadcast.emit({cmd: 'setShowPhone', data: !!res.account.phone});
                // window.gBroadcast.emit({cmd: 'setShowGoogle', data: !!res.account.googleId});self.$store.dispatch("setIsLogin", true);
                // 获取个人信息成功
                // window.gBroadcast.emit({cmd: "addAccount", data: data.account});

                // 发送登录邮件、短信
                // self.sendloginTip(data.account)

                // if (store.state.httpResCheckCfg.state[10] == 2) {
                //     this.$set(store.state.httpResCheckCfg.state, 10, 0)
                // }
                // window.gBroadcast.emit({cmd: "getDeivceInfo", data: {op: 'login'}});
                window.gWebApi.loginState = true;
                window.router.push('/home');
            } else if (data.result.code === 1001) {
                // 获取个人信息不成功
                // window.gBroadcast.emit({cmd: "setIsLogin", data: false});
            }
        }, err => {
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
        window.gBroadcast.onMsg({
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
        if (window.gWebApi.loginState && window.utils.getItem('ex-session')) {
            window.router.push('/home');
            return;
        }
        if (window.utils.getItem('userAccount')) {
            this.account = window.utils.getItem('userAccount');
        }
        this.initGeetest();
    },
    onremove() {
        this.is2fa = false;
        window.validate.close();
        window.gBroadcast.offMsg({
            key: 'login',
            cmd: 'geetestMsg',
            isall: true
        });
    }
};