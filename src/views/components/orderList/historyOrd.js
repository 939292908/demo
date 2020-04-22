var m = require("mithril")

let obj = {
    posList: [],
    theadList: [
        {
            title: '仓位ID',
            class: ""
        }, {
            title: '合约',
            class: ""
        }, {
            title: '杠杆',
            class: ""
        }, {
            title: '交易类型',
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
            title: '触发条件',
            class: ""
        }, {
            title: '委托时间',
            class: ""
        }
    ],
    //初始化全局广播
    initEVBUS: function () {
        let that = this

        // if (this.EV_WLT_POS_ORDER_UPD_unbinder) {
        //     this.EV_WLT_POS_ORDER_UPD_unbinder()
        // }
        // this.EV_WLT_POS_ORDER_UPD_unbinder = window.gEVBUS.on(gTrd.EV_WLT_POS_ORDER_UPD, arg => {
        //     that.initObj()
        //     that.subPosNeedSymTick()

        // })


    },
    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_WLT_POS_ORDER_UPD_unbinder) {
            this.EV_WLT_POS_ORDER_UPD_unbinder()
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

                if(obj.StopPrz){
                    obj.cond = obj.StopBy==2?'指数价':obj.StopBy==1?'最新价':'标记价'
                    obj.cond += (obj.OrdFlag&8)?'≥':'≤'
                    obj.cond += obj.StopPrz.toFixed2(PrzMinIncSize)
                }else{
                    obj.cond = '--'
                }

                obj.AtStr = new Date(obj.At).format('MM/dd hh:mm:ss'),


                //止盈价
                obj.StopP = obj.StopP ? Number(obj.StopP || 0).toFixed2(PrzMinIncSize) : '--'
                //止损价
                obj.StopL = obj.StopL ? Number(obj.StopL || 0).toFixed2(PrzMinIncSize) : '--'

                posList.push(obj)
            }

        }
        posList.sort(function(a,b){
            return b.At - a.At
        })
        this.posList = posList
    },

    getTheadList: function () {
        return this.theadList.map(function (item, i) {
            return m("th", { key: "historyOrdtHeadItem" + i, class: ""+item.class }, [
                item.title
            ])
        })
    },
    getPosList: function () {
        return this.posList.map(function (item, i) {
            return m("tr", { key: "historyOrdTableListItem" + i, class: "" }, [
                m("td", { class: " " }, [
                    item.PId.substr(-4)
                ]),
                m("td", { class: "" }, [
                    m("p", { class: " " }, [
                        utils.getSymDisplayName(window.gMkt.AssetD, item.Sym)
                    ])
                ]),
                m("td", { class: "" }, [
                    m("p", { class: " "}, [
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
                    item.Prz
                ]),
                m("td", { class: " " }, [
                    item.Qty
                ]),
                m("td", { class: " "}, [
                    item.PrzF
                ]),
                m("td", { class: " "}, [
                    item.QtyF
                ]),
                m("td", { class: "" }, [
                    item.cond
                ]),
                m("td", { class: "" }, [
                    item.AtStr
                ])
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
    getHistoryOrd: function(){
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
        let isReq = s.trdInfoStatus.historyOrd[aType]
        if(!uid || !s || isReq) return
        s.ReqTrdGetHistOrders({
            AId: uid+aType,
        }, function(aTrd, aArg){
            if(aArg.code == 0){
                s.trdInfoStatus.historyOrd[aType] = 1
                s.HistoryOrders[aType] = aArg.data
                that.initObj()
            }
        })
    }
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

        return m("div", { class: "pub-history-order table-container " }, [
            m("table", { class: "table is-hoverable ", cellpadding: 0, cellspacing: 0 }, [
                m("thead", { class: "" }, [
                    m("tr", { class: "" }, [
                        obj.getTheadList()
                    ])
                ]),
                m("tbody", { class: "" }, [
                    obj.getPosList()
                ])
            ])
        ])
    },
    onremove: function () {
        obj.rmEVBUS()
    }
}