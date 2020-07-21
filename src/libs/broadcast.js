class broadcast {

    constructor() {
        this.listener = {}
        this.initCmd()
    }

    initCmd(){
        this.IS_LOGON_SUC_UPD = 'is_login_suc_upd'
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