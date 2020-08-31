const m = require('mithril');
const geetest = require('@/models/validate/geetest').default;
const broadcast = require('@/broadcast/broadcast');
const Http = require('@/api').webApi;
const config = require('@/config');

const model = {
    form: {
        password: "",
        email: ""
    },
    onInputPassword(e) {
        this.form.password = e.target.value;
    },
    onInputEmail(e) {
        this.form.email = e.target.value;
    },
    saveClick() {
        geetest.verify();
    },
    // 加载极验
    initGeetest() {
        geetest.init(() => {});
        broadcast.onMsg({
            key: 'bindEmail',
            cmd: 'geetestMsg',
            cb: res => {
                if (res === 'success') {
                    // alert(66);
                } else {
                    m.redraw();
                }
            }
        });
    },
    // 查询是否注册顾过
    queryUserInfo() {
        const self = this;
        Http.queryUserInfo({
            loginType: "email",
            loginName: this.form.email,
            nationNo: '0086',
            exChannel: config.exchId
        }).then(res => {
            this.loading = false;
            if (res.result.code === 0) {
                if (res.exists === 1) {
                    window.$message({ content: I18n.$t('10281'), type: 'danger' }); // 用户已存在
                } else {
                    self.isvalidate = true;
                    m.redraw();
                    if (self.type === "phone") {
                        self.registerPhoneFn(self);
                    } else if (this.type === "email") {
                        self.registerEmailFn(self);
                    }
                }
            } else {
                window.$message({ content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
            }
        }).catch(() => {
            window.$message({ content: '网络异常，请稍后重试', type: 'danger' });
            self.loading = false;
            m.redraw();
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
