const m = require('mithril');
const geetest = require('@/libs/geetestTwo');

module.exports = {
    smsCd: 0,
    emailCd: 0,
    geetestCallBackType: '',
    sendSmsCode() {
        window.validate.sendSmsCode(res => {
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
        }, () => {
            this.waiting = false;
        });
    },
    sendEmailCode() {
        window.validate.sendEmailCode(res => {
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
        }, () => {
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
        window.gBroadcast.onMsg({
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
    oninit() {
        this.initGeetest();
    },
    onremove() {
        window.gBroadcast.offMsg({
            key: 'validate',
            cmd: 'geetestMsg',
            isall: true
        });
        window.validate.close();
    }
};