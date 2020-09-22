const m = require('mithril');

const logic = {
    // 头部 组件配置
    headerOption: {
        class: "px-6",
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