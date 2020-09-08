// {
//     label : "", // 显示内容
//     content : "", // 提示内容 (空则禁用hover)
//     position : 'bottom', // 提示方向 left, right, top, bottom (默认'bottom')
//     direction : 'center', // 提示位置 left, right, center (默认'center')
//     class: "", // 类名
//     triggerClass: "",
//     dashed : true, // 下划虚线
//     hiddenArrows : false, // 是否隐藏箭头
// }
var m = require("mithril");
require('./Tooltip.scss');

export default {
    getMenuClass(vnode) {
        var classStr = "dropdown-menu " +
        "has-text-white " +
        (vnode.attrs.hiddenArrows ? "" : "arrows ") +
        (` my-tooltip-position-${vnode.attrs.position ? vnode.attrs.position : "bottom "}`) +
        (` my-tooltip-direction-${vnode.attrs.direction ? vnode.attrs.direction : "center "}`) +
        (vnode.attrs.content ? " " : " is-hidden ") + 
        (vnode.attrs.contentClass ?vnode.attrs.contentClass :"");
        return classStr;
    },
    oninit (vnode) {
    },
    oncreate (vnode) {
    },
    view (vnode) {
        return m('div', { class: `my-tooltip dropdown is-hoverable ${vnode.attrs.class ? vnode.attrs.class : ''}` }, [
            m('div', { class: `dropdown-trigger ${vnode.attrs.dashed ? 'bdb-dashed' : ''} ${vnode.attrs.triggerClass ? vnode.attrs.triggerClass : ''}` }, [
                vnode.attrs.label
            ]),
            m('div', {class: vnode.state.getMenuClass(vnode)}, [
                m('div', { class: "dropdown-content", style: `${vnode.attrs.width ? 'width:' + vnode.attrs.width : ''};${vnode.attrs.height ? 'height:' + vnode.attrs.height : ''}` }, [
                    m('div', { class: "dropdown-item" }, [
                        vnode.attrs.content
                    ])
                ])
            ])
        ]);
    }
};