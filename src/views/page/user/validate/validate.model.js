const m = require('mithril');
const geetest = require('@/models/validate/geetest').default;
const validate = require('@/models/validate/validate').default;
const broadcast = require('@/broadcast/broadcast');
const errCode = require('@/util/errCode').default;
const I18n = require('@/languages/I18n').default;

module.exports = {
    smsCd: 0, // 短信冷却时间
    emailCd: 0, // 邮箱冷却时间
    geetestCallBackType: '', // 极验回调类型 用于判断是邮箱还是短信的回调
    selectType: '', // 当前验证类型
    anotherType: '', // 另一种验证类型
    selectName() {
        return {
            sms: I18n.$t('10118')/* '短信验证码' */,
            email: I18n.$t('10116')/* '邮箱验证码' */,
            google: I18n.$t('10119')/* '谷歌验证码' */
        };
    }, // 选择验证类型的显示文字
    anotherName() {
        return {
            sms: I18n.$t('10541')/* '切换短信验证', */,
            email: I18n.$t('10542')/* '切换邮箱验证', */,
            google: I18n.$t('10543')/* '切换谷歌验证' */
        };
    }, // 切换选择验证类型显示的文字
    code: '', // 验证码
    smsInt: null,
    emailInt: null,
    loading: false, // 确认加载
    /**
     * 发送验证码
     */
    sendSmsCode() {
        if (!this.smsInt) {
            this.setSmsCd();
        }
        validate.sendSmsCode().then(res => {
            if (res.result.code === -1) {
                this.cleanSmsCd();
                this.geetestCallBackType = 'sms';
                geetest.verify();
            } else if (res.result.code !== 0) {
                this.cleanSmsCd();
                window.$message({
                    content: errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }).catch(err => {
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
        validate.sendEmailCode().then(res => {
            if (res.result.code === -1) {
                this.cleanEmailCd();
                self.geetestCallBackType = 'email';
                geetest.verify();
            } else if (res.result.code !== 0) {
                this.cleanEmailCd();
                window.$message({
                    content: errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }).catch(err => {
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
    /**
     * 加载极验
     */
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
    /**
     * 检查验证码
     */
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
     * 切换验证方式
     */
    changeValidate() {
        const temp = this.selectType;
        this.selectType = this.anotherType;
        this.anotherType = temp;
        this.code = '';
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
    },

    oninit() {
        this.init();
        broadcast.onMsg({
            key: 'validate',
            cmd: 'redrawValidate',
            cb: () => {
                this.code = '';
                this.init();
                m.redraw();
            }
        });
        this.initGeetest();
    },

    onremove() {
        if (this.smsInt) {
            clearInterval(this.smsInt);
            this.smsInt = null;
            this.smsCd = 0;
        }
        if (this.emailInt) {
            clearInterval(this.emailInt);
            this.emailInt = null;
            this.emailCd = 0;
        }
        this.code = '';
        this.selectType = '';
        this.anotherType = '';
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
