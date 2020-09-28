const Http = require('@/api').webApi;
const m = require('mithril');
const md5 = require('md5');
const errCode = require('@/util/errCode').default;
const broadcast = require('@/broadcast/broadcast');
const geetest = require('@/models/validate/geetest').default;
const validate = require('@/models/validate/validate').default;
const I18n = require('@/languages/I18n').default;
const gM = require('@/models/globalModels');
const utils = require('@/util/utils').default;

module.exports = {
    modifyFlag: null, /* 当前是设置密码还是修改密码 */
    nationNo: null, // 区号
    phoneNum: null, // 用户手机号码
    oldFundPwd: null, // 原密码
    newFunPwd: null, // 新密码/资金密码
    confirmFunPwd: null, // 确认密码
    isShowVerifyView: false, // 安全校验弹框 show
    googleId: '', // 谷歌
    switchSafetyVerifyModal (type) { // 安全校验弹框 显示/隐藏
        this.isShowVerifyView = type;
    },
    // 确认按钮事件
    confirmBtn: function() {
        /* console.log(this.oldFundPwd, this.newFunPwd, this.confirmFunPwd); */
        geetest.verify(); // 极验
    },
    // 加载极验
    initGeetest() {
        const that = this;
        geetest.init(() => {
        });
        broadcast.onMsg({
            key: 'modifyFunPwd',
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
        if (!this.googleId && !this.phoneNum) {
            console.log('未绑定手机和谷歌');
            this.setWalletPwd();
            return;
        }
        if (this.googleId && !this.phoneNum) {
            console.log('已绑定谷歌');
            this.initSecurityVerification(1);
        } else if (!this.googleId && this.phoneNum) {
            console.log('已绑定手机');
            this.initSecurityVerification(2);
        } else if (this.googleId && this.phoneNum) {
            console.log('已绑定手机和谷歌');
            this.initSecurityVerification(3);
        }
        this.switchSafetyVerifyModal(true); // 打开弹框
    },
    // 初始化安全验证   typeFlag: 1：谷歌 2：手机 3：谷歌手机双切换验证
    initSecurityVerification: function (typeFlag) {
        const that = this;
        const params = {
            securePhone: that.nationNo + '-' + utils.hideMobileInfo(that.phoneNum),
            areaCode: that.nationNo, // 区号
            phoneNum: that.nationNo + '-' + that.phoneNum, // 手机号
            resetPwd: true, // 是否重置密码
            lang: I18n.getLocale(),
            phone: that.phoneNum,
            mustCheckFn: "" // 验证类型
        };
        if (typeFlag === 1) {
            validate.activeGoogle(function() {
                that.setWalletPwd();
            });
        } else if (typeFlag === 2) {
            validate.activeSms(params, function() {
                that.setWalletPwd();
            });
        } else if (typeFlag === 3) {
            validate.activeSmsAndGoogle(params, function() {
                that.setWalletPwd();
            });
        }
    },
    setWalletPwd() { /* 设置 || 修改密码 */
        const that = this;
        const param = {
            settingType: 12, /* 设置类型，固定值 */
            settingKey: 'ucp', /* 设置类型的key，固定值 */
            settingValue: md5(this.newFunPwd) /* 资金密码，md5加密 */
        };
        if (this.modifyFlag === 1) {
            param.settingValue2 = md5(that.oldFundPwd); /* 老密码，设置资金密码时不需要，修改时需要填写，md5加密 */
        }
        Http.setWalletPwd(param).then(function(arg) {
            console.log('nzm', 'setWalletPwd success', arg);
            if (arg.result.code === 0) {
                console.log('setWalletPwd success');
                window.$message({ content: that.modifyFlag === 0 ? I18n.$t('10601') /* '资金密码设置成功' */ : I18n.$t('10602') /* '资金密码修改成功' */, type: 'success' });
                that.setUserInfo();
            } else {
                window.$message({ content: errCode.getWebApiErrorCode(arg.result.code), type: 'danger' });
            }
            that.switchSafetyVerifyModal(false); // 关闭安全验证弹框
            m.redraw();
        }).catch(function(err) {
            console.log('nzm', 'setWalletPwd error', err);
        });
    },
    // 设置用户信息
    setUserInfo() {
        Http.getUserInfo({}).then(data => {
            if (data.result.code === 0) {
                console.log(data.account);
                gM.setAccount(data.account);
                broadcast.emit({ cmd: broadcast.GET_USER_INFO_READY, data: data.account });
                window.router.push('/securityManage');
            }
        }).catch(err => {
            console.log(err);
        });
    },
    // 获取用户信息
    getUserInfo() {
        const account = gM.getAccount();
        // console.log(account);
        this.loginType = account.loginType; // 账户类型
        this.nationNo = account.nationNo; // 区号
        this.phoneNum = account.phone; // 用户手机号码
        this.googleId = account.googleId; // 谷歌
        m.redraw();
    },
    initFn: function() {
        const that = this;

        this.modifyFlag = Number(window.router.getUrlInfo().params.type);
        this.oldFundPwd = null; // 输入的旧密码初始化
        this.newFunPwd = null; // 输入的新密码初始化
        this.confirmFunPwd = null; // 输入的确认密码初始化

        // 获取用户信息
        broadcast.onMsg({
            key: 'index',
            cmd: broadcast.GET_USER_INFO_READY,
            cb: () => {
                that.getUserInfo();
            }
        });
        this.getUserInfo();
        this.initGeetest();
    },
    removeFn: function() {
        broadcast.offMsg({
            key: 'modifyFunPwd',
            cmd: 'geetestMsg',
            isall: true
        });
        broadcast.offMsg({
            key: 'index',
            isall: true
        });
    }
};
