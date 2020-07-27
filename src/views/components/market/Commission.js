
var m = require("mithril")

import Switch from '../common/Switch'

let obj = {
    open: false,
    ordList:[
        {
            id: 'all',
            name:"全选",
            option:true
        },
        {
            id: '1',
            name:"限价委托",
            option:true
        },
        {
            id: '2',
            name:"市价委托",
            option:true
        },
        {
            id: '3',
            name:"限价计划",
            option:true
        },
        {
            id: '4',
            name:"市价计划",
            option:true
        },
    ],

    initEVBUS: function(){
        let that = this

        if (this.EV_OPENORDADJUST_UPD_unbinder) {
            this.EV_OPENORDADJUST_UPD_unbinder()
        }
        this.EV_OPENORDADJUST_UPD_unbinder = window.gEVBUS.on(gTrd.EV_OPENORDADJUST_UPD, arg => {
            that.open = true
        })
    },

    initLanguage:function(){
        this.ordList = [
            {
                id: 'all',
                name:"全选",
                option:true
            },
            {
                id: '1',
                name:"限价委托",
                option:true
            },
            {
                id: '2',
                name:"市价委托",
                option:true
            },
            {
                id: '3',
                name:"限价计划",
                option:true
            },
            {
                id: '4',
                name:"市价计划",
                option:true
            },
        ]
    },
    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_OPENORDADJUST_UPD_unbinder) {
            this.EV_OPENORDADJUST_UPD_unbinder()
        }
    },

    closeMode: function(){
        this.open = false
    },

    getSetType:function(item,type){
        console.log(item, type)
        switch(item.id){
            case "all":
                if(!type){
                    for(let i in this.ordList){
                        this.ordList[i].option = false
                    }
                }else if(type){
                    for(let i in this.ordList){
                        this.ordList[i].option = true
                    }
                }
                break;
        }
        console.log(this.ordList)
    },

    getSwitchChange:function(){
        return this.ordList.map((item,i)=>{
            return m('div',{class:"switch-pd",key:"getswitchchange" + i + item.id},[
                item.name,
                m(Switch, {
                    class: 'is-pulled-right',
                    type: item.option,
                    onclick (type) {
                        obj.getSetType(item,type)
                    },
                })
            ])
        })
    },
    submit:function(){
        this.open = false
    },
}

export default {
    oninit: function (vnode) {
  
    },
    oncreate: function (vnode) {
        obj.initEVBUS()
        obj.initLanguage()
    },
    view: function (vnode) {
  
      return m('div', {class: 'pub-stoppl'}, [
        m("div", { class: "modal" + (obj.open ? " is-active" : ''), }, [
          m("div", { class: "modal-background", onclick: () => { obj.open = false}}),
          m("div", { class: "modal-card modal-card-width" }, [
            m("header", { class: "pub-stoppl-head modal-card-head modal-card-font-title" }, [
              m("p", { class: "modal-card-title" }, [
                '委托确认'
              ]),
              m("button", {
                class: "delete", "aria-label": "close", onclick: function () {
                  obj.closeMode()
                }
              }),
              
            ]),
            m("section", { class: "pub-stoppl-content modal-card-body has-text-2 modal-card-font-subtitle" }, [
                m('div',{class:"switch-pd"},[
                    '开启委托确认功能后，您在合约交易的每次提交委托都会跳出确认弹框。'
                ]),
                m('div',{class:""},[
                    obj.getSwitchChange()
                ])
            ]),
            m("footer", { class: "pub-stoppl-foot modal-card-foot" }, [
              m("button", {
                class: "button is-primary has-text-white", onclick: function () {
                  obj.submit()
                }
              }, [
                gDI18n.$t('10051')//'确定'
              ]),
            ]),
          ])
        ])
      ])
  
    },
    onremove: function (vnode) {
        obj.rmEVBUS()
    },
  }