/**
 * 远程访问 RpcServer 提供的服务接口。
 */
window.RpcClient = {
/**
 * 调用一个远程服务接口。
 * @param {*} serverId rpc server 的 webview id。
 * @param {*} serviceName 服务接口名称。
 * @param {*} params 服务入口参数。
 * @param {*} callback 回调函数，用于回传服务执行结果。
 */
    invoke: function(serverId, serviceName, params, callback) {
        var me = this;
        var cs = window.plus.webview.getWebviewById(serverId);
        if (!cs) throw new Error('RpcServer view not found: ' + serverId);
        var js = 'RpcServer.invoke(' + JSON.stringify(serviceName);
        js += ',' + JSON.stringify(params);
        if (typeof callback === 'function') {
            js += ',' + JSON.stringify(window.plus.webview.currentWebview().id);
            js += ',' + me.next_callback_id;
            me.callbacks[me.next_callback_id] = callback;
            me.next_callback_id++;
        }
        js += ')';
        cs.evalJS(js);
    },
    next_callback_id: 1,
    callbacks: {},
    callback: function(cbId, ret) {
        const me = this;
        const cb = me.callbacks[cbId];
        if (typeof cb !== 'function') return;
        const und = undefined;
        cb.call(und, ret);
        delete me.callbacks[cbId];
    }
};
