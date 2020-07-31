// {
    //     label : "", // 正常显示的内容
    //     content : "", // hover提示 (没有则禁用hover)
    //     direction : 'center', // hover提示的方向 'left'/'right'/'center' (默认'center')
    //     class: "", // 类名
    //     dashed : true, // 下划虚线
// }
var m = require("mithril")

export default {
    oninit (vnode) {
    },
    oncreate (vnode) {
    },
    view (vnode) {
        return m('div', { class: `my-tooltip dropdown is-hoverable ${vnode.attrs.class ? vnode.attrs.class : ''}` }, [
            m('div', { class: `dropdown-trigger ${vnode.attrs.dashed ? 'bdb-dashed' : ''}` }, [
                vnode.attrs.label
            ]),
            m('div', { class:  `dropdown-menu my-tooltip-${vnode.attrs.direction ? vnode.attrs.direction : 'center'} ${vnode.attrs.content ? '' : 'is-hidden'}` }, [
                m('div', { class: "dropdown-content" }, [
                    m('div', { class: "dropdown-item" }, [
                        vnode.attrs.content
                    ])
                ])
            ])
        ])
    }
}