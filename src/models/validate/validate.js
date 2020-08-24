import {
    getSMSCodeV2,
    emailCheckV2,
    googleCheck,
    sendEmailV2,
    smsVerifyV2
} from '../../newApi';

import I18n from '../../languages/I18n';
import config from '@/config';

export default {
    callbackHandler: null, // 验证结果回调
    emailConfig: null, // 发送邮件配置
    smsConfig: null, // 发送短信配置
    /**
     * 激活短信验证弹窗
     * @param params
     * @callback callback
     */
    activeSms(params, callback) {
        this.validateType = 'sms';
        this.smsConfig = params;
        if (callback) {
            this.callbackHandler = callback;
        }
    },
    /**
     * 激活邮箱验证弹窗
     * @param params
     * @callback callback
     */
    activeEmail(params, callback) {
        this.validateType = 'email';
        this.emailConfig = params;
        if (callback) {
            this.callbackHandler = callback;
        }
    },
    /**
     * 激活谷歌验证弹窗
     * @param params
     * @callback callback
     */
    activeGoogle(params, callback) {
        this.validateType = 'google';
        if (callback) {
            this.callbackHandler = callback;
        }
    },
    /**
     * 发送短信验证码
     */
    sendSmsCode() {
        if (this.smsConfig.constructor === Object) {
            this.smsConfig.exChannel = config.exchId;
            this.smsConfig.lang = I18n.getLocale();
        } else {
            this.smsConfig = {
                exChannel: config.exchId,
                lang: I18n.getLocale()
            };
        }
        return getSMSCodeV2(this.smsConfig);
    },
    /**
     * 发送邮箱验证码
     */
    sendEmailCode() {
        if (this.emailConfig.constructor === Object) {
            this.emailConfig.exChannel = config.exchId;
        } else {
            this.emailConfig = { exChannel: config.exchId };
        }

        return sendEmailV2(this.emailConfig);
    },
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
        googleCheck({ code: code }).then(res => {
            if (res.result.code === 0) {
                this.finished();
            } else {
                window.$message({
                    content: res.result.msg,
                    type: 'danger'
                });
            }
        }).catch(err => {
            console.log('tlh', err);
        });
    },
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
        smsVerifyV2({ code: code }).then(res => {
            if (res.result === 0) {
                this.finished();
            } else {
                window.$message({
                    content: res.result.msg,
                    type: 'danger'
                });
            }
        });
    },
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
        emailCheckV2({ code: code }).then(res => {
            if (res.result.code === 0) {
                this.finished();
            } else {
                window.$message({
                    content: res.result.msg,
                    type: 'danger'
                });
            }
        });
    },
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
    },
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
    },
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
    },
    /**
     * 校验结果
     */
    finished() {
        if (this.callbackHandler) {
            this.callbackHandler();
        }
    },
    close() {
        this.emailConfig = null;
        this.smsConfig = null;
        this.callbackHandler = null;
        this.validateType = '';
    }
};