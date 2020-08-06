class broadcast {

    constructor() {
        this.listener = {}
        this.initCmd()
    }

    initCmd(){
        this.IS_LOGON_SUC_UPD = 'is_login_suc_upd'
        this.ONRESIZE_UPD = 'ONRESIZE_UPD'
        this.CHANGE_SW_CURRENCY = 'CHANGE_SW_CURRENCY'

        // 最新行情广播
        this.MSG_TICK_UPD = 'MSG_TICK_UPD'
        // 指数行情广播
        this.MSG_INDEX_UPD = 'MSG_INDEX_UPD'
        // 最新成交行情广播
        this.MSG_TRADE_UPD = 'MSG_TRADE_UPD'
        // k线行情广播
        this.MSG_KLINE_UPD = 'MSG_KLINE_UPD'
        // 20档盘口行情广播
        this.MSG_ORDER20_UPD = 'MSG_ORDER20_UPD'
        // 全档盘口行情广播
        this.MSG_ORDERL2_UPD = 'MSG_ORDERL2_UPD'
    }
    // 发送广播
    emit({ cmd, data }) {

        let listener = this.listener
        for (let key in listener) {
            if(listener[key][cmd]){
                listener[key][cmd](data)
            }
        }
    }
    // 接收广播
    onMsg({ key, cmd, cb }) {
        this.listener[key] = this.listener[key] || {}
        if (this.listener[key][cmd]) {
            delete this.listener[key][cmd]
        }
        this.listener[key][cmd] = cb
    }
    /**
     * 关闭广播
     */
    offMsg({ key, cmd, isall }) {
        this.listener[key] = this.listener[key] || {}
        if (isall) {
            for (let c in this.listener[key]) {
                delete this.listener[key][c]
            }
        } else if (cmd) {
            delete this.listener[key][cmd]
        }
    }

}

export default broadcast