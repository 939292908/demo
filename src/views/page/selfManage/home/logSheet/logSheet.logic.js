const { webApi } = require('@/api');
const LogSheet = {
    oninit: function () {
        const self = this;
        webApi.getExtListInfo({ infoType: 2 }).then(res => {
            if (res.result.code === 0) {
                res.infos.forEach(item => {
                    const ip = item.strs[1].indexOf('::ffff:') >= 0 ? item.strs[1].split('::ffff:')[1] : item.strs[1];
                    self.getLogInLog(ip);
                });
            }
        });
    },
    getLogInLog: function (ip) {
        webApi.getExtItemInfo({ ip }).then(res => {
            if (res.result.code === 0) {
                console.log(res.result.ipInfo, 'res.result.ipInfo');
            }
        });
    }
};
module.exports = LogSheet;