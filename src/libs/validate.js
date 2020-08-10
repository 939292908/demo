// import geetest from '@/libs/geetestTwo';

class Validate {
    constructor() {
        this.sms = 1;
        this.google = 2;
        this.email = 3;
        this.tradepwd = 4;
        this.emailConfig = null; // 发送邮件配置
        this.smsConfig = null; // 发送短信配置
        this.allConfig = null;
        this.callbackHandler = null; // 验证结果回调
        this.validateType = ''; // sms：手机验证，google：谷歌验证，email：邮箱验证
    }

    /**
     * 激活短信验证弹窗
     * @param params
     * @param callback
     */
    activeSms(params, callback) {
        this.validateType = 'sms';
        // let config = {
        //     display: true,
        //     inputValue: '',
        //     type: this.sms,
        //     loading: false,
        // };
        if (params) {
            params.lang = window.gI18n.lang;
        } else {
            params = {
                lang: window.gI18n.lang
            };
        }
        this.smsConfig = params;
        // window.gBroadcast.emit({
        //     cmd: 'setValidateSheet',
        //     data: config,
        // });
        window.gBroadcast.offMsg({
            key: 'ValidateModule',
            cmd: 'setValidateSheet',
            isall: true
        });
        if (callback) {
            this.callbackHandler = callback;
        }
    }

    /**
     * 激活google验证弹窗
     * @param callback
     */
    activeGoogle(callback) {
        this.validateType = 'google';
        // const config = {
        //     display: true,
        //     inputValue: '',
        //     type: this.google,
        //     loading: false
        // };
        // window.gBroadcast.emit({
        //     cmd: 'setValidateSheet',
        //     data: config,
        // });
        // this.initGeetest();
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
        // let config = {
        //     display: true,
        //     inputValue: '',
        //     type: this.email,
        //     loading: false,
        // };
        this.emailConfig = params;
        // window.gBroadcast.emit({
        //     cmd: 'setValidateSheet',
        //     data: config,
        // });
        if (callback) {
            this.callbackHandler = callback;
        }
    }

    /**
     * 激活多重验证
     * @param params
     * @param callback
     */
    activeAll(params, callback) {
        this.validateType = 'all';
        this.allConfig = params;
        if (callback) {
            this.callbackHandler = callback;
        }
    }

    /**
     * 激活资产验证弹窗
     * @param callback
     */
    activeTradePwd(callback) {
        // const config = {
        //     display: true,
        //     inputValue: '',
        //     type: this.tradepwd,
        //     loading: false
        // };
        // window.gBroadcast.emit({
        //     cmd: 'setValidateSheet',
        //     data: config,
        // });
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
        if (this.smsConfig.constructor === Object) {
            this.smsConfig.exChannel = window.exchId;
            this.smsConfig.lang = window.gI18n.locale;
        } else {
            this.smsConfig = {
                exChannel: window.exchId,
                lang: window.gI18n.locale
            };
        }
        window.gWebApi.getSMSCode(this.smsConfig, res => {
            if (callback1) {
                callback1();
            }
            if (callback) {
                callback(res);
            }
        }, () => {
            if (callback1) {
                callback1();
            }
        });
    }

    /**
     * 发送邮箱验证码
     * @param callback
     * @param callback1
     */
    sendEmailCode(callback, callback1) {
        if (this.emailConfig.constructor === Object) {
            this.emailConfig.exChannel = window.exchId;
        } else {
            this.emailConfig = { exChannel: window.exchId };
        }

        window.gWebApi.sendEmail(this.emailConfig, res => {
            if (callback1) {
                callback1();
            }
            if (callback) {
                callback(res);
            }
        }, () => {
            if (callback1) {
                callback1();
            }
        });
    }

