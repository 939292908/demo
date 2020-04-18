var m = require("mithril")


import dishAndNewTrade from './market/dishAndNewTrade'
import kline from './market/kline'
import headerTick from './market/headerTick'
import orderList from './orderList/index'
import placeOrder from './trade'
import wallet from './wallet/index'
import spotInfo from './spotInfo/spotInfo'
//杠杆调整
import leverageMode from './trade/leverageMode'
//设置仓位止盈止损
import stopPLMode from './trade/stopPLMode'
//二次验证google和sms
import validateMode from './userCenter/validateMode'

let obj = {


  getKline: function(){
    let type = window.$config.views.kline.type
    switch(type){
      case 0:
        return m(kline)
      case 1:
        return this.customKline()
      default:
        return null;
    }
  },
  customKline: function(){

  },
  getDishAndNewTrd: function(){
    let type = window.$config.views.dishAndNewTrd.type
    switch(type){
      case 0:
        return m(dishAndNewTrade)
      case 1:
        return this.customDishAndNewTrd()
      default:
        return null;
    }
  },
  customDishAndNewTrd: function(){

  },
  getBottomList: function(){
    let type = window.$config.views.bottomList.type
    switch(type){
      case 0:
        return m(orderList)
      case 1:
        return this.customBottomList()
      default:
        return null;
    }
  },
  customBottomList: function(){

  },
  getWallet: function(){
    let type = window.$config.views.wallet.type
    switch(type){
      case 0:
        return m(wallet)
      case 1:
        return this.customWallet()
      default:
        return null;
    }
  },
  customWallet: function(){

  },
  getSpotInfo: function(){
    let type = window.$config.views.spotInfo.type
    switch(type){
      case 0:
        return m(spotInfo)
      case 1:
        return this.customSpotInfo()
      default:
        return null;
    }
  },
  customSpotInfo: function(){

  },
  getPlaceOrd: function(){
    let type = window.$config.views.placeOrd.type
    switch(type){
      case 0:
        return m(placeOrder)
      case 1:
        return this.customPlaceOrd()
      default:
        return null;
    }
  },
  customPlaceOrd: function(){

  },
  getValidateMode: function(){
    let type = window.$config.views.validateMode.type
    switch(type){
      case 0:
        return m(validateMode)
      case 1:
        return this.customValidateMode()
      default:
        return null;
    }
  },
  customValidateMode: function(){

  },
  getLeverageMode: function(){
    let type = window.$config.views.leverageMode.type
    switch(type){
      case 0:
        return m(leverageMode)
      case 1:
        return this.customLeverageMode()
      default:
        return null;
    }
  },
  customLeverageMode: function(){

  },
  getStopPLMode: function(){
    let type = window.$config.views.stopPLMode.type
    switch(type){
      case 0:
        return m(stopPLMode)
      case 1:
        return this.customStopPLMode()
      default:
        return null;
    }
  },
  customStopPLMode: function(){

  }
}


export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
        
    },
    view: function(vnode) {
        return m("div",{class: "pub-layout"}, [
          m("div",{class: "pub-layout-header-tick"}, [
            m(headerTick)
          ]),
          m("div",{class: "pub-layout-content is-clearfix "}, [
            m("div",{class: "pub-layout-content-left is-pulled-left is-clearfix"}, [
              m("div",{class: "pub-layout-content-left-kline is-pulled-left "}, [
                obj.getKline(),
              ]),
              m("div",{class: "pub-layout-content-left-dish is-pulled-left "}, [
                obj.getDishAndNewTrd()
              ]),
              m("div",{class: "pub-layout-content-left-list is-pulled-left "}, [
                obj.getBottomList()
              ]),
            ]),
            m("div",{class: "pub-layout-content-right is-pulled-right"}, [
              m("div",{class: "pub-layout-content-right-place-order"}, [
                obj.getPlaceOrd()
              ]),
              m("div",{class: "pub-layout-content-right-wallet"}, [
                obj.getWallet()
              ]),
              m("div",{class: "pub-layout-content-right-spot-info"}, [
                obj.getSpotInfo()
              ])
            ])
          ]),
          obj.getStopPLMode(),
          obj.getLeverageMode(),
          obj.getValidateMode(),
        ])
    }
}