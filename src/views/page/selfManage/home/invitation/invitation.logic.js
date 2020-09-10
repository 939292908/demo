const m = require('mithril');
const qrcode = require('qrcode');
const broadcast = require('@/broadcast/broadcast');
const globalModels = require('@/models/globalModels');
const crypto = require('@/libs/crypto');
const { ActiveLine } = require('@/api');
const invitation = {
    qrCodeBase64: '',
    invitationCode: '',
    getUserUid: function (data) {
        invitation.info = data;
        invitation.invitationCode = crypto.encrypt(invitation.info?.uid);
        invitation.getBase64Img();
    },
    getBase64Img: function () {
        const self = this;
        qrcode.toDataURL(`${ActiveLine.INVITE}/m/register/#/?r=${invitation.invitationCode}`, { margin: 0 }).then(res => {
            self.qrCodeBase64 = res;
            m.redraw();
        });
    },
    oninit: function () {
        const self = this;
        if (Object.keys(globalModels.getAccount()).length < 1) {
            broadcast.onMsg({
                key: this.name,
                cmd: broadcast.GET_USER_INFO_READY,
                cb: self.getUserUid
            });
        } else {
            self.getUserUid(globalModels.getAccount());
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
module.exports = invitation;