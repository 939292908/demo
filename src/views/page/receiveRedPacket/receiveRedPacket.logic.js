const m = require('mithril');
const geetest = require('@/models/validate/geetest').default;
const broadcast = require('@/broadcast/broadcast');
const validate = require('@/models/validate/validate').default;
const utils = require('@/util/utils').default;
const I18n = require('@/languages/I18n').default;
const Http = require('@/api').webApi;
const redPacketUtils = require('@/util/redPacketUtils').default;
const config = require('@/config.js');
const globalModels = require('@/models/globalModels');
const regExp = require('@/models/validate/regExp');

const logic = {
    account: "", // 邮箱/手机号
    errText: "", // 错误提示
    isShowVerifyView: false, // 安全验证 弹框
    // 头部 组件配置
    headerOption: {
        left: {
            label: m('i', { class: `iconfont icon-tianxieshanchu` }),
            onclick() {
                window.router.back();
            }
        }
    },
    // 红包top 组件配置
    redPacketTopOption: {
        hiddenLine: true
        // guid: "", // 来源 (空为自己)
        // type: "", // 红包类型 type 0:为拼手气 / >0:普通红包
        // des: "", // 留言
        // quota: "", // 金额
        // coin: "", // 币种
        // msg: "" // 提示消息 (空为没有)
        // msg2: "" // 提示消息 (空为没有)
    },
    // 红包info 组件配置
    redPacketInfoOption: {
        // status: "", // 状态：0待领取，1已领完，2红包到期
        // count: "", // 总数
        // count2: "", // 未领数
        // quota: "", // 总额
        // quota2: "", // 未领额
        // coin: "" // 币种
    },
    // 输入账户input
    numberOnInput(e) {
        logic.account = e.target.value;
        logic.errText = regExp.validAccount(true, logic.account); // 错误提示
    },
    // 已抢红包列表
    redPacketList: [],
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
                // resetPwd: true, // 是否重置密码
                lang: I18n.getLocale(),
                phone: logic.account,
                mustCheckFn: "" // 验证类型
            };
            validate.activeSms(params, () => {
                console.log("successPhone");
                this.recvgift();// 领红包
                // this.queryUserInfo();
                // this.bindgift(); // 绑红包
            });
        // 邮箱
        } else if (logic.getVerifyType() === "email") {
            const params = {
                secureEmail: logic.account,
                host: "www.baidu.com",
                fn: 'be',
                lang: I18n.getLocale()
            };
            validate.activeEmail(params, () => {
                console.log("successEmail");
                this.recvgift(); // 领红包
                // this.queryUserInfo();
                // this.bindgift(); // 绑红包
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
    // 查询账号是否注册
    queryUserInfo() {
        const params = {
            loginType: logic.getVerifyType(), // 账户类型
            loginName: logic.account, // 用户名
            nationNo: '0086', // 电话号码区号
            exChannel: config.exchId // 渠道号
        };
        Http.queryUserInfo(params).then(arg => {
            if (arg.result.code === 0) {
                if (arg.exists === 1) { // 已存在
                    this.recvgift();// 领红包
                }
                if (arg.exists === 2) { // 不存在
                    // this.bindgift();// 绑红包
                    this.recvgift();// 绑红包
                }
                console.log('查询账号是否注册 success', arg);
            } else {
                window.$message({ content: '查询账号是否注册失败', type: 'danger' });
            }
        }).catch(function(err) {
            console.log('查询账号是否注册 error', err);
        });
    },
    // 领红包 接口
    recvgift() {
        logic.isShowVerifyView = false; // 关闭安全校验弹框
        const params = {
            gid: m.route.param().gid // 红包id
        };
        if (logic.getVerifyType() === "phone") {
            params.rtel = logic.account; // 电话
        }
        if (logic.getVerifyType() === "email") {
            params.remail = logic.account; // 邮箱
        }

        Http.recvgift(params).then(arg => {
            if (arg.code === 0) {
                console.log('领取 success', arg);
                window.router.push({
                    path: "/receiveResult", // 跳转抢红包结果
                    data: {
                        gid: arg.data.gid, // 红包id
                        best: arg.data.best, // 手气最佳(0:否 1:是)
                        quota: arg.data.quota, // 抢的金额
                        status: arg.data.status // 红包状态
                    }
                }); // 领取结果页  receiveResult
            } else {
                window.$message({ content: '领取失败', type: 'danger' });
            }
        }).catch(function(err) {
            console.log('领取 error', err);
        });
    },
    // 绑红包 接口
    bindgift() {
        // const that = this;
        const params = {
            uid: globalModels.getAccount().uid,
            tel: logic.account, // 电话
            email: logic.account // 邮箱
        };
        Http.bindgift(params).then(function(arg) {
            console.log('绑红包 success', arg);
        }).catch(function(err) {
            console.log('绑红包 error', err);
        });
    },
    // 红包领取记录 接口
    getgiftrec() {
        const params = {
            gid: m.route.param().gid
        };
        Http.getgiftrec(params).then(arg => {
            if (arg.code === 0) {
                // 领取记录列表
                redPacketUtils.buildGiftrecData(arg.data).then(data => {
                    logic.redPacketList = data;
                    m.redraw();
                });
                console.log('领取记录 success', arg);
            } else {
                logic.passwordModel.updateErrMsg(arg.err_msg);
            }
        }).catch(function(err) {
            console.log('领取记录 error', err);
        });
    },
    // 红包详情 接口
    getdetails() {
        const params = {
            gid: m.route.param().gid
        };
        Http.getdetails(params).then(function(arg) {
            if (arg.code === 0) {
                const data = arg.data;
                // 红包头部 组件配置
                logic.redPacketTopOption = JSON.parse(JSON.stringify(data));
                logic.redPacketTopOption.msg2 = "您有机会获得"; // msg2
                logic.redPacketTopOption.hiddenLine = true; // 隐藏底部线条
                // 红包Info 组件配置
                logic.redPacketInfoOption = JSON.parse(JSON.stringify(data));
                m.redraw();
                console.log('红包详情 success', arg);
            } else {
                logic.passwordModel.updateErrMsg(arg.err_msg);
            }
        }).catch(function(err) {
            console.log('红包详情 error', err);
        });
    },
    oninit(vnode) {
        this.initGeetest(); // 极验
        this.getdetails(); // 红包详情
        this.getgiftrec(); // 红包领取记录
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