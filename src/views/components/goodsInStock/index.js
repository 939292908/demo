var m = require("mithril")
import limitOrd from '../trade/limitOrd'
import marketOrd from '../trade/marketOrd'
import stopPL from '../trade/marketPlan'

let obj = {
    tabsActive: 0,
    tabsList: {
        limitOrd: {
            id: 0,
            name: gDI18n.$t('10117'), //'限价委托'
            open: true
        },
        marketOrd: {
            id: 1,
            name: gDI18n.$t('10118'), //'市价委托' 
            open: true
        },
        stopPL: {
            id: 2,
            name: gDI18n.$t('10325'), //'止盈止损' 
            open: true
        },
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
        this.tabsList = {
            limitOrd: {
                id: 0,
                name: gDI18n.$t('10117'), //'限价委托'
                open: true
            },
            marketOrd: {
                id: 1,
                name: gDI18n.$t('10118'), //'市价委托' 
                open: true
            },
            stopPL: {
                id: 2,
                name: gDI18n.$t('10325'), //'止盈止损' 
                open: true
            },
        }
    },
    setTabsActive: function (param) {
        this.tabsActive = param
    },
    getTabsList: function () {
        let that = this
        let tabsList = Object.keys(this.tabsList)
        // 根据配置筛选出需要现实的tab
        tabsList = tabsList.filter(key => {
            return window.$config.future.goodsInStockList[key]
        })
        return tabsList.map(function (key, i) {
            let item = that.tabsList[key]
            return m("li", {
                key: 'placeOrdTabsItem' + i,
                class: "" + (obj.tabsActive == item.id ? ' is-active' : '')
            }, [
                m("a", {
                    key: "orderListTabsItem" + i,
                    class: "a-button-pad",
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
    getTabsActiveContent: function () {
        switch (this.tabsActive) {
            case 0:
                return m(limitOrd)
            case 1:
                return m(marketOrd)
            case 2:
                return m(stopPL)
        }
    },
}

export default {
    oninit:function(vnode){
        obj.initEVBUS()
        obj.initLanguage()
    },
    oncreate:function(vnode){

    },
    view:function(vonde){

        return m("div", {class: "pub-place-order box"}, [
        m("div", {class: "pub-place-order-tabs tabs is-small"
            }, [
                m("ul", [
                    obj.getTabsList()
                ])
            ]),
            obj.getTabsActiveContent()
        ])
        
    },
    onremove:function(vnode){
        obj.rmEVBUS()
    }
}