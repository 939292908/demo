var m = require("mithril")

let header = {
  islogin: false,
  userName: '',
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
    if(account.loginType == 'email'){
      this.userName = account.accountName
    }else if(account.loginType == 'phone'){
      this.userName = account.accountName
    }
  },
  getLoginDom: function(){
    if(this.islogin){
      return m("div",{class:"navbar-item has-dropdown is-hoverable"},[
        m("a",{class:"navbar-link"},[
          this.userName
        ]),
        m("div",{class:"navbar-dropdown"},[
          m("a",{class:"navbar-item", onclick: this.signOut},[
            '退出'
          ])
        ])
      ])
      
    }else{
      return m("div",{class:"navbar-item"},[
        m("div",{class:"buttons"},[
          header.getLogin()
        ])
      ])
    }
  },
  signOut: function(){
    window.gWebAPI.ReqSignOut({}, function(res){
      console.log('ReqSignOut success ==>> ',res)
      if(res.result.code === 0){
        window.$message({content: '退出登录成功！', type: 'success'})
      }else{
        window.$message({content: '退出登录失败！', type: 'danger'})
      }
    }, function(err){
        that.loginLoading = false
        window.$message({content: '操作超时', type: 'danger'})
        console.log('ReqSignOut => ', err)
    })
  },
  getLeftCon: function(){
    let type = window.$config.views.header.left.type
    if(type == 0){
      return m("div",{id: "navbarBasicExample",class:"navbar-menu"},[
        m('a', {class:"navbar-item"+(window.gMkt.CtxPlaying.pageTradeStatus == 1 ?' has-text-primary':''), onclick:function(){
          header.setTradeStatus(1)
        }}, [
          '合约交易',
        ]),
        // m('a', {class:"navbar-item"+(window.gMkt.CtxPlaying.pageTradeStatus == 2 ?' has-text-primary':''), onclick:function(){
        //   header.setTradeStatus(2)
        // }}, [
        //   '现货交易',
        // ]),
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
      return m("div",{class:"navbar-end"},[
        header.getLoginDom()
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
        m('a', {role:"button", class:"navbar-burger burger","aria-label":"menu", "aria-expanded":"false", "data-target":"navbarBasicExample"}, [
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
        
        return m("nav",{class:"pub-header navbar is-fixed-top", role:"navigation", "aria-label":"main navigation"},[
          header.getLogoCon(),
          header.getLeftCon(),
          header.getRightCon()
        ])
    },
    onremove: function(vnode) {
      header.rmEVBUS()
    },
}