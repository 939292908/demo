const Http = require('@/api').webApi;
// const m = require('mithril');

module.exports = {
    initFn: function() {
    },
    // 解绑谷歌验证
    unbind: function() {
        // 用户密码
        const password = document.getElementsByClassName('pwd')[0].value;
        // google验证码
        const code = document.getElementsByClassName('code')[0].value;
        Http.relieveGoogleAuth({
            password: password,
            code: code
        }).then(function(arg) {
            console.log('nzm', 'bindGoogleAuth success', arg);
            if (arg.result.code === 0) {
                console.log('success');
            }
        }).catch(function(err) {
            console.log('nzm', 'bindGoogleAuth error', err);
        });
    },
    removeFn: function() {
    }
};