const m = require('mithril');
const UserInfo = require('@/models/globalModels');
const broadcast = require('@/broadcast/broadcast');
const { webApi } = require('@/api');
const MainData = {
    name: 'mainlogic',
    user: {},
    moneyPasswordIsExist: false,
    handleUserCanAction: function (item) {
        MainData.user = item;
        m.redraw();
    },
    getFlishCodeIsExist: function () {
        const self = this;
        webApi.getWalletPwdStatus({ settingType: 13, settingKey: 'ucp' }).then(res => {
            if (res.result.code === 0) {
                self.moneyPasswordIsExist = res?.settingValue === '*';
                m.redraw();
            }
        });
    },
    oninit: function () {
        const self = this;
        self.getFlishCodeIsExist();
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