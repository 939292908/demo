
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
    switchList:[true,true,true,true,true],

    initEVBUS: function(){
        let that = this

        if (this.EV_OPENORDADJUST_UPD_unbinder) {
            this.EV_OPENORDADJUST_UPD_unbinder()
        }
        this.EV_OPENORDADJUST_UPD_unbinder = window.gEVBUS.on(gTrd.EV_OPENORDADJUST_UPD, arg => {
            that.open = true
        })
        if (this.EV_SWITCHALL_UPD_unbinder) {
            this.EV_SWITCHALL_UPD_unbinder()
        }
        this.EV_SWITCHALL_UPD_unbinder = window.gEVBUS.on(gTrd.EV_SWITCHALL_UPD, arg => {
            that.getSwitchChange()
            console.log(1111111111)
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
        if (this.EV_SWITCHALL_UPD_unbinder) {
            this.EV_SWITCHALL_UPD_unbinder()
        }
    },

    closeMode: function(){
        this.open = false
    },

    getSwitchType:function(item){
        item.option = !item.option
        if(item.id == "all"){
            if(item.option){
                for(let i in this.ordList){
                    this.ordList[i].option = true
                }
            }else {
                for(let i in this.ordList){
                    this.ordList[i].option = false
                }
            }
        }else {
            this.ordList[0].option = false
            let num = 0
            for(let i=1;i<this.ordList.length;i++){
                if(this.ordList[i].option == true){
                    num +=1
                } 
            }
            if(num == 4){
                this.ordList[0].option = true
            }
        }
    },

    getSwitchChange:function(){
        return this.ordList.map((item,i)=>{
            return m('div',{class:"switch-pd",key:"getswitchchange" + i + item.id},[
                item.name,
                m('span',{class:"is-pulled-right my-switch" + (item.option?" is-checked" : ""),onclick:function(e){
                    window.stopBubble(e)
                    obj.getSwitchType(item)
                }},)
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