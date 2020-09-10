const broadcast = require('@/broadcast/broadcast');
const globalModels = require('@/models/globalModels');
const { webApi } = require('@/api');

const UserIndo = {
    name: 'selfManageUser',
    info: {}, // 身份信息
    ExtList: [], // 最近登录ip
    getExtList: function () {
        const self = this;
        webApi.getExtListInfo({ infoType: 2 }).then(res => {
            if (res.result.code === 0) {
                self.ExtList = res.infos;
            }
        });
    },
    oninit: function () {
        const self = this;
        self.info = globalModels.getAccount();
        self.getExtList();
        if (Object.keys(self.info).length < 1) {
            broadcast.onMsg({
                key: this.name,
                cmd: broadcast.GET_USER_INFO_READY,
                cb: (data) => { self.info = data; }
            });
        }
    },
    onremove: function () {
        broadcast.offMsg({
            key: this.name,
            cmd: broadcast.GET_USER_INFO_READY,
            isall: true
        });
    }
};

module.exports = UserIndo;
