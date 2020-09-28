const methods = {};
const I18n = require('../languages/I18n').default;

//  资金中心及node提示错误码
methods.getWebApiErrorCode = function (code) {
    const obj = {
        8001: I18n.$t('10420')/* '签名验证失败' */,
        8002: I18n.$t('10421')/* '资产余额不足' */,
        8003: I18n.$t('10422')/* '序列号已存在' */,
        8004: I18n.$t('10423')/* '序列号已超时' */,
        8005: I18n.$t('10424')/* '用户令牌错误' */,
        8006: I18n.$t('10425')/* '用户令牌超时' */,
        8007: I18n.$t('10426')/* '不支持的操作' */,
        8008: I18n.$t('10427')/* '系统出错' */,
        8009: I18n.$t('10428')/* '输入错误' */,
        8010: I18n.$t('10429')/* '序列号不存在' */,
        8011: I18n.$t('10430')/* '状态错误' */,
        8012: I18n.$t('10431')/* '资产数量错误' */,
        8013: I18n.$t('10432')/* '资产密码错误' */,
        8014: I18n.$t('10433')/* '资产密码为空' */,
        10005: I18n.$t('10434')/* '邮件验证失败' */,
        10004: I18n.$t('10435')/* '短信验证失败' */,
        10002: I18n.$t('10436')/* '谷歌验证失败' */,
        123: I18n.$t('10437')/* '5分钟内请勿重复发送' */,
        124: I18n.$t('10438')/* '请勿频繁发送验证' */,
        9000: I18n.$t('10338')/* '系统繁忙请稍后再试' */,
        9001: I18n.$t('10439')/* '输入信息有误' */,
        9002: I18n.$t('10440')/* '登录过期，请重新登录' */,
        9003: I18n.$t('10440')/* '登录过期，请重新登录' */,
        9004: I18n.$t('10441')/* '请输入有效的邮箱地址' */,
        9005: I18n.$t('10442')/* '两次输入密码不一致' */,
        9006: I18n.$t('10339')/* '用户不存在' */,
        9007: I18n.$t('10443')/* '用户已存在' */,
        9008: I18n.$t('10444')/* '钱包地址重复' */,
        9009: I18n.$t('10445')/* '钱包地址验证失败' */,
        9010: I18n.$t('10446')/* '用户名或密码错误' */,
        9011: I18n.$t('10447')/* '邮箱未验证' */,
        9012: I18n.$t('10448')/* '邮箱已验证，不可再次验证' */,
        9013: I18n.$t('10449')/* '验证码失效' */,
        9014: I18n.$t('10450')/* '密码错误' */,
        9015: I18n.$t('10451')/* '设置无变化' */,
        9016: I18n.$t('10452')/* '身份认证(已审核通过)不可再更改' */,
        9017: I18n.$t('10453')/* '币种错误' */,
        9018: I18n.$t('10454')/* '手机号不存在' */,
        9019: I18n.$t('10455')/* '手机号已存在' */,
        9020: I18n.$t('10456')/* '谷歌不存在' */,
        9021: I18n.$t('10457')/* '谷歌已存在' */,
        9022: I18n.$t('10458')/* '密码修改,密码重置或2FA解绑后,24h内禁止提币' */,
        9023: I18n.$t('10430')/* '状态错误' */,
        9024: I18n.$t('10459')/* '配置错误' */,
        9025: I18n.$t('10460')/* '超出购买数量限制' */,
        9026: I18n.$t('10461')/* '购买数量不足最小购买量' */,
        9027: I18n.$t('10462')/* '购买次数超过最大次数限制' */,
        9028: I18n.$t('10463')/* '资产不足' */,
        9029: I18n.$t('10464')/* '操作失败' */,
        9030: I18n.$t('10465')/* '资产密码不可与登录密码相同' */,
        9101: I18n.$t('10338')/* '系统繁忙请稍后再试' */,
        9102: I18n.$t('10338')/* '系统繁忙请稍后再试' */,
        // 9025: I18n.$t('10466'), // "每日资产划转额度限制",
        "-10": I18n.$t('10467')/* '没有打开活动' */,
        "-11": I18n.$t('10468')/* '多次入金' */,
        "-20": I18n.$t('10469')/* '道具使用失败' */,
        "-23": I18n.$t('10470')/* '活动不在有效期' */,
        9032: I18n.$t('10471')/* '必须输入邀请人ID' */,
        9033: I18n.$t('10472')/* '邀请码错误' */,
        9034: I18n.$t('10472')/* '邀请码错误' */,
        9035: I18n.$t('10473')/* '暂未开始' */,
        9036: I18n.$t('10474')/* '已结束' */,
        9037: I18n.$t('10475')/* '签名错误' */,
        9038: I18n.$t('10476')/* '服务器内部错误' */,
        9040: I18n.$t('10477')/* '划转已提交审核' */,
        9039: I18n.$t('10478')/* '额度已使用完毕' */,
        20000: I18n.$t('10479')/* '非法操作，请先通过二次验证' */,
        20001: I18n.$t('10480')/* '未实名认证' */,
        20002: I18n.$t('10481')/* '登录状态下不能注册' */,
        20003: I18n.$t('10482')/* '非法渠道号' */,
        20004: I18n.$t('10483')/* '注册功能已受限' */,
        999999: I18n.$t('10484')/* '账号注册异常' */,
        "-1": I18n.$t('10485')/* '极验验证异常' */
    };

    return obj[code] || I18n.$t('10570')/* '未知错误' */ + `(${code})`;
};

