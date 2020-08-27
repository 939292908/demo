const utils = {};
const DBG_TAG = "UTILS";
const I18n = require('@/languages/I18n').default;
utils.setItem = function (key, val) {
    try {
        window.localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
        window._console.log(DBG_TAG, JSON.stringify(e));
    }
};

utils.getItem = function (key) {
    try {
        return JSON.parse(window.localStorage.getItem(key));
    } catch (e) {
        return null;
    }
};
utils.removeItem = function (key) {
    try {
        window.localStorage.removeItem(key);
    } catch (e) {
        window._console.log(DBG_TAG, JSON.stringify(e));
    }
};

utils.isMobile = function () {
    const userAgentInfo = navigator.userAgent;
    const mobileAgents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    let mobileFlag = false;
    // 根据userAgent判断是否是手机
    for (let v = 0; v < mobileAgents.length; v++) {
        if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
            mobileFlag = true;
            break;
        }
    }
    const screenWidth = window.screen.width;
    const mscreenHeight = window.screen.height;
    // 根据屏幕分辨率判断是否是手机
    if (screenWidth < 500 && mscreenHeight < 800) {
        mobileFlag = true;
    }

    return mobileFlag;
};

// 数字加逗号
utils.toThousands = function (num) {
    if (!num) return 0;
    if (isNaN(num)) return 0;
    const str = num.toString().split('.');
    var num1 = (str[0] || 0).toString();
    var result = '';
    while (num1.length > 3) {
        result = ',' + num1.slice(-3) + result;
        num1 = num1.slice(0, num1.length - 3);
    }
    if (num1) { result = num1 + result; }
    return result + (num.toString().includes('.') ? '.' + str[1] || '' : '');
};

// /获取小数位数
utils.getFloatSize = function (val) {
    if (val.toString().indexOf(".") === -1) {
        return 0;
    }
    var _v = val.toString().split(".");
    if (_v.length > 1) return _v[1].length;
    return 0;
};

//  科学计数法转正常数
utils.getFullNum = function (num) {
    // 处理非数字
    if (isNaN(num)) {
        return num;
    }
    // 处理不需要转换的数字
    var str = '' + num;
    if (!/e/i.test(str)) {
        return num;
    }
    return (num).toFixed(18).replace(/\.?0+$/, "");
};

/**
 * 数字保留有效数字，并保持最大小数位为maxLen位
 * @n 保留有效数字的位数
 * @maxLen 最大小数位数
 */

utils.toPrecision2 = function (value, n, maxLen) {
    if (!value) {
        return value;
    }
    // 保留n个有效数字
    let num = value.toPrecision(n);
    // 处理科学计数法数字
    let str = num.toString();
    if (/e/i.test(str)) {
        num = Number(num).toFixed(18).replace(/\.?0+$/, "");
    }
    // 处理最长小数位为maxLen位
    if (maxLen || maxLen === 0) {
        str = num.toString();
        if (str.indexOf('.') > -1) {
            str = num.toString().split('.');
            if (str[1].length > maxLen) {
                num = str[0] + '.' + str[1].substr(0, maxLen);
            }
        }
    }
    return num;
};

/**
 * 保留小数位向下取整
 * @n 保留的位数
 */

utils.toFixedForFloor = function (value, n) {
    if (isNaN(value)) {
        return value;
    }
    // 处理浮点数
    let num = Number(value).toFixed(12);
    // 处理科学计数法数字
    const str = num.toString();
    if (/e/i.test(str)) {
        num = Number(num).toFixed(18).replace(/\.?0+$/, "");
    }
    const pow = Math.pow(10, n);
    num = Number(num) * pow;
    num = Math.floor(num);
    num = num / pow;
    num = num.toFixed(n);
    return num;
};

/**
 * 用币种获取相关交易对名称
 * @param {Object} assetD 合约交易对详情
 * @param {String} coin1 交易对名称第一个币种
 * @param {String} coin2 交易对名称第二个币种
 */
utils.getSpotName = function (assetD, coin1, coin2) {
    for (const key in assetD) {
        if (key.indexOf(`${coin1}/${coin2}`) === 0) {
            return key;
        }
    }
    return `${coin1}/${coin2}`;
};

