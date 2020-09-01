// let NetSpeedBase = require('./NetSpeedBase');
import NetSpeedBase from './NetSpeedBase';

/**
 * 测试交易服务器
 */
class TradeNetSpeed extends NetSpeedBase {
    constructor(props = {}) {
        super(props);
        this.ws = null;
        this.url = props.trade;// open后服务端主动关闭
        // this.url = props.trade;//前端主动关闭
        this.startTime = 0;
        this.promise = null;
    }

    test() {
        this.promise = new Promise((resolve, reject) => {
            this.ws = new WebSocket(this.url);
            this.ws.onopen = evt => {
                // console.log("WebSocket连接成功...", this.name);
                // console.log("WebSocket 数据发送中...", this.name);
                this.startTime = (new Date()).getTime();
                evt.target.send('{"req":"Time","rid":"0","args":1588696922662,"expires":1588696953162}');
                // this.duration = (new Date()).getTime() - this.startTime;
                // evt.target.close();
            };

            this.ws.onmessage = evt => {
                // console.log("WebSocket 数据已接收...: ", this.name);
                this.duration = (new Date()).getTime() - this.startTime;
                evt.target.close();
            };

            this.ws.onclose = evt => {
                // console.log("WebSocket连接已关闭...", this.name);
                if (this.duration === -1) {
                    // 未收到消息时任何一方主动关闭链接视为失败
                    this.duration = Number.MAX_SAFE_INTEGER;
                    reject(evt);
                    return;
                }
                this.ws = null;
                resolve(this);
            };

            this.ws.onerror = evt => {
                window.console.log("WebSocket连接错误: ", this.name, evt);
                this.duration = Number.MAX_SAFE_INTEGER;
                reject(evt);
            };
        });

        return this.promise;
    }

    /**
     * 取消测试
     */
    cancel() {
        if (this.ws) {
            // console.log('WebSocket取消中... ', this.name, this.ws.readyState);
            try {
                this.ws.close();
            } catch (err) {
                console.log('close ws error: ', err);
            }
        }
    }
}

export default TradeNetSpeed;
