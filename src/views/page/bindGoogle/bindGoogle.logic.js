const Http = require('@/api').webApi;
const m = require('mithril');
const Qrcode = require('qrcode');
const broadcast = require('@/broadcast/broadcast');
const geetest = require('@/models/validate/geetest').default;
const validate = require('@/models/validate/validate').default;
const config = require('@/config');
const I18n = require('@/languages/I18n').default;
const md5 = require('md5');
const gM = require('@/models/globalModels');
const errCode = require('@/util/errCode').default;

module.exports = {
    secret: '', /* 密钥 */
    IOSDLAdd: 'https://apps.apple.com/us/app/google-authenticator/id388497605',
    AndroidDLAdd: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2',
    loginType: null, // 账户类型
    setting2fa: null, // 账户绑定状态
    email: null, // 用户邮箱
    nationNo: null, // 区号
    phoneNum: null, // 手机号码
    CurrentOperation: 'bind', // 当前为解绑/绑定操作
    isShowVerifyView: false, // 安全校验弹框 show
    switchSafetyVerifyModal (type) { // 安全校验弹框 显示/隐藏
        this.isShowVerifyView = type;
    },
    flag: false, // 是否满足要求（码不为空）
    pwdTipFlag: false, // 密码错误提示 默认不显示（false）
    codeTipFlag: false, // 谷歌验证码错误提示 默认不显示（false）
    IOSDLAddQrCodeSrc: null, // IOS下载二维码地址
    AndroidDLAddQrCodeSrc: null, // Android Q下载二维码地址
    secretQrCodeSrc: null, // 秘钥二维码地址

    /* 生成IOS，Android，密钥二维码 begin */
    generateQRCode() {
        const that = this;
        // 获取秘钥（用于绑定google验证）
        Http.getGoogleSecret().then(function(arg) {
            // console.log('nzm', 'getGoogleSecret success', arg);
            that.secret = arg.secret;
            // 生成密钥二维码
            that.generatedCodeFN(arg.secret, 'key');
            m.redraw();
        }).catch(function(err) {
            console.log('nzm', 'getGoogleSecret error', err);
        });
        // 生成IOS下载地址二维码
        this.generatedCodeFN(this.IOSDLAdd, 'IOS');
        // 生成Android下载地址二维码
        this.generatedCodeFN(this.AndroidDLAdd, 'Android');
    },
    generatedCodeFN: function(text, type) {
        if (type === 'key') {
            Qrcode.toDataURL(text || '无')
                .then(url => {
                    this.secretQrCodeSrc = url;
                }).catch(err => {
                    console.log(err);
                });
        } else if (type === 'IOS') {
            Qrcode.toDataURL(text || '无')
                .then(url => {
                    this.IOSDLAddQrCodeSrc = url;
                }).catch(err => {
                    console.log(err);
                });
        } else if (type === 'Android') {
            Qrcode.toDataURL(text || '无')
                .then(url => {
                    this.AndroidDLAddQrCodeSrc = url;
                }).catch(err => {
                    console.log(err);
                });
        }
    },
    /* 生成IOS，Android，密钥二维码 end */

    confirmBtn: function (type) {
        // console.log(this.loginType, this.setting2fa, this.email, this.nationNo, this.phoneNum);
        this.isShowflag = false;
        this.CurrentOperation = type;
        if (this.check()) {
            // return;
        }
        geetest.verify(); // 极验
        // this.ChooseVerify();
    },
    // 校验密码输入是否符合标准与谷歌码
    check() {
        const pwd = document.getElementsByClassName('pwd')[0].value;
        const code = document.getElementsByClassName('code')[0].value;
        pwd === '' ? this.pwdTipFlag = true : this.pwdTipFlag = false;
        code === '' ? this.codeTipFlag = true : this.codeTipFlag = false;
        if (this.codeTipFlag === true || this.pwdTipFlag === true) {
            return true;
        } else {
            return false;
        }
    },
    // 加载极验
    initGeetest() {
        const that = this;
        geetest.init(() => {
        });
        broadcast.onMsg({
            key: 'BindGoogle',
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
    ChooseVerify() {
        if (this.setting2fa.email === 0 && this.setting2fa.phone === 0) {
            console.log('未绑定手机与邮箱');
            return;
        }
        if (this.setting2fa.email === 1 && this.setting2fa.phone === 0) {
            console.log('已绑定邮箱');
            this.initSecurityVerification(1);
        } else if (this.setting2fa.email === 0 && this.setting2fa.phone === 1) {
            console.log('已绑定手机');
            this.initSecurityVerification(2);
        } else if (this.setting2fa.email === 1 && this.setting2fa.phone === 1) {
            console.log('已绑定手机和邮箱');
            this.initSecurityVerification(3);
        }
        this.switchSafetyVerifyModal(true); // 打开弹框
    },
    // 初始化安全验证          typeFlag: 1：邮箱 2：手机 3：邮箱收集双切换验证
    initSecurityVerification(typeFlag) {
        const that = this;
        let params = null;
        if (typeFlag === 1) {
            params = {
                secureEmail: that.email,
                host: config.official,
                fn: 'be',
                lang: I18n.getLocale()
            };
            validate.activeEmail(params, function() {
                that.CurrentOperation === 'bind' ? that.bindGoogle() : that.unbindGoogle();
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
                that.CurrentOperation === 'bind' ? that.bindGoogle() : that.unbindGoogle();
            });
        } else if (typeFlag === 3) {
            params = {
                emailConfig: {
                    secureEmail: that.email,
                    host: config.official,
                    fn: 'be',
                    lang: I18n.getLocale()
                },
                smsConfig: {
                    areaCode: that.nationNo, // 区号
                    phoneNum: that.phoneNum, // 手机号
                    resetPwd: true, // 是否重置密码
                    lang: I18n.getLocale(),
                    mustCheckFn: "" // 验证类型
                }
            };
            console.log(params);
            validate.activeSmsAndEmail(params, function() {
                that.CurrentOperation === 'bind' ? that.bindGoogle() : that.unbindGoogle();
            });
        }
    },
    // 绑定谷歌验证
    bindGoogle: function() {
        const that = this;
        // 密钥
        const opInfo = this.secret;
        // 用户密码
        const password = document.getElementsByClassName('pwd')[0].value;
        // google验证码
        const code = document.getElementsByClassName('code')[0].value;

        Http.bindGoogleAuth({
            opInfo: opInfo,
            password: md5(password),
            code: code
        }).then(function(arg) {
            console.log('nzm', 'bindGoogleAuth success', arg);
            if (arg.result.code === 0) {
                console.log('success');
            } else {
                window.$message({ content: errCode.getWebApiErrorCode(arg.result.code), type: 'danger' });
            }
            that.switchSafetyVerifyModal(false); // 关闭安全验证弹框
            m.redraw();
        }).catch(function(err) {
            console.log('nzm', 'bindGoogleAuth error', err);
        });
    },
    // 解绑谷歌验证
    unbindGoogle: function() {
        const that = this;
        // 用户密码
        const password = document.getElementsByClassName('pwd')[0].value;
        // google验证码
        const code = document.getElementsByClassName('code')[0].value;
        Http.relieveGoogleAuth({
            password: md5(password),
            code: code
        }).then(function(arg) {
            console.log('nzm', 'relieveGoogleAuth success', arg);
            if (arg.result.code === 0) {
                console.log('success');
            } else {
                window.$message({ content: errCode.getWebApiErrorCode(arg.result.code), type: 'danger' });
            }
            that.switchSafetyVerifyModal(false); // 关闭安全验证弹框
            m.redraw();
        }).catch(function(err) {
            console.log('nzm', 'relieveGoogleAuth error', err);
        });
    },
    // 获取用户信息
    getUserInfo() {
        const account = gM.getAccount();
        // console.log(account);
        this.loginType = account.loginType; // 账户类型
        this.setting2fa = account.setting2fa; // 账户绑定状态
        this.email = account.email; // 用户邮箱
        this.nationNo = account.nationNo; // 区号
        this.phoneNum = account.phone; // 用户手机号码
    },
    initFn: function() {
        broadcast.onMsg({
            key: 'index',
            cmd: broadcast.GET_USER_INFO_READY,
            cb: () => {
                // console.log(gM.getAccount());
                this.getUserInfo();
            }
        });
        this.getUserInfo();
        this.initGeetest();
        this.generateQRCode();
    },
    removeFn: function() {
        broadcast.offMsg({
            key: 'BindGoogle',
            cmd: 'geetestMsg',
            isall: true
        });
        broadcast.offMsg({
            key: 'index',
            isall: true
        });
    }
};