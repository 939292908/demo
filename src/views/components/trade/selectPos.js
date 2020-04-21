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
          (pos.Sz>0?'多仓':pos.Sz<0?'空仓':'--')
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
        m('td', {class: '', align: 'center'},[
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
    return pos.Sz == 0 && !pos.aQtySell && !pos.aQtySell && (pos.Flg&1) == 0
  },
  getPosListItem: function(pos, isSelect){
    if(pos){
      return m('div', {key: 'selectPosItem'+pos.PId+(isSelect?'isSelect':''), class: 'level w100 cursor-pointer'+(isSelect?' ':''), onclick: function(){
        obj.selectPosItem(pos)
      }},[
        m('span', {class: ''},[
          '仓位ID '+pos.PId.substr(-4)
        ]),
        m('span', {class: ''},[
          '方向 '+(pos.Sz>0?'多仓':pos.Sz<0?'空仓':'--')
        ]),
        m('span', {class: ''},[
          '数量/价格 '+(pos.PrzIni)+'/'+(pos.Sz)
        ]),
        (isSelect?m('span', {class: "icon"},[
          m('i', {class: "iconfont iconxiala iconfont-medium", "aria-hidden": true })
        ]):'')
      ])
    }else{
      return m('div', {key: 'selectPosItem'+(isSelect?'isSelect':''), class: 'level w100 cursor-pointer'+(isSelect?' ':'')},[
        m('span', {class: ''},[
          '仓位ID --'
        ]),
        m('span', {class: ''},[
          '方向 --'
        ]),
        m('span', {class: ''},[
          '数量/价格 --/--'
        ]),
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
    window.gTrd.ReqTrdPosOp({
      "AId":AId,
      "Sym": Sym,
      "PId": PId,
      "Op": 0,
    },function(gTrd, arg){
      console.log("ReqTrdPosOp ==>>> ", arg)
      if(arg.code == 0){
        window.$message({content: '新增仓位成功！', type: 'success'})
      }else{
        console.log(arg)
        window.$message({content: utils.getTradeErrorCode(arg.code), type: 'danger'})
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
      if(arg.code == 0){
        window.$message({content: '仓位删除成功！', type: 'success'})
      }else{
        console.log(arg)
        window.$message({content: utils.getTradeErrorCode(arg.code), type: 'danger'})
      }
    })
  },
  closeMode: function(){
    this.openSelect = false
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
        return m("div",{class:"pub-select-pos"},[
          m('button', {class: "pub-select-pos-open-btn button is-primary is-inverted is-small",'aria-haspopup':true, "aria-controls": "dropdown-menu2", onclick: function(){
            obj.openSelect = !obj.openSelect
          }}, [
              obj.getPosListItem(obj.posList_obj[obj.posActive], true)
          ]),
          m("div", { class: "pub-select-pos-model modal" + (obj.openSelect ? " is-active" : ''), }, [
            m("div", { class: "modal-background" }),
            m("div", { class: "modal-card" }, [
              m("header", { class: "pub-select-pos-model-header modal-card-head" }, [
                m("p", { class: "modal-card-title" }, [
                  '仓位选择'
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
                          '仓位ID'
                        ]),
                        m("th", { class: "", align: 'center'}, [
                          '方向'
                        ]),
                        m("th", { class: "", align: 'center'}, [
                          '杠杆'
                        ]),
                        m("th", { class: "", align: 'center'}, [
                          '数量/价格'
                        ]),
                        m("th", { class: "", align: 'center'}, [
                          '买挂单'
                        ]),
                        m("th", { class: "", align: 'center'}, [
                          '卖挂单'
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
                  '新增仓位'
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
    },
    onremove: function(){
      obj.rmEVBUS()
    }
}