    /**
     * 校验短信验证码
     * @param code
     */
    checkSmsCode(code) {
        if (!code) {
            window.$message({
                content: '该字段不能为空',
                type: 'danger'
            });
            return;
        }
        const params = {};
        if (this.smsConfig) {
            params.phoneNum = this.smsConfig.phoneNum;
        }
        params.code = code;

        window.gWebApi.smsVerify(params, res => {
            if (res.result === 0) {
                this.finished();
            } else {
                window.$message({
                    content: window.errCode.getWebApiErrorCode(
                        res.data.result.code),
                    type: 'danger'
                });
            }
        }, () => {
        });
    }

    /**
     * 校验google验证码
     * @param code
     */
    checkGoogleCode(code) {
        if (!code) {
            window.$message({
                content: '该字段不能为空',
                type: 'danger'
            });
            return;
        }
        window.gWebApi.googleCheck({ code: code },
            res => {
                if (res.result === 0) {
                    this.finished();
                } else {
                    this.validateSheet.loading = false;
                    window.$message({
                        content: window.errCode.getWebApiErrorCode(
                            res.data.result.code),
                        type: 'danger'
                    });
                }
            },
            () => {
            });
    }

    /**
     * 校验邮箱验证码
     * @param code
     */
    checkEmailCode(code) {
        if (!code) {
            window.$message({
                content: '该字段不能为空',
                type: 'danger'
            });
            return;
        }
        window.gWebApi.emailCheck({ code: code },
            res => {
                if (res.result.code === 0) {
                    this.finished();
                } else {
                    window.$message({
                        content: window.errCode.getWebApiErrorCode(
                            res.data.result.code),
                        type: 'danger'
                    });
                }
            },
            () => {
            });
    }

    checkAll(codeList) {
        const funs = [];
        const getFunctionName = (key) => {
            switch (key) {
            case this.sms:
                return 'smsVerify';
            case this.email:
                return 'emailCheck';
            case this.google:
                return 'googleCheck';
            }
        };
        for (const item of codeList) {
            if (!item.code) {
                window.$message({
                    content: '该字段不能为空',
                    type: 'danger'
                });
                return;
            }

            funs.push(new Promise((resolve, reject) => {
                window.gWebApi[getFunctionName(item.key)]({ code: item.code },
                    res => {
                        if (res.result.code === 0) {
                            resolve();
                        } else {
                            window.$message({
                                content: window.errCode.getWebApiErrorCode(
                                    res.data.result.code),
                                type: 'danger'
                            });
                            reject(res.result.msg);
                        }
                    },
                    err => {
                        reject(err);
                    }
                );
            }));
        }
        Promise.all(funs).then(() => {
            this.finished();
        });
    }

    /**
     * 校验结果
     */
    finished() {
        if (this.callbackHandler) {
            this.callbackHandler();
        }
        // window.gBroadcast.emit({
        //     cmd: 'smsAndEmailSuc',
        //     data: 'ready'
        // });
    }

    close() {
        // const config = {};
        // config.display = false;
        // config.inputValue = '';
        // config.type = 0;
        // config.loading = false;
        // window.gBroadcast.emit({
        //     cmd: 'setValidateSheet',
        //     data: config
        // });
        this.emailConfig = null;
        this.smsConfig = null;
        this.allConfig = null;
        this.callbackHandler = null;
        this.validateType = '';
        // window.gBroadcast.offMsg({
        //     key: 'ValidateModule',
        //     cmd: 'geetestMsg',
        //     isall: true
        // });
    }

    // initGeetest() {
    //     const self = this;
    //     geetest.init(() => {
    //     });
    //     window.gBroadcast.onMsg({
    //         key: 'ValidateModule',
    //         cmd: 'geetestMsg',
    //         cb: res => {
    //             if (this.validateType !== 'google') {
    //                 return;
    //             }
    //             if (res === 'success') {
    //                 self.checkGoogleCode(self.code);
    //                 self.validateSheet.loading = false;
    //             } else {
    //                 self.validateSheet.loading = false;
    //             }
    //         }
    //     });
    // }
}

export default Validate;