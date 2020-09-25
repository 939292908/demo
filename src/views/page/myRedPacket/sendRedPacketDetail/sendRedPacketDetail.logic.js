const Http = require('@/api').webApi;
const m = require('mithril');
const { default: utils } = require('../../../../util/utils');

const logic = {
    redPacketType: 0, // 红包类型 0:拼手气 >0:普通
    redPacketState: 2, // 红包状态 1: 领完了 2: 未领完 3: 已过期
    redPacketDes: "", // 祝福留言
    coin: "", // 红包币种
    quota: "", // 总金额
    quota2: "", // 未领金额
    count: "", // 总红包数量
    count2: "", // 未领红包数量
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
    // 已抢红包列表
    redPacketList: [],
    // 红包已领取记录 接口
    getgiftrec() {
        const params = {
            gid: m.route.param().gid
        };
        Http.getgiftrec(params).then(arg => {
            if (arg.data.code === 0) {
                this.redPacketList = arg.data.data.map(item => {
                    item.phone = utils.hideAccountNameInfo(item.rtel); // 隐藏手机号
                    item.time = utils.formatDate(item.rtm, 'yyyy-MM-dd hh:mm'); // 领取时间
                    return item;
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
                logic.redPacketType = arg.data.data.type; // 红包类型
                logic.redPacketDes = arg.data.data.des; // 祝福留言
                logic.coin = arg.data.data.coin; // 红包币种
                logic.quota = arg.data.data.quota; // 总金额
                logic.quota2 = arg.data.data.quota2; // 未领金额
                logic.count = arg.data.data.count; // 总红包数量
                logic.count2 = arg.data.data.count2; // 未领红包数量
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