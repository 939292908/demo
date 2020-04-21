var m = require("mithril")
import * as futureCalc from '../../../futureCalc/calcFuture'


let obj = {
  open: false,
  tabsActive: 0,
  Sym: '',
  needReq: false,
  Lever: 0,
  maxLever: 0,
  leverageCallback: null,
  posInfo: null,
  oldParam: {},
  changeLeverInfo: {},
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

    if(this.tabsActive == 1){
      if(this.Lever === '0'){
        return window.$message({content: '逐仓杠杆不能为0', type: 'danger'})
      }else if(!this.Lever){
        return window.$message({content: '请输入杠杆数量', type: 'danger'})
      }
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
          if(arg.code == 0){
            that.open = false
            that.leverageCallback && that.leverageCallback({
              Sym: that.Sym,
              PId: that.PId,
              Lever: Number(that.Lever),
              MIRMy: Number(that.MIRMy),
            })
            window.$message({content: '杠杆已调整！', type: 'success'})
          }else{
            window.$message({content: utils.getTradeErrorCode(arg.code), type: 'danger'})
          }
        })
      }
    }else{
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
    }else if(param == 1){
      this.Lever = this.maxLever
    }
    this.calcNeedMgn()
  },
  initLeverInfo: function (param) {
    let Sym = param.Sym
    let Lever = param.Lever
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
    }else{
      obj.Lever = e.target.value
    }
    obj.calcNeedMgn()
  },
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
              m('div', { class: "" }, [
                '全仓模式下所有仓位将共享合约账户的可用保证金，若发生强平，可能损失所有仓位和可用保证金。请注意仓位风险！'
              ]),
            ]),
            m('div', { class: "" + (obj.tabsActive != 1 ? " is-hidden" : '') }, [
              m('div', { class: "field has-addons" }, [
                m('div', { class: "control" }, [
                  m('button', { class: "button is-static" }, [
                    '最高'+obj.maxLever+'X'
                  ]),
                ]),
                m('div', { class: "control is-expanded" }, [
                  m('input', { class: "input ", type: 'number', value:  obj.Lever, oninput: function(e){
                    obj.onLeverInput(e)
                  }})
                ])
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
  onremove: function (vnode) {
    obj.rmEVBUS()
    window.$openLeverageMode = null
  },
}