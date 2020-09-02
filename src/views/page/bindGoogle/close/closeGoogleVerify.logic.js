const Http = require('@/api').webApi;
const geetest = require('@/models/validate/geetest').default;
const broadcast = require('@/broadcast/broadcast');

module.exports = {
    initFn: function() {
        this.initGeetest();
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
    confirmBtn: function () {
        geetest.verify();
    },
    /**
     * 加载极验
     */
    initGeetest() {
        geetest.init(() => {
        });
        broadcast.onMsg({
            key: 'closeBindGoogle',
            cmd: 'geetestMsg',
            cb: res => {
                if (res === 'success') {
                    // 成功则进入安全验证
                    console.log('success');
                } else {
                    console.log('error');
                }
            }
        });
    },
    removeFn: function() {
    }
};