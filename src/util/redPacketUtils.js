// const redPacketUtils = {};
const utils = require('@/util/utils').default;
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');
const ActiveLine = require('@/api').ActiveLine;
const redPacketUtils = {
    // 构建红包领取记录 接口返回的数据
    buildGiftrecData(list) {
        // 初始化
        wlt.init();
        const prom = new Promise((resolve, reject) => {
            // 注册广播
            broadcast.onMsg({
                key: "buildGiftrecData",
                cmd: broadcast.MSG_WLT_READY,
                cb: () => {
                    const newData = list.map(item => {
                        item.build_rtm = utils.formatDate(item.rtm, 'yyyy-MM-dd hh:mm'); // 领取时间 格式化
                        item.build_ftm = utils.formatDate(item.ftm, 'yyyy-MM-dd hh:mm'); // 失效时间 格式化
                        item.build_rtel = utils.hideAccountNameInfo(item.rtel); // 领取人手机号 **隐藏
                        item.build_rmb = (wlt.getPrz(item.coin) * item.quota) * wlt.prz; // 人民币
                        return item;
                    });
                    resolve(newData);
                    // 关闭广播
                    broadcast.offMsg({
                        key: "buildGiftrecData",
                        cmd: broadcast.MSG_WLT_READY,
                        isall: true
                    });
                }
            });
        });
        return prom;
    },
    // 获取下载app地址
    getDownloadAppUrl() {
        return ActiveLine.INVITE + "/m/#/downloadApp";
    }
};
// // 构建红包领取记录 接口返回的数据
// redPacketUtils.buildGiftrecData = function(list) {
//     // 初始化
//     wlt.init();
//     const prom = new Promise((resolve, reject) => {
//         // 注册广播
//         broadcast.onMsg({
//             key: "buildGiftrecData",
//             cmd: broadcast.MSG_WLT_READY,
//             cb: () => {
//                 const newData = list.map(item => {
//                     item.build_rtm = utils.formatDate(item.rtm, 'yyyy-MM-dd hh:mm'); // 领取时间 格式化
//                     item.build_ftm = utils.formatDate(item.ftm, 'yyyy-MM-dd hh:mm'); // 失效时间 格式化
//                     item.build_rtel = utils.hideAccountNameInfo(item.rtel); // 领取人手机号 **隐藏
//                     item.build_rmb = (wlt.getPrz(item.coin) * item.quota) * wlt.prz; // 人民币
//                     return item;
//                 });
//                 resolve(newData);
//                 // 关闭广播
//                 broadcast.offMsg({
//                     key: "buildGiftrecData",
//                     cmd: broadcast.MSG_WLT_READY,
//                     isall: true
//                 });
//             }
//         });
//     });
//     return prom;
// };

// // 获取下载app地址
// redPacketUtils.getDownloadAppUrl = function () {
//     return ActiveLine.INVITE + "/m/#/downloadApp";
// };
export default redPacketUtils;