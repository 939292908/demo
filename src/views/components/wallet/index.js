var m = require("mithril")

import wlt from './wlt'
import transfer from './transfer'
import goodsWlt from './goodsWlt'

let obj = {
    tabsActive: 0,
    wlt: {},
    //初始化全局广播
    initEVBUS: function(){
      let that = this
      //当前选中合约变化全局广播
      if(this.EV_CHANGESYM_UPD_unbinder){
        this.EV_CHANGESYM_UPD_unbinder()
      }
      this.EV_CHANGESYM_UPD_unbinder = window.gEVBUS.on(gMkt.EV_CHANGESYM_UPD,arg=> {
          that.initWlt()
      })
    },
    //删除全局广播
    rmEVBUS: function(){
        
    },
    initWlt: function(arg){
      let Sym = window.gMkt.CtxPlaying.Sym
      let assetD = window.gMkt.AssetD[Sym] || {}
      let wallets = []
      if(assetD.TrdCls == 2 || assetD.TrdCls == 3){
          wallets = window.gTrd.Wlts['01']
      }
      let isUpdate = false
      for(let i = 0;i < wallets.length; i++){
          let item = wallets[i]
          if(item.AId && item.Coin == assetD.SettleCoin){
              isUpdate = true
              this.wlt = item
          }
      }
      if(!isUpdate){
          this.wlt = {}
      }
      m.redraw()
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
    let pageTradeStatus = window.gMkt.CtxPlaying.pageTradeStatus
        switch(this.tabsActive){
            case 0:
              if(pageTradeStatus == 1){
                return m(wlt)
              }else if(pageTradeStatus == 2){
                return m(goodsWlt)
              }
                // return m(wlt)
            case 1:
                return m(transfer)
        }
    }
}

export default {
    oninit: function(vnode){
        obj.initWlt()
    },
    oncreate: function(vnode){
        obj.initEVBUS()
    },
    view: function(vnode) {
      let pageTradeStatus = window.gMkt.CtxPlaying.pageTradeStatus
        return m("div",{class:"pub-wallet-box box has-text-centered"},[
            m("div",{class:"pub-wallet-box-tabs tabs"+(window.$config.loginType == 0?'':' is-hidden')},[
                m("ul",[
                  m("li",{class:""+(obj.tabsActive == 0?' is-active':'')},[
                    m("a",{class:"", onclick: function(){
                      obj.setTabsActive(0)
                    }},[
                      pageTradeStatus == 1?gDI18n.$t('10215',{value : (obj.wlt.Coin || '')}) : gDI18n.$t('10608'), //'币币资产'
                      
                      // (obj.wlt.Coin || '')+'合约资产'
                    ])
                  ]),
                  m("li",{class:""+(obj.tabsActive == 1?' is-active':'')},[
                    m("a",{class:"", onclick: function(){
                        obj.setTabsActive(1)
                    }},[
                      gDI18n.$t('10216')//'资产划转'
                    ])
                  ])
                ]),
            ]),
            m("div",{class:"pub-wallet-box-tabs tabs"+(window.$config.loginType != 0?'':' is-hidden')},[
                m("ul",[
                  m("li",{class:""},[
                    m("a",{class:""},[
                      gDI18n.$t('10215',{value : (obj.wlt.Coin || '')})
                      // (obj.wlt.Coin || '')+'合约资产'
                    ])
                  ]),
                ]),
            ]),
            obj.getContent() 
        ])
    },
    onremove: function(){
        obj.rmEVBUS()
    }
}