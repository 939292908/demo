/*
 * @Author: leez
 * @Date: 2020-08-19 10:55:34
 * @LastEditTime: 2020-08-19 18:00:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \website-project\src\api\index.js
 */
const { API, Http } = require('./request');
/**
 * @description: 极验初始化
 */

export function geetestRegister (params) {
    return Http.get(API.GEETEST_REGISTER, { params });
}
/**
 * @description: 极验验证
 */

export function geetestValidate (params = {}) {
    return Http.post(API.GEETEST_VALIDATE, params);
}

/**
 * @description: 发送短信验证码
 */

export function getSMSCode (params = {}) {
    return Http.post(API.SEND_SMS_CODE_V1, params);
}

/**
 * @description: 发送短信验证码V2
 */

export function getSMSCodeV2 (params = {}) {
    return Http.post(API.SEND_SMS_CODE_V2, params);
}

/**
 * @description: 发送邮箱验证码
 */

export function sendEmail (params = {}) {
    return Http.post(API.SEND_EMAIL_V1, params);
}

/**
 * @description: 发送邮箱验证码V2
 * @params: params：{
 *    email
      host: this.$params.webSite + '/m/#/accounts',
      fn: 'wda',
      lang: this.$i18n.locale,
      fishCode: this.$store.state.account.antiFishCode,
      token: encodeURIComponent(this.$store.state.account.token),
      checkCode: new Date().valueOf().toString(32),
      wType: wTypeName?wTypeName:wType,
      aid: aid,
      money: this.numVal,
      addr: this.addressVal,
      fee: this.fee,
      seq: data.data.seq,
      exChannel: window.$params.exchId
 * }
 */

export function sendEmailV2 (params = {}) {
    return Http.post(API.SEND_EMAIL_V2, params);
}

/**
 * @description: 校验短信验证码
 */

export function smsVerify (params = {}) {
    return Http.post(API.SMS_VERIFY_V1, params);
}

/**
 * @description:  校验短信验证码V2
 */

export function smsVerifyV2 (params = {}) {
    return Http.post(API.SMS_VERIFY_V2, params);
}

/**
 * @description: 校验google验证码
 */
export function googleCheck (params = {}) {
    return Http.post(API.GOOGLE_VERIFY_V1, params);
}

/**
 * @description: 校验邮箱验证码V2
 */

