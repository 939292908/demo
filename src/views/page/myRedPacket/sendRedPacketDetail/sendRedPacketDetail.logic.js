const Http = require('@/api').webApi;
const m = require('mithril');
const redPacketUtils = require('@/util/redPacketUtils').default;

const logic = {
    // 头部 组件配置
    headerOption: {
        left: {
            onclick() {
                window.router.back();
            }
        },
        center: {
            label: "详情记录"
        }
    },
    // 红包top 组件配置
    redPacketTopOption: {
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
    // 已抢红包列表
    redPacketList: [],
    // 红包已领取记录 接口
    getgiftrec() {
        const params = {
            gid: m.route.param().gid
        };
        Http.getgiftrec(params).then(arg => {
            if (arg.data.code === 0) {
                redPacketUtils.buildGiftrecData(arg.data.data).then(data => {
                    logic.redPacketList = data;
                    m.redraw();
                });
                m.redraw();
                console.log('红包已领取记录 success', arg.data);
            } else {
                logic.passwordModel.updateErrMsg(arg.data.err_msg);
            }
        }).catch(function(err) {
            console.log('红包已领取记录 error', err);
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
                // 红包top 组件配置
                logic.redPacketTopOption = JSON.parse(JSON.stringify(data));
                logic.redPacketTopOption.guid = ""; // 红包来源 空为自己
                logic.redPacketTopOption.msg = logic.redPacketTopOption.status * 1 === 2 ? "红包已过期" : ""; // msg
                // 红包Info 组件配置
                logic.redPacketInfoOption = JSON.parse(JSON.stringify(data));
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
        this.getgiftrec(); // 红包已领取记录
        this.getdetails(); // 红包详情
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
    }
};

module.exports = logic;