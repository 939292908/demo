var m = require("mithril")
import * as futureCalc from '../../../futureCalc/calcFuture'


let obj = {
  open: false,
  tabsActive: 0,
  Sym: '',
  needReq: false,
  Lever: 0,
  LeverForMy: 0,
  MIRMy: 0, //自定义全仓杠杠(自定义委托保证金)
  maxLever: 0,
  leverageCallback: null,
  posInfo: null,
  oldParam: {},
  changeLeverInfo: {},
  leverList: {
    20:[5,10,15,20],
    25:[5,10,20,25],
    50:[5,10,20,50],
    100:[5,10,20,50,100],
  },
  //初始化全局广播
  initEVBUS: function () {
    let that = this

    if (this.EV_OPENLEVERAGEMODE_UPD_unbinder) {
      this.EV_OPENLEVERAGEMODE_UPD_unbinder()
    }
    this.EV_OPENLEVERAGEMODE_UPD_unbinder = window.gEVBUS.on(gTrd.EV_OPENLEVERAGEMODE_UPD, arg => {
      that.open = true
      that.initLeverInfo(arg.param)
    })
  },
  //删除全局广播
  rmEVBUS: function () {
    if (this.EV_CHANGEACTIVEPOS_UPD_unbinder) {
      this.EV_CHANGEACTIVEPOS_UPD_unbinder()
    }
    if (this.EV_TICK_UPD_unbinder) {
      this.EV_TICK_UPD_unbinder()
    }
  },
  submit: function () {
    let that = this

    if(this.tabsActive == 0){
      if(window.$config.future.setMIRMy){
        if(this.LeverForMy === '0'){
          return window.$message({title: '全仓杠杆不能为0',content: '全仓杠杆不能为0', type: 'danger'})
        }else if(!this.LeverForMy){
          return window.$message({title: '请输入全仓杠杆数量',content: '请输入全仓杠杆数量', type: 'danger'})
        }else if(Number(this.LeverForMy) < 1){
          return window.$message({title: '全仓最小杠杠为1',content: '全仓最小杠杠为1', type: 'danger'})
        }
      }
    }else if(this.tabsActive == 1){
      if(this.Lever === '0'){
        return window.$message({title: '逐仓杠杆不能为0',content: '逐仓杠杆不能为0', type: 'danger'})
      }else if(!this.Lever){
        return window.$message({title: '请输入杠杆数量',content: '请输入杠杆数量', type: 'danger'})
      }else if(Number(this.Lever) < 1){
        return window.$message({title: '最小杠杠为1',content: '最小杠杠为1', type: 'danger'})
      }
    }
    if(this.changeLeverInfo.hasOwnProperty('code') && this.changeLeverInfo.code != 0){
      console.log(this.changeLeverInfo)
      return window.$message({title: '提示',content: this.changeLeverInfo.errorText, type: 'danger'})
    }
    let param = {
      Sym: this.Sym,
      PId: this.PId,
      Lever: Number(this.Lever),
      MIRMy: Number(this.MIRMy),
    }
    if(this.needReq){
      if(Number(this.Lever) != Number(this.oldParam.Lever) || Number(this.MIRMy) != Number(this.oldParam.MIRMy)){
        let AId = window.gTrd.RT["UserId"]+'01'
        window.gTrd.ReqTrdPosLeverage({
          "AId":AId,
          "Sym": param.Sym,
          "PId": param.PId,
          "Param": param.Lever,
        },function(gTrd, arg){
          if(arg.code == 0 && !arg.data.ErrCode){
            if(window.$config.future.setMIRMy && param.Lever == 0){
              window.gTrd.ReqTrdPosOp({
                "AId":AId,
                "Sym": param.Sym,
                "PId": param.PId,
                "Op": 2,
                "Param": param.MIRMy,
              },function(gTrd, arg){
                if(arg.code == 0 && !arg.data.ErrCode){
                  that.open = false
                  that.leverageCallback && that.leverageCallback({
                    Sym: that.Sym,
                    PId: that.PId,
                    Lever: Number(that.Lever),
                    MIRMy: Number(that.MIRMy),
                  })
                  window.$message({title: '杠杆已调整！',content: '杠杆已调整！', type: 'success'})
                }else{
                  window.$message({title: utils.getTradeErrorCode(arg.code || arg.data.ErrCode), content: utils.getTradeErrorCode(arg.code || arg.data.ErrCode), type: 'danger'})
                }
              })
            }else{
              that.open = false
              that.leverageCallback && that.leverageCallback({
                Sym: that.Sym,
                PId: that.PId,
                Lever: Number(that.Lever),
                MIRMy: Number(that.MIRMy),
              })
              window.$message({title: '杠杆已调整！',content: '杠杆已调整！', type: 'success'})
            }
          }else{
            window.$message({title: utils.getTradeErrorCode(arg.code || arg.data.ErrCode), content: utils.getTradeErrorCode(arg.code || arg.data.ErrCode), type: 'danger'})
          }
        })
      }
    }else{
      that.open = false
      this.leverageCallback && this.leverageCallback({
        Sym: this.Sym,
        PId: this.PId,
        Lever: Number(this.Lever),
        MIRMy: Number(this.MIRMy),
      })
    }
  },
  setTabsActive: function (param) {
    this.tabsActive = param
    if(param == 0){
      this.Lever = 0
      if(window.$config.future.setMIRMy){
        this.LeverForMy = Number(param.MIRMy?1/param.MIRMy: maxLever).toFixed2(0)
      }
    }else if(param == 1){
      this.Lever = this.maxLever
    }
    this.calcNeedMgn()
  },
  initLeverInfo: function (param) {
    let Sym = param.Sym
    let Lever = (param.Lever || 0).toFixed2(0)
    let PId = param.PId
    let MIRMy = param.MIRMy
    let needReq = param.needReq
    let ass = window.gMkt.AssetD[Sym]
    let pos = utils.getPosInfo(window.gTrd.Poss[PId], ass)

    let maxLever = ass?1/ass.MIR:0
    if(Lever == 0){
      this.tabsActive = 0
    }else{
      this.tabsActive = 1
    }
    if(window.$config.future.setMIRMy){
      this.LeverForMy = (param.MIRMy?1/param.MIRMy: maxLever).toFixed2(0)
    }
    this.Sym = Sym
    this.PId = PId
    this.MIRMy = MIRMy
    this.Lever = Lever
    this.maxLever = maxLever
    this.needReq = needReq
    this.leverageCallback = param.cb
    this.posInfo = pos

    this.oldParam = param
  },
  openLeverageMode: function(param){
    /** param = {
      Sym: 'BTC.USDT',
      PId: '', //仓位PId
      Lever: 0, //杠杆
      MIRMy: 0, //自定义委托保证金率
      needReq: false, //是否需要向服务器发送修改杠杆请求
      cb: function(){}
    }*/
    gEVBUS.emit(gTrd.EV_OPENLEVERAGEMODE_UPD, {Ev: gTrd.EV_OPENLEVERAGEMODE_UPD, param: param})
  },
  closeLeverageMode: function(){
    this.open = false
  },
  calcNeedMgn: function(){
    console.log('calcNeedMgn')

    let PId = this.PId
    let Sym = this.Sym
    let Lever = Number(this.Lever)
    let order = window.gTrd.Orders['01']
    let orderForPId = []
    order.map(function(item){
      if(item.PId == PId){
        orderForPId.push(item)
      }
    })

    let assetD = window.gMkt.AssetD[Sym] || {}
    let lastTick = window.gMkt.lastTick[Sym] || {}
    let pos = window.gTrd.Poss[PId] || {}
    console.log(pos, orderForPId, assetD, lastTick, Lever)
    futureCalc.calcChangeLever(pos, orderForPId, assetD, lastTick, Lever, res=>{
      console.log(res, pos, orderForPId, assetD, lastTick, Lever)
      this.changeLeverInfo = res
    })
  },
  onLeverInput: function(e){
    if(Number(e.target.value) > Number(this.maxLever)){
      obj.Lever = Number(this.maxLever)
    }else if(Number(e.target.value) < 0){
      obj.Lever = 1
    }else{
      obj.Lever = e.target.value
    }
    obj.calcNeedMgn()
  },
  onLeverForMyInput: function(e){
    if(Number(e.target.value) > Number(this.maxLever)){
      obj.LeverForMy = Number(this.maxLever)
    }else if(Number(e.target.value) < 0){
      obj.LeverForMy = 1
    }else{
      obj.LeverForMy = e.target.value
    }
    this.MIRMy = Number(1/Number(obj.LeverForMy || 0).toFixed2(8))
    obj.calcNeedMgn()
  },
  getQuickLeverBtns: function(){
    let LeverList = this.leverList[this.maxLever] || []
    return LeverList.map(function(item,i){
      return m('button', {key: "leverBtnsItem"+i,class:"button level-item",onclick: function(){
        obj.setQuickLever(item)
      }}, [
        item
      ])
    })

  },
  setQuickLever: function(param){
    if(this.tabsActive == 0){
      this.LeverForMy = param
      this.MIRMy = Number(1/Number(obj.LeverForMy || 0).toFixed2(8))
    }else if(this.tabsActive == 1){
      this.Lever = param
    }
  }
}

