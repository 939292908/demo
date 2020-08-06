import utils from "../../../utils/utils"
import * as clacMgnNeed from '../../../futureCalc/calcMgnNeed.js'

var m = require("mithril")

let obj = {
    open: false,
    orderName:"市价平仓",
    orderData:{},
    //需要显示的行情数据
    lastTick: {},
    //行情数据接收
    tickObj: {},
    //行情最后更新时间
    lastTmForTick: 0,
    //行情限制数据处理时间间隔
    TICKCLACTNTERVAL: 100,
    //仓位保证金
    MgnNeed:0,
    //当前合约币种
    FromC : "BTC",
    //弹窗针对按钮类型
    status:"close",
    //按钮选中状态
    ORD_Type:null,
    //成交后数量
    AfterNum : 0,

    initEVBUS: function(){
        let that = this

        //打开弹窗
        if (this.EV_OPENORDERCOMMON_UPD_unbinder) {
            this.EV_OPENORDERCOMMON_UPD_unbinder()
        }
        this.EV_OPENORDERCOMMON_UPD_unbinder = window.gEVBUS.on(gTrd.EV_OPENORDERCOMMON_UPD, arg => {
            
            utils.copyTab(that.orderData,arg.data.p)
            obj.status = arg.data.status
            obj.setOrderName(arg.data.status)
            that.initObj()
            this.open = true
        })
        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD, arg => {
            that.initLanguage()
        })

        //tick行情全局广播
        if(this.EV_TICK_UPD_unbinder){
            this.EV_TICK_UPD_unbinder()
        }
        this.EV_TICK_UPD_unbinder = window.gEVBUS.on(gMkt.EV_TICK_UPD,arg=> {
            that.onTick(arg)
        })
        
        //指数行情全局广播
        if(this.EV_INDEX_UPD_unbinder){
            this.EV_INDEX_UPD_unbinder()
        }
        this.EV_INDEX_UPD_unbinder = window.gEVBUS.on(gMkt.EV_INDEX_UPD,arg=> {
            that.onTick(arg)
        })

        //当前选中合约变化全局广播
        if (this.EV_CHANGESYM_UPD_unbinder) {
            this.EV_CHANGESYM_UPD_unbinder()
        }
        this.EV_CHANGESYM_UPD_unbinder = window.gEVBUS.on(gMkt.EV_CHANGESYM_UPD, arg => {
            that.setMgnNeed()
        })
    },

    initLanguage:function(){
        
    },
    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_OPENORDERCOMMON_UPD_unbinder) {
            this.EV_OPENORDERCOMMON_UPD_unbinder()
        }
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
        //当前选中合约变化全局广播
        if (this.EV_CHANGESYM_UPD_unbinder) {
            this.EV_CHANGESYM_UPD_unbinder()
        }
        //tick行情全局广播
        if(this.EV_TICK_UPD_unbinder){
            this.EV_TICK_UPD_unbinder()
        }
        //指数行情全局广播
        if(this.EV_INDEX_UPD_unbinder){
            this.EV_INDEX_UPD_unbinder()
        }
    },
    initObj:function(){
        this.setMgnNeed()
        let Sym = window.gMkt.CtxPlaying.Sym
        let assetD = window.gMkt.AssetD[Sym] || {}
        if(assetD && this.orderData){
            this.FromC = assetD.FromC
        }

        switch(this.status){
            case "close":
                this.ORD_Type = window.gWebAPI.CTX.UserSetting.trade[4]
                break;
            case "add":
                this.ORD_Type = window.gWebAPI.CTX.UserSetting._trade[1]
                break;
            case "back":
                this.ORD_Type = window.gWebAPI.CTX.UserSetting._trade[0]
                break;
        }
    },
    //获取当前合约最新行情
    getLastTick: function(){
        let Sym = window.gMkt.CtxPlaying.Sym
        return this.lastTick[Sym] || {}
    },
    //更新最新行情
    updateTick: function(ticks){
        for(let key in ticks){
            let item = ticks[key];
            let gmexCI = utils.getGmexCi(window.gMkt.AssetD, item.Sym)
            let indexTick = this.lastTick[gmexCI]
            
            let obj = utils.getTickObj(window.gMkt.AssetD, window.gMkt.AssetEx, item, this.lastTick[key], indexTick)
            obj?this.lastTick[key] = obj:''
        }
        m.redraw();
    },
    onTick: function(param){
        let tm = Date.now()
        this.tickObj[param.Sym] = param.data
        if(tm - this.lastTmForTick > this.TICKCLACTNTERVAL){
            this.updateTick(this.tickObj)
            this.tickObj = {}
        }
    },
    changeCheck:function(){
        this.ORD_Type = !this.ORD_Type
    },
    //关闭弹窗
    closeMode: function(){
        this.open = false
    },
    //提交信息
    submit:function(){
        switch(this.status){
            case "close":
                window.gWebAPI.CTX.UserSetting.trade[4] =this.ORD_Type
                break;
            case "add":
                window.gWebAPI.CTX.UserSetting._trade[1] = this.ORD_Type
                break;
            case "back":
                window.gWebAPI.CTX.UserSetting._trade[0] =this.ORD_Type
                break;
        }

    window.gTrd.ReqTrdOrderNew(obj.orderData, function(gTrd, arg){
      if (arg.code != 0 || arg.data.ErrCode) {
        window.$message({ title: gDI18n.$t('10037'/*"提示"*/),content: utils.getTradeErrorCode(msg.code || arg.data.ErrCode), type: 'danger'})
      }
    })


        this.open = false
    },
    setOrderName:function(status){
        switch(status){
            case "close":
                this.orderName = "市价平仓"
                this.AfterNum = 0
                break;
            case "add":
                this.orderName = "加倍开仓"
                this.AfterNum = this.orderData.Qty*2
                break;
            case "back":
                this.orderName = "反向开仓"
                this.AfterNum = -(this.orderData.Qty/2)
                break;
        }
    },
    getOType:function(type){
        switch(type){
            case 1:
                return gDI18n.$t('10185');//"限价";
            case 2:
                return gDI18n.$t('10081');//"市价";
            case 3:
                return gDI18n.$t('10119');//'限价计划';
            case 4:
                return gDI18n.$t('10120');//'市价计划';
        }
    },
    //保证金
    setMgnNeed(){
        let that = this
        let posObj = window.gTrd.Poss
        let pos = []
        for (let key in posObj) {
            pos.push(posObj[key])
        }
        let wallet = window.gTrd.Wlts['01']
        // 筛选出当前委托，不要计划委托
        let order = window.gTrd.Orders['01']
        let _order = order.filter(function (item) {
            return item.OType == 1 || item.OType == 2
        })
        let RSdata = window.gTrd.RS
        let assetD = window.gMkt.AssetD
        let lastTick = window.gMkt.lastTick

        let newOrder = {
            Sym: that.orderData.Sym,
            Prz: obj.getLastTick().LastPrz,
            Qty: that.orderData.Qty,
            QtyF: 0,
            Dir: that.orderData.Dir,
            PId: that.orderData.PId,
            Lvr: that.orderData.lvr,
            MIRMy: that.orderData.MIRMy
        }
        clacMgnNeed.calcFutureWltAndPosAndMI(pos, wallet, _order, RSdata, assetD, lastTick, window.$config.future.UPNLPrzActive, newOrder, window.$config.future.MMType, res => {
        // console.log('bug 成本计算结果： ', res)
        that.MgnNeed = Number(res || 0)
        })

        m.redraw()
    },
    //委托视图
    getOrdView:function(){
        return m('div',{class:""},[
            m('div',{class:"ord-tips-num is-flex"},[
                m('div',{class:"ord-tips-num-left"},[
                    gDI18n.$t('10058')//"委托价格"
                ]),
                m('div',{class:"ord-tips-num-right"},[
                    (gDI18n.$t('10081'/*"市价"*/) + "(" + (obj.getLastTick().LastPrz || '--') + obj.FromC + ")")
                    
                ]),
            ]),
            m('div',{class:"ord-tips-num is-flex"},[
                m('div',{class:"ord-tips-num-left"},[
                    gDI18n.$t('10059')//"委托数量"
                ]),
                m('div',{class:"ord-tips-num-right"},[
                    obj.orderData.Qty + " " + "张"
                ]),
            ]),
            m('div',{class:"ord-tips-num is-flex" + (obj.status == "close"?" is-hidden":"")},[
                m('div',{class:"ord-tips-num-left"},[
                    gDI18n.$t('10167')//"委托保证金"
                ]),
                m('div',{class:"ord-tips-num-right"},[
                    obj.MgnNeed.toFixed2(2,8) + obj.FromC
                ]),
            ]),
            m('div',{class:"ord-tips-num is-flex"},[
                m('div',{class:"ord-tips-num-left"},[
                    "成交后仓位"
                ]),
                m('div',{class:"ord-tips-num-right"},[
                    this.AfterNum + " " + "张"
                ]),
            ]),
        ])
    },
}

