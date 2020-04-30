var m = require("mithril")

import wlt from './wlt'
import transfer from './transfer'

let obj = {
    tabsActive: 0,
    wlt: {},
    //初始化全局广播
    initEVBUS: function(){
        let that = this
        
    },
    //删除全局广播
    rmEVBUS: function(){
        
    },
    setTabsActive: function(param){
      if(param == 1){
        if(!window.gWebAPI.isLogin()){
          window.gWebAPI.needLogin()
          return
        }
      }
        this.tabsActive = param
    },
    getContent: function(){
        switch(this.tabsActive){
            case 0:
                return m(wlt)
            case 1:
                return m(transfer)
        }
    }
}

export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
        obj.initEVBUS()
    },
    view: function(vnode) {
        
        return m("div",{class:"pub-wallet-box box has-text-centered"},[
            m("div",{class:"pub-wallet-box-tabs tabs"+(window.$config.loginType == 0?'':' is-hidden')},[
                m("ul",[
                  m("li",{class:""+(obj.tabsActive == 0?' is-active':'')},[
                    m("a",{class:"", onclick: function(){
                      obj.setTabsActive(0)
                    }},[
                      (obj.wlt.Coin || '')+'合约资产'
                    ])
                  ]),
                  m("li",{class:""+(obj.tabsActive == 1?' is-active':'')},[
                    m("a",{class:"", onclick: function(){
                        obj.setTabsActive(1)
                    }},[
                      '资产划转'
                    ])
                  ])
                ]),
            ]),
            m("div",{class:"pub-wallet-box-tabs tabs"+(window.$config.loginType != 0?'':' is-hidden')},[
                m("ul",[
                  m("li",{class:""},[
                    m("a",{class:""},[
                      (obj.wlt.Coin || '')+'合约资产'
                    ])
                  ]),
                ]),
            ]),
            obj.getContent() 
        ])
    },
    onbeforeremove: function(){
        obj.rmEVBUS()
    }
}