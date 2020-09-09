
var m = require("mithril")

let obj = {
    open: false,
    posList : [],
    errorNum : [],

    initEVBUS: function(){
        let that = this

        if(this.EV_OPENCLOSEPOSITION_UPD_unbinder){
            this.EV_OPENCLOSEPOSITION_UPD_unbinder()
        }
        this.EV_OPENCLOSEPOSITION_UPD_unbinder = window.gEVBUS.on(gEVBUS.EV_OPENCLOSEPOSITION_UPD,arg=> {
            that.open = true
            that.posList = arg.data.posList
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
            let p = {
                AId: item.AId,
                Sym: item.Sym,
                COrdId: new Date().getTime()+'',
                Dir: item.Sz>0? -1: 1,
                OType: 2,
                Prz: 1,
                Qty: Math.abs(item.Sz),
                QtyDsp: 0,
                Tif: 1,
                OrdFlag: 2, //只减仓
                PrzChg: 10,
                PId: item.PId,
                lvr: item.Lever,
                MIRMy: item.MIRMy,
                isClose: true
              }
            window.gTrd.ReqTrdOrderNew(p, function(gTrd, arg){
                pos.loading = false
                if (arg.code != 0 || arg.data.ErrCode) {
                //   window.$message({ title: gDI18n.$t('10037'/*"提示"*/),content: utils.getTradeErrorCode(msg.code || arg.data.ErrCode), type: 'danger'})
                }
            })
        })
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
                '市价平仓'
              ]),
              m("button", {
                class: "delete", "aria-label": "close", onclick: function () {
                  obj.closeMode()
                }
              }),
              
            ]),
            m("section", { class: "pub-stoppl-content modal-card-body has-text-2 modal-card-font-subtitle" }, [
                '请确认是否要以市价全部平仓'
            ]),
            m("footer", { class: "pub-stoppl-foot modal-card-foot" }, [
              m("button", {
                class: "button is-primary has-text-white", onclick: function () {
                    obj.closeMode()
                }
              }, [
                '取消'
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