var m = require("mithril")

import('@/styles/pages/message.css')

let msg = {
    DBG_MESSAGE: true,
    DEL_INTERVAL: 10*1000,
    messageContent: [],
    initMsg: function(){
        //全局message事件
        let that = this
        window.$message = function({title = '提示', content = '', type = 'dark'}){
            if(that.DBG_MESSAGE){_console.log('MSG',__filename,"MESSAGE",{title, content})}
            that.addMessageDom({title,content,type})
        }
    },
    addMessageDom: function (arg) {
        let that = this;
        let msg = this.createMsg(arg)
        _console.log('MSG', msg)
        msg.delTimer = setTimeout(function () {
            that.delMsg(msg.key)
        }, that.DEL_INTERVAL)
        this.messageContent.push(msg)
        if (this.messageContent.length > 3) {
            let needDelMsgArr = this.messageContent.slice(0, -3)
            for (let i = 0; i < needDelMsgArr.length; i++) {
                let item = needDelMsgArr[i]
                this.delMsg(item.key)
            }
        }
        m.redraw()
    },
    createMsg: function ({ title, content, type }) {
        let that = this
        let tm = Date.now()
        if(window.isMobile){
            return m('article', { class: "message " + (' is-' + type), key: tm }, [
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
            return m('article', { class: "message " + (' is-' + type), key: tm }, [
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
        m.redraw()
    },
}
module.exports = {
    oninit: function (vnode) {

    },
    oncreate: function (vnode) {
        msg.initMsg()
    },
    view: function (vnode) {
        return m('div', { class: "window-message-box" }, msg.messageContent)
    },
    onremove: function () {
        
    }
}