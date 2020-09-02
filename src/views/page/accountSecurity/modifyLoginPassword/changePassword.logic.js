const m = require('mithril');
const md5 = require('md5');
const Http = require('@/api').webApi;
const config = require('@/config');
const errCode = require('@/util/errCode').default;
const geetest = require('@/models/validate/geetest').default;
const broadcast = require('@/broadcast/broadcast');

const model = {
    password: "", // 用户老密码
    Passwd1: "", // 新密码
    Passwd2: "", // 确认密码
    initGeetestonclick: function () {
        geetest.verify();
    },
    /**
 * 加载极验
 */
    initGeetest() {
        const self = this;
        geetest.init(() => { });
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
    submitReset() {
        this.loading = true;
        m.redraw();
        Http.resetPassword({
            password: md5(this.password),
            Passwd1: md5(this.Passwd1),
            Passwd2: md5(this.Passwd2),
            exChannel: config.exchId
        }).then(res => {
            console.log(res, 11);
            m.redraw();
            if (res.result.code === 0) {
                // '您的密码已修改成功，现在为您跳转登录界面'
                window.$message({
                    content: '修改成功',
                    type: 'success'
                });
                window.router.push('/login');
            } else {
                window.$message({
                    content: errCode.getWebApiErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        }).catch(() => {
            this.loading = false;
            m.redraw();
        });
    },
    oninit(vnode) {
        this.initGeetest();
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
    }
};
module.exports = model;