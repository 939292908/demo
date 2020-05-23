//合约账单

let m = require("mithril")


let languages = {

  initEVBUS: function(){
    let that = this
    
    if(this.EV_WEB_LOGIN_unbinder){
      this.EV_WEB_LOGIN_unbinder()
    }
    this.EV_WEB_LOGIN_unbinder = window.gEVBUS.on(gWebAPI.EV_WEB_LOGIN,arg=> {
      that.islogin = true
      that.initUserInfo()
    })

    if(this.EV_WEB_LOGOUT_unbinder){
      this.EV_WEB_LOGOUT_unbinder()
    }
    this.EV_WEB_LOGOUT_unbinder = window.gEVBUS.on(gWebAPI.EV_WEB_LOGOUT,arg=> {
      that.islogin = false
      that.userName = ''
    })  
  },
  rmEVBUS: function(){
    if(this.EV_WEB_LOGIN_unbinder){
      this.EV_WEB_LOGIN_unbinder()
    }
    if(this.EV_WEB_LOGOUT_unbinder){
      this.EV_WEB_LOGOUT_unbinder()
    }
  },

  getChangeLangDom: function(){
    return m("div",{class:"navbar-item has-dropdown is-hoverable"},[
      m("a",{class:"navbar-link"},[
        gDI18n.langList[gDI18n.locale].language
      ]),
      m("div",{class:"navbar-dropdown"},[
        languages.getChangeLangList()
      ])
    ])
  },

  getChangeLangList: function(){
    let langList = []
    for(let key in gDI18n.langList){
      let item = gDI18n.langList[key]
      if(item.open){
        langList.push(item)
      }
    }
    return langList.map(function(item,i){
        return m('div',{class : ""+(item.key == gDI18n.locale?' has-background-white-ter':''), onclick: function(){
          languages.setLang(item.key)
        }},[
          m('div',{class :"langageus-text",key: "ChangeLangListItem"+i+item},[
            m("p",{key: "ChangeLangListItem"+i+item, class:""+(item.key == gDI18n.locale?' has-text-primary':''),},[
              item.language
            ]),
            item.key == gDI18n.locale?m("i",{class : "iconfont icon-xuanze has-text-primary" + (item.key == gDI18n.locale?' ':''),key: "ChangeLangListItem"+i+item }):m("i",{class : {},key: "ChangeLangListItem"+i+item }),
          ])
        ]) 
    })
  },

  setLang: function(param){
    gDI18n.setLocale(param, arg => {
      console.log('change lang suc', arg)
      gEVBUS.emit(gDI18n.EV_CHANGELOCALE_UPD, {Ev: gDI18n.EV_CHANGELOCALE_UPD, locale:arg})
    })
  }
}

export default {
    oninit: function(vnode){

    },
    oncreate: function(vnode){
      languages.initEVBUS()
    },
    view:function(vnode){
        return m("div",{class: "details-header"},[
          m("nav",{class:"pub-layout-m-header is-fixed-top navbar is-transparent", role:"navigation", "aria-label":"main navigation"},[
            m('div', {class:"navbar-brand is-flex"}, [
            m('a', {class:"navbar-item"}, [
                m('a', {class:"",href:"/#!/future"}, [
                    m('span', {class:"icon icon-right-i"}, [
                        m('i', {class:"iconfont has-text-black iconarrow-left"}),
                    ]),
                ]),
            ]),
            m('.spacer'),
            m("p",{class : "delegation-list-phistory navbar-item has-text-black"},[
              gDI18n.$t('10434')//"切换语言"
                ]),
            m('.spacer'),
            m('.spacer'),
            ]),
        ]),
        m('div',{class :"pub-layout-m"},[
          languages.getChangeLangList()
        ]), 
        ])
    },
    onbeforeremove:function (vnode) {
      languages.rmEVBUS()
    }
}