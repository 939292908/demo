let _axios = require('@/api/request').default
let qs = require('qs')

const DBG_REQUEST = true
const DBG_TAG = "API"

let API = require('@/api/request_apis')

class webApi {

    constructor(arg) {
        this.axios = new _axios()
        this.axios.baseUrl = arg.baseUrl

        // 变量命名
        this.userInfo = {}
        this.loginSms = true // 登录短信验证
        this.functions = null
        this.wallet = {
            '01': [],
            '02': [],
            '03': [],
            '04': []
        }
        this.wallet_obj = {
            '01': {},
            '02': {},
            '03': {},
            '04': {}
        }
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
            _console.log('tlh', e);
            if (aOnError) {
                aOnError(e)
            }
        })
    }

    /**
     * 发送短信验证码
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    getSMSCode(aData, aOnSuccess, aOnError) {
        let s = this

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.SEND_SMS_CODE_V1,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result) {
            let arg = result.data
            if (aOnSuccess) {
                aOnSuccess(arg)
            }
        }).catch(function (e) {
            _console.log('tlh', e);
            if (aOnError) {
                aOnError(e)
            }
        })
    }

    /**
     * 发送邮箱验证码
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    sendEmail(aData, aOnSuccess, aOnError) {
        let s = this

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.SEND_EMAIL_V1,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result) {
            let arg = result.data
            if (aOnSuccess) {
                aOnSuccess(arg)
            }
        }).catch(function (e) {
            _console.log('tlh', e);
            if (aOnError) {
                aOnError(e)
            }
        })
    }

    /**
     * 校验短信验证码
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    smsVerify(aData, aOnSuccess, aOnError) {
        let s = this

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.SMS_VERIFY_V1,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result) {
            let arg = result.data
            if (aOnSuccess) {
                aOnSuccess(arg)
            }
        }).catch(function (e) {
            _console.log('tlh', e);
            if (aOnError) {
                aOnError(e)
            }
        })
    }

    /**
     * 校验google验证码
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    googleCheck(aData, aOnSuccess, aOnError) {
        let s = this

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.GOOGLE_VERIFY_V1,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result) {
            let arg = result.data
            if (aOnSuccess) {
                aOnSuccess(arg)
            }
        }).catch(function (e) {
            _console.log('tlh', e);
            if (aOnError) {
                aOnError(e)
            }
        })
    }

    /**
     * 校验邮箱验证码
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    emailCheck(aData, aOnSuccess, aOnError) {
        let s = this

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.EMAIL_VERIFY_V1,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result) {
            let arg = result.data
            if (aOnSuccess) {
                aOnSuccess(arg)
            }
        }).catch(function (e) {
            _console.log('tlh', e);
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
        }).then(function (result) {
            if (DBG_REQUEST) {
                window._console.log(DBG_TAG, "ReqUserInfo Rsp", result)
            }
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
            if (aOnSuccess) {
                aOnSuccess(arg)
            }
        }).catch(function (e) {
            if (DBG_REQUEST) {
                window._console.log(DBG_TAG, "ReqUserInfo err", e)
            }
            if (aOnError) {
                aOnError(e)
            }
        })
    }

    getWallet(aData, aOnSuccess, aOnError){
        let s = this

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.ASSETS_V1,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result){
            if (DBG_REQUEST) {window._console.log(DBG_TAG,"ReqWallet Rsp",result)}
            /*
            请求参数
            {
                exChannel: 30  //渠道号
            }
            返回参数
            {
                "result":{"code":0,"msg":""},
                "assetLists01":[
                    {
                        "wType":"UT",
                        "Num":"1000000",
                        "PNL":"",
                        "Frz":"",
                        "UPNL":0,
                        "PNLISO":0,
                        "MI":0,
                        "MM":0,
                        "RD":0,
                        "balance":1000000,
                        "wdrawable":1000000,
                        "Gift":"0",
                        "PNLG":"0",
                        "fullName":"",
                        "icon":"/imgs/cat/coins/87db16cba59e908888837d351af65bfe.png?ver=1570862174555",
                        "networkNum":"12",
                        "initValue":0,
                        "Setting":{"canTransfer":true,"canExchange":true}
                    },
                    {"wType":"USDT","Num":"4381.09382957","PNL":"-3883.32396566375","Frz":"","UPNL":-17.331459408965113,"PNLISO":0,"MI":0.5775825,"MM":0.7353799999999999,"RD":0,"balance":479.1254419972849,"wdrawable":479.125441997312,"Gift":"0","PNLG":"0","fullName":"USDT","icon":"/imgs/cat/coins/b79b2e9f76f0887df600edb0c47c2e28.png?ver=1594976504364","networkNum":"12","initValue":0,"Setting":{"canTransfer":true,"canExchange":true}},{"wType":"BTC","Num":"100","PNL":"0.01939716529","Frz":"","UPNL":0,"PNLISO":0,"MI":0,"MM":0,"RD":0,"balance":100.01939716529,"wdrawable":100.01939716529,"Gift":"0","PNLG":"0","fullName":"Bitcoin","icon":"/imgs/cat/coins/4b9169eb3e07e0e885eb62f7bfc41a33.png?ver=1592287889880","networkNum":"2","initValue":"5000","Setting":{"canTransfer":true,"canExchange":true}}],
                "assetLists02":[
                    {"wType":"UT","Num":0,"PNL":0,"Frz":0,"UPNL":0,"PNLISO":0,"MI":0,"MM":0,"RD":0,"balance":0,"wdrawable":0,"fullName":"","icon":"/imgs/cat/coins/87db16cba59e908888837d351af65bfe.png?ver=1570862174555","networkNum":"12","initValue":0,"Setting":{"canTransfer":true,"canExchange":true}},{"wType":"USDT","Num":"-13660.07011529","PNL":"","Frz":"","UPNL":0,"PNLISO":0,"MI":0,"MM":0,"RD":0,"balance":-13660.07011529,"wdrawable":19597.09359956821,"fullName":"USDT","icon":"/imgs/cat/coins/b79b2e9f76f0887df600edb0c47c2e28.png?ver=1594976504364","networkNum":"12","initValue":0,"Setting":{"canTransfer":true,"canExchange":true},"Gift":"0","PNLG":"0"},{"wType":"BTC","Num":"20","PNL":"","Frz":"","UPNL":0,"PNLISO":0,"MI":0,"MM":0,"RD":0,"balance":20,"wdrawable":14.975480000000001,"fullName":"Bitcoin","icon":"/imgs/cat/coins/4b9169eb3e07e0e885eb62f7bfc41a33.png?ver=1592287889880","networkNum":"2","initValue":"5000","Setting":{"canTransfer":true,"canExchange":true},"Gift":"0","PNLG":"0"},
                    {"wType":"ETH","Num":"","PNL":"","Frz":"","UPNL":0,"PNLISO":0,"MI":0,"MM":0,"RD":0,"balance":0,"wdrawable":0.00006993,"fullName":"Ethereum","icon":"/imgs/cat/coins/f8d2e1584059489f8ffa3663b3223df2.png?ver=1575856451872","networkNum":"12","initValue":0,"Setting":{"canTransfer":true,"canExchange":true},"Gift":"0","PNLG":"0"}],
                "assetLists03":[
                    {"wType":"UT","coin":"UT","mainBal":"","mainLock":"","financeBal":"","pawnBal":"","creditNum":"","wdLimit":"","depositLock":"","fullName":"","icon":"/imgs/cat/coins/87db16cba59e908888837d351af65bfe.png?ver=1570862174555","networkNum":"12","initValue":0,"promptConvertActive":0,"promptConvertMine":0,"promptRecharge":0,"convertMinePer":"","depoLockRate":"","activeType":true,"depoLockCoin":0,"allActive":false,"unitAlias":{"total":{"zh":"总额","en":"Total","status":1},"depositLock":{"zh":"锁定","en":"Lock-up","status":1},"pawnBal":{"zh":"质押","en":"Pledge","status":1},"financeBal":{"zh":"理财","en":"Fund Assets","status":1},"mainBal":{"zh":"可用","en":"Available","status":1},"mainLock":{"zh":"矿池","en":"Mining Pool","status":0},"actMainBal":{"zh":"活动资金","en":"Activity fund","status":0}},"Setting":{"memo":false,"canRecharge":false,"canWithdraw":false,"canLockedWithdraw":false,"idcardVerifyWithdraw":false,"canTransfer":true,"convertMine":false,"convertActive":false,"fConvertMine":false,"fConvertActive":false},"convertMineMin":0,"convertMineInc":0,"hiddenFields":{"total":false,"depositLock":false,"pawnBal":false,"financeBal":false,"mainLock":true,"mainBal":false,"actMainBal":true},"wid":"11130410UT","uid":"11130410","otcBal":"","otcLock":"","cTime":"0","updTime":"0","flag":"0","memo":"","email":""},{"wType":"USDT","coin":"USDT","mainBal":"190311.38764131","mainLock":"","financeBal":"","pawnBal":"","creditNum":"","wdLimit":"","depositLock":"526","fullName":"USDT","icon":"/imgs/cat/coins/b79b2e9f76f0887df600edb0c47c2e28.png?ver=1594976504364","networkNum":"12","initValue":0,"promptConvertActive":0,"promptConvertMine":0,"promptRecharge":0,"convertMinePer":"","depoLockRate":"","activeType":true,"depoLockCoin":0,"allActive":false,"unitAlias":{"total":{"zh":"总额","en":"Total","status":1},"depositLock":{"zh":"锁定","en":"Lock-up","status":1},"pawnBal":{"zh":"质押","en":"Pledge","status":1},"financeBal":{"zh":"理财","en":"Fund Assets","status":1},"mainBal":{"zh":"可用","en":"Available","status":1},"mainLock":{"zh":"矿池","en":"Mining Pool","status":1},"actMainBal":{"zh":"活动资金","en":"Activity fund","status":1}},"Setting":{"memo":false,"canRecharge":true,"canWithdraw":true,"canLockedWithdraw":false,"idcardVerifyWithdraw":false,"canTransfer":true,"convertMine":false,"convertActive":false,"fConvertMine":false,"fConvertActive":false,"openChains":true,"canRechargeUSDT-Omni":true,"canWithdrawUSDT-Omni":true,"canRechargeUSDT-ERC20":true,"canWithdrawUSDT-ERC20":true},"convertMineMin":0,"convertMineInc":0,"hiddenFields":{"total":false,"depositLock":false,"pawnBal":false,"financeBal":false,"mainLock":false,"mainBal":false,"actMainBal":false},"wid":"11130410USDT","uid":"11130410","otcBal":"","otcLock":"100","cTime":"0","updTime":"0","flag":"0","memo":"","email":""},{"wType":"BTC","coin":"BTC","mainBal":"102","mainLock":"","financeBal":"","pawnBal":"","creditNum":"","wdLimit":"","depositLock":"","fullName":"Bitcoin","icon":"/imgs/cat/coins/4b9169eb3e07e0e885eb62f7bfc41a33.png?ver=1592287889880","networkNum":"2","initValue":"5000","promptConvertActive":0,"promptConvertMine":0,"promptRecharge":0,"convertMinePer":"","depoLockRate":"","activeType":true,"depoLockCoin":0,"allActive":false,"unitAlias":{"total":{"zh":"总额","en":"Total","status":1},"depositLock":{"zh":"锁定","en":"Lock-up","status":1},"pawnBal":{"zh":"质押","en":"Pledge","status":1},"financeBal":{"zh":"理财","en":"Fund Assets","status":1},"mainBal":{"zh":"可用","en":"Available","status":1},"mainLock":{"zh":"矿池","en":"Mining Pool","status":0},"actMainBal":{"zh":"活动资金","en":"Activity fund","status":0}},"Setting":{"memo":false,"canRecharge":false,"canWithdraw":false,"canLockedWithdraw":false,"idcardVerifyWithdraw":false,"canTransfer":true,"convertMine":false,"convertActive":false,"fConvertMine":false,"fConvertActive":false},"convertMineMin":0,"convertMineInc":0,"hiddenFields":{"total":false,"depositLock":false,"pawnBal":false,"financeBal":false,"mainLock":true,"mainBal":false,"actMainBal":true},"wid":"11130410BTC","uid":"11130410","otcBal":"","otcLock":"","cTime":"0","updTime":"0","flag":"0","memo":"","email":""},{"wType":"ETH","coin":"ETH","mainBal":0,"mainLock":0,"financeBal":0,"pawnBal":0,"creditNum":0,"wdLimit":0,"depositLock":0,"fullName":"Ethereum","icon":"/imgs/cat/coins/f8d2e1584059489f8ffa3663b3223df2.png?ver=1575856451872","networkNum":"12","initValue":0,"promptConvertActive":0,"promptConvertMine":0,"promptRecharge":0,"convertMinePer":"","depoLockRate":"","activeType":true,"depoLockCoin":0,"allActive":false,"unitAlias":{"total":{"zh":"总额","en":"Total","status":1},"depositLock":{"zh":"锁定","en":"Lock-up","status":1},"pawnBal":{"zh":"质押","en":"Pledge","status":1},"financeBal":{"zh":"理财","en":"Fund Assets","status":1},"mainBal":{"zh":"可用","en":"Available","status":1},"mainLock":{"zh":"矿池","en":"Mining Pool","status":0},"actMainBal":{"zh":"活动资金","en":"Activity fund","status":0}},"Setting":{"memo":false,"canRecharge":false,"canWithdraw":true,"canLockedWithdraw":false,"idcardVerifyWithdraw":true,"canTransfer":true,"convertMine":false,"convertActive":false,"fConvertMine":false,"fConvertActive":false},"convertMineMin":0,"convertMineInc":0,"hiddenFields":{"total":false,"depositLock":false,"pawnBal":false,"financeBal":false,"mainLock":true,"mainBal":false,"actMainBal":true}}],
                "assetLists04":[
                    {"wType":"USDT","coin":"USDT","otcBal":"","otcLock":"100","fullName":"USDT","icon":"/imgs/cat/coins/b79b2e9f76f0887df600edb0c47c2e28.png?ver=1594976504364","networkNum":"12","initValue":0,"Setting":{"canTransfer":true,"canExchange":false},"wid":"11130410USDT","uid":"11130410","mainBal":"190311.38764131","mainLock":"","financeBal":"","pawnBal":"","creditNum":"","wdLimit":"","depositLock":"526","cTime":"0","updTime":"0","flag":"0","memo":"","email":""}],"transferSettlementTime":86400,"paySettlementTime":86400}
            */
            let arg = result.data
            if (arg.result.code == 0) {
                s.setWallet(arg)
            }
            if(aOnSuccess) {
                aOnSuccess(arg)
            }
        }).catch(function(e) {
            if (DBG_REQUEST) {window._console.log(DBG_TAG,"ReqWallet err",e)}
            if (aOnError) {
                aOnError(e)
            }
        })
    }

    setWallet(data){
        let s = this

        s.wallet['01'] = data.assetLists01  //合约资产
        s.wallet['02'] = data.assetLists02  //现货资产
        s.wallet['03'] = data.assetLists03  //主钱包
        s.wallet['04'] = data.assetLists04  //法币资产

        for(let item of data.assetLists01){
            s.wallet_obj['01'][item.wType] = item
        }
        for(let item of data.assetLists02){
            s.wallet_obj['02'][item.wType] = item
        }
        for(let item of data.assetLists03){
            s.wallet_obj['03'][item.wType] = item
        }
        for(let item of data.assetLists04){
            s.wallet_obj['04'][item.wType] = item
        }
    }

}

module.exports = webApi