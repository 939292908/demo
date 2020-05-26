var m = require("mithril")

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
        // let str = `下次资金费率交换时间：${new Date(FundingNext).format('yyyy-MM-dd hh:mm:ss')}<br/>${Number(this.FundingLongR.split('%')[0])>0?this.$t('11634'):this.$t('11635')/*多头需要向空头补偿持仓价值的':'空头需要向多头补偿持仓价值的'*/}${Math.abs(Number(this.FundingLongR.split('%')[0]))}%`
        this.FundingNextTmStr =gDI18n.$t('10414',{value : (FundingNext?new Date(FundingNext).format('yyyy-MM-dd hh:mm:ss'):'--')})
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

    getLeftTick: function(){
        let type = window.$config.views.headerTick.left.type
        switch(type){
            case 0: 
                return m("div",{class:"pub-header-tick-left"},[
                    m(symSelect),
                    m('span', {class:"pub-header-tick-left-pre-prz is-hidden-touch"+utils.getColorStr(spotTick.getLastTick().color, 'font')},[
                        spotTick.getLastTick().LastPrz || '--'
                    ]),
                    // m('button', {class:"pub-header-tick-left-pre-button button"+utils.getColorStr(spotTick.getLastTick().rfpreColor)},[
                    //     spotTick.getLastTick().rfpre || '--'
                    // ]),
                    m('span', {class:"pub-header-tick-left-pre-button tag is-hidden-touch"+utils.getColorStr(spotTick.getLastTick().rfpreColor)},[
                        spotTick.getLastTick().rfpre || '--'
                    ]),
                    m('table', {class:"is-hidden-touch"}, [
                        m('tr', {}, [
                            m('td', {class:""}, [
                                m('p', {class:""}, [
                                    gDI18n.$t('10016',{value : (spotTick.getLastTick().indexPrz || '--')})//"指数价格："+(spotTick.getLastTick().indexPrz || '--')
                                ]),
                                m('p', {class:""}, [
                                    gDI18n.$t('10017',{value : (spotTick.getLastTick().SettPrz || '--')})//"标记价格："+(spotTick.getLastTick().SettPrz || '--')
                                ]),
                            ]),
                            m('td', {class:""}, [
                                m('p', {class:""}, [
                                    gDI18n.$t('10018') + (spotTick.getLastTick().High24 || '--')
                                    //"24H最高："+(spotTick.getLastTick().High24 || '--')
                                ]),
                                m('p', {class:""}, [
                                    gDI18n.$t('10019',{value : (spotTick.getLastTick().Low24 || '--')})//"24H最低："+(spotTick.getLastTick().Low24 || '--')
                                ]),
                            ]),
                            m('td', {class:""}, [
                                m('div', {class:"dropdown is-hoverable"}, [
                                    m('div', {class:"dropdown-trigger"}, [
                                        m('p', {class:""}, [
                                            gDI18n.$t('10020'),//"资金费率 ",
                                            m('i', {class:"iconfont iconinfo is-size-7"})
                                        ]),
                                    ]),
                                    m('div', {class:"dropdown-menu"}, [
                                        m('div', {class:"dropdown-content"}, [
                                            m('div', {class:"dropdown-item"}, [
                                                m('p', {class:""}, [
                                                    spotTick.FundingNextTmStr,
                                                ]),
                                                m('p', {class:""}, [
                                                    spotTick.FundingLongRStr,
                                                ]),
                                            ]),
                                        ]),
                                    ]),
                                ]),
                                m('p', {class:""}, [
                                    spotTick.getLastTick().FundingLongR || '--'
                                ]),
                            ]),
                            m('td', {class:""}, [
                                m('p', {class:""}, [
                                    gDI18n.$t('10021',{value : (spotTick.getLastTick().Volume24 || '--')})//"24H成交量："+(spotTick.getLastTick().Volume24 || '--')
                                ]),
                                m('p', {class:""}, [
                                    '≈ '+(spotTick.getLastTick().Volume24ForUSDT || '--')+'USDT'
                                ]),
                            ]),
                            m('td', {}, [
                                m('p', {class:""}, [
                                    gDI18n.$t('10022',{value : (spotTick.getLastTick().Turnover24 || '--')})//"持仓量："+(spotTick.getLastTick().Turnover24 || '--')
                                ]),
                                m('p', {class:""}, [
                                    '≈ '+(spotTick.getLastTick().Turnover24ForUSDT || '--')+'USDT'
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
    getRightTick: function(){
        let type = window.$config.views.headerTick.right.type
        switch(type){
            case 0: 
                return m("div",{class:"pub-header-tick-right"},[
                    // m('button', {class: "button is-white is-rounded",}, [
                    //     m('span', {class: "icon is-medium"},[
                    //         m('i', {class: "iconfont iconshezhi1 fas fa-2x", "aria-hidden": true })
                    //     ]),
                    // ]),
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
export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
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
    onbeforeremove: function(vnode) {
        spotTick.rmEVBUS()
    },
    
}