const wlt = require('@/models/wlt/wlt');

module.exports = {
    model: {
        showMenu: false,
        dropdownActive: "",
        wallet: wlt.wallet
    },
    oninit(vnode) {
        wlt.init();
    },
    oncreate(vnode) {
        console.log(wlt.wallet, 888);
    },
    onupdate(vnode) {
        // console.log(wlt.wallet, 666);
    },
    onremove(vnode) {
        wlt.remove();
    }
};