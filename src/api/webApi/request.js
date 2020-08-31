const Axios = require('axios');

const config = require('../config');

const { ActiveLine, APITEXTLIST } = config;
console.log(require('@/models/globalModels'));
const { globalModels } = require('@/models/globalModels');

const utils = require('@/util/utils').default;
const qs = require('qs');

const Http = Axios.create({
    baseURL: ActiveLine.WebAPI,
    timeout: 30000
});

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
    API: APITEXTLIST
};
