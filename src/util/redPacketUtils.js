// const redPacketUtils = {};
const utils = require('@/util/utils').default;
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');
const ActiveLine = require('@/api').ActiveLine;
const I18n = require('@/languages/I18n').default;
const cryptoChar = require('@/util/cryptoChar');
const globalModels = require('@/models/globalModels');

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
                        item.build_remail = utils.hideAccountNameInfo(item.remail); // 领取人邮箱 **隐藏
                        item.build_rmb = utils.toFixedForFloor((wlt.getPrz(item.coin) * item.quota) * wlt.prz, 2); // 人民币
                        item.quota = utils.toFixedForFloor(item.quota, 4); // 币金额
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
    },
    // 获取注册地址 uid （邀请码）
    getRegisterUrl(uid = globalModels.getAccount().uid || '') {
        if (uid) {
            uid = cryptoChar.encrypt(uid);
        }
        return window.location.origin + '/m/register/#/?r=' + uid;
    },
    // 获取红包领完用时
    getEndTime(time) {
        // const s = 2 * 60 * 60 + 5 * 60 + 40;
        const s = time / 1000;
        // 秒
        if (s < 60) {
            return utils.toFixedForFloor(s, 0) + I18n.$t('20122')/* 秒 */;
        }
        // 分钟
        if (s >= 60 && s < 3600) {
            const m = s / 60;
            return utils.toFixedForFloor(m, 0) + I18n.$t('20123')/* 分钟 */;
        }
        // 时 / 分钟
        if (s >= 3600) {
            const h = s / 3600;
            const m = (s % 3600) / 60;
            if (m >= 1) {
                return utils.toFixedForFloor(h, 0) + I18n.$t('20124')/* 小时 */ + utils.toFixedForFloor(m, 0) + I18n.$t('20123')/* 分钟 */;
            } else {
                return utils.toFixedForFloor(h, 0) + I18n.$t('20124')/* 小时 */;
            }
        }
    }
};
export default redPacketUtils;