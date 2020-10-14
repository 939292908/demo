const m = require('mithril');
const geetest = require('@/models/validate/geetest').default;
const validate = require('@/models/validate/validate').default;
const broadcast = require('@/broadcast/broadcast');
const errCode = require('@/util/errCode').default;
const I18n = require('@/languages/I18n').default;

module.exports = {
    smsCd: 0,
    emailCd: 0,
    geetestCallBackType: '',
    selectType: '',
    anotherType: '',
    selectName: '',
    anotherName: '',
    code: '',
    canConfirm: false, // 发送验证码后才能点确定
    /**
     * 发送验证码
     */
    sendSmsCode() {
        if (!this.smsInt) {
            this.setSmsCd();
        }
        this.canConfirm = true;
        validate.sendSmsCode().then(res => {
            if (res.result.code === 0) {
                this.canConfirm = true;
            } else if (res.result.code === -1) {
                this.canConfirm = false;
                this.cleanSmsCd();
                this.geetestCallBackType = 'sms';
                geetest.verify();
            } else {
                this.canConfirm = false;
                this.cleanSmsCd();
                window.$message({
                    content: errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }).catch(err => {
            this.canConfirm = false;
            this.cleanSmsCd();
            console.log(err);
        });
    },
    /**
     * 发送邮箱验证码
     */
    sendEmailCode() {
        if (!this.emailInt) {
            this.setEmailCd();
        }
        this.canConfirm = true;
        validate.sendEmailCode().then(res => {
            if (res.result.code === 0) {
                this.canConfirm = true;
            } else if (res.result.code === -1) {
                this.canConfirm = false;
                this.cleanEmailCd();
                self.geetestCallBackType = 'email';
                geetest.verify();
            } else {
                this.canConfirm = false;
                this.cleanEmailCd();
                window.$message({
                    content: errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }).catch(err => {
            this.canConfirm = false;
            this.cleanEmailCd();
            console.log(err);
        });
    },
    /**
     * 设置发送短信冷却
     */
    setSmsCd() {
        this.smsCd = 60;
        m.redraw();
        this.smsInt = setInterval(() => {
            this.smsCd--;
            m.redraw();
            if (this.smsCd === 0) {
                clearInterval(this.smsInt);
                this.smsInt = null;
                m.redraw();
            }
        }, 1000);
    },
    cleanSmsCd() {
        this.smsCd = 0;
        if (this.smsInt) {
            clearInterval(this.smsInt);
            this.smsInt = null;
        }
    },
    /**
     * 设置发送邮箱冷却
     */
    setEmailCd() {
        this.emailCd = 60;
        m.redraw();
        this.emailInt = setInterval(() => {
            this.emailCd--;
            m.redraw();
            if (this.emailCd === 0) {
                clearInterval(this.emailInt);
                this.emailInt = null;
                m.redraw();
            }
        }, 1000);
    },
    cleanEmailCd() {
        this.emailCd = 0;
        if (this.emailInt) {
            clearInterval(this.emailInt);
            this.emailInt = null;
        }
    },

    initGeetest() {
        const self = this;
        geetest.init(() => {
        });
        broadcast.onMsg({
            key: 'validate',
            cmd: 'geetestMsg',
            cb: res => {
                if (res === 'success') {
                    switch (self.geetestCallBackType) {
                    case 'email':
                        self.sendEmailCode();
                        break;
                    case 'sms':
                        self.sendSmsCode();
                        break;
                    }
                } else {
                    self.loading = false;
                }
            }
        });
    },

    check() {
        switch (this.selectType) {
        case 'sms':
            validate.checkSmsCode(this.code);
            break;
        case 'email':
            validate.checkEmailCode(this.code);
            break;
        case 'google':
            validate.checkGoogleCode(this.code);
            break;
        }
    },

    /**
     * 设置显示的文字
     */
    setName() {
        switch (this.selectType) {
        case 'sms':
            this.selectName = I18n.$t('10118')/* '短信验证码' */;
            break;
        case 'email':
            this.selectName = I18n.$t('10116')/* '邮箱验证码' */;
            break;
        case 'google':
            this.selectName = I18n.$t('10119')/* '谷歌验证码' */;
            break;
        }
        if (!this.anotherType.length) return;
        switch (this.anotherType) {
        case 'sms':
            this.anotherName = I18n.$t('10207', { value: I18n.$t('10417') })/* '切换短信验证' */;
            break;
        case 'email':
            this.anotherName = I18n.$t('10207', { value: I18n.$t('10194') })/* '切换邮箱验证' */;
            break;
        case 'google':
            this.anotherName = I18n.$t('10207', { value: I18n.$t('10418') })/* '切换谷歌验证' */;
            break;
        }
    },

    /**
     * 切换验证方式
     */
    changeValidate() {
        const temp = this.selectType;
        this.selectType = this.anotherType;
        this.anotherType = temp;
        this.code = '';
        this.setName();
        m.redraw();
    },

    init() {
        if (validate.validateType.indexOf('&') !== -1) {
            const selectTypeList = validate.validateType.split('&');
            this.selectType = selectTypeList[0];
            this.anotherType = selectTypeList[1];
        } else {
            this.selectType = validate.validateType;
            this.anotherType = '';
        }
        this.setName();
    },

    oninit() {
        this.init();
        broadcast.onMsg({
            key: 'validate',
            cmd: 'redrawValidate',
            cb: () => {
                this.code = '';
                this.canConfirm = false;
                this.init();
                m.redraw();
            }
        });
        this.initGeetest();
    },

    onremove() {
        this.code = '';
        this.selectType = '';
        this.anotherType = '';
        this.canConfirm = false;
        this.cleanEmailCd();
        this.cleanSmsCd();
        broadcast.offMsg({
            key: 'validate',
            cmd: 'geetestMsg',
            isall: true
        });
        broadcast.offMsg({
            key: 'validate',
            cmd: 'redrawValidate',
            isall: true
        });
        validate.close();
    }
};
