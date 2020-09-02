const m = require('mithril');
const geetest = require('@/models/validate/geetest').default;
const validate = require('@/models/validate/validate').default;
const broadcast = require('@/broadcast/broadcast');
const errCode = require('@/util/errCode').default;

module.exports = {
    smsCd: 0, // 短信冷却时间
    emailCd: 0, // 邮箱冷却时间
    geetestCallBackType: '', // 极验回调类型 用于判断是邮箱还是短信的回调
    selectType: '', // 当前验证类型
    anotherType: '', // 另一种验证类型
    selectName: '', // 选择验证类型的显示文字
    anotherName: '', // 切换选择验证类型显示的文字
    code: '', // 验证码
    smsInt: null,
    emailInt: null,
    /**
     * 发送验证码
     */
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
                    content: errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }).catch(err => {
            this.waiting = false;
            console.log(err);
        });
    },
    /**
     * 发送邮箱验证码
     */
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
                    content: errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }).catch(err => {
            this.waiting = false;
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