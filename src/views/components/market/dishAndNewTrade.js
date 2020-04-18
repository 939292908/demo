var m = require("mithril")

let obj = {
  tabsActive: 0,
  setTabsActive: function(param){
    this.tabsActive = param
  },
  //初始化全局广播
  initEVBUS: function(){
    let that = this
    

    // //tick行情全局广播
    // if(this.EV_TICK_UPD_unbinder){
    //     this.EV_TICK_UPD_unbinder()
    // }
    // this.EV_TICK_UPD_unbinder = window.gEVBUS.on(gMkt.EV_TICK_UPD,arg=> {
    //     that.onTick(arg)
    // })
    
    // //指数行情全局广播
    // if(this.EV_INDEX_UPD_unbinder){
    //     this.EV_INDEX_UPD_unbinder()
    // }
    // this.EV_INDEX_UPD_unbinder = window.gEVBUS.on(gMkt.EV_INDEX_UPD,arg=> {
    //     that.onTick(arg)
    // })

    //trade行情全局广播
    // if(this.EV_REALTIME_UPD_unbinder){
    //     this.EV_REALTIME_UPD_unbinder()
    // }
    // this.EV_REALTIME_UPD_unbinder = window.gEVBUS.on(gMkt.EV_REALTIME_UPD,arg=> {
    //     console.log('dish order20', arg)
    //     // that.onOrder20(arg)
    // })
  },
  //删除全局广播
  rmEVBUS: function(){
      // if(this.EV_TICK_UPD_unbinder){
      //     this.EV_TICK_UPD_unbinder()
      // }
      // if(this.EV_INDEX_UPD_unbinder){
      //     this.EV_INDEX_UPD_unbinder()
      // }
      // if(this.EV_ORDER20_UPD_unbinder){
      //     this.EV_ORDER20_UPD_unbinder()
      // }
  },
  getTabsActiveContent: function(){
    switch(this.tabsActive){
      case 0:
        return m(dish)
      case 1:
        return m(newTrade)
    }
  }
}

import dish from './dish'
import newTrade from './newTrade'
export default {
  oninit: function(vnode){
      
  },
  oncreate: function(vnode){
      obj.initEVBUS()
  },
  view: function(vnode) {
      
      return m("div",{class:"pub-dish-and-new-trade box has-text-centered h100"},[
        m("div",{class:"pub-dish-and-new-trade-tabs tabs"},[
          m("ul",[
            m("li",{class:""+(obj.tabsActive == 0?"is-active":'')},[
              m("a",{class:"", href:"javascript:void(0);", onclick: function(){
                obj.setTabsActive(0)
              }},[
                '买卖盘口'
              ])
            ]),
            m("li",{class:""+(obj.tabsActive == 1?"is-active":''), href:"javascript:void(0);", onclick: function(){
              obj.setTabsActive(1)
            }},[
              m("a",{class:""},[
                '最新成交'
              ])
            ])
          ])
        ]),
        obj.getTabsActiveContent()
      ])
  },
  onremove: function(vnode) {
    obj.rmEVBUS()
  },
}