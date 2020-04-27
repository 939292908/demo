var m = require("mithril")
import * as futureCalc from '../../../futureCalc/calcFuture'


let obj = {
  open: false,
  param: {
    StopP: '',
    StopL: '',
    StopLPBy: 1,
  },
  openStopP: false,
  openStopL: false,
  //初始化全局广播
  initEVBUS: function () {
    let that = this

    if (this.EV_OPENSTOPPLMODE_UPD_unbinder) {
      this.EV_OPENSTOPPLMODE_UPD_unbinder()
    }
    this.EV_OPENSTOPPLMODE_UPD_unbinder = window.gEVBUS.on(gTrd.EV_OPENSTOPPLMODE_UPD, arg => {
      that.open = true
      that.initStopPLInfo(arg.param)
    })
  },
  //删除全局广播
  rmEVBUS: function () {
    if (this.EV_OPENSTOPPLMODE_UPD_unbinder) {
      this.EV_OPENSTOPPLMODE_UPD_unbinder()
    }
  },
  submit: function () {
    let that = this

    if(this.openStopP){
      if(this.param.StopP === '0'){
        return window.$message({title: '止盈价不能为0', content: '止盈价不能为0', type: 'danger'})
      }else if(!this.param.StopP){
        return window.$message({title: '请输入止盈价', content: '请输入止盈价', type: 'danger'})
      }
    }
    if(this.openStopL){
      if(this.param.StopL === '0'){
        return window.$message({title: '止损价不能为0', content: '止损价不能为0', type: 'danger'})
      }else if(!this.param.StopL){
        return window.$message({title: '请输入止损价', content: '请输入止损价', type: 'danger'})
      }
    }
    
    let param = {
      "AId": this.param.AId,  // 账号的AId, 必须有
      "Sym": this.param.Sym,   // 交易对名称, 必须有
      "PId": this.param.PId,   // 仓位的ID, 必须有
      "StopLBy": this.param.StopLPBy,         // 参考 StopBy 值定义, 止损, 对应仓位的 StopLBy
      "StopPBy": this.param.StopLPBy,          // 参考 StopBy 值定义, 止盈, 对应仓位的 StopPBy
      "Param": Number(this.openStopL?this.param.StopL:-1),      // float64 值, 参数值, 对应仓位的 StopL
      "P2": Number(this.openStopP?this.param.StopP:-1),        // float64 值, 参数值, 对应仓位的 StopP
    }
    window.gTrd.ReqTrdPosStopLP(param,function(gTrd, arg){
      if(arg.code == 0){
        that.open = false
        that.stopPLCallback && that.stopPLCallback(arg)
        window.$message({title: '止盈止损设置成功！', content: '止盈止损设置成功！', type: 'success'})
      }else{
        window.$message({title: utils.getTradeErrorCode(arg.code), content: utils.getTradeErrorCode(arg.code), type: 'danger'})
      }
    })
  },
  setTabsActive: function (param) {
    this.tabsActive = param
    if(param == 0){
      this.Lever = 0
    }else if(param == 1){
      this.Lever = this.maxLever
    }
    this.calcNeedMgn()
  },
  initStopPLInfo: function (param) {
    console.log('initStopPLInfo', param)

    let obj = {
      AId: param.AId, 
      Sym: param.Sym,
      PId: param.PId,
      displaySym: utils.getSymDisplayName(window.gMkt.AssetD, param.Sym),
      displayDir: utils.getPosDirByStr(param.Sz> 0?1:param.Sz< 0?-1:0),
      PrzIni: param.PrzIni,
      Sz: param.Sz,
      StopP: param.StopP || '',
      StopL: param.StopL || '',
      StopLPBy: param.StopLPBy || 1,
      cb: param.cb,
    }
    this.openStopP = !!Number(param.StopP || 0)
    this.openStopL = !!Number(param.StopL || 0)
    this.param = obj
    console.log(obj, this.openStopP, this.openStopL)
  },
  openStopPLMode: function(param){
    /** param = {
      AId: 'xxxxxx'
      Sym: 'BTC.USDT',
      PId: '', //仓位PId
      PrzIni: 0, //开仓价格
      Sz: 0, //持仓数量
      StopP: 0, //止盈价
      StopL: 0, //止损价
      StopLPBy: 1,
      cb: function(){}
    }*/
    gEVBUS.emit(gTrd.EV_OPENSTOPPLMODE_UPD, {Ev: gTrd.EV_OPENSTOPPLMODE_UPD, param: param})
  },
  closeMode: function(){
    this.open = false
  },
  onStopPInput: function(e){
    let Sym = this.param.Sym
    let ass = window.gMkt.AssetD[Sym]
    let maxPrz = Number(ass?ass.PrzMax:0)
    if(Number(e.target.value) > maxPrz){
      obj.param.StopP = maxPrz
    }else{
      obj.param.StopP = e.target.value
    }
  },
  onStopLInput: function(e){
    let Sym = this.param.Sym
    let ass = window.gMkt.AssetD[Sym]
    let maxPrz = Number(ass?ass.PrzMax:0)
    console.log(e.target.value, Number(e.target.value), maxPrz)
    if(Number(e.target.value) > maxPrz){
      obj.param.StopL = maxPrz
    }else{
      obj.param.StopL = e.target.value
    }
  },
}

