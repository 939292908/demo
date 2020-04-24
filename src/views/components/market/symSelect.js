var m = require("mithril")

let symSelect = {
    //行情限制数据处理时间间隔
    TICKCLACTNTERVAL: 100,
    //已订阅的行情列表
    oldSubArr: [],
    //合约名称列表
    futureSymList: [],
    // 现货名称列表
    spotSymList: [],
    // 是否显示列表
    symListOpen: false,
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

    },
    rmEVBUS: function(){
        if(this.EV_ASSETD_UPD_unbinder){
            this.EV_ASSETD_UPD_unbinder()
        }
        if(this.EV_PAGETRADESTATUS_UPD_unbinder){
            this.EV_PAGETRADESTATUS_UPD_unbinder()
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

    //设置合约
    setSym: function(Sym){
        window.gMkt.CtxPlaying.Sym = Sym
        this.symListOpen = false
        
        gEVBUS.emit(gMkt.EV_CHANGESYM_UPD, {Ev: gMkt.EV_CHANGESYM_UPD, Sym:Sym})
    }, 
    getSymSelect: function(){
        let type = window.$config.views.headerTick.left.symSelect.type
        switch(type){
            case 0: 
                return m('div', {class: "dropdown pub-sym-select" + (symSelect.symListOpen?' is-active':'')}, [
                    m('.dropdown-trigger', {}, [
                        m('button', {class: "button is-primary is-inverted h-auto",'aria-haspopup':true, "aria-controls": "dropdown-menu2", onclick: function(){
                            symSelect.symListOpen = !symSelect.symListOpen
                        }}, [
                            m('span',{ class: ""}, utils.getSymDisplayName(window.gMkt.AssetD, window.gMkt.CtxPlaying.Sym)),
                            m('span', {class: "icon "},[
                                m('i', {class: "iconfont iconxiala", "aria-hidden": true })
                            ]),
                        ]),
                    ]),
                    m('.dropdown-menu', {class:"max-height-500 scroll-y", id: "dropdown-menu2", role: "menu"}, [
                        m('.dropdown-content', {class:"has-text-centered"}, [
                            symSelect.getSymList()
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
        symSelect.initEVBUS()
        symSelect.initSymList()
    },
    view: function(vnode) {
        
        return symSelect.getSymSelect()
    },
    onremove: function(vnode) {
        obj.rmEVBUS()
    },
    
}