// 隐藏手机号码重要部分
utils.hideMobileInfo = mobile => {
    let newMobile = '';
    if (mobile.length > 11) {
        newMobile = mobile.substr(0, 8) + '****' + mobile.substr(12);
        return newMobile;
    } else if (mobile.length === 11) {
        newMobile = mobile.substr(0, 3) + '****' + mobile.substr(7);
        return newMobile;
    } else {
        return mobile;
    }
};
utils.totalNumSub = function (number, n) {
    var str = this.getFullNum(Number(number).toFixed(12)).toString();
    var arr = str.split('.');
    if (arr.length === 2) {
        arr[1] = arr[1].substr(0, n);
        return Number(arr[0] + '.' + arr[1]).toFixed(n);
    } else {
        return Number(arr[0]).toFixed(n);
    }
    // return new Decimal(Number(number)).toFixed(10).replace(/^(\-)*(\d+)\.(\d{8}).*$/, '$1$2.$3');
};
utils.getTransferInfo = function (p) {
    const obj = {
        1: I18n.$t("10798"), // 确认中
        2: I18n.$t("10134"), // 失败
        3: I18n.$t("10133"), // 成功
        11: I18n.$t("10141"), // 邮件确认中// 待确认(未验证)
        12: I18n.$t("10146"), // 已取消(取消)
        13: I18n.$t("10142"), // 待审核(已确认，待锁定资产)
        14: I18n.$t("10146"), // 已取消(未确认而且已超时)
        18: I18n.$t("10134"), // 失败(确认后，出金操作失败（余额不足）【结束】)
        19: I18n.$t("10134"), // 失败(确认后，出金操作失败（tks宕机，网络不通）【结束】)
        24: I18n.$t("10133"), // 待审核(锁定资产成功（交易核心出金成功）)
        25: I18n.$t("10146"), // 已取消(用户撤销 【对冲账单，还钱】【结束】)
        26: I18n.$t("10143"), // 审核中(开始后台审核，用户不可撤销（后台回调通知ucs）)
        30: I18n.$t("10134"), // 失败(后台审核不通过【对冲账单，还钱】【结束】)
        35: I18n.$t("10134"), // 失败(调用外部钱包打款失败 【可补发调外部钱包】)
        36: I18n.$t("10145"), // 审核已通过(调用外部钱包打款成功 【把冻结资产的状态设置为不可对冲】)
        41: I18n.$t("10133"), // 成功(区块链成功回调 （暂无）)
        42: I18n.$t("10144"), // 处理中(区块链失败回调 （暂无）【24小时后，人工介入???】)
        50: I18n.$t("10144"), // 处理中(提币失败后，已申请对冲)
        51: I18n.$t("10134"), // 失败(提币失败后，对冲成功，退回资产到帐)
        52: I18n.$t("10144"), // 处理中(提币失败后，对冲失败，后台可再次审批)
        101: I18n.$t("10133"), // 处理中(提币失败后，对冲失败，后台可再次审批)
        102: I18n.$t("10134"), // 处理中(提币失败后，对冲失败，后台可再次审批)
        110: I18n.$t('11677'), // '待审核', //待审核
        111: I18n.$t('11667'), // '审核失败', //审核失败
        112: I18n.$t('11674'), // '已撤销', //已撤销
        113: I18n.$t('12618') // '审核成功', //审核成功
    };
    return obj[p] || '';
};
utils.getWithdrawArr = function (p) {
    const obj = {
        // eslint-disable-next-line quote-props
        '11': I18n.$t('10141'), // '邮件确认中', // 待确认(未验证)
        // eslint-disable-next-line quote-props
        '12': I18n.$t("10146"), // 已取消(取消)
        // eslint-disable-next-line quote-props
        '13': I18n.$t('10142'), // '待审核', //待审核(已确认，待锁定资产)
        // eslint-disable-next-line quote-props
        '14': I18n.$t('10146'), // '已取消', //已取消(未确认而且已超时)
        // eslint-disable-next-line quote-props
        '18': I18n.$t("10134"), // 失败(确认后，出金操作失败（余额不足）【结束】)
        // eslint-disable-next-line quote-props
        '19': I18n.$t("10134"), // 失败(确认后，出金操作失败（tks宕机，网络不通）【结束】)
        // eslint-disable-next-line quote-props
        '24': I18n.$t('10142'), // '待审核', //待审核(锁定资产成功（交易核心出金成功）)
        // eslint-disable-next-line quote-props
        '25': I18n.$t("10146"), // 已取消(用户撤销 【对冲账单，还钱】【结束】)
        // eslint-disable-next-line quote-props
        '26': I18n.$t("10143"), // 审核中(开始后台审核，用户不可撤销（后台回调通知ucs）)
        // eslint-disable-next-line quote-props
        '30': I18n.$t("10134"), // 失败(后台审核不通过【对冲账单，还钱】【结束】)
        // eslint-disable-next-line quote-props
        '35': I18n.$t("10134"), // 失败(调用外部钱包打款失败 【可补发调外部钱包】)
        // eslint-disable-next-line quote-props
        '36': I18n.$t('10133'), // '成功', //区块确认中(调用外部钱包打款成功 【把冻结资产的状态设置为不可对冲】)
        // eslint-disable-next-line quote-props
        '41': I18n.$t("10133"), // 成功(区块链成功回调 （暂无）)
        // eslint-disable-next-line quote-props
        '42': I18n.$t('10144'), // '处理中', //处理中(区块链失败回调 （暂无）【24小时后，人工介入???】)
        // eslint-disable-next-line quote-props
        '50': I18n.$t('10144'), // '处理中', //处理中(提币失败后，已申请对冲)
        // eslint-disable-next-line quote-props
        '51': I18n.$t("10134"), // 失败(提币失败后，对冲成功，退回资产到帐)
        // eslint-disable-next-line quote-props
        '52': I18n.$t('10144') // '处理中', //处理中(提币失败后，对冲失败，后台可再次审批)
    };
    return obj[p] || '';
};

