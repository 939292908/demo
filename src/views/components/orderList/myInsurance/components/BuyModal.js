// 购买保险 模态框
// {
//     isShow : true, // 显示隐藏
//     allData : [], // 需要过滤的数据
//     getNewData (newData) {}, // 获取过滤后的数据
//     onClose () {}, // 关闭事件
// }
var m = require("mithril")
import Modal from "../../../common/Modal"

export default {
    // --------------- state ---------------


    // --------------- method ---------------


    // 提交
    submit (vnode) {

        vnode.attrs.onClose() // 关闭模态框
        // this.reset() // 重置模态框
    },


    // 重置弹框
    reset () {
 
    },

    // --------------- 生命周期 ---------------
    oninit (vnode) {
    },

    oncreate (vnode) {
    },

    onupdate (vnode) {
    },

    view (vnode) {
        // 弹框 body
        // let modalBody = [
        //     // 合约名称
        //     m("div", { class: "search-bi-name" }, [
        //         m("p", { class: "search-bi-name-p has-text-2" }, [
        //             gDI18n.$t('10110'),//"合约名称"
        //         ]),
        //         m("div", { class: " pub-place-order-m pub-order-m" }, [
        //             m('div', { class: "dropdown pub-place-order-select is-hidden-desktop" + (vnode.state.isShowTabs ? ' is-active' : '') }, [
        //                 m('.dropdown-trigger', {}, [
        //                     m('button', {
        //                         class: "button is-white is-fullwidth", 'aria-haspopup': true, "aria-controls": "dropdown-menu2", onclick () {
        //                             vnode.state.isShowTabs = !vnode.state.isShowTabs
        //                         }
        //                     }, [
        //                         m('div', {}, [
        //                             m('span', { class: "" }, vnode.state.getDealNameActivText(vnode)),
        //                             m('span', { class: "icon " }, [
        //                                 m('i', { class: "iconfont iconxiala has-text-primary", "aria-hidden": true })
        //                             ]),
        //                         ])
        //                     ]),
        //                 ]),
        //                 m('.dropdown-menu', { class: "scroll-y", role: "menu" }, [
        //                     m('.dropdown-content', { class: "has-text-centered" },
        //                         vnode.state.dealNameList.map((item, index) => {
        //                             return m("p", { class: "a-text-left" }, [
        //                                 m("a", {
        //                                     class: `has-text-2 ${vnode.state.dealNameActiveId == item.id ? ' has-text-primary' : ''}`, key: "orderListTabsItem" + index, href: "javascript:void(0);",
        //                                     onclick () {
        //                                         vnode.state.dealNameActiveId = item.id
        //                                         vnode.state.isShowTabs = !vnode.state.isShowTabs
        //                                         // console.log(vnode.state.dealNameActiveId,item.id);
        //                                     }
        //                                 }, [
        //                                     item.name
        //                                 ])
        //                             ])
        //                         })
        //                     ),
        //                 ]),
        //             ]),
        //         ])
        //     ]),
        //     // 买入/卖出
        //     m("div", { class: "search-bi-name" }, [
        //         m("p", { class: "search-bi-name-p has-text-2" }, [
        //             gDI18n.$t('10459'),//"买入/卖出"
        //         ]),
        //         m("div", { class: "search-k-d" }, [
        //             this.buySellList.map((item, index) => {
        //                 return m("a", {
        //                     class: `button is-outlined button-styl has-text-white bdn is-background-2 ${vnode.state.buySellActiveId == item.id ? 'is-primary' : ''}`, key: index,
        //                     onclick () {
        //                         vnode.state.buySellActiveId = item.id
        //                     }
        //                 }, item.name)
        //             })
        //         ]),
        //     ]),
        //     // 类型
        //     m("div", { class: "search-bi-name" }, [
        //         m("p", { class: "search-bi-name-p has-text-2" }, [
        //             "类型",//"类型"
        //         ]),
        //         m("div", { class: "search-k-d" }, [
        //             this.typeList.map((item, index) => {
        //                 return m("a", {
        //                     class: `button is-outlined button-styl has-text-white bdn is-background-2 ${vnode.state.typeActiveId == item.id ? 'is-primary' : ''}`, key: index,
        //                     onclick () {
        //                         vnode.state.typeActiveId = item.id
        //                     }
        //                 }, item.name)
        //             })
        //         ]),
        //     ]),
        //     // 状态
        //     m("div", { class: "search-bi-name" }, [
        //         m("p", { class: "search-bi-name-p has-text-2" }, [
        //             gDI18n.$t('10057'),//"状态"
        //         ]),
        //         m("div", { class: "search-k-d" }, [
        //             this.stateList.map((item, index) => {
        //                 return m("a", {
        //                     class: `button is-outlined button-styl has-text-white bdn is-background-2 ${vnode.state.stateActiveId == item.id ? 'is-primary' : ''}`, key: index,
        //                     onclick () {
        //                         vnode.state.stateActiveId = item.id
        //                     }
        //                 }, item.name)
        //             })
        //         ]),
        //     ])
        // ]
        // 弹框 footer
        let modalFooter = [
            m("div", { class: "reset-complete" }, [
                m("a", {
                    class: "reset-button button is-primary is-outlined has-text-white", onclick () { vnode.state.reset() }
                }, [
                    gDI18n.$t('10461'/*"重置"*/)
                ]),
                m("a", {
                    class: "reset-button button is-primary is-outlined has-text-white", onclick () { vnode.state.submit(vnode) }
                }, [
                    gDI18n.$t('10462'/*"完成"*/)
                ])
            ])
        ]
        return m(Modal, {
            isShow: vnode.attrs.isShow,
            width: '493px',
            onClose: () => vnode.attrs.onClose(), // 关闭事件
            slot: {
                header: "购买保险",
                // body: modalBody,
                footer: modalFooter
            }
        })
    },
    
    onremove () {
    }
}