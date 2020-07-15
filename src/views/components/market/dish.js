var m = require("mithril")

let dish = {
    //行情限制数据处理时间间隔
    TICKCLACTNTERVAL: 100,
    ORDER20CLACTNTERVAL: 100,
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
    //order20最后更新时间
    lastTmForOrder20: 0,
    //order20数据接收
    tickObjForOrder20: {},
    //需要显示的行情数据
    lastTick: {},
    //需要显示的行情数据
    order20: {},
    order20_raw: {},
    //order20界面显示数据
    order20ForSell: null,
    order20Forbuy: null,
    //盘口显示条数
    order20ListNum: 8,
    //盘口类型
    dishType: 0, //0:买卖盘口，1:买盘盘口，2:卖盘盘口
    dishTypeList: [gDI18n.$t('10007'/*'买卖盘口'*/), gDI18n.$t('10008'/*'买盘盘口'*/), gDI18n.$t('10009'/*'卖盘盘口'*/)],
    dishTypeListOpen: false,
    QuoteCoin: "", // 当前合约QuoteCoin
    //初始化全局广播
    initEVBUS: function(){
        let that = this
        
        //body点击事件广播
        if(this.EV_ClICKBODY_unbinder){
            this.EV_ClICKBODY_unbinder()
        }
        this.EV_ClICKBODY_unbinder = window.gEVBUS.on(gEVBUS.EV_ClICKBODY,arg=> {
            that.dishTypeListOpen = false
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

        //order20行情全局广播
        if(this.EV_ORDER20_UPD_unbinder){
            this.EV_ORDER20_UPD_unbinder()
        }
        this.EV_ORDER20_UPD_unbinder = window.gEVBUS.on(gMkt.EV_ORDER20_UPD,arg=> {
            that.onOrder20(arg)
        })
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD, arg => {
            that.initLanguage()
        })
    },
    initLanguage: function(){
        this.dishTypeList = [gDI18n.$t('10007'/*'买卖盘口'*/), gDI18n.$t('10008'/*'买盘盘口'*/), gDI18n.$t('10009'/*'卖盘盘口'*/)]
    },
    //删除全局广播
    rmEVBUS: function(){
        if(this.EV_TICK_UPD_unbinder){
            this.EV_TICK_UPD_unbinder()
        }
        if(this.EV_INDEX_UPD_unbinder){
            this.EV_INDEX_UPD_unbinder()
        }
        if(this.EV_ORDER20_UPD_unbinder){
            this.EV_ORDER20_UPD_unbinder()
        }
    },

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

    onOrder20: function(param){
        let tm = Date.now()
        this.tickObjForOrder20[param.Sym] = param.data
        if(tm - this.lastTmForOrder20 > this.ORDER20CLACTNTERVAL){
            this.order20_raw = Object.assign(this.order20_raw, this.tickObjForOrder20)
            this.updateOrder20()
            this.lastTmForOrder20 = tm
            this.tickObjForOrder20 = {}
        }
    },
    //更新order20
    updateOrder20: function(){
        let Sym = window.gMkt.CtxPlaying.Sym
        let ass = window.gMkt.AssetD[Sym]
        let PrzMinIncSize = ass?utils.getFloatSize(utils.getFullNum(ass.PrzMinInc)):6;
        let VolMinValSize = ass ? utils.getFloatSize(utils.getFullNum(ass.Mult)): 6;
        let order20 = this.order20_raw[Sym]?this.order20_raw[Sym]:null
        
        let askNum = 0,bidNum = 0;
        switch(this.dishType){
            case 0:
                askNum = bidNum = this.order20ListNum
                break;
            case 1:
                askNum = 0
                bidNum = this.order20ListNum * 2
                break;
            case 2:
                askNum = this.order20ListNum * 2
                bidNum = 0
                break;
        }
        if(order20){
            let asks = []
            let volumeSumForAsk = 0
            
            let _Asks = order20.Asks.slice(0, askNum)
            _Asks.map(function(item){
                volumeSumForAsk+=item[1]
                asks.push([
                    Number(item[0]).toCeilFixed(PrzMinIncSize),
                    Number(item[1]).toCeilFixed(VolMinValSize),
                    Number(volumeSumForAsk).toCeilFixed(VolMinValSize),
                ])
            })
            
            asks.sort(function(a,b){
                return b[0]-a[0]
            })
            if (asks.length < askNum && this.dishType != 1) {
                let n = askNum - asks.length
                for (let i = 0; i < n; i++) {
                    asks.unshift(['--', '--', '--'])
                }
            }
            let order20ForSell = {
                Asks:asks,
                volumeSumForAsk: volumeSumForAsk
            }
            this.order20ForSell = order20ForSell

            let bids = []
            let volumeSumForBid = 0
            let _Bids = order20.Bids.slice(0, bidNum)
            _Bids.map(function(item){
                volumeSumForBid+=item[1]
                bids.push([
                    Number(item[0]).toCeilFixed(PrzMinIncSize),
                    Number(item[1]).toCeilFixed(VolMinValSize),
                    Number(volumeSumForBid).toCeilFixed(VolMinValSize),
                ])
            })
            if (bids.length < bidNum && this.dishType != 2) {
                let n = bidNum - bids.length
                for (let i = 0; i < n; i++) {
                    bids.push(['--', '--', '--'])
                }
            }
            let order20ForBuy = {
                Bids:bids,
                volumeSumForBid: volumeSumForBid
            }

            this.order20ForBuy = order20ForBuy

        }else{
            let asks = [],bids = []
            if (asks.length < askNum && this.dishType != 1) {
                let n = askNum - asks.length
                for (let i = 0; i < n; i++) {
                    asks.unshift(['--', '--', '--'])
                }
            }
            let order20ForSell = {
                Asks:asks,
                volumeSumForAsk: 0
            }
            this.order20ForSell = order20ForSell

            if (bids.length < bidNum && this.dishType != 2) {
                let n = bidNum - bids.length
                for (let i = 0; i < n; i++) {
                    bids.push(['--', '--', '--'])
                }
            }
            let order20ForBuy = {
                Bids:bids,
                volumeSumForBid: 0
            }

            this.order20ForBuy = order20ForBuy
        }
        m.redraw();
    },

    //获取当前合约最新行情
    getLastTick: function(){
        dish.getQuoteCoin() // 获取QuoteCoin
        let Sym = window.gMkt.CtxPlaying.Sym
        return this.lastTick[Sym] || {}
    },
    // 获取QuoteCoin
    getQuoteCoin () {
        this.QuoteCoin = window.gMkt.AssetD[window.gMkt.CtxPlaying.Sym] ? window.gMkt.AssetD[window.gMkt.CtxPlaying.Sym].QuoteCoin : ""
    },
    getOrder20ForSellList: function(){
        let order20ForSell = this.order20ForSell
        if(!order20ForSell) return ''
        return order20ForSell.Asks.map(function(item,i){
            return m("div",{class:"pub-dish-list-item is-flex"},[
                m('div', {class: ""},[
                    m('p', {class: "w100 has-text-left has-text-danger", onclick: function(){
                        dish.setPlaceOrdPrzAndNum('prz', item[0])
                    }},[
                        item[0]
                    ]),
                ]),
                m('div', {class: ""},[
                    m('p', {class: "w100", onclick: function(){
                        dish.setPlaceOrdPrzAndNum('num', item[1])
                    }},[
                        item[1]
                    ]),
                ]),
                m('div', {class: "is-hidden-touch"},[
                    m('p', {class: "w100 has-text-right", onclick: function(){
                        dish.setPlaceOrdPrzAndNum('num', item[2])
                    }},[
                        item[2]
                    ]),
                ]),
                m('div', {class:"pub-dish-list-item-mode has-background-danger", style:"width:"+(item[2]/order20ForSell.volumeSumForAsk * 100)+"%"})
            ])
        })
    },

    getOrder20ForBuyList: function(){
        let order20ForBuy = this.order20ForBuy
        // console.log("this.order20ForBuy",this.order20ForBuy);
        
        if(!order20ForBuy) return ''
        return order20ForBuy.Bids.map(function(item,i){
            return m("div",{class:"pub-dish-list-item is-flex"},[
                m('div', {class: ""},[
                    m('p', {class: "w100 has-text-left has-text-success", onclick: function(){
                        dish.setPlaceOrdPrzAndNum('prz', item[0])
                    }},[
                        item[0]
                    ]),
                ]),
                m('div', {class: ""},[
                    m('p', {class: "w100", onclick: function(){
                        dish.setPlaceOrdPrzAndNum('num', item[1])
                    }},[
                        item[1]
                    ]),
                ]),
                m('div', {class: "is-hidden-touch"},[
                    m('p', {class: "w100 has-text-right", onclick: function(){
                        dish.setPlaceOrdPrzAndNum('num', item[2])
                    }},[
                        item[2]
                    ]),
                ]),
                m('div', {class:"pub-dish-list-item-mode has-background-success", style:"width:"+(item[2]/order20ForBuy.volumeSumForBid * 100)+"%"})
            ])
        })
    },
    //设置盘口类型
    setdishType: function(type){
        this.dishType = type
        this.dishTypeListOpen = false
        this.updateOrder20()
    },
    getDishTypeBtns: function(){
        return this.dishTypeList.map(function(item,i){
            return m('button', {
                key: 'dish-type-btns' + item + i, class: "button trade-button-bg" + (dish.dishType == i ?' is-primary is-primary-font':' is-outlined'), onclick:function(){
                dish.setdishType(i)
            }}, [
                item
            ])
        })
    },
    getMenuDishTypeList: function(){
        return this.dishTypeList.map(function(item,i){
            return m('dev', {key: 'dish-type-item'+item+i, class: ""}, [
                m('a', { class: "dropdown-item"+(dish.dishType == i?' has-text-primary':''), onclick: function(){
                    dish.setdishType(i)
                }},[
                    item
                ])
            ])
        })
    },
    setPlaceOrdPrzAndNum: function(type, val){
        if(!val || val == '--'){
            return 
        }
        gEVBUS.emit(gEVBUS.EV_CHANGEPLACEORDPRZABDNUM, { ev: gEVBUS.EV_CHANGEPLACEORDPRZABDNUM, type: type, val: val })
    }
}

export default {
    oninit: function(vnode){
        dish.initLanguage()
        if(window.isMobile){
            // 手机端根据合约模式调整盘口
            let tradeType = window.$config.future.tradeType
            switch(tradeType){
                case 0:
                    dish.order20ListNum = 7
                    break;
                case 1:
                case 2:
                case 3:
                    dish.order20ListNum = 8
                    break;
                default:
                    dish.order20ListNum = 8
            }
        }
    },
    oncreate: function(vnode){
        dish.initEVBUS()
        dish.updateOrder20()
    },
    view: function(vnode) {
        
        return m("div",{class:"pub-dish has-text-1"},[
            m('div', { class: `` + (window.isMobile ? "pub-dish-top-m" : " pub-dish-top")}, [
                m('p', { class: `pub-dish-top-pic` }, [
                    m("span",[
                        gDI18n.$t('10186'),
                    ]),
                    " ",
                    m("span",{class :""},[
                        dish.QuoteCoin//`价格 ${dish.QuoteCoin}`
                    ])
                ]),
                m('p', { class: `pub-dish-top-num` }, [
                    // + 
                    m('span',[
                        gDI18n.$t('10087')//'数量'
                    ]),
                    m('span', { class: "" },[
                        "(" + gDI18n.$t('10423') + ")"//'(张)'
                    ]),
                ]),
                m('p', { class: `pub-dish-top-time is-hidden-touch` }, [
                    m('span', [
                        gDI18n.$t('10493')//"总量"
                    ]),
                    m('span', { class: "" }, [
                        "(" + gDI18n.$t('10423') + ")"//'(张)'
                    ]),
                ])
            ]),
            dish.getOrder20ForSellList(),
            m("div",{class:"pub-dish-tick"},[
                m("div",{class:"is-flex"},[
                    m("div",{class:""},[
                        m('span', {class:"has-text-weight-semibold is-size-4"+utils.getColorStr(dish.getLastTick().color, 'font')},[
                            dish.getLastTick().LastPrz || '--'
                        ]),
                    ]),
                    m('.spacer'),
                    m("div",{class:""},[
                        m('span', {class:"has-text-weight-semibold is-size-5 "+utils.getColorStr(dish.getLastTick().rfpreColor, 'font')},[
                            dish.getLastTick().rfpre || '--'
                        ]),
                    ]),
                ]),
                m("div",{class:"is-flex has-text-3"},[
                    m("div",{class:""},[
                        m('span', {class:" is-size-7 "},[
                            gDI18n.$t('10010',{value :(dish.getLastTick().indexPrz || '--')})//'指数：'+(dish.getLastTick().indexPrz || '--')
                        ]),
                    ]),
                    m('.spacer'),
                    m("div",{class:""},[
                        m('span', {class:" is-size-7 "},[
                            gDI18n.$t('10011',{value:(dish.getLastTick().SettPrz || '--')})//'标记：'+(dish.getLastTick().SettPrz || '--')
                        ]),
                    ]),
                ]),
            ]),
            dish.getOrder20ForBuyList(),
            m('div', {class:"pub-dish-bottom buttons are-small is-hidden-touch"}, [
                dish.getDishTypeBtns()
            ]),
            m('div', {class: "dropdown pub-dish-select is-hidden-desktop" + (dish.dishTypeListOpen?' is-active':'')}, [
                m('.dropdown-trigger', {}, [
                    m('button', {class: "button is-outline is-fullwidth",'aria-haspopup':true, "aria-controls": "dropdown-menu2", onclick: function(e){
                        dish.dishTypeListOpen = !dish.dishTypeListOpen
                        window.stopBubble(e)
                    }}, [
                        m('div', {}, [
                            m('span',{ class: ""}, dish.dishTypeList[dish.dishType]),
                            m('span', {class: "icon "},[
                                m('i', {class: "iconfont iconxiala has-text-primary", "aria-hidden": true })
                            ]),
                        ])
                    ]),
                ]),
                m('.dropdown-menu', { class:"max-height-500 scroll-y dropdown-pad-right", id: "dropdown-menu2", role: "menu"}, [
                    m('.dropdown-content', {class:"has-text-centered"}, [
                        dish.getMenuDishTypeList()
                    ]),
                ]),
            ]),
        ])
    },
    onremove: function(vnode) {
        dish.rmEVBUS()
    },
}