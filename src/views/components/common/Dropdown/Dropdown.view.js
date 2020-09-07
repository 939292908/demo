// 参数说明
// evenKey body事件key (必填)
// currentId 选中id (必填)
// showMenu 下拉状态 (必填)
// setOption (设置currentId和showMenu) (必填)
// menuList() {return [{ id:xxx, label:xxx,... }, { id:xxx, label:xxx,... }]} 菜单数据 (id, label) (必填) (render(){} 自定义内容)

// menuClick(item) {} 点击事件 可获取item (选填)
// class 类名 (选填)
// placeholder 提示文字 (选填)
// btnClass 按钮 类名 (选填)

// btnWidth 按钮 宽 (选填)
// btnHeight 按钮 高 (选填)
// menuWidth 菜单 宽 (选填)
// menuHeight 菜单 高 (选填)

// type 触发类型：active / hover (选填)(默认active)
// showMenuIcon 菜单 icon (选填)(默认false)

var m = require("mithril");
require('./Dropdown.scss');
const logic = require('./Dropdown.logic.js');

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    view (vnode) {
        return m('div', { class: `${vnode.attrs.class || ''} my-dropdown dropdown ${vnode.attrs.type === 'hover' ? " is-hoverable" : vnode.attrs.showMenu ? " is-active" : ''}` }, [
            // 选中content
            m('div', { class: "dropdown-trigger has-text-1" }, [
                m('button', {
                    class: `button ${vnode.attrs.btnClass || ''}`,
                    style: (vnode.attrs.btnWidth ? `width:${vnode.attrs.btnWidth}px;` : '') +
                        (vnode.attrs.btnHeight ? `height:${vnode.attrs.btnHeight}px;` : ''),
                    onclick() {
                        logic.currentContentClick(vnode); // click
                    }
                }, [
                    logic.getCurrentContent(vnode), // 内容
                    m('i', { class: `my-trigger-icon iconfont icon-xiala has-text-primary` }) // icon
                ])
            ]),
            // 菜单menu
            m('div', {
                class: "dropdown-menu",
                style: (vnode.attrs.menuWidth ? `width:${vnode.attrs.menuWidth}px;` : '')
            }, [
                m('div', { class: "dropdown-content", style: (vnode.attrs.menuHeight ? `max-height:${vnode.attrs.menuHeight}px;` : '') },
                    // list
                    vnode.attrs.menuList().map((item, index) => {
                        return m('a', {
                            class: `dropdown-item has-hover ${vnode.attrs.currentId === item.id ? 'has-active' : ''}`,
                            key: item.id + index,
                            onclick () {
                                logic.menuClick(item, vnode); // click
                            }
                        }, [
                            m('div', { class: `my-menu-label` }, item.render ? item.render() : item.label), // 内容
                            vnode.attrs.showMenuIcon ? m('i', { class: `my-menu-icon iconfont icon-fabijiaoyiwancheng ${vnode.attrs.currentId === item.id ? '' : 'is-hidden'}` }) : "" // icon
                        ]);
                    })
                )
            ])
        ]);
    }
};
