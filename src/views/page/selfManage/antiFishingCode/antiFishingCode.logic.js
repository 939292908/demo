const Http = require('@/api').webApi;
const m = require('mithril');
const errCode = require('@/util/errCode').default;
const broadcast = require('@/broadcast/broadcast');
const geetest = require('@/models/validate/geetest').default;
const validate = require('@/models/validate/validate').default;
const I18n = require('@/languages/I18n').default;
const gM = require('@/models/globalModels');

module.exports = {
    antiFishCodeFlag: null, /* 当前是设置钓鱼码还是修改钓鱼码 */
    setting2fa: null, // 账户绑定状态
    nationNo: null, // 区号
    phoneNum: null, // 用户手机号码
    antiFishingCodeValue: '', // 防钓鱼码值
    newAntiFishingCodeValue: '', // 新防钓鱼码值
    isShowVerifyView: false, // 安全校验弹框 show
    switchSafetyVerifyModal (type) { // 安全校验弹框 显示/隐藏
        this.isShowVerifyView = type;
    },
    // 确认按钮事件
    confirmBtn: function() {
        /* console.log(this.oldFundPwd, this.newFunPwd, this.confirmFunPwd); */
        /* console.log(this.loginType, this.setting2fa, this.nationNo, this.phoneNum); */
        geetest.verify(); // 极验
    },
    // 加载极验
    initGeetest() {
        const that = this;
        geetest.init(() => {
        });
        broadcast.onMsg({
            key: 'antiFishingCode',
            cmd: 'geetestMsg',
            cb: res => {
                if (res === 'success') {
                    // 成功则进入安全验证
                    console.log('success initGeetest');
                    m.redraw();
                    that.ChooseVerify();
                } else {
                    console.log('error initGeetest');
                }
            }
        });
    },
    // 选择验证方式
    ChooseVerify: function () {
        // console.log(this.setting2fa);
        if (this.setting2fa.google === 0 && this.setting2fa.phone === 0) {
            console.log('未绑定手机与谷歌');
            return;
        }
        if (this.setting2fa.google === 1 && this.setting2fa.phone === 0) {
            console.log('已绑定谷歌');
            this.initSecurityVerification(1);
        } else if (this.setting2fa.google === 0 && this.setting2fa.phone === 1) {
            console.log('已绑定手机');
            this.initSecurityVerification(2);
        } else if (this.setting2fa.google === 1 && this.setting2fa.phone === 1) {
            console.log('已绑定手机和谷歌');
            this.initSecurityVerification(3);
        }
        this.switchSafetyVerifyModal(true); // 打开弹框
    },
    // 初始化安全验证   typeFlag: 1：谷歌 2：手机 3：谷歌手机双切换验证
    initSecurityVerification: function (typeFlag) {
        const that = this;
        let params = null;
        if (typeFlag === 1) {
            validate.activeGoogle(function() {
                that.setFishCode();
            });
        } else if (typeFlag === 2) {
            params = {
                areaCode: that.nationNo, // 区号
                phoneNum: that.nationNo + '-' + that.phoneNum, // 手机号
                resetPwd: true, // 是否重置密码
                lang: I18n.getLocale(),
                phone: that.phoneNum,
                mustCheckFn: "" // 验证类型
            };
            validate.activeSms(params, function() {
                that.setFishCode();
            });
        } else if (typeFlag === 3) {
            params = {
                smsConfig: {
                    areaCode: that.nationNo, // 区号
                    phoneNum: that.nationNo + '-' + that.phoneNum, // 手机号
                    resetPwd: true, // 是否重置密码
                    lang: I18n.getLocale(),
                    phone: that.phoneNum,
                    mustCheckFn: "" // 验证类型
                }
            };
            validate.activeSmsAndGoogle(params, function() {
                that.setFishCode();
            });
        }
        // console.log(params, 777777);
    },
    setFishCode() { /* 设置 || 修改防钓鱼码 */
        const that = this;
        Http.setFishCode({
            settingType: 3, /* 设置类型，固定值 */
            settingValue: that.antiFishingCodeValue /* 需要设置的防钓鱼码 */
        }).then(function(arg) {
            console.log('nzm', 'setFishCode success', arg);
            if (arg.result.code === 0) {
                console.log('setFishCode success');
                window.$message({ content: this.modifyFlag === 0 ? '防钓鱼码设置成功' : '防钓鱼码修改成功', type: 'success' });
                that.setUserInfo();
                window.router.push('/securityManage');
            } else {
                window.$message({ content: errCode.getWebApiErrorCode(arg.result.code), type: 'danger' });
            }
            that.switchSafetyVerifyModal(false); // 关闭安全验证弹框
            m.redraw();
        }).catch(function(err) {
            console.log('nzm', 'setFishCode error', err);
        });
    },
    // 设置用户信息
    setUserInfo() {
        Http.getUserInfo({}).then(data => {
            if (data.result.code === 0) {
                console.log(data.account);
                gM.setAccount(data.account);
                broadcast.emit({ cmd: broadcast.GET_USER_INFO_READY, data: data.account });
            }
        }).catch(err => {
            console.log(err);
            window.$message({
                content: `网络异常，请稍后重试`,
                type: 'danger'
            });
        });
    },
    // 获取用户信息
    getUserInfo() {
        const account = gM.getAccount();
        m.redraw();
        // console.log(account, 11111111111111);
        this.loginType = account.loginType; // 账户类型
        this.setting2fa = account.setting2fa; // 账户绑定状态
        this.nationNo = account.nationNo; // 区号
        this.phoneNum = account.phone; // 用户手机号码
        this.antiFishCodeFlag = account.antiFishCode; // 防钓鱼码
        if (this.antiFishCodeFlag !== undefined) {
            this.antiFishCodeFlag = this.antiFishCodeFlag.substring(0, 2) + this.antiFishCodeFlag.substring(2).replace(/./g, '*');
        }
    },
    initFn: function() {
        this.antiFishingCodeValue = '';// 初始化输入框
        this.newAntiFishingCodeValue = '';// 初始化输入框
        this.antiFishCodeFlag = null;// 初始化
        const that = this;
        // 获取用户信息
        broadcast.onMsg({
            key: 'index',
            cmd: broadcast.GET_USER_INFO_READY,
            cb: (arg) => {
                that.getUserInfo();
            }
        });
        this.getUserInfo();
        this.initGeetest();
    },
    removeFn: function() {
        broadcast.offMsg({
            key: 'antiFishingCode',
            cmd: 'geetestMsg',
            isall: true
        });
        broadcast.offMsg({
            key: 'index',
            cmd: broadcast.GET_USER_INFO_READY,
            isall: true
        });
    }
};
