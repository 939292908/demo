const Http = require('@/api').webApi;
const m = require('mithril');
const Qrcode = require('qrcode');
const geetest = require('@/models/validate/geetest').default;
const validate = require('@/models/validate/validate').default;
const broadcast = require('@/broadcast/broadcast');
const config = require('@/config');
const I18n = require('@/languages/I18n').default;

module.exports = {
    // 密钥
    secret: '',
    IOSDLAdd: 'https://apps.apple.com/us/app/google-authenticator/id388497605',
    AndroidDLAdd: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2',
    loginType: null, // 账户类型
    setting2fa: null, // 账户绑定状态
    email: null, // 用户邮箱
    nationNo: null, // 区号
    phoneNum: null, // 手机号码
    isShowVerifyView: false, // 安全校验弹框 show
    CurrentOperation: 'bind', // 当前为解绑/绑定操作
    // 安全校验弹框 显示/隐藏
    switchSafetyVerifyModal (type) {
        this.isShowVerifyView = type;
    },
    flag: false, // 是否满足要求（码不为空）
    pwdTipFlag: false, // 密码错误提示 默认不显示（false）
    codeTipFlag: false, // 谷歌验证码错误提示 默认不显示（false）

    // 生成IOS，Android，密钥二维码 begin
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
        Qrcode.toCanvas(text || '无', {
            errorCorrectionLevel: "L", // 容错率L（低）H(高)
            margin: 1, // 二维码内边距，默认为4。单位px
            height: 110, // 二维码高度
            width: 110 // 二维码宽度
        }).then(canvas => {
            if (type === 'key') {
                document.getElementsByClassName('stepTwo-qrcode')[0].appendChild(canvas);
            } else if (type === 'IOS') {
                document.getElementsByClassName('qrcodeIOS')[0].appendChild(canvas);
            } else if (type === 'Android') {
                document.getElementsByClassName('qrcodeAndroid')[0].appendChild(canvas);
            }
        }).catch((err) => {
            console.log(err);
        });
    },
    // 生成IOS，Android，密钥二维码 end

    confirmBtn: function (type) {
        this.CurrentOperation = type;
        if (this.check()) {
            // return;
        }
        // geetest.verify(); // 极验
        this.ChooseVerify();
    },
    // 校验密码与谷歌码
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
            key: 'openBindGoogle',
            cmd: 'geetestMsg',
            cb: res => {
                if (res === 'success') {
                    // 成功则进入安全验证
                    console.log('success');
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
                    securePhone: '0086-233****3233', // 加密手机号带区号
                    areaCode: that.nationNo, // 区号
                    phoneNum: that.phoneNum, // 手机号
                    resetPwd: true, // 是否重置密码
                    lang: I18n.getLocale(),
                    mustCheckFn: "" // 验证类型
                }
            };
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
            password: password,
            code: code
        }).then(function(arg) {
            console.log('nzm', 'bindGoogleAuth success', arg);
            if (arg.result.code === 0) {
                console.log('success');
            }
            that.switchSafetyVerifyModal(false); // 关闭安全验证弹框
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
            password: password,
            code: code
        }).then(function(arg) {
            console.log('nzm', 'relieveGoogleAuth success', arg);
            if (arg.result.code === 0) {
                console.log('success');
            }
            that.switchSafetyVerifyModal(false); // 关闭安全验证弹框
        }).catch(function(err) {
            console.log('nzm', 'relieveGoogleAuth error', err);
        });
    },
    // 获取用户信息
    getUserInfo() {
        const that = this;
        Http.getUserInfo().then(function(arg) {
            console.log('nzm', 'getUserInfo success', arg);
            if (arg.result.code === 0) {
                that.loginType = arg.account.loginType; // 账户类型
                that.setting2fa = arg.account.setting2fa; // 账户绑定状态
                that.email = arg.account.email; // 用户邮箱
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
        this.generateQRCode();
    },
    removeFn: function() {
        broadcast.offMsg({
            key: 'openBindGoogle',
            cmd: 'geetestMsg',
            isall: true
        });
    }
};