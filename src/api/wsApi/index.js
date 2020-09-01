const ActiveLine = require('../config').ActiveLine;
const WSApi = require('./Mkt');

const Interval = process.env.BUILD_ENV === 'prod' ? 50 : 1000;
const gWsApi = new WSApi({
    baseUrl: ActiveLine.WSMKT,
    Typ: 'mkt'
});
setInterval(function () {
    gWsApi.stately.do(gWsApi);
}, Interval);

module.exports = {
    gWsApi
};