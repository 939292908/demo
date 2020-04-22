/*
https://stackoverflow.com/questions/29954037/why-is-an-options-request-sent-and-can-i-disable-it
*/
const DBG_REQUEST = true
const DBG_TAG = "API"
const DBG_STATELY = false

const SV_ACCOUNT = "SV_ACCOUNT"
const EV_OPENLOGINMODE = "EV_OPENLOGINMODE"

var m = require("mithril")
let Stately = require('stately.js');

import { Conf } from "../reqConf/Conf"
import { RequestWarp } from "../libs/webcall"

class CAPI {
    EV_UPD_USERINFO = "EV_UPD_USERINFO"

    EV_WEB_LOGIN = "EV_WEB_LOGIN"

    EV_WEB_LOGOUT = "EV_WEB_LOGOUT"

    EV_OPENLOGINMODE = EV_OPENLOGINMODE

    stately = null

    CTXEmpty = {}
    CTX = {
        conf: {

        }
        , loginCheck: {
            result: {
                code: 0,
                googleId: "",
                loginSms: 0,
                phone: "0086-1234567890",
                tfa: 0
            },
            token: ""
        },
        account:{
            accountName: "",
            accountType: "Normal",
            antiFishCode: "",
            birthday: "1",
            brokerInfo: null,
            email: "yourname@email.com",
            exChannel: 0,
            googleId: "",
            iStatus: 9,
            loginIp: "0.0.0.0",
            loginTimestamp: "0",
            loginType: "email",
            name: "姓名",
            nationNo: "0086",
            nationality: "未知",
            noDraw: 0,
            noLogin: 0,
            noTrade: 0,
            optionFlag: "0",
            optionStr: "{\"fav\":[\"DDB/USDT\"]}",
            phone: "",
            refBrokerId: "",
            refereeId: "",
            sex:0,
            token: "",
            totalRbBtc: 0,
            totalRbEth: 0,
            totalRbTrd: 0,
            totalUnderlingNum: 0,
            uName: "",
            uid: "",
            useGAEA: 0,
            warnFlag: 0,
            whiteSetting: 0,
        }
    }

    Url_GT_REGISTER(){
        return this.CTX.Conf.WebAPI+ "/geetest/register"
    }
    Url_GT_VALIDATE(){
        return this.CTX.Conf.WebAPI+ "/geetest/validate"
    }

    constructor(aConf) {
        if (aConf) {
            this.CTX.Conf = aConf
            if (DBG_REQUEST) {
                if (DBG_REQUEST) {console.debug(DBG_TAG,"constructor",aConf)}
            }
        }
        let s = this;
        s.stately = Stately.machine({
                'IDLE': {
                    tick:function (aObj) {

                    }
                },
                'PRELOGIN': {
                    tick:function (aObj) {
                        if(DBG_STATELY){console.log(__filename,"tick", "PRELOGIN")}
                        let stately = this;

                        // 如果已经登陆成功了，那么，就尝试获取额外的信息
                        if (s.isLogin()) {
                            aObj.ReqUserInfo({},function (result) {
                                stately.setMachineState("WORKING")
                                
                            },function (err) {
                                stately.setMachineState("PRELOGIN")
                            })
                            // aObj.ReqFavoriteSetting({})
                            return stately.WAITBASEINFO
                        }
                    }
                },

                'WAITBASEINFO': {
                    tick: function (aObj) {
                        let stately = this;
                        if(DBG_STATELY){console.log(__filename,"tick", "REQBASEINFO")}
                    }
                }
                ,'WORKING': {
                    tick:function (aObj) {
                        if(DBG_STATELY){console.log(__filename,"tick","WORKING")}
                        // 检查Websocket的连接状态，并切换到
                        let stately = this
                        if(!s.isLogin()){
                            return stately.PRELOGIN
                        }
                    }
                },
            }
            ,"PRELOGIN"   //初始状态
        );
        s.LoadAccount();
    }

