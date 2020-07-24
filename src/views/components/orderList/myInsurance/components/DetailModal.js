// 保险详情 模态框
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
        vnode.attrs.onOk && vnode.attrs.onOk()
    },


    // 重置弹框
    reset () {
 
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
        let modalBody = [
            m('div', { class: `has-text-2` }, [
                m('div', { class: `is-between` }, [
                    m('div', { class: `` }, "保险金额"),
                    m('div', { class: `` }, "1000 USDT")
                ]),
                m('div', { class: `is-between` }, [
                    m('div', { class: `` }, "保险比例"),
                    m('div', { class: `` }, "200%")
                ]),
                m('div', { class: `is-between` }, [
                    m('div', { class: `` }, "保险状态"),
                    m('div', { class: `` }, "保障中")
                ]),
                m('div', { class: `is-between` }, [
                    m('div', { class: `` }, "未实现盈亏"),
                    m('div', { class: `` }, "1200.5555 USDT")
                ]),
                m('div', { class: `is-between` }, [
                    m('div', { class: `` }, "预计赔付"),
                    m('div', { class: `` }, "1200.5555 USDT")
                ])
            ])
        ]
        // 弹框 footer
        let modalFooter = [
            m("div", { class: "reset-complete" }, [
                m("a", {
                    class: "reset-button button is-primary is-outlined has-text-white", onclick () { vnode.state.ok(vnode) }
                }, [
                    "确定"
                ])
            ])
        ]
        return m(Modal, {
            isShow: vnode.attrs.isShow,
            width: '493px',
            onClose: () => vnode.attrs.onClose(), // 关闭事件
            slot: {
                header: "保险详情",
                body: modalBody,
                footer: modalFooter
            }
        })
    },
    
    onremove () {
    }
}