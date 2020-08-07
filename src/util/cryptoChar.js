const crypto = {};
// 字符串加密
crypto.encrypt = function(data) {
    let str = String.fromCharCode(data.charCodeAt(0) + data.length);
    for (let i = 1; i < data.length; i++) {
        str += String.fromCharCode(data.charCodeAt(i) + data.charCodeAt(i - 1));
    }
    return encodeURIComponent(str);
};
// 字符串解密
crypto.decrypt = function(data) {
    data = decodeURIComponent(data);
    let str = String.fromCharCode(data.charCodeAt(0) - data.length);
    for (let i = 1; i < data.length; i++) {
        str += String.fromCharCode(data.charCodeAt(i) - str.charCodeAt(i - 1));
    }
    return str;
};
export default crypto;
