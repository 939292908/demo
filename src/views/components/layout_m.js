var m = require("mithril")


import headerTick from './market/headerTick'
import orderList from './orderList/index'
import placeOrder from './trade/index_m'
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

import dish from './market/dish'
import symSelect from './market/symSelect'
import selectPos from './trade/selectPos'



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
  getSelectPos: function(){
    // 根据配置判断仓位选择是否显示
    let tradeType = window.$config.future.tradeType
    let show = false
    switch(tradeType){
        case 0:
            show = true;
            break;
        case 1:
        case 2:
        case 3:
            show = false
            break;
        default:
            show = false
    }
    if(show){
        return m(selectPos)
    }else{
        return null
    }
  }
}


export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
        
    },
    view: function(vnode) {
        return m("div",{class: ""}, [
          m("nav",{class:"pub-layout-m-header navbar is-transparent is-flex", role:"navigation", "aria-label":"main navigation"},[
            m('a', {class:"navbar-item"}, [
              m('span', {class:"icon is-medium"}, [
                m('i', {class:"iconfont icontoolbar-side"}),
              ]),
            ]),
            m('.spacer'),
            m(symSelect),
            m('.spacer'),
            m('a', {class:"navbar-item"}, [
              m('span', {class:"icon is-medium"}, [
                m('i', {class:"iconfont iconhangqing"}),
              ]),
            ]),
          ]),
          m("div",{class: "pub-layout-m"}, [
            obj.getSelectPos(),
            m('div', {class:"pub-layout-m-content is-flex"},[
              m('div', {class:"pub-layout-m-content-left"},[
                obj.getPlaceOrd()
              ]),
              m('.spacer'),
              m('div', {class:"pub-layout-m-content-right"},[
                m(dish)
              ])
            ])
          ]),
          obj.getStopPLMode(),
          obj.getLeverageMode(),
          obj.getValidateMode(),
          obj.marketAddMode(),
          obj.someCloseMode()
        ])
    }
}