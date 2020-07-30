import geetest from "@/libs/geetestTwo"

export class Validate {
    constructor() {
        this.sms = 1;
        this.google = 2;
        this.email = 3;
        this.tradepwd = 4;
        this.emailConfig = null; // 发送邮件配置
        this.smsConfig = null;  // 发送短信配置
        this.callbackHandler = null; // 验证结果回调
        this.code = ''; // 用于google验证code临时储存
        this.validateType = ''; // sms：手机验证，google：谷歌验证，email：邮箱验证
        this.validateSheet = {
            loading: false,
        };
    }

    /**
     * 激活短信验证弹窗
     * @param params
     * @param callback
     */
    activeSms(params, callback) {
        if (gWebApi.functions.sms) {
            this.validateType = 'sms';
            let config = {
                display: true,
                inputValue: '',
                type: this.sms,
                loading: false,
            };
            if (params) {
                params.lang = gI18n.lang;
            } else {
                params = {
                    lang: gI18n.lang,
                };
            }
            this.smsConfig = params;
            gBroadcast.emit({
                cmd: 'setValidateSheet',
                data: config,
            });
            gBroadcast.offMsg({
                key: 'ValidateModule',
                cmd: 'setValidateSheet',
                isall: true,
            });
            if (callback) {
                this.callbackHandler = callback;
            }
        } else {
            if (callback) {
                callback();
            }
        }
    }

    /**
     * 激活google验证弹窗
     * @param callback
     */
    activeGoogle(callback) {
        this.validateType = 'google';
        let config = {
            display: true,
            inputValue: '',
            type: this.google,
            loading: false,
        };
        gBroadcast.emit({
            cmd: 'setValidateSheet',
            data: config,
        });
        this.initGeetest();
        if (callback) {
            this.callbackHandler = callback;
        }
    }

    /**
     * 激活邮箱验证弹窗
     * @param params
     * @param callback
     */
    activeEmail(params, callback) {
        this.validateType = 'email';
        let config = {
            display: true,
            inputValue: '',
            type: this.email,
            loading: false,
        };
        this.emailConfig = params;
        gBroadcast.emit({
            cmd: 'setValidateSheet',
            data: config,
        });
        if (callback) {
            this.callbackHandler = callback;
        }
    }

    /**
     * 激活资产验证弹窗
     * @param callback
     */
    activeTradePwd(callback) {
        let config = {
            display: true,
            inputValue: '',
            type: this.tradepwd,
            loading: false,
        };
        gBroadcast.emit({
            cmd: 'setValidateSheet',
            data: config,
        });
        if (callback) {
            this.callbackHandler = callback;
        }
    }

    /**
     * 发送短信验证码
     * @param callback
     * @param callback1
     */
    sendSmsCode(callback, callback1) {
        if (this.smsconfig.constructor === Object) {
            this.smsconfig.exChannel = exchId;
            this.smsconfig.lang = gI18n.locale;
        } else {
            this.smsconfig = {
                exChannel: exchId,
                lang: gI18n.locale,
            }
        }
        gWebApi.getSMSCode(this.smsconfig, res => {
            if (callback1) {
                callback1();
            }
            if (callback) {
                callback(res);
            }
        }, err => {
            if (callback1) {
                callback1();
            }
        })
    }

    /**
     * 发送邮箱验证码
     * @param callback
     * @param callback1
     */
    sendEmailCode(callback, callback1) {

        if (this.emailconfig.constructor === Object) {
            this.emailconfig.exChannel = exchId;
        } else {
            this.emailconfig = {exChannel: exchId};
        }

        gWebApi.sendEmail(this.emailconfig, res => {
            if (callback1) {
                callback1();
            }
            if (callback) {
                callback(res);
            }
        }, err => {
            if (callback1) {
                callback1();
            }
        })
    };

    /**
     * 校验短信验证码
     * @param code
     */
    checkSmsCode(code) {
        if (!code) {
            $message({content: gI18n.$t('10015'), type: 'danger'});
            return;
        }
        this.validateSheet.loading = true
        let params = {};
        if (this.smsconfig) {
            params.phoneNum = this.smsconfig.phoneNum;
        }
        params.code = code;

        gWebApi.smsVerify(params, res => {
            if (res.result.code == 0) {
                this.finished();
            } else {
                this.validateSheet.loading = false;
                $message({content: errCode.getWebApiErrorCode(res.data.result.code), type: 'danger'});
            }
        }, err => {
            this.validateSheet.loading = false;
        })

    }

    /**
     * 校验google验证码
     * @param code
     */
    checkGoogleCode(code) {
        if (!code) {
            $message({content: gI18n.$t('10015'), type: 'danger'});
            return;
        }
        this.validateSheet.loading = true
        gWebApi.googleCheck({code: code},
            res => {
                if (res.result.code == 0) {
                    this.finished();
                } else {
                    this.validateSheet.loading = false
                    $message({content: errCode.getWebApiErrorCode(res.data.result.code), type: 'danger'})
                }
            },
            err => {
                this.validateSheet.loading = false
            })
    }

    /**
     * 校验邮箱验证码
     * @param code
     */
    checkEmailCode(code) {
        if (!code) {
            $message({content: gI18n.$t('10015'), type: 'danger'});
            return
        }
        this.validateSheet.loading = true
        gWebApi.emailCheck({code: code},
            res => {
                if (res.result.code == 0) {
                    this.finished();
                } else {
                    this.validateSheet.loading = false
                    $message({content: errCode.getWebApiErrorCode(res.data.result.code), type: 'danger'})
                }
            },
            err => {
                this.validateSheet.loading = false
            })
    }

    /**
     * 校验结果
     */
    finished() {
        if (this.callbackHandler) {
            this.callbackHandler();
        }
        gBroadcast.emit({
            cmd: 'smsAndEmailSuc',
            data: 'ready'
        });
    };

    close() {
        let config = {};
        config.display = false;
        config.inputValue = '';
        config.type = 0;
        config.loading = false;
        gBroadcast.emit({
            cmd: 'setValidateSheet',
            data: config
        });
        gBroadcast.offMsg({
            key: 'ValidateModule',
            cmd: 'geetestMsg',
            isall: true
        });
    }
    initGeetest() {
        let self = this;
        geetest.init(() => {
        });
        gBroadcast.onMsg({
            key: 'ValidateModule',
            cmd: 'geetestMsg',
            cb: res => {
                if (this.validateType != 'google') {
                    return;
                }
                if (res == 'success') {
                    self.checkGoogleCode(self.code)
                    self.validateSheet.loading = false
                } else {
                    self.validateSheet.loading = false
                }
            }
        });
    }
}