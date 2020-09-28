/*
 * @Author: your name
 * @Date: 2020-09-24 17:22:54
 * @LastEditTime: 2020-09-24 17:23:29
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \website-project\src\views\page\main\header\header.logic.js
 */
const utils = require('@/util/utils').default;
const globalModels = require('@/models/globalModels');
const { logOut } = require('@/api/').webApi;
const broadcast = require('@/broadcast/broadcast');
const m = require('mithril');
// const I18n = require("@/languages/I18n").default;
const wlt = require('@/models/wlt/wlt');

const header = {
    openNavbarDropdown: false,

    clickNavbarOpenBtn: () => {
        header.openNavbarDropdown = !header.openNavbarDropdown;
    },
    handleChangeWindowTitle: function () {
        // document.title = I18n.$t('10622');
    },
    loginOut: function () {
        logOut().then(res => {
            wlt.walletState = 0;
            wlt.walletEmpty();
            utils.removeItem("ex-session");
            utils.setItem('loginState', false);
            globalModels.setAccount({});
            window.router.checkRoute({ path: m.route.get().split('?')[0] || m.route.get() });
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
