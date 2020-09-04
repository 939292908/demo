// 参数说明
// getList() {return [{ id:xxx, label:xxx,... }, { id:xxx, label:xxx,... }]} 菜单数据 (id, label必须项) (必填)
// evenKey body事件key (必填)

// onClick(item) {} 点击事件 可获取item (选填)
// activeId 默认选中id(fn) (必填)
// type 触发类型：active / hover (选填)默认active

// placeholder 提示文字 (选填)
// class 类名 (选填)
// btnClass 按钮 类名 (选填)

// btnWidth 按钮 宽 (选填)
// btnHeight 按钮 高 (选填)
// menuWidth 菜单 宽 (选填)

var m = require("mithril");
require('./Dropdown.scss');
const model = require('./Dropdown.logic.js');
console.log(model);
module.exports = {
    oninit: vnode => model.oninit(vnode),
    oncreate: vnode => model.oncreate(vnode),
    onupdate: vnode => model.onupdate(vnode),
    onremove: vnode => model.onremove(vnode),
    view (vnode) {
        return m('div', { class: `${vnode.attrs.class || ''} my-dropdown dropdown ${vnode.attrs.type === 'hover' ? " is-hoverable" : vnode.attrs.showMenu ? " is-active" : ''}` }, [
            // btn
            m('div', { class: "dropdown-trigger has-text-1" }, [
                m('button', {
                    class: `button ${vnode.attrs.btnClass || ''}`,
                    style: (vnode.attrs.btnWidth ? `width:${vnode.attrs.btnWidth}px;` : '') +
                        (vnode.attrs.btnHeight ? `height:${vnode.attrs.btnHeight}px;` : ''),
                    onclick: (e) => {
                        setTimeout(() => vnode.attrs.setShowMenu(!vnode.attrs.showMenu), 0); // 进入下一次事件队列，先让body事件关闭所有下拉，再开启自己
                        // vnode.attrs.setBodyEven(false)
                        // window.stopBubble(e)
                    }
                }, [
                    m('p', { class: `my-trigger-text` }, vnode.state.curItem.label), // btnText
                    m('i', { class: "my-trigger-icon iconfont icon-xiala has-text-primary" }) // icon
                ])
            ]),
            // menu
            m('div', { class: "dropdown-menu ", style: vnode.attrs.menuWidth ? `width:${vnode.attrs.menuWidth}px` : '' }, [
                m('div', { class: "dropdown-content", style: "max-height: 400px; overflow: auto;" },
                    model.menuList.map((item, index) => {
                        return m('a', {
                            class: `dropdown-item has-hover ${vnode.state.curId === item.id ? 'has-active' : ''}`,
                            key: item.label + index,
                            onclick () {
                                vnode.state.curItem = item; // 同步显示文字
                                console.log(vnode.state.curItem, item.label);
                                vnode.attrs.activeId((p, k) => {
                                    return (p[k] = item.id);
                                }); // 修改选中id
                                vnode.attrs.onClick && vnode.attrs.onClick(item); // 传递数据
                                vnode.attrs.setShowMenu(false); // 关闭菜单
                            }
                        }, [
                            m('span', { class: `my-menu-label` }, item.label),
                            m('i', { class: `my-menu-icon iconfont icon-fabijiaoyiwancheng ${vnode.state.curId === item.id ? '' : 'is-hidden'}` }) // icon
                        ]);
                    })
                )
            ])
        ]);
    }
};
