
var m = require("mithril")

let obj = {
    open: false,
    posList : [],
    closeType : null,

    initEVBUS: function(){
        let that = this

        if(this.EV_ALL_CLOSE_LIST_UPD_unbinder){
            this.EV_ALL_CLOSE_LIST_UPD_unbinder()
        }
        this.EV_ALL_CLOSE_LIST_UPD_unbinder = window.gEVBUS.on(gEVBUS.EV_ALL_CLOSE_LIST_UPD,arg=> {
            that.posList = arg.data.posList
            that.open = true
            that.getOrdType(arg.data.type)
        })
        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD, arg => {
            that.initLanguage()
        })
    },

    initLanguage:function(){

    },
    //删除全局广播
    rmEVBUS: function () {
        if(this.EV_OPENCLOSEPOSITION_UPD_unbinder){
            this.EV_OPENCLOSEPOSITION_UPD_unbinder()
        }
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
    },

    closeMode: function(){
        this.open = false
    },
    submit:function(){
        let pos = this.posList
        pos.map((item)=>{
            gTrd.ReqTrdOrderDel({
                "AId": item.AId,
                "OrdId": item.OrdId,
                "Sym": item.Sym,
                "PId": item.PId,
            }, function (gTrd, arg) {
                if (arg.code != 0 || arg.data.ErrCode) {
                    window.$message({ title: gDI18n.$t('10037'/*"提示"*/), content: utils.getTradeErrorCode(arg.code || arg.data.ErrCode), type: 'danger' })
                }
            })
        })
        this.open = false
    },
    getOrdType:function(ordType){
        this.closeType = ordType == 1?'是否删除当前全部委托订单?' : "是否删除当前计划单?"
    }
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
                gDI18n.$t('10037'/*"提示"*/)
              ]),
              m("button", {
                class: "delete", "aria-label": "close", onclick: function () {
                  obj.closeMode()
                }
              }),
              
            ]),
            m("section", { class: "pub-stoppl-content modal-card-body has-text-2 modal-card-font-subtitle" }, [
                obj.closeType
                
            ]),
            m("footer", { class: "pub-stoppl-foot modal-card-foot" }, [
              m("button", {
                class: "button is-primary has-text-white", onclick: function () {
                    obj.closeMode()
                }
              }, [
                gDI18n.$t('10052'/*'取消'*/)
              ]),
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
        obj.posList = []
        obj.rmEVBUS()
    },
  }