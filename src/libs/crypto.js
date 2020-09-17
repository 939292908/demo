const crypto = {
    encrypt: function (data) { // 字符串加密
        let str = String.fromCharCode(data.charCodeAt(0) + data.length);
        for (let i = 1; i < data.length; i++) {
            str += String.fromCharCode(data.charCodeAt(i) + data.charCodeAt(i - 1));
        }
        return encodeURIComponent(str);
    },
    decrypt: function (data) { // 字符串解密
        data = decodeURIComponent(data);
        let str = String.fromCharCode(data.charCodeAt(0) - data.length);
        for (let i = 1; i < data.length; i++) {
            str += String.fromCharCode(data.charCodeAt(i) - str.charCodeAt(i - 1));
        }
        return str;
    }
};

module.exports = crypto;