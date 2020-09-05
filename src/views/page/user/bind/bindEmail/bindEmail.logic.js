const m = require('mithril');
const md5 = require('md5');
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
    // 安全校验弹框 show
    isShowVerifyView: false,
    // 安全校验弹框 显示/隐藏
    switchSafetyVerifyModal (type) {
        this.isShowVerifyView = type;
    },
    // 密码 input
    onInputPassword(e) {
        this.form.password = e.target.value;
    },
    // 邮箱 input
    onInputEmail(e) {
        this.form.email = e.target.value;
    },
    // 保存按钮 事件
    saveClick() {
        geetest.verify();
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
    // 查询是否注册过
    queryUserInfo() {
        const params = {
            loginType: "email",
            loginName: this.form.email,
            nationNo: '0086',
            exChannel: config.exchId
        };
        Http.queryUserInfo(params).then(res => {
            if (res.result.code === 0) {
                if (res.exists === 1) {
                    window.$message({ content: I18n.$t('10443'), type: 'danger' }); // 用户已存在
                } else {
                    m.redraw();
                    this.initSafetyVerifyModal();// 初始化 安全验证弹框
                    this.switchSafetyVerifyModal(true); // 打开弹框
                }
            } else {
                window.$message({ content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
            }
        }).catch(() => {
            window.$message({ content: '网络异常，请稍后重试', type: 'danger' });
            m.redraw();
        });
    },
    // 安全验证弹框 初始化
    initSafetyVerifyModal() {
        const params = {
            secureEmail: model.form.email,
            host: config.official,
            fn: 'be',
            lang: I18n.getLocale()
        };
        // 初始化 校验弹框
        validate.activeEmailAndGoogle(params, () => {
            alert(666);
            this.bindEmailApi(); // 绑定邮箱 接口
        });
    },
    // 绑定邮箱 接口
    bindEmailApi() {
        const params = {
            opCode: 5, // 绑定类型，固定填5
            opInfo: model.form.email, // 邮箱
            password: md5(model.form.password) // 用户密码
        };
        Http.bindEmailAuth(params).then(res => {
            console.log("绑定邮箱 接口", res, 6666);
            if (res.result.code === 0) {
                console.log("绑定邮箱 ok", res, 7777);
                this.switchSafetyVerifyModal(false); // 关闭安全验证弹框
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
        // this.initGeetest();
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
