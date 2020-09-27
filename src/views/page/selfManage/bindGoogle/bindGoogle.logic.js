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
const regExp = require('@/models/validate/regExp');
const utils = require('@/util/utils').default;

module.exports = {
    showPassword: false, /* 是否显示密码 */
    tip1: '', /* 登录密码提示内容 */
    tip2: '', /* 谷歌验证码提示内容 */
    totalFlag: false, /* 是否通过验证 */
    secret: '', /* 密钥 */
    IOSDLAdd: 'https://apps.apple.com/us/app/google-authenticator/id388497605',
    AndroidDLAdd: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2',
    loginType: null, // 账户类型
    setting2fa: null, // 账户绑定状态
    email: null, // 用户邮箱
    nationNo: null, // 区号
    phoneNum: null, // 手机号码
    currentOperation: 'bind', // 当前为解绑/绑定操作
    isShowVerifyView: false, // 安全校验弹框 show
    IOSDLAddQrCodeSrc: null, // IOS下载二维码地址
    AndroidDLAddQrCodeSrc: null, // Android Q下载二维码地址
    secretQrCodeSrc: null, // 秘钥二维码地址
    LcPWd: '', // 登录密码值
    LcCode: '', // 谷歌验证码值
    switchSafetyVerifyModal (type) { // 安全校验弹框 显示/隐藏
        this.isShowVerifyView = type;
    },
    /* 生成IOS，Android，密钥二维码 begin */
    generateQRCode() {
        const that = this;
        // 获取秘钥（用于绑定google验证）
        Http.getGoogleSecret().then(function(arg) {
            console.log('nzm', 'getGoogleSecret success', arg);
            that.secret = arg.secret;
            // that.generatedCodeFN(arg.secret, 'key'); /* 生成密钥二维码 */
            that.secretQrCodeSrc = arg.qrcode_url;
            m.redraw();
        }).catch(function(err) {
            console.log('nzm', 'getGoogleSecret error', err);
        });
        this.generatedCodeFN(this.IOSDLAdd, 'IOS'); /* 生成IOS下载地址二维码 */
        this.generatedCodeFN(this.AndroidDLAdd, 'Android'); /* 生成Android下载地址二维码 */
    },
    generatedCodeFN: function(text, type) {
        if (type === 'IOS') {
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

    /* 登录密码校验是否符合规则 */
    LcPWdCheck() {
        /* 是否为空  */
        const tip = regExp.validPassword(this.LcPWd);
        if (tip) {
            this.totalFlag = false;
            this.tip1 = tip;
            return;
        }
        this.tip1 = '';
        this.totalFlag = true;
    },
    /* 谷歌验证码校验 */
    LcCodeCheck() {
        /* 是否为空  */
        if (!this.LcCode) {
            this.totalFlag = false;
            this.tip2 = I18n.$t('10416'); /* '该字段不能为空' */
            return;
        }
        this.tip2 = '';
        this.totalFlag = true;
    },
    confirmBtn: function () {
        // console.log(this.loginType, this.setting2fa, this.email, this.nationNo, this.phoneNum, this.LcCode, this.LcPWd, this.totalFlag);
        if (!this.LcPWd) {
            this.LcPWdCheck();
            return;
        }
        if (!this.LcCode) {
            this.LcCodeCheck();
            return;
        }
        if (!this.totalFlag) {
            return;
        }
        geetest.verify(); /* 极验 */
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
                    console.log('success initGeetest');
                    m.redraw();
                    that.checkGoogleCode();
                } else {
                    console.log('error initGeetest');
                }
            }
        });
    },
    /**
     * 校验google验证码
     * @param code
     */
    checkGoogleCode() {
        const that = this;
        let params = {};
        this.currentOperation === 'bind' ? params = { code: this.LcCode, opInfo: this.secret } : params = { code: this.LcCode };
        console.log(params, 111);
        Http.googleCheck(params).then(res => {
            if (res.result.code === 0) {
                m.redraw();
                that.ChooseVerify();
            } else {
                window.$message({
                    content: errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }).catch(err => {
            console.log('tlh', err);
        });
    },
    // 选择验证方式
    ChooseVerify() {
        if (this.setting2fa.email === 0 && this.setting2fa.phone === 0) {
            console.log('未绑定手机与邮箱');
            return;
        }
        if (this.setting2fa.email === 1 && this.setting2fa.phone === 1) {
            console.log('已绑定手机和邮箱');
            this.initSecurityVerification(3);
        } else if (this.setting2fa.email === 0 && this.setting2fa.phone === 1) {
            console.log('已绑定手机');
            this.initSecurityVerification(2);
        } else if (this.setting2fa.email === 1 && this.setting2fa.phone === 0) {
            console.log('已绑定邮箱');
            this.initSecurityVerification(1);
        }
        this.switchSafetyVerifyModal(true); // 打开弹框
    },
    // 初始化安全验证          typeFlag: 1：邮箱 2：手机 3：邮箱手机双切换验证
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
                that.currentOperation === 'bind' ? that.bindGoogle() : that.unbindGoogle();
            });
        } else if (typeFlag === 2) {
            params = {
                securePhone: that.nationNo + '-' + utils.hideMobileInfo(that.phoneNum),
                areaCode: that.nationNo, // 区号
                phoneNum: that.nationNo + '-' + that.phoneNum, // 手机号
                resetPwd: true, // 是否重置密码
                lang: I18n.getLocale(),
                phone: that.phoneNum,
                mustCheckFn: "" // 验证类型
            };
            validate.activeSms(params, function() {
                that.currentOperation === 'bind' ? that.bindGoogle() : that.unbindGoogle();
            });
        } else if (typeFlag === 3) {
            params = {
                emailconfig: {
                    secureEmail: that.email,
                    host: config.official,
                    fn: 'be',
                    lang: I18n.getLocale()
                },
                smsconfig: {
                    securePhone: that.nationNo + '-' + utils.hideMobileInfo(that.phoneNum),
                    areaCode: that.nationNo, // 区号
                    phoneNum: that.nationNo + '-' + that.phoneNum, // 手机号
                    resetPwd: true, // 是否重置密码
                    lang: I18n.getLocale(),
                    phone: that.phoneNum,
                    mustCheckFn: "" // 验证类型
                }
            };
            console.log(params);
            validate.activeSmsAndEmail(params, function() {
                that.currentOperation === 'bind' ? that.bindGoogle() : that.unbindGoogle();
            });
        }
    },
    // 绑定谷歌验证
    bindGoogle: function() {
        const that = this;
        // 密钥
        const opInfo = this.secret;
        // 用户密码
        const password = this.LcPWd;
        // google验证码
        const code = this.LcCode;

        Http.bindGoogleAuth({
            opInfo: opInfo,
            password: md5(password),
            code: code
        }).then(function(arg) {
            console.log('nzm', 'bindGoogleAuth success', arg);
            if (arg.result.code === 0) {
                console.log('bindGoogle success');
                window.$message({ content: I18n.$t('10600') /* '谷歌绑定成功' */, type: 'success' });
                that.setUserInfo();
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
        const password = this.LcPWd;
        // google验证码
        const code = this.LcCode;

        Http.relieveGoogleAuth({
            password: md5(password),
            code: code
        }).then(function(arg) {
            console.log('nzm', 'relieveGoogleAuth success', arg);
            if (arg.result.code === 0) {
                console.log('unbindGoogle success');
                window.$message({ content: I18n.$t('10599') /* '谷歌解绑成功' */, type: 'success' });
                that.setUserInfo();
            } else {
                window.$message({ content: errCode.getWebApiErrorCode(arg.result.code), type: 'danger' });
            }
            that.switchSafetyVerifyModal(false); // 关闭安全验证弹框
            m.redraw();
        }).catch(function(err) {
            console.log('nzm', 'relieveGoogleAuth error', err);
        });
    },
    // 设置用户信息
    setUserInfo() {
        Http.getUserInfo({}).then(data => {
            if (data.result.code === 0) {
                console.log(data.account);
                gM.setAccount(data.account);
                broadcast.emit({ cmd: broadcast.GET_USER_INFO_READY, data: data.account });
                window.router.push({ path: '/securityManage' });
            }
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
        this.email = account.email; // 用户邮箱
        this.nationNo = account.nationNo; // 区号
        this.phoneNum = account.phone; // 用户手机号码
    },
    initFn: function() {
        this.LcPWd = ''; // 登录密码值初始化
        this.LcCode = ''; // 谷歌验证码值初始化
        this.showPassword = false;
        this.totalFlag = false;
        this.tip1 = '';
        this.tip2 = '';
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
        if (this.currentOperation === 'bind') {
            this.generateQRCode();
        }
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