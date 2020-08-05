var m = require("mithril")

let msg = {
    messageContent: [],
    initEVBUS: function () {
        let that = this

        if (this.EV_MESSAGE_UPD_unbinder) {
            this.EV_MESSAGE_UPD_unbinder()
        }
        this.EV_MESSAGE_UPD_unbinder = window.gEVBUS.on(window.EV_MESSAGE_UPD, arg => {
            that.addMessageDom(arg)
        })
    },
    rmEVBUS: function () {
        let that = this

        if (this.EV_MESSAGE_UPD_unbinder) {
            this.EV_MESSAGE_UPD_unbinder()
        }
    },
    addMessageDom: function (arg) {
        let that = this;
        let msg = this.createMsg(arg.data)
        msg.delTimer = setTimeout(function () {
            that.delMsg(msg.key)
        }, arg.DEL_INTERVAL)
        this.messageContent.push(msg)
        if (this.messageContent.length > 3) {
            let needDelMsgArr = this.messageContent.slice(0, -3)
            for (let i = 0; i < needDelMsgArr.length; i++) {
                let item = needDelMsgArr[i]
                this.delMsg(item.key)
            }
        }
    },
    createMsg: function ({ title, content, type }) {
        let that = this
        let tm = Date.now()
        if(window.isMobile){
            return m('article', { class: "message box " + (' is-' + type), key: tm }, [
                m('div', { class: "message-header" }, [
                    m('p', { class: "" }, [
                        content
                    ]),
                    m('button', {
                        class: "delete", "aria-label": "delete", onclick: function () {
                            that.delMsg(tm)
                        }
                    })
                ])
            ])
        }else{
            return m('article', { class: "message box " + (' is-' + type), key: tm }, [
                m('div', { class: "message-header" }, [
                    m('p', { class: "" }, [
                        title
                    ]),
                    m('button', {
                        class: "delete", "aria-label": "delete", onclick: function () {
                            that.delMsg(tm)
                        }
                    })
                ]),
                m('div', { class: "message-body has-text-white" }, [
                    content
                ])
            ])
        }
    },
    delMsg: function (key) {
        let i = this.messageContent.findIndex(item => {
            return item.key == key
        })
        if (i > -1) {
            if (this.messageContent[i].delTimer) {
                clearTimeout(this.messageContent[i].delTimer)
            }
            this.messageContent.splice(i, 1)
        }
    },
    getMessage: function () {
        let type = window.$config.views.message.type
        switch (type) {
            case 0:
                return m('div', { class: "window-message-box " }, msg.messageContent)
            case 1:
                return this.customMessage()
            default:
                return null
        }
    },
    customMessage: function () {

    },
}
module.exports = {
    oninit: function (vnode) {

    },
    oncreate: function (vnode) {
        msg.initEVBUS()

    },
    view: function (vnode) {

        return msg.getMessage()
    },
    onremove: function () {
        msg.rmEVBUS()
    }
}