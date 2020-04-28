var m = require("mithril")

let obj = {
  posList: [],
  theadList: [
    {
      title: '仓位ID',
      class: "position-pid pub-table-1"
    }, {
      title: '合约',
      class: "position-sym pub-table-2"
    }, {
      title: '数量',
      class: "position-sz pub-table-3"
    }, {
      title: '开仓均价',
      class: "position-prz pub-table-4"
    }, {
      title: '强平价格',
      class: "position-przLiq pub-table-5"
    }, {
      title: '风险度',
      class: "position-rate pub-table-6"
    }, {
      title: '保证金',
      class: "position-mm pub-table-7"
    }, {
      title: '未实现盈亏(回报率)',
      class: "position-upnl pub-table-8"
    }, {
      title: '已实现盈亏',
      class: "position-pnl pub-table-9"
    }, {
      title: '止盈/止损',
      class: "position-stoppl pub-table-10"
    }, {
      title: '策略',
      class: "position-buttons pub-table-11"
    } 
  ],
  //初始化全局广播
  initEVBUS: function(){
    let that = this
    
    if(this.EV_GET_POS_READY_unbinder){
        this.EV_GET_POS_READY_unbinder()
    }
    this.EV_GET_POS_READY_unbinder = window.gEVBUS.on(gTrd.EV_GET_POS_READY,arg=> {
        that.initObj()
        that.subPosNeedSymTick()
    })

    if(this.EV_POS_UPD_unbinder){
      this.EV_POS_UPD_unbinder()
    }
    this.EV_POS_UPD_unbinder = window.gEVBUS.on(gTrd.EV_POS_UPD,arg=> {
        that.initObj()
        that.subPosNeedSymTick()
    })

    //assetD合约详情全局广播
    if(this.EV_ASSETD_UPD_unbinder){
      this.EV_ASSETD_UPD_unbinder()
    }
    this.EV_ASSETD_UPD_unbinder = window.gEVBUS.on(gMkt.EV_ASSETD_UPD,arg=> {
        that.initObj()
        that.subPosNeedSymTick()
    })
    
    if(this.EV_POSABDWLTCALCOVER_UPD_unbinder){
      this.EV_POSABDWLTCALCOVER_UPD_unbinder()
    }
    this.EV_POSABDWLTCALCOVER_UPD_unbinder = window.gEVBUS.on(window.gTrd.EV_POSABDWLTCALCOVER_UPD,arg=> {
        that.initObj()
    })
    
  },
  //删除全局广播
  rmEVBUS: function(){
      if(this.EV_GET_POS_READY_unbinder){
          this.EV_GET_POS_READY_unbinder()
      }
      if(this.EV_POS_UPD_unbinder){
        this.EV_POS_UPD_unbinder()
      }
      if(this.EV_ASSETD_UPD_unbinder){
        this.EV_ASSETD_UPD_unbinder()
      }
      if(this.EV_POSABDWLTCALCOVER_UPD_unbinder){
        this.EV_POSABDWLTCALCOVER_UPD_unbinder()
      }
  },
  initObj(){
    let Poss =window.gTrd.Poss
    let posList = []
    for(let key in Poss){
      let pos = Poss[key]
      let ass = window.gMkt.AssetD[pos.Sym]
      let obj = utils.getPosInfo(pos, ass)
      if(obj && obj.Sz != 0){
        posList.push(obj)
      }
    }
    this.posList = posList
  },
  
  getTheadList: function(){
    return this.theadList.map(function(item, i){
      return m("th",{key: "positiontHeadItem"+i, class:" "+item.class},[
        item.title
      ])
    })
  },
  getPosList: function(){
    let btnsOpen = window.$config.positionBtns.desktop
    return this.posList.map(function(item, i){
      return m("tr",{key: "posTableListItem"+i, class:""},[
        m("td",{class:""},[
          item.PId.substr(-4)
        ]),
        m("td",{class:""},[
          m("p",{class:""},[
            utils.getSymDisplayName(window.gMkt.AssetD, item.Sym)
          ]),
          m("p",{class:"pub-pos-change-lever"+utils.getColorStr(item.Sz > 0?1:-1, 'font'), onclick: function(){
            obj.setLeverage(item)
          }},[
            m('span', {}, [
              item.displayLever,
            ]),
            m("i",{class:"iconfont iconotc-editName iconfont-medium"+(btnsOpen.leverage.open?'':' is-hidden')}),
          ]),
        ]),
        m("td",{class:""},[
          item.Sz
        ]),
        m("td",{class:""},[
          item.PrzIni
        ]),
        m("td",{class:""},[
          item.aPrzLiq
        ]),
        m("td",{class:""},[
          item.aMgnRateforPrzMStr+'/'+item.aMgnRateforLiqStr
        ]),
        m("td",{class:"pub-pos-changeMgn", onclick: function(){
          obj.changeMgn(item)
        }},[
          m('span', {class:""}, [
            item.aMM 
          ]),
          m("i",{class:"iconfont iconotc-editName iconfont-medium"+(btnsOpen.changeMgn.open && item.Lever != 0?'':' is-hidden')}),
        ]),
        m("td",{class:""+utils.getColorStr(item.UPNLColor, 'font')},[
          item.aUPNL+'('+item.aProfitPerStr+')'
        ]),
        m("td",{class:""+utils.getColorStr(item.PNLColor, 'font')},[
          item.RPNL
        ]),
        m("td",{class:"pub-pos-stoppl", onclick: function(){
          obj.setStopPL(item)
        }},[
          m('span', {class:""}, [
            (item.StopP || '--')+'/'+(item.StopL || '--'),
          ]),
          m("i",{class:"iconfont iconotc-editName iconfont-medium"+(btnsOpen.stopPL.open?'':' is-hidden')}),
        ]),
        m("td",{class:"pub-pos-buttons"},[
          m("button",{class:"button is-primary "+(item.loading?' is-loading': '')+(btnsOpen.marketClose.open?'':' is-hidden'), onclick: function(){
            obj.placeOrder('close', item)
          }},[
            '市价平仓'
          ]),
          m("button",{class:"button is-primary "+(item.loading?' is-loading': '')+(btnsOpen.doubleOpen.open?'':' is-hidden'), onclick: function(){
            obj.placeOrder('add', item)
          }},[
            '加倍开仓'
          ]),
          m("button",{class:"button is-primary "+(item.loading?' is-loading': '')+(btnsOpen.backOpen.open?'':' is-hidden'), onclick: function(){
            obj.placeOrder('back', item)
          }},[
            '反向开仓'
          ]),
          m("button",{class:"button is-primary "+(item.loading?' is-loading': '')+(btnsOpen.narketAdd.open?'':' is-hidden'), onclick: function(){
            obj.placeOrder('marketAdd', item)
          }},[
            '市价加仓'
          ]),
          m("button",{class:"button is-primary "+(item.loading?' is-loading': '')+(btnsOpen.marketSomeClose.open || btnsOpen.limitSomeClose.open?'':' is-hidden'), onclick: function(){
            obj.placeOrder('someClose', item)
          }},[
            btnsOpen.marketSomeClose.open && btnsOpen.limitSomeClose.open ?'平仓': btnsOpen.marketSomeClose.open ?'市价平仓':btnsOpen.limitSomeClose.open ?'限价平仓': '平仓'
          ]),
        ])
      ])
    })
  },
  getPosListForM: function(){
    let btnsOpen = window.$config.positionBtns.mobile
    return this.posList.map(function(item, i){
      return m('.card', {key: "posTableListItemForM"+i}, [
        m('header', { class: 'card-header' }, [
          m('p', { class: 'card-header-title' }, [
            '仓位ID: '+item.PId.substr(-4)
          ]),
        ]),
        m('div', { class: 'card-content' }, [
          m('div', {class:"pub-pos-m-content-header"}, [
            m('span', {class:""}, [
              utils.getSymDisplayName(window.gMkt.AssetD, item.Sym)
            ]),
            m('div', {class:"pub-pos-change-lever"+utils.getColorStr(item.Sz > 0?1:-1, 'font'), onclick: function(){
              obj.setLeverage(item)
            }}, [
              m('span', {}, [
                item.displayLever,
              ]),
              m("i",{class:"iconfont iconotc-editName iconfont-medium"+(btnsOpen.leverage.positionList?'':' is-hidden')}),
            ]),
          ]),
          m('div', { class: 'pub-pos-m-content content is-flex' }, [
            m('div', {}, [
              m('p', {}, [
                '持仓数量(张)'
              ]),
              m('p', {}, [
                item.Sz
              ]),
              m('p', {}, [
                '开仓均价('+item.SettleCoin+')'
              ]),
              m('p', {}, [
                item.PrzIni
              ]),
            ]),
            m('.spacer'),
            m('div', {}, [
              m('p', {}, [
                '保证金('+item.SettleCoin+')'
              ]),
              m('p', {}, [
                item.aMM 
              ]),
              m('p', {}, [
                '强平价格('+item.SettleCoin+')'
              ]),
              m('p', {}, [
                item.aPrzLiq
              ]),
            ]),
            m('.spacer'),
            m('div', { class: "has-text-right"}, [
              m('p', {}, [
                '未实现盈亏('+item.SettleCoin+')'
              ]),
              m('p', {class:""+utils.getColorStr(item.UPNLColor, 'font')}, [
                item.aUPNL
              ]),
              m('p', {}, [
                '回报率'
              ]),
              m('p', {class:""+utils.getColorStr(item.aProfitPerColor, 'font')}, [
                item.aProfitPerStr
              ]),
            ]),
          ]),
        ]),
        m('footer', { class: 'card-footer' }, [
          m("a",{class:"is-primary card-footer-item"+(item.loading?' is-loading': '')+(btnsOpen.stopPL.positionList?'':' is-hidden'), onclick: function(){
            obj.setStopPL(item)
          }},[
            '止盈止损'
          ]),
          m("a",{class:"is-primary card-footer-item"+(item.loading?' is-loading': '')+(btnsOpen.marketClose.positionList?'':' is-hidden'), onclick: function(){
            obj.placeOrder('close', item)
          }},[
            '市价平仓'
          ]),
          m("a",{class:"is-primary card-footer-item"+(item.loading?' is-loading': '')+(btnsOpen.doubleOpen.positionList?'':' is-hidden'), onclick: function(){
            obj.placeOrder('add', item)
          }},[
            '加倍开仓'
          ]),
          m("a",{class:"is-primary card-footer-item"+(item.loading?' is-loading': '')+(btnsOpen.backOpen.positionList?'':' is-hidden'), onclick: function(){
            obj.placeOrder('back', item)
          }},[
            '反向开仓'
          ]),
          m("a",{class:"is-primary card-footer-item"+(item.loading?' is-loading': '')+(btnsOpen.narketAdd.positionList?'':' is-hidden'), onclick: function(){
            obj.placeOrder('marketAdd', item)
          }},[
            '市价加仓'
          ]),
          m("a",{class:"is-primary card-footer-item"+(item.loading?' is-loading': '')+(btnsOpen.marketSomeClose.positionList || btnsOpen.limitSomeClose.positionList?'':' is-hidden'), onclick: function(){
            obj.placeOrder('someClose', item)
          }},[
            btnsOpen.marketSomeClose.positionList && btnsOpen.limitSomeClose.positionList ?'平仓': btnsOpen.marketSomeClose.positionList ?'市价平仓':btnsOpen.limitSomeClose.positionList ?'限价平仓': '平仓'
          ]),
        ]),
      ])
    })
  },
  subPosNeedSymTick: function(){
    let oldSubList = window.gMkt.CtxPlaying.subList
    let needSub = []
    for(let key in window.gTrd.Poss){
        let pos = window.gTrd.Poss[key]
        let str = 'tick_'+pos.Sym
        if(pos.Sz != 0 && !oldSubList.includes(str)){
            needSub.push(str)
        }
    }
    if(needSub.length > 0){
      window.gMkt.ReqSub(needSub)
    }
  },
  setLeverage: function(pos){
    if(!window.isMobile && !window.$config.positionBtns.desktop.leverage.open) return
    if(window.isMobile && !window.$config.positionBtns.mobile.leverage.open) return
    let Sym = pos.Sym
    let PId = pos.PId
    window.$openLeverageMode({
        Sym: Sym,
        PId: PId, //仓位PId
        Lever: pos.Lever, //杠杆
        MIRMy: pos.MIRMy, //自定义委托保证金率
        needReq: true, //是否需要向服务器发送修改杠杆请求
        cb: function(arg){
            console.log('change Lever callback', arg)
        }
    })
  },
  placeOrder(status, pos){
    let that = this;
    let p = null;
    pos.loading = true
    switch(status){
        case 'add':
          p = {
            AId: pos.AId,
            Sym: pos.Sym,
            COrdId: new Date().getTime()+'',
            Dir: pos.Sz>0? 1: -1,
            OType: 2,
            Prz: 1,
            Qty: Math.abs(pos.Sz),
            QtyDsp: 0,
            Tif: 1,
            OrdFlag: 0,
            PrzChg: 10,
            PId: pos.PId,
            isAdd: true
          }
          break;
        case 'back':
          p = {
            AId: pos.AId,
            Sym: pos.Sym,
            COrdId: new Date().getTime()+'',
            Dir: pos.Sz>0? -1: 1,
            OType: 2,
            Prz: 1,
            Qty: Math.abs(pos.Sz) * 2,
            QtyDsp: 0,
            Tif: 1,
            OrdFlag: 0,
            PrzChg: 10,
            PId: pos.PId,
            isBack: true
          }
          break;
        case 'close':
          p = {
            AId: pos.AId,
            Sym: pos.Sym,
            COrdId: new Date().getTime()+'',
            Dir: pos.Sz>0? -1: 1,
            OType: 2,
            Prz: 1,
            Qty: Math.abs(pos.Sz),
            QtyDsp: 0,
            Tif: 1,
            OrdFlag: 2, //只减仓
            PrzChg: 10,
            PId: pos.PId,
            isClose: true
          }
          break;
        case 'marketAdd':
          window.$openMarketAddMode({pos:pos, cb: function(arg){}})
          break;
        case 'someClose':
          window.$openSomeCloseMode({pos:pos, cb: function(arg){}})
          break;
        default:

    }
    if(!p){
        pos.loading = false
        return
    };

    p.isAdd?delete p.isAdd:''
    p.isBack?delete p.isBack:''
    p.isClose?delete p.isClose:''
    
    window.gTrd.ReqTrdOrderNew(p, function(gTrd, arg){
      pos.loading = false
      if(arg.code!=0){
          window.$message({title: utils.getTradeErrorCode(msg.code),content: utils.getTradeErrorCode(msg.code), type: 'danger'})
      }
    })
    
  },
  setStopPL: function(pos){
    if(!window.isMobile && !window.$config.positionBtns.desktop.stopPL.open) return
    if(window.isMobile && !window.$config.positionBtns.mobile.stopPL.open) return
    if(window.$openStopPLMode){
      window.$openStopPLMode(pos)
    }
  },
  getContent: function(){
    if(window.isMobile){
      return obj.getPosListForM()
    }else{
      let colgroup = m('colgroup', {},[
        m('col', {name: "pub-table-1",width: 100}),
        m('col', {name: "pub-table-2",width: 160}),
        m('col', {name: "pub-table-3",width: 70}),
        m('col', {name: "pub-table-4",width: 150}),
        m('col', {name: "pub-table-5",width: 150}),
        m('col', {name: "pub-table-6",width: 160}),
        m('col', {name: "pub-table-7",width: 150}),
        m('col', {name: "pub-table-8",width: 200}),
        m('col', {name: "pub-table-9",width: 150}),
        m('col', {name: "pub-table-10",width: 200}),
        m('col', {name: "pub-table-11",width: 590}),
      ])
      return m('div', { class: " table-container"}, [
        m("table",{class:"table is-hoverable ", width: '2080px', cellpadding: 0, cellspacing: 0},[
          colgroup,
          m("tr",{class:""},[
            obj.getTheadList()
          ])
        ]),
        m('div', {class: "pub-table-body-box", style:"width: 2080px"}, [
          m("table",{class:"table is-hoverable ", width: '2080px', cellpadding: 0, cellspacing: 0},[
            colgroup,
            obj.getPosList()
          ])
        ]),
      ])
    }
  },
  changeMgn: function(pos){
    if(!window.isMobile && !window.$config.positionBtns.desktop.changeMgn.open) return
    if(window.isMobile && !window.$config.positionBtns.mobile.changeMgn.open) return
    if(pos.Lever == 0) return
    if(window.$openChangeMgnMode){
      window.$openChangeMgnMode({pos:pos,cb:function(){}})
    }
  }
}

export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
        obj.initEVBUS()
        obj.initObj()
    },
    view: function(vnode) {
        
        return m("div",{class:"pub-pos"},[
          obj.getContent()
        ])
    },
    onbeforeremove: function(){
      obj.rmEVBUS()
    }
}