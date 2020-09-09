const globalModels = require('../../../../models/globalModels');
const m = require('mithril');
const geetest = require('@/models/validate/geetest').default;
const I18n = require('@/languages/I18n').default;
const config = require('@/config');
const broadcast = require('@/broadcast/broadcast');
const utils = require('@/util/utils').default;
const errCode = require('@/util/errCode').default;
const validate = require('@/models/validate/validate').default;
const models = require('@/models');
const Http = require('@/api').webApi;
const md5 = require('md5');
module.exports = {
    showPhoneValidate: false,
    showPasswordValidate: false,
    showEmailValidate: false,
    showValid: false,
    showNextValid: false,
    password: '',
    bindType: '',
    bind: '',
    areaCode: '86', // 区号，默认86
    selectList: [{ cn_name: '中国', code: '86', support: '1', us_name: 'China' }], // 区号选择列表
    loading: false,

    saveClick() {
        this.loading = true;
        geetest.verify(() => {
            this.loading = false;
        });
    },

    // 获取区号列表
    getCountryList() {
        Http.getCountryList({}).then(res => {
            if (res.result.code === 0) {
                this.selectList = res.result.data;
            }
        });
    },

    // 查询是否注册顾过
    queryUserInfo() {
        this.loading = true;
        Http.queryUserInfo({
            loginType: this.bindType,
            loginName: this.bind,
            nationNo: '00' + this.areaCode,
            exChannel: config.exchId
        }).then(res => {
            this.loading = false;
            if (res.result.code === 0) {
                if (res.exists === 1) {
                    window.$message({ content: I18n.$t('10443'), type: 'danger' }); // 用户已存在
                } else {
                    this.bindType === 'phone' ? this.nextValidateSms() : this.nextValidateEmail();
                }
                m.redraw();
            } else {
                window.$message({ content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
                m.redraw();
            }
        }).catch(() => {
            this.loading = false;
            m.redraw();
            window.$message({ content: I18n.$t('10340')/* '网络异常，请稍后重试' */, type: 'danger' });
        });
    },

    firstValidateSmsAndGoogle() {
        validate.activeSmsAndGoogle({
            securePhone: '00' + this.areaCode + '-' + globalModels.getAccount().phone, // 加密手机号带区号
            areaCode: '00' + this.areaCode, // 区号
            phone: globalModels.getAccount().phone, // 手机号
            phoneNum: '00' + this.areaCode + '-' + globalModels.getAccount().phone, // 手机号
            resetPwd: true,
            lang: I18n.getLocale() // 语言
        }, () => {
            this.queryUserInfo();
        });
        this.showValid = true;
    },

    firstValidateEmailAndGoogle() {
        validate.activeEmailAndGoogle({
            secureEmail: globalModels.getAccount().email, // 邮箱地址
            email: utils.hideAccountNameInfo(globalModels.getAccount().email), // 邮箱地址
            host: config.official, // 域名
            fn: "be", // 邮箱模板
            lang: I18n.getLocale() // 语言
        }, () => {
            this.queryUserInfo();
        });
        this.showValid = true;
    },

    firstValidateSms() {
        validate.activeSms({
            securePhone: '00' + this.areaCode + '-' + globalModels.getAccount().phone, // 加密手机号带区号
            areaCode: '00' + this.areaCode, // 区号
            phone: globalModels.getAccount().phone, // 手机号
            phoneNum: '00' + this.areaCode + '-' + globalModels.getAccount().phone, // 手机号
            resetPwd: true,
            lang: I18n.getLocale() // 语言
        }, () => {
            this.queryUserInfo();
        });
        this.showValid = true;
    },

    firstValidateEmail() {
        validate.activeEmail({
            secureEmail: globalModels.getAccount().email, // 邮箱地址
            email: utils.hideAccountNameInfo(globalModels.getAccount().email), // 邮箱地址
            host: config.official, // 域名
            fn: "be", // 邮箱模板
            lang: I18n.getLocale() // 语言
        }, () => {
            this.queryUserInfo();
        });
        this.showValid = true;
    },

    nextValidateSms() {
        validate.activeSms({
            securePhone: '00' + this.areaCode + '-' + this.bind, // 加密手机号带区号
            areaCode: '00' + this.areaCode, // 区号
            phone: '00' + this.areaCode + '-' + this.bind, // 手机号
            lang: I18n.getLocale() // 语言
        }, () => {
            this.set2FA();
        });
        broadcast.emit({ cmd: 'redrawValidate' });
    },

    nextValidateEmail() {
        validate.activeEmail({
            secureEmail: utils.hideAccountNameInfo(this.bind), // 邮箱地址
            email: this.bind, // 邮箱地址
            host: config.official, // 域名
            fn: "be",
            lang: I18n.getLocale() // 语言
        }, () => {
            this.set2FA();
        });
        broadcast.emit({ cmd: 'redrawValidate' });
    },

    set2FA() {
        this.loading = true;
        Http.set2FA(
            {
                opCode: this.bindType === 'phone' ? 1 : 5, // 绑定类型
                opInfo: this.bind,
                password: md5(this.password), // 用户密码
                phoneNation: this.bindType === 'phone' ? '00' + this.areaCode : null // 区号
            }
        ).then(res => {
            if (res.result.code === 0) {
                models.getUserInfo(true);
            } else {
                this.loading = false;
                m.redraw();
                window.$message({ content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
            }
        }).catch(() => {
            this.loading = false;
            m.redraw();
            window.$message({ content: I18n.$t('10340')/* '网络异常，请稍后重试' */, type: 'danger' });
        });
    },

    // 加载极验
    initGeetest() {
        geetest.init(() => {});
        broadcast.onMsg({
            key: 'bind',
            cmd: 'geetestMsg',
            cb: res => {
                this.loading = false;
                m.redraw();
                if (res === 'success') {
                    if (this.bindType === 'phone') {
                        if (globalModels.getAccount().googleId) {
                            this.firstValidateEmailAndGoogle();
                        } else {
                            this.firstValidateEmail();
                        }
                    } else {
                        if (globalModels.getAccount().googleId) {
                            this.firstValidateSmsAndGoogle();
                        } else {
                            this.firstValidateSms();
                        }
                    }
                }
            }
        });
    },

    oninit(bindType) {
        this.bindType = bindType;
        if ((this.bindType === 'phone' && globalModels.getAccount().phone) ||
            (this.bindType === 'email' && globalModels.getAccount().email)) {
            return window.router.go(-1);
        }
        broadcast.onMsg({
            key: 'bind',
            cmd: broadcast.GET_USER_INFO_READY,
            cb: res => {
                if (res) {
                    this.loading = false;
                    window.router.go(-1);
                } else {
                    this.loading = false;
                    m.redraw();
                }
            }
        });
        if (this.bindType === 'phone') {
            this.getCountryList();
        }
        this.initGeetest();
    },

    onremove() {
        this.showPhoneValidate = false;
        this.showEmailValidate = false;
        this.showPasswordValidate = false;
        this.showNextValid = false;
        this.showValid = false;
        this.password = '';
        this.bind = '';
        this.bindType = '';
        this.areaCode = '86';
        broadcast.offMsg({ key: 'bind', isall: true });
    }
};