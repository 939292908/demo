const Http = require('@/api').webApi;
const m = require('mithril');
const Qrcode = require('qrcode');

module.exports = {
    // 密钥
    secret: '',
    IOSDLAdd: 'https://apps.apple.com/us/app/google-authenticator/id388497605',
    AndroidDLAdd: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2',
    initFn: function() {
        const that = this;
        Http.getGoogleSecret().then(function(arg) {
            console.log('nzm', 'getGoogleSecret success', arg);
            that.secret = arg.secret;
            that.generatedCode(arg.secret, 'key');
            m.redraw();
        }).catch(function(err) {
            console.log('nzm', 'getGoogleSecret error', err);
        });
        this.generatedCode(this.IOSDLAdd, 'IOS');
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
    bind: function() {
        Http.bindGoogleAuth().then(function(arg) {
            console.log('nzm', 'bindGoogleAuth success', arg);
        }).catch(function(err) {
            console.log('nzm', 'bindGoogleAuth error', err);
        });
    },
    removeFn: function() {

    }
};