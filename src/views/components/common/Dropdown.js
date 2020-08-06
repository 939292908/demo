// 传递参数说明
// getList() {return [{ id:xxx, label:xxx,... }, { id:xxx, label:xxx,... }]} 菜单数据 (id, label必须项) (必填)

// onClick(item) {} 点击事件 可获取item (选填)
// activeId 默认选中id (选填)
// type 触发类型：active / hover (选填)默认active

// class 类名 (选填)

// btnClass 按钮 类名 (选填)
// btnWidth 按钮 宽 (选填)
// btnHeight 按钮 高 (选填)

// menuWidth 菜单 宽 (选填)

var m = require("mithril")

export default {
    // ============= 状态 =============
    showMenu: false,
    btnText: "click me",
    activeId: "", // 内部临时保存id
    openClickBody: true, // body事件 节流

    // ============= 方法 =============
    // 内部临时保存id
    initId (vnode) {
        vnode.attrs.activeId && vnode.attrs.activeId((p, k) => vnode.state.activeId = p[k])
    },
    // 初始化 选中文字
    initTriggerText (vnode) {
        this.initId(vnode) // id
        let curItem = null // 当前选中元素
        curItem = vnode.attrs.getList().find(item => item.id == vnode.state.activeId) // 根据 id
        if (curItem) vnode.state.btnText = curItem.label // 文字
        // console.log(curItem, vnode.state.btnText, 77777777777);
        m.redraw()
    },
    //初始化 全局广播
    initEVBUS (vnode) {
        // 订阅 语言切换广播
        // this.EV_CHANGELOCALE_UPD_unbinder && this.EV_CHANGELOCALE_UPD_unbinder()
        // this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD, arg => {
        //     setTimeout(() => this.initTriggerText(vnode), 100)// 要在所有语言初始化结束后再获取选中的文字
        // })
        // 订阅 body点击事件广播
        this.EV_ClICKBODY_unbinder && this.EV_ClICKBODY_unbinder()
        this.EV_ClICKBODY_unbinder = window.gEVBUS.on(gEVBUS.EV_ClICKBODY, arg => {
            if (vnode.state.openClickBody) vnode.state.showMenu = false // body事件 节流
            vnode.state.openClickBody = true
        })
    },
    //删除全局广播
    rmEVBUS () {
        // this.EV_CHANGELOCALE_UPD_unbinder && this.EV_CHANGELOCALE_UPD_unbinder() // 删除 语言切换广播
        this.EV_ClICKBODY_unbinder && this.EV_ClICKBODY_unbinder() // 删除 body点击事件广播
    },

    // ============= 生命周期 =============
    oninit (vnode) {
        this.initTriggerText(vnode)
        this.initEVBUS(vnode)
    },
    oncreate (vnode) {
    },
    onupdate (vnode) {
        this.initTriggerText(vnode)
    },
    view (vnode) {
        return m('div', { class: `${vnode.attrs.class || ''} my-dropdown dropdown ${vnode.attrs.type == 'hover' ? " is-hoverable" : vnode.state.showMenu ? " is-active" : ''}` }, [
            // btn
            m('div', { class: "dropdown-trigger" }, [
                m('button', {
                    class: `button ${vnode.attrs.btnClass || ''}`,
                    style: (vnode.attrs.btnWidth ? `width:${vnode.attrs.btnWidth}px;` : '') +
                        (vnode.attrs.btnHeight ? `height:${vnode.attrs.btnHeight}px;` : ''),
                    onclick: (e) => {
                        vnode.state.showMenu = !vnode.state.showMenu
                        vnode.state.openClickBody = false
                        // window.stopBubble(e)
                    }
                }, [
                    m('div', { class: "button-content has-text-1" }, [
                        m('p', { class: `my-trigger-text` }, vnode.state.btnText), // btnText
                        m('i', { class: "my-trigger-icon iconfont iconxiala1 has-text-primary" }), // icon
                    ]),
                ]),
            ]),
            // menu
            m('div', { class: "dropdown-menu ", style: vnode.attrs.menuWidth ? `width:${vnode.attrs.menuWidth}px` : '' }, [
                m('div', { class: "dropdown-content" },
                    vnode.attrs.getList().map((item, index) => {
                        return m('a', {
                            class: `dropdown-item has-hover ${vnode.state.activeId == item.id ? 'has-active' : ''}`, key: item.label + index, onclick () {
                                vnode.state.btnText = item.label // 同步显示文字
                                // vnode.state.activeId = item.id
                                vnode.attrs.activeId((p, k) => p[k] = item.id) // 修改选中id
                                vnode.attrs.onClick && vnode.attrs.onClick(item) // 传递数据
                                vnode.state.showMenu = false // 关闭菜单
                            }
                        }, [
                            m('span', { class: `my-menu-label` }, item.label),
                            m('i', { class: `my-menu-icon iconfont iconfabijiaoyiwancheng ${vnode.state.activeId == item.id ? '' : 'is-hidden'}` }), // icon
                        ])
                    })
                ),
            ]),
        ])
    },
    onremove: function (vnode) {
        this.rmEVBUS()
    }
}
