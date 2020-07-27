// 购买保险 模态框
// {
//     isShow : true, // 显示隐藏
//     allData : [], // 需要过滤的数据
//     getNewData (newData) {}, // 获取过滤后的数据
//     onClose () {}, // 关闭事件
// }
var m = require("mithril")
import Modal from "../../../common/Modal"

export default {
    // --------------- state ---------------


    // --------------- method ---------------


    // 提交
    ok (vnode) {

        vnode.attrs.onClose() // 关闭模态框
    },


    // 重置弹框
    cloce (vnode) {
        vnode.attrs.onClose() // 关闭模态框
    },

    // --------------- 生命周期 ---------------
    oninit (vnode) {
    },

    oncreate (vnode) {
    },

    onupdate (vnode) {
    },

    view (vnode) {
        // 弹框 body
        function getBody () {
            let modalBody = [
                m('div', { class: `has-text-2` }, ["买保险啦"])
            ]
            return modalBody
        }
        // 弹框 footer
        function getFooter () {
            let modalFooter = [
                m("div", { class: "reset-complete" }, [
                    m("a", {
                        class: "reset-button button is-primary is-outlined has-text-white", onclick () { vnode.state.cloce(vnode) }
                    }, [
                        "取消"
                    ]),
                    m("a", {
                        class: "reset-button button is-primary is-outlined has-text-white", onclick () { vnode.state.ok(vnode) }
                    }, [
                        "确定"
                    ])
                ])
            ]
            return modalFooter
        }
        return m(Modal, {
            isShow: vnode.attrs.isShow,
            width: '493px',
            onClose: () => vnode.attrs.onClose(), // 关闭事件
            slot: {
                header: "购买保险",
                body: getBody(),
                footer: getFooter()
            }
        })
    },
    
    onremove () {
    }
}