export default {
    oninit: function (vnode) {
  
    },
    oncreate: function (vnode) {
        obj.initEVBUS()
        // obj.initObj()
        obj.initLanguage()
    },
    view: function (vnode) {
  
      return m('div', {class: 'pub-stoppl'}, [
        m("div", { class: "modal" + (obj.open ? " is-active" : ''), }, [
          m("div", { class: "modal-background", onclick: () => { obj.open = false}}),
          m("div", { class: "modal-card modal-card-width" }, [
            m("header", { class: "pub-stoppl-head modal-card-head modal-card-font-title" }, [
              m("p", { class: "modal-card-title" }, [
                obj.orderName
              ]),
              m("button", {
                class: "delete", "aria-label": "close", onclick: function () {
                  obj.closeMode()
                }
              }),
              
            ]),
            m("section", { class: "pub-stoppl-content modal-card-body has-text-2 modal-card-font-subtitle" }, [
                m('div',{class:"ticks-stop "},[
                    m('span',{class:" " + utils.getColorStr(obj.orderData.Dir, 'font')},[
                        obj.getOType(obj.orderData.OType) +utils.getDirByStr(obj.orderData.Dir)
                    ]),
                    "  ",
                    utils.getSymDisplayName(window.gMkt.AssetD, obj.orderData.Sym),
                ]),
                obj.getOrdView(),
                m('div',{class:""},[
                    m('input',{type:"checkbox",checked:obj.ORD_Type,onclick:function(){
                        obj.changeCheck()
                    }}),
                    m('span',{class:""},[
                        "每次提醒"
                    ])
                ])
            ]),
            m("footer", { class: "pub-stoppl-foot modal-card-foot" }, [
              m("button", {
                class: "button is-primary has-text-white", onclick: function () {
                  obj.closeMode()
                }
              }, [
                gDI18n.$t('10052')//'取消'
              ]),
              m("button", {
                class: "button is-primary has-text-white", onclick: function () {
                  obj.submit()
                }
              }, [
                gDI18n.$t('10051')//'确定'
              ]),
            ]),
          ])
        ])
      ])
  
    },
    onremove: function (vnode) {
        obj.rmEVBUS()
        obj.orderData = {}
    },
  }