const api_list = {}

// 获取用户信息
api_list.REQ_USER_INFO = '/users/userInfo'
//极验注册
api_list.GEETEST_REGISTER = '/geetest/register';
//极验验证
api_list.GEETEST_VALIDATE = '/geetest/validate';
//用户登陆
api_list.LOGIN_WEB_V1 = '/v1/users/loginWeb';
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

module.exports = api_list