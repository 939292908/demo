/*
 * @Author: your name
 * @Date: 2020-08-25 16:34:57
 * @LastEditTime: 2020-08-25 20:20:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \website-project\src\api\index.js
 */
const Conf = require('@/config');
const webApi = require('./webApi');
const wsApi = require('./wsApi').gWsApi;
const { instConf, ActiveLine } = require('./config');
module.exports = {
    ActiveLine,
    Conf,
    webApi, // 页面接口
    wsApi,
    apiLines: instConf
};