export function emailCheckV2 (params = {}) {
    return Http.post(API.EMAIL_VERIFY_V2, params);
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

export function loginCheck (params = {}, options = { withCredentials: true }) {
    return Http.post(API.LOGIN_CHECK_V1, params, options);
}
/**
 * @description: 登录验证V2
 */
export function loginCheckV2 (params = {}, options = { withCredentials: true }) {
    return Http.post(API.LOGIN_CHECK_V2, params, options);
}
/**
 * @description: 登录
 */
export function loginWeb (params = {}, options = { withCredentials: true }) {
    return Http.post(API.LOGIN_WEB_V1, params, options);
}
/**
 * @description: 登录2
 */
export function loginWebV2 (params = {}, options = { withCredentials: true }) {
    return Http.post(API.LOGIN_WEB_V2, params, options);
}

/**
 * 查询用户简介
 * @param {Object} params {
        loginType: 'phone' // 账户类型
        loginName: '1111' // 用户名
        nationNo: '0086' // 电话号码区号
        exChannel: 30 // 渠道号
    }
 * @param {Object} options axios请求配置
 * @returns {Object} {
        "result":{
            "code":0 // code为0则是成功，其他失败
        },
        aType: "Normal", // 用户类型 "Normal":普通用户，"Business"：商户
        email: "", // 绑定的手机，如果为空则没有绑定
        exists: 2, //用户是否存在 1:用户已存在， 2: 用户不存在
        ga: "", // 绑定的谷歌，如果为空则没有绑定
        phone: "", // 绑定的邮箱，如果为空则没有绑定
        setting2fa: {
            email: 0, // 邮箱，2fa安全验证开启状态 1：开启 0：关闭
            phone: 1, // 手机，2fa安全验证开启状态 1：开启 0：关闭
            google: 1 // 谷歌，2fa安全验证开启状态 1：开启 0：关闭
        }
        uid: "" // 用户唯一id
    }
 */
export function queryUserInfo (params = {}, options = { withCredentials: true }) {
    return Http.post(API.QUERY_USER_INFO_V2, params, options);
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

export function resetPassword (params = {}, options = { withCredentials: true }) {
    return Http.post(API.RESET_PASSWD_V1, params, options);
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

export function subAssets (params = {}, options = { withCredentials: true }) {
    return Http.post(API.SUB_ASSETS_V1, params, options);
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

export function usersRegister (params = {}, options = { withCredentials: true }) {
    return Http.post(API.REGISTER_V1, params, options);
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
export function reportUdc (params = {}, options = { withCredentials: true }) {
    return Http.post(API.STAT_REPORT_UDC, params, options);
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
export function getCountryList (params = {}, options = { withCredentials: true }) {
    return Http.get(API.COUNTRY_LIST_V1, { params }, options);
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

export function getUserInfo (params = {}, options = { withCredentials: true }) {
    return Http.post(API.REQ_USER_INFO, params, options);
}

/*
    获取用户资产
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
export function getWallet (params = {}, options = { withCredentials: true }) {
    return Http.post(API.ASSETS_V1, params, options);
}

// TODO setWallet

/**
 * 我的钱包-资产记录
 */
export function assetRecords (params = {}, options = { withCredentials: true }) {
    return Http.post(API.WALLET_ASSETS_HISTORY_V1, params, options);
}

export function assetRecordsAll (aData) {
    return Promise.all(aData);
}
/**
 * 获取渠道信息
 */

export function getExchInfo (params = {}, options = { withCredentials: true }) {
    return Http.get(API.EXCH_INFO_V1, { params }, options);
}

/**
 * @description: 获取最新宣传图
 * @param params: {locale: 'zh', vp: '8'}
 * @param locale: 语言类型
 * @param vp： 渠道
 */
export function getBanne (params = {}) {
    return Http.get(API.DESKTOP_BANNER_V2, { params });
}

/**
 * @description: 获取最新公告
 * @param params: {locale: 'zh', vp: '8'}
 * @param locale: 语言类型
 * @param vp： 渠道
 */
export function getNotice (params = {}) {
    return Http.get(API.ANNOUNCEMENTS_LATEST, { params });
}

export function getFunList (params = {}) {
    return Http.get(API.FUN_LIST_V1, { params });
}

/**
 * @description: 资产划转接口
 * @param params: {
 *      coin: "USDT", // 合约下拉列表 value
 *      transferFrom: '03', // 从xx钱包 value
 *      transferTo: '01', // 到xx钱包 value
 *      num: '', // 划转数量
 *      maxTransfer: 0 // 最大划转
 * }
 */
export function postTransfer (params = {}) {
    return Http.post(API.TRANSFER_POST, params);
}
/**
 * 钱包充值地址
 * @param {*} params
 */
export function GetRechargeAddr (params = {}, options = { withCredentials: true }) {
    return Http.post(API.WALLET_RECHARGE_ADDR_V1, params, options);
}
/**
 *@param locale: 语言类型
 * @param vp： 渠道
 * */

export function getCoinInfo(params = {}) {
    return Http.get(API.COIN_INFO, { params });
}

/**
 *@param params: {} 无参数
 * */

export function getCoinFees(params = {}, options = { withCredentials: true }) {
    return Http.post(API.COIN_FEES, params, options);
}

/**
 * @param params: {token, wType, money, aid, addr, op}
 * @param token: 登录token
 * @param wType: coin
 * @param money: 提币数
 * @param aid: uid + '06'
 * @param add: 提币地址
 * @param op: 0
 */

export function withdrawDeposit (params = {}, options = { withCredentials: false }) {
    return Http.post(API.WITHDRAW, params, options);
}

/**
 * 获取秘钥（用于绑定google验证）
 * @param {Object} params {}
 * @param {Object} options axios请求配置
 * @returns {Object} {
        "result":{
            "code":0 // code为0则是成功，其他失败
        },
        "qrcode_url":"***", // 密钥二维码地址
        "secret":"LJFWKVCCKJMHWKSB" // 密钥
    }
 */
export function getGoogleSecret (params = {}, options = { withCredentials: false }) {
    return Http.post(API.AUTH_SECRET_V1, params, options);
}

/**
 * 绑定google请求
 * @param {Object} params {
        opInfo: 'LJFWKVCCKJMHWKSB', // 密钥
        password: '5bacd9f25613659b2fbd2f3a58822e5c' // 用户密码
        code: '401233' // google验证码
    }
 * @param {Object} options axios请求配置
 * @returns {Object} {
        "result":{
            "code":0 // code为0则是成功，其他失败
        }
    }
 */
export function bindGoogleAuth (params = {}, options = { withCredentials: false }) {
    return Http.post(API.AUTH_BIND_GOOGLE_AUTH_V1, params, options);
}

/**
 * 关闭google验证
 * @param {Object} params {
        password: '5bacd9f25613659b2fbd2f3a58822e5c' // 用户密码
        code: '401233' // google验证码
    }
 * @param {Object} options axios请求配置
 * @returns {Object} {
        "result":{
            "code":0 // code为0则是成功，其他失败
        }
    }
 */
export function relieveGoogleAuth (params = {}, options = { withCredentials: false }) {
    return Http.post(API.AUTH_RELIEVE_GOOGLE_AUTH_V1, params, options);
}

/**
 * 修改密码
 * @param {Object} params {
        oldPasswd: '5bacd9f25613659b2fbd2f3a58822e5c' // 用户老密码
        Passwd1:'fa22fb87b07ae7407f5ceda208a47996' // 新密码
        Passwd2:'fa22fb87b07ae7407f5ceda208a47996' // 确认密码
    }
 * @param {Object} options axios请求配置
 * @returns {Object} {
        "result":{
            "code":0 // code为0则是成功，其他失败
        }
    }
 */
export function changePasswd (params = {}, options = { withCredentials: false }) {
    return Http.post(API.MODIFY_PASSWD, params, options);
}

/**
 * 更新语言
 * @param {Object} params {
        settingValue: 'en' // 语言
    }
 * @param {Object} options axios请求配置
 * @returns {Object} {
        "result":{
            "code":0 // code为0则是成功，其他失败
        },
        settingKey: ""
        settingValue: ""
    }
 */
export function updateLanguage (params = {}, options = { withCredentials: false }) {
    return Http.post(API.UPDATE_LANGUAGE_V2, params, options);
}

/**
 * 设置2FA
 * @param {Object} params {
        opCode: 5 // 绑定类型，固定填5
        opInfo: '354625@qq.com' // 邮箱
        password: '9cbf8a4dcb8e30682b927f352d6559a0' // 用户密码
    }
 * @param {Object} options axios请求配置
 * @returns {Object} {
        "result":{
            "code":0 // code为0则是成功，其他失败
        }
    }
 */
export function set2FA (params = {}, options = { withCredentials: false }) {
    return Http.post(API.SET_2FA_V2, params, options);
}

/**
 * 退出登录
 * @param {Object} params {}
 * @param {Object} options axios请求配置
 * @returns {Object} {
        "result":{
            "code":0 // code为0则是成功，其他失败
        }
    }
 */
export function logOut(params = {}, options = { withCredentials: false }) {
    return Http.get(API.USDER_LOGOUT, params, options);
}
/*
*
* */
export function getCurrenciesIntro (params = {}, options = { withCredentials: false }) {
    return Http.get(API.MARKETS_CURRENCY_INTRO_V1, { params }, options);
}
/**
 * 获取历史登录信息
 * params: {
 *     infoType: 2 // 1-获取我的邀请和获取我的返佣；2-获取IP登录信息
 * }
 * */
export function getExtListInfo (params = {}, options = { withCredentials: false }) {
    return Http.post(API.USER_EXT_LIST, params, options);
}

/**
 * 获取该IP登录信息
 * params: {
 *     ip: [IP地址]
 * }
 * */
export function getExtItemInfo (params = {}, options = { withCredentials: false }) {
    return Http.post(API.USER_GET_EXTINFO, params, options);
}

/**
 * 设置资金密码和修改资金密码
 * @param {Object} params {
        settingType: 12 // 设置类型，固定值
        settingKey: 'ucp', // 设置类型的key，固定值
        settingValue: '9cbf8a4dcb8e30682b927f352d6559a0', // 资金密码，md5加密
        settingValue2: '' // 老密码，设置资金密码时不需要，修改时需要填写，md5加密
    }
 * @param {Object} options axios请求配置
 * @returns {Object} {
        "result":{
            "code":0 // code为0则是成功，其他失败
        },
        settingKey: ""
        settingValue: ""
    }
 */
export function setWalletPwd (params = {}, options = { withCredentials: false }) {
    return Http.post(API.FAVORITE_SETTING_V1, params, options);
}

/**
 * 查询是否已设置资金密码
 * @param {Object} params {
        settingType: 13 // 查询类型，固定值
        settingKey: 'ucp', // 查询类型的key，固定值
    }
 * @param {Object} options axios请求配置
 * @returns {Object} {
        "result":{
            "code":0 // code为0则是成功，其他失败
        },
        settingKey: "ucp",
        settingValue: "*" // "*"代表已设置，""代表未设置
    }
 */
export function getWalletPwdStatus (params = {}, options = { withCredentials: false }) {
    return Http.post(API.FAVORITE_SETTING_V1, params, options);
}

/**
 * 设置防钓鱼码
 * 判断是否已设置钓鱼码，可通过判断用户信息内 antiFishCode 字段是否有值
 * @param {Object} params {
        settingType: 3 // 设置类型，固定值
        settingValue: '', // 需要设置的防钓鱼码
    }
 * @param {Object} options axios请求配置
 * @returns {Object} {
        "result":{
            "code":0 // code为0则是成功，其他失败
        },
        settingKey: "",
        settingValue: ""
    }
 */
export function setFishCode (params = {}, options = { withCredentials: false }) {
    return Http.post(API.FAVORITE_SETTING_V1, params, options);
}