const Http = require('@/api').webApi;
const md5 = require('md5');
const m = require('mithril');
const geetest = require('@/models/validate/geetest').default;
const broadcast = require('@/broadcast/broadcast');
const validate = require('@/models/validate/validate').default;
const I18n = require('@/languages/I18n').default;
const gM = require('@/models/globalModels');
const errCode = require('@/util/errCode').default;
const { logOut } = require('@/api/').webApi;
const utils = require('@/util/utils').default;
const globalModels = require('@/models/globalModels');

module.exports = {
    loginType: null, // 登录类型
    setting2fa: null, // 账户绑定状态
    nationNo: null, // 区号
    phoneNum: null, // 用户手机号码
    isShowVerifyView: false, // 安全校验弹框 show
    oldLpwd: '', // 输入的旧密码
    newLpwd: '', // 输入的新密码
    confirmLpwd: '', // 输入的确认密码
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
                    that.ChooseVerify();
                } else {
                    console.log('error initGeetest');
                }
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
                phoneNum: that.nationNo + '-' + that.phoneNum, // 手机号
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
                    phoneNum: that.nationNo + '-' + that.phoneNum, // 手机号
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
        const oldPwd = document.getElementsByTagName('input')[0].value;
        const newPwd = document.getElementsByTagName('input')[1].value;
        const confirmPwd = document.getElementsByTagName('input')[2].value;
        const that = this;

        Http.changePasswd({
            oldPasswd: md5(oldPwd),
            Passwd1: md5(newPwd),
            Passwd2: md5(confirmPwd)
        }).then(function(arg) {
            console.log('nzm', 'changePasswd success', arg);
            if (arg.result.code === 0) {
                console.log('success');
                window.$message({ content: '密码修改成功', type: 'danger' });
                that.loginOut();
                window.router.push('/login');
            } else {
                console.log('arg.result.code', arg.result.code, errCode.getWebApiErrorCode(arg.result.code));
                // window.$message({ content: errCode.getWebApiErrorCode(arg.result.code), type: 'danger' });
            }
            that.switchSafetyVerifyModal(false); // 关闭安全验证弹框
            m.redraw();
        }).catch(function(err) {
            console.log('nzm', 'changePasswd error', err);
        });
    },
    loginOut: function () {
        logOut().then(res => {
            utils.removeItem("ex-session");
            utils.setItem('loginState', false);
            globalModels.setAccount({});

            window.router.checkRoute({ path: window.router.path });
            broadcast.emit({
                cmd: broadcast.MSG_LOG_OUT,
                data: {
                    cmd: broadcast.MSG_LOG_OUT
                }
            });
            m.redraw();
        }, err => {
            console.log(err);
        }).catch(err => {
            console.log(err);
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
