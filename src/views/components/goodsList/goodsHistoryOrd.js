var m = require("mithril")
import Header from "../common/Header_m"
import FilterModal from "./components/FilterModal"

let obj = {
    posList: [], // 列表
    posListAll: [], // 不被修改的列表
    isShowModal: false, // 筛选模态框
    theadList: [
        {
            title: '交易对',//'',
            class: ""
        }, {
            title: '交易类型',//'',
            class: ""
        }, {
            title: '委托类型',//'',
            class: ""
        }, {
            title: '委托状态',//'',
            class: ""
        }, {
            title: '委托价格',//'',
            class: ""
        }, {
            title: '委托数量',//'',
            class: ""
        }, {
            title: '成交均价',//'',
            class: ""
        }, {
            title: '成交数量',//'',
            class: ""
        }, {
            title: '成交金额',//'',
            class: ""
        }, {
            title: '触发条件',//'',
            class: ""
        }, {
            title: '委托时间',//'',
            class: ""
        }
    ],
    //初始化全局广播
    initEVBUS: function () {
        let that = this

        if (this.EV_GET_HISTORY_ORD_READY_unbinder) {
            this.EV_GET_HISTORY_ORD_READY_unbinder()
        }
        this.EV_GET_HISTORY_ORD_READY_unbinder = window.gEVBUS.on(gTrd.EV_GET_HISTORY_ORD_READY, arg => {
            that.initObj()
        })

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

        //添加监听交易登录
        if (this.EV_LOGIN_TRADE_unbinder) {
            this.EV_LOGIN_TRADE_unbinder()
        }
        this.EV_LOGIN_TRADE_unbinder = window.gEVBUS.on(gTrd.EV_LOGIN_TRADE, arg => {
            that.getHistoryOrd()
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
    initLanguage: function () {
        this.theadList = [
            {
                title: '交易对',//'',
                class: ""
            }, {
                title: '交易类型',//'',
                class: ""
            }, {
                title: '委托类型',//'',
                class: ""
            }, {
                title: '委托状态',//'',
                class: ""
            }, {
                title: '委托价格',//'',
                class: ""
            }, {
                title: '委托数量',//'',
                class: ""
            }, {
                title: '成交均价',//'',
                class: ""
            }, {
                title: '成交数量',//'',
                class: ""
            }, {
                title: '成交金额',//'',
                class: ""
            }, {
                title: '触发条件',//'',
                class: ""
            }, {
                title: '委托时间',//'',
                class: ""
            }
        ]
    },
    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_GET_HISTORY_ORD_READY_unbinder) {
            this.EV_GET_HISTORY_ORD_READY_unbinder()
        }
        if (this.EV_GET_HISTORY_TRD_READY_unbinder) {
            this.EV_GET_HISTORY_TRD_READY_unbinder()
        }

        if (this.EV_WEB_LOGOUT_unbinder) {
            this.EV_WEB_LOGOUT_unbinder()
        }

        //添加监听交易登录
        if (this.EV_LOGIN_TRADE_unbinder) {
            this.EV_LOGIN_TRADE_unbinder()
        }
        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
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
    initObj () {
        let Orders = window.gTrd.HistoryOrders['02']
        let posList = []
        for (let key in Orders) {
            let order = Orders[key]
            let obj = {}
            let ass = window.gMkt.AssetD[order.Sym]
            if (ass) {
                utils.copyTab(obj, order)

                let PrzMinIncSize = utils.getFloatSize(utils.getFullNum(ass.PrzMinInc || 6));
                let VolMinValSize = utils.getFloatSize(utils.getFullNum(ass.Mult || 2));
                //交易方向
                obj.DirStr = utils.getDirByStr(obj.Dir)
                //委托类型
                obj.OTypeStr = utils.getOtypeByStr(obj.OType, ass)
                // 委托状态 start
                if (obj.Status == 3 || obj.Status == 5) {
                    let status = obj.QtyF > 0 ? 10 : obj.Status
                    obj.StatusStr = utils.ordersStatusStr(status)
                } else if (obj.Status == 4 && obj.ErrCode) {
                    let status = obj.QtyF > 0 ? 10 : 5
                    obj.StatusStr = utils.ordersStatusStr(status)
                } else if (obj.Status == 4 && obj.QtyF == 0) {
                    obj.StatusStr = utils.ordersStatusStr(5)
                } else if ((obj.Status == 4 || obj.Status == 5) && (obj.QtyF > 0 && obj.QtyF < obj.Qty)) {
                    obj.StatusStr = utils.ordersStatusStr(10)
                } else {
                    obj.StatusStr = utils.ordersStatusStr(obj.Status)
                }
                // 委托状态 end

                //委托价格
                obj.Prz = Number(obj.Prz).toFixed2(PrzMinIncSize)
                //委托数量
                obj.Qty = Number(obj.Qty).toFixed2(VolMinValSize)
                // 成交均价
                obj.PrzF = Number(obj.PrzF || 0).toFixed2(PrzMinIncSize)
                //成交数量
                obj.QtyF = Number(obj.QtyF || 0).toFixed2(VolMinValSize)
                //成交金额
                obj.PrzM = Number(obj.QtyF * obj.PrzF).toFixed2(PrzMinIncSize)
                //触发条件
                if (obj.StopPrz) {
                    obj.cond = obj.StopBy == 2 ? gDI18n.$t('10070') : obj.StopBy == 1 ? gDI18n.$t('10046') : gDI18n.$t('10048')
                    // obj.cond = obj.StopBy == 2 ? '指数价' : obj.StopBy == 1 ? '最新价' : '标记价'
                    obj.cond += (obj.OrdFlag & 8) ? '≥' : '≤'
                    obj.cond += obj.StopPrz.toFixed2(PrzMinIncSize)
                } else {
                    obj.cond = '--'
                }
                //委托时间
                obj.AtStr = new Date(obj.At).format('MM/dd hh:mm:ss')

                // posList.push(obj)
                //根据按钮筛选数据
                if (window.$StopDropdownType == 1) {
                    posList.push(obj)
                } else {
                    let Sym = window.gMkt.CtxPlaying.Sym
                    if (obj.Sym == Sym) {
                        posList.push(obj)
                    }
                }
            }
        }
        posList.sort(function (a, b) {
            return b.At - a.At
        })
        this.posList = posList
        this.posListAll = JSON.parse(JSON.stringify(posList))
        // console.log(obj.posList,999999)
        m.redraw()
    },

    getTheadList: function () {
        return this.theadList.map(function (item, i) {
            return m("th", { key: "historyOrdtHeadItem" + i, class: " " + item.class }, [
                item.title
            ])
        })
    },
    //设置合约
    setSym (Sym) {
        window.gMkt.CtxPlaying.Sym = Sym // window 保存选中
        utils.setItem('goodsActiveSymbol', Sym)
        gEVBUS.emit(gMkt.EV_CHANGESYM_UPD, { Ev: gMkt.EV_CHANGESYM_UPD, Sym: Sym })
    },
    getPosList: function () {
        return this.posList.map(function (item, i) {
            return m("tr", { key: "historyOrdTableListItem" + i, class: " " }, [
                m("td", {
                    class: "cursor-pointer", onclick: function () {
                        obj.setSym(item.Sym)
                    }
                }, [
                    m("p", { class: " " }, [
                        utils.getSymDisplayName(window.gMkt.AssetD, item.Sym)
                    ])
                ]),
                m("td", { class: "" }, [
                    m("p", { class: " " }, [
                        item.DirStr
                    ]),
                ]),
                m("td", { class: " " + utils.getColorStr(item.Dir, 'font') }, [
                    item.OTypeStr
                ]),
                m("td", { class: " " }, [
                    item.StatusStr
                ]),
                m("td", { class: " " }, [
                    item.Prz
                ]),
                m("td", { class: " " }, [
                    item.Qty
                ]),
                m("td", { class: " " }, [
                    item.PrzF
                ]),
                m("td", { class: " " }, [
                    item.QtyF
                ]),
                m("td", { class: " " }, [
                    item.PrzM
                ]),
                m("td", { class: " " }, [
                    item.cond
                ]),
                m("td", { class: " " }, [
                    item.AtStr
                ])
            ])
        })
    },
    getHistoryOrd: function () {
        let that = this
        let s = window.gTrd
        let aType = '01'
        let Sym = window.gMkt.CtxPlaying.Sym
        let AssetD = window.gMkt.AssetD[Sym] || {}
        if (AssetD.TrdCls == 1) {
            aType = '02'
        } else {
            aType = '01'
        }
        let uid = s.RT["UserId"]
        let isReq = s.trdInfoStatus.historyOrd[aType]
        if (!uid || !s || isReq) return
        s.getHistoryOrdAndTrdAndWltlog({
            AId: uid + aType,
        })
    },

    //移动端历史成交列表
    getMobileList: function () {
        
        // m端page页面
        return m("div", { class: "" }, [
            // 头部
            m(Header, {
                onLeftClick () {
                    // obj.resetNavDrawerInfo()
                },
                onRightClick () {
                    obj.isShowModal = true
                    // obj.getContractList()
                },
                slot: {
                    center: gDI18n.$t('10077'/*"历史委托"*/),
                    right: m('i', { class: "iconfont icondaohang" })
                }
            }),
            
            //搜索框
            // obj.getSelectOptions(),

            // 列表
            m("div", { class: "pub-trade-list  pub-layout-m" }, [
                this.posList.length != 0 ? this.posList.map(function (item, i) {
                    // console.log(item, 9999999999999);
                    return m("div", { key: "historyOrdtHeadItem" + i, class: "card" }, [
                        m("div", { class: "card-content mobile-list" }, [
                            //顶部排列
                            m("header", { class: "" }, [
                                item.StatusStr == gDI18n.$t('10398'/*"全部成交"*/) ?
                                    m('a', {
                                        class: "theadList-transaction has-text-2", onclick: function () {
                                            let path = window.gMkt.CtxPlaying.pageTradeStatus == 1 ? "/details" : "/detailsGoods"
                                            router.push({
                                                path: path,
                                                data: item
                                            })
                                        }
                                    }, [
                                        m("p", { class: "theadList-transaction-p1 header-flex has-text-1" }, [
                                            utils.getSymDisplayName(window.gMkt.AssetD, item.Sym),
                                            m("p", { class: " padd-left theadList-transaction-p2 has-text-primary" }, [
                                                item.displayLever
                                            ]),
                                        ]),

                                        m("p", { class: "theadList-transaction-p2" + utils.getColorStr(item.Dir, 'font') }, [
                                            item.DirStr
                                        ]),
                                        m('p', { class: 'theadList-transaction-p2 has-text-primary', }, [
                                            item.StatusStr,
                                            m('i', { class: "iconfont iconarrow-right icon-font-size" })
                                        ])
                                    ]) :
                                    m('a', { class: "theadList-transaction has-text-2", }, [
                                        m("p", { class: "theadList-transaction-p1 header-flex" }, [
                                            utils.getSymDisplayName(window.gMkt.AssetD, item.Sym),
                                            m("p", { class: "padd-left theadList-transaction-p2 has-text-primary" }, [
                                                item.displayLever
                                            ]),
                                        ]),

                                        m("p", { class: "theadList-transaction-p2" + utils.getColorStr(item.Dir, 'font') }, [
                                            item.DirStr
                                        ]),
                                        m('p', { class: 'theadList-transaction-p2 has-text-grey', disabled: "disabled" }, [
                                            item.StatusStr
                                        ])
                                    ])

                            ]),
                            m("hr", { class: "is-primary" }),
                            //中间排列
                            m("div", { class: "" }, [
                                m("div", { class: "theadList-profit-loss" }, [
                                    m("div", { class: "theadList-profit-loss-p1 has-text-2" }, [
                                        gDI18n.$t('10065'),//"委托时间",
                                        m("p", { class: "has-text-2" }, [
                                            item.AtStr
                                        ])                                      
                                    ]),
                                    m("div", { class: "theadList-profit-loss-p1  has-text-2 has-text-centered"}, [
                                        gDI18n.$t('10058'),//"委托价格"
                                        m("p", { class: "has-text-2" }, [
                                            item.Prz
                                        ])                                      
                                    ]),
                                    m("div", { class: "theadList-profit-loss-p2 font-right has-text-2" }, [
                                        gDI18n.$t('10059'),//"委托数量",
                                        m("p", { class: "has-text-2" }, [
                                            item.Qty
                                        ])
                                    ]),
                                ]),
                                //平仓手续
                                m("div", { class: "theadList-profit-loss" }, [
                                    m("div", { class: "theadList-profit-loss-p2 has-text-2" }, [
                                        gDI18n.$t('10056'),//"委托类型" ,
                                        m("p", { class: "has-text-2" }, [
                                            item.OTypeStr
                                        ])                                      
                                    ]),
                                    m("div", { class: "theadList-profit-loss-p2 has-text-2 has-text-centered" }, [
                                        gDI18n.$t('10060'),//"成交均价",
                                        m("p", { class: "has-text-2" }, [
                                            item.PrzF
                                        ])                                      
                                    ]),
                                    m("div", { class: "theadList-profit-loss-p2 font-right has-text-2" }, [  
                                        gDI18n.$t('10061'),//"成交数量" ,
                                        m("p", { class: "has-text-2" }, [
                                            item.QtyF
                                        ])                                      
                                    ]),                            
                                ]),                        
                                // m("hr", { class: "is-primary" })
                            ]),
                            m("footer", { class: "theadList-profit-loss", }, [
                                m("div", { class: "theadList-profit-loss-p2 has-text-2 theadList-profit2" }, [
                                ]),
                                m("div", { class: "theadList-profit-loss-p2 has-text-2" }, [
                                    " ",
                                    m("p", { class: "has-text-2" }, [
                                        item.OrdFromStr
                                    ])
                                ]),
                                m("div", {
                                    class: "cursor-pointer theadList-profit-loss-p2 has-text-2 flex-right fomt-blacl" + (" historyOrdTableListItemCopy" + i), "data-clipboard-text": item.PId, onclick: function (e) {
                                        window.$copy(".historyOrdTableListItemCopy" + i)
                                        // obj.copyPid(item.PId)
                                    }
                                }, [
                                ]),
                            ]),
                        ])
                    ])
                }) : m("div", { class: "text-none has-text-2" }, [
                    m("i", { class: "iconfont iconbox", style: "font-size: 60px", }, [

                    ]),
                    gDI18n.$t('10463')//"暂无委托记录"
                ])
            ]),

            // 筛选模态框
            m(FilterModal, { 
                isShow: obj.isShowModal, // modal 开关
                allData: obj.posListAll, // 所有数据
                getNewData: newData => obj.posList = newData, // 过滤后的数据
                onClose: () => obj.isShowModal = false // 关闭事件
            })
        ])

    },
    getContent: function () {
        if (window.isMobile) {
            return obj.getMobileList()
        } else {
            let colgroup = m('colgroup', {}, [
                m('col', { name: "pub-table-1", width: 150 }),
                m('col', { name: "pub-table-2", width: 100 }),
                m('col', { name: "pub-table-3", width: 100 }),
                m('col', { name: "pub-table-4", width: 100 }),
                m('col', { name: "pub-table-5", width: 100 }),
                m('col', { name: "pub-table-6", width: 100 }),
                m('col', { name: "pub-table-7", width: 100 }),
                m('col', { name: "pub-table-8", width: 100 }),
                m('col', { name: "pub-table-9", width: 100 }),
                m('col', { name: "pub-table-10", width: 150 }),
                m('col', { name: "pub-table-11", width: 150 })
            ])
            return m('div', { class: " table-container" }, [
                m('div', { class: "pub-table-head-box", style: "width: 1250px" }, [
                    m("table", { class: "table is-hoverable ", width: '1250px', cellpadding: 0, cellspacing: 0 }, [
                        colgroup,
                        m("tr", { class: "" }, [
                            obj.getTheadList()
                        ])
                    ]),
                ]),
                m('div', { class: "pub-table-body-box", style: "width: 1250px" }, [
                    m("table", { class: "table is-hoverable ", width: '1250px', cellpadding: 0, cellspacing: 0 }, [
                        colgroup,
                        obj.getPosList()
                    ])
                ]),
            ])
        }
    },
}

export default {
    oninit: function (vnode) {
        obj.initLanguage()
    },
    oncreate: function (vnode) {
        obj.initEVBUS()
        obj.initObj()
        obj.getHistoryOrd()
    },
    view: function (vnode) {

        return m("div", { class: "pub-history-order" }, [
            obj.getContent()
        ])
    },
    onremove: function () {
        obj.rmEVBUS()
    }
}