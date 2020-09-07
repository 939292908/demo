const I18n = require('@/languages/I18n').default;
const utils = {};
const DBG_TAG = "UTILS";
// const I18n = require('@/languages/I18n').default;
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

// 账号信息隐藏，可针对邮箱和手机
utils.hideAccountNameInfo = val => {
    if (!val) return '';
    if (val.includes('@')) {
        const arr = val.split('@');
        if (arr[0].length > 4) {
            return arr[0].substr(0, 4) + '****@' + arr[1];
        } else {
            return val;
        }
    } else {
        let newMobile = '';
        if (val.length > 11) {
            newMobile = val.substr(0, 8) + '****' + val.substr(12);
            return newMobile;
        } else if (val.length === 11) {
            newMobile = val.substr(0, 3) + '****' + val.substr(7);
            return newMobile;
        } else {
            return val;
        }
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
utils.getWithdrawArr = function (p) {
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

/**
 * 获取浏览器地址栏参数
 * @param key
 * @returns {string}
 */
utils.queryParams = function (key) {
    const pos = window.location.href.indexOf('?');
    const queryString = window.location.href.substr(pos + 1);
    const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
    const r = queryString.match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null;
};

// 初始化script标签
utils.createScript = function({ src, type = 'text/javascript', id, async = true, cb, errcb }) {
    const script = document.createElement('script');
    script.id = id || Date.now();
    script.type = type;
    script.async = async;
    script.src = src;
    script.onerror = function() {
        errcb && errcb();
    };
    script.onload = script.onreadystatechange = function() {
        if (!this.readyState || this.readyState === 'loaded' ||
            this.readyState === 'complete') {
            cb && cb();
            script.onload = script.onreadystatechange = null;
        }
    };
    document.getElementsByTagName('head')[0].appendChild(script);
};

utils.getTransferHisStr = function(p, coin) {
    const obj = {
        inCoin: '买权证扣本金',
        inFee: '买权证扣手续费',
        renewFee: '续期扣手续费',
        outProCoin: '买权证划拨权证币',
        outFangzhou: '方舟计划派发' + coin,
        outInterest: '合约派息',
        outCoin: '合约本金出金',
        inProCoin: '合约权证出金',
        teamCoin: '团队奖励',
        groupCoin: '社区分红',
        productCoin: '权证结算',
        plateCoin: '平台分红',
        powCoin: 'POW释放奖励',
        userActiveAward: '新会员推荐奖金',
        x_pocbuy: '矿机购买',
        x_pochandlingfee: '交易手续费',
        x_poccashback: '直推返利',
        x_teamback: '团队返利',
        fangzhouLock: '方舟余币锁仓',
        fangzhouRelease: '方舟余币释放',
        incomeRelease: '派息锁仓释放'
    };
    return obj[p] || '';
};

export default utils;