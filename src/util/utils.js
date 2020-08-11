const utils = {};
const DBG_TAG = "UTILS";

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

utils.isMobile = function() {
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

utils.toPrecision2 = function(value, n, maxLen) {
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

utils.toFixedForFloor = function(value, n) {
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
utils.getSpotName = function(assetD, coin1, coin2) {
    for (const key in assetD) {
        if (key.indexOf(`${coin1}/${coin2}`) === 0) {
            return key;
        }
    }
    return `${coin1}/${coin2}`;
};

export default utils;