var m = require("mithril")
let obj = {
  //行情限制数据处理时间间隔
  TRADECLACTNTERVAL: 100,
  //成交最后更新时间
  lastTmForTrade: 0,
  updateTradeTimer: null,
  //行情数据接收
  TradeObj: [],

  //最新成交数据 界面显示
  tradeList:[],
  maxTradeListNum: 20,
  //初始化全局广播
  initEVBUS: function(){
    let that = this
    
    //trade行情全局广播
    if(this.EV_NEWTRADE_UPD_unbinder){
        this.EV_NEWTRADE_UPD_unbinder()
    }
    this.EV_NEWTRADE_UPD_unbinder = window.gEVBUS.on(gMkt.EV_NEWTRADE_UPD,arg=> {
        that.onTrade(arg)
    })

    //当前选中合约变化全局广播
    if(this.EV_CHANGESYM_UPD_unbinder){
      this.EV_CHANGESYM_UPD_unbinder()
    }
    this.EV_CHANGESYM_UPD_unbinder = window.gEVBUS.on(gMkt.EV_CHANGESYM_UPD,arg=> {
        that.onChangeSym(arg)
    })
  },
  //删除全局广播
  rmEVBUS: function(){
    if(this.EV_NEWTRADE_UPD_unbinder){
        this.EV_NEWTRADE_UPD_unbinder()
    }
    if(this.EV_CHANGESYM_UPD_unbinder){
      this.EV_CHANGESYM_UPD_unbinder()
    }
  },

  onTrade: function(param){
    let that = this
    this.TradeObj.push(param.data)
    let tm = Date.now()
    console.log(this.TradeObj)
    if(!this.updateTradeTimer){
      this.updateTradeTimer = setTimeout(()=>{
        console.log('updateTrade timer==>>>', this.TradeObj, this.updateTradeTimer)
        that.updateTrade(that.TradeObj)
        that.TradeObj = []
        that.lastTmForTrade = tm
        this.updateTradeTimer = null
      }, this.TRADECLACTNTERVAL+50)
    }
    
    if(tm - this.lastTmForTrade > this.TRADECLACTNTERVAL){
      console.log('updateTrade==>>>', this.TradeObj, this.updateTradeTimer)
      this.updateTrade(this.TradeObj)
      this.TradeObj = []
      this.lastTmForTrade = tm
      if(this.updateTradeTimer){
        clearTimeout(this.updateTradeTimer)
        this.updateTradeTimer = null
      }
    }
  },
  initTrade(){
    let that = this
    let Sym = window.gMkt.CtxPlaying.Sym
    let trades = window.gMkt.trades[Sym] || []
    for(let item of trades){
      let ass = window.gMkt.AssetD[item.Sym]
      let PrzMinIncSize = ass?utils.getFloatSize(utils.getFullNum(ass.PrzMinInc)):6;
      let VolMinValSize = ass?utils.getFloatSize(ass.Mult):6;

      let trdObj = {
        Sym: item.Sym,
        At: item.At,
        AtStr: new Date(item.At).format('hh:mm:ss'),
        Prz: Number(item.Prz).toFixed(PrzMinIncSize),
        Dir: item.Dir,
        Sz: Number(item.Sz).toFixed(VolMinValSize),
        Val: item.Val,
        MatchID: item.MatchID,
      }
      if(item.Sym == window.gMkt.CtxPlaying.Sym){
        that.tradeList.push(trdObj)
        if(that.tradeList.length >= that.maxTradeListNum){
          that.tradeList = that.tradeList.slice(0, that.maxTradeListNum)
        }
      }
    }

    if (that.tradeList.length < that.maxTradeListNum) {
      let n = that.maxTradeListNum - that.tradeList.length
      for (let i = 0; i < n; i++) {
        that.tradeList.push({
            Sym: '--',
            At: '--',
            AtStr: '--',
            Prz: '--',
            Dir: '--',
            Sz: '--',
            Val: '--',
            MatchID: '--',
          })
      }
    }
  },
  updateTrade(newTrade){
    let that = this
    if(newTrade){
      newTrade.map(function(item, i){

        let ass = window.gMkt.AssetD[item.Sym]
        let PrzMinIncSize = ass?utils.getFloatSize(utils.getFullNum(ass.PrzMinInc)):6;
        let VolMinValSize = ass?utils.getFloatSize(ass.Mult):6;
  
        let trdObj = {
          Sym: item.Sym,
          At: item.At,
          AtStr: new Date(item.At).format('hh:mm:ss'),
          Prz: Number(item.Prz).toFixed(PrzMinIncSize),
          Dir: item.Dir,
          Sz: Number(item.Sz).toFixed(VolMinValSize),
          Val: item.Val,
          MatchID: item.MatchID,
        }
        if(item.Sym == window.gMkt.CtxPlaying.Sym){
          that.tradeList.unshift(trdObj)
          if(that.tradeList.length >= that.maxTradeListNum){
            that.tradeList = that.tradeList.slice(0, that.maxTradeListNum)
          }
        }
      })
    }
    
    if (that.tradeList.length < that.maxTradeListNum) {
      let n = that.maxTradeListNum - that.tradeList.length
      for (let i = 0; i < n; i++) {
        that.tradeList.push({
            Sym: '--',
            At: '--',
            AtStr: '--',
            Prz: '--',
            Dir: '--',
            Sz: '--',
            Val: '--',
            MatchID: '--',
          })
      }
    }
    // tradeList
  },
  getTradeList: function(){
    let tradeList = this.tradeList
    if(!tradeList) return ''
    return tradeList.map(function(item,i){
        return m("div",{class:"pub-new-trade-list-item level is-relative"},[
            m('div', {class: "level-item w30"},[
                m('p', {class: "w100 has-text-left "+utils.getColorStr(item.Dir, 'font')},[
                    item.Prz
                ]),
            ]),
            m('div', {class: "level-item w30"},[
                m('p', {class: "w100 has-text-left"},[
                  item.Sz
                ]),
            ]),
            m('div', {class: "level-item w30"},[
                m('p', {class: "w100 has-text-right"},[
                  item.AtStr
                ]),
            ]),
        ])
    })
  },
  onChangeSym: function(param){
    this.tradeList = []
    this.initTrade()
  }
}
export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
      obj.initEVBUS()
      obj.initTrade()
    },
    view: function(vnode) {
        
        return m("div",{class:"pub-new-trade"},[
          m("div",{class:"pub-new-trade-list"},[
          // JSON.stringify(obj.tradeList)+''
            obj.getTradeList()
          ])
        ])
    },
    onbeforeremove: function(vnode) {
      obj.rmEVBUS()
    },
}