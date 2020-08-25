import utils from "../../../utils/utils"

var m = require("mithril")

let obj = {
    open: false,
    setType: window.$config.future.UPNLPrzActive == "1"?1:0,

    setingList:[
      {
        id:"Set_1",
        value:gDI18n.$t('10436')//"标记价格"
      },
      {
        id:"Set_2",
        value: gDI18n.$t('10629'), //"最新价格"
      },
    ],

    initEVBUS: function(){
        let that = this

        if (this.EV_OPENIMPLEMENTED_UPD_unbinder) {
            this.EV_OPENIMPLEMENTED_UPD_unbinder()
        }
        this.EV_OPENIMPLEMENTED_UPD_unbinder = window.gEVBUS.on(gTrd.EV_OPENIMPLEMENTED_UPD, arg => {
            that.open = true
        })
    },

    initLanguage:function(){
      obj.setingList = [
        {
          id:"Set_1",
          value:gDI18n.$t('10436')//"标记价格"
        },
        {
          id:"Set_2",
          value: gDI18n.$t('10629'), //"最新价格"
        },
      ]
    },
    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_OPENIMPLEMENTED_UPD_unbinder) {
            this.EV_OPENIMPLEMENTED_UPD_unbinder()
        }
    },

    closeMode: function(){
      this.setType = window.$config.future.UPNLPrzActive == "1"?1:0
      this.open = false
    },
    submit:function(){
      switch(this.setType){
        case 0:
          window.$config.future.UPNLPrzActive = "2"
          utils.setItem("UPNLPrzActiveSeted",window.$config.future.UPNLPrzActive)
          break;
        case 1:
          window.$config.future.UPNLPrzActive = "1"
          utils.setItem("UPNLPrzActiveSeted",window.$config.future.UPNLPrzActive)
          break;
      }
      this.open = false
    },

    setTypeOfInput:function(num){
      this.setType = num
    },

    getSetingOrd:function(){
      return this.setingList.map((item,i)=>{
        return m('label',{class:"radio",key:"setlist"+i+item.id},[
          m('input',{type:"radio",name:"answer",checked : (i == obj.setType),onclick:function(){
            obj.setTypeOfInput(i)
          }},[
            
          ]),
          m('span',[
            item.value
          ])
        ])
      })
    },
}

export default {
    oninit: function (vnode) {
  
    },
    oncreate: function (vnode) {
      obj.initLanguage()
      obj.initEVBUS()
    },
    view: function (vnode) {
  
      return m('div', {class: 'pub-stoppl'}, [
        m("div", { class: "modal" + (obj.open ? " is-active" : ''), }, [
          m("div", { class: "modal-background", onclick: () => {
            obj.closeMode()
          }}),
          m("div", { class: "modal-card" }, [
            m("header", { class: "pub-stoppl-head modal-card-head" }, [
              m("p", { class: "modal-card-title" }, [
                gDI18n.$t('10630'), //'合约设置'
              ]),
              m("button", {
                class: "delete", "aria-label": "close", onclick: function () {
                  obj.closeMode()
                }
              }),
            ]),
            m("section", { class: "pub-stoppl-content modal-card-body has-text-2" }, [
              m('div',{class:"control is-between ord-set"},[
                gDI18n.$t('10631'), //"未实现盈亏计算",
                obj.getSetingOrd()
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