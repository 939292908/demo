const m = require('mithril');
const Http = require('@/api').webApi;
const utils = require('@/util/utils').default;
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');
const globalModels = require('@/models/globalModels');

const logic = {
    receiveMoneySum: 0, // 领取总金额
    sendMoneySum: 0, // 发送总金额
    sendMoneySumBack: 0, // 发送退回总金额
    // 头部 组件配置
    headerOption: {
        class: "",
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
    // 已领红包列表
    receiveRedPacketList: [],
    // 已发红包列表
    sendRedPacketList: [],
    // 跳转已领红包详情
    toReceiveRedPacketDetail(item) {
        window.router.push({
            path: "/receiveRedPacketDetail",
            data: {
                gid: item.gid, // 红包id
                best: item.best, // 手气最佳(0:否 1:是)
                quota: item.quota // 抢的金额
            }
        });
    },
    // 跳转已发红包详情
    toSendRedPacketDetail(item) {
        window.router.push({
            path: "/sendRedPacketDetail",
            data: {
                gid: item.gid // 红包id
            }
        });
    },
    // 构建已领红包列表
    buildReceiveRedPacketList(list = []) {
        this.receiveMoneySum = 0; // 计算领取总金额

        this.receiveRedPacketList = list.map(item => {
            this.receiveMoneySum += (wlt.getPrz(item.coin) * item.quota); // 计算领取总金额
            item.time = utils.formatDate(item.rtm, 'yyyy-MM-dd hh:mm'); // 领取时间
            item.phone = utils.hideAccountNameInfo(item.rtel); // 领取人手机号
            return item;
        });

        this.receiveMoneySum = utils.toFixedForFloor(this.receiveMoneySum, 4);
        m.redraw();
    },
    // 构建已发红包列表
    buildSendRedPacketList(list = []) {
        this.sendMoneySum = 0; // 发送总金额
        this.sendMoneySumBack = 0; // 发送退回总金额

        this.sendRedPacketList = list.map(item => {
            this.sendMoneySum += (wlt.getPrz(item.coin) * item.quota); // 发送总金额
            this.sendMoneySumBack += item.status === 2 ? (wlt.getPrz(item.coin) * item.quota2) : 0; // 发送退回总金额
            item.time = utils.formatDate(item.ctm, 'yyyy-MM-dd hh:mm'); // 领取时间
            return item;
        });

        this.sendMoneySum = utils.toFixedForFloor(this.sendMoneySum, 4);
        this.sendMoneySumBack = utils.toFixedForFloor(this.sendMoneySumBack, 4);
        m.redraw();
    },
    // 获取领取记录
    getrecv() {
        const params = {
            uid: globalModels.getAccount().uid
        };
        Http.getrecv(params).then(arg => {
            if (arg.code === 0) {
                this.buildReceiveRedPacketList(arg.data);
                console.log('领取记录 success', arg);
            }
        }).catch(function(err) {
            console.log('领取记录 error', err);
        });
    },
    // 获取发送记录
    getsendrec() {
        const params = {
            uid: globalModels.getAccount().uid
        };
        Http.getsendrec(params).then(arg => {
            console.log(arg, 999999999);
            if (arg.code === 0) {
                this.buildSendRedPacketList(arg.data);
                console.log('发送记录 success', arg);
            }
        }).catch(function(err) {
            console.log('发送记录 error', err);
        });
    },
    oninit(vnode) {
        wlt.init();
        broadcast.onMsg({
            key: "myRedP",
            cmd: broadcast.MSG_WLT_READY,
            cb: () => {
                this.getrecv();// 获取领取记录
                this.getsendrec();// 获取发送记录
            }
        });
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
        wlt.remove();
        broadcast.offMsg({
            key: "myRedP",
            cmd: broadcast.MSG_WLT_READY,
            isall: true
        });
    }
};

module.exports = logic;