const methods = {};
const I18n = require('../languages/I18n').default;

//  资金中心及node提示错误码
methods.getWebApiErrorCode = function (code) {
    const obj = {
        8001: "签名验证失败",
        8002: "资产余额不足",
        8003: "序列号已存在",
        8004: "序列号已超时",
        8005: "用户令牌错误",
        8006: "用户令牌超时",
        8007: "不支持的操作",
        8008: "系统出错",
        8009: "输入错误",
        8010: "序列号不存在",
        8011: "状态错误",
        8012: "资产数量错误",
        8013: "资产密码错误",
        8014: "资产密码为空",
        10005: "邮件验证失败",
        10004: "短信验证失败",
        10002: "谷歌验证失败",
        123: "5分钟内请勿重复发送",
        124: "请勿频繁发送验证",
        9000: "系统繁忙请稍后再试",
        9001: "输入信息有误",
        9002: "登录过期，请重新登录",
        9003: "登录过期，请重新登录",
        9004: "请输入有效的邮箱地址",
        9005: "两次输入密码不一致",
        9006: "用户不存在",
        9007: "用户已存在",
        9008: "钱包地址重复",
        9009: "钱包地址验证失败",
        9010: "用户名或密码错误",
        9011: "邮箱未验证",
        9012: "邮箱已验证，不可再次验证",
        9013: "验证码失效",
        9014: "密码错误",
        9015: "设置无变化",
        9016: "身份认证(已审核通过)不可再更改",
        9017: "币种错误",
        9018: "手机号不存在",
        9019: "手机号已存在",
        9020: "谷歌已存在",
        9021: "谷歌已存在",
        9022: "密码修改,密码重置 或 2FA解绑后，24h内禁止提币",
        9023: "状态错误",
        9024: "配置错误",
        9025: "超出购买数量限制",
        9026: "购买数量不足最小购买量",
        9027: "购买次数超过最大次数限制",
        9028: "资产不足",
        9029: "操作失败",
        9030: "资产密码不可与登录密码相同",
        9101: "系统繁忙请稍后再试",
        9102: "系统繁忙请稍后再试",
        //  9025: I18n.$t('10305'), // "每日资产划转额度限制",
        "-10": "没有打开活动",
        "-11": "多次入金",
        "-20": "道具使用失败",
        "-23": "活动不在有效期",
        9032: "必须输入邀请人ID",
        9033: "邀请码错误",
        9034: "邀请码错误",
        9035: "暂未开始",
        9036: "已结束",
        9037: "签名错误",
        9038: "服务器内部错误",
        9040: "划转已提交审核",
        9039: "额度已使用完毕",
        20000: "非法操作，请先通过二次验证",
        20001: "未实名认证",
        20002: "登录状态下不能注册",
        20003: "非法渠道号",
        20004: "注册功能已受限",
        999999: "账号注册异常",
        "-1": "极验验证异常"
    };

    return obj[code] || I18n.$t('10203' /* '未知错误' */) + `(${code})`;
};

export default methods;