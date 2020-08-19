import axios from 'axios';
// import qs from 'qs';
class _axios {
    constructor() {
        this.service = null;
        // 接口请求频次限制集合
        this.requestFilters = {};
        this.initService();
        this.interceptorsRequest();
        this.interceptorsResponse();
    }

    initService() {
        this.service = axios.create({
            baseURL: 'http://192.168.2.89:8888',
            timeout: 30000
        });
    }

    // axios请求拦截
    interceptorsRequest() {
        this.service.interceptors.request.use(config => {
            console.log(config);
            if (window.utils.getItem("ex-session")) {
                config.headers['ex-session'] = window.utils.getItem("ex-session");
            }
            // if (config.method === 'post') {

            // }
            return config;
        }, function (err) {
            return Promise.reject(err);
        });
    }

    // axios响应拦截
    interceptorsResponse() {
        this.service.interceptors.response.use(function (response) {
            if (response.headers['set-exsession']) {
                window.utils.setItem("ex-session", response.headers['set-exsession']);
            }
            if (response.data && response.data.result) {
                return response.data.result;
            }
            return response;
        }, function (error) {
            return Promise.reject(error);
        });
    }

    // 执行请求
    request({ method, url, data, options = {} }) {
        console.log(data);
        const config = Object.assign({
            url: url,
            method: method
        }, options);
        if (method === 'get') {
            config.params = data || {};
        } else if (method === 'post') {
            // 以表单形式上传数据(如图片)
            if (Object.prototype.toString.call(data) === '[object FormData]') {
                config.data = data;
            } else {
                //  try {
                if (JSON.stringify(data) === '{}') {
                    config.data = null;
                } else {
                    config.data = data || null;
                }
                //  }catch (e) {
                //      config.data = null;
                //  }
            }
        }
        return this.service(config);
    }

    /**
     * 竞赛方式请求
     * @param params
     * @returns {Promise<any>}
     */
    racerequest(params) {
        const pool = [];
        for (const url of params) {
            pool.push(this.service.get(url + '?timestamp=' + (new Date()).getTime()));
        }
        return Promise.race(pool);
    }

    // 实例化请求
    static inst() {
        if (!this.instance) {
            this.instance = new this.prototype.constructor();
        }
        return this.instance;
    }

    // get请求
    static get(url, data, options = {}) {
        console.log(data);
        return this.instance.request('get', url, data, options);
    }

    // post请求
    static post(url, data, options = {}) {
        return this.instance.request('post', url, data, options);
    }

    static spread(callback) {
        return axios.spread(callback);
    }

    static all(pool = []) {
        return axios.all(pool);
    }
}
export default _axios;