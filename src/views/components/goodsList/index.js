var m = require("mithril")

import order from './goodsOrder'
import planList from './goodsPlanList'
import historyOrd from './goodsHistoryOrd'
import historyTrade from './goodsHistoryTrade'
import Dropdown from '../common/Dropdown'
// import wltRec from './goodsWltRec'

let obj = {
    showMenu: false,
    tabsActive: 0,
    dropdownActive: 1,
    tabsList: [
        {
            id: 0,
            key: 'ord',
            name: gDI18n.$t('10075'), //'当前委托',
            class: '',
            listNumber: 0
        }, {
            id: 1,
            key: 'plan',
            name: gDI18n.$t('10076'), //'当前计划',
            class: '',
            listNumber: 0
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

        if (this.EV_GET_ORD_READY_unbinder) {
            this.EV_GET_ORD_READY_unbinder()
        }
        this.EV_GET_ORD_READY_unbinder = window.gEVBUS.on(gTrd.EV_GET_ORD_READY, arg => {
            that.getOrdList()
        })

        if (this.EV_ORD_UPD_unbinder) {
            this.EV_ORD_UPD_unbinder()
        }
        this.EV_ORD_UPD_unbinder = window.gEVBUS.on(gTrd.EV_ORD_UPD, arg => {
            that.getOrdList()
        })
        //assetD合约详情全局广播
        if (this.EV_ASSETD_UPD_unbinder) {
            this.EV_ASSETD_UPD_unbinder()
        }
        this.EV_ASSETD_UPD_unbinder = window.gEVBUS.on(gMkt.EV_ASSETD_UPD, arg => {
            that.getOrdList()
        })
        //仓位选择筛选
        if (this.EV_DROPDOWN_UP_unbinder) {
            this.EV_DROPDOWN_UP_unbinder()
        }
        this.EV_DROPDOWN_UP_unbinder = window.gEVBUS.on(gEVBUS.EV_DROPDOWN_UP, arg => {
            that.getOrdList()
        })
    },
    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
        if (this.EV_GET_ORD_READY_unbinder) {
            this.EV_GET_ORD_READY_unbinder()
        }
        if (this.EV_ORD_UPD_unbinder) {
            this.EV_ORD_UPD_unbinder()
        }
        //assetD合约详情全局广播
        if (this.EV_ASSETD_UPD_unbinder) {
            this.EV_ASSETD_UPD_unbinder()
        }
        //仓位选择筛选
        if (this.EV_DROPDOWN_UP_unbinder) {
            this.EV_DROPDOWN_UP_unbinder()
        }
    },

    //获取当前委托数量
    getOrdList:function(){
        let Orders = window.gTrd.Orders['02']
        let posList = []
        let planList = []
        for(let key in Orders){
            let order = Orders[key]
            let obj = {}
            let pan = {}
            let ass = window.gMkt.AssetD[order.Sym]
            //当前委托只显示OType为1的委托单
            if(ass && (order.OType == 1)){
                utils.copyTab(obj,order)
                //根据按钮筛选数据
                if (window.$StopDropdownType == 1) {
                    posList.push(obj)
                } else {
                    let Sym = window.gMkt.CtxPlaying.Sym
                    if (obj.Sym == Sym) {
                        posList.push(obj)
                    }
                }
            }
            //当前计划只显示OType为3的委托单
            if (ass && (order.OType == 3)) {
                utils.copyTab(pan, order)
                //根据按钮筛选数据
                if (window.$StopDropdownType == 1) {
                    planList.push(pan)
                } else {
                    let Sym = window.gMkt.CtxPlaying.Sym
                    if (pan.Sym == Sym) {
                        planList.push(pan)
                    }
                }
            }
        }
        let ordNum = posList.length
        let panNum = planList.length
        obj.tabsList[0].listNumber = ordNum
        obj.tabsList[1].listNumber = panNum
    },
    initLanguage: function () {
        this.tabsList[0].name = gDI18n.$t('10075') //'当前委托',
        this.tabsList[1].name = gDI18n.$t('10076') //'当前计划',
        this.tabsList[2].name = gDI18n.$t('10077') //'历史委托',
        this.tabsList[3].name = gDI18n.$t('10078') //'成交记录',
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
                    item.name ,
                    (i == 0 || i == 1) ? "[" + item.listNumber + "]" : ""
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
        obj.getOrdList()
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
                    activeId: cb => cb(obj, 'dropdownActive'),
                    showMenu: obj.showMenu,
                    setShowMenu: type => obj.showMenu = type,
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
                                label: gDI18n.$t('10618'), //'显示当前交易'
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