const Http = require('@/api').webApi;
const m = require('mithril');
const Qrcode = require('qrcode');
const geetest = require('@/models/validate/geetest').default;
const validate = require('@/models/validate/validate').default;
const broadcast = require('@/broadcast/broadcast');

module.exports = {
    // 密钥
    secret: '',
    IOSDLAdd: 'https://apps.apple.com/us/app/google-authenticator/id388497605',
    AndroidDLAdd: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2',
    loginType: null, // 账户类型
    setting2fa: null, // 账户绑定状态
    // 安全校验弹框 show
    isShowVerifyView: false,
    // 安全校验弹框 显示/隐藏
    switchSafetyVerifyModal (type) {
        this.isShowVerifyView = type;
    },

    // 生成IOS，Android，密钥二维码 begin
    generateQRCode() {
        const that = this;
        // 获取秘钥（用于绑定google验证）
        Http.getGoogleSecret().then(function(arg) {
            // console.log('nzm', 'getGoogleSecret success', arg);
            that.secret = arg.secret;
            // 生成密钥二维码
            that.generatedCodeFN(arg.secret, 'key');
            m.redraw();
        }).catch(function(err) {
            console.log('nzm', 'getGoogleSecret error', err);
        });
        // 生成IOS下载地址二维码
        this.generatedCodeFN(this.IOSDLAdd, 'IOS');
        // 生成Android下载地址二维码
        this.generatedCodeFN(this.AndroidDLAdd, 'Android');
    },
    generatedCodeFN: function(text, type) {
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
    // 生成IOS，Android，密钥二维码 end

    confirmBtn: function () {
        // geetest.verify(); // 极验
        /*
        判断用户是否开启手机验证和邮箱验证
        1.如果开启其中一项，则验证一项
        2.如果两项都开启，则可选中验证其中一项。默认选择短信验证
        3.如果两项为关闭，则不弹出安全验证弹窗
        */
        if (this.setting2fa.email === 1 && this.setting2fa.phone === 0) {
            console.log('已绑定邮箱');
            this.initSafetyVerifyModal();// 初始化 安全验证弹框
            this.switchSafetyVerifyModal(true); // 打开弹框
        } else if (this.setting2fa.email === 0 && this.setting2fa.phone === 1) {
            console.log('已绑定手机');
        } else if (this.setting2fa.email === 1 && this.setting2fa.phone === 1) {
            console.log('已绑定手机和邮箱');
        } else if (this.setting2fa.email === 0 && this.setting2fa.phone === 0) {
            console.log('未绑定手机与邮箱');
        }
    },
    // 绑定谷歌验证
    bindGoogle: function() {
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
            key: 'openBindGoogle',
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
    // 安全验证弹框 初始化
    initSafetyVerifyModal() {
        const params = {
        };
        // 初始化 校验弹框
        validate.activeSmsAndEmail(params, () => {
            alert(666);
            // this.bindEmailApi(); // 绑定邮箱 接口
        });
    },
    // 获取用户信息
    getUserInfo() {
        const that = this;
        Http.getUserInfo().then(function(arg) {
            console.log('nzm', 'getUserInfo success', arg);
            if (arg.result.code === 0) {
                that.loginType = arg.account.loginType; // 账户类型
                that.setting2fa = arg.account.setting2fa; // 账户绑定状态
                m.redraw();
            }
        }).catch(function(err) {
            console.log('nzm', 'getUserInfo error', err);
        });
    },
    initFn: function() {
        this.getUserInfo();
        this.initGeetest();
        this.generateQRCode();
    },
    removeFn: function() {
        broadcast.offMsg({
            key: 'openBindGoogle',
            cmd: 'geetestMsg',
            isall: true
        });
    }
};