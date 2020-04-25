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
  oldSubArr: [],
  //初始化全局广播
  initEVBUS: function(){
    let that = this

    //当前选中合约变化全局广播
    if(this.EV_CHANGESYM_UPD_unbinder){
        this.EV_CHANGESYM_UPD_unbinder()
    }
    this.EV_CHANGESYM_UPD_unbinder = window.gEVBUS.on(gMkt.EV_CHANGESYM_UPD,arg=> {
        that.unSubTick()
        that.subTick()
    })
  },
  rmEVBUS: function(){
    if(this.EV_CHANGESYM_UPD_unbinder){
        this.EV_CHANGESYM_UPD_unbinder()
    }
  },
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
  },
  //订阅所需行情,pc界面行情订阅除了k线以外，其他所需订阅内容都在这里，各个组件内只是接收数据并渲染
  subTick: function(){
    let Sym = window.gMkt.CtxPlaying.Sym
    if(Sym){
        let subArr = utils.setSubArrType('tick',[Sym])
        // subArr = subArr.concat(utils.setSubArrType('trade',[Sym]))
        subArr = subArr.concat(utils.setSubArrType('order20',[Sym]))
        subArr = subArr.concat(utils.setSubArrType('index',[utils.getGmexCi(window.gMkt.AssetD, Sym)]))
        window.gMkt.ReqSub(subArr)
        this.oldSubArr = subArr
    }
    m.redraw();
  },
  unSubTick(){
      let oldSubArr = this.oldSubArr
      window.gMkt.ReqUnSub(oldSubArr)
  },
}

import login from './userCenter/login'
export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
      obj.initEVBUS()
    },
    view: function(vnode) {
        return m("div",{class: ""}, [
          m("nav",{class:"pub-layout-m-header is-fixed-top navbar is-transparent is-flex", role:"navigation", "aria-label":"main navigation"},[
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
            ]),
            obj.getBottomList(),
          ]),

          obj.getStopPLMode(),
          obj.getLeverageMode(),
          obj.getValidateMode(),
          obj.marketAddMode(),
          obj.someCloseMode(),
          m(login)
        ])
    },
    onbeforeremove: function(){
      obj.rmEVBUS()
    }
}