const m = require('mithril');

const logic = {
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
        },
        right: {
            label: m('i', { class: `iconfont icon-otc-editName` }),
            onclick() {
                console.log("分享");
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
    oninit(vnode) {
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
    }
};

module.exports = logic;