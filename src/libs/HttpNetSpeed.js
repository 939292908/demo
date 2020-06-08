import axios from 'axios';
import NetSpeedBase from './NetSpeedBase';

/**
 * 测试交易服务器
 */
class HttpNetSpeed extends NetSpeedBase {
    constructor(props = {}) {
        super(props);
        this.url = props.node + '/httpstat/ty';
        this.startTime = 0;
        this.promise = null;
    }

    test() {
        this.promise = new Promise((resolve, reject) => {
            this.startTime = (new Date()).getTime();
            this.instance.get(this.url
            ).then(res => {
                console.log("request 数据已接收...: ", this.name);
                this.duration =Math.floor(((new Date()).getTime() - this.startTime) / 2);
                resolve(this);

            }).catch(err => {
                console.error("request 连接失败: ", this.name, err);
                this.duration = Number.MAX_SAFE_INTEGER;
                reject(this);
            });

        });
        return this.promise;
    }

    /**
     * 取消测试
     */
    cancel() {

    }

    get instance() {
        if (!HttpNetSpeed.instanceAxios) {
            HttpNetSpeed.instanceAxios = axios.create();
            HttpNetSpeed.instanceAxios.defaults.baseURL = null;
            HttpNetSpeed.instanceAxios.defaults.withCredentials = false;
            HttpNetSpeed.instanceAxios.defaults.timeout = 1000 * 5;
            HttpNetSpeed.instanceAxios.defaults.retryDelay = 0;
            HttpNetSpeed.instanceAxios.defaults.retry = 0;
        }
        return HttpNetSpeed.instanceAxios;
    }

}

HttpNetSpeed.instanceAxios = null;

export default HttpNetSpeed;
