const m = require('mithril');
const UserInfo = require('@/models/globalModels');
const broadcast = require('@/broadcast/broadcast');
const MainData = {
    name: 'mainlogic',
    user: {},
    handleUserCanAction: function (item) {
        console.log(item, 99999);
        MainData.user = item;
        m.redraw();
    },
    oninit: function () {
        const self = this;
        if (Object.keys(UserInfo.getAccount()).length > 0) {
            self.handleUserCanAction(UserInfo.getAccount());
        } else {
            broadcast.onMsg({
                key: this.name,
                cmd: broadcast.GET_USER_INFO_READY,
                cb: self.handleUserCanAction
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
module.exports = MainData;