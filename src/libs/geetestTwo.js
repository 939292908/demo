let geeObj = {
    captchaObj: null,
    isloading:false
}
geeObj.initGee = function(readyCallBack){
    geeObj.isloading = true
    let lang = vm.$i18n.locale ?
    vm.$i18n.locale == "zh" ?
    "zh-cn" :
    vm.$i18n.locale == "tw" ?
    "zh-tw" :
    "en" :
    "en";
    vm.rajax.get(`${API.GEETEST_REGISTER}?t=${new Date().getTime()}`).then(data => {
        initGeetest({
                gt: data.data.gt,
                challenge: data.data.challenge,
                offline: !data.data.success,
                new_captcha: data.data.new_captcha,
                product: "bind",
                lang: lang
            },
            function(captchaObj) {
                // vm.prototype.GeetestCaptchaObj = captchaObj
                captchaObj
                    .onReady(function() {
                        //验证码ready之后才能调用verify方法显示验证码
                        geeObj.isloading = false
                        geeObj.captchaObj = captchaObj
                        broadcastIns.$emit('geetestMsg', 'ready')
                        readyCallBack && readyCallBack()
                    })
                    .onSuccess(function() {
                        let result = captchaObj.getValidate();
                        geeObj.isloading = false
                        vm.urajax.post(
                                API.GEETEST_VALIDATE,
                                vm.qs.stringify({
                                    geetest_challenge: result.geetest_challenge,
                                    geetest_validate: result.geetest_validate,
                                    geetest_seccode: result.geetest_seccode
                                })
                            )
                            .then(
                                data => {
                                    if (data.data.status === "success") {
                                        broadcastIns.$emit('geetestMsg', 'success')
                                        // captchaObj.destroy()
                                    } else if (data.data.status === "fail") {
                                        //TODO:提示验证码失败
                                        broadcastIns.$emit('geetestMsg', 'fail')
                                        vm.$message(`fail，极验验证失败，请稍后重试 (${data.data.code})`, 'error')
                                        captchaObj.reset();
                                    }else {
                                        //TODO:提示验证码失败
                                        broadcastIns.$emit('geetestMsg', 'fail')
                                        vm.$message(`${data.data.status || 'Other fail'} 极验验证失败，请稍后重试 (${data.data.code})`, 'error')
                                        captchaObj.reset();
                                    }
                                },
                                err => {
                                    //TODO:提示验证码失败
                                    broadcastIns.$emit('geetestMsg', 'fail')
                                    vm.$message(`网络异常，请稍后重试`, 'error')
                                    captchaObj.reset();
                                }
                            );
                    })
                    .onError(function() {
                        geeObj.isloading = false
                        geeObj.captchaObj = null
                        // vm.$message(`error 初始化极验失败，请稍后重试`, 'error')
                    })
                    .onClose(function () {
                        geeObj.isloading = false
                        broadcastIns.$emit('geetestMsg', 'close')
                    });
            }
        );
    }).catch(err=>{
        geeObj.isloading = false
        console.log(API.GEETEST_REGISTER, err);
    });

}

geeObj.init = function(readyCallBack){
    // console.log('this.captchaObj',this.captchaObj,geeObj)
    if(this.captchaObj || geeObj.isloading){
        return
    }
    this.initGee(readyCallBack);
}

geeObj.verify = function(errCallBack){
    console.log('geeObj',geeObj)
    let self = this;
    if(self.captchaObj){
        self.captchaObj.verify();
    }else{
        if(geeObj.isloading) {
            errCallBack && errCallBack()
            return vm.$message('极验验证加载未完成，请稍后再试','error')
        }else {
            self.initGee(()=>{
                self.captchaObj.verify();
            });
        }
        
    }
}

geeObj.destroy = function() {
    if(this.captchaObj) {
        this.captchaObj.destroy();
        this.captchaObj = null
    }
}

export default geeObj;