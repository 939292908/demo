// 传递参数说明
// list 菜单数据 [{ label:xxx,... }, { label:xxx,... }] (label必须项)
// onClick 点击事件onClick(item){}, 可获取item
// class 类名
// triggerText 触发容器的 默认显示文字
// triggerWidth 自定义触发容器 width
// menuWidth 自定义菜单 width

var m = require("mithril")

export default {
    showMenu: false,
    triggerText: "click me",
    oninit (vnode) {
        vnode.attrs.triggerText && ( vnode.state.triggerText = vnode.attrs.triggerText )
    },
    oncreate (vnode) {

    },
    view (vnode) {
        return m('div', {class:`${vnode.attrs.class} my-dropdown dropdown ${vnode.state.showMenu ? ' is-active' : ''}`}, [
            // trigger
            m('div', {class:"dropdown-trigger"}, [
                m('button', { 
                    class:"button", style: vnode.attrs.triggerWidth ? `width:${vnode.attrs.triggerWidth}px`: '', 
                    onclick: () => vnode.state.showMenu = !vnode.state.showMenu }, [
                    m('div', {class:"button-content has-text-1" }, [
                        m('p', { class: `my-trigger-text` }, vnode.state.triggerText), // triggerText
                        m('i', { class:"my-trigger-icon iconfont icon-dropdown has-text-primary"}), // icon
                    ]),
                ]),
            ]),
            // menu
            m('div', {class:"dropdown-menu"}, [
                m('div', { class: "dropdown-content", style: vnode.attrs.menuWidth ? `width:${vnode.attrs.menuWidth}px`: ''}, 
                    vnode.attrs.list.map((item, index) => {
                        return m('a', { class: `dropdown-item has-hover ${vnode.state.triggerText == item.label ? 'has-active': ''}`, key: item.label+index, onclick() {
                            vnode.state.triggerText = item.label
                            vnode.attrs.onClick && vnode.attrs.onClick(item)
                            vnode.state.showMenu = false
                        }}, [
                            m('span', { class: `my-menu-label` }, item.label),
                                m('i', { class:`my-menu-icon iconfont icon-rounderSelect ${vnode.state.triggerText == item.label ? '': 'is-hidden'}`}), // icon
                        ])
                    })
                ),
            ]),
        ])
    },
    onbeforeremove (vnode) {

    }
}