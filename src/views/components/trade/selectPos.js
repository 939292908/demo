var m = require("mithril")

let obj = {
  openSelect: false,
  posActive: '',
  posList: [],
  posList_obj: {},
  //初始化全局广播
  initEVBUS: function(){
    let that = this
    
    if(this.EV_GET_POS_READY_unbinder){
        this.EV_GET_POS_READY_unbinder()
    }
    this.EV_GET_POS_READY_unbinder = window.gEVBUS.on(gTrd.EV_GET_POS_READY,arg=> {
        that.initPos()
    })

    if(this.EV_POS_UPD_unbinder){
      this.EV_POS_UPD_unbinder()
    }
    this.EV_POS_UPD_unbinder = window.gEVBUS.on(gTrd.EV_POS_UPD,arg=> {
        that.initPos()
    })

    //当前选中合约变化全局广播
    if(this.EV_CHANGESYM_UPD_unbinder){
      this.EV_CHANGESYM_UPD_unbinder()
    }
    this.EV_CHANGESYM_UPD_unbinder = window.gEVBUS.on(gMkt.EV_CHANGESYM_UPD,arg=> {
      that.updateSpotInfo(arg)
    })

    if(this.EV_WEB_LOGOUT_unbinder){
      this.EV_WEB_LOGOUT_unbinder()
    }
    this.EV_WEB_LOGOUT_unbinder = window.gEVBUS.on(gWebAPI.EV_WEB_LOGOUT,arg=> {
      that.updateSpotInfo(arg)
    })
    
    
  },
  //删除全局广播
  rmEVBUS: function(){
      if(this.EV_GET_POS_READY_unbinder){
          this.EV_GET_POS_READY_unbinder()
      }
      if(this.EV_CHANGESYM_UPD_unbinder){
        this.EV_CHANGESYM_UPD_unbinder()
      }
      if(this.EV_POS_UPD_unbinder){
        this.EV_POS_UPD_unbinder()
      }
  },
  initPos: function(){
    let that = this
    let Poss = window.gTrd.Poss
    let posList = []
    this.posList_obj = {}
    for(let key in Poss){
      let pos = Poss[key]
      let ass = window.gMkt.AssetD[pos.Sym]
      let _obj = utils.getPosInfo(pos, ass)
      if(_obj && _obj.Sym == window.gMkt.CtxPlaying.Sym){
        posList.push(_obj)
        this.posList_obj[_obj.PId] = _obj
        
      }
    }
    this.posList = posList
    if(window.gTrd.CtxPlaying.activePId){
      this.posActive = window.gTrd.CtxPlaying.activePId
    }
    let i = posList.findIndex(function(item){
      return item.PId == that.posActive
    })
    if(i == -1){
      this.selectPosItem(posList[0])
    }
    
  },
  selectPosItem: function(param){
    if(!param || this.posActive == param.PId) return
    this.posActive = param.PId
    this.openSelect = false
    window.gTrd.CtxPlaying.activePId = param.PId
    
    gEVBUS.emit(window.gTrd.EV_CHANGEACTIVEPOS_UPD, {Ev: window.gTrd.EV_CHANGEACTIVEPOS_UPD, PId: this.posActive})
  },
  getPosList: function(isTable){
    let that = this
    if(isTable){
      return this.posList.map(function(item, i){
        return that.getPosListTableItem(item)
      })
    }else{
      return this.posList.map(function(item, i){
        return that.getPosListItem(item)
      })
    }
  },
  getPosListTableItem: function(pos, isSelect){
    if(pos){
      return m('tr', {key: 'selectPosItem'+pos.PId, class: 'cursor-pointer', onclick: function(){
        obj.selectPosItem(pos)
      }},[
        m('td', {class: ''},[
          pos.PId.substr(-4)
        ]),
        m('td', {class: '', align: 'center'},[
          (pos.Sz>0?gDI18n.$t('10170'/*'多仓'*/):pos.Sz<0?gDI18n.$t('10171'/*'空仓'*/):'--')
        ]),
        m('td', {class: '', align: 'center'},[
          pos.displayLever
        ]),
        m('td', {class: '', align: 'center'},[
          (pos.PrzIni)+'/'+(pos.Sz),
        ]),
        m('td', {class: '', align: 'center'},[
          pos.aQtyBuy || 0
        ]),
        m('td', {class: '', align: 'center'},[
          pos.aQtySell || 0
        ]),
        m('td', {class: '', align: 'center', onclick: function (e) {
          obj.delPos(pos)
          window.stopBubble(e)
        }},[
          m("button", {
            class: "delete"+(obj.checkPosDelShow(pos)?'':' is-hidden'), 
            "aria-label": "close", 
            onclick: function (e) {
              obj.delPos(pos)
              window.stopBubble(e)
            }
          }),
        ])
      ])
    } 
  },
  checkPosDelShow: function(pos){
    return pos.Sz == 0 && !pos.aQtySell && !pos.aQtyBuy && (pos.Flg&1) == 0
  },
  getPosListItem: function(pos, isSelect){
    if(pos){
      return m('div', {key: 'selectPosItem'+pos.PId+(isSelect?'isSelect':''), class: 'is-flex w100 cursor-pointer'+(isSelect?' ':''), onclick: function(){
        obj.selectPosItem(pos)
      }},[
        m('span', {class: ''},[
          gDI18n.$t('10067'/*'仓位ID '*/)+pos.PId.substr(-4)
        ]),
        m('.spacer'),
        m('span', {class: ''},[
          gDI18n.$t('10172'/*'方向 '*/)+(pos.Sz>0?gDI18n.$t('10170'/*'多仓'*/):pos.Sz<0?gDI18n.$t('10171'/*'空仓'*/):'--')
        ]),
        m('.spacer'),
        m('span', {class: ''},[
          gDI18n.$t('10173'/*'数量/价格 '*/)+(pos.PrzIni)+'/'+(pos.Sz)
        ]),
        (isSelect?m('span', {class: "icon"},[
          m('i', {class: "iconfont iconxiala iconfont-medium", "aria-hidden": true })
        ]):'')
      ])
    }else{
      return m('div', {key: 'selectPosItem'+(isSelect?'isSelect':''), class: 'is-flex w100 cursor-pointer'+(isSelect?' ':'')},[
        m('span', {class: ''},[
          gDI18n.$t('10067'/*仓位ID*/) + ' --'
        ]),
        m('.spacer'),
        m('span', {class: ''},[
          gDI18n.$t('10172'/*方向*/) + ' --'
        ]),
        m('.spacer'),
        m('span', {class: ''},[
          gDI18n.$t('10173'/*数量/价格*/) + ' --/--'
        ]),
        m('.spacer'),
        (isSelect?m('span', {class: "icon"},[
          m('i', {class: "iconfont iconxiala iconfont-medium", "aria-hidden": true })
        ]):'')
      ])
    }
      
  },
  updateSpotInfo: function(){
    window.gTrd.CtxPlaying.activePId = ''
    this.activePId = ''
    this.initPos()
  },
  addPos: function(param){
    console.log('add pos')
    let AId = window.gTrd.RT["UserId"]+'01'
    let Sym = window.gMkt.CtxPlaying.Sym
    let PId = window.gMkt.CtxPlaying.activePId
    // 判断资金情况 start
    let ass = window.gMkt.AssetD[Sym]
    if(!ass) return
    let SettleCoin = ass.SettleCoin
    let Wlts = window.gTrd.Wlts['01']
    let aWdrawable = 0
    if(Wlts){
      for(let item of Wlts){
        if(item.Coin == SettleCoin){
          aWdrawable = item.aWdrawable || 0
        }
      }
    }
    if(!Wlts || aWdrawable == 0){
        return window.$message({title: gDI18n.$t('10038'/*'可用资金不足！'*/), content: gDI18n.$t('10038'/*'可用资金不足！'*/), type: 'danger'})
    }
    // 判断资金情况 end


    // 模式3判断仓位数量是否超限 start
    let Poss = window.gTrd.Poss
    let posArr = []
    for(let key in Poss){
        let pos = Poss[key]
        if(pos.Sym == Sym && pos.Sz != 0){
            posArr.push(pos)
        }
    }
    if(posArr.length >= window.$config.future.maxPosNum){
        return window.$message({title: gDI18n.$t('10037'), content: gDI18n.$t('10147',{value : window.$config.future.maxPosNum}), type: 'danger'})
        // return window.$message({title: '提示', content: '同一合约最多同时存在'+window.$config.future.maxPosNum+'个仓位!', type: 'danger'})
    }
    // 判断仓位数量是否超限 end

    window.gTrd.ReqTrdPosOp({
      "AId":AId,
      "Sym": Sym,
      "PId": PId,
      "Op": 0,
    },function(gTrd, arg){
      console.log("ReqTrdPosOp ==>>> ", arg)
      if(arg.code == 0 && !arg.data.ErrCode){
        window.$message({title: gDI18n.$t('10174'/*'新增仓位成功！'*/), content: gDI18n.$t('10174'/*'新增仓位成功！'*/), type: 'success'})
      }else{
        console.log(arg)
        window.$message({title: utils.getTradeErrorCode(arg.code || arg.data.ErrCode), content: utils.getTradeErrorCode(arg.code || arg.data.ErrCode), type: 'danger'})
      }
    })
  },
  delPos: function(param){
    console.log('del pos', param)
    let AId = window.gTrd.RT["UserId"]+'01'
    let Sym = param.Sym
    let PId = param.PId
    window.gTrd.ReqTrdPosOp({
      "AId":AId,
      "Sym": Sym,
      "PId": PId,
      "Op": 1,
    },function(gTrd, arg){
      console.log("ReqTrdPosOp ==>>> ", arg)
      if(arg.code == 0 && !arg.data.ErrCode){
        window.$message({title: gDI18n.$t('10175'/*'仓位删除成功！'*/), content: gDI18n.$t('10175'/*'仓位删除成功！'*/), type: 'success'})
      }else{
        console.log(arg)
        window.$message({title: utils.getTradeErrorCode(arg.code || arg.data.ErrCode), content: utils.getTradeErrorCode(arg.code || arg.data.ErrCode), type: 'danger'})
      }
    })
  },
  closeMode: function(){
    this.openSelect = false
  },
  openMode: function(){
    if(window.gWebAPI.isLogin()){
      this.openSelect = !this.openSelect
    }else{
      window.gWebAPI.needLogin()
    }
  },

  getPosList_m:function (){
    let that = this
      return this.posList.map(function(item, i){
        return m("div",{class : "card pos-id"},[
          m("div",{class : "card-content"},[
            that.getPosListTableItem_m(item)
          ])
        ])
      }) 
  },

  getPosListTableItem_m:function (pos){
    return m("div",{class : "",key: 'selectPosItem'+pos.PId, class: 'cursor-pointer', onclick: function(){
      obj.selectPosItem(pos)
    }},[
      m('table',{class : "currency-font"},[
        m('tr',{class : ""},[
          m('td',{class : ""},[
            m('span',{class : "has-text-grey"},[
              gDI18n.$t('10067') + "："//"仓位ID: "
            ]),
            m('span',{class : "has-text-black"},[
              pos.PId.substr(-4)
            ]),
          ]),
          m('td',{class : ""},[
            m('span',{class : "has-text-grey"},[
              gDI18n.$t('10172') + "："//"方向: "
            ]),
            m('span',{class : "has-text-black"},[
              (pos.Sz>0?gDI18n.$t('10170'/*'多仓'*/):pos.Sz<0?gDI18n.$t('10171'/*'空仓'*/):'--')
            ]),
          ]),
          m('td', {class: '', align: 'center', onclick: function (e) {
            obj.delPos(pos)
            window.stopBubble(e)
          }},[
            m("button", {
              class: "delete"+(obj.checkPosDelShow(pos)?'':' is-hidden'), 
              "aria-label": "close", 
              onclick: function (e) {
                obj.delPos(pos)
                window.stopBubble(e)
              }
            }),
          ])
        ]),
        m('tr',{class : ""},[
          m('td',{class : ""},[
            m('span',{class : "has-text-grey"},[
              gDI18n.$t('10054') + "："//"杠杆: "
            ]),
            m('span',{class : "has-text-black"},[
              pos.displayLever
            ]),
          ]),
          m('td',{class : ""},[
            m('span',{class : "has-text-grey"},[
              gDI18n.$t('10173') + "："//"数量/价格: "
            ]),
            m('span',{class : "has-text-black"},[
              (pos.PrzIni)+'/'+(pos.Sz),
            ]),
          ]),
        ]),
        m('tr',{class : ""},[
          m('td',{class : ""},[
            m('span',{class : "has-text-grey"},[
              gDI18n.$t('10177') + "："//"买挂单: "
            ]),
            m('span',{class : "has-text-black"},[
              pos.aQtyBuy || 0
            ]),
          ]),
          m('td',{class : ""},[
            m('span',{class : "has-text-grey"},[
              gDI18n.$t('10178') + "："//"卖挂单: "
            ]),
            m('span',{class : "has-text-black"},[
              pos.aQtySell || 0
            ]),
          ]),
        ]),
      ])
    ])
  },
  //移动端selectpos界面
  getselectPos_m:function (){
    return m("div",{class:"pub-select-pos"},[
      m('button', {class: "pub-select-pos-open-btn button is-primary is-inverted is-small",'aria-haspopup':true, "aria-controls": "dropdown-menu2", onclick: function(){
        obj.openMode()
      }}, [
          obj.getPosListItem(obj.posList_obj[obj.posActive], true)
      ]),
      m("div", { class: "pub-select-pos-model modal" + (obj.openSelect ? " is-active" : ''), }, [
        m("div", { class: "modal-background" }),
        m("div", { class: "modal-card card-first-head" }, [
          m("header", { class: "pub-select-pos-model-header modal-card-head modal-card-body-list" }, [
            m("p", { class: "modal-card-title" }, [
              gDI18n.$t('10176'/*'仓位选择'*/)
            ]),
            m("button", {
              class: "delete", "aria-label": "close", onclick: function () {
                obj.closeMode()
              }
            }),
          ]),
          m("section", { class: "pub-select-pos-model-content modal-card-body modal-card-body-list " }, [
            obj.getPosList_m()
          ]),
          m("footer", { class: "pub-select-pos-model-foot modal-card-foot modal-card-body-list" }, [
            m("button", {
              class: "button is-success", onclick: function () {
                obj.addPos()
              }
            }, [
              gDI18n.$t('10179'/*'新增仓位'*/)
            ])
          ]),
        ])
      ])
    ])
  }
}
export default {
    oninit: function(vnode){
      
    },
    oncreate: function(vnode){
        obj.initEVBUS()
        obj.initPos()
    },
    view: function(vnode) {
      if (window.isMobile) {
        return obj.getselectPos_m()
      } else {
        return m("div",{class:"pub-select-pos"},[
          m('button', {class: "pub-select-pos-open-btn button is-primary is-inverted is-small",'aria-haspopup':true, "aria-controls": "dropdown-menu2", onclick: function(){
            // obj.openSelect = !obj.openSelect
            obj.openMode()
          }}, [
              obj.getPosListItem(obj.posList_obj[obj.posActive], true)
          ]),
          m("div", { class: "pub-select-pos-model modal" + (obj.openSelect ? " is-active" : ''), }, [
            m("div", { class: "modal-background" }),
            
            m("div", { class: "modal-card" }, [
              m("header", { class: "pub-select-pos-model-header modal-card-head" }, [
                m("p", { class: "modal-card-title" }, [
                  gDI18n.$t('10176'/*'仓位选择'*/)
                ]),
                m("button", {
                  class: "delete", "aria-label": "close", onclick: function () {
                    obj.closeMode()
                  }
                }),
              ]),
              m("section", { class: "pub-select-pos-model-content modal-card-body " }, [
                m("table", { class: "table is-hoverable ", cellpadding: 0, cellspacing: 0 }, [
                  m("thead", { class: "" }, [
                      m("tr", { class: "" }, [
                        m("th", { class: ""}, [
                          gDI18n.$t('10067')//'仓位ID'
                        ]),
                        m("th", { class: "", align: 'center'}, [
                          gDI18n.$t('10172')//'方向'
                        ]),
                        m("th", { class: "", align: 'center'}, [
                          gDI18n.$t('10054')//'杠杆'
                        ]),
                        m("th", { class: "", align: 'center'}, [
                          gDI18n.$t('10173')//'数量/价格'
                        ]),
                        m("th", { class: "", align: 'center'}, [
                          gDI18n.$t('10177')//'买挂单'
                        ]),
                        m("th", { class: "", align: 'center'}, [
                          gDI18n.$t('10178')//'卖挂单'
                        ]),
                        m("th", { class: "", align: 'center'}, [])
                      ])
                  ]),
                  m("tbody", { class: "" }, [
                      obj.getPosList(true)
                  ])
              ])
                // obj.getPosList(),
              ]),
              m("footer", { class: "pub-select-pos-model-foot modal-card-foot" }, [
                m("button", {
                  class: "button is-success", onclick: function () {
                    obj.addPos()
                  }
                }, [
                  gDI18n.$t('10179')//'新增仓位'
                ])
              ]),
            ])
          ])
            // m('.dropdown-menu', {class:"max-height-500 scroll-y w100", id: "dropdown-menu2", role: "menu"}, [
            //     m('.dropdown-content', {class:"has-text-centered is-size-7"}, [
            //       obj.getPosList(),
            //       m('button', {class:"button is-fullwidth is-light is-small", onclick: function(){
            //         obj.addPos()
            //       }}, [
            //         '新增仓位'
            //       ]),
            //     ]),
            // ]),
        ])
      }
    },
    onbeforeremove: function(){
      obj.rmEVBUS()
    }
}