const _axios = require('@/api/request').default;
const qs = require('qs');

const DBG_REQUEST = true;
const DBG_TAG = "API";

const API = require('@/api/request_apis');

class webApi {
    constructor(arg) {
        const s = this;
        s.axios = new _axios();
        s.axios.baseUrl = arg.baseUrl;

        // 变量命名
        s.userInfo = {};
        s.loginSms = true; // 登录短信验证
        s.functions = null;
        s.loginState = false;
        s.wallet = {
            '01': [],
            '02': [],
            '03': [],
            '04': []
        };
        s.wallet_obj = {
            '01': {},
            '02': {},
            '03': {},
            '04': {}
        };

        s.getUserInfo({}, function(arg) {
            if (arg.result.code === 0) {
                s.loginState = true;
            }
        });
    }

    /**
     * 极验初始化
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    geetestRegister(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "get",
            url: s.axios.baseUrl + API.GEETEST_REGISTER + `?t=${aData.t}`,
            options: {}
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 极验验证
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    geetestValidate(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.GEETEST_VALIDATE,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            window._console.log('tlh', e);
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 发送短信验证码
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    getSMSCode(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.SEND_SMS_CODE_V1,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            window._console.log('tlh', e);
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 发送短信验证码V2
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    getSMSCodeV2(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.SEND_SMS_CODE_V2,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            window._console.log('tlh', e);
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 发送邮箱验证码
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    sendEmail(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.SEND_EMAIL_V1,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            window._console.log('tlh', e);
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 发送邮箱验证码V2
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    sendEmailV2(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.SEND_EMAIL_V2,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            window._console.log('tlh', e);
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 校验短信验证码
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    smsVerify(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.SMS_VERIFY_V1,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            window._console.log('tlh', e);
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 校验短信验证码V2
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    smsVerifyV2(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.SMS_VERIFY_V2,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            window._console.log('tlh', e);
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 校验google验证码
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    googleCheck(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.GOOGLE_VERIFY_V1,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            window._console.log('tlh', e);
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 校验邮箱验证码
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    emailCheck(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.EMAIL_VERIFY_V1,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            window._console.log('tlh', e);
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 校验邮箱验证码V2
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    emailCheckV2(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.EMAIL_VERIFY_V2,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            window._console.log('tlh', e);
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 登录验证
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
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.LOGIN_CHECK_V1,
            data: qs.stringify(aData),
            options: {
                withCredentials: true
            }
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 登录验证V2
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    loginCheckV2(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.LOGIN_CHECK_V2,
            data: qs.stringify(aData),
            options: {
                withCredentials: true
            }
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 登录
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    loginWeb(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.LOGIN_WEB_V1,
            data: qs.stringify(aData),
            options: {
                withCredentials: true
            }
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 登录V2
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    loginWebV2(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.LOGIN_WEB_V2,
            data: qs.stringify(aData),
            options: {
                withCredentials: true
            }
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 查询用户简介
     * @param aData
     * {
     *      "loginType": "email",       //  登录类型
     *      "loginName": "loginName",   //  登录账号
     *      "nationNo": "0086"            //  区号
     *      "exChannel": 30             //  渠道号
     * }
     * @param aOnSuccess (result)
     * {
     *   "result": {
     *       "code": 0,
     *       "msg": ""
     *   },
     *   "exists": 1,
     *   "uid": "11137737",
     *   "aType": "Normal",
     *   "phone": "0086-00000000",
     *   "email": "",
     *   "ga": ""
     * }
     * @param aOnError (e)
     */
    queryUserInfo(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.QUERY_USER_INFO_V1,
            data: qs.stringify(aData),
            options: {
                withCredentials: true
            }
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 重置密码
     * @param aData
     * {
     *   "Passwd1": md5(password1), //  密码 md5
     *   "Passwd2": md5(password2), //  确认密码 md5
     *   "exChannel": 30            //  vp
     * }
     * @param aOnSuccess (result)
     * {"result":{"code":0,"msg":""}}
     * @param aOnError (e)
     */
    resetPassword(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.RESET_PASSWD_V1,
            data: qs.stringify(aData),
            options: {
                withCredentials: true
            }
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 钱包子账户资产
     * @param aData
     * {
     *     "exChannel": 30  //  vp
     *     "aType": 018     //  子钱包
     * }
     * @param aOnSuccess (result)
     * {
     *    "result": {
     *        "code": 0,
     *        "msg": ""
     *    },
     *    "assetLists03": [
     *        {
     *            "wType": "USDT",
     *            "coin": "USDT",
     *            "mainBal": "",
     *            "mainLock": "",
     *            "financeBal": "",
     *            "pawnBal": "",
     *            "creditNum": "",
     *            "wdLimit": "",
     *            "depositLock": "541.82728125",
     *            "fullName": "USDT",
     *            "icon": "/imgs/cat/coins/6741d2f11f5e09e769e84f9a9e37631b.png?ver=1594976497642",
     *            "networkNum": "2",
     *            "initValue": "1",
     *            "promptConvertActive": 0,
     *            "promptConvertMine": 0,
     *            "promptRecharge": 0,
     *            "convertMinePer": "",
     *            "depoLockRate": "",
     *            "activeType": true,
     *            "depoLockCoin": 0,
     *            "allActive": false,
     *            "unitAlias": {
     *                "total": {
     *                    "zh": "总额",
     *                    "en": "Total",
     *                    "status": 1
     *                },
     *                "depositLock": {
     *                    "zh": "锁定",
     *                    "en": "Lock-up",
     *                    "status": 1
     *                },
     *                "pawnBal": {
     *                    "zh": "质押",
     *                    "en": "Pledge",
     *                    "status": 1
     *                },
     *                "financeBal": {
     *                    "zh": "理财",
     *                    "en": "Fund Assets",
     *                    "status": 1
     *                },
     *                "mainBal": {
     *                    "zh": "可用",
     *                    "en": "Available",
     *                    "status": 1
     *                },
     *                "mainLock": {
     *                    "zh": "矿池",
     *                    "en": "Mining Pool",
     *                    "status": 0
     *                },
     *                "actMainBal": {
     *                    "zh": "活动资金",
     *                    "en": "Activity fund",
     *                    "status": 0
     *                }
     *            },
     *            "Setting": {
     *                "memo": false,
     *                "canRecharge": true,
     *                "canWithdraw": true,
     *                "canLockedWithdraw": false,
     *                "idcardVerifyWithdraw": false,
     *                "canTransfer": true,
     *                "convertMine": false,
     *                "convertActive": false,
     *                "fConvertMine": false,
     *                "fConvertActive": false,
     *                "openChains": true,
     *                "canRechargeUSDT-Omni": true,
     *                "canWithdrawUSDT-Omni": true,
     *                "canRechargeUSDT-ERC20": true,
     *                "canWithdrawUSDT-ERC20": true
     *            },
     *            "convertMineMin": 0,
     *            "convertMineInc": 0,
     *            "hiddenFields": {
     *                "total": false,
     *                "depositLock": false,
     *                "pawnBal": false,
     *                "financeBal": false,
     *                "mainLock": true,
     *                "mainBal": false,
     *                "actMainBal": true
     *            },
     *            "wid": "11137412018USDT",
     *            "uid": "11137412018",
     *            "otcBal": "",
     *            "otcLock": "",
     *            "cTime": "0",
     *            "updTime": "0",
     *            "flag": "0",
     *            "memo": "",
     *            "email": ""
     *        },
     *        ...
     *    ],
     *    "transferSettlementTime": 86400,
     *    "paySettlementTime": 86400
     *  }
     * @param aOnError (e)
     */
    subAssets(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.SUB_ASSETS_V1,
            data: qs.stringify(aData),
            options: {
                withCredentials: true
            }
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 账号注册
     * @param aData
     * {
     *     "loginType": "phone"                         // 账号类型 phone:手机 email:邮箱
     *     "loginName": "123456789"                     // 账号
     *     "pass": "dc483e80a7a0bd9ef71d8cf973673924"   // 密码 md5
     *     "refereeType": 0                             // 0:普通注册邀请 | 1:broker注册邀请
     *     "prom": ""                                   // 渠道信息
     *     "os": "iOS"                                  // 设备信息
     *     "nationNo": 0086                             // 区号
     *     "exChannel": 30                              //  vp
     * }
     * @param aOnSuccess (result)
     * {"result":{"code":0,"msg":""},"uid":"11138004","token":"DQAAI7PEMsxomsbmwTnsMYkmZuCBYBo7mBqziysaaybtszIH6A=="}
     * @param aOnError (e)
     */
    usersRegister(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.REGISTER_V1,
            data: qs.stringify(aData),
            options: {
                withCredentials: true
            }
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 设备信息获取
     * @param aData
     * {
     *     "uid": 11138004                                      // uid
     *     "cTime": 1596457285176                               // 时间戳
     *     "op": "register"                                     // 信息操作来源
     *     "deviceId": "67555124-58e9-485f-85fd-136e56c0856b"   // 设备唯一id
     *     "softId": "67555124-58e9-485f-85fd-136e56c0856b"     // 网页自生成唯一id
     *     "plat": "web"                                        // 平台
     *     "model": "iPhone"                                    // 设备型号
     *     "source": ""                                         // 广告来源
     *     "lang": "zh"                                         // 语言
     * }
     * @param aOnSuccess
     * @param aOnError
     */
    reportUdc(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.STAT_REPORT_UDC,
            data: qs.stringify(aData),
            options: {
                withCredentials: true
            }
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 获取国家列表
     * @param aData
     * @param aOnSuccess
     * {
     *     "code": 0,
     *     "data": [
     *         {
     *             "us_name": "China",
     *             "cn_name": "中国",
     *             "support": "1",
     *             "code": "86"
     *         },
     *         ...
     *     ],
     *     "msg": "OK"
     * }
     * @param aOnError
     */
    getCountryList(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "get",
            url: s.axios.baseUrl + API.COUNTRY_LIST_V1,
            options: {
                withCredentials: true
            }
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    getUserInfo(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.REQ_USER_INFO,
            data: aData,
            options: {}
        }).then(function (result) {
            if (DBG_REQUEST) {
                window.window._console.log(DBG_TAG, "ReqUserInfo Rsp", result);
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
            const arg = result.data;
            if (arg.result.code === 0) {
                s.userInfo = arg.result;
            }
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            if (DBG_REQUEST) {
                window.window._console.log(DBG_TAG, "ReqUserInfo err", e);
            }
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    // 获取用户资产
    getWallet(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "post",
            url: s.axios.baseUrl + API.ASSETS_V1,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result) {
            if (DBG_REQUEST) { window.window._console.log(DBG_TAG, "ReqWallet Rsp", result); }
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
                    }],
                "assetLists02":[
                    {"wType":"UT","Num":0,"PNL":0,"Frz":0,"UPNL":0,"PNLISO":0,"MI":0,"MM":0,"RD":0,"balance":0,"wdrawable":0,"fullName":"","icon":"/imgs/cat/coins/87db16cba59e908888837d351af65bfe.png?ver=1570862174555","networkNum":"12","initValue":0,"Setting":{"canTransfer":true,"canExchange":true}}],
                "assetLists03":[
                    {
                        "wType":"UT","coin":"UT","mainBal":"","mainLock":"","financeBal":"","pawnBal":"","creditNum":"","wdLimit":"","depositLock":"","fullName":"","icon":"/imgs/cat/coins/87db16cba59e908888837d351af65bfe.png?ver=1570862174555","networkNum":"12","initValue":0,"promptConvertActive":0,"promptConvertMine":0,"promptRecharge":0,"convertMinePer":"","depoLockRate":"","activeType":true,"depoLockCoin":0,"allActive":false,"unitAlias":{"total":{"zh":"总额","en":"Total","status":1},"depositLock":{"zh":"锁定","en":"Lock-up","status":1},"pawnBal":{"zh":"质押","en":"Pledge","status":1},"financeBal":{"zh":"理财","en":"Fund Assets","status":1},"mainBal":{"zh":"可用","en":"Available","status":1},"mainLock":{"zh":"矿池","en":"Mining Pool","status":0},"actMainBal":{"zh":"活动资金","en":"Activity fund","status":0}},"Setting":{"memo":false,"canRecharge":false,"canWithdraw":false,"canLockedWithdraw":false,"idcardVerifyWithdraw":false,"canTransfer":true,"convertMine":false,"convertActive":false,"fConvertMine":false,"fConvertActive":false},"convertMineMin":0,"convertMineInc":0,"hiddenFields":{"total":false,"depositLock":false,"pawnBal":false,"financeBal":false,"mainLock":true,"mainBal":false,"actMainBal":true},"wid":"11130410UT","uid":"11130410","otcBal":"","otcLock":"","cTime":"0","updTime":"0","flag":"0","memo":"","email":""},],
                "assetLists04":[
                    {"wType":"USDT","coin":"USDT","otcBal":"","otcLock":"100","fullName":"USDT","icon":"/imgs/cat/coins/b79b2e9f76f0887df600edb0c47c2e28.png?ver=1594976504364","networkNum":"12","initValue":0,"Setting":{"canTransfer":true,"canExchange":false},"wid":"11130410USDT","uid":"11130410","mainBal":"190311.38764131","mainLock":"","financeBal":"","pawnBal":"","creditNum":"","wdLimit":"","depositLock":"526","cTime":"0","updTime":"0","flag":"0","memo":"","email":""}],"transferSettlementTime":86400,"paySettlementTime":86400}
            */
            const arg = result.data;
            if (arg.result.code === 0) {
                s.setWallet(arg);
            }
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function(e) {
            if (DBG_REQUEST) { window.window._console.log(DBG_TAG, "ReqWallet err", e); }
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    setWallet(data) {
        const s = this;

        s.wallet['01'] = data.assetLists01; // 合约资产
        s.wallet['02'] = data.assetLists02; // 现货资产
        s.wallet['03'] = data.assetLists03; // 主钱包
        s.wallet['04'] = data.assetLists04; // 法币资产

        for (const item of data.assetLists01) {
            s.wallet_obj['01'][item.wType] = item;
        }
        for (const item of data.assetLists02) {
            s.wallet_obj['02'][item.wType] = item;
        }
        for (const item of data.assetLists03) {
            s.wallet_obj['03'][item.wType] = item;
        }
        for (const item of data.assetLists04) {
            s.wallet_obj['04'][item.wType] = item;
        }
    }

    assetRecords(aData, aOnSuccess, aOnError) {
        console.log(aData);
        const that = this;
        that.axios.request({
            method: "post",
            url: that.axios.baseUrl + API.WALLET_ASSETS_HISTORY_V1,
            data: qs.stringify(aData),
            options: {}
        }).then(res => {
            const arg = res.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
            console.log(res);
        }).catch(function(e) {
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 获取渠道信息
     * @param aData
     * @param aOnSuccess
     * @param aOnError
     */
    getExchInfo(aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "get",
            url: s.axios.baseUrl + API.EXCH_INFO_V1,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            window._console.log('tlh', e);
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 获取最新宣传图
     */
    getBanne (aData, aOnSuccess, aOnError) {
        const s = this;

        s.axios.request({
            method: "get",
            url: s.axios.baseUrl + API.DESKTOP_BANNER_V2,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            window._console.log('tlh', e);
            if (aOnError) {
                aOnError(e);
            }
        });
    }

    /**
     * 获取最新宣传图
     */
    getNotice (aData, aOnSuccess, aOnError) {
        const s = this;
        s.axios.request({
            method: "get",
            url: s.axios.baseUrl + API.ANNOUNCEMENTS_LATEST,
            data: qs.stringify(aData),
            options: {}
        }).then(function (result) {
            const arg = result.data;
            if (aOnSuccess) {
                aOnSuccess(arg);
            }
        }).catch(function (e) {
            window._console.log('tlh', e);
            if (aOnError) {
                aOnError(e);
            }
        });
    }
}

module.exports = webApi;