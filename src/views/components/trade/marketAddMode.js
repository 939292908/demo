var m = require("mithril")
import * as clacMgnNeed from '../../../futureCalc/calcMgnNeed.js'


let obj = {
  EV_OPENMARKETADDMODE_UPD: 'EV_openMarketAddMode_UPD',
  open: false,
  tabsActive: 0,
  form: {
    prz: '',
    num: '',
  },
  param: {

  },
  wlt: {},
  MgnNeed: '', //市价加仓所需委托保证金
  //初始化全局广播
  initEVBUS: function () {
    let that = this

    if (this.EV_OPENMARKETADDMODE_UPD_unbinder) {
      this.EV_OPENMARKETADDMODE_UPD_unbinder()
    }
    this.EV_OPENMARKETADDMODE_UPD_unbinder = window.gEVBUS.on(this.EV_OPENMARKETADDMODE_UPD, arg => {
      that.open = true
      that.initInfo(arg.param)
    })

    if(this.EV_WLT_UPD_unbinder){
      this.EV_WLT_UPD_unbinder()
    }
    this.EV_WLT_UPD_unbinder = window.gEVBUS.on(gTrd.EV_WLT_UPD,arg=> {
        that.initWlt()
    })
  },
  //删除全局广播
  rmEVBUS: function () {
    if (this.EV_OPENMARKETADDMODE_UPD_unbinder) {
      this.EV_OPENMARKETADDMODE_UPD_unbinder()
    }
    if(this.EV_WLT_UPD_unbinder){
      this.EV_WLT_UPD_unbinder()
    }
  },
  submit: function () {
    let that = this

    if(this.form.num === '0'){
        return $message({content: '加仓数量不能为0', type: 'danger'})
    }else if(!this.form.num){
        return $message({content: '加仓数量不能为空', type: 'danger'})
    }

    let Sym = this.param.pos.Sym
    let AId = this.param.pos.AId
    let PId = this.param.pos.PId
    let Dir = this.param.pos.Sz > 0?1:-1


    let p = {
        Sym: Sym,
        PId: PId,
        AId: AId,
        COrdId: new Date().getTime() + '',
        Dir: Dir,
        OType: 2,
        Prz: 1,
        Qty: Number(this.form.num),
        QtyDsp: 0,
        Tif: 0,
        OrdFlag: 0,
        PrzChg: 0
    }


    let aWdrawable = Number(obj.wlt.aWdrawable || 0 )
    if(aWdrawable == 0){
        return window.$message({content: '可用资金不足！', type: 'danger'})
    }else if(aWdrawable < Number(this.MgnNeed)){
        return window.$message({content: '可用资金不足！', type: 'danger'})
    }

    window.gTrd.ReqTrdOrderNew(p, function(aTrd, aArg){
        console.log('ReqTrdOrderNew ==> ', aArg)
        if(aArg.code == 0){
          that.open = false
        }
    })
  },
  setTabsActive: function (param) {
    this.tabsActive = param
  },
  initInfo: function (param) {
    this.form = {
      prz: '',
      num: '',
    }
    this.param = param
    this.initWlt()
  },
  openMarketAddMode: function(param){
    /** param = {
      pos: {
        AId: 'xxxxxx'
        Sym: 'BTC.USDT',
        PId: '', //仓位PId
        Sz: 0, //持仓数量
      },
      cb: function(){}
    }*/
    gEVBUS.emit(obj.EV_OPENMARKETADDMODE_UPD, {Ev: obj.EV_OPENMARKETADDMODE_UPD, param: param})
  },
  closeStopPLMode: function(){
    this.open = false
    this.form.num = ''
  },
  onNumInput: function(e){
    let Sym = this.param.pos.Sym
    let ass = window.gMkt.AssetD[Sym]
    let maxNum = Number(ass?ass.OrderMaxQty:0)
    if(Number(e.target.value) > maxNum){
        this.form.num = maxNum
    }else {
        this.form.num = e.target.value
    }
    this.setMgnNeed()
  },
  initWlt: function(arg){
    let Sym = this.param.pos?this.param.pos.Sym:''
    if(!Sym) return
    let assetD = window.gMkt.AssetD[Sym] || {}
    let wallets = []
    if(assetD.TrdCls == 2 || assetD.TrdCls == 3){
        wallets = window.gTrd.Wlts['01']
    }
    for(let i = 0;i < wallets.length; i++){
        let item = wallets[i]
        if(item.AId && item.Coin == assetD.SettleCoin){
            this.wlt = item
        }
    }
    m.redraw()
  },
  setMgnNeed() {
    let that = this;
    let pos = this.param.pos
    let Sym = pos.Sym
    let Prz = 0
    let QtyLong = Number(this.form.num)
    let QtyShort = Number(this.form.num)
    let PId = pos.activePId
    let Lever = pos.Lever
    let Dir = pos.Sz > 0?1:-1
    
    let posObj = window.gTrd.Poss
    let posArr = []
    for(let key in posObj){
      posArr.push(posObj[key])
    }
    let order = window.gTrd.Orders['01']
    let wallet = window.gTrd.Wlts['01']
    let lastTick = window.gMkt.lastTick
    let assetD = window.gMkt.AssetD
    let RSdata = window.gTrd.RS

    Prz = (lastTick[Sym] && lastTick[Sym].LastPrz) || (assetD[Sym] && assetD[Sym].PrzLatest) || 0

    let newOrderForBuy = {
        Sym: Sym,
        Prz: Prz,
        Qty: QtyLong,
        QtyF: 0,
        Dir: Dir,
        PId: PId, 
        Lvr: Lever,
        MIRMy: 0
    }
    clacMgnNeed.calcFutureWltAndPosAndMI(posArr, wallet, order, RSdata, assetD, lastTick, '1', newOrderForBuy, 0, res => {
        console.log('成本计算结果： ', res)
        that.MgnNeed = Number(res || 0)
    })
    
},
}

