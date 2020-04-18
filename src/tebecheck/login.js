let _config = {
    "01": { // 稳定版本环境36 B
        LOGIN_URL: "http://192.168.2.36:8888",
        HOME_URL: "http://192.168.2.36",
        MARKET_URL: 'ws://192.168.2.48:20080/v1/market',
        TRADE_URL: 'ws://192.168.2.48:50301/v1/trade'
    },
    "02": { // 较不稳定版本环境89 A
        LOGIN_URL: "http://192.168.2.89:8888",
        HOME_URL: "http://192.168.2.89",
        EMAIL_URL: "http://192.168.2.89:8000/api",
        MARKET_URL: 'ws://192.168.2.85:20080/v1/market',
        TRADE_URL: 'ws://192.168.2.85:50301/v1/trade'
    },
    "03": { // 不稳定版本环境36 C
        LOGIN_URL: "http://192.168.2.83:8888",
        HOME_URL: "http://192.168.2.83",
        MARKET_URL: 'ws://192.168.2.86:20080/v1/market',
        TRADE_URL: 'ws://192.168.2.86:50301/v1/trade'
    },
    "001": {  // 正式备份
        LOGIN_URL: "https://www.gmex.io/wd",
        HOME_URL: "https://www.gmex.io",
        EMAIL_URL: "https://www.gmex.io/usersms",
        MARKET_URL: 'wss://s0.gmex.io/v1/market',//'wss://api-market.gmex.io/v1/market',
        TRADE_URL: 'wss://s0.gmex.io/v1/trade', //'wss://api-trade.gmex.io/v1/trade'
    },
    "001_Host": {  // 正式
        LOGIN_URL:  "https://" + Pre_Host + "/wd",
        HOME_URL:   "https://" + Pre_Host + "",
        EMAIL_URL:  "https://" + Pre_Host + "/usersms",
        MARKET_URL: 'wss://' + Pre_Host + '/v1/market',//'wss://api-market.gmex.io/v1/market',
        TRADE_URL:  'wss://' + Pre_Host + '/v1/trade',//'wss://api-trade.gmex.io/v1/trade'
    },
}


//  极验标签. 显示验证码
    /*
     <div id="captcha" style="margin-top:10px;margin-bottom:20px;"></div>
    */
    let gCaptchaObj = this.captchaObj;
// 这个估计就是个全局变量，保存极验的那个对象
////////////////////////////////////////// JS======= //////////////////////

// 初始化极验
function initVerifyGee(){

    let sucCallBack = (data)=>{

        if (data.success!=1) return //极验失败

        let lang = this.$i18n.locale ? (this.$i18n.locale == "zh" ? "zh-cn" : this.$i18n.locale == "tw" ? "zh-tw" : "en" ) : "en";
        console.log("极验语言=", lang);

        initGeetest({
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.new_captcha,
            product: 'bind',
            width: '100%',
            lang: lang
        },(captchaObj)=>{
            // 初始化是否成功，要有个标记
            console.log("captchaObj=>", captchaObj)
            this.captchaObj = captchaObj
            captchaObj.appendTo('#captcha')
            captchaObj.onReady(()=>{
                console.log("onReady")
                this.isGoJY   = true
            }).onSuccess(()=>{
                console.log("onSuccess")
                this.onGeeTestInitialed()
            }).onError(()=>{
                console.log("onError")
            }).onClose(()=>{
                console.log("onClose")
            })
        })
    }

    let url    = '/geetest/register'
    this.axios.Get({url,sucCallBack})
}

// 极验认证
// Step1
function Login() {
    this.captchaObj.verify()
}


// 极验认证
function onGeeTestInitialed(){

    //判断验证码是否正确
    let result = this.captchaObj.getValidate();
    if(!result){
        this.$message.error(appString.loginPage.nullCode)//验证码为空！
        return;
    }

    let url    = '/geetest/validate'
    let params = {
        geetest_challenge: result.geetest_challenge,
        geetest_validate: result.geetest_validate,
        geetest_seccode: result.geetest_seccode
    }
    let sucCallBack = (data) =>{
        console.log("二次验证suc data=", data)
        if (data.status=='success')
        {
            this.OnGeeTestOk('user')
        }else{
            this.$message.error(appString.loginPage.secondnullCode)//验证码二次验证失败！
            this.captchaObj.reset();
        }
    }
    this.axios.Post({url, params,sucCallBack})
}

