const m = require('mithril');
const geetest = require('@/models/validate/geetest').default;
const validate = require('@/models/validate/validate').default;
const broadcast = require('@/broadcast/broadcast');

module.exports = {
    smsCd: 0,
    emailCd: 0,
    geetestCallBackType: '',
    selectType: '',
    anotherType: '',
    selectName: '',
    anotherName: '',
    code: '',
    sendSmsCode() {
        validate.sendSmsCode().then(res => {
            if (res.result.code === 0) {
                this.waiting = false;
                if (!this.smsInt) {
                    this.setSmsCd();
                }
            } else if (res.result.code === -1) {
                this.geetestCallBackType = 'sms';
                geetest.verify();
            } else {
                window.$message({
                    content: window.errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }).catch(() => {
            this.waiting = false;
        });
    },
    sendEmailCode() {
        validate.sendEmailCode().then(res => {
            if (res.result.code === 0) {
                this.waiting = false;
                if (!this.emailInt) {
                    this.setEmailCd();
                }
            } else if (res.result.code === -1) {
                self.geetestCallBackType = 'email';
                geetest.verify();
            } else {
                window.$message({
                    content: window.errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }).catch(() => {
            this.waiting = false;
        });
    },
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
            this.selectName = '短信验证码';
            break;
        case 'email':
            this.selectName = '邮箱验证码';
            break;
        case 'google':
            this.selectName = '谷歌验证码';
            break;
        }
        if (!this.anotherType.length) return;
        switch (this.anotherType) {
        case 'sms':
            this.anotherName = '切换短信验证';
            break;
        case 'email':
            this.anotherName = '切换邮箱验证';
            break;
        case 'google':
            this.anotherName = '切换谷歌验证';
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