export default {
  oninit: function (vnode) {

  },
  oncreate: function (vnode) {
    obj.initEVBUS()

    window.$openStopPLMode = obj.openStopPLMode
  },
  view: function (vnode) {

    return m('div', {class: 'pub-stoppl'}, [
      m("div", { class: "modal" + (obj.open ? " is-active" : ''), }, [
        m("div", { class: "modal-background" }),
        m("div", { class: "modal-card" }, [
          m("header", { class: "pub-stoppl-head modal-card-head" }, [
            m("p", { class: "modal-card-title" }, [
              '止盈止损设置（市价）'
            ]),
            m("button", {
              class: "delete", "aria-label": "close", onclick: function () {
                obj.closeMode()
              }
            }),
          ]),
          m("section", { class: "pub-stoppl-content modal-card-body" }, [
            m("div", { class: "pub-stoppl-content-pos-info level" }, [
              m("div", { class: "level-left" }, [
                (obj.param.displayDir || '') + ' ' + (obj.param.displaySym || '')
              ]),
              m("div", { class: "level-right" }, [
                (obj.param.Sz || '0') + '/' + (obj.param.PrzIni || '0.0')
              ]),
            ]),
            m('label', { class: "pub-stoppl-content-stopp-label checkbox" }, [
              m('input', { type: "checkbox", checked: obj.openStopP, oninput: function(e){
                obj.openStopP = e.target.checked
              } }),
              '止盈设置'
            ]),
            m('div', { class: "pub-stoppl-content-stopp-input field has-addons" }, [
              m('div', { class: "control" }, [
                m('button', { class: "button is-static" }, [
                  utils.getStopPLByStr(obj.param.StopLPBy)+' '+(obj.param.Sz > 0?'≥':'≤')
                ]),
              ]),
              m('div', { class: "control is-expanded" }, [
                m('input', { class: "input ", type: 'number', value:  obj.param.StopP, readonly: !obj.openStopP, oninput: function(e){
                  obj.onStopPInput(e)
                }})
              ])
            ]),
            m('label', { class: "pub-stoppl-content-stopl-label checkbox" }, [
              m('input', { type: "checkbox", checked: obj.openStopL, oninput: function(e){
                obj.openStopL = e.target.checked
              } }),
              '止损设置'
            ]),
            m('div', { class: "pub-stoppl-content-stopl-input field has-addons" }, [
              m('div', { class: "control" }, [
                m('button', { class: "button is-static" }, [
                  utils.getStopPLByStr(obj.param.StopLPBy)+' '+(obj.param.Sz > 0?'≤':'≥')
                ]),
              ]),
              m('div', { class: "control is-expanded" }, [
                m('input', { class: "input ", type: 'number', value:  obj.param.StopL, readonly: !obj.openStopL,  oninput: function(e){
                  obj.onStopLInput(e)
                }})
              ])
            ]),
            m('p',{class: 'has-text-danger'}, [
              '止盈止损触发后将以市价成交，成交的价格可能与设置的价格有偏差；'
            ]),
            m('p',{class: 'has-text-danger'+(obj.param.Sz > 0?' is-hidden':'')}, [
              '该仓位为【空仓】，如若设置的止盈价高于最新价，止损价低于最新价，会将仓位平仓，请注意设置！'
            ]),
            m('p',{class: 'has-text-danger'+(obj.param.Sz < 0?' is-hidden':'')}, [
              '该仓位为【多仓】，如若设置的止盈价低于最新价，止损价高于最新价，会将仓位平仓，请注意设置！'
            ])
          ]),
          m("footer", { class: "pub-stoppl-foot modal-card-foot" }, [
            m("button", {
              class: "button is-success", onclick: function () {
                obj.submit()
              }
            }, [
              '确定'
            ]),
            m("button", {
              class: "button", onclick: function () {
                obj.closeMode()
              }
            }, [
              '取消'
            ]),
          ]),
        ])
      ])
    ])

  },
  onbeforeremove: function (vnode) {
    obj.rmEVBUS()
    window.$openStopPLMode = null
  },
}