utils.getFullNum = function (num) { // 科学计数法转正常数
    // 处理非数字
    if (isNaN(num)) {
        return num;
    }
    // 处理不需要转换的数字
    var str = '' + num;
    if (!/e/i.test(str)) {
        return num;
    }
    return (num).toFixed(18).replace(/\.?0+$/, "");
};
utils.time = function (value) {
    let DateNow;
    let year;
    let month;
    let date1;
    let hour;
    let minute;
    let second;
    // eslint-disable-next-line prefer-const
    DateNow = new Date(parseInt(value) * 1000);
    // eslint-disable-next-line prefer-const
    year = DateNow.getFullYear();
    // eslint-disable-next-line prefer-const
    month = getZero(DateNow.getMonth() + 1);
    // eslint-disable-next-line prefer-const
    date1 = getZero(DateNow.getDate());
    // eslint-disable-next-line prefer-const
    hour = getZero(DateNow.getHours());
    // eslint-disable-next-line prefer-const
    minute = getZero(DateNow.getMinutes());
    // eslint-disable-next-line prefer-const
    second = getZero(DateNow.getSeconds());

    function getZero(num) {
        if (num < 10) {
            return '0' + num;
        } else {
            return num;
        }
    }

    return year + '-' + month + '-' + date1 + ' ' + hour + ":" + minute + ":" + second;
};

/**
 * 格式化时间
 * @param {Number,String} time 时间戳(ms)或者时间字符串
 * @param {String} format 时间格式，例如：'yyyy-MM-dd hh:mm:ss'
 */
utils.formatDate = function (time = new Date(), format = 'yyyy-MM-dd hh:mm:ss') {
    const date = new Date(time);
    const o = {
        'Y+': date.getYear(),
        'M+': date.getMonth() + 1, // month
        'd+': date.getDate(), // day
        'h+': date.getHours(), // hourF
        'm+': date.getMinutes(), // minute
        's+': date.getSeconds(), // second
        'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
        'S+': date.getMilliseconds() // millisecond
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1,
            (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    for (const k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            // format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
            if (k === 'S+') {
                format = format.replace(RegExp.$1,
                    RegExp.$1.length === 1 ? o[k] : ('000' + o[k]).substr(
                        ('' + o[k]).length));
            } else {
                format = format.replace(RegExp.$1,
                    RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(
                        ('' + o[k]).length));
            }
        }
    }
    return format;
};

export default utils;