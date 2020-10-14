const m = require("mithril");
const utils = require('@/util/utils.js').default;

require('./message.css');
const l180n = require('@/languages/I18n').default;

// const Table = require('@/pages/components/common/Table.js');
// const market = require('@/models/market/market');

const msg = {
    DBG_MESSAGE: true,
    DEL_INTERVAL: 5 * 1000,
    messageContent: [],
    initMsg: function() {
        // 全局message事件
        const that = this;
        window.$message = function({ title = l180n.$t('10410'), content = '', type = 'dark' }) {
            if (that.DBG_MESSAGE) { console.log('MSG', __filename, "MESSAGE", { title, content }); }
            that.addMessageDom({ title, content, type });
        };
    },
    addMessageDom: function (arg) {
        const that = this;
        const msg = this.createMsg(arg);
        window.console.log('MSG', msg);
        msg.delTimer = setTimeout(function () {
            that.delMsg(msg.key);
        }, that.DEL_INTERVAL);
        this.messageContent.push(msg);
        if (this.messageContent.length > 3) {
            const needDelMsgArr = this.messageContent.slice(0, -3);
            for (let i = 0; i < needDelMsgArr.length; i++) {
                const item = needDelMsgArr[i];
                this.delMsg(item.key);
            }
        }
        m.redraw();
    },
    createMsg: function ({ title, content, type }) {
        const that = this;
        const tm = Date.now();
        if (utils.isMobile()) {
            return m('article', { class: "message border-radius-none ", key: tm }, [
                m('div', { class: "message-header has-bg-level-2 has-line-level-2 border-radius-none" }, [
                    m('div', { class: "message-content has-text-centered " + (type === "danger" ? " has-text-tip-error" : " has-text-tip-success") }, [
                        m('div', { class: `pb-3` }, content),
                        m('div', { class: `message-line has-border-bottom-2 has-line-level-2` })
                    ])
                    // m('button', {
                    //     class: "delete",
                    //     "aria-label": "delete",
                    //     onclick: function () {
                    //         that.delMsg(tm);
                    //     }
                    // })
                ])
            ]);
        } else {
            return m('article', { class: "message ", key: tm }, [
                m('div', { class: "message-header has-bg-level-2" }, [
                    m('p', { class: "message-content has-text-centered " + (type === "danger" ? " has-text-tip-error" : " has-text-tip-success") }, [
                        title
                    ]),
                    m('button', {
                        class: "delete",
                        "aria-label": "delete",
                        onclick: function () {
                            that.delMsg(tm);
                        }
                    })
                ]),
                m('div', { class: "message-body" }, [
                    content
                ])
            ]);
        }
    },
    delMsg: function (key) {
        const i = this.messageContent.findIndex(item => {
            return item.key === key;
        });
        if (i > -1) {
            if (this.messageContent[i].delTimer) {
                clearTimeout(this.messageContent[i].delTimer);
            }
            this.messageContent.splice(i, 1);
        }
        m.redraw();
    }
};
module.exports = {
    oninit: function (vnode) {

    },
    oncreate: function (vnode) {
        msg.initMsg();
    },
    view: function (vnode) {
        return m('div', { class: "window-message-box ma-6" }, msg.messageContent);
    },
    onremove: function () {
    }
};