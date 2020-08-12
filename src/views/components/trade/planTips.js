import utils from "../../../utils/utils"
import * as clacMgnNeed from '../../../futureCalc/calcMgnNeed.js'

var m = require("mithril")

let obj = {
    open: false,
    tipsData:{},
    MgnNeed: 0,
    isShow:false,
    //需要显示的行情数据
    lastTick: {},
    //行情数据接收
    tickObj: {},
    //行情最后更新时间
    lastTmForTick: 0,
    //行情限制数据处理时间间隔
    TICKCLACTNTERVAL: 100,
    //委托类型
    ORD_Type:null,

    initEVBUS: function(){
        let that = this

        //打开弹窗
        if (this.EV_PLANTIPS_UPD_unbinder) {
            this.EV_PLANTIPS_UPD_unbinder()
        }
        this.EV_PLANTIPS_UPD_unbinder = window.gEVBUS.on(gTrd.EV_PLANTIPS_UPD, arg => {
            utils.copyTab(that.tipsData,arg.data.p)
            that.open = true
            that.initObj()
            that.setMgnNeed()
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
            that.setMgnNeed()
        })
        
        //指数行情全局广播
        if(this.EV_INDEX_UPD_unbinder){
            this.EV_INDEX_UPD_unbinder()
        }
        this.EV_INDEX_UPD_unbinder = window.gEVBUS.on(gMkt.EV_INDEX_UPD,arg=> {
            that.onTick(arg)
            that.setMgnNeed()
        })
    },

    initLanguage:function(){
        
    },
    initObj:function(){
        let Sym = window.gMkt.CtxPlaying.Sym
        let assetD = window.gMkt.AssetD[Sym] || {}
        if(assetD && this.tipsData){
            this.tipsData.FromC = assetD.FromC
        }

        if (this.tipsData.StopPrz) {
            this.tipsData.cond = this.tipsData.StopBy == 2 ? gDI18n.$t('10070') : this.tipsData.StopBy == 1 ? gDI18n.$t('10046') : gDI18n.$t('10048')
            // obj.cond = obj.StopBy == 2 ? '指数价' : obj.StopBy == 1 ? '最新价' : '标记价'
            this.tipsData.cond += (this.tipsData.OrdFlag & 8) ? '≥' : '≤'
            this.tipsData.cond += this.tipsData.StopPrz
        } else {
            this.tipsData.cond = '--'
        }

        switch(this.tipsData.OType){
            case 1:
                this.ORD_Type = window.gWebAPI.CTX.UserSetting.trade[0]
                break;
            case 2:
                this.ORD_Type = window.gWebAPI.CTX.UserSetting.trade[1]
                break;
            case 3:
                this.ORD_Type = window.gWebAPI.CTX.UserSetting.trade[2]
                break;
            case 4:
                this.ORD_Type = window.gWebAPI.CTX.UserSetting.trade[3]
                break;
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
    //仓位保证金
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
            Sym: that.tipsData.Sym,
            Prz: obj.tipsData.OType == 3?obj.tipsData.Prz : obj.getLastTick().LastPrz,
            Qty: that.tipsData.Qty,
            QtyF: 0,
            Dir: that.tipsData.Dir,
            PId: that.tipsData.PId,
            Lvr: that.tipsData.lvr,
            MIRMy: that.tipsData.MIRMy
        }
        clacMgnNeed.calcFutureWltAndPosAndMI(pos, wallet, _order, RSdata, assetD, lastTick, window.$config.future.UPNLPrzActive, newOrder, window.$config.future.MMType, res => {
        // console.log('bug 成本计算结果： ', res)
        that.MgnNeed = Number(res || 0)
        })
        m.redraw()
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
        if (this.EV_PLANTIPS_UPD_unbinder) {
            this.EV_PLANTIPS_UPD_unbinder()
        }
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
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

    closeMode: function(){
        this.open = false
    },
    submit:function(){
        switch(this.tipsData.OType){
            case 1:
                window.gWebAPI.CTX.UserSetting.trade[0] = this.ORD_Type
                break;
            case 2:
                window.gWebAPI.CTX.UserSetting.trade[1] = this.ORD_Type
                break;
            case 3:
                window.gWebAPI.CTX.UserSetting.trade[2] = this.ORD_Type
                break;
            case 4:
                window.gWebAPI.CTX.UserSetting.trade[3] = this.ORD_Type
                break;
        }

        //提交设置
        window.gWebAPI.ReqSaveUserSetting()

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
                    obj.tipsData.OType == 3?(obj.tipsData.Prz + " " + obj.tipsData.FromC):(gDI18n.$t('10081'/*"市价"*/) + "(" + (obj.getLastTick().LastPrz || '--') + obj.tipsData.FromC + ")")
                    
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
                    gDI18n.$t('10064')//"触发条件"
                ]),
                m('div',{class:"ord-tips-num-right"},[
                    obj.tipsData.cond + obj.tipsData.FromC
                ]),
            ]),
            m('div',{class:"ord-tips-num is-flex"},[
                m('div',{class:"ord-tips-num-left"},[
                    gDI18n.$t('10167')//"委托保证金"
                ]),
                m('div',{class:"ord-tips-num-right"},[
                    Number(obj.MgnNeed).toPrecision2(6, 8) + " " + obj.tipsData.FromC
                ]),
            ]),
        ])
    },

    changeCheck:function(){
        this.ORD_Type = !this.ORD_Type
    }
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
                m('div',{class:"has-text-danger"},[
                    "当委托被触发时，如果无可用资金，该委托可能不被执行。"
                ]),
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
    },
  }