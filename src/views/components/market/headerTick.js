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
    //初始化全局广播
    initEVBUS: function(){
        let that = this
        
        //assetD合约详情全局广播
        if(this.EV_ASSETD_UPD_unbinder){
            this.EV_ASSETD_UPD_unbinder()
        }
        this.EV_ASSETD_UPD_unbinder = window.gEVBUS.on(gMkt.EV_ASSETD_UPD,arg=> {
            that.initSymList()
        })

        //页面交易类型全局广播
        if(this.EV_PAGETRADESTATUS_UPD_unbinder){
            this.EV_PAGETRADESTATUS_UPD_unbinder()
        }
        this.EV_PAGETRADESTATUS_UPD_unbinder = window.gEVBUS.on(gMkt.EV_PAGETRADESTATUS_UPD,arg=> {
            that.initSymList()
        })

        //tick行情全局广播
        if(this.EV_TICK_UPD_unbinder){
            this.EV_TICK_UPD_unbinder()
        }
        this.EV_TICK_UPD_unbinder = window.gEVBUS.on(gMkt.EV_TICK_UPD,arg=> {
            this.onTick(arg)
        })
        
        //指数行情全局广播
        if(this.EV_INDEX_UPD_unbinder){
            this.EV_INDEX_UPD_unbinder()
        }
        this.EV_INDEX_UPD_unbinder = window.gEVBUS.on(gMkt.EV_INDEX_UPD,arg=> {
            this.onTick(arg)
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
    },
    //初始化合约以及现货列表
    initSymList: function(){
        let displaySym = window.gMkt.displaySym
        let assetD = window.gMkt.AssetD
        let futureSymList = [],spotSymList = []
        displaySym.map(function(Sym){
            let ass = assetD[Sym]
            if (ass.TrdCls == 3) {
                futureSymList.push(Sym)
            } else if (ass.TrdCls == 1) {
                spotSymList.push(Sym)
            }else if(ass.TrdCls == 2){
                futureSymList.push(Sym)
            }
        })
        this.futureSymList = futureSymList
        this.spotSymList = spotSymList
        if(window.gMkt.CtxPlaying.pageTradeStatus == 1){
            if(!futureSymList.includes(window.gMkt.CtxPlaying.Sym)){
                // window.gMkt.CtxPlaying.Sym = futureSymList[0]
                this.setSym(futureSymList[0])
            }
        }else if(window.gMkt.CtxPlaying.pageTradeStatus == 2){
            if(!spotSymList.includes(window.gMkt.CtxPlaying.Sym)){
                // window.gMkt.CtxPlaying.Sym = spotSymList[0]
                this.setSym(spotSymList[0])
            }
        }
        m.redraw();
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
        m.redraw();
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

    //设置合约
    setSym: function(Sym){
        window.gMkt.CtxPlaying.Sym = Sym
        this.unSubTick()
        this.subTick()
        
        gEVBUS.emit(gMkt.EV_CHANGESYM_UPD, {Ev: gMkt.EV_CHANGESYM_UPD, Sym:Sym})
    }, 
    getLeftTick: function(){
        let type = window.$config.views.headerTick.left.type
        switch(type){
            case 0: 
                return m("div",{class:"pub-header-tick-left"},[
                    spotTick.getSymSelect(),
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
                                    "指数价格："+(spotTick.getLastTick().indexPrz || '--')
                                ]),
                                m('p', {class:""}, [
                                    "标记价格："+(spotTick.getLastTick().SettPrz || '--')
                                ]),
                            ]),
                            m('td', {class:""}, [
                                m('p', {class:""}, [
                                    "24H最高："+(spotTick.getLastTick().High24 || '--')
                                ]),
                                m('p', {class:""}, [
                                    "24H最低："+(spotTick.getLastTick().Low24 || '--')
                                ]),
                            ]),
                            m('td', {class:""}, [
                                m('p', {class:""}, [
                                    "资金费率"
                                ]),
                                m('p', {class:""}, [
                                    spotTick.getLastTick().FundingLongR || '--'
                                ]),
                            ]),
                            m('td', {class:""}, [
                                m('p', {class:""}, [
                                    "24H成交量："+(spotTick.getLastTick().Volume24 || '--')
                                ]),
                                m('p', {class:""}, [
                                    '≈ '+(spotTick.getLastTick().Volume24ForUSDT || '--')+'USDT'
                                ]),
                            ]),
                            m('td', {}, [
                                m('p', {class:""}, [
                                    "持仓量："+(spotTick.getLastTick().Turnover24 || '--')
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
                    m('button', {class: "button is-white is-rounded",}, [
                        m('span', {class: "icon is-medium"},[
                            m('i', {class: "iconfont iconshezhi1 fas fa-2x", "aria-hidden": true })
                        ]),
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
    getSymSelect: function(){
        let type = window.$config.views.headerTick.left.symSelect.type
        switch(type){
            case 0: 
                return m('.dropdown.is-hoverable', {}, [
                    m('.dropdown-trigger', {}, [
                        m('button', {class: "button is-primary is-inverted h-auto",'aria-haspopup':true, "aria-controls": "dropdown-menu2"}, [
                            m('span',{ class: ""}, utils.getSymDisplayName(window.gMkt.AssetD, window.gMkt.CtxPlaying.Sym)),
                            m('span', {class: "icon "},[
                                m('i', {class: "iconfont iconxiala iconfont-medium", "aria-hidden": true })
                            ]),
                        ]),
                    ]),
                    m('.dropdown-menu', {class:"max-height-500 scroll-y", id: "dropdown-menu2", role: "menu"}, [
                        m('.dropdown-content', {class:"has-text-centered"}, [
                            spotTick.getSymList()
                        ]),
                    ]),
                ])
            case 1:
                return this.customSymSelect()
            default:
                return null
        }
    },
    customSymSelect: function(){

    }

}

export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
        spotTick.initEVBUS()
        spotTick.initSymList()
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
        obj.rmEVBUS()
    },
    
}