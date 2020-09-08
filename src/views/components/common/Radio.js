var m = require("mithril")
import Tooltip from "../common/Tooltip/Tooltip.view"

// {
//     class: "", // 添加类名
//     defaultId : id, //  id 或 'defaulFirst'选中第一个
//     onclick (data) {}, // click
    // list: [
    //     {
    //         id, // (必填)
    //         label, // 显示的文字(必填)
    //         disabled, // 禁用
    //         
    //         // 下面参数是tooltip功能
    //         tooltipContent, //Tooltip提示内容
    //         tooltipDirection //Tooltip方向
    //     }
    // ], 
// }
export default {
    current: {}, // 当前选中
    name: 'radio' + Math.ceil(Math.random() * 100000000),
    oninit (vnode) {
        let cur = vnode.attrs.list.find(item => item.id == vnode.attrs.defaultId) // 默认选中指定的id
        if (vnode.attrs.defaultId == 'defaulFirst') cur = vnode.attrs.list[0] // 默认选中第一个
        vnode.state.current = cur ? cur : {} // 兼容没有对应id的情况
    },
    oncreate (vnode) {
    },
    view (vnode) {
        return m('div', { class: `control ${vnode.attrs.class ? vnode.attrs.class : ''}` },
            vnode.attrs.list.map(item => {
                return m('label', {
                    class: `radio`,
                    key: item.id,
                    disabled: vnode.attrs.disabled || item.disabled,
                    onclick () {
                        vnode.state.current = item
                        vnode.attrs.onclick(item)
                    }
                },
                    [
                        m('input', {
                            type: 'radio',
                            name: vnode.state.name,
                            checked: item.id == vnode.state.current.id,
                            disabled: vnode.attrs.disabled || item.disabled
                        }),
                        // Tooltip 组件
                        m(Tooltip, {
                            label: item.label, // 显示内容
                            content: item.tooltipContent, // 提示内容（没有则禁用hover功能）
                            direction: item.tooltipDirection, // 方向
                            dashed: !!item.tooltipContent // 下划线
                        }),
                        
                    ])
            })
        )
    },
    onbeforeremove (vnode) {

    }
}