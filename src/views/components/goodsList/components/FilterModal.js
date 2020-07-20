var m = require("mithril")
import Modal from "../../common/Modal"

// {
//     isShow : true, // 显示隐藏
//     allData : [], // 需要过滤的数据
//     getNewData (newData) {}, // 获取过滤后的数据
//     onClose () {}, // 关闭事件
// }
export default {
    // --------------- state ---------------
    isShowTabs: false, // 下拉状态
    // all 为选中全部
    dealNameActiveId: "all", // 交易名称 active
    buySellActiveId: "all", // 买卖 active
    typeActiveId: "all", // 类型 active
    stateActiveId: "all", // 状态 active

    // --------------- data ---------------
    dealNameList: [], // 交易名称 list
    buySellList: [],// 买卖 list
    typeList: [], // 类型 list
    stateList: [], // 状态 list

    // --------------- method ---------------
    // 初始化 交易名称 下拉列表
    initDealNameList (vnode) {
        let arr = vnode.attrs.allData.map(item => utils.getSymDisplayName(window.gMkt.AssetD, item.Sym))
        vnode.state.dealNameList = [...new Set(arr)]
        // 包装成对象 加id
        vnode.state.dealNameList = vnode.state.dealNameList.map((item, index) => ({
            id: item,
            name: item
        }))
        // 加入全部选项
        vnode.state.dealNameList.unshift({
            id: "all",
            name: gDI18n.$t('10394') //"全部"
        })
    },

    // 初始化 筛选按钮
    initFilterList () {
        this.buySellList = [ // 买卖 list
            {
                name: gDI18n.$t('10394'),//"全部",
                id: "all"
            },
            {
                name: "买入",//"买入",
                id: 1
            },
            {
                name: "卖出",//"卖出",
                id: -1
            }
        ]
        this.typeList = [ // 类型 list
            {
                name: gDI18n.$t('10394'),//"全部",
                id: "all"
            },
            {
                name: "限价",//"限价",
                id: 1
            },
            {
                name: "市价",//"市价",
                id: 2
            }
        ]
        this.stateList = [ // 状态 list
            {
                name: gDI18n.$t('10394'),//"全部",
                id: "all"
            },
            {
                name: gDI18n.$t('10457'),//"成交",
                id: 0,
                StatusStr: gDI18n.$t('10398'/*"全部成交"*/)
            },
            {
                name: gDI18n.$t('10082'),//"撤单",
                id: 1,
                StatusStr: gDI18n.$t('10399'/*"已撤单"*/)
            }
        ]
    },

    // 交易名称下拉 根据id获取对应name
    getDealNameActivText (vnode) {
        let item = vnode.state.dealNameList.find(item => item.id == vnode.state.dealNameActiveId)
        return item ? item.name : ''
    },

    // 提交
    submit (vnode) {
        let newData = this.getFilterData(vnode) // 过滤的数据
        vnode.attrs.getNewData(newData)
        vnode.attrs.onClose() // 关闭模态框
        // this.reset() // 重置模态框
    },

    // 获取过滤数据
    getFilterData (vnode) {
        // console.log(" 交易名称:", this.dealNameActiveId, " 买卖:",this.buySellActiveId, " 类型:", this.typeActiveId, " 状态:", this.stateActiveId);
        return vnode.attrs.allData.filter(item => {
            return (this.dealNameActiveId == "all" || item.Sym == this.dealNameList.find(item => item.id == this.dealNameActiveId).name) && // 交易名称
                (this.buySellActiveId == "all" || item.Dir == this.buySellList.find(item => item.id == this.buySellActiveId).id) && // 买卖
                (this.typeActiveId == "all" || item.OType == this.typeList.find(item => item.id == this.typeActiveId).id) && // 类型
                (this.stateActiveId == "all" || item.StatusStr == this.stateList.find(item => item.id == this.stateActiveId).StatusStr) // 状态
        })
    },

    // 重置弹框
    reset () {
        this.isShowTabs = false // 下拉状态
        this.dealNameActiveId = "all" // 交易名称 active
        this.buySellActiveId = "all" // 买卖 active
        this.typeActiveId = "all" // 类型 active
        this.stateActiveId = "all" // 状态 active
    },

    // --------------- 生命周期 ---------------
    oninit (vnode) {
        this.initFilterList()
    },

    oncreate (vnode) {
    },

    onupdate (vnode) {
        vnode.state.initDealNameList(vnode)
    },

    view (vnode) {
        // 弹框 body
        let modalBody = [
            // 合约名称
            m("div", { class: "search-bi-name" }, [
                m("p", { class: "search-bi-name-p has-text-2" }, [
                    gDI18n.$t('10110'),//"合约名称"
                ]),
                m("div", { class: " pub-place-order-m pub-order-m" }, [
                    m('div', { class: "dropdown pub-place-order-select is-hidden-desktop" + (vnode.state.isShowTabs ? ' is-active' : '') }, [
                        m('.dropdown-trigger', {}, [
                            m('button', {
                                class: "button is-white is-fullwidth", 'aria-haspopup': true, "aria-controls": "dropdown-menu2", onclick () {
                                    vnode.state.isShowTabs = !vnode.state.isShowTabs
                                }
                            }, [
                                m('div', {}, [
                                    m('span', { class: "" }, vnode.state.getDealNameActivText(vnode)),
                                    m('span', { class: "icon " }, [
                                        m('i', { class: "iconfont iconxiala has-text-primary", "aria-hidden": true })
                                    ]),
                                ])
                            ]),
                        ]),
                        m('.dropdown-menu', { class: "scroll-y", role: "menu" }, [
                            m('.dropdown-content', { class: "has-text-centered" },
                                vnode.state.dealNameList.map((item, index) => {
                                    return m("p", { class: "a-text-left" }, [
                                        m("a", {
                                            class: `has-text-2 ${vnode.state.dealNameActiveId == item.id ? ' has-text-primary' : ''}`, key: "orderListTabsItem" + index, href: "javascript:void(0);",
                                            onclick () {
                                                vnode.state.dealNameActiveId = item.id
                                                vnode.state.isShowTabs = !vnode.state.isShowTabs
                                                // console.log(vnode.state.dealNameActiveId,item.id);
                                            }
                                        }, [
                                            item.name
                                        ])
                                    ])
                                })
                            ),
                        ]),
                    ]),
                ])
            ]),
            // 买入/卖出
            m("div", { class: "search-bi-name" }, [
                m("p", { class: "search-bi-name-p has-text-2" }, [
                    gDI18n.$t('10459'),//"买入/卖出"
                ]),
                m("div", { class: "search-k-d" }, [
                    this.buySellList.map((item, index) => {
                        return m("a", {
                            class: `button is-outlined button-styl has-text-white bdn is-background-2 ${vnode.state.buySellActiveId == item.id ? 'is-primary' : ''}`, key: index,
                            onclick () {
                                vnode.state.buySellActiveId = item.id
                            }
                        }, item.name)
                    })
                ]),
            ]),
            // 类型
            m("div", { class: "search-bi-name" }, [
                m("p", { class: "search-bi-name-p has-text-2" }, [
                    "类型",//"类型"
                ]),
                m("div", { class: "search-k-d" }, [
                    this.typeList.map((item, index) => {
                        return m("a", {
                            class: `button is-outlined button-styl has-text-white bdn is-background-2 ${vnode.state.typeActiveId == item.id ? 'is-primary' : ''}`, key: index,
                            onclick () {
                                vnode.state.typeActiveId = item.id
                            }
                        }, item.name)
                    })
                ]),
            ]),
            // 状态
            m("div", { class: "search-bi-name" }, [
                m("p", { class: "search-bi-name-p has-text-2" }, [
                    gDI18n.$t('10057'),//"状态"
                ]),
                m("div", { class: "search-k-d" }, [
                    this.stateList.map((item, index) => {
                        return m("a", {
                            class: `button is-outlined button-styl has-text-white bdn is-background-2 ${vnode.state.stateActiveId == item.id ? 'is-primary' : ''}`, key: index,
                            onclick () {
                                vnode.state.stateActiveId = item.id
                            }
                        }, item.name)
                    })
                ]),
            ])
        ]
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
            onClose: () => vnode.attrs.onClose(), // 关闭事件
            slot: {
                header: gDI18n.$t('10458'),//'筛选'
                body: modalBody,
                footer: modalFooter
            }
        })
    },
    
    onremove () {
    }
}