/*
 * @Author: your name
 * @Date: 2020-09-21 17:55:32
 * @LastEditTime: 2020-09-21 17:56:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \website-project\src\api\config\apiText.js
 */
module.exports = {
    // 获取用户信息
    REQ_USER_INFO: '/users/userInfo',
    // 发送短信
    SEND_SMS_CODE_V1: '/v1/sms/getSMSCode',
    SEND_SMS_CODE_V2: '/v2/sms/getSMSCode',
    // 发送邮件
    SEND_EMAIL_V1: '/v1/emails/sendEmail',
    SEND_EMAIL_V2: '/v2/emails/sendEmail',
    // 短信验证
    SMS_VERIFY_V1: '/v1/sms/verify',
    SMS_VERIFY_V2: '/v2/sms/verify',
    // 谷歌验证
    GOOGLE_VERIFY_V1: '/v1/g_auth/verify',
    // 登陆验证
    LOGIN_CHECK_V1: '/v1/users/loginCheck',
    LOGIN_CHECK_V2: '/v2/users/loginCheck',
    // 极验注册
    GEETEST_REGISTER: '/geetest/register',
    // 极验验证
    GEETEST_VALIDATE: '/geetest/validate',
    // 用户登陆
    LOGIN_WEB_V1: '/v1/users/loginWeb',
    LOGIN_WEB_V2: '/v2/users/loginWeb',
    // 重置密码
    RESET_PASSWD_V1: '/v1/users/ResetPasswd',
    // 邮箱验证
    EMAIL_VERIFY_V2: '/v2/emails/emailCheck',
    // 钱包子账户资产
    SUB_ASSETS_V1: '/v1/users/subAssets',
    // 账号注册
    REGISTER_V1: '/v1/users/register',
    // 设备信息获取
    STAT_REPORT_UDC: '/v1/stat/report/udc',
    // 获取用户资产
    ASSETS_V1: '/v1/users/GetAssets',
    // 国家列表
    COUNTRY_LIST_V1: '/v1/country/list',
    // 提现
    WITHDRAW: '/users/ReqWithdraw',
    // 提现和支付手续费
    ACT_FEES: '/v1/exch/fees', // '/users/getFees',
    // 获取钱包地址列表
    WALLET_ADDRESS_LIST: '/addressMg/getWalletList',
    // 钱包历史记录
    WALLET_ASSETS_HISTORY_V1: '/v1/users/GetMoneyHistory',
    // 钱包充值地址
    WALLET_RECHARGE_ADDR_V1: '/v1/users/GetRechargeAddr',
    // 渠道信息
    EXCH_INFO_V1: '/v1/exch/info',
    // 宣传图
    DESKTOP_BANNER_V2: '/v2/desk/banner',
    // 最新公告
    ANNOUNCEMENTS_LATEST: '/v2/hc/announcements/latest',
    // 系统开关配置
    FUN_LIST_V1: '/v1/users/funList',
    // 资产划转
    TRANSFER_POST: '/users/Transfer',
    // 币种简介
    COIN_INFO: '/markets/currencies/intro',
    // 手续费 最小值
    COIN_FEES: 'v1/exch/fees',
    // 获取秘钥（用于绑定google验证）
    AUTH_SECRET_V1: '/v1/g_auth/getSecret',
    // 绑定google请求
    AUTH_BIND_GOOGLE_AUTH_V1: '/v1/g_auth/bindGoogleAuth',
    // 关闭google验证
    AUTH_RELIEVE_GOOGLE_AUTH_V1: '/v1/g_auth/relieveGoogleAuth',
    // 修改密码
    MODIFY_PASSWD: '/users/ChangePasswd',
    // 更新语言
    UPDATE_LANGUAGE_V2: '/v2/users/updateLanguage',
    // 查询用户简介
    QUERY_USER_INFO_V2: '/v2/users/queryUserInfo',
    // 2FA验证
    SET_2FA_V2: '/v2/users/Set2FA',
    // 退出登陆
    USDER_LOGOUT: '/users/out',
    // 币种全称
    MARKETS_CURRENCY_INTRO_V1: '/v1/markets/currencies/intro',
    // 最近登录 IP
    USER_GET_EXTINFO: '/users/ipInfo',
    // 登陆的记录
    USER_EXT_LIST: '/users/GetExtInfo',
    // 设置自选、资金密码等
    FAVORITE_SETTING_V1: '/v1/users/favoriteSetting',
    // 账户设置，设置防钓鱼码等
    ACCOUNT_SETTING: '/users/AccountSetting',
    // API管理接口
    USER_API: '/users/api',
    // 合约，交易对 排序
    MARKETS_SORT: '/v1/markets/currencies/sort',
    /**
     * 跟单
     */
    // 划转 跟单
    FORDER_TRANSFER: '/v2/forder/ccsTransfer',
    // 申请老师
    FORDER_APPLYLEADER_V1: `v1/forder/applyLeader`,
    // 我的带单设置
    FORDER_GETMYLD_V1: `v1/forder/getMyLd`,
    // 我的申请记录
    FORDER_GETMYAPPLY_V1: `v1/forder/getMyApply`,
    // 开启/关闭带单
    FORDER_OPENLEADER_V1: `v1/forder/openLeader`,
    // 设置带单资料
    FORDER_EDITLEADER_V1: `v1/forder/editLeader`,
    // 设置带单
    FORDER_LEADERCFG_V1: `v1/forder/leaderCfg`,
    // 跟单者列表
    FORDER_GETFOLLOWER_V1: `v1/forder/getFollower`,
    // 开启跟单
    FORDER_OPENFOLLOWER_V1: `v1/forder/openFollow`,
    // 关闭跟单
    FORDER_CLOSEFOLLOWER_V1: `v1/forder/closeFollow`,
    // 修改跟单
    FORDER_EDITFOLLOW_V1: `v1/forder/editFollow`,
    // 我的跟单
    FORDER_MYFOLLOW_V1: `v1/forder/myFollow`,
    // 榜单及全部交易员
    FORDER_SEARCHFOLLOW_V1: `v1/forder/searchFollow`,
    // 获取所有委托
    FORDER_GETORDERS_V1: `v1/forder/getOrders`,
    // 获取所有持仓
    FORDER_GETPOSITION_V1: `v1/forder/getPosition`,
    // 平仓
    FORDER_CLOSEPOS_V1: `v1/forder/closePos`,
    // 止盈止损
    FORDER_STOPPOS_V1: `v1/forder/stopPos`,
    // 收益明细
    FORDER_GETPNLREC_V1: `v1/forder/getPNLRec`,
    // 获取交易员信息
    FORDER_GETFOLLOWINFO_V1: `v1/forder/getFollowInfo`,
    // 获取跟单配置
    FORDER_GETCOMMONCFG_V1: `v1/forder/getCommonCfg`,
    // 获取推荐
    FORDER_GETRECOMMOND_V1: `v1/forder/getRecommond`,
    // 同意协议接口
    FORDER_SETAGREEMENT_V1: `v1/forder/setAgreement`,
    // 获取老师平仓记录
    FORDER_GETLDREC_V1: `v1/forder/ldRec`,
    // 获取站内信公告消息列表
    GET_MAIL_NOTICE_V1: '/v1/msgcenter/notice',
    // 获取站内信个人消息列表
    GET_MAIL_NOTIFY_V1: '/v1/msgcenter/notify',
    // 获取站内信消息已读数据
    GET_MAIL_ID_V1: '/v1/msgcenter/message/markstatus/list',
    // 储存站内信消息已读数据
    SAV_MAIL_ID_V1: '/v1/msgcenter/message/markstatus/update',
    GET_MAIL_MEASSAGE_LIST: '/v1/msgcenter/message/list'
};