methods.getTransferInfo = function (p) {
    const obj = {
        1: I18n.$t('10523'), // '确认中',
        2: I18n.$t('10094'), // 失败
        3: I18n.$t('10093'), // 成功
        11: I18n.$t('10524'), // '邮件确认中',
        12: I18n.$t('10525'), // '已取消',
        13: I18n.$t('10526'), // '等待中',
        14: I18n.$t('10525'), // '已取消',
        18: I18n.$t('10094'), // 失败
        19: I18n.$t('10094'), // 失败
        24: I18n.$t('10093'), // 成功
        25: I18n.$t('10525'), // '已取消',
        26: I18n.$t('10523'), // '确认中',
        30: I18n.$t('10094'), // 失败
        35: I18n.$t('10094'), // 失败
        36: I18n.$t('10525'), // '已取消',
        41: I18n.$t('10093'), // 成功
        42: I18n.$t('10527'), // '处理中',
        50: I18n.$t('10527'), // '处理中',
        51: I18n.$t('10094'), // 失败
        52: I18n.$t('10527'), // '处理中',
        101: I18n.$t('10093'), // 成功
        102: I18n.$t('10094'), // 失败
        110: I18n.$t('10528'), // '待审核',
        111: I18n.$t('10529'), // 审核失败
        112: I18n.$t('10530'), // 已撤销
        113: I18n.$t('10531') // 审核成功
    };
    return obj[p] || '';
};

methods.getWithdrawArr = function (p) {
    const obj = {
        1: I18n.$t('10523'), // '确认中',
        2: I18n.$t('10094'), // 失败
        3: I18n.$t('10093'), // 成功
        11: I18n.$t('10524'), // '邮件确认中',
        12: I18n.$t('10525'), // '已取消',
        13: I18n.$t('10526'), // '等待中',
        14: I18n.$t('10525'), // '已取消',
        18: I18n.$t('10094'), // 失败
        19: I18n.$t('10094'), // 失败
        24: I18n.$t('10526'), // '等待中',
        25: I18n.$t('10525'), // '已取消',
        26: I18n.$t('10523'), // '确认中',
        30: I18n.$t('10094'), // 失败
        35: I18n.$t('10094'), // 失败
        36: I18n.$t('10093'), // 成功
        41: I18n.$t('10093'), // 成功
        42: I18n.$t('10527'), // '处理中',
        50: I18n.$t('10527'), // '处理中',
        51: I18n.$t('10094'), // 失败
        52: I18n.$t('10527'), // '处理中',
        101: I18n.$t('10093'), // 成功
        102: I18n.$t('10094'), // 失败
        110: I18n.$t('10528'), // '待审核',
        111: I18n.$t('10529'), // 审核失败
        112: I18n.$t('10530'), // 已撤销
        113: I18n.$t('10531') // 审核成功
    };
    return obj[p] || '';
};

