var m = require("mithril")
// {
//     isShow : true, // 显示隐藏
//     onOk () {}, // 确认事件 // 使用默认确认按钮
//     onClose () {}, // 关闭事件
//     slot:{ // 插槽
//         header,
//         body,
//         footer
//     }
// }
export default {
    oninit (vnode) {

    },
    oncreate (vnode) {

    },
    view (vnode) {
        return m("div", { class: "modal" + (vnode.attrs.isShow ? " is-active" : '') }, [
            m("div", { class: "modal-background"}),
            m("div", { class: "modal-card" }, [
                // 头部
                m("header", { class: "pub-set-lever-head modal-card-head" }, [
                    // 标题
                    m("p", { class: "modal-card-title" }, vnode.attrs.slot ? vnode.attrs.slot.header ? vnode.attrs.slot.header : ['头部标题'] : ['头部标题']),
                    // 关闭按钮
                    m("button", { class: "delete", "aria-label": "close", onclick: vnode.attrs.onClose }),
                ]),
                // 内容
                m("section", { class: "modal-card-body" }, vnode.attrs.slot ? vnode.attrs.slot.body ? vnode.attrs.slot.body : ['内容部分'] : ['内容部分']),
                // 底部
                m("footer", { class: "modal-card-foot" }, vnode.attrs.slot ? vnode.attrs.slot.footer ? vnode.attrs.slot.footer : vnode.attrs.onOk ? [
                    m("button", { class: "button is-primary font-size-2 modal-default-btn button-large", onclick: vnode.attrs.onOk }, [
                        gDI18n.$t('10051')//'确定'
                    ])
                ] : [] : []),
            ])
        ])
    },
    onbeforeremove (vnode) {

    }
}