var m = require("mithril")

import order from './goodsOrder'
import planList from './goodsPlanList'
import historyOrd from './goodsHistoryOrd'
import historyTrade from './goodsHistoryTrade'
import Dropdown from '../common/Dropdown'
// import wltRec from './goodsWltRec'

let obj = {
    tabsActive: 0,
    tabsList: [
        {
            id: 0,
            key: 'ord',
            name: gDI18n.$t('10075'), //'当前委托',
            class: '',
        }, {
            id: 1,
            key: 'plan',
            name: gDI18n.$t('10076'), //'当前计划',
            class: '',
        }, {
            id: 2,
            key: 'historyOrd',
            name: gDI18n.$t('10077'), //'历史委托',
            class: ' is-hidden-touch',
        }, {
            id: 3,
            key: 'historyTrd',
            name: gDI18n.$t('10078'), //'成交记录',
            class: ' is-hidden-touch',
        },
    ],
    setTabsActive: function (param) {
        this.tabsActive = param
    },
    //初始化全局广播
    initEVBUS: function () {
        let that = this

        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD, arg => {
            that.initLanguage()
        })
    },
    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
    },
    initLanguage: function () {
        this.tabsList = [
            {
                id: 0,
                key: 'ord',
                name: gDI18n.$t('10075'), //'当前委托',
                class: '',
            }, {
                id: 1,
                key: 'plan',
                name: gDI18n.$t('10076'), //'当前计划',
                class: '',
            }, {
                id: 2,
                key: 'historyOrd',
                name: gDI18n.$t('10077'), //'历史委托',
                class: ' is-hidden-touch',
            }, {
                id: 3,
                key: 'historyTrd',
                name: gDI18n.$t('10078'), //'成交记录',
                class: ' is-hidden-touch',
            }
        ]
    },
    myclickType(item) {
        window.$StopDropdownType = item.id
        gEVBUS.emit(gEVBUS.EV_STOPDROPDOWN_UP, { Ev: gEVBUS.EV_STOPDROPDOWN_UP, data: { item: window.$StopDropdownType } })
    },
    getTabsList: function () {
        let tabsList = this.tabsList.filter(item => {
            return window.$config.future.goodsOrderList[item.key]
        })
        return tabsList.map(function (item, i) {
            return m("li", {
                class: "" + (obj.tabsActive == item.id ? ' is-active' : '')
            }, [
                m("a", {
                    key: "orderListTabsItem" + i, class: "" + item.class, href: "javascript:void(0);", onclick: function () {
                        obj.setTabsActive(item.id)
                    }
                }, [
                    item.name
                ])
            ])
        })
    },
    getTabsActiveContent: function () {
        switch (this.tabsActive) {
            case 0:
                return m(order)
            case 1:
                return m(planList)
            case 2:
                return m(historyOrd)
            case 3:
                return m(historyTrade)
            // case 4:
            //     return m(wltRec)
        }
    }
}

export default {
    oninit: function (vnode) {
        obj.initEVBUS()
        obj.initLanguage()
        window.$StopDropdownType = 1
    },
    oncreate: function (vnode) {

    },
    view: function (vonde) {

        return m("div", {
            class: "pub-trade-list " + (window.isMobile ? '' : ' box')
        }, [
            m("div", {
                class: "pub-trade-list-tabs tabs "
            }, [
                m("ul", [
                    obj.getTabsList()
                ]),
                m(Dropdown, {
                    class: 'pub-trade-list-tabs-dropdown is-hidden-mobile' + (obj.tabsActive == 5 ? " is-hidden" : ""),
                    activeId: 1,
                    menuWidth: 110,
                    onClick (itme) {
                        console.log(itme);
                        obj.myclickType(itme)
                    },
                    getList () {
                        return [
                            {
                                id: 1,
                                label: gDI18n.$t('10517')//"显示全部"
                            },
                            {
                                id: 2,
                                label: '显示当前交易'
                            }
                        ]
                    }
                })
            ]),
            obj.getTabsActiveContent()
        ])
    },
    onremove: function (vnode) {
        obj.rmEVBUS()
    }
}