var m = require("mithril")

import limitOrd from './limitOrd'
import marketOrd from './marketOrd'
import limitPlan from './limitPlan'
import marketPlan from './marketPlan'

import selectPos from './selectPos'

let obj = {
    tabsActive: 0,
    tabsList: [gDI18n.$t('10117'),gDI18n.$t('10118'),gDI18n.$t('10119'),gDI18n.$t('10120')],//['限价委托', '市价委托', '限价计划', '市价计划'],
    setTabsActive: function(param){
        this.tabsActive = param
    },
    getTabsList: function(){
        return this.tabsList.map(function(item,i){
            return m("li",{class:""+(obj.tabsActive == i?' is-active':'')},[
                m("a",{key: "orderListTabsItem"+i, class:"a-button-pad", href:"javascript:void(0);", onclick: function(){
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
    initLanguage: function(){
        this.tabsList = [gDI18n.$t('10117'),gDI18n.$t('10118'),gDI18n.$t('10119'),gDI18n.$t('10120')]
    }
}
export default {
    oninit: function(vnode){
        obj.initEVBUS()
        obj.initLanguage()
    },
    oncreate: function(vnode){
        
    },
    view: function(vnode) {
        
        return m("div",{class:"pub-place-order box"},[
            obj.getSelectPos(),
            m("div",{class:"pub-place-order-tabs tabs is-small"},[
                m("ul",[
                    obj.getTabsList()
                ])
            ]),
            obj.getTabsActiveContent()
        ])
    },
    onbeforeremove: function (vnode) {
        obj.rmEVBUS()
    },
}