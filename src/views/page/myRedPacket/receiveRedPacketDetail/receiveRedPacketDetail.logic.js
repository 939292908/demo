const m = require('mithril');
const Qrcode = require('qrcode');

const logic = {
    // 红包详情分享 弹框
    isShowShareDetailModal: true,
    // 是否是手气最佳
    isLucky: false,
    // 二维码链接
    ewmLink: "www.baidu.com",
    // 二维码img
    ewmImg: "",
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
                // 生成二维码
                Qrcode.toDataURL(logic.ewmLink || '无').then(url => {
                    logic.ewmImg = url;
                }).catch(err => {
                    console.log(err);
                });
                logic.isShowShareDetailModal = true;
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