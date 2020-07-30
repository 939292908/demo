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
let qs = require('qs');

import Conf from "../reqConf/Conf"
import { RequestWarp } from "../libs/webcall"
import config from '../config'

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
        },
        wallets: {
            '01': [],
            '02': [],
            '03': [],
            '04': [],
        },
        wallets_obj: {
            '01': {},
            '02': {},
            '03': {},
            '04': {},
        }
    }
    setting = { // true是每次都提示 false不提示
        email: {
            'email_1': true,
            'email_2': true,
            'email_3': true,
            'email_4': true,
            'email_5': true,
        },
        system: {
            'system_1': true, // 1委托已提交提示  1 2
            'system_2': true, // 2委托已取消提示 5 6 7 11
            'system_3': true, // 3委托完成提示 4 10
            'system_4': true, // 4计划委托已提交提示
            'system_5': true, // 5计划委托已触发提示
            'system_6': true, // 6计划委托已取消提示
        },
        trade: { // 交易 = 1限价 2市价 3限价计划 4市价计划 5市价平仓
            'trade_1': true,
            'trade_2': true,
            'trade_3': true,
            'trade_4': true,
            'trade_5': true,
        },
        ord_system: {
            'ord_system_1': true, // 1委托已提交提示  1 2
            'ord_system_2': true, // 2委托已取消提示 5 6 7 11
            'ord_system_3': true, // 3委托完成提示 4 10
            'ord_system_4': true, // 4计划委托已提交提示
            'ord_system_5': true, // 5计划委托已触发提示
            'ord_system_6': true, // 6计划委托已取消提示
        },
        ord_trade: { // 交易 = 1限价 2市价 3止盈止损
            'ord_trade_1': true,
            'ord_trade_2': true,
            'ord_trade_3': true,
        },
        _trade: { // 交易 = 1反向开仓 2追单
            '_trade_1': true,
            '_trade_2': true,
        },
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
                        if (s.isLogin() && config.loginType == 0) {
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

                    //获取用户设置
                    let optionFlag = result.account.optionFlag
                    s.ReqUserOrdSetting(s.setting,optionFlag)

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

    ReqGetAssets(aData,aOnSuccess,aOnError) {
        /**
         * 获取用户资产
         * aData: {exChannel: 0}
         */
        let s = this;
        if (DBG_REQUEST) {console.debug(DBG_TAG,"ReqGetAssets Req",aData)}
        RequestWarp({
                method:"POST",
                withCredentials:true,
                url:s.CTX.Conf.WebAPI + "/v1/users/GetAssets",
                body:aData,
            }
            ,function (result){
                if (DBG_REQUEST) {console.debug(DBG_TAG,"ReqGetAssets Rsp",aData)}
                if (result.result.code ==0) {
                    s.CTX.wallets['01'] = result.assetLists01
                    s.CTX.wallets['02'] = result.assetLists02
                    s.CTX.wallets['03'] = result.assetLists03
                    s.CTX.wallets['04'] = result.assetLists04
                    for(let item of result.assetLists01){
                        s.CTX.wallets_obj['01'][item.wType] = item
                    }
                    for(let item of result.assetLists02){
                        s.CTX.wallets_obj['02'][item.wType] = item
                    }
                    for(let item of result.assetLists03){
                        s.CTX.wallets_obj['03'][item.wType] = item
                    }
                    for(let item of result.assetLists04){
                        s.CTX.wallets_obj['04'][item.wType] = item
                    }
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

    
    ReqTransfer(aData,aOnSuccess,aOnError) {
        /**
         * 获取用户资产
         * aData: {
                    aTypeFrom: '01',
                    aTypeTo: '02',
                    wType: 'USDT',
                    num: 10
                }
         */
        let s = this;
        if (DBG_REQUEST) {console.debug(DBG_TAG,"ReqTransfer Req",aData)}
        RequestWarp({
                method:"POST",
                withCredentials:true,
                url:s.CTX.Conf.WebAPI + "/users/Transfer",
                body:aData,
            }
            ,function (result){
                if (DBG_REQUEST) {console.debug(DBG_TAG,"ReqTransfer Rsp",aData)}
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


    setWebApiUrl(param){
        let s = this
        s.CTX.Conf.WebAPI = param

    }

    //获取用户设置
    ReqUserOrdSetting(setting,optionFlag){
        /**
         * 获取用户设置
         * optionFlag: "268435427"
        */
       let s = this

       // 设置初始化
       let all_flag = [5, 6, 5, 6, 3, 2] //邮件5个标记 系统6个标记 交易5个标记
       let _result = Number(optionFlag).toString(2)
       if (parseInt(_result.substring(0, 1)) == 1) { // 第一个位置作为标记 0没设置 1设置
           _result = _result.substring(1, _result.length)

           let l = _result.length
           let s1 = "0000000000000000000000000"
           if (l < 25) {
               let s2 = s1.slice(0, 25 - l)
               _result = s2 + _result
           }
           l = _result.length
           if (l < 27) {
               let s1 = "111111111111111111111111111"
               let s2 = s1.slice(0, 27 - l)
               _result = _result + s2
           }

       }else{
           let s1 = "1111111111111111111111111111111111"
           _result = s1.slice(0, 27)
       }
       let _data = {
           email: null,
           system: null,
           trade: null,
           ord_system: null,
           ord_trade: null,
       }
       _data.email = _result.substring(0, all_flag[0]).split("")
       _data.system = _result.substring(all_flag[0], all_flag[0] + all_flag[1]).split("")
       _data.trade = _result.substring(all_flag[0] + all_flag[1], all_flag[0] + all_flag[1] + all_flag[2]).split("")
       _data.ord_system = _result.substring(all_flag[0] + all_flag[1] + all_flag[2], all_flag[0] + all_flag[1] + all_flag[2] + + all_flag[3]).split("")
       _data.ord_trade = _result.substring(all_flag[0] + all_flag[1] + all_flag[2] + all_flag[3], all_flag[0] + all_flag[1] + all_flag[2] + all_flag[3] + all_flag[4]).split("")
       _data._trade = _result.substring(all_flag[0] + all_flag[1] + all_flag[2] + all_flag[3] + all_flag[4], all_flag[0] + all_flag[1] + all_flag[2] + all_flag[3] + all_flag[4] + all_flag[5]).split("")
       for (let key in setting) {
           for (let i = 0; i < _data[key].length; i++) {
               setting[key][key + "_" + (i + 1)] = (parseInt(_data[key][i]) == true)
           }
       }
       // }
        for(let key  in _data){
            _data[key].map((item,index) => {
                _data[key][index] = item=='1'
            })
        }
        s.CTX.UserSetting = _data
       console.log(parseInt(_result.substring(0, 1)) == 1)
    }

    //保存用户设置
    ReqSaveUserSetting(type,val,aOnSuccess,aOnError) {
        let s = this
        let _result = "1"
        let key = type
        s.setting[key] = val
        let setting = s.setting
        for (let key in setting) {
            let _obj = setting[key]
            for (let k in _obj) {
                _result = _result + (_obj[k] ? 1 : 0)
            }
        }

        let url = '/users/tradeSetting';
        let params = {
            settingCode: parseInt(_result, 2)
        }
        
        if (DBG_REQUEST) {console.log(DBG_TAG,"ReqTransfer ReqSaveUserSetting",params)}
        RequestWarp({
                method:"POST",
                withCredentials:true,
                url:s.CTX.Conf.WebAPI + url,
                body:params,
            }
            ,function (result){
                if (DBG_REQUEST) {console.log(DBG_TAG,"ReqTransfer ReqSaveUserSetting",params)}
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
}

export default CAPI
// let instAPI = new CAPI(Conf.GetActive())
// export { instAPI as API,CAPI }



