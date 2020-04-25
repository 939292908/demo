var m = require("mithril")


let obj = {
  EV_OPENSOMECLOSEMODE_UPD: 'EV_openSomeCloseMode_UPD',
  open: false,
  tabsActive: 0,
  form: {
    prz: '',
    num: '',
    maxNum: 0,  //最大可平数量
    lockNum: 0, //冻结数量
  },
  param: {

  },
  quickBtn: [0.25,0.5,0.75,1],
  MgnNeed: '', //市价加仓所需委托保证金
  //初始化全局广播
  initEVBUS: function () {
    let that = this

    if (this.EV_OPENMARKETADDMODE_UPD_unbinder) {
      this.EV_OPENMARKETADDMODE_UPD_unbinder()
    }
    this.EV_OPENMARKETADDMODE_UPD_unbinder = window.gEVBUS.on(this.EV_OPENSOMECLOSEMODE_UPD, arg => {
      that.open = true
      that.initInfo(arg.param)
    })
  },
  //删除全局广播
  rmEVBUS: function () {
    if (this.EV_OPENMARKETADDMODE_UPD_unbinder) {
      this.EV_OPENMARKETADDMODE_UPD_unbinder()
    }
  },
  submit: function () {
    let that = this
    console.log('some close submit', this.form)
    if(this.tabsActive == 0){
      if(this.form.prz === '0'){
        return $message({title: '平仓价格不能为0', content: '平仓价格不能为0', type: 'danger'})
      }else if(!this.form.prz){
        return $message({title: '平仓价格不能为空', content: '平仓价格不能为空', type: 'danger'})
      }
    }

    if(this.form.num === '0'){
      return $message({title: '平仓数量不能为0', content: '平仓数量不能为0', type: 'danger'})
    }else if(!this.form.num){
      return $message({title: '平仓数量不能为空', content: '平仓数量不能为空', type: 'danger'})
    }

    let Sym = this.param.pos.Sym
    let AId = this.param.pos.AId
    let PId = this.param.pos.PId
    let Dir = this.param.pos.Sz > 0?-1:1

    let p = null;
    if(this.tabsActive == 0){
      p = {
        Sym: Sym,
        PId: PId,
        AId: AId,
        COrdId: new Date().getTime() + '',
        Dir: Dir,
        OType: 1,
        Prz: Number(this.form.prz),
        Qty: Number(this.form.num),
        QtyDsp: 0,
        Tif: 0,
        OrdFlag: 2, //只减仓
        PrzChg: 0,
      }
    }else{
      p = {
        Sym: Sym,
        PId: PId,
        AId: AId,
        COrdId: new Date().getTime() + '',
        Dir: Dir,
        OType: 2,
        Prz: 1,
        Qty: Number(this.form.num),
        QtyDsp: 0,
        Tif: 1,
        OrdFlag: 2, //只减仓
        PrzChg: 10,
      }
    }
    if(!p) return 
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
    let maxNum = 0
    let lockNum = 0
    if(param.pos.Sz > 0){
      lockNum = param.pos.aQtySell
    }else if(param.pos.Sz < 0){
      lockNum = param.pos.aQtyBuy
    }
    lockNum = Math.min(Math.abs(param.pos.Sz), lockNum)
    maxNum = Math.max(Math.abs(param.pos.Sz) - lockNum, 0)
    this.maxNum = maxNum
    this.lockNum = lockNum
    
    this.param = param
  },
  openMode: function(param){
    /** param = {
      pos: {
        AId: 'xxxxxx'
        Sym: 'BTC.USDT',
        PId: '', //仓位PId
        Sz: 0, //持仓数量
      },
      cb: function(){}
    }*/
    gEVBUS.emit(obj.EV_OPENSOMECLOSEMODE_UPD, {Ev: obj.EV_OPENSOMECLOSEMODE_UPD, param: param})
  },
  closeStopPLMode: function(){
    this.open = false
    this.form.prz = ''
    this.form.num = ''
  },
  onPrzInput: function(e){
    let Sym = this.param.pos.Sym
    let ass = window.gMkt.AssetD[Sym]
    let maxPrz = Number(ass?ass.PrzMax:0)
    if(Number(e.target.value) > maxPrz){
      this.form.prz = maxPrz
    }else {
      this.form.prz = e.target.value
    }
  },
  onNumInput: function(e){
    let Sym = this.param.pos.Sym
    let ass = window.gMkt.AssetD[Sym]
    let maxNum = this.maxNum || Number(ass?ass.OrderMaxQty:0)
    if(Number(e.target.value) > maxNum){
        this.form.num = maxNum
    }else {
        this.form.num = e.target.value
    }
  },
  setTabsActive: function(param){
    this.tabsActive = param
  },
  getQuickBtns: function(){
    return this.quickBtn.map(function(item){
      return m('button', {key: 'someCloseQuickBtn'+item, class: "button is-outline level-item", onclick: function(e){
        obj.clickQuickBtn(item)
      }}, [
        (item*100)+'%'
      ])
    })
  },
  clickQuickBtn: function(param){
    console.log('clickQuickBtn', param)
    this.form.num = (this.maxNum * param).toFixed(0)
  }
}

