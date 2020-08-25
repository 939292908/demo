const APITEXTLIST = require('./apiText');
const BaseConf = require('./apiConf').default;

const instConf = new BaseConf(process.env.BUILD_ENV);
instConf.updateNetLines();

const BaseUrl = instConf.GetActive();

module.exports = {
    APITEXTLIST,
    BaseUrl
};