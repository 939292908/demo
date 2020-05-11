//移动端顶部导航栏
var m = require("mithril")

import symSelect from './market/symSelect'//

//引入k线
import kLine from "./market/kline"

let obj = {
  oldSubArr: [],
  rightMenu: false,
  leftMenu: false,//
  klineOpen: false,//
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
    //body点击事件广播
    if(this.EV_ClICKBODY_unbinder){
      this.EV_ClICKBODY_unbinder()
    }
    this.EV_ClICKBODY_unbinder = window.gEVBUS.on(gEVBUS.EV_ClICKBODY,arg=> {
        that.leftMenu = false
        that.rightMenu = false
    })

    if(this.EV_ClOSEHEADERMENU_unbinder){
      this.EV_ClOSEHEADERMENU_unbinder()
    }
    this.EV_ClOSEHEADERMENU_unbinder = window.gEVBUS.on(gEVBUS.EV_ClOSEHEADERMENU,arg=> {
        if(arg.from != 'rightMenu'){
            that.rightMenu = false
        }
        if(arg.from != 'leftMenu'){
          that.leftMenu = false
        }
    })
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

export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
      obj.initEVBUS()
    },
    view: function(vnode) {
        return m("div",{class: ""}, [
          m('div', {class: 'pub-m-kline-box has-background-white '+(obj.klineOpen?' open':'')}, [
            m("nav",{class:"pub-layout-m-header is-fixed-top navbar is-transparent ", role:"navigation", "aria-label":"main navigation"},[
              m('div', {class:"navbar-brand is-flex"}, [
                m('a', {class:"navbar-item", onclick: function(e){
                  obj.klineOpen = false
                }}, [
                  m('span', {class:"icon is-medium"}, [
                    m('i', {class:"iconfont iconarrow-left"}),
                  ]),
                ]),
              ]),
            ]),
            //右进k线
            m("div",{class:"headerBack"}),
            m(kLine,{class:""}),
          ]),
          m("nav",{class:"pub-layout-m-header is-fixed-top navbar is-transparent", role:"navigation", "aria-label":"main navigation"},[
            m('div', {class:"navbar-brand is-flex"}, [
              m('a', {class:"navbar-item", onclick: function(e){
                obj.leftMenu = !obj.leftMenu
                gEVBUS.emit(gEVBUS.EV_ClOSEHEADERMENU, {ev: gEVBUS.EV_ClOSEHEADERMENU, from: 'leftMenu'})
                window.stopBubble(e)
              }}, [
                m('a', {class:"navbar-item",href:"/#!/future"}, [
                  m('span', {class:"icon is-medium"}, [
                    m('i', {class:"iconfont iconarrow-left"}),
                  ]),
                ]),
              ]),
              m('.spacer'),
              m(symSelect),
              m('.spacer'),
              m('a', {class:"navbar-item"}, [
                m('span', {class:"icon is-medium", onclick: function(){
                  obj.klineOpen = true
                }}, [
                  m('i', {class:"iconfont iconhangqing"}),
                ]),
              ]),
            ]),
          ]),
        ])
    },
}