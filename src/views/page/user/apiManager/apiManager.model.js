const validate = require('@/models/validate/validate').default;
const globalModels = require('@/models/globalModels');
const I18n = require('@/languages/I18n').default;
const errCode = require('@/util/errCode').default;
const Http = require('@/api').webApi;
const config = require('@/config.js');
const utils = require('@/util/utils').default;
module.exports = {
    onlyRead: true,
    canTrade: false,
    showValid: false,
    showAPIKey: false,
    loading: false,
    showKeyNameValid: false,
    keyName: '',
    ip: '',
    table: [],
    submit() {
        if (globalModels.getAccount().loginType === 'phone') {
            const smsParam = {
                securePhone: globalModels.getAccount().nationNo + '-' + globalModels.getAccount().phone, // 加密手机号带区号
                areaCode: globalModels.getAccount().nationNo, // 区号
                phone: globalModels.getAccount().phone, // 手机号
                phoneNum: globalModels.getAccount().nationNo + '-' + globalModels.getAccount().phone, // 手机号
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
    getAPIList() {
        this.loading = true;
        Http.userAPI({
            opType: 3,
            token: globalModels.getAccount().token
        }).then(res => {
            this.loading = false;
            if (res.result.code === 0) {
                this.table = [];
                const list = res.data.apiKeys;
                for (const item of list) {
                    this.addAPI(item);
                }
            } else {
                window.$message({
                    content: errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }).catch(e => {
            this.loading = false;
            console.log(e);
            window.$message({
                content: I18n.$t('10340')/* '网络异常，请稍后重试' */,
                type: 'danger'
            });
        });
    },
    addAPI(item) {
        const role = Number(item.role);
        let auth = '';
        if ((role & 2) === 2) {
            auth += `${I18n.$t('10319')/* 只读 */} `;
        }
        if ((role & 4) === 4 && (role & 8) === 8 && (role & 16) === 16) {
            auth += `${I18n.$t('10320')/* 交易 */} `;
        }
        const newItem = JSON.parse(JSON.stringify(item));
        newItem.auth = auth;
        this.table.push(newItem);
    },
    delAPI(key) {
        Http.userAPI({
            opType: 2,
            delKey: key,
            token: globalModels.getAccount().token
        }).then(res => {
            if (res.result.code === 0) {
                for (const i in this.table) {
                    if (this.table[i].k === key) return this.table.splice(i, 1);
                }
            } else {
                window.$message({
                    content: errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }).catch(e => {
            console.log(e);
            window.$message({
                content: I18n.$t('10340')/* '网络异常，请稍后重试' */,
                type: 'danger'
            });
        });
    },
    createAPI() {
        let role = 0;
        if (this.onlyRead) {
            role = role | 2;
        }
        if (this.canTrade) {
            role = role | 4 | 8 | 16;
        }
        const item = {
            opType: 1,
            apiKeyName: this.keyName,
            cidr: this.ip,
            role: parseInt(role).toString(2),
            token: globalModels.getAccount().token
        };
        Http.userAPI(item).then(res => {
            if (res.result.code === 0) {
                this.addAPI(item);
            } else {
                window.$message({
                    content: errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }).catch(e => {
            console.log(e);
            window.$message({
                content: I18n.$t('10340')/* '网络异常，请稍后重试' */,
                type: 'danger'
            });
        });
    },
    oninit() {},
    onremove() {
        // this.onlyRead = false;
        this.canTrade = false;
        this.showValid = false;
        this.showAPIKey = false;
        this.loading = false;
        this.showKeyNameValid = false;
        this.table = [];
        this.keyName = '';
        this.ip = '';
    }
};
