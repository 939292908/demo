const api_list = {}

// 获取用户信息
api_list.REQ_USER_INFO = '/users/userInfo'
//发送短信
api_list.SEND_SMS_CODE_V1 = '/v1/sms/getSMSCode';
//发送邮件
api_list.SEND_EMAIL_V1 = '/v1/emails/sendEmail';
//短信验证
api_list.SMS_VERIFY_V1 = '/v1/sms/verify';
//谷歌验证
api_list.GOOGLE_VERIFY_V1 = '/g_auth/verify';
//登陆验证
api_list.LOGIN_CHECK_V1 = '/v1/users/loginCheck';
//查询用户简介
api_list.QUERY_USER_INFO_V1 = '/v1/users/queryUserInfo';
//极验注册
api_list.GEETEST_REGISTER = '/geetest/register';
//极验验证
api_list.GEETEST_VALIDATE = '/geetest/validate';
//用户登陆
api_list.LOGIN_WEB_V1 = '/v1/users/loginWeb';
//重置密码
api_list.RESET_PASSWD_V1 = '/v1/users/ResetPasswd';
//邮箱验证
api_list.EMAIL_VERIFY_V1 = '/v1/emails/emailCheck';
//钱包子账户资产
api_list.SUB_ASSETS_V1 = '/v1/users/subAssets';
//账号注册
api_list.REGISTER_V1 = '/v1/users/register';
//设备信息获取
api_list.STAT_REPORT_UDC = '/v1/stat/report/udc';
// 获取用户资产
api_list.ASSETS_V1 = '/v1/users/GetAssets';
//国家列表
api_list.COUNTRY_LIST_V1 = '/v1/country/list';

module.exports = api_list