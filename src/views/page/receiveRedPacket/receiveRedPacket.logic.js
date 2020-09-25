const m = require('mithril');
const geetest = require('@/models/validate/geetest').default;
const broadcast = require('@/broadcast/broadcast');
const validate = require('@/models/validate/validate').default;
const utils = require('@/util/utils').default;
const I18n = require('@/languages/I18n').default;
const Http = require('@/api').webApi;

const logic = {
    account: "15155395909", // 邮箱/手机号
    fromName: "", // 发红包人
    redPacketType: 0, // 红包类型 0:拼手气 >0:普通
    redPacketState: 2, // 红包状态 1: 领完了 2: 未领完 3: 已过期
    redPacketDes: "", // 祝福留言
    coin: "", // 红包币种
    quota: "", // 总金额
    quota2: "", // 未领金额
    count: "", // 总红包数量
    count2: "", // 未领红包数量
    timeOver: "", // 抢完用时
    isShowVerifyView: false, // 安全验证 弹框
    // 头部 组件配置
    headerOption: {
        left: {
            label: m('i', { class: `iconfont icon-tianxieshanchu` }),
            onclick() {
                console.log(this.label);
                window.router.back();
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
                this.recvgift(); // 领红包
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
                this.recvgift(); // 领红包
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
    // 领红包 接口
    recvgift() {
        const params = {
            rtype: 3, // '领取方式，1：已注册通过uid领取，2：未注册邮箱领取，3：未注册手机领取,4:注册后领取2,3状态到ruid,5:已失效'
            gid: m.route.param().gid, // 红包id
            ruid: '123', // 领取人uid
            rtel: logic.account, // 电话
            remail: logic.account // 邮箱
        };
        Http.recvgift(params).then(arg => {
            if (arg.data.code === 0) {
                console.log('领取 success', arg.data);
                window.router.push({
                    path: "/receiveRedPacketDetail",
                    data: {
                        gid: arg.data.data.gid, // 红包id
                        best: arg.data.data.best, // 手气最佳(0:否 1:是)
                        quota: arg.data.data.quota // 抢的金额
                    }
                }); // 领取结果页  receiveResult
            }
        }).catch(function(err) {
            console.log('领取 error', err);
        });
    },
    // 红包领取记录 接口
    getgiftrec() {
        const params = {
            gid: m.route.param().gid
        };
        Http.getgiftrec(params).then(arg => {
            console.log(arg.data, 66);
            if (arg.data.code === 0) {
                // 领取列表
                this.redPacketList = arg.data.data.map(item => {
                    item.time = utils.formatDate(item.ctm, 'yyyy-MM-dd hh:mm'); // 领取时间
                    item.phone = utils.hideAccountNameInfo(item.rtel); // 领取人手机号
                    return item;
                });
                m.redraw();
                console.log('领取记录 success', arg.data);
            } else {
                logic.passwordModel.updateErrMsg(arg.data.err_msg);
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
            if (arg.data.code === 0) {
                const data = arg.data.data;
                logic.fromName = data.guid; // 发红包人
                logic.redPacketType = data.type; // 红包类型
                logic.redPacketDes = data.des; // 祝福留言
                logic.coin = data.coin; // 红包币种
                logic.quota = data.quota; // 总金额
                logic.quota2 = data.quota2; // 未领金额
                logic.count = data.count; // 总红包数量
                logic.count2 = data.count2; // 未领红包数量
                logic.timeOver = (data.otm - data.ctm) / 1000 / 60; // 抢完用时
                m.redraw();
                console.log('红包详情 success', arg.data);
            } else {
                logic.passwordModel.updateErrMsg(arg.data.err_msg);
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