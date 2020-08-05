import utils from "../../../utils/utils"

var m = require("mithril")

let symSelect = {
    //行情限制数据处理时间间隔
    TICKCLACTNTERVAL: 1000,
    //已订阅的行情列表
    oldSubArr: [],
    //合约名称列表
    futureSymList: [],
    futureSymObj: {},
    // 合约对应的ToC列表
    futureCoin: [],
    // 现货名称列表
    spotSymList: [],
    // 是否显示列表
    symListOpen: false,

    tickObj: {},
    lastTmForTick: 0,
    lastTick: {},

    //初始化全局广播
    initEVBUS: function () {
        let that = this

        //assetD合约详情全局广播
        if (this.EV_ASSETD_UPD_unbinder) {
            this.EV_ASSETD_UPD_unbinder()
        }
        this.EV_ASSETD_UPD_unbinder = window.gEVBUS.on(gMkt.EV_ASSETD_UPD, arg => {
            that.initSymList()
        })

        //页面交易类型全局广播
        if (this.EV_PAGETRADESTATUS_UPD_unbinder) {
            this.EV_PAGETRADESTATUS_UPD_unbinder()
        }
        this.EV_PAGETRADESTATUS_UPD_unbinder = window.gEVBUS.on(gMkt.EV_PAGETRADESTATUS_UPD, arg => {
            that.initSymList()
        })


        //body点击事件广播
        if (this.EV_ClICKBODY_unbinder) {
            this.EV_ClICKBODY_unbinder()
        }
        this.EV_ClICKBODY_unbinder = window.gEVBUS.on(gEVBUS.EV_ClICKBODY, arg => {
            that.symListOpen = false
        })

        //tick行情全局广播
        if (this.EV_TICK_UPD_unbinder) {
            this.EV_TICK_UPD_unbinder()
        }
        this.EV_TICK_UPD_unbinder = window.gEVBUS.on(gMkt.EV_TICK_UPD, arg => {
            that.onTick(arg)
            // symSelect.setWebPageTitle()
        })


        if (this.EV_ClOSEHEADERMENU_unbinder) {
            this.EV_ClOSEHEADERMENU_unbinder()
        }
        this.EV_ClOSEHEADERMENU_unbinder = window.gEVBUS.on(gEVBUS.EV_ClOSEHEADERMENU, arg => {
            if (arg.from != 'symSelect') {
                that.symListOpen = false
            }
        })

    },
    rmEVBUS: function () {
        if (this.EV_ASSETD_UPD_unbinder) {
            this.EV_ASSETD_UPD_unbinder()
        }
        if (this.EV_PAGETRADESTATUS_UPD_unbinder) {
            this.EV_PAGETRADESTATUS_UPD_unbinder()
        }
        if (this.EV_ClICKBODY_unbinder) {
            this.EV_ClICKBODY_unbinder()
        }
        if (this.EV_TICK_UPD_unbinder) {
            this.EV_TICK_UPD_unbinder()
        }
        if (this.EV_ClOSEHEADERMENU_unbinder) {
            this.EV_ClOSEHEADERMENU_unbinder()
        }
    },
    //初始化合约以及现货列表
    initSymList: function () {
        let displaySym = window.gMkt.displaySym
        let assetD = window.gMkt.AssetD
        let futureSymList = [], spotSymList = []
        displaySym.map(function (Sym) {
            let ass = assetD[Sym]
            if (ass.TrdCls == 3) {
                futureSymList.push(Sym)
            } else if (ass.TrdCls == 1) {
                spotSymList.push(Sym)
            } else if (ass.TrdCls == 2) {
                futureSymList.push(Sym)
            }
        })
        this.setFutureSymList(futureSymList)
        this.futureSymList = futureSymList
        this.spotSymList = spotSymList


        if (window.gMkt.CtxPlaying.pageTradeStatus == 1) {
            if (futureSymList.length > 0 && !futureSymList.includes(window.gMkt.CtxPlaying.Sym)) {
                let futureActiveSymbol = utils.getItem('futureActiveSymbol')
                let Sym = futureActiveSymbol || utils.getFutureName('BTC', 'USDT', assetD)
                if (!assetD[Sym]) {
                    Sym = futureSymList[0]
                }
                this.setSym(Sym)
            }else{
                this.setSym(window.gMkt.CtxPlaying.Sym, false)
            }
        } else if (window.gMkt.CtxPlaying.pageTradeStatus == 2) {
            if (spotSymList.length > 0 && !spotSymList.includes(window.gMkt.CtxPlaying.Sym)) {
                let goodsActiveSymbol = utils.getItem('goodsActiveSymbol')
                let Sym = goodsActiveSymbol || utils.getSpotName('BTC', 'USDT', assetD)
                if (!assetD[Sym]) {
                    Sym = futureSymList[0]
                }
                this.setSym(Sym)
            }else{
                this.setSym(window.gMkt.CtxPlaying.Sym, false)
            }
        }
        m.redraw();
    },

    setFutureSymList: function (list) {
        let CoinList = [], PTSymList = [], NTSymList = [], symList = [];
        for (let sym of list) {
            let ass = window.gMkt.AssetD[sym]
            if (ass.TrdCls == 2) {
                // 定期合约
                symList.push(sym)
            } else if (ass.TrdCls == 3) {
                if (ass.Flag & 1) {
                    // 反向永续
                    NTSymList.push(sym)
                } else {
                    // 正向永续
                    PTSymList.push(sym)
                }
            }
            if (!CoinList.includes(ass.ToC)) {
                CoinList.push(ass.ToC)
            }
        }
        let futureList = {}
        for (let coin of CoinList) {
            futureList[coin] = []
            for (let sym of PTSymList) {
                let ass = window.gMkt.AssetD[sym]
                if (ass.ToC == coin) {
                    futureList[coin].push(sym)
                }
            }
            for (let sym of NTSymList) {
                let ass = window.gMkt.AssetD[sym]
                if (ass.ToC == coin) {
                    futureList[coin].push(sym)
                }
            }
            for (let sym of symList) {
                let ass = window.gMkt.AssetD[sym]
                if (ass.ToC == coin) {
                    futureList[coin].push(sym)
                }
            }
        }
        CoinList.sort(function (a, b) {
            let idx1 = window.$config.symSort[a] || 999;
            let idx2 = window.$config.symSort[b] || 999;
            return idx1 - idx2
        })
        this.futureCoin = CoinList
        this.futureSymObj = futureList
    },

    //合约列表渲染
    getSymList: function () {
        let that = this
        let SymList = []
        switch (window.gMkt.CtxPlaying.pageTradeStatus) {
            case 1:
                SymList = this.futureSymObj
                let coinList = this.futureCoin
                return coinList.map((coin, i) => {
                    let list = SymList[coin].map(function (Sym, i) {
                        return m('div', {
                            key: 'dropdown-item' + Sym + i, href: "javascript:void(0);", class: "dropdown-item is-flex", onclick: function () {
                                that.setSym(Sym)
                                //修改网页标题
                                // that.setWebPageTitle()
                            }
                        }, [
                            m('div', { class: "" }, [
                                utils.getSymDisplayName(window.gMkt.AssetD, Sym)
                            ]),
                            m('.spacer'),
                            m('div', { class: "has-text-centered" + utils.getColorStr(that.lastTick[Sym] && that.lastTick[Sym].color, 'font') }, [
                                that.lastTick[Sym] && that.lastTick[Sym].LastPrz || '--'
                            ]),
                            m('.spacer'),
                            m('div', { class: "has-text-right" + utils.getColorStr(that.lastTick[Sym] && that.lastTick[Sym].rfpreColor, 'font') }, [
                                that.lastTick[Sym] && that.lastTick[Sym].rfpre || '--'
                            ]),
                        ])
                    })
                    return m('dev', { key: 'dropdown-item' + coin + i, class: "" }, [
                        m('div', { class: "dropdown-item" }, [
                            m('span', { class: "tag is-rounded is-background-2 has-text-1" }, [
                                coin
                            ]),
                        ]),
                        list
                    ])

                })
            case 2:
                SymList = this.spotSymList
                return SymList.map((Sym, i) => {
                    return m('div', {
                        key: 'dropdown-item' + Sym + i, href: "javascript:void(0);", class: "dropdown-item is-flex", onclick: function () {
                            that.setSym(Sym)
                        }
                    }, [
                        m('div', { class: "" }, [
                            utils.getSymDisplayName(window.gMkt.AssetD, Sym)
                        ]),
                        m('.spacer'),
                        m('div', { class: "" + utils.getColorStr(that.lastTick[Sym] && that.lastTick[Sym].color, 'font') }, [
                            that.lastTick[Sym] && that.lastTick[Sym].LastPrz || '--'
                        ]),
                        m('.spacer'),
                        m('div', { class: "" + utils.getColorStr(that.lastTick[Sym] && that.lastTick[Sym].rfpreColor, 'font') }, [
                            that.lastTick[Sym] && that.lastTick[Sym].rfpre || '--'
                        ]),
                    ])

                })

        }

    },
    //设置网页标题
    // setWebPageTitle: function () {
    //     let WebTitle = window.gMkt.CtxPlaying.Sym
    //     if (WebTitle) {
    //         let LastPrz = symSelect.lastTick[WebTitle] && symSelect.lastTick[WebTitle].LastPrz || " "
    //         let title = utils.getSymDisplayName(window.gMkt.AssetD, WebTitle)
    //         document.title = LastPrz + " " + title
    //     }
    // },
    //设置合约
    setSym: function (Sym, toUrl = true) {
        window.gMkt.CtxPlaying.Sym = Sym
        this.symListOpen = false
        this.unSubSym()
        switch (window.gMkt.CtxPlaying.pageTradeStatus) {
            case 1:
                utils.setItem('futureActiveSymbol', Sym)
                break;

            case 2:
                utils.setItem('goodsActiveSymbol', Sym)
                break;
        }
        gEVBUS.emit(gMkt.EV_CHANGESYM_UPD, { Ev: gMkt.EV_CHANGESYM_UPD, Sym: Sym })


        if(toUrl){
            let p = {
                Sym: Sym,
                Page: window.gMkt.CtxPlaying.pageTradeStatus
            }
            p = JSON.stringify(p)
            p = utils.compileStr(p)
            window.router.push({
                path: '/future',
                data: {
                    p: p
                }
            }, true)
        }
        
    },
    getSymSelect: function () {
        let type = window.$config.views.headerTick.left.symSelect.type
        switch (type) {
            case 0:
                return m('div', { class: "dropdown pub-sym-select " + (symSelect.symListOpen ? ' is-active' : ' is-active') }, [
                    m('.dropdown-trigger', {}, [
                        m('button', {
                            class: "button is-background-2 dropdown-button  is-inverted h-auto pub-button-font", 'aria-haspopup': true, "aria-controls": "dropdown-menu2", onclick: function (e) {
                                symSelect.openSelect(e)
                            }
                        }, [
                            m('span', { class: "pub-sym-select-title" }, utils.getSymDisplayName(window.gMkt.AssetD, window.gMkt.CtxPlaying.Sym)),
                            m('span', { class: "icon " }, [
                                m('i', { class: "iconfont iconxiala has-text-primary is-size-6", "aria-hidden": true })
                            ]),
                        ]),
                    ]),
                    m('.dropdown-menu', { class: `pub-header-tick-left-market dropdown-select my-drawer-2 top ${symSelect.symListOpen ? ' open' : ''}`, id: "dropdown-menu2", role: "menu" }, [
                        m('.dropdown-content', { class: "" }, [
                            symSelect.getLeftCon(), // 切换 xx交易 菜单
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
    customSymSelect: function () {

    },
    openSelect: function (e) {
        symSelect.symListOpen = !symSelect.symListOpen
        if (symSelect.symListOpen) {
            this.subSym()
        } else {
            this.unSubSym()
        }
        gEVBUS.emit(gEVBUS.EV_ClOSEHEADERMENU, { ev: gEVBUS.EV_ClOSEHEADERMENU, from: 'symSelect' })
        window.stopBubble(e)
    },
    subSym: function () {
        let SymList = []
        switch (window.gMkt.CtxPlaying.pageTradeStatus) {
            case 1:
                SymList = this.futureSymList
                break;
            case 2:
                SymList = this.spotSymList
                break;
            default:

        }
        if (SymList.length > 0) {
            let subArr = utils.setSubArrType('tick', SymList)
            window.gMkt.ReqSub(subArr)
        }
    },
    unSubSym: function () {
        let SymList = []
        switch (window.gMkt.CtxPlaying.pageTradeStatus) {
            case 1:
                SymList = this.futureSymList
                break;
            case 2:
                SymList = this.spotSymList
                break;
            default:

        }
        SymList = SymList.filter(item => {
            return item != window.gMkt.CtxPlaying.Sym
        })
        if (SymList.length > 0) {
            let subArr = utils.setSubArrType('tick', SymList)
            window.gMkt.ReqUnSub(subArr)
        }
    },
    onTick: function (param) {
        if (!this.symListOpen) return
        let tm = Date.now()
        this.tickObj[param.Sym] = param.data
        if (tm - this.lastTmForTick > this.TICKCLACTNTERVAL) {
            this.updateTick(this.tickObj)
            this.lastTmForTick = tm
            this.tickObj = {}
        }
    },
    updateTick: function (ticks) {
        for (let key in ticks) {
            let item = ticks[key];
            let gmexCI = utils.getGmexCi(window.gMkt.AssetD, item.Sym)
            let indexTick = this.lastTick[gmexCI]

            let obj = utils.getTickObj(window.gMkt.AssetD, window.gMkt.AssetEx, item, this.lastTick[key], indexTick)
            obj ? this.lastTick[key] = obj : ''
        }
        m.redraw();
    },
    // 切换 xx交易 菜单
    getLeftCon () {
        if (!window.isMobile) return []; // 如果pc端 没有该菜单
        let type = window.$config.views.header.left.type
        if (type == 0) {
            return m("div", { class: "is-flex is-background-3" }, [
                m('div', { class: `navbar-item` }, [
                    m('a', {
                        class: "has-text-1 is-size-6" + (window.gMkt.CtxPlaying.pageTradeStatus == 1 ? ' has-text-primary' : ''), onclick: function () {
                            symSelect.setTradeStatus(1)
                        }
                    }, [
                        gDI18n.$t('10001'/*合约交易*/),
                    ])
                ]),
                m('div', { class: `navbar-item` }, [
                    symSelect.getGoodsInStock()
                ])
            ])
        } else {
            return []
        }
    },
    setTradeStatus: function (status) {
        window.gMkt.CtxPlaying.pageTradeStatus = status
        gEVBUS.EmitDeDuplicate(window.gMkt.EV_PAGETRADESTATUS_UPD, 50, window.gMkt.EV_PAGETRADESTATUS_UPD, { Ev: window.gMkt.EV_PAGETRADESTATUS_UPD })
    },
    getGoodsInStock: function () {
        let GIS = window.$config.goodsInStock
        switch (GIS) {
            case 1:
                return m('a', {
                    class: "has-text-1 is-size-6" + (window.gMkt.CtxPlaying.pageTradeStatus == 2 ? ' has-text-primary' : ''), onclick: function () {
                        symSelect.setTradeStatus(2)
                    }
                }, [
                    '币币交易',
                ])
            case 0:
                return null
        }
    },

}

export default {
    oninit: function (vnode) {
        
    },
    oncreate: function (vnode) {
        // 读取地址栏参数并赋值,地址参数为加密参数
        
        let p = utils.queryParams('p')
        if(p){
            p = JSON.parse(utils.uncompileStr(p))
            let Sym = p.Sym
            Sym?symSelect.setSym(Sym, false):''
        }

        symSelect.initEVBUS()
        symSelect.initSymList()
        
    },
    view: function (vnode) {

        return symSelect.getSymSelect()
    },
    onremove: function (vnode) {
        symSelect.unSubSym()
        symSelect.rmEVBUS()
    },

}