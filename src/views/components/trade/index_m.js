var m = require("mithril")

import limitOrd from './limitOrd'
import marketOrd from './marketOrd'
import limitPlan from './limitPlan'
import marketPlan from './marketPlan'

import selectPos from './selectPos'

let obj = {
    tabsActive: 0,
    tabsList: [gDI18n.$t('10117'),gDI18n.$t('10118'),gDI18n.$t('10119'),gDI18n.$t('10120')],//['限价委托', '市价委托', '限价计划', '市价计划'],
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

    },
    rmEVBUS: function(){
        if(this.EV_ClICKBODY_unbinder){
            this.EV_ClICKBODY_unbinder()
        }
    },
    setTabsActive: function(param){
        this.tabsActive = param
    },
    getTabsList: function(){
        return this.tabsList.map(function(item,i){
            return m("li",{class:""+(obj.tabsActive == i?' is-active':'')},[
                m("a",{key: "orderListTabsItem"+i, class:"", href:"javascript:void(0);", onclick: function(){
                    obj.setTabsActive(i)
                }},[
                    item
                ])
            ])
        })
    },
    getTabsActiveContent: function(){
        switch(this.tabsActive){
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
    getTabsList: function(){
        return this.tabsList.map((item, i)=>{
            return m('dev', {key: 'dropdown-item'+item+i, class: ""}, [
                // m('hr', {class: "dropdown-divider "}),
                m('a', { href: "javascript:void(0);", class: "dropdown-item"+(obj.tabsActive == i?' has-text-primary':''), onclick: function(){
                    obj.setTabsActive(i)
                }},[
                    item
                ])
            ])
            
        })
    }
}
export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
        obj.initEVBUS()
    },
    view: function(vnode) {
        
        return m("div",{class:"pub-place-order-m"},[
            m("div",{class:"pub-place-order-tabs tabs is-small is-hidden-touch"},[
                m("ul",[
                    obj.getTabsList()
                ])
            ]),
            m('div', {class: "dropdown pub-place-order-select is-hidden-desktop" + (obj.tabsListOpen?' is-active':'')}, [
                m('.dropdown-trigger', {}, [
                    m('button', {class: "button is-white is-fullwidth",'aria-haspopup':true, "aria-controls": "dropdown-menu2", onclick: function(e){
                        obj.tabsListOpen = !obj.tabsListOpen
                        window.stopBubble(e)
                    }}, [
                        m('div', {}, [
                            m('span',{ class: ""}, obj.tabsList[obj.tabsActive]),
                            m('span', {class: "icon "},[
                                m('i', {class: "iconfont iconxiala has-text-primary", "aria-hidden": true })
                            ]),
                        ])
                    ]),
                ]),
                m('.dropdown-menu', {class:"max-height-500 scroll-y", id: "dropdown-menu2", role: "menu"}, [
                    m('.dropdown-content', {class:"has-text-centered"}, [
                        obj.getTabsList()
                    ]),
                ]),
            ]),
            obj.getTabsActiveContent()
        ])
    },
    onbeforeremove: function(){
        obj.rmEVBUS()
    }
}