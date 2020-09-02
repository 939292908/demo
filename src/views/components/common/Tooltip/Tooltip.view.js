// 参数说明
// {
//     class: "", // 类名 (选填)
//     label : "", // 显示内容 (选填)
//     content : "", // 提示内容 (空则禁用hover) (选填)

//     position : "bottom", // 提示方向 left, right, top, bottom (默认bottom) (选填)
//     direction : "center", // 提示位置 left, right, center (默认center) (选填)
//     width : "", // 提示宽 px, em, rem (选填)
//     height : "", // 提示高 px, em, rem (选填)

//     dashed : true, // 下划虚线 (默认false) (选填)
//     hiddenArrows : false, // 是否隐藏箭头 (默认false) (选填)
// }
var m = require("mithril");
require('./Tooltip.scss');

module.exports = {
    // 菜单样式
    getMenuClass(vnode) {
        var classStr = "dropdown-menu " +
        "has-text-white " +
        (vnode.attrs.hiddenArrows ? "" : "arrows ") +
        (` my-tooltip-position-${vnode.attrs.position ? vnode.attrs.position : "bottom "}`) +
        (` my-tooltip-direction-${vnode.attrs.direction ? vnode.attrs.direction : "center "}`) +
        (vnode.attrs.content ? " " : " is-hidden ");
        return classStr;
    },
    // 菜单content样式
    getMenuContentStyle(vnode) {
        return `${vnode.attrs.width ? 'width:' + vnode.attrs.width : ''};${vnode.attrs.height ? 'height:' + vnode.attrs.height : ''}`;
    },
    oninit (vnode) {
    },
    oncreate (vnode) {
    },
    view (vnode) {
        return m('div', { class: `my-tooltip dropdown is-hoverable ${vnode.attrs.class ? vnode.attrs.class : ''}` }, [
            m('div', { class: `dropdown-trigger ${vnode.attrs.dashed ? 'bdb-dashed' : ''}` }, [
                vnode.attrs.label
            ]),
            m('div', { class: vnode.state.getMenuClass(vnode) }, [
                m('div', { class: "dropdown-content", style: vnode.state.getMenuContentStyle(vnode) }, [
                    m('div', { class: "dropdown-item" }, [
                        vnode.attrs.content
                    ])
                ])
            ])
        ]);
    }
};