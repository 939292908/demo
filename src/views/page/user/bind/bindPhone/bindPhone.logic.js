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
    // 表单
    form: {
        password: "",
        phone: "",
        areaCode: ""
    },
    // 地区列表
    selectList: [],
    // show弹框
    isShowVerifyView: false,
    // 设置弹框 show
    switchSafetyVerifyModal (type) {
        this.isShowVerifyView = type;
    },
    // 密码 input
    onInputPassword(e) {
        this.form.password = e.target.value;
    },
    // 手机号 input
    onInputPhone(e) {
        this.form.phone = e.target.value;
    },
    // 保存按钮 事件
    saveClick() {
        geetest.verify();
    },
    // 加载极验
    initGeetest() {
        geetest.init(() => {});
        broadcast.onMsg({
            key: 'bindPhone',
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
    // 获取区号列表
    getCountryList() {
        Http.getCountryList({}).then(res => {
            if (res.result.code === 0) {
                this.selectList = res.result.data;
                m.redraw();
            }
        });
    },
    // 查询是否注册顾过
    queryUserInfo() {
        Http.queryUserInfo({
            loginType: "phone",
            loginName: this.form.phone,
            nationNo: '00' + this.form.areaCode,
            exChannel: config.exchId
        }).then(res => {
            if (res.result.code === 0) {
                if (res.exists === 1) {
                    window.$message({ content: I18n.$t('10443'), type: 'danger' }); // 用户已存在
                } else {
                    m.redraw();
                    this.initSafetyVerifyModal(); // 初始化 安全验证弹框
                    this.switchSafetyVerifyModal(true); // 打开 安全验证弹框
                }
            } else {
                window.$message({ content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
            }
        }).catch(() => {
            window.$message({ content: I18n.$t('10340')/* '网络异常，请稍后重试' */, type: 'danger' });
            m.redraw();
        });
    },
    // 安全验证弹框 初始化
    initSafetyVerifyModal() {
        const params = {
            securePhone: 123,
            resetPwd: true,
            areaCode: '00' + this.areaCode,
            phone: 456,
            lang: I18n.getLocale()
        };
        // 初始化 校验弹框
        validate.activeSmsAndGoogle(params, () => {
            alert(777);
            this.bindPhoneApi(); // 绑定邮箱 接口
        });
    },
    // 绑定手机 接口
    bindPhoneApi() {
        const params = {
            opCode: 1, // 绑定类型，固定填1
            opInfo: this.form.phone, // 手机号
            password: md5(this.form.password), // 用户密码
            phoneNation: '00' + this.form.areaCode // 区号
        };
        Http.bindPhoneAuth(params).then(res => {
            console.log("绑定手机 接口", res, 6666);
            if (res.result.code === 0) {
                console.log("绑定手机 ok", res, 7777);
                this.switchSafetyVerifyModal(false);
            } else {
                window.$message({ content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
            }
        }).catch(() => {
            window.$message({ content: I18n.$t('10340')/* '网络异常，请稍后重试' */, type: 'danger' });
            m.redraw();
        });
    },
    initEVBUS () {
        this.initGeetest();
    },
    rmEVBUS () {
        broadcast.offMsg({
            key: 'bindPhone',
            cmd: 'geetestMsg',
            isall: true
        });
    },
    oninit (vnode) {
        this.initEVBUS();
        this.getCountryList(); // 初始化 地区列表
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
