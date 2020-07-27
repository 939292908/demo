var m = require("mithril")


import dishAndNewTrade from './market/dishAndNewTrade'
import kline from './market/kline'
import headerTick from './market/headerTick'
import orderList from './orderList/index'
import placeOrder from './trade'
import currenyOrder from './goodsInStock'
import goodsList from './goodsList'
import wallet from './wallet/index'
import spotInfo from './spotInfo/spotInfo'
//杠杆调整
import leverageMode from './trade/leverageMode'
//市价加仓
import marketAddMode from './trade/marketAddMode'
//市价加仓
import someCloseMode from './trade/someCloseMode'
//设置仓位止盈止损
import stopPLMode from './trade/stopPLMode'
//二次验证google和sms
import validateMode from './userCenter/validateMode'
//调整保证金
import changeMgnMode from './orderList/changeMgnMode'

//委托确认
import commission from './market/Commission'
//合约设置
import implemented from './market/NotImplemented'


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
    let pageTradeStatus = window.gMkt.CtxPlaying.pageTradeStatus
    switch(type){
      case 0:
        if (pageTradeStatus == 1){
          return m(orderList)
        } else if (pageTradeStatus == 2){
          return m(goodsList)
        }
        // return m(orderList)
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
    let pageTradeStatus = window.gMkt.CtxPlaying.pageTradeStatus
    switch(type){
      case 0:
        if(pageTradeStatus == 1){
          return m(spotInfo)
        }else if(pageTradeStatus == 2){
          return null
        }
        // return m(spotInfo)
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
    let pageTradeStatus = window.gMkt.CtxPlaying.pageTradeStatus
    switch(type){
      case 0:
        if (pageTradeStatus == 1){
          return m(placeOrder)
        } else if (pageTradeStatus == 2){
          return m(currenyOrder)
        }
        // return m(placeOrder)
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

  },
  marketAddMode: function(){
    let type = window.$config.views.marketAddMode.type
    switch(type){
      case 0:
        return m(marketAddMode)
      case 1:
        return this.customMarketAddMode()
      default:
        return null;
    }
  },
  customMarketAddMode: function(){

  },
  someCloseMode: function(){
    let type = window.$config.views.someCloseMode.type
    switch(type){
      case 0:
        return m(someCloseMode)
      case 1:
        return this.customSomeCloseMode()
      default:
        return null;
    }
  },
  customSomeCloseMode: function(){

  },
  changeMgnMode: function(){
    let type = window.$config.views.changeMgnMode.type
    switch(type){
      case 0:
        return m(changeMgnMode)
      case 1:
        return this.customChangeMgnMode()
      default:
        return null;
    }
  },
  customChangeMgnMode: function(){

  },

  getSetTipsMode:function(){
    return m(commission)
  },

  getImplemented:function(){
    return m(implemented)
  }
  
}


export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
        
    },
    view: function(vnode) {
        return m("div",{class: ""}, [
          m("div",{class: "pub-layout"}, [
            m("div",{class: "pub-layout-header-tick"}, [
              m(headerTick)
            ]),
            m("div",{class: "pub-layout-content is-clearfix "}, [
              m("div",{class: "pub-layout-content-left is-pulled-left is-clearfix"}, [
                m("div",{class: "pub-layout-content-left-kline is-pulled-left"}, [
                  obj.getKline(),
                ]),
                m("div",{class: "pub-layout-content-left-dish is-pulled-left "}, [
                  obj.getDishAndNewTrd()
                ]),
                m("div",{class: "pub-layout-content-left-list is-pulled-left"}, [
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
          ]),
          obj.getStopPLMode(),
          obj.getLeverageMode(),
          obj.getValidateMode(),
          obj.marketAddMode(),
          obj.someCloseMode(),
          obj.changeMgnMode(),
          obj.getSetTipsMode(),
          obj.getImplemented()
        ])
    }
}