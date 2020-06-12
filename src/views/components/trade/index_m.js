var m = require("mithril")

import limitOrd from './limitOrd'
import marketOrd from './marketOrd'
import limitPlan from './limitPlan'
import marketPlan from './marketPlan'

import selectPos from './selectPos'

let obj = {
    tabsActive: {
        id: 0,
        key: 'limitOrd',
        name: gDI18n.$t('10117'), //'限价委托'
        open: true
    },
    tabsList: {
        limitOrd: {
            id: 0,
            key: 'limitOrd',
            name: gDI18n.$t('10117'), //'限价委托'
            open: true
        },
        marketOrd: {
            id: 1,
            key: 'marketOrd',
            name: gDI18n.$t('10118'), //'市价委托' 
            open: true
        },
        limitPlan: {
            id: 2,
            key: 'limitPlan',
            name: gDI18n.$t('10119'), //'限价计划'
            open: true
        },
        marketPlan: {
            id: 3,
            key: 'marketPlan',
            name: gDI18n.$t('10120'), //'市价计划'
            open: true
        },
    },
    tabsListOpen: false,

    //初始化全局广播
    initEVBUS: function(){
        let that = this
        
        //body点击事件广播
        if(this.EV_ClICKBODY_unbinder){
            this.EV_ClICKBODY_unbinder()
        }
        this.EV_ClICKBODY_unbinder = window.gEVBUS.on(gEVBUS.EV_ClICKBODY,arg=> {
            that.tabsListOpen = false
        })
        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        } 
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD, arg => {
            that.initLanguage()
        })

    },
    initLanguage: function(){
        this.tabsList = {
            limitOrd: {
                id: 0,
                key: 'limitOrd',
                name: gDI18n.$t('10117'), //'限价委托'
                open: true
            },
            marketOrd: {
                id: 1,
                key: 'marketOrd',
                name: gDI18n.$t('10118'), //'市价委托' 
                open: true
            },
            limitPlan: {
                id: 2,
                key: 'limitPlan',
                name: gDI18n.$t('10119'), //'限价计划'
                open: true
            },
            marketPlan: {
                id: 3,
                key: 'marketPlan',
                name: gDI18n.$t('10120'), //'市价计划'
                open: true
            },
        }
    },
    rmEVBUS: function(){
        if(this.EV_ClICKBODY_unbinder){
            this.EV_ClICKBODY_unbinder()
        }
    },
    setTabsActive: function(param){
        this.tabsActive = param
        console
    },
    getTabsList: function(){
        let that = this
        let tabsList = Object.keys(this.tabsList)
        // 根据配置筛选出需要现实的tab
        tabsList = tabsList.filter(key =>{
            return window.$config.future.placeOrder[key]
        })
        return tabsList.map(function(key,i){
            let item = that.tabsList[key]
            return m('dev', {key: 'dropdown-item'+key+i, class: ""}, [
                // m('hr', {class: "dropdown-divider "}),
                m('a', { href: "javascript:void(0);", class: "dropdown-item"+(obj.tabsActive == item.id?' has-text-primary':''), onclick: function(){
                    obj.setTabsActive(item)
                }},[
                    item.name
                ])
            ])
        })
    },
    getTabsActiveContent: function(){
        switch(this.tabsActive.id){
            case 0: 
                return m(limitOrd)
            case 1: 
                return m(marketOrd)
            case 2: 
                return m(limitPlan)
            case 3: 
                return m(marketPlan)
        }
    },
    getSelectPos: function(){
        // 根据配置判断仓位选择是否显示
        let tradeType = window.$config.future.tradeType
        let show = false
        switch(tradeType){
            case 0:
                show = true;
                break;
            case 1:
            case 2:
            case 3:
                show = false
                break;
            default:
                show = false
        }
        if(show){
            return m(selectPos)
        }else{
            return null
        }
    },
}
export default {
    oninit: function(vnode){
        obj.initLanguage()
    },
    oncreate: function(vnode){
        obj.initEVBUS()
    },
    view: function(vnode) {
        
        return m("div",{class:"pub-place-order-m"},[
            m('div', {class: "dropdown pub-place-order-select" + (obj.tabsListOpen?' is-active':'')}, [
                m('.dropdown-trigger', {}, [
                    m('button', {class: "button is-white is-fullwidth",'aria-haspopup':true, "aria-controls": "dropdown-menu2", onclick: function(e){
                        obj.tabsListOpen = !obj.tabsListOpen
                        window.stopBubble(e)
                    }}, [
                        m('div.is-between', {}, [
                            m('span',{ class: ""}, obj.tabsList[obj.tabsActive.key].name),
                            m('i', {class: "iconfont iconxiala has-text-primary", "aria-hidden": true })
                        ])
                    ]),
                ]),
                m('.dropdown-menu', {class:"max-height-500 scroll-y dropdown-paddng-top", id: "dropdown-menu2", role: "menu"}, [
                    m('.dropdown-content', {class:"has-text-centered"}, [
                        obj.getTabsList()
                    ]),
                ]),
            ]),
            obj.getTabsActiveContent()
        ])
    },
    onremove: function(){
        obj.rmEVBUS()
    }
}