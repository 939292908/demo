const m = require('mithril');
const validate = require('@/models/validate/validate').default;
const globalModels = require('@/models/globalModels');
const I18n = require('@/languages/I18n').default;
const errCode = require('@/util/errCode').default;
const Http = require('@/api').webApi;
const config = require('@/config.js');
const utils = require('@/util/utils').default;
const broadcast = require('@/broadcast/broadcast');
module.exports = {
    onlyRead: true,
    canTrade: false,
    showValid: false,
    showAPIKey: false,
    loading: false,
    showKeyNameValid: false,
    showBindEmail: false,
    keyName: '',
    ip: '',
    table: [],
    modal: {
        key: '',
        password: '',
        auth: '',
        ip: ''
    },
    hasSame() {
        for (const item of this.table) {
            if (item.name === this.keyName) {
                return I18n.$t('10616'); // '备注不能重名';
            }
        }
        return '';
    },
    has20IP() {
        if (this.ip.split(',').length > 20) {
            return I18n.$t('10621', { value: 20 }); // '最多绑定20个IP地址或IP段';
        }
        return '';
    },
    submit() {
        if (this.table.length >= 5) {
            return window.$message({
                // content: '最多可创建5组API KEY',
                content: I18n.$t('10611', { value: 5 }),
                type: 'danger'
            });
        }
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
                    this.createAPI();
                });
            } else {
                validate.activeSms(smsParam, () => {
                    this.createAPI();
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
                    this.createAPI();
                });
            } else {
                validate.activeEmail(emailParam, () => {
                    this.createAPI();
                });
            }
        }
        this.showValid = true;
    },
    getAPIList() {
        this.loading = true;
        m.redraw();
        Http.userAPI({
            opType: 3,
            token: globalModels.getAccount().token,
            checkCode: new Date().valueOf().toString(32)
        }).then(res => {
            this.loading = false;
            m.redraw();
            if (!res.result) {
                return window.$message({
                    content: I18n.$t('10515'), // '暂无数据'
                    type: 'danger'
                });
            }
            if (res.result.code === 0) {
                this.fillData(res.apiKeys);
            } else {
                window.$message({
                    content: errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }).catch(e => {
            this.loading = false;
            m.redraw();
            console.log(e);
            window.$message({
                content: I18n.$t('10340')/* '网络异常，请稍后重试' */,
                type: 'danger'
            });
        });
    },
    fillData(apiKeys) {
        this.table = apiKeys;
        this.table.sort((a, b) => {
            return b.ctime - a.ctime;
        });
        m.redraw();
    },
    getAuth(role) {
        let auth = '';
        if ((role & 2) === 2) {
            auth += `${I18n.$t('10319')/* 只读 */}${I18n.getLocale() === 'en' ? '/' : '、'}`;
        }
        if ((role & 4) === 4 && (role & 8) === 8 && (role & 16) === 16) {
            auth += `${I18n.$t('10320')/* 交易 */}${I18n.getLocale() === 'en' ? '/' : '、'}`;
        }
        auth = auth.substr(0, auth.length - 1);
        return auth;
    },
    delAPI(key) {
        this.loading = true;
        m.redraw();
        Http.userAPI({
            opType: 2,
            delKey: key,
            token: globalModels.getAccount().token,
            checkCode: new Date().valueOf().toString(32)
        }).then(res => {
            this.loading = false;
            m.redraw();
            if (res.result.code === 0) {
                for (const i in this.table) {
                    if (this.table[i].k === key) {
                        this.table.splice(i, 1);
                        m.redraw();
                        return;
                    }
                }
            } else {
                window.$message({
                    content: errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }).catch(e => {
            this.loading = false;
            m.redraw();
            console.log(e);
            window.$message({
                content: I18n.$t('10340')/* '网络异常，请稍后重试' */,
                type: 'danger'
            });
        });
    },
    createAPI() {
        validate.loading = true;
        m.redraw();
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
            token: globalModels.getAccount().token,
            checkCode: new Date().valueOf().toString(32)
        };
        Http.userAPI(item).then(res => {
            validate.loading = false;
            m.redraw();
            if (res.result.code === 0) {
                this.showValid = false;
                this.showAPIKey = true;
                let auth = '';
                if (this.onlyRead) {
                    auth += `${I18n.$t('10319')/* 只读 */}${I18n.getLocale() === 'en' ? '/' : '、'}`;
                }
                if (this.canTrade) {
                    auth += `${I18n.$t('10320')/* 交易 */}${I18n.getLocale() === 'en' ? '/' : '、'}`;
                }
                auth = auth.substr(0, auth.length - 1);
                this.modal = {
                    key: res.apiKey,
                    password: res.apiKeyValue,
                    auth: auth,
                    ip: this.ip
                };
                this.keyName = '';
                this.ip = '';
                this.canTrade = false;
                this.showKeyNameValid = false;
                this.getAPIList();
            } else {
                window.$message({
                    content: errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }).catch(e => {
            console.log(e);
            validate.loading = false;
            m.redraw();
            window.$message({
                content: I18n.$t('10340')/* '网络异常，请稍后重试' */,
                type: 'danger'
            });
        });
    },
    oninit() {
        if (Object.keys(globalModels.getAccount()).length && !globalModels.getAccount().email) {
            this.showBindEmail = true;
        } else if (globalModels.getAccount().token) {
            this.getAPIList();
        }

        broadcast.onMsg({
            key: 'apiManager',
            cmd: broadcast.GET_USER_INFO_READY,
            cb: arg => {
                console.log(globalModels.getAccount());
                if (Object.keys(globalModels.getAccount()).length && !globalModels.getAccount().email) {
                    this.showBindEmail = true;
                    m.redraw();
                } else {
                    this.getAPIList();
                }
            }
        });
    },
    onremove() {
        // this.onlyRead = false;
        this.canTrade = false;
        this.showValid = false;
        this.showAPIKey = false;
        this.loading = false;
        this.showKeyNameValid = false;
        this.showBindEmail = false;
        this.table = [];
        this.keyName = '';
        this.ip = '';
        this.modal = {
            key: '',
            password: '',
            auth: '',
            ip: ''
        };
        broadcast.offMsg({ key: 'apiManager', isall: true });
    }
};
