const utils = require('@/util/utils').default;
const globalModels = require('@/models/globalModels');
const { logOut } = require('@/api/').webApi;
const broadcast = require('@/broadcast/broadcast');
const m = require('mithril');
const wlt = require('@/models/wlt/wlt');

const header = {
    openNavbarDropdown: false,

    clickNavbarOpenBtn: () => {
        header.openNavbarDropdown = !header.openNavbarDropdown;
    },
    loginOut: function () {
        logOut().then(res => {
            wlt.walletState = 0;
            wlt.walletEmpty();
            utils.removeItem("ex-session");
            utils.setItem('loginState', false);
            globalModels.setAccount({});

            window.router.checkRoute({ path: window.router.path });
            broadcast.emit({
                cmd: broadcast.MSG_LOG_OUT,
                data: {
                    cmd: broadcast.MSG_LOG_OUT
                }
            });
            m.redraw();
        }, err => {
            console.log(err);
        }).catch(err => {
            console.log(err);
        });
    }
};

module.exports = header;