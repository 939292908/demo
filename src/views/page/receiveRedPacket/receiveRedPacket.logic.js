const m = require('mithril');
const geetest = require('@/models/validate/geetest').default;
const broadcast = require('@/broadcast/broadcast');

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
    // 抢红包 click
    receiveClick() {
        geetest.verify(() => {});
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
                    window.router.push("/receiveResult"); // 领取结果页
                } else {
                    console.log(res);
                }
            }
        });
    },
    oninit(vnode) {
        this.initGeetest();
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