export default {
  oninit: function (vnode) {

  },
  oncreate: function (vnode) {
    obj.initEVBUS()

    window.$openSomeCloseMode = obj.openMode
  },
  view: function (vnode) {

    return m('div', {class: 'pub-some-close'}, [
      m("div", { class: "modal" + (obj.open ? " is-active" : ''), }, [
        m("div", { class: "modal-background" }),
        m("div", { class: "modal-card" }, [
          m("header", { class: "pub-some-close-head modal-card-head" }, [
            m("p", { class: "modal-card-title" }, [
              '部分平仓'
            ]),
            m("button", {
              class: "delete", "aria-label": "close", onclick: function () {
                obj.closeStopPLMode()
              }
            }),
          ]),
          m("section", { class: "pub-some-close-content modal-card-body" }, [
            m("div", { class: "tabs " }, [
              m("ul", [
                m("li", { class: "" + (obj.tabsActive == 0 ? ' is-active' : '') }, [
                  m("a", {
                    class: "", onclick: function () {
                      obj.setTabsActive(0)
                    }
                  }, [
                    '限价'
                  ])
                ]),
                m("li", { class: "" + (obj.tabsActive == 1 ? ' is-active' : '') }, [
                  m("a", {
                    class: "", onclick: function () {
                      obj.setTabsActive(1)
                    }
                  }, [
                    '市价'
                  ])
                ]),
              ])
            ]),
            m('div', {class: "field"+(obj.tabsActive == 0?'':' is-hidden')}, [
              m('div', { class: "pub-some-close-content-stopp-input field" }, [
                m('div', { class: "control is-expanded" }, [
                  m("input", { class: "input", type: 'number', placeholder: "价格", value:  obj.form.prz, oninput: function(e){
                    obj.onPrzInput(e)
                  }})
                ])
              ]),
              m('div', { class: "pub-some-close-content-stopl-input field" }, [
                m('div', { class: "control is-expanded" }, [
                  m('input', { class: "input ", type: 'number', placeholder: "数量(张)", value:  obj.form.num, oninput: function(e){
                    obj.onNumInput(e)
                  }})
                ])
              ]),
            ]),
            m('div', {class: "field"+(obj.tabsActive == 1?'':' is-hidden')}, [
              m('div', { class: "pub-some-close-content-stopp-input field" }, [
                m('div', { class: "control is-expanded" }, [
                  m("input", { class: "input", type: 'number', placeholder: "市价", readonly: true})
                ])
              ]),
              m('div', { class: "pub-some-close-content-stopl-input field" }, [
                m('div', { class: "control is-expanded" }, [
                  m('input', { class: "input ", type: 'number', placeholder: "数量(张)", value:  obj.form.num, oninput: function(e){
                    obj.onNumInput(e)
                  }})
                ])
              ]),
            ]),
            m('.buttons.level', {}, [
              obj.getQuickBtns()
            ]),
            m('div', { class: "level" }, [
              m('div', { class: "level-left" }, [
                '可平数量：'+ obj.maxNum
              ]),
              m('div', { class: "level-left" }, [
                '冻结数量：'+ obj.lockNum
              ]),
            ]),
            
          ]),
          m("footer", { class: "pub-some-close-foot modal-card-foot" }, [
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
  onbeforeremove: function (vnode) {
    obj.rmEVBUS()
    window.$openSomeCloseMode = null
  },
}