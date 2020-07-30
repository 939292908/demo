import utils from "../../../utils/utils"

var m = require("mithril")

let obj = {
    open: false,
    tipsData:{},
    MgnNeedForBuy:0,
    MgnNeedForSell:0,
    isShow:false,
    //需要显示的行情数据
    lastTick: {},
    //行情数据接收
    tickObj: {},
    //行情最后更新时间
    lastTmForTick: 0,
    //行情限制数据处理时间间隔
    TICKCLACTNTERVAL: 100,

    initEVBUS: function(){
        let that = this

        //打开弹窗
        if (this.EV_ORDTIPS_UPD_unbinder) {
            this.EV_ORDTIPS_UPD_unbinder()
        }
        this.EV_ORDTIPS_UPD_unbinder = window.gEVBUS.on(gTrd.EV_ORDTIPS_UPD, arg => {
            utils.copyTab(that.tipsData,arg.data.p)
            that.MgnNeedForBuy = arg.data.MgnNeedForBuy
            that.MgnNeedForSell = arg.data.MgnNeedForSell
            console.log(arg)
            that.open = true
            that.initObj()
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
    },

    initLanguage:function(){
        
    },
    initObj:function(){
        let Sym = window.gMkt.CtxPlaying.Sym
        let assetD = window.gMkt.AssetD[Sym] || {}
        if(assetD && this.tipsData){
            this.tipsData.FromC = assetD.FromC

            switch(this.tipsData.Dir){
                case 1:
                    this.tipsData.MgnNeed = this.MgnNeedForBuy
                    break;
                case -1:
                    this.tipsData.MgnNeed = this.MgnNeedForSell
                    break;
            }
        }

    },
    onTick: function(param){
        let tm = Date.now()
        this.tickObj[param.Sym] = param.data
        if(tm - this.lastTmForTick > this.TICKCLACTNTERVAL){
            this.updateTick(this.tickObj)
            this.tickObj = {}
        }
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
    //获取当前合约最新行情
    getLastTick: function(){
        let Sym = window.gMkt.CtxPlaying.Sym
        return this.lastTick[Sym] || {}
    },
    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_ORDTIPS_UPD_unbinder) {
            this.EV_ORDTIPS_UPD_unbinder()
        }
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
    },

    closeMode: function(){
        this.open = false
    },
    submit:function(){
        window.gTrd.ReqTrdOrderNew(this.tipsData, function (aTrd, arg) {
            console.log(this.tipsData,'pppppParames');
            if (arg.code != 0 || arg.data.ErrCode) {
                window.$message({ title: gDI18n.$t('10037'/*"提示"*/), content: utils.getTradeErrorCode(arg.code || arg.data.ErrCode), type: 'danger' })
            }
        })

        this.open = false
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

    //委托视图
    getOrdView:function(){
        return m('div',{class:""},[
            m('div',{class:"ord-tips-num is-flex"},[
                m('div',{class:"ord-tips-num-left"},[
                    gDI18n.$t('10058')//"委托价格"
                ]),
                m('div',{class:"ord-tips-num-right"},[
                    obj.tipsData.OType == 1?(obj.tipsData.Prz + " " + obj.tipsData.FromC):(gDI18n.$t('10081'/*"市价"*/) + "(" + (obj.getLastTick().LastPrz || '--') + ")")
                    
                ]),
            ]),
            m('div',{class:"ord-tips-num is-flex"},[
                m('div',{class:"ord-tips-num-left"},[
                    gDI18n.$t('10059')//"委托数量"
                ]),
                m('div',{class:"ord-tips-num-right"},[
                    obj.tipsData.Qty + " " + "张"
                ]),
            ]),
            m('div',{class:"ord-tips-num is-flex"},[
                m('div',{class:"ord-tips-num-left"},[
                    gDI18n.$t('10167')//"委托保证金"
                ]),
                m('div',{class:"ord-tips-num-right"},[
                    Number(obj.tipsData.MgnNeed).toPrecision2(6, 8) + " " + obj.tipsData.FromC
                ]),
            ]),
        ])
    },
    //止盈止损视图
    getStopPLView:function(){
        // 根据配置判断下单止盈止损是否显示
        let tradeType = window.$config.future.tradeType
        // let show = false
        switch(tradeType){
            case 0:
            case 1:
            case 2:
                this.isShow = false;
                break;
            case 3:
                this.isShow = true
                break;
            default:
                this.isShow = false
        }
        if(this.isShow){
            return m('div',{class:""},[
                m('div',{class:"ord-tips-num is-flex"},[
                    m('div',{class:"ord-tips-num-left"},[
                        gDI18n.$t('10485')//"止盈触发价"
                    ]),
                    m('div',{class:"ord-tips-num-right"},[
                        (obj.tipsData.StopP || "--") + obj.tipsData.FromC
                    ]),
                ]),
                m('div',{class:"ord-tips-num is-flex"},[
                    m('div',{class:"ord-tips-num-left"},[
                        gDI18n.$t('10486')//"止损触发价"
                    ]),
                    m('div',{class:"ord-tips-num-right"},[
                        (obj.tipsData.StopL || "--") + obj.tipsData.FromC
                    ]),
                ]),
            ])
        }
        
    },
}

export default {
    oninit: function (vnode) {
  
    },
    oncreate: function (vnode) {
        obj.initEVBUS()
        obj.initObj()
        obj.initLanguage()
    },
    view: function (vnode) {
  
      return m('div', {class: 'pub-stoppl'}, [
        m("div", { class: "modal" + (obj.open ? " is-active" : ''), }, [
          m("div", { class: "modal-background", onclick: () => { obj.open = false}}),
          m("div", { class: "modal-card modal-card-width" }, [
            m("header", { class: "pub-stoppl-head modal-card-head modal-card-font-title" }, [
              m("p", { class: "modal-card-title" }, [
                '委托确认'
              ]),
              m("button", {
                class: "delete", "aria-label": "close", onclick: function () {
                  obj.closeMode()
                }
              }),
              
            ]),
            m("section", { class: "pub-stoppl-content modal-card-body has-text-2 modal-card-font-subtitle" }, [
                m('div',{class:"ticks-stop "},[
                    m('span',{class:" " + utils.getColorStr(obj.tipsData.Dir, 'font')},[
                        obj.getOType(obj.tipsData.OType) +utils.getDirByStr(obj.tipsData.Dir)
                    ]),
                    "  ",
                    utils.getSymDisplayName(window.gMkt.AssetD, obj.tipsData.Sym),
                ]),
                obj.getOrdView(),
                m('div',{class:"has-text-primary ticks-stop" + (obj.isShow?" ":" is-hidden")},[
                    "止盈止损设置"
                ]),
                obj.getStopPLView(),
                m('div',{class:""},[
                    m('input',{type:"checkbox"}),
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
    },
  }