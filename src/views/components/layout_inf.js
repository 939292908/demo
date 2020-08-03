var m = require("mithril")

import explanation from './futureInfromation/explanation'
import fundRateHistory from './futureInfromation/fundRateHistory'
import futureIndex from './futureInfromation/futureIndex'

let obj = {

    initEVBUS:function(){
        let that = this

        // //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD, arg => {
            that.initLanguage()
        })
    },

    rmEVBUS:function(){
        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
    },

    informationList:[
        {
            id:0,
            name:"合约详解"
        },
        {
            id:1,
            name:gDI18n.$t('10413')//"指数"
        },
        {
            id:2,
            name:"资金费率历史"
        },
    ],

    initLanguage:function(){
        this.informationList = [
            {
                id:0,
                name:"合约详解"
            },
            {
                id:1,
                name:gDI18n.$t('10413')//"指数"
            },
            {
                id:2,
                name:"资金费率历史"
            },
        ]
    },

    setInType:function(num){
        window.$inType = num
    },

    getTableList:function(){
        return this.informationList.map((item,i)=>{
            return m('li',{class:"cursor-pointer inf_body_switch " + (window.$inType == i?" is-active":""),key:"informationList"+item+i,onclick:function(){
                obj.setInType(i)
            }},[
                m('a',{},[
                    item.name
                ])
            ])
        })
    },
    getSwitchConent:function(){
        switch(window.$inType){
            case 0:
                return m(explanation);
            case 1:
                return m(futureIndex);
            case 2:
                return m(fundRateHistory);
        }
    },



  
}


export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
        obj.initLanguage()
        obj.initEVBUS()
    },
    view: function(vnode) {
        return m("div",{class: " inf_body has-text-1"}, [
            m('div',{class:" inf_body_information"},[
                m('div',{class:"inf_body_title"},[
                    '合约信息'
                ]),
                m('div',{class:"tabs"},[
                    m('ul',{class:"is-flex"},[
                        obj.getTableList()
                    ]),
                ]),
                obj.getSwitchConent()
            ]),
        ])
    },
    onremove: function (vnode) {
        obj.rmEVBUS()
        window.$inType = null
    },
}