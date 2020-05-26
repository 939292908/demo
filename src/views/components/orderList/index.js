var m = require("mithril")

import position from './position'
import order from './order'
import planList from './planList'
import historyOrd from './historyOrd'
import historyTrade from './historyTrade'
import wltRec from './wltRec'


let obj = {
    tabsActive: 0,
    tabsList: [{
        name: gDI18n.$t('10074'),//'持有仓位',
        class: '',
    },{
        name: gDI18n.$t('10075'),//'当前委托',
        class: '',
    },{
        name: gDI18n.$t('10076'),//'当前计划',
        class: '',
    },{
        name: gDI18n.$t('10077'),//'历史委托',
        class: ' is-hidden-touch',
    },{
        name: gDI18n.$t('10078'),//'成交记录',
        class: ' is-hidden-touch',
    },{
        name: gDI18n.$t('10079'),//'合约账单',
        class: ' is-hidden-touch',
    }],
    setTabsActive: function(param){
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

    initLanguage: function(){
        this.tabsList = [{
            name: gDI18n.$t('10074'),//'持有仓位',
            class: '',
        },{
            name: gDI18n.$t('10075'),//'当前委托',
            class: '',
        },{
            name: gDI18n.$t('10076'),//'当前计划',
            class: '',
        },{
            name: gDI18n.$t('10077'),//'历史委托',
            class: ' is-hidden-touch',
        },{
            name: gDI18n.$t('10078'),//'成交记录',
            class: ' is-hidden-touch',
        },{
            name: gDI18n.$t('10079'),//'合约账单',
            class: ' is-hidden-touch',
        }]
    },

    getTabsList: function(){
        return this.tabsList.map(function(item,i){
            return m("li",{class:""+(obj.tabsActive == i?' is-active':'')},[
                m("a",{key: "orderListTabsItem"+i, class:""+item.class, href:"javascript:void(0);", onclick: function(){
                    obj.setTabsActive(i)
                }},[
                    item.name
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
        obj.initEVBUS()
    },
    oncreate: function(vnode){
        
    },
    view: function(vnode) {
        
        return m("div",{class:"pub-trade-list "+(window.isMobile?'':' box')},[
            m("div",{class:"pub-trade-list-tabs tabs "},[
                m("ul",[
                    obj.getTabsList()
                ])
            ]),
            obj.getTabsActiveContent()
        ])
    },
    onbeforeremove:function(vnode){
        obj.rmEVBUS()
    }
}