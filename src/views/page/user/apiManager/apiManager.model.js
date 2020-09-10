const validate = require('@/models/validate/validate').default;
const globalModels = require('@/models/globalModels');
const I18n = require('@/languages/I18n').default;
const config = require('@/config.js');
const utils = require('@/util/utils').default;
module.exports = {
    onlyRead: false,
    canTrade: false,
    showValid: false,
    showAPIKey: false,
    mark: '',
    ip: '',
    table: [{
        mark: '交易01',
        auth: '交易',
        key: 'jdklclnsjc11dcc',
        ip: '148.132.6.23',
        time: '2020-08-06 12:05:20'
    }, {
        mark: '交易01',
        auth: '交易',
        key: 'jdklclnsjc11dcc',
        ip: '148.132.6.23',
        time: '2020-08-06 12:05:20'
    }],
    submit() {
        if (globalModels.getAccount().loginType === 'phone') {
            const smsParam = {
                securePhone: globalModels.getAccount().nationNo + '-' + globalModels.getAccount().phone, // 加密手机号带区号
                areaCode: globalModels.getAccount().nationNo, // 区号
                phone: globalModels.getAccount().phone, // 手机号
                phoneNum: globalModels.getAccount().nationNo + '-' + globalModels.getAccount().phone, // 手机号
                resetPwd: true,
                lang: I18n.getLocale() // 语言
            };
            if (globalModels.getAccount().googleId) {
                validate.activeSmsAndGoogle(smsParam, () => {
                    this.showValid = false;
                    this.showAPIKey = true;
                });
            } else {
                validate.activeSms(smsParam, () => {
                    this.showValid = false;
                    this.showAPIKey = true;
                });
            }
        } else {
            const emailParam = {
                secureEmail: globalModels.getAccount().email, // 邮箱地址
                email: utils.hideAccountNameInfo(globalModels.getAccount().email), // 邮箱地址
                host: config.official, // 域名
                fn: "be", // 邮箱模板
                lang: I18n.getLocale() // 语言
            };
            if (globalModels.getAccount().googleId) {
                validate.activeEmailAndGoogle(emailParam, () => {
                    this.showValid = false;
                    this.showAPIKey = true;
                });
            } else {
                validate.activeEmail(emailParam, () => {
                    this.showValid = false;
                    this.showAPIKey = true;
                });
            }
        }
        this.showValid = true;
    },
    copyText(txt) {
        const input = document.createElement('input');
        input.setAttribute('readonly', 'readonly');
        input.setAttribute('value', txt);
        document.body.appendChild(input);
        input.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            window.$message({ title: I18n.$t('10410') /* '提示' */, content: I18n.$t('10546') /* '复制成功' */, type: 'success' });
        }
        document.body.removeChild(input);
    },
    oninit() {},
    onremove() {
        this.onlyRead = false;
        this.canTrade = false;
        this.showValid = false;
        this.showAPIKey = false;
        this.mark = '';
        this.ip = '';
    }
};