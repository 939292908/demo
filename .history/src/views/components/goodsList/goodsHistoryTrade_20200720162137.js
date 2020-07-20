var m = require("mithril")
// Header
import Header from "../common/Header_m"

let obj = {
    list: [],
    theadList: [
        {
            title: '交易对',//'',
            class: ""
        },{
            title: '交易类型',//'',
            class: ""
        }, {
            title: '成交价格',//'',
            class: ""
        }, {
            title: '成交数量',//'',
            class: ""
        }, {
            title: '手续费',//'',
            class: ""
        }, {
            title: '成交时间',//'',
            class: ""
        }
    ],
    //初始化全局广播
    initEVBUS: function () {
        let that = this

        if (this.EV_GET_HISTORY_TRD_READY_unbinder) {
            this.EV_GET_HISTORY_TRD_READY_unbinder()
        }
        this.EV_GET_HISTORY_TRD_READY_unbinder = window.gEVBUS.on(gTrd.EV_GET_HISTORY_TRD_READY, arg => {
            that.initObj()
        })

        if (this.EV_WEB_LOGOUT_unbinder) {
            this.EV_WEB_LOGOUT_unbinder()
        }
        this.EV_WEB_LOGOUT_unbinder = window.gEVBUS.on(gWebAPI.EV_WEB_LOGOUT, arg => {
            that.initObj()
        })
        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD, arg => {
            that.initLanguage()
            that.initObj()
        })
        //添加监听交易登录
        if (this.EV_LOGIN_TRADE_unbinder) {
            this.EV_LOGIN_TRADE_unbinder()
        }   
        this.EV_LOGIN_TRADE_unbinder = window.gEVBUS.on(gTrd.EV_LOGIN_TRADE, arg => {
            that.getHistoryList()
        })
        //assetD合约详情全局广播
        if (this.EV_ASSETD_UPD_unbinder) {
            this.EV_ASSETD_UPD_unbinder()
        }
        this.EV_ASSETD_UPD_unbinder = window.gEVBUS.on(gMkt.EV_ASSETD_UPD, arg => {
            that.initObj()
        })

        //交易筛选
        if (this.EV_STOPDROPDOWN_UP_unbinder) {
            this.EV_STOPDROPDOWN_UP_unbinder()
        }
        this.EV_STOPDROPDOWN_UP_unbinder = window.gEVBUS.on(gEVBUS.EV_STOPDROPDOWN_UP, arg => {
            // obj.dropdownType = arg.data.item.xx
            obj.initObj()
        })

        //当前选中合约变化全局广播
        if (this.EV_CHANGESYM_UPD_unbinder) {
            this.EV_CHANGESYM_UPD_unbinder()
        }
        this.EV_CHANGESYM_UPD_unbinder = window.gEVBUS.on(gMkt.EV_CHANGESYM_UPD, arg => {
            obj.initObj()
        })
    },
    initLanguage: function(){
        this.theadList = [
            {
                title: '交易对',//'',
                class: ""
            },{
                title: '交易类型',//'',
                class: ""
            }, {
                title: '成交价格',//'',
                class: ""
            }, {
                title: '成交数量',//'',
                class: ""
            }, {
                title: '手续费',//'',
                class: ""
            }, {
                title: '成交时间',//'',
                class: ""
            }
        ]
    },
    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_GET_HISTORY_TRD_READY_unbinder) {
            this.EV_GET_HISTORY_TRD_READY_unbinder()
        }
        if (this.EV_WEB_LOGOUT_unbinder) {
            this.EV_WEB_LOGOUT_unbinder()
        }
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
        if (this.EV_LOGIN_TRADE_unbinder) {
            this.EV_LOGIN_TRADE_unbinder()
        }   
        if (this.EV_ASSETD_UPD_unbinder) {
            this.EV_ASSETD_UPD_unbinder()
        }
        if (this.EV_STOPDROPDOWN_UP_unbinder) {
            this.EV_STOPDROPDOWN_UP_unbinder()
        }
        if (this.EV_CHANGESYM_UPD_unbinder) {
            this.EV_CHANGESYM_UPD_unbinder()
        }
    },
    getHistoryList: function(){
        let that = this
        let s = window.gTrd
        let aType = '01'
        let Sym = window.gMkt.CtxPlaying.Sym
        let AssetD = window.gMkt.AssetD[Sym] || {}
        if(AssetD.TrdCls == 1){
            aType = '02'
        }else{
            aType = '01'
        }
        let uid = s.RT["UserId"]
        let isReq = s.trdInfoStatus.trade[aType]
        if(!uid || !s || isReq) return
        s.getHistoryOrdAndTrdAndWltlog({
            AId: uid + aType,
        })
    },
    initObj: function(){
        let trade = window.gTrd.MyTrades['02']
        let list = []
        let viaArr = [4,5,7,13]
        for(let k of trade){
            let item = {}
            let Sym = k.Sym
            let ass = window.gMkt.AssetD[Sym]
            if(ass && viaArr.includes(k.Via)){
                utils.copyTab(item, k)

                let PrzMinIncSize = utils.getFloatSize(utils.getFullNum(ass.PrzMinInc || 6));
                let VolMinValSize = utils.getFloatSize(utils.getFullNum(ass.Mult || 2));

                //交易对
                item.displaySym = utils.getSymDisplayName(window.gMkt.AssetD, item.Sym)
                //交易类型
                item.Dir = item.Sz > 0?1:-1
                item.DirStr = utils.getDirByStr(item.Dir)
                //成交时间
                item.AtStr = new Date(item.At).format('MM/dd hh:mm:ss')
                // 成交价格
                item.Prz = Number(item.Prz || 0).toFixed2(PrzMinIncSize)
                //成交数量
                item.Sz = Number(item.Sz || 0).toFixed2(VolMinValSize)
                //手续费
                item.Fee = Number(-item.Fee || 0).toPrecision2(6,8)
                //买入/卖出
                item.NumAB = (item.NumBid || 0) + "/" + (item.NumAsk || 0) 

                // list.push(item)
                //根据按钮筛选数据
                if (window.$StopDropdownType == 1) {
                    list.push(item)
                } else {
                    let Sym = window.gMkt.CtxPlaying.Sym
                    if (item.Sym == Sym) {
                        list.push(item)
                    }
                }
            }
        }
        list.sort(function(a,b){
            return b.At - a.At
        })
        this.list = list
        m.redraw()
    },
    getTheadItem: function () {
        return this.theadList.map(function (item, i) {
            return m("th", { key: "historyOrdtHeadItem" + i, class: ""+item.class }, [
                item.title
            ])
        })
    },
    //设置合约
    setSym(Sym) {
        window.gMkt.CtxPlaying.Sym = Sym // window 保存选中
        utils.setItem('goodsActiveSymbol', Sym)
        gEVBUS.emit(gMkt.EV_CHANGESYM_UPD, { Ev: gMkt.EV_CHANGESYM_UPD, Sym: Sym })
    },
    getListItem: function () {
        return this.list.map(function (item, i) {
            return m("tr", { key: "historyTrdTableListItem" + i, class: "" }, [
                
                m("td", { class: "cursor-pointer" ,onclick:function(){
                    obj.setSym(item.Sym)
                }}, [
                    m("p", { class: " " }, [
                        item.displaySym
                    ])
                ]),
                m("td", { class: " " + utils.getColorStr(item.Dir, 'font') }, [
                    item.DirStr
                ]),
                m("td", { class: " " }, [
                    item.Prz
                ]),
                m("td", { class: " " }, [
                    item.Sz
                ]),
                m("td", { class: " " }, [
                    item.Fee
                ]),
                m("td", { class: "" }, [
                    item.AtStr
                ])
            ])
        })
    },
    // m端列表
    getMobileHistoryList: function (){
        return m("div",{class: "details-header"},[
            // 头部
            m(Header, {
                slot: {
                    center: gDI18n.$t('10237')//"历史成交"
                }
            }),
            // 列表
            m("div",{class : "pub-trade-list  pub-layout-m"},[
            this.list.length != 0 ? 
            this.list.map(function (item, i) {
                return m("div",{ key: "historyOrdtHeadItem" + i, class: "card"},[
                    //顶部排列
                    m("div",{class : "card-content mobile-list"},[
                        m("div",{class : "theadList-transaction has-text-1"},[
                            m("p",{class : "theadList-transaction-p1  header-flex"},[
                                utils.getSymDisplayName(window.gMkt.AssetD, item.displaySym),
                                m("p",{class : "padd-left " + utils.getColorStr(item.Dir, 'font') },[
                                    item.DirStr
                                ]),
                            ]),
                            
                            m("div",{class  : ""},[
                                " ",
                            ]),
                            m("p",{class : " "},[
                                item.Dir
                            ]),
                            m("p",{class : " "},[
                                item.AtStr
                            ])
                        ]),
                        m("hr",{class : "is-primary"}),
                        //中间排列
                        m("div",{class :  "has-text-2"},[
                            m("div",{class : "theadList-profit-loss" ,},[
                                m("div",{class  : "theadList-profit-loss-p1 has-text-2"},[
                                    gDI18n.$t('10061'),//"成交数量" ,
                                    m("p",{class : "has-text-2"},[
                                        item.Sz
                                    ])                                    

                                ]),
                                m("div",{class  : "theadList-profit-loss-p1 has-text-2"},[
                                    gDI18n.$t('10060'),//"成交均价" ,
                                    m("p",{class : "has-text-2"},[
                                        item.Prz
                                    ])                                    
                                ]),
                                m("div",{class  : "theadList-profit-loss-p1 has-text-2 font-right"},[
                                    m("p",{class: "has-text-left"},[
                                        gDI18n.$t('10063') + ":",//"手续费：" 
                                        m("div",{class  : "theadList-profit-loss-p2"},[
                                            m("p",{class : "has-text-2" + item.Fee>0? "has-text-danger" :"has-text-primary"},[
                                                item.Fee
                                            ])
                                        ]),
                                    ]),
                                ]),
                            ]),
                            //底部排列
                            m("div",{class : "theadList-profit-loss" ,},[
                                m("div",{class  : "theadList-profit-loss-p1 has-text-2 theadList-profit2"},[
                                    
                                ]),
                                m("div",{class:"cursor-pointer theadList-profit-loss-p2 theadList-profit3 has-text-2 fomt-blacl text-right"+(" historyOrdTableListItemCopy"+i), "data-clipboard-text": item.PId, onclick: function(e){
                                    window.$copy(".historyOrdTableListItemCopy"+i)
                                }},[                                         
                                    m("div",{class : "has-text-2"},[
                                        // item.PId.substr(-4),
                                        m("i",{class : ""},[ " "]),
                                        // m("i",{class:"iconfont iconcopy"}),
                                    ])  
                                ]),
                            ]),
                        ])
                    ])
                ])
            }) : m("div",{class : "text-none has-text-2"},[
                m("i",{class : "iconfont iconbox" ,style:"font-size: 60px",},[]),
                gDI18n.$t('10468'),//"暂无历史成交记录"
            ])
        ])
    ])
    },
    getContent: function () {
        if (window.isMobile) {
            //移动端列表
            return obj.getMobileHistoryList()
        } else {
            let colgroup = m('colgroup', {}, [
                m('col', { name: "pub-table-1", width: 150 }),
                m('col', { name: "pub-table-2", width: 100 }),
                m('col', { name: "pub-table-4", width: 100 }),
                m('col', { name: "pub-table-5", width: 100 }),
                m('col', { name: "pub-table-6", width: 100 }),
                m('col', { name: "pub-table-7", width: 150 }),
            ])
            return m('div', { class: " table-container" }, [
                m('div', { class: "pub-table-head-box", style: "width: 700px" }, [
                    m("table", { class: "table is-hoverable ", width: '700px', cellpadding: 0, cellspacing: 0 }, [
                        colgroup,
                        m("tr", { class: "" }, [
                            obj.getTheadItem()
                        ])
                    ]),
                ]),
                m('div', { class: "pub-table-body-box", style: "width: 700px" }, [
                    m("table", { class: "table is-hoverable ", width: '700px', cellpadding: 0, cellspacing: 0 }, [
                        colgroup,
                        obj.getListItem()
                    ])
                ]),
            ])
        }
    },
}

export default {
    oninit: function(vnode){
        obj.initLanguage()
    },
    oncreate: function(vnode){
        obj.initEVBUS()
        obj.getHistoryList()
        obj.initObj()
    },
    view: function(vnode) {
        
        return m("div", { class: "pub-history-trade " }, [
            obj.getContent()
        ])
    },
    onremove: function(){
        obj.rmEVBUS()
    }
}