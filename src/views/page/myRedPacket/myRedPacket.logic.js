// const m = require('mithril');

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
            label: "已发送"
        }
    ],
    // 已抢红包列表
    receiveRedPacketList: [
        {
            phone: "138****000",
            time: "2020/8/21  14:20",
            num: 3,
            coin: "USDT",
            redPacketType: "拼手气红包"
        },
        {
            phone: "138****000",
            time: "2020/7/10  08:10",
            num: 2,
            coin: "USDT",
            redPacketType: "普通红包"
        }
    ],
    // 跳转已领红包详情
    toReceiveRedPacketDetail() {
        window.router.push('/receiveRedPacketDetail');
    },
    // 跳转已发红包详情
    toSendRedPacketDetail() {
        window.router.push('/sendRedPacketDetail');
    },
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