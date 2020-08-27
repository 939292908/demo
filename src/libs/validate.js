const Http = require('@/newApi2');

class Validate {
    constructor() {
        this.sms = 1;
        this.google = 2;
        this.email = 3;
        this.tradepwd = 4;
        this.emailConfig = null; // 发送邮件配置
        this.smsConfig = null; // 发送短信配置
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
        this.smsConfig = params;
        // window.gBroadcast.emit({
        //     cmd: 'setValidateSheet',
        //     data: config,
        // });
        // window.gBroadcast.offMsg({
        //     key: 'ValidateModule',
        //     cmd: 'setValidateSheet',
        //     isall: true
        // });
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
        for (const item of params) {
            switch (item.key) {
            case this.sms:
                this.smsConfig = item.config;
                break;
            case this.email:
                this.emailConfig = item.config;
                break;
            }
        }
        this.validateType = 'all';
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
        Http.getSMSCodeV2(this.smsConfig).then(res => {
            if (callback1) {
                callback1();
            }
            if (callback) {
                callback(res);
            }
        }).catch(() => {
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

        Http.sendEmailV2(this.emailConfig).then(res => {
            if (callback1) {
                callback1();
            }
            if (callback) {
                callback(res);
            }
        }).catch(() => {
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

        Http.smsVerifyV2(params).then(res => {
            if (res.result === 0) {
                this.finished();
            } else {
                window.$message({
                    content: res.result.msg,
                    type: 'danger'
                });
            }
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
        Http.googleCheck({ code: code }).then(res => {
            if (res.result.code === 0) {
                this.finished();
            } else {
                // this.validateSheet.loading = false;
                window.$message({
                    content: res.result.msg,
                    type: 'danger'
                });
            }
        }).catch(err => {
            window._console.log('tlh', err);
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
        Http.emailCheckV2({ code: code }).then(res => {
            if (res.result.code === 0) {
                this.finished();
            } else {
                window.$message({
                    content: res.result.msg,
                    type: 'danger'
                });
            }
        });
    }

    /**
     * 多重验证
     * @param codeList 验证码
     * [
     *      {
     *          key: window.validate.sms,
     *          name: '手机验证码',
     *          code: '',
     *          config: {
     *              phoneNum: this.areaCode + this.loginName,
     *              resetPwd: true,
     *              areaCode: '00' + this.areaCode,
     *              phone: this.loginName,
     *              mustCheckFn: 'resetPasswd'
     *          }
     *      },
     *      ...
     * ]
     */
    checkAll(codeList) {
        const funs = [];
        for (const item of codeList) {
            if (!item.code) {
                window.$message({
                    content: '该字段不能为空',
                    type: 'danger'
                });
                return;
            }
            let funName = '';
            const params = {};
            params.code = item.code;
            switch (item.key) {
            case this.sms:
                if (this.smsConfig) {
                    params.phoneNum = this.smsConfig.phoneNum;
                }
                funName = 'smsVerify';
                break;
            case this.email:
                funName = 'emailCheck';
                break;
            case this.google:
                funName = 'googleCheck';
                break;
            }

            funs.push(new Promise((resolve, reject) => {
                Http[funName](params).then(res => {
                    if (res.result === 0) {
                        resolve();
                    } else {
                        window.$message({
                            content: window.errCode.getWebApiErrorCode(
                                res.result.code),
                            type: 'danger'
                        });
                        reject(res.result);
                    }
                }).catch(err => {
                    reject(err);
                });
            }));
        }
        Promise.all(funs).then(() => {
            this.finished();
        }).catch(e => {
            window._console.log('tlh', e);
        });
    }

    /**
     * 激活双选择验证手机和Google
     * @param params
     * @param callback
     */
    activeSmsAndGoogle(params, callback) {
        this.validateType = 'sms&google';
        this.smsConfig = params;
        if (callback) {
            this.callbackHandler = callback;
        }
    }

    /**
     * 激活双选择验证手机和邮箱
     * @param params
     * @param callback
     */
    activeSmsAndEmail(params, callback) {
        this.validateType = 'sms&email';
        this.smsConfig = params.smsconfig;
        this.emailConfig = params.emailconfig;
        if (callback) {
            this.callbackHandler = callback;
        }
    }

    /**
     * 激活双选择验证邮箱和Google
     * @param params
     * @param callback
     */
    activeEmailAndGoogle(params, callback) {
        this.validateType = 'email&google';
        this.emailConfig = params;
        if (callback) {
            this.callbackHandler = callback;
        }
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