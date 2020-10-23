// const broadcast = require('@/broadcast/broadcast');
var m = require("mithril");

const logic = {
    loading: false,
    setLoading(type) {
        logic.loading = type;
    },
    oninit(vnode) {
        window.$loading = function (type) {
            logic.loading = type;
            m.redraw();
        };
        console.log(window, 777777777);
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
    }
};

module.exports = logic;
