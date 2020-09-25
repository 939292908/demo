const Http = require('@/api').webApi;
const m = require('mithril');

const logic = {
    redPacketState: 2, // 红包状态 1: 领完了 2: 未领完 3: 已过期
    // 头部 组件配置
    headerOption: {
        class: "px-6",
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
    redPacketList: [
        {
            phone: "138****000",
            time: "2020/8/21  14:20",
            num: 3,
            coin: "USDT"
        },
        {
            phone: "138****000",
            time: "2020/8/21  14:20",
            num: 3,
            coin: "USDT"
        },
        {
            phone: "138****000",
            time: "2020/8/21  14:20",
            num: 3,
            coin: "USDT"
        },
        {
            phone: "138****000",
            time: "2020/8/21  14:20",
            num: 3,
            coin: "USDT"
        },
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
    // 红包详情接口
    getgiftrec() {
        const params = {
            gid: m.route.param().gid
        };
        Http.getgiftrec(params).then(function(arg) {
            if (arg.data.code === 0) {
                m.redraw();
                console.log('红包详情接口 success', arg.data);
            } else {
                logic.passwordModel.updateErrMsg(arg.data.err_msg);
            }
        }).catch(function(err) {
            console.log('红包详情接口 error', err);
        });
    },
    oninit(vnode) {
        this.getgiftrec();
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
    }
};

module.exports = logic;