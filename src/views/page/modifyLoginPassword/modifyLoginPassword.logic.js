const Http = require('@/api').webApi;
const md5 = require('md5');
const m = require('mithril');
const geetest = require('@/models/validate/geetest').default;
const broadcast = require('@/broadcast/broadcast');
const validate = require('@/models/validate/validate').default;
const I18n = require('@/languages/I18n').default;

module.exports = {
    setting2fa: null, // 账户绑定状态
    nationNo: null, // 区号
    phoneNum: null, // 用户手机号码
    isShowVerifyView: false, // 安全校验弹框 show
    // 安全校验弹框 显示/隐藏
    switchSafetyVerifyModal (type) {
        this.isShowVerifyView = type;
    },
    confirmBtn: function() {
        geetest.verify(); // 极验
    },
    // 加载极验
    initGeetest() {
        const that = this;
        geetest.init(() => {
        });
        broadcast.onMsg({
            key: 'updatePWD',
            cmd: 'geetestMsg',
            cb: res => {
                if (res === 'success') {
                    // 成功则进入安全验证
                    console.log('success', 11111111111);
                    m.redraw();
                    that.ChooseVerify();
                } else {
                    console.log('error');
                }
            }
        });
    },
    // 选择验证方式
    ChooseVerify: function () {
        console.log(this.setting2fa);
        if (this.setting2fa.google === 0 && this.setting2fa.phone === 0) {
            console.log('未绑定手机与谷歌');
            return;
        }
        if (this.setting2fa.google === 1 && this.setting2fa.phone === 0) {
            console.log('已绑定谷歌');
            this.initSecurityVerification(1);
        } else if (this.setting2fa.google === 0 && this.setting2fa.phone === 1) {
            console.log('已绑定手机');
            this.initSecurityVerification(2);
        } else if (this.setting2fa.google === 1 && this.setting2fa.phone === 1) {
            console.log('已绑定手机和谷歌');
            this.initSecurityVerification(3);
        }
        this.switchSafetyVerifyModal(true); // 打开弹框
    },
    // 初始化安全验证          typeFlag: 1：谷歌 2：手机 3：谷歌手机双切换验证
    initSecurityVerification: function (typeFlag) {
        const that = this;
        let params = null;
        if (typeFlag === 1) {
            validate.activeGoogle(function() {
                that.changePassword();
            });
        } else if (typeFlag === 2) {
            params = {
                areaCode: that.nationNo, // 区号
                phoneNum: that.phoneNum, // 手机号
                resetPwd: true, // 是否重置密码
                lang: I18n.getLocale(),
                mustCheckFn: "" // 验证类型
            };
            validate.activeSms(params, function() {
                that.changePassword();
            });
            console.log(2);
        } else if (typeFlag === 3) {
            params = {
                smsConfig: {
                    areaCode: that.nationNo, // 区号
                    phoneNum: that.phoneNum, // 手机号
                    resetPwd: true, // 是否重置密码
                    lang: I18n.getLocale(),
                    mustCheckFn: "" // 验证类型
                }
            };
            console.log(params);
            validate.activeSmsAndGoogle(params, function() {
                that.changePassword();
            });
        }
    },
    changePassword: function () {
        const oldPwd = document.getElementsByClassName('oldPwd')[0].value;
        const newPwd = document.getElementsByClassName('newPwd')[0].value;
        const confirmPwd = document.getElementsByClassName('confirmPWd')[0].value;
        console.log(oldPwd, newPwd, confirmPwd);
        const that = this;

        Http.changePasswd({
            password: md5(oldPwd),
            Passwd1: md5(newPwd),
            Passwd2: md5(confirmPwd)
        }).then(function(arg) {
            console.log('nzm', 'changePasswd success', arg);
            if (arg.result.code === 0) {
                console.log('success');
                // that.switchSafetyVerifyModal(false); // 关闭安全验证弹框
            }
            that.switchSafetyVerifyModal(false); // 关闭安全验证弹框
        }).catch(function(err) {
            console.log('nzm', 'changePasswd error', err);
        });
    },
    // 获取用户信息
    getUserInfo() {
        const that = this;
        Http.getUserInfo().then(function(arg) {
            // console.log('nzm', 'getUserInfo success', arg);
            if (arg.result.code === 0) {
                that.loginType = arg.account.loginType; // 账户类型
                that.setting2fa = arg.account.setting2fa; // 账户绑定状态
                that.nationNo = arg.account.nationNo; // 区号
                that.phoneNum = arg.account.phone; // 用户手机号码
                m.redraw();
            }
        }).catch(function(err) {
            console.log('nzm', 'getUserInfo error', err);
        });
    },
    initFn: function() {
        this.getUserInfo();
        this.initGeetest();
    },
    removeFn: function() {
        broadcast.offMsg({
            key: 'updatePWD',
            cmd: 'geetestMsg',
            isall: true
        });
    }
};
