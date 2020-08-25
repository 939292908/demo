const BaseUrl = require('../config').BaseUrl;
const WSApi = require('./Mkt');

const Interval = 1000;
const gWsApi = new WSApi({
    baseUrl: BaseUrl.WSMKT,
    Typ: 'mkt'
});
setInterval(function () {
    gWsApi.stately.do(gWsApi);
}, Interval);

module.exports = {
    gWsApi
};