// 用户名密码认证
function OnGeeTestOk(formName){
    this.$refs[formName].validate((valid) => {
        if (!valid) return

        let url = '/v1/users/loginCheck'
        var CryptoJS = require('crypto-js');
        this.loginType = this.user.aid.indexOf("@")==-1 ? "phone" : "email"
        let params = {
            loginName: this.user.aid,//account
            pass:CryptoJS.MD5(this.user.password).toString(),
            loginType: this.loginType,
        }

        let sucCallBack = (data)=>{
            let code   = data.result.code
            let config = this.axios.config
            switch (code)
            {
                case config.LOGIN_SUCCESS:
                    console.log("是否有短信谷歌验证=", this.Login_2(data.result))
                    if ( !this.isNeedSMSG(data.result) ){
                        this.enterAPP(data.token)
                    }
                    break;
                default:
                    this.$message.error(appString.loginPage[code])
            }
        }

        this.axios.Post( {url, params,sucCallBack} )
    })
}

// 判断是否需要短信或者邮箱验证
function isNeedSMSG(data){
    let loginSms      = data.loginSms || 0 // 1:开启短信验证，0:关闭短信验证，谷歌验证是一直开启的
    let sms_status    = false
    let google_status = false
    if(data.phone && data.phone.length>0 && Number(loginSms)==1 ){
        sms_status = true
        this.validSms = data.phone
    }
    if(data.googleId && data.googleId.length>0){
        google_status = true
        this.validGoogle = data.googleId
    }

    if (sms_status && google_status){
        this.step = 4
        return true
    }else if(sms_status){
        this.step = 2
        this.verifyStyle = 2
        return true
    }else if(google_status){
        this.step = 3
        this.verifyStyle = 1
        return true
    }else{
        return false
    }
}

//获取短信验证码
function sendSMSClick(){
    let sucCallBack = (data) =>{
        if(data.result.code!=0){
            el.innerHTML   = appString.loginPage.sendAgain//'再次发送';
            this.$message.error(appString.loginPage.sendCodeError)//"验证码发送失败！"
        }
    }
    let url = '/v1/sms/getSMSCode'
    let params = {
        phoneNum: this.validSms // 手机号
    }

    this.axios.Post( {url, params,sucCallBack} )
}

// 谷歌 短信 验证码验证
function verify_G_SMS_Code(){
    let sucCallBack = (data) =>{
        let result_code = this.verifyStyle==2 ? data.result : data.result.code
        if (result_code!=0) {
            return this.$message.error(appString.loginPage.secondCodeError)//"二次验证失败！"
        }

        this.login_web()
    }

    let params,url
    let error_msg

    if (this.verifyStyle==1){ //google
        if(!this.g_code || this.g_code.length<1){
            this.$message.error(appString.loginPage.codeMSG)//"验证码不能为空！"
            return
        }
        url = '/g_auth/verify'
        params = {
            code: this.g_code
        }

    }else if (this.verifyStyle==2){ //sms
        if(!this.sms_code || this.sms_code.length<1){
            this.$message.error(appString.loginPage.codeMSG)//"验证码不能为空！"
            return
        }
        url = '/v1/sms/verify'
        params = {
            phoneNum: this.validSms,
            code: this.sms_code
        }
    }

    this.axios.Post( {url, params,sucCallBack} )
}

// 获取登陆token
function login_web(){
    let url = '/v1/users/loginWeb'
    let params = {}
    let sucCallBack = (data)=>{
        if( data.result.code != 0 ){
            return this.$message.error(appString.loginPage.secondCodeError)//"二次验证失败！"
        }
        this.enterAPP(data.token)
    }

    this.axios.Post( {url, params,sucCallBack} )
}
