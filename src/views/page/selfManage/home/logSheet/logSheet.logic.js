const { webApi } = require('@/api');
const errCode = require('@/util/errCode').default;
const LogSheet = {
    logList: [],
    oninit: function () {
        const self = this;
        webApi.getExtListInfo({ infoType: 2 }).then(res => {
            if (res.result.code === 0) {
                res.infos.forEach((item, index) => {
                    const ip = item.strs[1].indexOf('::ffff:') >= 0 ? item.strs[1].split('::ffff:')[1] : item.strs[1];
                    self.logList.push({ ip, time: item.strs[0] });
                    if (index < 2) self.getLogInLog(ip, index);
                });
            } else {
                window.$message({ content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
            }
        });
    },
    getLogInLog: function (ip, index) {
        const self = this;
        webApi.getExtItemInfo({ ip }).then(res => {
            if (res.result.code === 0) {
                self.logList[index].country = res.result.inInfo?.country;
                self.logList[index].regionName = res.result.inInfo?.regionName;
            }
        });
    }
};
module.exports = LogSheet;