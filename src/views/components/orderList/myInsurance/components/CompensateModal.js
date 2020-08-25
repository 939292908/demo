// 申请赔付 模态框
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


    // 确定
    ok (vnode) {
        vnode.attrs.onOk() // 确认
        vnode.attrs.onClose() // 关闭模态框
    },


    // 取消
    close (vnode) {
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
        let modalBody = [
            m('div', { class: `has-text-2` }, [
                `${gDI18n.$t('10633', { value: vnode.attrs.data.compensationAmount})}` // `您当前正在申请保险订单的赔付，赔付金额为${vnode.attrs.data.compensationAmount} USDT。确认申请赔付？`
            ])
        ]
        // 弹框 footer
        let modalFooter = [
            m("div", { class: "reset-complete" }, [
                m("a", {
                    class: "reset-button button is-primary is-outlined has-text-white", onclick () { vnode.state.close(vnode) }
                }, [
                    gDI18n.$t('10052'), //"取消"
                ]),
                m("a", {
                    class: "reset-button button is-primary is-outlined has-text-white", onclick () { vnode.state.ok(vnode) }
                }, [
                    gDI18n.$t('10051'), //"确定"
                ])
            ])
        ]
        return m(Modal, {
            isShow: vnode.attrs.isShow,
            width: '493px',
            onClose: () => vnode.attrs.onClose(), // 关闭事件
            slot: {
                header: gDI18n.$t('10632'), //",
                body: modalBody,
                footer: modalFooter
            }
        })
    },
    
    onremove () {
    }
}