const m = require('mithril');
const Http = require('@/api').webApi;
const utils = require('@/util/utils').default;
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');
const globalModels = require('@/models/globalModels');
const errCode = require('@/util/errCode').default;
const I18n = require('@/languages/I18n').default;
const { gMktApi } = require('@/api/wsApi');

const logic = {
    receiveMoneySum: 0, // 领取总金额
    sendMoneySum: 0, // 发送总金额
    sendMoneySumBack: 0, // 发送退回总金额
    // loading 配置
    loadingOption: {
        isShow: {
            isShow1: false,
            isShow2: false
        }
    },
    // 头部 组件配置
    headerOption: {
        class: "",
        left() {
            return {
                onclick() {
                    window.router.back();
                }
            };
        },
        center() {
            return {
                label: I18n.$t('20036')/* 我的红包 */
            };
        }
    },
    currentNavId: 1,
    navList: [
        {
            id: 1,
            label: I18n.$t('20037')/* 已领取 */,
            class: "mr-7"
        },
        {
            id: 2,
            label: I18n.$t('20038')/* 已发送 */
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
                quota: item.quota // 抢到金额
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
    // 获取领红包累计金额
    getReceiveMoneySum() {
        this.receiveMoneySum = 0; // 清零
        this.receiveRedPacketList.map(item => { // 累加
            this.receiveMoneySum += (wlt.getPrz(item.coin) * item.quota);
        });
        this.receiveMoneySum = utils.toFixedForFloor(this.receiveMoneySum, 4); // 保留小数
        m.redraw();
    },
    // 获取发红包累计金额
    getSendMoneySum() {
        this.sendMoneySum = 0; // 总金额 清零
        this.sendMoneySumBack = 0; // 退回总金额 清零

        this.sendRedPacketList.map(item => { // 累加
            this.sendMoneySum += (wlt.getPrz(item.coin) * item.quota);
            this.sendMoneySumBack += (item.status === 3 ? (wlt.getPrz(item.coin) * item.quota2) : 0);
        });
        this.sendMoneySum = utils.toFixedForFloor(this.sendMoneySum, 4);
        this.sendMoneySumBack = utils.toFixedForFloor(this.sendMoneySumBack, 4); // 保留小数
        m.redraw();
    },
    // 构建已领红包列表
    buildReceiveRedPacketList(list = []) {
        this.receiveRedPacketList = list.map(item => {
            item.time = utils.formatDate(item.rtm, 'yyyy-MM-dd hh:mm'); // 领取时间
            item.rtel_bulid = utils.hideAccountNameInfo(item.rtel); // 领取人手机号
            item.remail_bulid = utils.hideAccountNameInfo(item.remail); // 领取人邮箱
            item.quota = utils.toFixedForFloor(item.quota, 4); // 币金额
            return item;
        });
        // 资产 和 AssetD 都有值
        if (wlt.walletState === 1 && Object.keys(gMktApi.AssetD).length > 0) {
            logic.sumData(); // 求和数据
        }
        m.redraw();
    },
    // 构建已发红包列表
    buildSendRedPacketList(list = []) {
        this.sendRedPacketList = list.map(item => {
            item.time = utils.formatDate(item.ctm, 'yyyy-MM-dd hh:mm'); // 领取时间
            item.quota2 = utils.toFixedForFloor(item.quota2, 4); // 币金额
            return item;
        });
        // 资产 和 AssetD 都有值
        if (wlt.walletState === 1 && Object.keys(gMktApi.AssetD).length > 0) {
            logic.sumData(); // 求和数据
        }
        m.redraw();
    },
    // 获取领取记录
    getrecv() {
        const params = {
            uid: globalModels.getAccount().uid
        };
        logic.loadingOption.isShow.isShow1 = true;
        Http.getrecv(params).then(arg => {
            logic.loadingOption.isShow.isShow1 = false;
            if (arg.result.code === 0) {
                this.buildReceiveRedPacketList(arg.result.data);
                console.log('领取记录 success', arg);
            } else {
                window.$message({
                    content: errCode.getRedPacketErrorCode(arg.result.code),
                    type: 'danger'
                });
            }
        }).catch(function(err) {
            logic.loadingOption.isShow.isShow1 = false;
            console.log('领取记录 error', err);
        });
    },
    // 获取发送记录
    getsendrec() {
        const params = {
            uid: globalModels.getAccount().uid
        };
        logic.loadingOption.isShow.isShow2 = true;
        Http.getsendrec(params).then(arg => {
            logic.loadingOption.isShow.isShow2 = false;
            if (arg.result.code === 0) {
                this.buildSendRedPacketList(arg.result.data);
                console.log('发送记录 success', arg);
            } else {
                window.$message({
                    content: errCode.getRedPacketErrorCode(arg.result.code),
                    type: 'danger'
                });
            }
        }).catch(function(err) {
            logic.loadingOption.isShow.isShow2 = false;
            console.log('发送记录 error', err);
        });
    },
    // 求和数据
    sumData() {
        logic.getReceiveMoneySum(); // 获取领红包累计金额
        logic.getSendMoneySum(); // 获取发红包累计金额
    },
    oninit(vnode) {
        wlt.init();
        // wlt完成 广播
        broadcast.onMsg({
            key: "myRedP_MSG_WLT_READY",
            cmd: broadcast.MSG_WLT_READY,
            cb: () => {
                this.getrecv();// 获取领取记录
                this.getsendrec();// 获取发送记录
                logic.sumData(); // 求和数据
            }
        });
        // 添加ASSETD全局广播，用于资产估值计算
        broadcast.onMsg({
            key: "myRedP_MSG_ASSETD_UPD",
            cmd: broadcast.MSG_ASSETD_UPD,
            cb: function () {
                logic.sumData(); // 求和数据
            }
        });
        // // wlt更新 广播
        // broadcast.onMsg({
        //     key: "myRedP_MSG_WLT_UPD",
        //     cmd: broadcast.MSG_WLT_UPD,
        //     cb: () => {
        //         logic.getReceiveMoneySum(); // 获取领红包累计金额
        //         logic.getSendMoneySum(); // 获取发红包累计金额
        //     }
        // });
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
        wlt.remove();
        broadcast.offMsg({
            key: "myRedP_MSG_WLT_READY",
            cmd: broadcast.MSG_WLT_UPD,
            isall: true
        });
        broadcast.offMsg({
            key: "myRedP_MSG_ASSETD_UPD",
            cmd: broadcast.MSG_ASSETD_UPD,
            isall: true
        });
    }
};

module.exports = logic;