var m = require("mithril")
// {
//     class: "", // 添加类名
//     type : true, // 可自定义初始化type
//     onclick (type) {}, // 点击事件 type 为switch状态
// }
export default {
    type : false,
    oninit (vnode) {
        vnode.state.type = vnode.attrs.type
    },
    onupdate (vnode) {
        vnode.state.type = vnode.attrs.type
    },
    oncreate (vnode) {
    },
    view (vnode) {
        return m('span', { 
            class: `my-switch ${vnode.state.type ? 'is-checked' : ' '} ${vnode.attrs.class}`, 
            onclick (event) {
                event.stopPropagation()
                vnode.state.type = !vnode.state.type
                vnode.attrs.onclick(vnode.state.type)
            }
        })
    },
    onbeforeremove (vnode) {

    }
}