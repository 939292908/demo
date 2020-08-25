/*
 * @Author: your name
 * @Date: 2020-08-25 16:34:57
 * @LastEditTime: 2020-08-25 19:26:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \website-project\src\newApi2\index.js
 */
const Conf = require('@/config');
const webApi = require('./webApi');
const wsApi = require('./wsApi').gWsApi;
const BaseUrl = require('./config').BaseUrl;
module.exports = {
    BaseUrl,
    Conf,
    webApi,
    wsApi
};