    SetConf(aConf) {
        if (aConf) {
            this.CTX.Conf = aConf
        }
    }

    isLogin() {
        let s = this;
        return s.CTX.account.token && (s.CTX.account.token.length>0)
    }

    SaveAccount() {
        let s = this;
        window.localStorage.setItem(SV_ACCOUNT,JSON.stringify(s.CTX.account))
    }
    LoadAccount() {
        let s = this;
        let sv_account = window.localStorage.getItem(SV_ACCOUNT)
        if (sv_account && sv_account.length>0) {
            s.CTX.account = JSON.parse(sv_account)
            s.CTX.loginCheck.token = s.CTX.account.token
        }
    }
    CleanAccount() {
        let s = this;
        window.localStorage.removeItem(SV_ACCOUNT)
        s.CTX.account.token=""
        s.CTX.loginCheck.token = ""
    }

    ReqUserLoginCheck(aData,aOnSuccess,aOnError) {
        let s = this;
        if (DBG_REQUEST) {console.debug(DBG_TAG,"ReqUserLoginCheck Req",aData)}
        RequestWarp({
                method:"POST",
                withCredentials:true,
                url:s.CTX.Conf.WebAPI + "/v1/users/loginCheck",
                body:aData,
            },function (result){
                if (DBG_REQUEST) {console.debug(DBG_TAG,"ReqUserLoginCheck Rsp",result)}
                /*
                {
                    result: {
                        code: 0
                        googleId: ""
                        loginSms: 0
                        phone: "0086-18980086832"
                        tfa: 0
                        }
                    token: "HwAAJjttWpsxsAG5ltywLjZvtp0xYhnGnMHkOw4z7OIZZraLMs6xCs8="
                }
                */
                if (result.result.token) {
                    s.CTX.loginCheck = result.result
                }
                if(aOnSuccess) {
                    aOnSuccess(result)
                }
            }
            ,function(e) {
                if (aOnError) {
                    aOnError(e)
                }
            })
    }
    ReqUserLoginWeb(aData,aOnSuccess,aOnError) {
        let s = this;
        if (DBG_REQUEST) {console.debug(DBG_TAG,"ReqUserLoginWeb Req",aData)}
        RequestWarp({
                method:"POST",
                withCredentials:true,
                url:s.CTX.Conf.WebAPI + "/v1/users/loginWeb",
                body:aData,
            },function (result){
                if (DBG_REQUEST) {console.debug(DBG_TAG,"ReqUserLoginWeb Rsp",result)}
                /*
                {
                    result: {
                        code: 0
                        googleId: ""
                        loginSms: 0
                        phone: "0086-18980086832"
                        tfa: 0
                        }
                    token: "OAAAI+wxO5gmmMgjjWbYZ9DZLpFD7DXKdjIFpQ=="
                }
                */
                if (result.token) {
                    s.CTX.loginCheck = result
                }
                if(aOnSuccess) {
                    aOnSuccess(result)
                }
            }
            ,function(e) {
                if (aOnError) {
                    aOnError(e)
                }
            })
    }

    ReqSMSVerifyCode(aData,aOnSuccess,aOnError) {
        let s = this;
        if (DBG_REQUEST) {
            console.debug(DBG_TAG, "ReqSMSVerifyCode Req", aData)
        }
        RequestWarp({
                method: "POST",
                withCredentials: true,
                url: s.CTX.Conf.WebAPI + "/v1/sms/getSMSCode",
                body: aData,
            }, function (result) {
                if (DBG_REQUEST) {
                    console.debug(DBG_TAG, "ReqSMSVerifyCode Rsp", result)
                }
                if (aOnSuccess) {
                    aOnSuccess(result)
                }
            }
            , function (e) {
                if (aOnError) {
                    aOnError(e)
                }
            })
    }
    ReqSMSVerify(aData,aOnSuccess,aOnError) {
        let s = this;
        if (DBG_REQUEST) {
            console.debug(DBG_TAG, "ReqSMSVerify Req", aData)
        }
        RequestWarp({
                method: "POST",
                withCredentials: true,
                url: s.CTX.Conf.WebAPI + "/v1/sms/verify",
                body: aData,
            }, function (result) {
                if (DBG_REQUEST) {
                    console.debug(DBG_TAG, "ReqSMSVerify Rsp", result)
                }
                if (aOnSuccess) {
                    aOnSuccess(result)
                }
            }
            , function (e) {
                if (aOnError) {
                    aOnError(e)
                }
            })
    }

