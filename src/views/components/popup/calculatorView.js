var m = require("mithril")

let obj = {
    open: false,
    tabsActive: 0, //默认显示项

    tableList: [{
            name: '盈亏',
            id: 0
        },
        {
            name: '平仓价格',
            id: 1
        },
        {
            name: '强平价格',
            id: 2
        },
    ],
    //初始化全局广播
    initEVBUS: function () {
        let that = this
        if (this.EV_OPENCALCULATORVIEW_UPD_unbinder) {
            this.EV_OPENCALCULATORVIEW_UPD_unbinder()
        }
        this.EV_OPENCALCULATORVIEW_UPD_unbinder = window.gEVBUS.on(gEVBUS.EV_OPENCALCULATORVIEW_UPD, arg => {
            that.open = true
        })
        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD, arg => {
            that.initLanguage()
        })

    },
    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_OPENCALCULATORVIEW_UPD_unbinder) {
            this.EV_OPENCALCULATORVIEW_UPD_unbinder()
        }
        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
    },
    //初始化多语言
    initLanguage: function () {
        this.tableList = [{
                name: '盈亏',
                id: 0
            },
            {
                name: '平仓价格',
                id: 1
            },
            {
                name: '强平价格',
                id: 2
            },
        ]
    },
    closeLeverageMode: function () {
        this.open = false
    },
    //切换选中
    setTabsActive: function (param) {
        this.tabsActive = param
    },
    //切换列表
    getTableList: function () {
        let that = this
        return this.tableList.map((item) => {
            return m("li", {
                key: 'calculatior' + item.id,
                class: "pr-8 " + (obj.tabsActive == item.id ? ' is-active' : '')
            }, [
                m("a", {
                    key: "calculatiorListTabsItem" + item.id,
                    class: "px-0 py-0 ",
                    href: "javascript:void(0);",
                    onclick: function () {
                        obj.setTabsActive(item.id)
                    }
                }, [
                    item.name
                ])
            ])
        })
    },
    //切换视图
    getTableView:function(){
        switch(this.tabsActive) {
            case 0:
                return m(ProfitLoss);
            case 1:
                return m(ClosePosition);
            case 2:
                return m(CompulsoryClosing)
        }
    }
}

import ProfitLoss from './profitLoss'
import ClosePosition from './closePosition'
import CompulsoryClosing from './compulsoryClosing'

export default {
    oninit: function (vnode) {

    },
    oncreate: function (vnode) {
        obj.initEVBUS()
    },
    view: function (vnode) {
        return m('div', {
            class: 'pub-set-lever'
        }, [
            m("div", {
                class: "modal" + (obj.open ? " is-active" : ''),
            }, [
                m("div", {
                    class: "modal-background",
                    onclick: () => {
                        obj.open = false
                    }
                }),
                m("div", {
                    class: "modal-card"
                }, [
                    m("header", {
                        class: "pub-set-lever-head modal-card-head"
                    }, [
                        m("p", {
                            class: "modal-card-title"
                        }, [
                            '合约计算器'
                        ]),
                        m("button", {
                            class: "delete",
                            "aria-label": "close",
                            onclick: function () {
                                obj.closeLeverageMode()
                            }
                        }),
                    ]),
                    m("section", {
                        class: "pub-set-lever-content modal-card-body"
                    }, [
                        m("div", {
                            class: "pub-place-order-tabs tabs is-text-3"
                        }, [
                            m("ul", [
                                obj.getTableList()
                            ])
                        ]),
                        m("div",{
                            class:  ""
                        },[
                            obj.getTableView()
                        ])
                    ]),
                    m("footer", {
                        class: "pub-set-lever-foot modal-card-foot"
                    }, [

                    ]),
                ])
            ])
        ])
    },
    onremove: function (vnode) {
        obj.rmEVBUS()
    },
}