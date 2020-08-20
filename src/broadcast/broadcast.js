var listenerObj = {};
export default {
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