export default {
  oninit: function (vnode) {

  },
  oncreate: function (vnode) {
    obj.initEVBUS()

    window.$openLeverageMode = obj.openLeverageMode
  },
  view: function (vnode) {

    return m('div', {class: 'pub-set-lever'}, [
      m("div", { class: "modal" + (obj.open ? " is-active" : ''), }, [
        m("div", { class: "modal-background" }),
        m("div", { class: "modal-card" }, [
          m("header", { class: "pub-set-lever-head modal-card-head" }, [
            m("p", { class: "modal-card-title" }, [
              '杠杆调整'
            ]),
            m("button", {
              class: "delete", "aria-label": "close", onclick: function () {
                obj.closeLeverageMode()
              }
            }),
          ]),
          m("section", { class: "pub-set-lever-content modal-card-body" }, [
            m("div", { class: "tabs " }, [
              m("ul", [
                m("li", { class: "" + (obj.tabsActive == 0 ? ' is-active' : '') }, [
                  m("a", {
                    class: "", onclick: function () {
                      obj.setTabsActive(0)
                    }
                  }, [
                    '全仓'
                  ])
                ]),
                m("li", { class: "" + (obj.tabsActive == 1 ? ' is-active' : '') }, [
                  m("a", {
                    class: "", onclick: function () {
                      obj.setTabsActive(1)
                    }
                  }, [
                    '逐仓'
                  ])
                ]),
              ])
            ]),

            m('div', { class: "pub-set-lever-content-risk-warning has-text-danger" + (obj.tabsActive != 0 ? " is-hidden" : '') }, [
              m('div', { class: "field" }, [
                '全仓模式下所有仓位将共享合约账户的可用保证金，若发生强平，可能损失所有仓位和可用保证金。请注意仓位风险！'
              ]),
              m('div', { class: "field has-addons"+(window.$config.future.setMIRMy?'':' is-hidden') }, [
                m('div', { class: "control" }, [
                  m('button', { class: "button is-static" }, [
                    '最高'+obj.maxLever+'X'
                  ]),
                ]),
                m('div', { class: "control is-expanded" }, [
                  m('input', { class: "input ", type: 'number', step: 1, value:  obj.LeverForMy, oninput: function(e){
                    obj.onLeverForMyInput(e)
                  }})
                ])
              ]),
              m('div', { class: "field buttons level"+(window.$config.future.setMIRMy?'':' is-hidden') }, [
                obj.getQuickLeverBtns()
              ])
            ]),
            m('div', { class: "" + (obj.tabsActive != 1 ? " is-hidden" : '') }, [
              m('div', { class: "field has-addons" }, [
                m('div', { class: "control" }, [
                  m('button', { class: "button is-static" }, [
                    '最高'+obj.maxLever+'X'
                  ]),
                ]),
                m('div', { class: "control is-expanded" }, [
                  m('input', { class: "input ", type: 'number', step: 1, value:  obj.Lever, oninput: function(e){
                    obj.onLeverInput(e)
                  }})
                ])
              ]),
              m('div', { class: "field buttons level" }, [
                obj.getQuickLeverBtns()
              ])
            ]),
            m('div', { class: "pub-set-lever-content-mm level" }, [
              m('p', { class: "level-left" }, [
                '当前仓位保证金'
              ]),
              m('p', { class: "level-right" }, [
                obj.posInfo?obj.posInfo.aMM:'0.0000'
              ])
            ]),
            m('div', { class: "pub-set-lever-content-need-mgn level" }, [
              m('p', { class: "level-left" }, [
                '需要追加保证金'
              ]),
              m('p', { class: "level-right" }, [
                obj.changeLeverInfo?Number(obj.changeLeverInfo.changeNeedMM || 0).toPrecision2(6,8):'0.0000'
              ])
            ])
          ]),
          m("footer", { class: "pub-set-lever-foot modal-card-foot" }, [
            m("button", {
              class: "button is-success", onclick: function () {
                obj.submit()
              }
            }, [
              '确定'
            ]),
            m("button", {
              class: "button", onclick: function () {
                obj.closeLeverageMode()
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
    window.$openLeverageMode = null
  },
}