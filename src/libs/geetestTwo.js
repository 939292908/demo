const geeObj = {
    captchaObj: null,
    isloading: false
};
const Http = require('@/newApi');

geeObj.initGee = function (readyCallBack) {
    geeObj.isloading = true;

    const lang = window.gI18n.locale
        ? window.gI18n.locale === "zh"
            ? "zh-cn"
            : window.gI18n.locale === "tw"
                ? "zh-tw"
                : "en"
        : "en";

    const onReady = function (captchaObj) {
        // 验证码ready之后才能调用verify方法显示验证码
        geeObj.isloading = false;
        geeObj.captchaObj = captchaObj;
        window.gBroadcast.emit({ cmd: 'geetestMsg', data: 'ready' });
        readyCallBack && readyCallBack();
    };

    const onSuccess = function (captchaObj) {
        const result = captchaObj.getValidate();
        geeObj.isloading = false;
        Http.geetestValidate({
            geetest_challenge: result.geetest_challenge,
            geetest_validate: result.geetest_validate,
            geetest_seccode: result.geetest_seccode
        }).then(data => {
            if (data.status === "success") {
                window.gBroadcast.emit({ cmd: 'geetestMsg', data: 'success' });
                // captchaObj.destroy()
            } else if (data.status === "fail") {
                // 提示验证码失败
                window.gBroadcast.emit({ cmd: 'geetestMsg', data: 'fail' });
                window.$message({ content: `fail，极验验证失败，请稍后重试 (${data.code})`, type: 'danger' });
                captchaObj.reset();
            } else {
                // 提示验证码失败
                window.gBroadcast.emit({ cmd: 'geetestMsg', data: 'fail' });
                window.$message({ content: `${data.status || 'Other fail'} 极验验证失败，请稍后重试 (${data.code})`, type: 'danger' });
                captchaObj.reset();
            }
        }).catch(() => {
            // 提示验证码失败
            window.gBroadcast.emit({ cmd: 'geetestMsg', data: 'fail' });
            window.$message({ content: '网络异常，请稍后重试', type: 'danger' });
            captchaObj.reset();
        });
    };

    const onError = function () {
        geeObj.isloading = false;
        geeObj.captchaObj = null;
        window.$message({ content: '初始化极验失败，请稍后重试', type: 'danger' });
    };

    const onClose = function () {
        geeObj.isloading = false;
        window.gBroadcast.emit({ cmd: 'geetestMsg', data: 'close' });
    };

    Http.geetestRegister({ t: new Date().getTime() }).then(data => {
        window.initGeetest({
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.new_captcha,
            product: "bind",
            lang: lang
        },
        function (captchaObj) {
            window._console.log('tlh', captchaObj);
            captchaObj
                .onReady(() => {
                    onReady(captchaObj);
                })
                .onSuccess(() => {
                    onSuccess(captchaObj);
                })
                .onError(() => {
                    onError();
                })
                .onClose(() => {
                    onClose();
                });
        });
    }).catch(() => {
        geeObj.isloading = false;
        // console.log(API.GEETEST_REGISTER, err);
    });
};

geeObj.init = function (readyCallBack) {
    // console.log('this.captchaObj',this.captchaObj,geeObj)
    if (this.captchaObj || geeObj.isloading) {
        return;
    }
    this.initGee(readyCallBack);
};

geeObj.verify = function (errCallBack) {
    // console.log('geeObj', geeObj)
    const self = this;
    if (self.captchaObj) {
        self.captchaObj.verify();
    } else {
        if (geeObj.isloading) {
            errCallBack && errCallBack();
            return window.$message({ content: '极验验证加载未完成，请稍后再试', type: 'danger' });
        } else {
            self.initGee(() => {
                self.captchaObj.verify();
            });
        }
    }
};

geeObj.destroy = function () {
    if (this.captchaObj) {
        this.captchaObj.destroy();
        this.captchaObj = null;
    }
};

module.exports = geeObj;