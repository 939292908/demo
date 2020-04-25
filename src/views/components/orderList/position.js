var m = require("mithril")

let obj = {
  posList: [],
  theadList: [
    {
      title: '仓位ID',
      class: "position-pid"
    }, {
      title: '合约',
      class: "position-sym"
    }, {
      title: '数量',
      class: "position-sz"
    }, {
      title: '开仓均价',
      class: "position-prz"
    }, {
      title: '强平价格',
      class: "position-przLiq"
    }, {
      title: '风险度',
      class: "position-rate"
    }, {
      title: '保证金',
      class: "position-mm"
    }, {
      title: '未实现盈亏(回报率)',
      class: "position-upnl"
    }, {
      title: '已实现盈亏',
      class: "position-pnl"
    }, {
      title: '止盈/止损',
      class: "position-stoppl"
    }, {
      title: '策略',
      class: "position-buttons"
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
            m("i",{class:"iconfont iconotc-editName iconfont-medium"}),
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
        m("td",{class:""},[
          item.aMM 
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
          
          m("button",{class:"button is-white"},[
            (item.StopP || '--')+'/'+(item.StopL || '--'),
            m("i",{class:"iconfont iconotc-editName iconfont-medium"}),
          ]),
        ]),
        m("td",{class:"pub-pos-buttons"},[
          m("button",{class:"button is-primary "+(item.loading?' is-loading': ''), onclick: function(){
            obj.placeOrder('close', item)
          }},[
            '市价平仓'
          ]),
          m("button",{class:"button is-primary "+(item.loading?' is-loading': ''), onclick: function(){
            obj.placeOrder('add', item)
          }},[
            '加倍开仓'
          ]),
          m("button",{class:"button is-primary "+(item.loading?' is-loading': ''), onclick: function(){
            obj.placeOrder('back', item)
          }},[
            '反向开仓'
          ]),
          m("button",{class:"button is-primary "+(item.loading?' is-loading': ''), onclick: function(){
            obj.placeOrder('marketAdd', item)
          }},[
            '市价加仓'
          ]),
          m("button",{class:"button is-primary "+(item.loading?' is-loading': ''), onclick: function(){
            obj.placeOrder('someClose', item)
          }},[
            '平仓'
          ]),
        ])
      ])
    })
  },
  getPosListForM: function(){
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
              m("i",{class:"iconfont iconotc-editName iconfont-medium"}),
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
          m("a",{class:"is-primary card-footer-item"+(item.loading?' is-loading': ''), onclick: function(){
            obj.placeOrder('close', item)
          }},[
            '市价平仓'
          ]),
          m("a",{class:"is-primary card-footer-item"+(item.loading?' is-loading': ''), onclick: function(){
            obj.placeOrder('add', item)
          }},[
            '加倍开仓'
          ]),
          m("a",{class:"is-primary card-footer-item"+(item.loading?' is-loading': ''), onclick: function(){
            obj.placeOrder('back', item)
          }},[
            '反向开仓'
          ]),
          // m("a",{class:"is-primary card-footer-item"+(item.loading?' is-loading': ''), onclick: function(){
          //   obj.placeOrder('marketAdd', item)
          // }},[
          //   '市价加仓'
          // ]),
          // m("a",{class:"is-primary card-footer-item"+(item.loading?' is-loading': ''), onclick: function(){
          //   obj.placeOrder('someClose', item)
          // }},[
          //   '平仓'
          // ]),
        ]),
      ])
      /**
       * <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              Component
            </p>
            <a href="#" class="card-header-icon" aria-label="more options">
              <span class="icon">
                <i class="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </a>
          </header>
          <div class="card-content">
            <div class="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
              <a href="#">@bulmaio</a>. <a href="#">#css</a> <a href="#">#responsive</a>
              <br>
              <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
            </div>
          </div>
          <footer class="card-footer">
            <a href="#" class="card-footer-item">Save</a>
            <a href="#" class="card-footer-item">Edit</a>
            <a href="#" class="card-footer-item">Delete</a>
          </footer>
        </div>
       */
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
          window.$message({content: utils.getTradeErrorCode(msg.code), type: 'danger'})
      }
    })
    
  },
  setStopPL: function(pos){
    if(window.$openStopPLMode){
      window.$openStopPLMode(pos)
    }
  },
  getContent: function(){
    if(window.isMobile){
      return obj.getPosListForM()
    }else{
      return m('div', { class: " table-container"}, [
        m("table",{class:"table is-hoverable ", cellpadding: 0, cellspacing: 0},[
          m("thead",{class:""},[
            m("tr",{class:""},[
              obj.getTheadList()
            ])
          ]),
          m("tbody",{class:""},[
            obj.getPosList()
          ])
        ])
      ])
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