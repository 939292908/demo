
var m = require("mithril")

let obj = {
    open: false,

    initEVBUS: function(){
        let that = this

        if (this.EV_OPENORDADJUST_UPD_unbinder) {
            this.EV_OPENORDADJUST_UPD_unbinder()
        }
        this.EV_OPENORDADJUST_UPD_unbinder = window.gEVBUS.on(gTrd.EV_OPENORDADJUST_UPD, arg => {
            that.open = true
        })
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
    submit:function(){
        this.open = false
    },
}

export default {
    oninit: function (vnode) {
  
    },
    oncreate: function (vnode) {
        obj.initEVBUS()
    },
    view: function (vnode) {
  
      return m('div', {class: 'pub-stoppl'}, [
        m("div", { class: "modal" + (obj.open ? " is-active" : ''), }, [
          m("div", { class: "modal-background", onclick: () => { obj.open = false}}),
          m("div", { class: "modal-card" }, [
            m("header", { class: "pub-stoppl-head modal-card-head" }, [
              m("p", { class: "modal-card-title" }, [
                '委托确认'
              ]),
              m("button", {
                class: "delete", "aria-label": "close", onclick: function () {
                  obj.closeMode()
                }
              }),
            ]),
            m("section", { class: "pub-stoppl-content modal-card-body has-text-2" }, [
              
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