export default {
  oninit: function (vnode) {

  },
  oncreate: function (vnode) {
    obj.initEVBUS()

    window.$openMarketAddMode = obj.openMarketAddMode
  },
  view: function (vnode) {

    return m('div', {class: 'pub-market-add'}, [
      m("div", { class: "modal" + (obj.open ? " is-active" : ''), }, [
        m("div", { class: "modal-background" }),
        m("div", { class: "modal-card" }, [
          m("header", { class: "pub-market-add-head modal-card-head" }, [
            m("p", { class: "modal-card-title" }, [
              '市价加仓'
            ]),
            m("button", {
              class: "delete", "aria-label": "close", onclick: function () {
                obj.closeStopPLMode()
              }
            }),
          ]),
          m("section", { class: "pub-market-add-content modal-card-body" }, [
            
            m('div', { class: "pub-market-add-content-stopp-input field" }, [
              m('div', { class: "control is-expanded" }, [
                m("input", { class: "input", type: 'number', placeholder: "市价", readonly: true})
              ])
            ]),
            m('div', { class: "pub-market-add-content-stopl-input field" }, [
              m('div', { class: "control is-expanded" }, [
                m('input', { class: "input ", type: 'number', placeholder: "数量(张)", value:  obj.form.num, oninput: function(e){
                  obj.onNumInput(e)
                }})
              ])
            ]),
            m('div', { class: "level" }, [
              m('div', { class: "level-left" }, [
                '委托保证金'
              ]),
              m('div', { class: "level-left" }, [
                Number(obj.MgnNeed || 0).toFixed2(8)
              ]),
            ]),
            m('div', { class: "level" }, [
              m('div', { class: "level-left" }, [
                '可用保证金'
              ]),
              m('div', { class: "level-left" }, [
                obj.wlt.aWdrawable?Number(obj.wlt.aWdrawable).toFixed2(8): (0).toFixed2(8)
              ]),
            ]),
            
          ]),
          m("footer", { class: "pub-market-add-foot modal-card-foot" }, [
            m("button", {
              class: "button is-success", onclick: function () {
                obj.submit()
              }
            }, [
              '确定'
            ]),
            m("button", {
              class: "button", onclick: function () {
                obj.closeStopPLMode()
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
    window.$openMarketAddMode = null
  },
}