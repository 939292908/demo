// 传递参数说明
// list 菜单数据 [{ label:xxx,... }, { label:xxx,... }] (label必须项)
// onClick 点击事件onClick(item){}, 可获取item
// class 类名
// triggerText 触发容器的 默认显示文字
// triggerWidth 自定义触发容器 width
// menuWidth 自定义菜单 width

var m = require("mithril")
let obj = {
    showMenu: false,
    triggerText: "click me",
    triggerId: "",
    // 初始化 id
    initId (vnode) {
        vnode.attrs.triggerId && ( obj.triggerId = vnode.attrs.triggerId )
    },
    // 初始化 选中的文字
    initTriggerText (vnode) {
        let curItem = vnode.attrs.getList().find( item => item.id == obj.triggerId ) // 当前id 对应的元素
        if ( curItem ) obj.triggerText = curItem.label
    },
    //初始化 全局广播
    initEVBUS (vnode) {
        // 订阅 语言切换广播
        this.EV_CHANGELOCALE_UPD_unbinder && this.EV_CHANGELOCALE_UPD_unbinder()
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on( gDI18n.EV_CHANGELOCALE_UPD, arg => obj.initTriggerText(vnode) )
        // 订阅 body点击事件广播
        this.EV_ClICKBODY_unbinder && this.EV_ClICKBODY_unbinder()
        this.EV_ClICKBODY_unbinder = window.gEVBUS.on(gEVBUS.EV_ClICKBODY, arg => obj.showMenu = false )
    },
    //删除全局广播
    rmEVBUS () {
        this.EV_CHANGELOCALE_UPD_unbinder && this.EV_CHANGELOCALE_UPD_unbinder() // 删除 语言切换广播
        this.EV_ClICKBODY_unbinder && this.EV_ClICKBODY_unbinder() // 删除 body点击事件广播
    }
}
export default {
    oninit (vnode) {
        obj.initId(vnode)
        obj.initTriggerText(vnode)
        obj.initEVBUS(vnode)
    },
    oncreate (vnode) {

    },
    view (vnode) {
        return m('div', {class:`${vnode.attrs.class || ''} my-dropdown dropdown ${obj.showMenu ? ' is-active' : ''}`}, [
            // trigger
            m('div', {class:"dropdown-trigger"}, [
                m('button', { 
                    class:"button", style: vnode.attrs.triggerWidth ? `width:${vnode.attrs.triggerWidth}px`: '', 
                    onclick: (e) => {
                        obj.showMenu = !obj.showMenu
                        window.stopBubble(e)
                    } }, [
                    m('div', {class:"button-content has-text-1" }, [
                        m('p', { class: `my-trigger-text` }, obj.triggerText), // triggerText
                        m('i', { class:"my-trigger-icon iconfont iconxiala1 has-text-primary"}), // icon
                    ]),
                ]),
            ]),
            // menu
            m('div', {class:"dropdown-menu"}, [
                m('div', { class: "dropdown-content", style: vnode.attrs.menuWidth ? `width:${vnode.attrs.menuWidth}px`: ''}, 
                    vnode.attrs.getList().map((item, index) => {
                        return m('a', { class: `dropdown-item has-hover ${obj.triggerId == item.id ? 'has-active': ''}`, key: item.label+index, onclick() {
                            obj.triggerText = item.label
                            obj.triggerId = item.id
                            vnode.attrs.onClick && vnode.attrs.onClick(item)
                            obj.showMenu = false
                        }}, [
                            m('span', { class: `my-menu-label` }, item.label),
                                m('i', { class:`my-menu-icon iconfont iconfabijiaoyiwancheng ${obj.triggerId == item.id ? '': 'is-hidden'}`}), // icon
                        ])
                    })
                ),
            ]),
        ])
    },
    onremove:function(vnode){
        obj.rmEVBUS()
    }
}