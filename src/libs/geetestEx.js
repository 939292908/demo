var m = require("mithril")

import { RequestWarp } from "../libs/webcall"

const ST_GT_NOT_READY = 0;
const ST_GT_INITING = 1;
const ST_GT_WORKING = 2;
const DBG_TAG = "GeeTest"
const ENABLE_DBG = true;
export class  GeeTest {
    St = ST_GT_NOT_READY
    tmDelay = null
    url    = '/geetest/register'
    urlValidate = "/geetest/validate"
    onSuccess = function () {

    };
    onCancel = function () {

    };
    CaptchaObj = null;

    constructor(props) {
        this.onSuccess = props.onSuccess
        this.onCancel = props.onCancel
        this.url = props.url
        this.urlValidate = props.urlValidate
    }
// 初始化极验
    initVerifyGee() {
        let s = this;
        if (true || (s.St==ST_GT_NOT_READY)) {
            if (ENABLE_DBG) {console.log(DBG_TAG,"initVerifyGee")};
            s.Ready = false;
            let sucCallBack = (data) => {
                if (ENABLE_DBG) {console.log(DBG_TAG,"sucCallBack")};
                if (data.success != 1) return //极验失败
                let lang = "zh-cn";
                if (ENABLE_DBG) {console.log(DBG_TAG,"极验语言=", lang)};

                initGeetest({
                    gt: data.gt,
                    challenge: data.challenge,
                    offline: !data.success,
                    new_captcha: data.new_captcha,
                    product: 'bind',
//                    width: '400px',
                    lang: lang
                }, (captchaObj) => {
                    if (ENABLE_DBG) {console.log(DBG_TAG,"captchaObj=>", captchaObj)};
                    s.CaptchaObj = captchaObj
                    captchaObj.appendTo('#captcha') //绑定到DOM 里
                    captchaObj.onReady(() => {
                        s.St = ST_GT_WORKING
                        if (ENABLE_DBG) {console.log(DBG_TAG,"onReady")};
                    }).onSuccess(() => {
                        if (ENABLE_DBG) {console.log(DBG_TAG,"onSuccess")};
                        {
                            //判断验证码是否正确
                            let result = s.CaptchaObj.getValidate();
                            if(!result){
//                                s.$message.error(appString.loginPage.nullCode)//验证码为空！
                                return;
                            }
                            RequestWarp({
                                method: "post",
                                url: s.urlValidate,
                                withCredentials:true,
                                body:{
                                    geetest_challenge: result.geetest_challenge,
                                    geetest_validate: result.geetest_validate,
                                    geetest_seccode: result.geetest_seccode
                                }
                            },function (result) {
                                s.CaptchaObj.reset();
                                if (result.status=='success')
                                {
                                    s.onSuccess(result)
                                }else{
//                                        s.$message.error(appString.loginPage.secondnullCode)//验证码二次验证失败！
                                    s.onCancel()
                                }
                            },function (err) {
                                console.log(s.urlValidate +' request error')
                            })
                        }
                    }).onError(() => {
                        if (ENABLE_DBG) {console.log(DBG_TAG,"onError")};
                        s.St = ST_GT_NOT_READY
                        console.log("onError")
                        s.onCancel()
                    }).onClose(() => {
                        if (ENABLE_DBG) {console.log(DBG_TAG,"onClose")};
                        s.St = ST_GT_NOT_READY
                        console.log("onClose")
                        s.onCancel()
                    })
                })
            }
            if (s.tmDelay == null) {
                s.tmDelay = setTimeout(() => {
                        if (s.St == ST_GT_INITING) {
                            s.St = ST_GT_NOT_READY
                        }
                        ;
                        s.tmDelay = null;
                    }
                    , 5000)
            }
            s.St = ST_GT_INITING;

            RequestWarp({
                method: "GET",
                url: s.url,
                withCredentials:true,
                params:{
                    t:Date.now()
                }
            },function (result) {
                sucCallBack(result)
            },function (err) {
                console.log(s.url +' request error')
            })
        }
    }
    Verify() {
        if (this.CaptchaObj) {
            this.CaptchaObj.verify();
        }
    }
    destroy() {
        if (this.CaptchaObj) {
            this.CaptchaObj.destroy();
        }
    }

}