    ReqGoogleVerify(aData,aOnSuccess,aOnError) {
        let s = this;
        if (DBG_REQUEST) {
            console.debug(DBG_TAG, "ReqGoogleVerify Req", aData)
        }
        RequestWarp({
                method: "POST",
                withCredentials: true,
                url: s.CTX.Conf.WebAPI + "/g_auth/verify",
                body: aData,
            }, function (result) {
                if (DBG_REQUEST) {
                    console.debug(DBG_TAG, "ReqGoogleVerify Rsp", result)
                }
                if (aOnSuccess) {
                    aOnSuccess(result)
                }
            }
            , function (e) {
                if (aOnError) {
                    aOnError(e)
                }
            })
    }

    ReqUserInfo(aData,aOnSuccess,aOnError) {
        let s = this;
        if (DBG_REQUEST) {console.debug(DBG_TAG,"ReqUserInfo Req",aData)}
        RequestWarp({
                method:"POST",
                withCredentials:true,
                url:s.CTX.Conf.WebAPI + "/users/userInfo",
                body:aData,
            }
            , function (result){
                if (DBG_REQUEST) {console.debug(DBG_TAG,"ReqUserInfo Rsp",aData)}
                if (result.result.code ==0) {
                    s.CTX.account = result.account
                    gEVBUS.emit(s.EV_WEB_LOGIN,{d:s.CTX})
                }
                if(aOnSuccess) {
                    aOnSuccess(result)
                }
            }
            ,function(e) {
                if (aOnError) {
                    aOnError(e)
                }
            })

    }

    ReqFavoriteSetting(aData,aOnSuccess,aOnError) {
        let s = this;
        if (DBG_REQUEST) {console.debug(DBG_TAG,"ReqFavoriteSetting Req",aData)}
        RequestWarp({
                method:"GET",
                withCredentials:true,
                url:s.CTX.Conf.WebAPI + "/v1/users/favoriteSetting",
                body:aData,
            }
            ,function (result){
                if (DBG_REQUEST) {console.debug(DBG_TAG,"ReqFavoriteSetting Rsp",aData)}
                if(aOnSuccess) {
                    aOnSuccess(result)
                }
            }
            ,function(e) {
                if (aOnError) {
                    aOnError(e)
                }
            })
    }

    ReqSignOut(aData,aOnSuccess,aOnError) {
        let s = this;
        if (DBG_REQUEST) {console.debug(DBG_TAG,"ReqSignOut Req",aData)}
        RequestWarp({
                method:"GET",
                withCredentials:true,
                url:s.CTX.Conf.WebAPI + "/users/out",
                body:aData,
            }
            ,function (result){
                if (DBG_REQUEST) {console.debug(DBG_TAG,"ReqSignOut Rsp",aData)}
                if (result.result.code ==0) {
                    s.CleanAccount()
                    gEVBUS.emit(s.EV_WEB_LOGOUT,{d:s.CTX})
                }
                if(aOnSuccess) {
                    aOnSuccess(result)
                }
            }
            ,function(e) {
                if (aOnError) {
                    aOnError(e)
                }
            })
    }

    needLogin(){
        gEVBUS.emit(EV_OPENLOGINMODE,{})
    }
}

let instAPI = new CAPI(Conf.GetActive())
export { instAPI as API,CAPI }



