import broadcast from '../../broadcast/broadcast';
import I18n from '../../languages/I18n';
import { webApi } from '../../api';

const geetest = {
    isLoading: false,
    readyCallBack: null,
    captchaOb: null,
    /**
     * 初始化完成回调
     */
    onReady() {
        // 验证码ready之后才能调用verify方法显示验证码
        geetest.isloading = false;
        broadcast.emit({
            cmd: 'geetestMsg',
            data: 'ready'
        });
        geetest.readyCallBack && geetest.readyCallBack();
    },
    /**
     * 验证回调
     */
    onSuccess() {
        const result = geetest.captchaObj.getValidate();
        geetest.isloading = false;
        webApi.geetestValidate({
            geetest_challenge: result.geetest_challenge,
            geetest_validate: result.geetest_validate,
            geetest_seccode: result.geetest_seccode
        }).then(data => {
            if (data.status === 'success') {
                broadcast.emit({
                    cmd: 'geetestMsg',
                    data: 'success'
                });
                // captchaObj.destroy()
            } else if (data.status === 'fail') {
                // 提示验证码失败
                broadcast.emit({
                    cmd: 'geetestMsg',
                    data: 'fail'
                });
                window.$message({
                    content: `fail，极验验证失败，请稍后重试 (${data.code})`,
                    type: 'danger'
                });
                geetest.captchaObj.reset();
            } else {
                // 提示验证码失败
                broadcast.emit({
                    cmd: 'geetestMsg',
                    data: 'fail'
                });
                window.$message({
                    content: `${data.status ||
                    'Other fail'} 极验验证失败，请稍后重试 (${data.code})`,
                    type: 'danger'
                });
                geetest.captchaObj.reset();
            }
        }).catch(err => {
            console.log('tlh', err);
            // 提示验证码失败
            broadcast.emit({
                cmd: 'geetestMsg',
                data: 'fail'
            });
            window.$message({
                content: I18n.$t('10340')/* '网络异常，请稍后重试' */,
                type: 'danger'
            });
            geetest.captchaObj.reset();
        });
    },
    /**
     * 错误回调
     */
    onError() {
        geetest.isloading = false;
        // window.$message({
        //     content: '初始化极验失败，请稍后重试',
        //     type: 'danger'
        // });
    },
    /**
     * 关闭验证回调
     */
    onClose() {
        geetest.isloading = false;
        broadcast.emit({
            cmd: 'geetestMsg',
            data: 'close'
        });
    },
    /**
     * 初始化极验
     * @callback readyCallBack 初始化回调
     */
    init(readyCallBack) {
        this.isLoading = true;
        this.readyCallBack = readyCallBack;
        const lang = I18n.getLocale()
            ? I18n.getLocale() === 'zh'
                ? 'zh-cn'
                : I18n.getLocale() === 'tw'
                    ? 'zh-tw'
                    : 'en'
            : 'en';
        webApi.geetestRegister({ t: new Date().getTime() }).then(data => {
            window.initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: data.new_captcha,
                product: 'bind',
                lang: lang
            }, captchaObj => {
                this.captchaObj = captchaObj;
                captchaObj
                    .onReady(this.onReady)
                    .onSuccess(this.onSuccess)
                    .onError(this.onError)
                    .onClose(this.onClose);
            });
        }).catch(() => {
            this.isloading = false;
        });
    },
    verify(errCallBack) {
        const self = this;
        if (this.captchaObj) {
            this.captchaObj.verify();
        } else {
            if (this.isloading) {
                errCallBack && errCallBack();
                window.$message({
                    content: '极验验证加载未完成，请稍后再试',
                    type: 'danger'
                });
                this.init(() => {
                    self.captchaObj.verify();
                });
            } else {
                self.captchaObj.verify();
            }
        }
    },
    destroy() {
        if (this.captchaObj) {
            this.captchaObj.destroy();
            this.captchaObj = null;
        }
    }
};

export default geetest;