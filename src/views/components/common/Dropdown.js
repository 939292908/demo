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
const broadcast = require('@/broadcast/broadcast');
require('./Dropdown.scss');

module.exports = {
    // ============= 状态 =============
    showMenu: false,
    curItem: {},
    curId: "", // 临时保存id
    openClickBody: true, // body事件 节流

    // ============= 方法 =============
    // 初始化 选中item
    initCurItem (vnode) {
        // 临时保存 当前选中id
        vnode.attrs.activeId && vnode.attrs.activeId((p, k) => {
            return (vnode.state.curId = p[k]);
        });
        // 当前选中item
        const item = vnode.attrs.getList().find(item => {
            return item.id === vnode.state.curId;
        });
        vnode.state.curItem = item || {};

        // console.log(vnode.state.curId, vnode.state.curItem, 66);
        // if (curItem) {
        //     vnode.state.btnText = curItem.label;
        // } else {
        //     vnode.state.btnText = vnode.attrs.placeholder || "--";
        // }
        // console.log(curItem, vnode.state.btnText, 77777777777);
        m.redraw();
    },
    // 初始化 全局广播
    initEVBUS (vnode) {
        // 订阅 body点击事件广播
        broadcast.onMsg({
            key: vnode.attrs.evenKey,
            cmd: broadcast.EV_ClICKBODY,
            cb: function () {
                vnode.attrs.setShowMenu(false);
            }
        });
        // this.EV_ClICKBODY_unbinder = window.gEVBUS.on(gEVBUS.EV_ClICKBODY, arg => {
        //     if (vnode.state.openClickBody) vnode.attrs.showMenu((p, k) => p[k] = false) // body事件 节流
        //     vnode.state.openClickBody = true
        // })
    },
    // 删除全局广播
    rmEVBUS (vnode) {
        broadcast.offMsg({
            key: vnode.attrs.evenKey,
            isall: true
        }); // 删除 body点击事件广播
    },

    // ============= 生命周期 =============
    oninit (vnode) {
        this.initCurItem(vnode);
        this.initEVBUS(vnode);
    },
    oncreate (vnode) {
    },
    onupdate (vnode) {
        this.initCurItem(vnode);
    },
    view (vnode) {
        return m('div.Dropdown', { class: `${vnode.attrs.class || ''} my-dropdown dropdown ${vnode.attrs.type === 'hover' ? " is-hoverable" : vnode.attrs.showMenu ? " is-active" : ''}` }, [
            // btn
            m('div', { class: "dropdown-trigger has-text-level-1" }, [
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
                m('div.pa-0', { class: "dropdown-content", style: "max-height: 400px; overflow: auto;" },
                    vnode.attrs.getList().map((item, index) => {
                        return m('a.pl-7.pr-0.py-3', {
                            class: `dropdown-item has-hover ${vnode.state.curId === item.id ? 'has-active' : ''}`,
                            key: item.label + index,
                            onclick () {
                                vnode.state.curItem = item; // 同步显示文字
                                vnode.attrs.activeId((p, k) => {
                                    return (p[k] = item.id);
                                }); // 修改选中id
                                vnode.attrs.onClick && vnode.attrs.onClick(item); // 传递数据
                                vnode.attrs.setShowMenu(false); // 关闭菜单
                            }
                        }, [
                            m('span.body-5', { class: `my-menu-label` }, item.label)
                            // m('i', { class: `my-menu-icon iconfont icon-fabijiaoyiwancheng ${vnode.state.activeId === item.id ? '' : 'is-hidden'}` }) // icon
                        ]);
                    })
                )
            ])
        ]);
    },
    onremove: function (vnode) {
        this.rmEVBUS(vnode);
    }
};
