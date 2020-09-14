const broadcast = require('@/broadcast/broadcast');
const globalModels = require('@/models/globalModels');
const { webApi } = require('@/api');

const UserIndo = {
    name: 'selfManageUser',
    info: {}, // 身份信息
    ExtList: [], // 最近登录ip
    getExtList: function (item) {
        const self = this;
        self.info = item;
        webApi.getExtListInfo({ infoType: 2 }).then(res => {
            if (res.result.code === 0) {
                self.ExtList = res.infos;
            }
            console.log(self.info, 'qwofbqwfjqnfo');
        });
    },
    oninit: function () {
        const self = this;
        self.getExtList(globalModels.getAccount());
        if (Object.keys(self.info).length < 1) {
            broadcast.onMsg({
                key: this.name,
                cmd: broadcast.GET_USER_INFO_READY,
                cb: self.getExtList.bind(this)
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
