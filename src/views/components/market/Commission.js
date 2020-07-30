
var m = require("mithril")

let obj = {
    open: false,
    optionFlag:[],
    ordList:{
        all:{
            id: 'all',
            name:"全选",
            option:true
        },
        limitOrd:{
            id: 1,
            name:"限价委托",
            option:true
        },
        marketOrd:{
            id: 2,
            name:"市价委托",
            option:true
        },
        limitPlan:{
            id: 3,
            name:"限价计划",
            option:true
        },
        marketPlan:{
            id: 4,
            name:"市价计划",
            option:true
        },
    },

    initEVBUS: function(){
        let that = this

        if (this.EV_OPENORDADJUST_UPD_unbinder) {
            this.EV_OPENORDADJUST_UPD_unbinder()
        }
        this.EV_OPENORDADJUST_UPD_unbinder = window.gEVBUS.on(gTrd.EV_OPENORDADJUST_UPD, arg => {
            that.open = true
            that.initUserInfo()
        })
        if (this.EV_SWITCHALL_UPD_unbinder) {
            this.EV_SWITCHALL_UPD_unbinder()
        }
        this.EV_SWITCHALL_UPD_unbinder = window.gEVBUS.on(gTrd.EV_SWITCHALL_UPD, arg => {
            that.getSwitchChange()
        })
        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD, arg => {
            that.initLanguage()
        })
        // if (this.EV_WEB_LOGIN_unbinder) {
        //     this.EV_WEB_LOGIN_unbinder()
        // }
        // this.EV_WEB_LOGIN_unbinder = window.gEVBUS.on(gWebAPI.EV_WEB_LOGIN, arg => {
        //     that.initUserInfo()
        // })
        // if (this.EV_WEB_LOGOUT_unbinder) {
        //     this.EV_WEB_LOGOUT_unbinder()
        // }
        // this.EV_WEB_LOGOUT_unbinder = window.gEVBUS.on(gWebAPI.EV_WEB_LOGOUT, arg => {
        //     that.initUserInfo()
        // })
    },

    initLanguage:function(){
        this.ordList.all.name = "全选"
        this.ordList.limitOrd.name = "限价委托"
        this.ordList.marketOrd.name = "市价委托"
        this.ordList.limitPlan.name = "限价计划"
        this.ordList.marketPlan.name = "市价计划"
    },
    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_OPENORDADJUST_UPD_unbinder) {
            this.EV_OPENORDADJUST_UPD_unbinder()
        }
        if (this.EV_SWITCHALL_UPD_unbinder) {
            this.EV_SWITCHALL_UPD_unbinder()
        }
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
        // if (this.EV_WEB_LOGIN_unbinder) {
        //     this.EV_WEB_LOGIN_unbinder()
        // }
        // if (this.EV_WEB_LOGOUT_unbinder) {
        //     this.EV_WEB_LOGOUT_unbinder()
        // }
    },

    initUserInfo:function(){
        this.optionFlag = window.gWebAPI.CTX.UserSetting.trade
        for(let key in this.ordList){
            if(key != "all"){
                let i = this.ordList[key].id - 1
                this.ordList[key].option = this.optionFlag[i]
            }
        }

        let num = 0
        for(let i=0;i<this.optionFlag.length-1;i++){
            if(this.optionFlag[i] == true){
                num+=1
            }
        }
        if(num == 4){
            this.ordList.all.option = true
        }else{
            this.ordList.all.option = false
        }
    },

    closeMode: function(){
        this.open = false
    },

    getSwitchType:function(item){
        item.option = !item.option
        if(item.id == "all"){
            if(item.option){
                for(let key in this.ordList){
                    this.ordList[key].option = true
                }
            }else {
                for(let key in this.ordList){
                    this.ordList[key].option = false
                }
            }
        }else {
            this.ordList.all.option = false
            let num = 0
            for(let key in this.ordList){
                if(this.ordList[key].option == true){
                    num +=1
                }
            }
            if(num == 4){
                this.ordList.all.option = true
            }
        }
    },

    getSwitchChange:function(){
        let that = this
        let ordList = Object.keys(this.ordList).slice(-4)
        // 根据配置筛选出需要现实的tab
        ordList = ordList.filter(key =>{
            return window.$config.future.placeOrder[key]
        })
        //筛选出来的数组中没有'all'，需要向头部添加
        ordList.unshift("all")
        return ordList.map((key,i)=>{
            let item = that.ordList[key]
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
        let ordList = {}
        for(let key in this.ordList){
            let i = this.ordList[key].id
            if(key != "all"){
                ordList["trade_" + i.toString()] = this.ordList[key].option
            }
        }
        let key = 'trade_5'
        let val = true
        ordList[key] = val
        console.log(ordList,11111111111)
        window.gWebAPI.ReqSaveUserSetting("trade",ordList)
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