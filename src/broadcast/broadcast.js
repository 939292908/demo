const listenerObj = {};
module.exports = {
    // 获取系统开关
    GET_FUNLIST_READY: 'get_funlist_ready',
    // 获取用户信息
    GET_USER_INFO_READY: 'get_user_info_ready',
    // 退出登录
    MSG_LOG_OUT: 'msg_log_out',
    // 页面大小改变
    ONRESIZE_UPD: 'ONRESIZE_UPD',
    // 合约详情
    MSG_ASSETD_UPD: 'MSG_ASSETD_UPD',
    // 合约详情补充参数
    MSG_ASSETEX_UPD: 'MSG_ASSETEX_UPD',
    // 最新行情广播
    MSG_TICK_UPD: 'MSG_TICK_UPD',
    // 指数行情广播
    MSG_INDEX_UPD: 'MSG_INDEX_UPD',
    // 最新成交行情广播
    MSG_TRADE_UPD: 'MSG_TRADE_UPD',
    // k线行情广播
    MSG_KLINE_UPD: 'MSG_KLINE_UPD',
    // 20档盘口行情广播
    MSG_ORDER20_UPD: 'MSG_ORDER20_UPD',
    // 全档盘口行情广播
    MSG_ORDERL2_UPD: 'MSG_ORDERL2_UPD',
    // 点击body广播
    EV_ClICKBODY: 'EV_ClICKBODY',
    // 资产获取完成
    MSG_WLT_READY: 'MSG_WLT_READY',
    // 资产更新
    MSG_WLT_UPD: 'MSG_WLT_UPD',
    // 资产界面切换估值币种
    CHANGE_SW_CURRENCY: 'CHANGE_SW_CURRENCY',
    // 资产界面切换估值币种
    MSG_LANGUAGE_UPD: 'MSG_LANGUAGE_UPD',
    // 刷新资产记录
    MSG_ASSET_RECORD_UPD: 'MSG_ASSET_RECORD_UPD',
    /**
     * 发送广播
     * @param {string} cmd
     * @param {Object} data
     */
    emit({ cmd, data }) {
        const listener = listenerObj;
        for (const key in listener) {
            if (listener[key][cmd]) {
                listener[key][cmd](data);
            }
        }
    },
    /**
     * 接收广播
     * @param {string} key
     * @param {string} cmd
     * @callback cb
     */
    onMsg({ key, cmd, cb }) {
        listenerObj[key] = listenerObj[key] || {};
        if (listenerObj[key][cmd]) {
            delete listenerObj[key][cmd];
        }
        listenerObj[key][cmd] = cb;
    },

    /**
     * 关闭广播
     * @param {string} key
     * @param {string} cmd
     * @param {boolean} isall
     */
    offMsg({ key, cmd, isall }) {
        listenerObj[key] = listenerObj[key] || {};
        if (isall) {
            for (const c in listenerObj[key]) {
                delete listenerObj[key][c];
            }
        } else if (cmd) {
            delete listenerObj[key][cmd];
        }
    }
};