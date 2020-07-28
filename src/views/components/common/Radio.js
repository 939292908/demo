var m = require("mithril")
// {
//     class: "", // 添加类名
//     defaultId : id, // 默认选中 id 或 'defaulFirst'第一个
//     onclick (data) {}, // 点击
//     list: [{id, label}], // 列表 id , label（显示文字）
// }
export default {
    current : {}, // 当前选中
    name: 'radio' + Math.ceil(Math.random()*100000000),
    oninit (vnode) {
            let cur = vnode.attrs.list.find(item => item.id == vnode.attrs.defaultId) // 默认选中指定的id
            if (vnode.attrs.defaultId == 'defaulFirst') cur = vnode.attrs.list[0] // 默认选中第一个
            vnode.state.current = cur ? cur : {} // 兼容没有该找到的情况
    },
    // onupdate (vnode) {
    //         let cur = vnode.attrs.list.find(item => item.id == vnode.attrs.defaultId) // 默认选中指定的id
    //         if (vnode.attrs.defaultId == 'defaulFirst') cur = vnode.attrs.list[0] // 默认选中第一个
    //         vnode.state.current = cur ? cur : {} 
    // },
    oncreate (vnode) {
    },
    view (vnode) {
        return m('div', { class: `control ${vnode.attrs.class ? vnode.attrs.class : ''}` },
            vnode.attrs.list.map(item => {
                return m('label', {
                    class: `radio`,
                    key: item.id,
                    onclick () {
                        vnode.state.current = item
                        vnode.attrs.onclick(item)
                    }
                },
                    [
                        m('input', { type: 'radio', name: vnode.state.name, checked: item.id == vnode.state.current.id }),
                        item.label
                    ])
            })
        )
    },
    onbeforeremove (vnode) {

    }
}