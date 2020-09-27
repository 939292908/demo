require('./lib/rpc-server.js');
require('./lib/rpc-client.js');

module.exports = {
    init: function() {
        this.subMsg();
        // this.subTick({
        //     key: 'init',
        //     tickList: ['tick_BTC.USDT@26', 'kline_BTC.USDT@26', 'trade_BTC.USDT@26', 'order20_BTC.USDT@26', 'orderl2_BTC.USDT@26', 'index_CI_BTC', 'tick_ETH.USDT@26', 'tick_EOS.USDT@26', "tick_M53L/USDT@30", "tick_M53S/USDT@30",
        //         "tick_BTC3L/USDT@30",
        //         "tick_BTC3S/USDT@30",
        //         "tick_ETH3L/USDT@30",
        //         "tick_BTC/USDT",
        //         "tick_ETH3S/USDT@30",
        //         "tick_BCH3L/USDT@30",
        //         "tick_BCH3S/USDT@30",
        //         "tick_EOS3L/USDT@30",
        //         "tick_MIKASA/USDT@30",
        //         "tick_EOS3S/USDT@30",
        //         "tick_LTC3L/USDT@30",
        //         "tick_LTC3S/USDT@30",
        //         "tick_EOS/BTC@30",
        //         "tick_EOS/USDT",
        //         "tick_XRP/USDT",
        //         "tick_EOS/ETH@30",
        //         "tick_QIYOU/USDT@30"]
        // });
    },
    // 订阅主webview的消息
    subMsg: function() {
        console.log('应用首页webview id', window.plus.webview.getLaunchWebview().id);
        // 通过 RpcClient.invoke() 调用另一个 WebView 中的服务函数
        window.RpcClient.invoke(window.plus.webview.getLaunchWebview().id, 'rpc-sub-message', {
            wvId: window.plus.webview.currentWebview().id
        }, function(resp) {
            // resp 是服务执行结果
            console.log('invoke demo-rpc-server demo-rpc-service', JSON.stringify(resp));
        });
        // 当前webview提供一个服务函数，用于接收主webview发送来的消息
        window.RpcServer.expose('rpc-on-message', function(params, finish) {
            console.log('rpc-on-message', params);
            finish('is ok');
        });
    },
    // 订阅行情
    marketRequest: function(param) {
        const wvId = window.plus.webview.currentWebview().id;
        console.log('invoke req marketRequest', param);
        window.RpcClient.invoke(window.plus.webview.getLaunchWebview().id, 'rpc-market-requset', {
            wvId: wvId,
            Api: param.Api,
            data: param.data
        }, function(resp) {
            // resp 是服务执行结果
            console.log('invoke rpc-market-requset', JSON.stringify(resp));
            param.cb(resp);
        });
    },
    tradeRequest: function(param) {
        const wvId = window.plus.webview.currentWebview().id;
        console.log('invoke req tradeRequest', param);
        window.RpcClient.invoke(window.plus.webview.getLaunchWebview().id, 'rpc-trade-requset', {
            wvId: wvId,
            Api: param.Api,
            data: param.data
        }, function(resp) {
            // resp 是服务执行结果
            console.log('invoke rpc-trade-requset', JSON.stringify(resp));
            param.cb(resp);
        });
    }
};