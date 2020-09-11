const ActiveLine = require('../config').ActiveLine;
const WSApi = require('./Mkt');
const config = require('../../config.js');
const broadcast = require('@/broadcast/broadcast.js');

const Interval = process.env.BUILD_ENV === 'prod' ? 50 : 1000;
const gMktApi = new WSApi({
    baseUrl: ActiveLine.WSMKT,
    Typ: 'mkt',
    vp: config.exchId
});
setInterval(function () {
    gMktApi.stately.do(gMktApi);
}, Interval);

const gTrdApi = new WSApi();

setInterval(function () {
    gTrdApi.stately.do(gTrdApi);
}, Interval);

// 监听登录广播，并执行登录操作
broadcast.onMsg({
    key: 'wsApi',
    cmd: broadcast.GET_USER_INFO_READY,
    cb: arg => {
        gTrdApi.Conf = {
            baseUrl: ActiveLine.WSTRD,
            Typ: 'trd',
            vp: config.exchId,
            UserName: arg.accountName,
            AuthType: 2,
            UserCred: arg.token
        };
    }
});
// 监听退出登录广播，并退出交易服务器
broadcast.onMsg({
    key: 'wsApi',
    cmd: broadcast.MSG_LOG_OUT,
    cb: arg => {
        console.log('wsApi MSG_LOG_OUT');
        gTrdApi.Conf = null;
        gTrdApi.wsClose(gTrdApi);
    }
});

module.exports = {
    gMktApi,
    gTrdApi
};