var m = require("mithril")
import Tooltip from "../common/Tooltip"


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
    FundingTimeDifference: '',
    FundingLongRStr: '',
    //设置窗口
    isSetting:false,

    //为实现盈亏计算设置
    // ForcedPrice:window.$config.future.ForcedPrice,
    //初始化全局广播
    initEVBUS: function(){
        let that = this
        //tick行情全局广播
        if(this.EV_TICK_UPD_unbinder){
            this.EV_TICK_UPD_unbinder()
        }
        this.EV_TICK_UPD_unbinder = window.gEVBUS.on(gMkt.EV_TICK_UPD,arg=> {
            that.onTick(arg)
            spotTick.setWebPageTitle()
        })
        
        //指数行情全局广播
        if(this.EV_INDEX_UPD_unbinder){
            this.EV_INDEX_UPD_unbinder()
        }
        this.EV_INDEX_UPD_unbinder = window.gEVBUS.on(gMkt.EV_INDEX_UPD,arg=> {
            that.onTick(arg)
            spotTick.setWebPageTitle()
        })

        //当前选中合约变化全局广播
        if(this.EV_CHANGESYM_UPD_unbinder){
            this.EV_CHANGESYM_UPD_unbinder()
        }
        this.EV_CHANGESYM_UPD_unbinder = window.gEVBUS.on(gMkt.EV_CHANGESYM_UPD,arg=> {
            that.unSubTick()
            that.subTick()
        })
        //body点击事件广播
        if(this.EV_ClICKBODY_unbinder){
            this.EV_ClICKBODY_unbinder()
        }
        this.EV_ClICKBODY_unbinder = window.gEVBUS.on(gEVBUS.EV_ClICKBODY,arg=> {
            that.isSetting = false
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
        //body点击事件广播
        if(this.EV_ClICKBODY_unbinder){
            this.EV_ClICKBODY_unbinder()
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
        // let str = `下次资金费率交换时间：${new Date(FundingNext).format('yyyy-MM-dd hh:mm:ss')}<br/>${Number(this.FundingLongR.split('%')[0])>0?this.$t('11634'):this.$t('11635')/*多头需要向空头补偿持仓价值的':'空头需要向多头补偿持仓价值的'*/}${Math.abs(Number(this.FundingLongR.split('%')[0]))}%`
        this.FundingNextTmStr =gDI18n.$t('10414',{value : (FundingNext?new Date(FundingNext).format('yyyy-MM-dd hh:mm:ss'):'--')})
        this.FundingTimeDifference = FundingNext ? utils.getTimeDifference(new Date(FundingNext), new Date()) : '--' // 时间差
        //this.FundingNextTmStr = `下次资金费率交换时间：${FundingNext?new Date(FundingNext).format('yyyy-MM-dd hh:mm:ss'):'--'}`
        this.FundingLongRStr = `${Number(FundingLongR)>0? gDI18n.$t('10014'/*'多头需要向空头补偿持仓价值的'*/): gDI18n.$t('10015'/*'空头需要向多头补偿持仓价值的'*/)}${Math.abs(Number(FundingLongR))}%`
        
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
                // m('hr', {class: "dropdown-divider "}),
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
        return this.lastTick[Sym] || {}
    },

    //设置网页标题
    setWebPageTitle: function () {
        let WebTitle = window.gMkt.CtxPlaying.Sym
        if (WebTitle) {
            let LastPrz = spotTick.getLastTick().LastPrz || " "
            let title = utils.getSymDisplayName(window.gMkt.AssetD, WebTitle)
            document.title = LastPrz + " " + title
        }
    },

    getLeftTick: function(){
        let type = window.$config.views.headerTick.left.type
        let Volume24ForUSDT = Number(spotTick.getLastTick().Volume24ForUSDT)
        let Turnover24ForUSDT = Number(spotTick.getLastTick().Turnover24ForUSDT)
        if (Volume24ForUSDT) {
            Volume24ForUSDT = Volume24ForUSDT.toFixed(0)
        }

        if (Turnover24ForUSDT) {
            Turnover24ForUSDT = Turnover24ForUSDT.toFixed(0)
        }
        switch(type){
            case 0: 
                let pageTradeStatus = window.gMkt.CtxPlaying.pageTradeStatus
                return m("div",{class:"pub-header-tick-left"},[
                    m(symSelect),
                    m('span', {class:"pub-header-tick-left-pre-prz is-hidden-touch"+utils.getColorStr(spotTick.getLastTick().color, 'font')},[
                        spotTick.getLastTick().LastPrz || '--'
                    ]),
                    m('span', {class:"pub-header-tick-left-pre-prz is-hidden-touch pub-fall-rise"+utils.getColorStr(spotTick.getLastTick().color, 'font')},[
                        m('i',{class:"icon-fall-rise iconfont" + (spotTick.getLastTick().color == 1?" iconrise" :spotTick.getLastTick().color == -1?" iconfall" :" ")})
                    ]),
                    m('span', {class:"pub-header-tick-left-pre-button tag is-hidden-touch"+utils.getColorStr(spotTick.getLastTick().rfpreColor)},[
                        spotTick.getLastTick().rfpre || '--'
                    ]),
                    m('table', {class:"is-hidden-touch"}, [
                        m('tr', {}, [
                            m('td', {class:"" + (pageTradeStatus == 1? "" : " table-tr-td-vertical")}, [
                                m('p', {class:"" + (pageTradeStatus == 1? "" : " is-hidden")}, [
                                    m('span',[
                                        m(Tooltip, {
                                            dashed: true,
                                            label: gDI18n.$t('10475'),//"指数价格："
                                            content: [
                                                m('p', "标的资产的价格，这里是BTC/USDT的指数价格。点此了解更多...")
                                            ]
                                        }),
                                    ]),
                                    m('span.has-text-1',[
                                        spotTick.getLastTick().indexPrz || '--'
                                    ])
                                ]),
                                m('div', {class:""}, [
                                    m(Tooltip, {
                                        dashed: true,
                                        label: gDI18n.$t('10476'),//"标记价格："
                                        content: [
                                            m('p', "这是现在的标记价格。点此了解更多...")
                                        ]
                                    }),
                                    m('span.has-text-1',[
                                        spotTick.getLastTick().SettPrz || '--'
                                    ])
                                ]),
                            ]),
                            m('td', {class:""}, [
                                m('p', {class:""}, [
                                    m('span',[
                                        gDI18n.$t('10477')//"24H最高："
                                    ]),
                                    m('span.has-text-1',[
                                        spotTick.getLastTick().High24 || '--'
                                    ])
                                ]),
                                m('p', {class:""}, [
                                    m('span',[
                                        gDI18n.$t('10478')//"24H最低："
                                    ]),
                                    m('span.has-text-1',[
                                        spotTick.getLastTick().Low24 || '--'
                                    ])
                                ]),
                            ]),
                            m('td', {class:"" + (pageTradeStatus == 1? "" : " is-hidden")}, [
                                m(Tooltip, {
                                    dashed: true,
                                    label: gDI18n.$t('10020'),// 资金费率
                                    content: [
                                        m('p', spotTick.FundingNextTmStr),
                                        m('p', spotTick.FundingLongRStr)
                                    ]
                                }),
                                m('p', {class:"has-text-1-important"}, [
                                    spotTick.getLastTick().FundingLongR || '--'
                                ]),
                            ]),
                            m('td', {class:""}, [
                                m('p', {class:""}, [
                                    m('span',[
                                        gDI18n.$t('10479')//"24H成交量："
                                    ]),
                                    m('span.has-text-1',[
                                        utils.toThousands(spotTick.getLastTick().Volume24) || '--'
                                    ])
                                ]),
                                m('p', {class:"has-text-1-important"}, [
                                    '≈ ' + (utils.toThousands(spotTick.getLastTick().Turnover24) || '--') + " " + (spotTick.getLastTick().FromC || "--")//' USDT'
                                ]),
                            ]),
                            m('td', {class :"" + (pageTradeStatus == 1? "" : " is-hidden")}, [
                                m('p', {class:""}, [
                                    m('span',[
                                        gDI18n.$t('10480')//"持仓量："
                                    ]),
                                    m('span.has-text-1',[
                                        utils.toThousands(spotTick.getLastTick().OpenInterest) || '--'
                                    ])
                                ]),
                                m('p', {class:"has-text-1-important"}, [
                                    '≈ ' + (utils.toThousands(spotTick.getLastTick().OpenInterestForUSDT) || '--') + " " + (spotTick.getLastTick().FromC || "--")//' USDT'
                                ]),
                            ]),
                            m('td', {class :"" + (pageTradeStatus == 1? "" : " is-hidden")}, [
                                m('p', {class:""}, [
                                    m('span', [
                                        "资金时间"
                                    ])
                                ]),
                                m('p', {class:"has-text-1-important"}, [
                                    spotTick.FundingTimeDifference || '--'
                                ]),
                            ]),
                        ])
                    ])
                ])
            case 1:
                return this.customLeftTick()
            default:
                return  null
        }
    },
    customLeftTick: function(){

    }, 
    settingAny:function(){
        this.isSetting = !this.isSetting
        
    },
    getEntrustSet:function(){
        this.isSetting = false
        if (!window.gWebAPI.isLogin()) {
            return window.gWebAPI.needLogin()
        }
        gEVBUS.emit(gTrd.EV_OPENORDADJUST_UPD, {Ev: gTrd.EV_OPENORDADJUST_UPD,})
    },
    getProfitLoss:function(){
        this.isSetting = false
        gEVBUS.emit(gTrd.EV_OPENIMPLEMENTED_UPD, {Ev: gTrd.EV_OPENIMPLEMENTED_UPD,})
    },

    //获取本地合约设置
    // getForcedPriceSeted:function(){
    //     spotTick.ForcedPrice = window.$config.future.ForcedPrice
    //     console.log(spotTick.ForcedPrice,222222222222)
    // },

    getSettingView:function(){
        return m('div',{class:'setTing-right set-back has-text-1 setTing-right-font' + (this.isSetting?" ":" is-hidden"),onclick:function(e){
            window.stopBubble(e)
        }},[
            m('div',{class:"setTing-right-ord is-flex",onclick:function(e){
                spotTick.getEntrustSet()
            }},[
                m('div',{class:""},[
                    '委托确认',
                ]),
                m('div',{class:""},[
                    m('i',{class:"iconfont iconarrow-right icon-font-right has-text-success"})
                ]),

            ]),
            m('hr',{class:"hr-back"}),
            m('div',{class:"setTing-right-ord is-flex",onclick:function(e){
                spotTick.getProfitLoss()
            }},[
                m('div',{class:""},[
                    '未实现盈亏计算',
                ]),
                m('div',{class:""},[
                    m('span',{class:"has-text-success"},[
                        window.$config.future.UPNLPrzActive == "1"?"最新":"标记"
                    ]),
                    m('i',{class:"iconfont iconarrow-right icon-font-right has-text-success"})
                ]),

            ]),
        ])
    },
    getRightTick: function(){
        let type = window.$config.views.headerTick.right.type
        switch(type){
            case 0: 
                return m("div",{class:"pub-header-tick-right"},[
                    m('button', {class: "button is-rounded pub-header-tick-right-setting",onclick:function(e){
                        spotTick.settingAny()
                        window.stopBubble(e)
                    }}, [
                        m('span', {class: "icon is-medium"},[
                            m('i', {class: "iconfont iconshezhi1 fas fa-2x has-text-1 icon-fixed", "aria-hidden": true })
                        ]),
                        spotTick.getSettingView()
                    ]),
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

import symSelect from './symSelect'
import utils from '../../../utils/utils'
export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
        // spotTick.getForcedPriceSeted()
        spotTick.initEVBUS()
        spotTick.subTick()
    },
    view: function(vnode) {
        
        return m("div",{class:"pub-header-tick box is-flex"},[
            spotTick.getLeftTick(),
            m('.spacer'),
            spotTick.getRightTick()
        ])
    },
    onremove: function(vnode) {
        spotTick.rmEVBUS()
    },
    
}