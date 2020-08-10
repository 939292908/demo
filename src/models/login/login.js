const m = require('mithril');
const geetest = require('@/libs/geetestTwo');
const md5 = require('md5');

module.exports = {
    // account: 'qwer2@qq.com',
    // password: '123456ly',
    // loginType: "phone",
    account: '233233233',
    password: 'a123456',
    loginType: 'phone',
    loading: false,
    code: '',
    validateType: [],
    validInput: [],
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
            return pattern.test(value) || window.gI18n.$t("10669"); // 手机号码不正确
        }
    },
    rulesAll: {
        required: value => !!value || '该字段不能为空' // 该字段不能为空
    },
    rulesPwd: {
        required: value => !!value || '该字段不能为空' // 该字段不能为空
    },
    setValidInput () {
        if (!this.validateType.length) return;
        this.validInput = [];
        for (const item of this.validateType) {
            this.validInput.push(m('div.py-0.mb-2', {}, [item.name]));
            this.validInput.push(m('input.input[type=text].mb-6', {
                oninput: e => {
                    this.code[item.key] = e.target.value;
                },
                value: this.code[item.key]
            }, []));
        }
        m.redraw();
    },
    valid () {
        return !!(this.password && this.account);
    },
    login () {
        const that = this;
        if (/@/.test(this.account)) {
            this.loginType = "email";
        } else {
            this.loginType = "phone";
        }
        if (this.valid) {
            this.loading = true;
            geetest.verify(() => {
                that.loading = false;
            });
        }
    },
    loginFn () {
        const self = this;
        window.gWebApi.loginCheck({
            loginType: this.loginType,
            loginName: this.account,
            pass: md5(this.password),
            exChannel: window.exchId
        }, res => {
            if (res.result.code === 0) {
                // window.gBroadcast.emit({cmd: 'setShowPhone', data: !!res.result.phone});
                // window.gBroadcast.emit({cmd: 'setShowGoogle', data: !!res.result.googleId});
                window.gWebApi.loginSms = res.result.loginSms;
                if (res.result.tfa === 0) {
                    // 登录成功
                    self.getUserInfo();
                    self.checkAccountPwd();
                } else if (res.result.tfa === 1) {
                    // 手机
                    self.loading = false;
                    window.validate.activeSms(
                        { phoneNum: res.result.phone },
                        () => {
                            self.loginEnter();
                        }
                    );
                    self.validateType = [{ key: 'phone', name: '手机验证码' }];
                    self.setValidInput();
                } else if (res.result.tfa === 2) {
                    // 谷歌

                    self.loading = false;

                    window.validate.activeGoogle(() => {
                        // self.validateType = false;
                        // m.redraw();
                        self.loginEnter();
                    });
                    self.validateType = [{ key: 'google', name: '谷歌验证码' }];
                    self.setValidInput();
                } else if (res.result.tfa === 3) {
                    // 手机和谷歌
                    self.loading = false;

                    window.validate.activeGoogle(
                        () => {
                            // self.validateType = false;
                            // m.redraw();
                            self.loginEnter();
                        }
                    );
                    self.validateType = [{ key: 'google', name: '谷歌验证码' }, { key: 'phone', name: '手机验证码' }];
                    self.setValidInput();
                }
            } else {
                window.$message({ content: window.errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
            }
        }, err => {
            window._console.log('tlh', err);
            window.$message({ content: window.gI18n.$t('10683') + '(请求异常)', type: 'danger' });
            this.loading = false;
        });
    },
    loginEnter () {
        window.gWebApi.loginWeb({}, res => {
            if (res.result.code === 0) {
                this.checkAccountPwd();
                this.getUserInfo();
            } else {
                window.$message({ content: window.gI18n.$t('10683') + `(${res.result.code})`, type: 'danger' });
                this.loading = false;
            }
        }, err => {
            window._console.log('tlh', err);
            window.$message({ content: window.gI18n.$t("10683") + '(请求异常)', type: 'danger' });
            this.loading = false;
        });
    },
    getUserInfo () {
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
            window.$message({ content: `网络异常，请稍后重试 ${err}`, type: 'danger' });
            this.loading = false;
        });
    },
    // 判断是否设置资产密码
    checkAccountPwd (self) {

    },
    initGeetest () {
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
                }
            }
        });
    },
    oninit () {
        if (window.gWebApi.loginState && window.utils.getItem("ex-session")) {
            window.router.push('/home');
            return;
        }
        if (window.utils.getItem('userAccount')) {
            this.account = window.utils.getItem('userAccount');
        }
        this.initGeetest();
    },
    onremove () {
        window.gBroadcast.offMsg({
            key: 'login',
            cmd: 'geetestMsg',
            isall: true
        });
    }
};