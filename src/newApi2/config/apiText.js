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
    // 查询用户简介
    QUERY_USER_INFO_V1: '/v1/users/queryUserInfo',
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
    EMAIL_VERIFY_V1: '/v1/emails/emailCheck',
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
    ACT_FEES: '/v1/exch/fees', // '/users/getFees';
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
    ANNOUNCEMENTS_LATEST: '/v2/hc/announcements/latest'
};