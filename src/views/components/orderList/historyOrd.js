var m = require("mithril")

let obj = {
    posList: [],
    theadList: [
        {
            title: '合约',
            class: ""
        }, {
            title: '杠杆',
            class: ""
        }, {
            title: '交易类型',
            class: ""
        }, {
            title: '状态',
            class: ""
        }, {
            title: '委托类型',
            class: ""
        }, {
            title: '委托价格',
            class: ""
        }, {
            title: '委托数量',
            class: ""
        }, {
            title: '成交均价',
            class: ""
        }, {
            title: '成交数量',
            class: ""
        }, {
            title: '平仓盈亏',
            class: ""
        }, {
            title: '手续费',
            class: ""
        }, {
            title: '触发条件',
            class: ""
        }, {
            title: '委托时间',
            class: ""
        }, {
            title: '委托来源',
            class: ""
        }, {
            title: '仓位ID',
            class: ""
        }, 
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
    },
    initObj() {
        let Orders = window.gTrd.HistoryOrders['01']
        let posList = []
        for (let key in Orders) {
            let order = Orders[key]
            let obj = {}
            let ass = window.gMkt.AssetD[order.Sym]
            if (ass) {
                utils.copyTab(obj, order)

                let PrzMinIncSize = utils.getFloatSize(utils.getFullNum(ass.PrzMinInc || 6));
                let VolMinValSize = utils.getFloatSize(ass.Mult || 2);

                let pos = window.gTrd.Poss[obj.PId] || {}

                //杠杆
                if (ass.MIR) {
                    let lvr = obj.Lvr || pos.Lever || 0
                    let maxLever = Number(1 / Math.max(ass.MIR || 0, obj.MIRMy || 0)).toFixed2(2)
                    obj.displayLever = lvr == 0 ? '全仓' + maxLever + 'X' : '逐仓' + Number(lvr || 0).toFixed2(2) + 'X'
                } else {
                    obj.displayLever = '--'
                }

                obj.DirStr = utils.getDirByStr(obj.Dir)

                obj.OTypeStr = utils.getOtypeByStr(obj.OType, ass)

                //委托价格
                obj.Prz = Number(obj.Prz).toFixed2(PrzMinIncSize)
                // 成交均价
                obj.PrzF = Number(obj.PrzF || 0).toFixed2(PrzMinIncSize)
                //委托数量
                obj.Qty = Number(obj.Qty).toFixed2(VolMinValSize)
                //成交数量
                obj.QtyF = Number(obj.QtyF || 0).toFixed2(VolMinValSize)

                if (obj.StopPrz) {
                    obj.cond = obj.StopBy == 2 ? '指数价' : obj.StopBy == 1 ? '最新价' : '标记价'
                    obj.cond += (obj.OrdFlag & 8) ? '≥' : '≤'
                    obj.cond += obj.StopPrz.toFixed2(PrzMinIncSize)
                } else {
                    obj.cond = '--'
                }
                
                // 委托状态 start
                if (obj.Status ==3 || obj.Status ==5 ) {
                    let status= obj.QtyF>0? 10: obj.Status
                    obj.StatusStr =  utils.ordersStatusStr(status)
                }   else if (obj.Status ==4 && obj.ErrCode) {
                    let status= obj.QtyF>0? 10: 5
                    obj.StatusStr =  utils.ordersStatusStr(status)
                }else if (obj.Status ==4 && obj.QtyF==0) {
                    obj.StatusStr =  utils.ordersStatusStr(5)
                }else if((obj.Status == 4 || obj.Status == 5) && (obj.QtyF>0&&obj.QtyF<obj.Qty)){
                    obj.StatusStr =  utils.ordersStatusStr(10)
                } else{
                    obj.StatusStr =  utils.ordersStatusStr(obj.Status)
                } 
                // 委托状态 end

                // 委托来源
                obj.OrdFromStr = utils.getOrderFrom(obj.Via)

                // 平仓盈亏
                obj.PnlCls = 0
                // 手续费
                obj.Fee = 0
                obj.FeeCoin = ''
                // 从成交记录里边累计委托对应的盈亏以及手续费 start
                let trades = window.gTrd.MyTrades_Obj['01'][obj.OrdId] || []
                for(let item of trades){
                    obj.PnlCls += Number(item.PnlCls || 0)
                    obj.Fee += Number(item.Fee || 0)
                    obj.FeeCoin = item.FeeCoin
                }

                obj.PnlCls = obj.PnlCls.toFixed2(8)
                obj.Fee = obj.Fee.toFixed2(8)
                // 从成交记录里边累计委托对应的盈亏以及手续费 end

                obj.AtStr = new Date(obj.At).format('MM/dd hh:mm:ss'),


                //止盈价
                obj.StopP = obj.StopP ? Number(obj.StopP || 0).toFixed2(PrzMinIncSize) : '--'
                //止损价
                obj.StopL = obj.StopL ? Number(obj.StopL || 0).toFixed2(PrzMinIncSize) : '--'

                posList.push(obj)
            }

        }
        posList.sort(function (a, b) {
            return b.At - a.At
        })
        this.posList = posList
    },

    getTheadList: function () {
        return this.theadList.map(function (item, i) {
            return m("th", { key: "historyOrdtHeadItem" + i, class: "" + item.class }, [
                item.title
            ])
        })
    },
    getPosList: function () {
        return this.posList.map(function (item, i) {
            return m("tr", { key: "historyOrdTableListItem" + i, class: "" }, [
                m("td", { class: "" }, [
                    m("p", { class: " " }, [
                        utils.getSymDisplayName(window.gMkt.AssetD, item.Sym)
                    ])
                ]),
                m("td", { class: "" }, [
                    m("p", { class: " " }, [
                        item.displayLever
                    ]),
                ]),
                m("td", { class: " " + utils.getColorStr(item.Dir, 'font') }, [
                    item.DirStr
                ]),
                m("td", { class: " " }, [
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
                    item.PnlCls
                ]),
                m("td", { class: " " }, [
                    item.Fee,
                    ' ',
                    item.FeeCoin
                ]),
                m("td", { class: "" }, [
                    item.cond
                ]),
                m("td", { class: "" }, [
                    item.AtStr
                ]),
                m("td", { class: "" }, [
                    item.OrdFromStr
                ]),
                m("td",{class:"cursor-pointer"+(" historyOrdTableListItemCopy"+i), "data-clipboard-text": item.PId, onclick: function(e){
                    window.$copy(".historyOrdTableListItemCopy"+i)
                }},[
                    item.PId.substr(-4),
                    ' ',
                    m("i",{class:"iconfont iconcopy"}),
                ]),
            ])
        })
    },
    subPosNeedSymTick: function () {
        let oldSubList = window.gMkt.CtxPlaying.subList
        let needSub = []
        for (let key in window.gTrd.Poss) {
            let pos = window.gTrd.Poss[key]
            let str = 'tick_' + pos.Sym
            if (pos.Sz != 0 && !oldSubList.includes(str)) {
                needSub.push(str)
            }
        }
        if (needSub.length > 0) {
            window.gMkt.ReqSub(needSub)
        }
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
    getContent: function () {
        if (window.isMobile) {
            return null
        } else {
            let colgroup = m('colgroup', {}, [
                m('col', { name: "pub-table-2", width: 160 }),
                m('col', { name: "pub-table-3", width: 130 }),
                m('col', { name: "pub-table-4", width: 80 }),
                m('col', { name: "pub-table-5", width: 80 }),
                m('col', { name: "pub-table-5", width: 80 }),
                m('col', { name: "pub-table-6", width: 100 }),
                m('col', { name: "pub-table-7", width: 100 }),
                m('col', { name: "pub-table-8", width: 100 }),
                m('col', { name: "pub-table-9", width: 100 }),
                m('col', { name: "pub-table-9", width: 150 }),
                m('col', { name: "pub-table-9", width: 150 }),
                m('col', { name: "pub-table-10", width: 150 }),
                m('col', { name: "pub-table-10", width: 150 }),
                m('col', { name: "pub-table-9", width: 100 }),
                m('col', { name: "pub-table-1", width: 100 }),
            ])
            return m('div', { class: " table-container" }, [
                m("table", { class: "table is-hoverable ", width: '1730px', cellpadding: 0, cellspacing: 0 }, [
                    colgroup,
                    m("tr", { class: "" }, [
                        obj.getTheadList()
                    ])
                ]),
                m('div', { class: "pub-table-body-box", style: "width: 1730px" }, [
                    m("table", { class: "table is-hoverable ", width: '1730px', cellpadding: 0, cellspacing: 0 }, [
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
    onbeforeremove: function () {
        obj.rmEVBUS()
    }
}