methods.getTransferHisStr = function(p, coin) {
    const obj = {
        inCoin: I18n.$t('10549'), /* '买权证扣本金', */
        inFee: I18n.$t('10550'), /* '买权证扣手续费', */
        renewFee: I18n.$t('10551'), /* '续期扣手续费', */
        outProCoin: I18n.$t('10552'), /* '买权证划拨权证币', */
        outFangzhou: I18n.$t('10553'), /* '方舟计划派发' + coin, */
        outInterest: I18n.$t('10554'), /* '合约派息', */
        outCoin: I18n.$t('10555'), /* '合约本金出金', */
        inProCoin: I18n.$t('10556'), /* '合约权证出金', */
        teamCoin: I18n.$t('10557'), /* '团队奖励', */
        groupCoin: I18n.$t('10558'), /* '社区分红', */
        productCoin: I18n.$t('10559'), /* '权证结算', */
        plateCoin: I18n.$t('10560'), /* '平台分红', */
        powCoin: I18n.$t('10561'), /* 'POW释放奖励', */
        userActiveAward: I18n.$t('10562'), /* '新会员推荐奖金', */
        x_pocbuy: I18n.$t('10563'), /* '矿机购买', */
        x_pochandlingfee: I18n.$t('10564'), /* '交易手续费', */
        x_poccashback: I18n.$t('10565'), /* '直推返利', */
        x_teamback: I18n.$t('10566'), /* '团队返利', */
        fangzhouLock: I18n.$t('10567'), /* '方舟余币锁仓', */
        fangzhouRelease: I18n.$t('10568'), /* '方舟余币释放', */
        incomeRelease: I18n.$t('10569')/* '派息锁仓释放' */
    };
    return obj[p] || '';
};

methods.getRecordsType5Str = function(p, coin) {
    const obj = {
        ins_pay: I18n.$t('10588'), // '合约保险-保险金扣除',
        ins_back: I18n.$t('10589'), // '合约保险-保险金退款',
        ins_back2: I18n.$t('10589') // '合约保险-保险金退款',
    };
    let str = obj[p] || I18n.$t('10140');
    if (!str) {
        if (p.includes('INS_')) {
            str = I18n.$t('10590'); // '合约保险-获得赔付金额'
        } else {
            str = I18n.$t('10140'); // '其他类型'
        }
    }
    return str;
};
// 服务错误码

// 红包错误码
methods.getRedPacketErrorCode = function(code) {
    const obj = {
        "-1": "未知错误", // 未知错误
        "-1000": "哎呀出错啦~快截图找客服！", // 哎呀出错啦~快截图找客服！
        "-1001": "不可超过最高发送金额", // 不可超过最高发送金额
        "-1006": "不可低于最低发送金额", // 不可低于最低发送金额
        "-1002": "红包已失效，下一个打起精神！", // 红包已失效，下一个打起精神！
        "-1003": "哎呀出错啦~快截图找客服！", // 哎呀出错啦~快截图找客服！
        "-1004": "已领过此红包，不要贪心哦~ ", // 已领过此红包，不要贪心哦~
        "-1005": "红包已领完，下一个打起精神！" // 红包已领完，下一个打起精神！
    };
    return obj[code] || '未知错误';
};
export default methods;