const Http = require('@/api').webApi;
const md5 = require('md5');
const m = require('mithril');
const geetest = require('@/models/validate/geetest').default;
const broadcast = require('@/broadcast/broadcast');
const validate = require('@/models/validate/validate').default;
const I18n = require('@/languages/I18n').default;
const gM = require('@/models/globalModels');
const errCode = require('@/util/errCode').default;

module.exports = {
    loginType: null, // 登录类型
    setting2fa: null, // 账户绑定状态
    nationNo: null, // 区号
    phoneNum: null, // 用户手机号码
    isShowVerifyView: false, // 安全校验弹框 show
    // 安全校验弹框 显示/隐藏
    switchSafetyVerifyModal (type) {
        this.isShowVerifyView = type;
    },
    // 确认按钮事件
    confirmBtn: function() {
        /* console.log(this.loginType, this.setting2fa, this.nationNo, this.phoneNum); */
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
                    console.log('success initGeetest');
                    m.redraw();
                    that.checkSmsCode(999999);
                    // that.ChooseVerify();
                } else {
                    console.log('error initGeetest');
                }
            }
        });
    },
    /**
     * 校验短信验证码
     * @param code
     */
    checkSmsCode(code) {
        const that = this;
        if (!code) {
            window.$message({
                content: I18n.$t('10416') /* '该字段不能为空' */,
                type: 'danger'
            });
            return;
        }
        Http.smsVerifyV2({
            phoneNum: that.nationNo + '-' + that.phoneNum, // 手机号
            code: code
        }).then(res => {
            if (res.result === 0) {
                console.log('checkSmsCode success');
                m.redraw();
                that.ChooseVerify();
            } else {
                window.$message({
                    content: errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        });
    },
    // 选择验证方式
    ChooseVerify: function () {
        // console.log(this.setting2fa);
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
        // console.log(oldPwd, newPwd, confirmPwd);
        const that = this;

        Http.changePasswd({
            password: md5(oldPwd),
            Passwd1: md5(newPwd),
            Passwd2: md5(confirmPwd)
        }).then(function(arg) {
            console.log('nzm', 'changePasswd success', arg);
            if (arg.result.code === 0) {
                console.log('success');
            } else {
                window.$message({ content: errCode.getWebApiErrorCode(arg.result.code), type: 'danger' });
            }
            that.switchSafetyVerifyModal(false); // 关闭安全验证弹框
            m.redraw();
        }).catch(function(err) {
            console.log('nzm', 'changePasswd error', err);
        });
    },
    // 获取用户信息
    getUserInfo() {
        const account = gM.getAccount();
        // console.log(account);
        this.loginType = account.loginType; // 账户类型
        this.setting2fa = account.setting2fa; // 账户绑定状态
        this.nationNo = account.nationNo; // 区号
        this.phoneNum = account.phone; // 用户手机号码
    },
    initFn: function() {
        // 获取用户信息
        broadcast.onMsg({
            key: 'index',
            cmd: broadcast.GET_USER_INFO_READY,
            cb: () => {
                this.getUserInfo();
            }
        });
        this.getUserInfo();
        this.initGeetest();
    },
    removeFn: function() {
        broadcast.offMsg({
            key: 'updatePWD',
            cmd: 'geetestMsg',
            isall: true
        });
        broadcast.offMsg({
            key: 'index',
            isall: true
        });
    }
};
