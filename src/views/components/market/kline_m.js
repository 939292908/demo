let m = require("mithril")

import kline from "./kline"
import wlt from "../contractRrecord/wlt"
import transfer from "../contractRrecord/transfer"


let spotTick = {
    //行情限制数据处理时间间隔
    TICKCLACTNTERVAL: 100,
    //已订阅的行情列表
    oldSubArr: [],
    //合约名称列表
    futureSymList: [],
    // 现货名称列表
    spotSymList: [],
    //行情最后更新时间
    lastTmForTick: 0,
    //行情数据接收
    tickObj: {},
    //需要显示的行情数据
    lastTick: {},
    FundingNextTmStr: '',
    FundingLongRStr: '',
    //初始化全局广播
    tabsActive: 0,
    initEVBUS: function(){
        let that = this
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
        if(this.EV_CHANGESYM_UPD_unbinder){
            this.EV_CHANGESYM_UPD_unbinder()
        }
        this.EV_CHANGESYM_UPD_unbinder = window.gEVBUS.on(gMkt.EV_CHANGESYM_UPD,arg=> {
            that.unSubTick()
            that.subTick()
        })
    },
    rmEVBUS: function(){
        if(this.EV_ASSETD_UPD_unbinder){
            this.EV_ASSETD_UPD_unbinder()
        }
        if(this.EV_PAGETRADESTATUS_UPD_unbinder){
            this.EV_PAGETRADESTATUS_UPD_unbinder()
        }
        if(this.EV_TICK_UPD_unbinder){
            this.EV_TICK_UPD_unbinder()
        }
        if(this.EV_INDEX_UPD_unbinder){
            this.EV_INDEX_UPD_unbinder()
        }
        if(this.EV_CHANGESYM_UPD_unbinder){
            this.EV_CHANGESYM_UPD_unbinder()
        }
    },
    //订阅所需行情,pc界面行情订阅除了k线以外，其他所需订阅内容都在这里，各个组件内只是接收数据并渲染
    subTick: function(){
        let Sym = window.gMkt.CtxPlaying.Sym
        if(Sym){
            let subArr = utils.setSubArrType('tick',[Sym])
            subArr = subArr.concat(utils.setSubArrType('trade',[Sym]))
            subArr = subArr.concat(utils.setSubArrType('order20',[Sym]))
            subArr = subArr.concat(utils.setSubArrType('index',[utils.getGmexCi(window.gMkt.AssetD, Sym)]))
            window.gMkt.ReqSub(subArr)
            this.oldSubArr = subArr
        }
        m.redraw();
    },
    unSubTick(){
        let oldSubArr = this.oldSubArr
        window.gMkt.ReqUnSub(oldSubArr)
    },
    //
    onTick: function(param){
        let tm = Date.now()
        this.tickObj[param.Sym] = param.data
        if(tm - this.lastTmForTick > this.TICKCLACTNTERVAL){
            this.updateTick(this.tickObj)
            this.lastTmForTick = tm
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
        this.setFundingNext()
        m.redraw();
    },
    setFundingNext: function(){
        let Sym = window.gMkt.CtxPlaying.Sym
        let ass = window.gMkt.AssetD[Sym]
        let FundingNext = ass && ass.FundingNext || 0
        let FundingLongR = (this.getLastTick().FundingLongR || 0).toString().split('%')[0]
        this.FundingNextTmStr = gDI18n.$t('10414',{value : (FundingNext?new Date(FundingNext).format('yyyy-MM-dd hh:mm:ss'):'--')})
        // this.FundingNextTmStr = `下次资金费率交换时间：${FundingNext?new Date(FundingNext).format('yyyy-MM-dd hh:mm:ss'):'--'}`
        this.FundingLongRStr = `${Number(FundingLongR)>0?gDI18n.$t('10014'/*'多头需要向空头补偿持仓价值的'*/):gDI18n.$t('10015'/*'空头需要向多头补偿持仓价值的'*/)}${Math.abs(Number(FundingLongR))}%`
        
    },

    //合约列表渲染
    getSymList: function(){
        let that = this
        let SymList = []
        switch(window.gMkt.CtxPlaying.pageTradeStatus){
            case 1: 
                SymList = this.futureSymList
                break;
            case 2: 
                SymList = this.spotSymList
                break;
                
        }
        return SymList.map((Sym, i)=>{
            return m('dev', {key: 'dropdown-item'+Sym+i, class: ""}, [
                m('a', { href: "javascript:void(0);", class: "dropdown-item", onclick: function(){
                    that.setSym(Sym)
                }},[
                    utils.getSymDisplayName(window.gMkt.AssetD, Sym)
                ])
            ])
            
        })
    },

    //获取当前合约最新行情
    getLastTick: function(){
        let Sym = window.gMkt.CtxPlaying.Sym
        // console.log(this.lastTick[Sym],"最新行情")
        return this.lastTick[Sym] || {}
        
    },
    //k线
    getKlineM:function (){
        return m(kline)
    },

    getTopTick: function(){
        let type = window.$config.views.headerTick.left.type
        switch(type){
            case 0: 
                return m("header",{class : "kline-top"},[
                    //左边
                    m("div",{class : "width-div-left"},[
                        m("div",{class : "spotTick"},[
                            m("p",{class : "spotTick-left" + utils.getColorStr(spotTick.getLastTick().color, 'font')},[
                                spotTick.getLastTick().LastPrz || '--'
                            ]),
                            "",
                            m("p",{class : "spotTick-right" + utils.getColorStr(spotTick.getLastTick().rfpreColor,"font")},[
                                spotTick.getLastTick().rfpre || '--'
                            ]),
                        ]),
                        m("table",{class : ""},[
                            m("tr",{class : ""},[
                                m("td",{class : "currency-font has-text-grey table-margin2"},[
                                    gDI18n.$t('10436')//"标记价格："
                                ]),
                                m("td",{class : "currency-font has-text-grey width-curren table-margin2"},[
                                    spotTick.getLastTick().SettPrz || '--'
                                ]),
                            ]),
                            m("tr",{class : ""},[
                                m("td",{class : "currency-font has-text-grey table-margin2"},[
                                    gDI18n.$t('10437')//"指数价格："
                                ]),
                                m("td",{class : "currency-font has-text-grey width-curren table-margin2"},[
                                    spotTick.getLastTick().indexPrz || '--'
                                ]),
                            ]) 
                        ]),
                    ]),
                    //右边
                    m("div",{class : "width-div-right"},[
                        m("table",{class : "currency-font table-width"},[
                            m("tr",{class :"table-margin"},[
                                m("td",{class :"has-text-grey table-margin"},[
                                    gDI18n.$t('10438')//"24H最高："
                                ]),
                                m("td",{class :"font-textalent-right has-text-black  table-margin"},[
                                    spotTick.getLastTick().High24 || '--'
                                ]),
                            ]),
                            m("tr",{class :"table-margin"},[
                                m("td",{class :"has-text-grey table-margin"},[
                                    gDI18n.$t('10439')//"24H最低："
                                ]),
                                m("td",{class :"font-textalent-right has-text-black table-margin"},[
                                    spotTick.getLastTick().Low24 || '--'
                                ]),
                            ]),
                            m("tr",{class :"table-margin"},[
                                m("td",{class :"has-text-grey table-margin"},[
                                    gDI18n.$t('10440')//"持仓量："
                                ]),
                                m("td",{class :"font-textalent-right has-text-black  table-margin"},[
                                    spotTick.getLastTick().Turnover24 || '--'
                                ]),
                            ]),
                        ])
                    ]),
                ])
            case 1:
                return this.customLeftTick()
            default:
                return  null
        }
    },
    setTabsActive: function(param){
        this.tabsActive = param
      },
    getContent: function(){
        switch(this.tabsActive){
            case 0:
                return m(transfer)
            case 1:
                return m(wlt)
        }
    },
    //最新成交
    LatestDeal:function (){
        return 
    },

    //合约简介
    ContractIntroduction:function (){},

    customLeftTick: function(){

    }, 
    getRightTick: function(){
        let type = window.$config.views.headerTick.right.type
        switch(type){
            case 0: 
                return m("div",{class:"pub-header-tick-right"},[

                ])
            case 1:
                return this.customRightTick()
            default:
                return  null
        }
    },
    customRightTick: function(){

    },

}
export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
        spotTick.initEVBUS()
        spotTick.subTick()
    },
    view:function(vnode){
        return m("div",[
            spotTick.getTopTick(),
            spotTick.getKlineM(),
            m("div",{class:"pub-dish-and-new-trade box h100"},[
                m("div",{class:"pub-dish-and-new-trade-tabs tabs"},[
                    m("ul",[
                      m("li",{class:""+(spotTick.tabsActive == 0?' is-active':'')},[
                        m("a",{class:"", onclick: function(){
                            spotTick.setTabsActive(0)
                        }},[
                            gDI18n.$t('10012')//'最新成交'
                        ])
                      ]),
                      m("li",{class:""+(spotTick.tabsActive == 1?' is-active':'')},[
                        m("a",{class:"", onclick: function(){
                            spotTick.setTabsActive(1)
                        }},[
                            gDI18n.$t('10441')//'合约简介'
                        ])
                      ])
                    ]),
                ]),
                spotTick.getContent()
            ]),
        ])
    },
    onremove: function(vnode) {
        spotTick.rmEVBUS()
    },
}