const Http = require('@/api').webApi;
const m = require('mithril');
const Qrcode = require('qrcode');
const geetest = require('@/models/validate/geetest').default;
const broadcast = require('@/broadcast/broadcast');

module.exports = {
    // 密钥
    secret: '',
    IOSDLAdd: 'https://apps.apple.com/us/app/google-authenticator/id388497605',
    AndroidDLAdd: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2',
    initFn: function() {
        this.initGeetest();
        const that = this;
        Http.getGoogleSecret().then(function(arg) {
            // console.log('nzm', 'getGoogleSecret success', arg);
            that.secret = arg.secret;
            // 生成密钥二维码
            that.generatedCode(arg.secret, 'key');
            m.redraw();
        }).catch(function(err) {
            console.log('nzm', 'getGoogleSecret error', err);
        });
        // 生成IOS下载地址二维码
        this.generatedCode(this.IOSDLAdd, 'IOS');
        // 生成Android下载地址二维码
        this.generatedCode(this.AndroidDLAdd, 'Android');
    },
    generatedCode: function(text, type) {
        Qrcode.toCanvas(text || '无', {
            errorCorrectionLevel: "L", // 容错率L（低）H(高)
            margin: 1, // 二维码内边距，默认为4。单位px
            height: 110, // 二维码高度
            width: 110 // 二维码宽度
        }).then(canvas => {
            if (type === 'key') {
                document.getElementsByClassName('stepTwo-qrcode')[0].appendChild(canvas);
            } else if (type === 'IOS') {
                document.getElementsByClassName('qrcodeIOS')[0].appendChild(canvas);
            } else if (type === 'Android') {
                document.getElementsByClassName('qrcodeAndroid')[0].appendChild(canvas);
            }
        }).catch((err) => {
            console.log(err);
        });
    },
    // 绑定谷歌验证
    bind: function() {
        this.initGeetest();
        // 密钥
        const opInfo = this.secret;
        // 用户密码
        const password = document.getElementsByClassName('pwd')[0].value;
        // google验证码
        const code = document.getElementsByClassName('code')[0].value;
        Http.bindGoogleAuth({
            opInfo: opInfo,
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
    /**
     * 加载极验
     */
    initGeetest() {
        geetest.init(() => {
        });
        broadcast.onMsg({
            key: 'bindGoogle',
            cmd: 'geetestMsg',
            cb: res => {
                if (res === 'success') {
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