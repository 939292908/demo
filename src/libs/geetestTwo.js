let geeObj = {
    captchaObj: null,
    isloading: false
}

geeObj.initGee = function (readyCallBack) {
    geeObj.isloading = true

    let lang = gI18n.locale ?
        gI18n.locale == "zh" ?
            "zh-cn" :
            gI18n.locale == "tw" ?
                "zh-tw" :
                "en" :
        "en";

    let onReady = function (captchaObj) {
        //验证码ready之后才能调用verify方法显示验证码
        geeObj.isloading = false;
        geeObj.captchaObj = captchaObj;
        gBroadcast.emit('geetestMsg', 'ready');
        readyCallBack && readyCallBack();
    }

    let onSuccess = function (captchaObj) {

        let result = captchaObj.getValidate();
        geeObj.isloading = false
        gWebApi.geetestValidate({
                geetest_challenge: result.geetest_challenge,
                geetest_validate: result.geetest_validate,
                geetest_seccode: result.geetest_seccode
            }, data => {
                if (data.status === "success") {
                    gBroadcast.emit('geetestMsg', 'success');
                    // captchaObj.destroy()
                } else if (data.status === "fail") {
                    //提示验证码失败
                    gBroadcast.emit('geetestMsg', 'fail');
                    $message({content: `fail，极验验证失败，请稍后重试 (${data.code})`});
                    captchaObj.reset();
                } else {
                    //提示验证码失败
                    gBroadcast.emit('geetestMsg', 'fail');
                    $message({content: `${data.status || 'Other fail'} 极验验证失败，请稍后重试 (${data.code})`});
                    captchaObj.reset();
                }
            }, err => {
                //提示验证码失败
                gBroadcast.emit('geetestMsg', 'fail');
                $message({content: '网络异常，请稍后重试'});
                captchaObj.reset();
            }
        );
    }

    let onError = function () {
        geeObj.isloading = false;
        geeObj.captchaObj = null;
        $message({content: '初始化极验失败，请稍后重试'});
    }

    let onClose = function () {
        geeObj.isloading = false;
        gBroadcast.emit('geetestMsg', 'close');
    }

    gWebApi.geetestRegister({t: new Date().getTime()}, data => {
        initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: data.new_captcha,
                product: "bind",
                lang: lang
            },
            function (captchaObj) {
                _console.log('tlh', captchaObj);
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
            }
        );
    }, err => {
        geeObj.isloading = false;
        // console.log(API.GEETEST_REGISTER, err);
    });

}

geeObj.init = function (readyCallBack) {
    // console.log('this.captchaObj',this.captchaObj,geeObj)
    if (this.captchaObj || geeObj.isloading) {
        return;
    }
    this.initGee(readyCallBack);
}

geeObj.verify = function (errCallBack) {
    // console.log('geeObj', geeObj)
    let self = this;
    if (self.captchaObj) {
        self.captchaObj.verify();
    } else {
        if (geeObj.isloading) {
            errCallBack && errCallBack();
            return $message({content: '极验验证加载未完成，请稍后再试'});
        } else {
            self.initGee(() => {
                self.captchaObj.verify();
            });
        }

    }
}

geeObj.destroy = function () {
    if (this.captchaObj) {
        this.captchaObj.destroy();
        this.captchaObj = null;
    }
}

module.exports = geeObj;