let geetest = require('@/libs/geetestTwo')
let md5 = require('md5')

module.exports = {
    account: 'qwer2@qq.com',
    password: '123456ly',
    loginType: "phone",
    loading: false,
    rulesEmail: {
        required: value => !!value || gI18n.$t("10015"), //该字段不能为空
        email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || gI18n.$t("10668"); // 邮箱格式不正确
        }
    },
    rulesPhone: {
        required: value => !!value || gI18n.$t("10015"), //该字段不能为空
        phone: value => {
            const pattern = /^[1][0-9]{10}$/;
            return pattern.test(value) || gI18n.$t("10669"); // 手机号码不正确
        }
    },
    rulesAll: {
        required: value => !!value || gI18n.$t("10015") //该字段不能为空
    },
    rulesPwd: {
        required: value => !!value || gI18n.$t("10015") //该字段不能为空
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
        gWebApi.loginCheck({
            loginType: this.loginType,
            loginName: this.account,
            pass: md5(this.password),
            exChannel: exchId
        }, res => {
            _console.log('tlh')
            if (res.result.code === 0) {
                // gBroadcast.emit({cmd: 'setShowPhone', data: !!res.result.phone});
                // gBroadcast.emit({cmd: 'setShowGoogle', data: !!res.result.googleId});
                gWebApi.loginSms = res.result.loginSms;
                if (res.result.tfa === 0) {
                    // 登录成功
                    gWebApi.getUserInfo({}, data => {
                        utils.setItem('userAccount', data.account.accountName);
                        utils.setItem('userInfo', data.account);
                        // gBroadcast.emit({cmd: 'setShowPhone', data: !!res.account.phone});
                        // gBroadcast.emit({cmd: 'setShowGoogle', data: !!res.account.googleId});
                    }, err => {
                        $message({content: `网络异常，请稍后重试 ${err}`});
                        this.loading = false;
                    });
                } else if (res.data.result.tfa === 1) {
                    // 手机
                    this.loading = false;
                    // this.validate.activeSms({
                    //         phoneNum: res.data.result.phone
                    //     },
                    //     this.Login
                    // );
                } else if (res.data.result.tfa === 2) {
                    // 谷歌
                    this.loading = false;
                    // this.validate.activeGoogle(this.Login);
                } else if (res.data.result.tfa === 3) {
                    // 手机和谷歌
                    this.loading = false;
                    // this.validate.activeGoogle(this.Login);
                }
            }
        }, err => {
            $message({content: this.$t("10683") + '(请求异常)'});
            this.loading = false;
        })
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