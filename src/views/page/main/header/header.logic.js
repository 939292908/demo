const utils = require('@/util/utils').default;
const globalModels = require('@/models/globalModels');
const { logOut } = require('@/api/').webApi;
const broadcast = require('@/broadcast/broadcast');
const m = require('mithril');

const header = {
    openNavbarDropdown: false,

    clickNavbarOpenBtn: () => {
        header.openNavbarDropdown = !header.openNavbarDropdown;
    },
    loginOut: function () {
        logOut().then(res => {
            utils.removeItem("ex-session");
            utils.setItem('loginState', false);
            globalModels.setAccount({});

            window.router.checkRoute(window.router.path);
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