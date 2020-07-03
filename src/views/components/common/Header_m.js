var m = require("mithril")
// {
//  onLeftClick: fn, // 左 click
//  onCenterClick: fn, // 中 click
//  onRightClick: fn, // 右 click
//  slot: {
//     left: [], // 左 插槽
//     center: [], // 中 插槽
//     right: [], // 右 插槽
//     menu: [] // 菜单 插槽
//  }
// }
export default {
    onLeftClick (vnode) { // 左 click
        vnode.attrs.onLeftClick && vnode.attrs.onLeftClick()
        router.back()
    },
    onCenterClick (vnode) { // 中 click
        vnode.attrs.onCenterClick && vnode.attrs.onCenterClick()
    },
    onRightClick (vnode) { // 右 click
        vnode.attrs.onRightClick && vnode.attrs.onRightClick()
    },

    oninit (vnode) {
    },
    oncreate (vnode) {
    },
    view (vnode) {
        // 手机端头部
        return m("nav", { class: "pub-layout-m-header is-fixed-top navbar", role: "navigation", "aria-label": "main navigation" }, [
            m('div', { class: "navbar-brand is-between has-text-1" }, [
                // 左
                m('a', { class: "navbar-item", onclick: () => this.onLeftClick(vnode) },
                    vnode.attrs.slot ? vnode.attrs.slot.left ? vnode.attrs.slot.left : m('i', { class: "iconfont iconarrow-left" }) : m('i', { class: "iconfont iconarrow-left" })
                ),
                // 中
                m("a", { class: "navbar-item is-size-5", onclick: () => this.onCenterClick(vnode) },
                    vnode.attrs.slot ? vnode.attrs.slot.center ? vnode.attrs.slot.center : "" : ""
                ),
                // 右
                m('a', { class: "navbar-item", onclick: () => this.onRightClick(vnode) },
                    vnode.attrs.slot ? vnode.attrs.slot.right ? vnode.attrs.slot.right : "" : ""
                ),
            ]),
            // 菜单
            vnode.attrs.slot ? vnode.attrs.slot.menu ? vnode.attrs.slot.menu : "" : ""
        ])
    },
    onbeforeremove (vnode) {

    }
}