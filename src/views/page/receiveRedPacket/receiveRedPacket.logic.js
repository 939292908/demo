const m = require('mithril');
const geetest = require('@/models/validate/geetest').default;
const broadcast = require('@/broadcast/broadcast');
const validate = require('@/models/validate/validate').default;
const utils = require('@/util/utils').default;
const I18n = require('@/languages/I18n').default;

const logic = {
    account: "15155395909", // 邮箱/手机号
    isShowVerifyView: false, // 安全验证 弹框
    // 头部 组件配置
    headerOption: {
        left: {
            label: m('i', { class: `iconfont icon-tianxieshanchu` }),
            onclick() {
                console.log(this.label);
            }
        }
    },
    // 已抢红包列表
    redPacketList: [
        {
            phone: "138****000",
            time: "2020/8/21  14:20",
            num: 3,
            coin: "USDT"
        },
        {
            phone: "138****000",
            time: "2020/7/10  08:10",
            num: 2,
            coin: "USDT"
        }
    ],
    // 获取安全验证type
    getVerifyType() {
        if (/@/.test(this.account)) {
            return 'email';
        } else {
            return 'phone';
        }
    },
    // 抢红包 click
    receiveClick() {
        geetest.verify(() => {});
    },
    // 初始化安全验证
    initVerifyView() {
        // 手机
        if (logic.getVerifyType() === "phone") {
            const params = {
                securePhone: "0086" + '-' + utils.hideMobileInfo(logic.account), // 隐藏中间数字
                areaCode: "0086", // 区号
                phoneNum: "0086" + '-' + logic.account, // 手机号
                resetPwd: true, // 是否重置密码
                lang: I18n.getLocale(),
                phone: logic.account,
                mustCheckFn: "" // 验证类型
            };
            validate.activeSms(params, () => {
                console.log("successPhone");
                logic.isShowVerifyView = false; // 关闭安全校验弹框
                window.router.push("/receiveResult"); // 领取结果页
            });
        // 邮箱
        } else if (logic.getVerifyType() === "email") {
            const params = {
                secureEmail: logic.account,
                host: "www.baidu.com",
                fn: 'be',
                lang: I18n.getLocale()
            };
            validate.activeEmail(params, function() {
                console.log("successEmail");
                logic.isShowVerifyView = false; // 关闭安全校验弹框
                window.router.push("/receiveResult"); // 领取结果页
            });
        }
        // 更新组件
        broadcast.emit({ cmd: "redrawValidate" });
    },
    // 初始化极验
    initGeetest() {
        geetest.init(() => {});
        broadcast.onMsg({
            key: 'receiveRedPaclet',
            cmd: 'geetestMsg',
            cb: res => {
                m.redraw();
                if (res === 'success') {
                    // 初始化安全验证
                    logic.initVerifyView();
                    // 显示弹框
                    logic.isShowVerifyView = true;
                } else {
                    console.log(res);
                }
            }
        });
    },
    oninit(vnode) {
        this.initGeetest();
        logic.initVerifyView(); // ---------- 测试 ----------
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
        broadcast.offMsg({ key: 'receiveRedPaclet', isall: true });
    }
};

module.exports = logic;