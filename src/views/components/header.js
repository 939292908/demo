var m = require("mithril")

let header = {
  islogin: false,
  userName: '',
  headerMenu: false,
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
  setTradeStatus: function(status){
    window.gMkt.CtxPlaying.pageTradeStatus = status
    gEVBUS.EmitDeDuplicate(window.gMkt.EV_PAGETRADESTATUS_UPD,50,window.gMkt.EV_PAGETRADESTATUS_UPD, {Ev: window.gMkt.EV_PAGETRADESTATUS_UPD})
  },
  initUserInfo(){
    let account = window.gWebAPI.CTX.account
    this.userName = account.accountName
  },
  getLoginDom: function(){
    if(this.islogin){
      return m("div",{class:"navbar-item has-dropdown is-hoverable"},[
        m("a",{class:"navbar-link"},[
          this.userName
        ]),
        m("div",{class:"navbar-dropdown"},[
          m("a",{class:"navbar-item", onclick: this.signOut},[
            gDI18n.$t('10003'/*'退出'*/)
          ])
        ])
      ])
    }else{
      let loginType = window.$config.loginType
      switch(loginType){
        case 0:
          return m("div",{class:"navbar-item"},[
            m("div",{class:"buttons"},[
              header.getLogin()
            ])
          ])
        case 1:
          return null
      }
      
    }
  },
  signOut: function(){
    let loginType = window.$config.loginType
    switch(loginType){
      case 0:
        window.gWebAPI.ReqSignOut({}, function(res){
          console.log('ReqSignOut success ==>> ',res)
          if(res.result.code === 0){
            window.$message({title: gDI18n.$t('10004'/*'退出登录成功！'*/),content: gDI18n.$t('10004'/*'退出登录成功！'*/), type: 'success'})
          }else{
            window.$message({title: gDI18n.$t('10005'/*'退出登录失败！'*/),content: gDI18n.$t('10005'/*'退出登录失败！'*/), type: 'danger'})
          }
        }, function(err){
            window.$message({title: gDI18n.$t('10006'/*'操作超时'*/),content: gDI18n.$t('10006'/*'操作超时'*/), type: 'danger'})
            console.log('ReqSignOut => ', err)
        })
        break;
      case 1:
        header.customSignOut({onSuc: function(arg){
          let s = window.gWebAPI
          s.CleanAccount()
          gEVBUS.emit(s.EV_WEB_LOGOUT,{d:s.CTX})
        }})
        break;
      default:

    }
    
  },
  customSignOut: function({onSuc}){
    // 在此处定义退出登录请求处理，退出登录成功后调用onSuc
  },
  getLeftCon: function(){
    let type = window.$config.views.header.left.type
    if(type == 0){
      return m("div",{class:"navbar-menu"},[
        m("div",{class:"navbar-start"},[
          m('a', {class:"navbar-item"+(window.gMkt.CtxPlaying.pageTradeStatus == 1 ?' has-text-primary':''), onclick:function(){
            header.setTradeStatus(1)
          }}, [
            gDI18n.$t('10001'/*合约交易*/),
          ]),
          // m('a', {class:"navbar-item"+(window.gMkt.CtxPlaying.pageTradeStatus == 2 ?' has-text-primary':''), onclick:function(){
          //   header.setTradeStatus(2)
          // }}, [
          //   '现货交易',
          // ]),
        ])
      ])
    }else{
      return this.customLeft()
    }
  },
  customLeft: function(){
    
  },
  getRightCon: function(){
    let type = window.$config.views.header.right.type
    if(type == 0){
      return m("div",{class:"navbar-menu"},[
        m("div",{class:"navbar-end"},[
          header.getChangeLangDom(),
          header.getLoginDom()
        ])
      ])
    }else{
      return this.customRight()
    }
  },
  customRight: function(){
    
  },
  getLogoCon: function(){
    let type = window.$config.views.header.logo.type
    if(type == 0){
      return m('div', {class:"navbar-brand"}, [
        m('a', {class:"navbar-item"}, [
          m('img', {src:headerLogo, height: "28"}),
        ]),
        m('a', {role:"button", class:"navbar-burger burger","aria-label":"menu", "aria-expanded":"false", "data-target":"navbarBasicExample", onclick: function(){
          header.headerMenu = !header.headerMenu
        }}, [
          m('span', {"aria-hidden":"true"}, []),
          m('span', {"aria-hidden":"true"}, []),
          m('span', {"aria-hidden":"true"}, []),
        ]),
      ])
    }else{
      return this.customLogo()
    }
  },
  customLogo: function(){
    
  },
  getLogin: function(){
    let type = window.$config.views.login.type
    if(type == 0){
      return m(login)
    }else{
      return this.customLogin()
    }
  },
  customLogin: function(){
    
  },
  getMenuCon: function(){
    let type = window.$config.views.login.type
    if(type == 0){
      return m("div",{class:"navbar-menu is-hidden-desktop"+(header.headerMenu?' is-active':' is-hidden')},[
        m("div",{class:"navbar-end"},[
          header.getLoginDom()
        ])
      ])
    }else{
      return this.customMenu()
    }
  },
  customMenu: function(){
    
  },
  getChangeLangDom: function(){
    return m("div",{class:"navbar-item has-dropdown is-hoverable"},[
      m("a",{class:"navbar-link"},[
        gDI18n.langList[gDI18n.locale].language
      ]),
      m("div",{class:"navbar-dropdown"},[
        header.getChangeLangList()
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
        return m("a",{key: "ChangeLangListItem"+i+item, class:"navbar-item"+(item.key == gDI18n.locale?' has-text-primary':''), onclick: function(){
          header.setLang(item.key)
        }},[
          item.language
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
import headerLogo from '../../../tplibs/img/header-logo.png'
import login from './userCenter/login'
export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
        header.initEVBUS()
    },
    view: function(vnode) {
        
        return m("nav",{class:"pub-header navbar is-fixed-top is-transparent", role:"navigation", "aria-label":"main navigation"},[
          header.getLogoCon(),
          header.getLeftCon(),
          header.getRightCon(),
          header.getMenuCon()
        ])
    },
    onbeforeremove: function(vnode) {
      header.rmEVBUS()
    },
}