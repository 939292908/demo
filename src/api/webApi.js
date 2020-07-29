let _axios = require('@/api/request').default
let qs = require('qs')

const DBG_REQUEST = true
const DBG_TAG = "API"

let API = require('@/api/request_apis')

class webApi {

    constructor(arg){
        this.axios = new _axios()
        this.axios.baseUrl = arg.baseUrl
        this.userInfo = {}
        this.loginSms = true // 登录短信验证
    }

    /**
     * 极验初始化
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    geetestRegister(aData, aOnSuccess, aOnError) {
        let s = this

        s.axios.request({
            method: "get",
            url: s.axios.baseUrl + API.GEETEST_REGISTER + `?t=${aData.t}`,
            options: {}
        }).then(function (result) {
            let arg = result.data
            if (aOnSuccess) {
                aOnSuccess(arg)
            }
        }).catch(function (e) {
            if (aOnError) {
                aOnError(e)
            }
        })
    }

    /**
     * 极验验证
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    geetestValidate(aData, aOnSuccess, aOnError) {
        let s = this

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.GEETEST_VALIDATE,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result) {
            let arg = result.data
            if (aOnSuccess) {
                aOnSuccess(arg)
            }
        }).catch(function (e) {
            _console.log('tlh',e);
            if (aOnError) {
                aOnError(e)
            }
        })
    }

    /**
     * 登录
     * @param aData
     * {
     *      loginType: loginType,   //  登录方式
     *      loginName: loginName,   //  账号
     *      pass: md5,              //  密码 md5
     *      exChannel: 26           //  渠道号
     * }
     * @param aOnSuccess (result)
     * {
     *     "result": {
     *         "code": 0,
     *         "msg": "",
     *         "tfa": 0,
     *         "phone": "",
     *         "googleId": "",
     *         "loginSms": 0
     *     },
     *     "token": "OgAAMXa4uyuTkSCLXBc27bV2E8QmM26aTkY7Rhk7LsrgzE7JZ8gJ+A==",
     *     "uid": "11137592",
     *     "validSms": "",
     *     "validGoogle": "",
     *     "flag": 0
     * }
     * @param aOnError (e)
     */
    loginCheck(aData, aOnSuccess, aOnError) {
        let s = this

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.LOGIN_CHECK_V1,
            data: qs.stringify(aData),
            options: {
                withCredentials: true
            }
        }).then(function (result) {
            let arg = result.data
            if (aOnSuccess) {
                aOnSuccess(arg)
            }
        }).catch(function (e) {
            if (aOnError) {
                aOnError(e)
            }
        })
    }

    getUserInfo(aData, aOnSuccess, aOnError) {
        let s = this

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.REQ_USER_INFO,
            data: aData,
            options: {}
        }).then(function (result){
            if (DBG_REQUEST) {window._console.log(DBG_TAG,"ReqUserInfo Rsp",result)}
            /*
            请求参数
            {}
            返回参数
            {
                result: {
                    code: 0,
                    msg: ""
                }
                account: {
                    accountName: "10012"
                    accountType: "Normal"
                    antiFishCode: ""
                    birthday: "0"
                    brokerInfo: null
                    email: ""
                    exChannel: 0
                    googleId: ""
                    iStatus: 0
                    loginIp: "::ffff:192.168.2.110"
                    loginTimestamp: "1594794960"
                    loginType: "phone"
                    name: ""
                    nationNo: "0086"
                    nationality: ""
                    noDraw: 0
                    noLogin: 0
                    noTrade: 0
                    optionFlag: "0"
                    optionStr: "{"fav":[]}"
                    phone: "10012"
                    refBrokerId: ""
                    refereeId: ""
                    sex: 0
                    token: "XgAAGXZMAwYTyHaYiRNmYDSxwNmTY2eLjIbTtxh2jAcy"
                    totalRbBtc: 0
                    totalRbEth: 0
                    totalRbTrd: 0
                    totalUnderlingNum: 1
                    uName: ""
                    uid: "11130460"
                    useGAEA: 0
                    warnFlag: 0
                    whiteSetting: 0
                }
            }
            */
            let arg = result.data
            if (arg.result.code == 0) {
                s.userInfo = arg.result
            }
            if(aOnSuccess) {
                aOnSuccess(arg)
            }
        }).catch(function(e) {
            if (DBG_REQUEST) {window._console.log(DBG_TAG,"ReqUserInfo err",e)}
            if (aOnError) {
                aOnError(e)
            }
        })
    }

}

module.exports = webApi