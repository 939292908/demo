let m = require('mithril')
let geetest = require('@/libs/geetestTwo')
let md5 = require('md5')

module.exports = {
    account: 'qwer2@qq.com',
    password: '123456ly',
    loginType: "phone",
    // account: '233233233',
    // password: 'a123456',
    // loginType: 'phone',
    loading: false,
    code: '',
    isValidate: false,
    rulesEmail: {
        required: value => !!value || '该字段不能为空', //该字段不能为空
        email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || gI18n.$t('10668'); // 邮箱格式不正确
        }
    },
    rulesPhone: {
        required: value => !!value || '该字段不能为空', //该字段不能为空
        phone: value => {
            const pattern = /^[1][0-9]{10}$/;
            return pattern.test(value) || gI18n.$t("10669"); // 手机号码不正确
        }
    },
    rulesAll: {
        required: value => !!value || '该字段不能为空' //该字段不能为空
    },
    rulesPwd: {
        required: value => !!value || '该字段不能为空' //该字段不能为空
    },
    valid() {
        return !!(this.password && this.account);
    },
    login() {
        let that = this
        if (this.valid) {
            this.loading = true;
            geetest.verify(() => {
                that.loading = false
            })
        }
    },
    loginFn() {
        let self = this;
        gWebApi.loginCheck({
            loginType: this.loginType,
            loginName: this.account,
            pass: md5(this.password),
            exChannel: exchId
        }, res => {
            if (res.result.code === 0) {
                // gBroadcast.emit({cmd: 'setShowPhone', data: !!res.result.phone});
                // gBroadcast.emit({cmd: 'setShowGoogle', data: !!res.result.googleId});
                gWebApi.loginSms = res.result.loginSms;
                if (res.result.tfa === 0) {
                    // 登录成功
                    self.getUserInfo();
                    self.checkAccountPwd();
                } else if (res.result.tfa === 1) {
                    // 手机
                    self.loading = false;
                    validate.activeSms({phoneNum: res.result.phone}, self.loginEnter);
                } else if (res.result.tfa === 2) {
                    // 谷歌

                    self.loading = false;

                    validate.activeGoogle(()=>{
                        // self.isValidate = false;
                        // m.redraw();
                        self.loginEnter();
                    });
                    self.isValidate = true;
                    m.redraw();
                } else if (res.result.tfa === 3) {
                    // 手机和谷歌
                    self.loading = false;

                    validate.activeGoogle(
                        ()=>{
                            // self.isValidate = false;
                            // m.redraw();
                            self.loginEnter();
                        }
                    );
                    self.isValidate = true;
                    m.redraw();
                }
            }
        }, err => {
            _console.log('tlh',err);
            $message({content: gI18n.$t('10683') + '(请求异常)', type: 'danger'});
            this.loading = false;
        })
    },
    loginEnter() {
        gWebApi.loginWeb({}, res => {
            if (res.result.code === 0) {
                this.checkAccountPwd();
                this.getUserInfo();
            } else {
                $message({content: gI18n.$t('10683') + `(${res.result.code})`, type: 'danger'});
                this.loading = false;
                validate.close();
            }
        }, err => {
            _console.log('tlh',err);
            $message({content: gI18n.$t("10683") + '(请求异常)', type: 'danger'});
            this.loading = false;
            validate.close();
        });
    },
    getUserInfo() {
        gWebApi.getUserInfo({}, data => {
            gWebApi.loginState = true
            self.loading = false;
            if (data.result.code === 0) {
                utils.setItem('userAccount', data.account.accountName);
                utils.setItem('userInfo', data.account);
                // gBroadcast.emit({cmd: 'setShowPhone', data: !!res.account.phone});
                // gBroadcast.emit({cmd: 'setShowGoogle', data: !!res.account.googleId});self.$store.dispatch("setIsLogin", true);
                // 获取个人信息成功
                // gBroadcast.emit({cmd: "addAccount", data: data.account});

                // 发送登录邮件、短信
                // self.sendloginTip(data.account)

                // if (store.state.httpResCheckCfg.state[10] == 2) {
                //     this.$set(store.state.httpResCheckCfg.state, 10, 0)
                // }
                // gBroadcast.emit({cmd: "getDeivceInfo", data: {op: 'login'}});
                router.push('/home')

            } else if (data.result.code === 1001) {
                // 获取个人信息不成功
                // gBroadcast.emit({cmd: "setIsLogin", data: false});
            }
        }, err => {
            $message({content: `网络异常，请稍后重试 ${err}`, type: 'danger'});
            this.loading = false;
        });
    },
    // 判断是否设置资产密码
    checkAccountPwd(self) {

    },
    initGeetest() {
        geetest.init(() => {
        });
        gBroadcast.onMsg({
            key: 'login',
            cmd: 'geetestMsg',
            cb: res => {
                if (res == 'success') {
                    this.loginFn(self);
                } else {
                    this.loading = false;
                }
            }
        });
    },
    oninit() {
        // if (utils.getItem('userAccount')) {
        //     this.account = utils.getItem('userAccount');
        // }
        this.initGeetest();
    },
    onremove() {
        gBroadcast.offMsg({
            key: 'login',
            cmd: 'geetestMsg',
            isall: true
        })
    },
}