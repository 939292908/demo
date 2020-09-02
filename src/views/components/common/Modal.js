// {
//     isShow : true, // 显示隐藏
//     onOk () {}, // 确认事件 // 使用默认确认按钮
//     onClose () {}, // 关闭事件
//     slot:{ // 插槽
//         header,
//         body,
//         footer
//     },
//     width: '50%' // px 或 %
// }

var m = require("mithril");

module.exports = {
    oninit (vnode) {

    },
    oncreate (vnode) {

    },
    view (vnode) {
        // return m("div", { class: "modal" + (vnode.attrs.isShow ? " is-active" : '') }, [
        return m("div", { class: `my-modal modal theme--light ${vnode.attrs.class ? vnode.attrs.class : ''} ${vnode.attrs.isShow ? "is-active" : ''}` }, [
            m("div", { class: "modal-background" }),
            m("div", { class: "modal-card border-radius-medium", style: `width: ${vnode.attrs.width ? vnode.attrs.width : ''}` }, [
                // 头部
                m("header", { class: "modal-card-head has-bg-level-2 has-line-level-1" }, [
                    // 标题
                    m("p", { class: "modal-card-title title-medium" }, [
                        m('p', { class: `modal-card-title-log pb-3` }, "Vbit"),
                        vnode.attrs.slot ? vnode.attrs.slot.header ? vnode.attrs.slot.header : ['头部标题'] : ['头部标题']
                    ]),
                    // 关闭按钮
                    m("button", { class: "delete", "aria-label": "close", onclick: vnode.attrs.onClose })
                ]),
                // 内容
                m("section", { class: "modal-card-body has-bg-level-2" }, vnode.attrs.slot ? vnode.attrs.slot.body ? vnode.attrs.slot.body : ['内容部分'] : ['内容部分']),
                // 底部
                m("footer", { class: "modal-card-foot has-bg-level-2 " + ((vnode.attrs.slot?.footer || vnode.attrs.onOk) ? '' : ' is-hidden') }, vnode.attrs.slot?.footer ? vnode.attrs.slot.footer : vnode.attrs.onOk ? [
                    m("button", { class: "button is-primary font-size-2 has-text-white modal-default-btn button-large", onclick: vnode.attrs.onOk }, [
                        '确定'
                    ])
                ] : [])
            ])
        ]);
    },
    onbeforeremove (vnode) {

    }
};