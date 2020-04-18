var m = require("mithril")

import position from './position'
import order from './order'
import planList from './planList'
import historyOrd from './historyOrd'
import historyTrade from './historyTrade'
import wltRec from './wltRec'


let obj = {
    tabsActive: 0,
    tabsList: ['持有仓位', '当前委托', '当前计划', '历史委托', '成交记录', '合约账单'],
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
                return m(position)
            case 1: 
                return m(order)
            case 2: 
                return m(planList)
            case 3: 
                return m(historyOrd)
            case 4: 
                return m(historyTrade)
            case 5: 
                return m(wltRec)
        }
    }
}

export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
        
    },
    view: function(vnode) {
        
        return m("div",{class:"pub-trade-list box has-text-centered"},[
            m("div",{class:"pub-trade-list-tabs tabs "},[
                m("ul",[
                    obj.getTabsList()
                ])
            ]),
            obj.getTabsActiveContent()
        ])
    }
}