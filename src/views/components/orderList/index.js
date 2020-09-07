var m = require("mithril")

import position from './position'
import order from './order'
import planList from './planList'
import historyOrd from './historyOrd'
import historyTrade from './historyTrade'
import wltRec from './wltRec'
import myInsurance from './myInsurance' // 我的保险
import Dropdown from '../common/Dropdown'

let obj = {
    showMenu: false,
    tabsActive: 0,
    dropdownActive: 1,
    listNumber:0,
    tabsList: [
        {
            id: 0,
            key: 'pos',
            name: gDI18n.$t('10074'),//'持有仓位',
            class: '',
            listNumber: 0
        },{
            id: 1,
            key: 'ord',
            name: gDI18n.$t('10075'),//'当前委托',
            class: '',
            listNumber: 0
        },{
            id: 2,
            key: 'plan',
            name: gDI18n.$t('10076'),//'当前计划',
            class: '',
            listNumber: 0
        },{
            id: 3,
            key: 'historyOrd',
            name: gDI18n.$t('10077'),//'历史委托',
            class: ' is-hidden-touch',
            listNumber: ''
        },{
            id: 4,
            key: 'historyTrd',
            name: gDI18n.$t('10078'),//'成交记录',
            class: ' is-hidden-touch',
            listNumber: ''
        },{
            id: 5,
            key: 'wlt',
            name: gDI18n.$t('10079'),//'合约账单',
            class: ' is-hidden-touch',
            listNumber: ''
        },{
            id: 6,
            key: 'myInsurance',
            name: '我的保险', //'我的保险',
            class: ' is-hidden-touch',
            listNumber: ''
        }
    ],
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
        //获取持有仓位
        if(this.EV_POS_UPD_unbinder){
            this.EV_POS_UPD_unbinder()
        }
        this.EV_POS_UPD_unbinder = window.gEVBUS.on(gTrd.EV_POS_UPD,arg=> {
            that.getPosList()
        })
        //仓位选择筛选
        if (this.EV_DROPDOWN_UP_unbinder) {
            this.EV_DROPDOWN_UP_unbinder()
        }
        this.EV_DROPDOWN_UP_unbinder = window.gEVBUS.on(gEVBUS.EV_DROPDOWN_UP, arg => {
            that.getPosList()
            that.getOrderList()
        })
        //当前委托
        if (this.EV_GET_ORD_READY_unbinder) {
            this.EV_GET_ORD_READY_unbinder()
        }
        this.EV_GET_ORD_READY_unbinder = window.gEVBUS.on(gTrd.EV_GET_ORD_READY, arg => {
            that.getOrderList()
        })
        if (this.EV_ORD_UPD_unbinder) {
            this.EV_ORD_UPD_unbinder()
        }
        this.EV_ORD_UPD_unbinder = window.gEVBUS.on(gTrd.EV_ORD_UPD, arg => {
            that.getOrderList()
        })
        // assetD合约详情全局广播
        if (this.EV_ASSETD_UPD_unbinder) {
            this.EV_ASSETD_UPD_unbinder()
        }
        this.EV_ASSETD_UPD_unbinder = window.gEVBUS.on(gMkt.EV_ASSETD_UPD, arg => {
            that.getPosList()
            that.getOrderList()
        })
    },

    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
        //获取持有仓位
        if(this.EV_POS_UPD_unbinder){
            this.EV_POS_UPD_unbinder()
        }
        //仓位选择筛选
        if (this.EV_DROPDOWN_UP_unbinder) {
            this.EV_DROPDOWN_UP_unbinder()
        }
        //当前委托
        if (this.EV_GET_ORD_READY_unbinder) {
            this.EV_GET_ORD_READY_unbinder()
        }
        if (this.EV_ORD_UPD_unbinder) {
            this.EV_ORD_UPD_unbinder()
        }
        // assetD合约详情全局广播
        if (this.EV_ASSETD_UPD_unbinder) {
            this.EV_ASSETD_UPD_unbinder()
        }
    },

    //获取仓位个数
    getPosList : function(){
        let Poss =window.gTrd.Poss
        let posList = []
        let UPNLPrzActive = window.$config.future.UPNLPrzActive
        if (window.$dropdownType ==1){
            for(let key in Poss){
                let pos = Poss[key]
                let ass = window.gMkt.AssetD[pos.Sym]
                let lastTick = window.gMkt.lastTick[pos.Sym]
                let obj = utils.getPosInfo(pos.PId, Poss, ass,UPNLPrzActive, lastTick)
                if(obj && obj.Sz != 0){
                    posList.push(obj)
                }
            }
        } else {
            let Sym= window.gMkt.CtxPlaying.Sym
            for (let key in Poss) {
                let pos = Poss[key]
                let ass = window.gMkt.AssetD[pos.Sym]
                let lastTick = window.gMkt.lastTick[pos.Sym]
                let obj = utils.getPosInfo(pos.PId, Poss, ass, UPNLPrzActive, lastTick)
                if(obj.Sym == Sym){
                    if (obj && obj.Sz != 0) {
                        posList.push(obj)
                    }
                }  
            }
        }
        let listNum = posList.length
        obj.tabsList[0].listNumber = listNum
    },
    
    getOrderList:function(){
        let Orders = window.gTrd.Orders['01']
        let posList = []
        let ordList = []
        for (let key in Orders) {
            let order = Orders[key]
            let obj = {}
            let ass = window.gMkt.AssetD[order.Sym]
            //获取当前委托个数
            //当前委托只显示OType为1、2的委托单
            if (ass && (order.OType == 1 || order.OType == 2)) {
                utils.copyTab(obj, order)
                if (window.$dropdownType == 1) {
                    posList.push(obj)
                } else {
                    let Sym = window.gMkt.CtxPlaying.Sym
                    if (obj.Sym == Sym) {
                        posList.push(obj)
                    }
                }
            }
            //获取当前计划个数
            //当前计划只显示OType为3、4的委托单
            if (ass && (order.OType == 3 || order.OType == 4)) {
                utils.copyTab(obj, order)
                if (window.$dropdownType == 1) {
                    ordList.push(obj)
                } else {
                    let Sym = window.gMkt.CtxPlaying.Sym
                    if (obj.Sym == Sym) {
                        ordList.push(obj)
                    }
                }
            }
        }
        let posNum = posList.length
        let ordNum = ordList.length
        obj.tabsList[1].listNumber = posNum
        obj.tabsList[2].listNumber = ordNum
    },

    

    initLanguage: function(){
        this.tabsList = [
            {
                id: 0,
                key: 'pos',
                name: gDI18n.$t('10074'),//'持有仓位',
                class: '',
                listNumber: 0
            },{
                id: 1,
                key: 'ord',
                name: gDI18n.$t('10075'),//'当前委托',
                class: '',
                listNumber: 0
            },{
                id: 2,
                key: 'plan',
                name: gDI18n.$t('10076'),//'当前计划',
                class: '',
                listNumber: 0
            },{
                id: 3,
                key: 'historyOrd',
                name: gDI18n.$t('10077'),//'历史委托',
                class: ' is-hidden-touch',
                listNumber: ''
            },{
                id: 4,
                key: 'historyTrd',
                name: gDI18n.$t('10078'),//'成交记录',
                class: ' is-hidden-touch',
                listNumber: ''
            },{
                id: 5,
                key: 'wlt',
                name: gDI18n.$t('10079'),//'合约账单',
                class: ' is-hidden-touch',
                listNumber: ''
            },
            {
                id: 6,
                key: 'myInsurance',
                name: '我的保险', //'我的保险',
                class: ' is-hidden-touch',
                listNumber: ''
            }
        ]
    },

    myclickType(item) {
        window.$dropdownType = item.id
        gEVBUS.emit(gEVBUS.EV_DROPDOWN_UP, { Ev: gEVBUS.EV_DROPDOWN_UP, data: { item: window.$dropdownType } })
    },

    getTabsList: function(){
        let tabsList = this.tabsList.filter(item =>{
            return window.$config.future.orderList[item.key]
        })
        return tabsList.map(function(item,i){
            return m("li",{class:""+(obj.tabsActive == item.id?' is-active':'')},[
                m("a",{key: "orderListTabsItem"+i, class:""+item.class, href:"javascript:void(0);", onclick: function(){
                    obj.setTabsActive(item.id)
                }},[
                    item.name ,
                    (i == 0 || i == 1 || i == 2) ? "[" + item.listNumber + "]" : ""
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
            case 6: 
                return m(myInsurance) // 我的保险
        }
    }
}

export default {
    bodyEven: false,
    oninit: function(vnode){
        obj.initEVBUS()
        obj.initLanguage()
        window.$dropdownType = 1
    },
    oncreate: function(vnode){
        
    },
    view: function(vnode) {
        
        return m("div",{class:"pub-trade-list "+(window.isMobile?'':' box')},[
            m("div",{class:"pub-trade-list-tabs tabs "},[
                m("ul",[
                    obj.getTabsList()
                ]),
                m( Dropdown, {
                    class: 'pub-trade-list-tabs-dropdown is-hidden-mobile' + (obj.tabsActive == 5 ? " is-hidden" : ""),
                    activeId: cb => cb(obj, 'dropdownActive'),
                    showMenu: obj.showMenu,
                    setShowMenu: type => obj.showMenu = type,
                    bodyEven: this.bodyEven,
                    setBodyEven: (type) => {
                        this.bodyEven = type
                        console.log(this.bodyEven,666);
                    },
                    menuWidth:110,
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
                                label: gDI18n.$t('10518')//显示当前合约
                            }
                        ]
                    }
                })
            ]),
            obj.getTabsActiveContent()
        ])
    },
    onremove:function(vnode){
        obj.rmEVBUS()
    }
}