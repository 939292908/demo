const m = require('mithril');
const geetest = require('@/models/validate/geetest').default;
const broadcast = require('@/broadcast/broadcast');

const model = {
    form: {
        passworld: "",
        email: ""
    },
    onInputPassword(e) {
        this.form.passworld = e.target.value;
    },
    onInputEmail(e) {
        this.form.email = e.target.value;
    },
    /**
     * 加载极验
     */
    initGeetest() {
        const self = this;
        geetest.init(() => {});
        broadcast.onMsg({
            key: 'bindEmail',
            cmd: 'geetestMsg',
            cb: res => {
                if (res === 'success') {
                    self.queryUserInfo();
                } else {
                    self.loading = false;
                    m.redraw();
                }
            }
        });
    },
    initEVBUS () {
        this.initGeetest();
    },
    rmEVBUS () {
        broadcast.offMsg({
            key: 'bindEmail',
            cmd: 'geetestMsg',
            isall: true
        });
    },
    oninit (vnode) {
        this.initEVBUS();
    },
    oncreate (vnode) {
    },
    onupdate (vnode) {
    },
    onremove (vnode) {
        this.rmEVBUS();
    }
};

module.exports = model;
