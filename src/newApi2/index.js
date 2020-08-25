const Conf = require('@/config');
const webApi = require('./webApi');
const wsApi = require('./wsApi');
const BaseUrl = require('./config').BaseUrl;
module.exports = {
    BaseUrl,
    Conf,
    webApi,
    wsApi
};