// 路由接收参数
// gid, // 红包id
// best, // 手气最佳(0:否 1:是)
// quota // 抢的金额
// status // 红包状态

const m = require('mithril');
const Http = require('@/api').webApi;
const redPacketUtils = require('@/util/redPacketUtils').default;

const logic = {
    // isLucky: true, // 是否是手气最佳
    // 已抢红包列表
    redPacketList: [],
    // 头部 组件配置
    headerOption: {
        left: {
            label: m('i', { class: `iconfont icon-close` }),
            onclick() {
                window.router.back();
            }
        },
        center: {
            label: "抢红包"
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
    // 领取记录 接口
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
                logic.redPacketTopOption = JSON.parse(JSON.stringify(data)); // 红包top 组件配置
                logic.redPacketTopOption.quota = m.route.param().quota; // 自定义金额(当前抢到)
                switch (m.route.param().status * 1) {
                case 0:
                    logic.redPacketTopOption.msg = "已存入钱包账户，可直接提现、交易"; // msg
                    break;

                case 1:
                    logic.redPacketTopOption.msg = "很遗憾，红包已抢完"; // msg
                    break;

                case 2:
                    logic.redPacketTopOption.msg = "很遗憾，红包已过期"; // msg
                    break;

                default:
                    break;
                }
                logic.redPacketInfoOption = JSON.parse(JSON.stringify(data)); // 红包Info 组件配置
                m.redraw();
                console.log('红包详情 success', arg);
            }
        }).catch(function(err) {
            console.log('红包详情 error', err);
        });
    },
    oninit(vnode) {
        this.getdetails();// 红包详情
        this.getgiftrec();// 领取记录
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
    }
};

module.exports = logic;