var m = require("mithril")

import limitOrd from './limitOrd'
import marketOrd from './marketOrd'
import limitPlan from './limitPlan'
import marketPlan from './marketPlan'

import selectPos from './selectPos'

let obj = {
    tabsActive: 0,
    tabsList: ['限价委托', '市价委托', '限价计划', '市价计划'],
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
    }
}
export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
        
    },
    view: function(vnode) {
        
        return m("div",{class:"pub-place-order-m"},[
            m("div",{class:"pub-place-order-tabs tabs is-small"},[
                m("ul",[
                    obj.getTabsList()
                ])
            ]),
            obj.getTabsActiveContent()
        ])
    }
}