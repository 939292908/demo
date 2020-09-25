const m = require('mithril');
const Http = require('@/api').webApi;
const utils = require('@/util/utils').default;
const wlt = require('@/models/wlt/wlt');

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
    // 已发红包列表
    sendRedPacketList: [],
    // 跳转已领红包详情
    toReceiveRedPacketDetail(gid) {
        window.router.push({
            path: "/receiveRedPacketDetail",
            data: {
                gid: gid
            }
        });
    },
    // 跳转已发红包详情
    toSendRedPacketDetail(gid) {
        window.router.push({
            path: "/sendRedPacketDetail",
            data: {
                gid: gid
            }
        });
    },
    // 构建已领红包列表
    buildReceiveRedPacketList(list = []) {
        this.receiveRedPacketList = list.map(item => {
            item.time = utils.formatDate(item.ctm, 'yyyy-MM-dd hh:mm'); // 领取时间
            item.phone = utils.hideAccountNameInfo(item.rtel); // 领取人手机号
            return item;
        });
        m.redraw();
    },
    // 构建已发红包列表
    buildSendRedPacketList(list = []) {
        this.sendRedPacketList = list.map(item => {
            return {
                gid: item.gid,
                time: utils.formatDate(item.ctm, 'yyyy-MM-dd hh:mm'), // "2020/8/21  14:20",
                quota: item.quota,
                coin: item.coin,
                redPacketType: item.type,
                status: item.status
            };
        });
        m.redraw();
    },
    // 获取领取记录
    getrecv() {
        const params = {
            uid: '123'
        };
        Http.getrecv(params).then(arg => {
            if (arg.data.code === 0) {
                this.buildReceiveRedPacketList(arg.data.data);
                console.log('领取记录 success', arg.data);
            }
        }).catch(function(err) {
            console.log('领取记录 error', err);
        });
    },
    // 获取发送记录
    getsendrec() {
        const params = {
            uid: '123'
        };
        Http.getsendrec(params).then(arg => {
            if (arg.data.code === 0) {
                this.buildSendRedPacketList(arg.data.data);
                console.log('发送记录 success', arg.data);
            }
        }).catch(function(err) {
            console.log('发送记录 error', err);
        });
    },
    oninit(vnode) {
        this.getrecv();
        this.getsendrec();
        console.log(wlt, 666666);
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
    }
};

module.exports = logic;