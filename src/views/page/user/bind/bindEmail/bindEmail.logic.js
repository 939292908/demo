const m = require('mithril');
const geetest = require('@/models/validate/geetest').default;
const broadcast = require('@/broadcast/broadcast');
const Http = require('@/api').webApi;
const config = require('@/config');
const errCode = require('@/util/errCode').default;
const I18n = require('@/languages/I18n').default;
const validate = require('@/models/validate/validate').default;

const model = {
    form: {
        password: "",
        email: ""
    },
    isShowVerifyView: false,
    setVerifyViewModal (type) {
        this.isShowVerifyView = type;
    },
    initVerifyViewModal () {

    },
    onInputPassword(e) {
        this.form.password = e.target.value;
    },
    onInputEmail(e) {
        this.form.email = e.target.value;
    },
    saveClick() {
        // geetest.verify();
        validate.activeEmailAndGoogle({
            secureEmail: "res.email",
            host: config.official,
            fn: 'be',
            lang: I18n.getLocale()
        });
        this.setVerifyViewModal(true);
    },
    // 加载极验
    initGeetest() {
        geetest.init(() => {});
        broadcast.onMsg({
            key: 'bindEmail',
            cmd: 'geetestMsg',
            cb: res => {
                if (res === 'success') {
                    this.queryUserInfo();
                } else {
                    m.redraw();
                }
            }
        });
    },
    // 查询是否注册顾过
    queryUserInfo() {
        Http.queryUserInfo({
            loginType: "email",
            loginName: this.form.email,
            nationNo: '0086',
            exChannel: config.exchId
        }).then(res => {
            if (res.result.code === 0) {
                if (res.exists === 1) {
                    window.$message({ content: I18n.$t('10281'), type: 'danger' }); // 用户已存在
                } else {
                    m.redraw();
                    // 安全验证
                    // alert("安全验证pass");
                    // validate.activeEmailAndGoogle({
                    //     secureEmail: res.email,
                    //     host: config.official,
                    //     fn: 'be',
                    //     lang: I18n.getLocale()
                    // });
                    // this.setVerifyViewModal(true);
                }
            } else {
                window.$message({ content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
            }
        }).catch(() => {
            window.$message({ content: '网络异常，请稍后重试', type: 'danger' });
            m.redraw();
        });
    },
    // 绑定邮箱 接口
    bindEmailApi() {
        const params = {
            opCode: 5, // 绑定类型，固定填5
            opInfo: '354625@qq.com', // 邮箱
            password: '9cbf8a4dcb8e30682b927f352d6559a0' // 用户密码
        };
        Http.bindEmailAuth(params).then(res => {
            console.log("绑定邮箱 接口", res, 6666);
            if (res.result.code === 0) {
                console.log("绑定邮箱 ok", res, 7777);
            } else {
                window.$message({ content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
            }
        }).catch(() => {
            window.$message({ content: '网络异常，请稍后重试', type: 'danger' });
            m.redraw();
        });
    },
    initEVBUS () {
        this.initGeetest();
    },
    rmEVBUS () {
        broadcast.offMsg({
            key: 'bindEmail',
            cmd: 'geetestMsg',
            isall: true
        });
    },
    oninit (vnode) {
        // this.bindEmailApi();
        this.initEVBUS();
    },
    oncreate (vnode) {
    },
    onupdate (vnode) {
    },
    onremove (vnode) {
        this.rmEVBUS();
    }
};

module.exports = model;
