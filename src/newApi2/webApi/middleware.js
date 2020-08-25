const Axios = require('./request').default;

const config = require('../config');

const { BaseUrl, APITEXTLIST } = config;

const Http = new Axios(BaseUrl.WebAPI).service;

module.exports = {
    Http,
    APITEXTLIST
};
