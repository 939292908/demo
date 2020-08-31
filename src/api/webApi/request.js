const Axios = require('axios');

const config = require('../config');

const { ActiveLine, APITEXTLIST } = config;

const { globalModels } = require('@/models/globalModels').default;

const utils = require('@/util/utils');
const qs = require('qs');

const Http = Axios.create({
    baseURL: ActiveLine.WebAPI,
    timeout: 30000
});

/**
 * 竞赛方式请求
 * @param params
 * @returns {Promise<any>}
 */
const raceRequest = function(params) {
    const pool = [];
    for (const url of params) {
        pool.push(Http.get(url + '?timestamp=' + (new Date()).getTime()));
    }
    if (pool.length > 0) {
        return Promise.race(pool);
    }
};

// axios请求拦截
Http.interceptors.request.use(config => {
    if (utils.getItem("ex-session")) {
        config.headers['ex-session'] = utils.getItem("ex-session");
    }
    if (config.method === 'post') {
        config.data = qs.stringify(config.data);
    }
    return config;
}, function (err) {
    return Promise.reject(err);
});

// axios响应拦截
Http.interceptors.response.use(function (response) {
    if (response.headers['set-exsession']) {
        utils.setItem("ex-session", response.headers['set-exsession']);
    }
    if (response.data.result ? response.data.result.code === 9003 : false) {
        utils.removeItem("ex-session");
        utils.setItem('loginState', false);
        globalModels.setAccount({});
        window.router.push('/login');
    }
    return response.data;
}, function (error) {
    return Promise.reject(error);
});

module.exports = {
    Http,
    API: APITEXTLIST,
    raceRequest
};
