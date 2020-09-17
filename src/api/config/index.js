const APITEXTLIST = require('./apiText');
const BaseConf = require('./apiConf').default;

const instConf = new BaseConf(process.env.BUILD_ENV);
instConf.updateNetLines();

const ActiveLine = instConf.GetActive();

module.exports = {
    APITEXTLIST,
    ActiveLine,
    instConf
};