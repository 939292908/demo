const m = require('mithril');
const md5 = require('md5');
const Http = require('@/api').webApi;
const config = require('@/config');
const errCode = require('@/util/errCode').default;

const model = {
    password1: "",
    password2: "",
    password3: "",
    submitReset() {
        this.loading = true;
        m.redraw();
        Http.resetPassword({
            Passwd1: md5(this.password1),
            Passwd2: md5(this.password2),
            exChannel: config.exchId
        }).then(res => {
            this.loading = false;
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
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
    }
};
module.exports = model;