// const m = require('mithril');

const logic = {
    // 头部 组件配置
    headerOption: {
        class: "px-6",
        left: {
            onclick() {
                console.log(this.label);
            }
        },
        center: {
            label: "我的红包"
        }
    },
    currentNavId: 1,
    navList: [
        {
            id: 1,
            label: "已领取",
            class: "mr-7"
        },
        {
            id: 2,
            label: "已领取"
        }
    ],
    // 已抢红包列表
    receiveRedPacketList: [
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