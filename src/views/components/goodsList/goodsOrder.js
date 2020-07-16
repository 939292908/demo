import utils from "../../../utils/utils"

var m = require("mithril")

let obj = {
    posList:[],
    theadList: [
        {
            title: '交易对', //'',
            class: ""
        }, {
            title: '交易类型', //'',
            class: ""
        }, {
            title: '委托类型', //'',
            class: ""
        }, {
            title: '委托价格', //'',
            class: ""
        }, {
            title: '委托数量', //'',
            class: ""
        }, {
            title: '成交均价', //'',
            class: ""
        }, {
            title: '成交数量', //'',
            class: ""
        }, {
            title: '触发条件', //'',
            class: ""
        },{
            title: '委托时间',
            class: ""
        },{
            title: '',
            class: ""
        }
    ],
    //初始化全局广播
    initEVBUS:function(){
        let that = this

        if (this.EV_GET_ORD_READY_unbinder) {
            this.EV_GET_ORD_READY_unbinder()
        }
        this.EV_GET_ORD_READY_unbinder = window.gEVBUS.on(gTrd.EV_GET_ORD_READY, arg => {
            console.log('EV_GET_ORD_READY==>>>', arg)
            that.initObj()
        })

        if (this.EV_ORD_UPD_unbinder) {
            this.EV_ORD_UPD_unbinder()
        }
        this.EV_ORD_UPD_unbinder = window.gEVBUS.on(gTrd.EV_ORD_UPD, arg => {
            that.initObj()
        })
        
        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD, arg => {
            that.initLanguage()
        })

        //assetD合约详情全局广播
        if (this.EV_ASSETD_UPD_unbinder) {
            this.EV_ASSETD_UPD_unbinder()
        }
        this.EV_ASSETD_UPD_unbinder = window.gEVBUS.on(gMkt.EV_ASSETD_UPD, arg => {
            that.initObj()
        })

        //退出登录
        if (this.EV_WEB_LOGOUT_unbinder) {
            this.EV_WEB_LOGOUT_unbinder()
        }
        this.EV_WEB_LOGOUT_unbinder = window.gEVBUS.on(gWebAPI.EV_WEB_LOGOUT, arg => {
            that.initObj()
        })

        //仓位选择筛选
        if (this.EV_DROPDOWN_UP_unbinder) {
            this.EV_DROPDOWN_UP_unbinder()
        }
        this.EV_DROPDOWN_UP_unbinder = window.gEVBUS.on(gEVBUS.EV_DROPDOWN_UP, arg => {
            // obj.dropdownType = arg.data.item.xx
            obj.initObj()
        })
    },

    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_GET_ORD_READY_unbinder) {
            this.EV_GET_ORD_READY_unbinder()
        }
        if (this.EV_ORD_UPD_unbinder) {
            this.EV_ORD_UPD_unbinder()
        }
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
        if (this.EV_ASSETD_UPD_unbinder) {
            this.EV_ASSETD_UPD_unbinder()
        }
        if (this.EV_WEB_LOGOUT_unbinder) {
            this.EV_WEB_LOGOUT_unbinder()
        }
    },
    initLanguage:function(){
        this.theadList = [
            {
                title: '交易对', //'',
                class: ""
            }, {
                title: '交易类型', //'',
                class: ""
            }, {
                title: '委托类型', //'',
                class: ""
            }, {
                title: '委托价格', //'',
                class: ""
            }, {
                title: '委托数量', //'',
                class: ""
            }, {
                title: '成交均价', //'',
                class: ""
            }, {
                title: '成交数量', //'',
                class: ""
            }, {
                title: '触发条件', //'',
                class: ""
            },  {
                title: '委托时间',
                class: ""
            }, {
                title: '',
                class: ""
            }
        ]
    },
    initObj(){
        let Orders = window.gTrd.Orders['02']
        let posList = []
        for(let key in Orders){
            let order = Orders[key]
            let obj = {}
            let ass = window.gMkt.AssetD[order.Sym]
            //当前委托只显示OType为1的委托单
            if(ass && (order.OType == 1)){
                utils.copyTab(obj,order)
                let PrzMinIncSize = utils.getFloatSize(utils.getFullNum(ass.PrzMinInc || 6));
                let VolMinValSize = utils.getFloatSize(utils.getFullNum(ass.Mult || 2));

                //委托时间
                obj.AtStr = new Date(obj.At).format('MM/dd hh:mm:ss')
                //交易方向
                obj.DirStr = utils.getDirByStr(obj.Dir)
                //委托类型
                obj.OTypeStr = utils.getOtypeByStr(obj.OType, ass)
                //委托价格
                obj.displayPrz = Number(obj.Prz).toFixed2(PrzMinIncSize)
                // 成交均价
                obj.PrzF = Number(obj.PrzF || 0).toFixed2(PrzMinIncSize)
                //委托数量
                obj.Qty = Number(obj.Qty).toFixed2(VolMinValSize)
                //成交数量
                obj.QtyF = Number(obj.QtyF).toFixed2(VolMinValSize)
                //触发条件
                if (obj.StopPrz) {
                    obj.cond = obj.StopBy == 2 ? gDI18n.$t('10070') : obj.StopBy == 1 ? gDI18n.$t('10046') : gDI18n.$t('10048')
                    // obj.cond = obj.StopBy == 2 ? '指数价' : obj.StopBy == 1 ? '最新价' : '标记价'
                    obj.cond += (obj.OrdFlag & 8) ? '≥' : '≤'
                    obj.cond += obj.StopPrz.toFixed2(PrzMinIncSize)
                } else {
                    obj.cond = '--'
                }
                
                posList.push(obj)
            }
        }

        this.posList = posList

    },
    delOrder: function (param) {
        param.loading = true
        gTrd.ReqTrdOrderDel({
            "AId": param.AId,
            "OrdId": param.OrdId,
            "Sym": param.Sym,
            "PId": param.PId,
        }, function (gTrd, arg) {
            if (arg.code != 0 || arg.data.ErrCode) {
                param.loading = false
                window.$message({ title: gDI18n.$t('10037'/*"提示"*/), content: utils.getTradeErrorCode(arg.code || arg.data.ErrCode), type: 'danger' })
            } else {
                param.loading = false
            }
        })
    },
    //设置合约
    setSym(Sym) {
        window.gMkt.CtxPlaying.Sym = Sym // window 保存选中
        utils.setItem('goodsActiveSymbol', Sym)
        gEVBUS.emit(gMkt.EV_CHANGESYM_UPD, { Ev: gMkt.EV_CHANGESYM_UPD, Sym: Sym })
    },
    getOrdList: function () {
        return this.posList.map(function (item, i) {
            return m("tr", {
                key: "orderTableListItem" + i,
                class: ""
            }, [
                m("td", {class: "table-tr-td-vertical cursor-pointer",onclick:function(){
                    obj.setSym(item.Sym)
                }}, [
                    m("p", {class: " "}, [
                        utils.getSymDisplayName(window.gMkt.AssetD, item.Sym)
                    ])
                ]),
                m("td", {class: " table-tr-td-vertical" + utils.getColorStr(item.Dir, 'font')}, [
                    item.DirStr
                ]),
                m("td", {class: " table-tr-td-vertical"}, [
                    item.OTypeStr
                ]),
                m("td", {class: " table-tr-td-vertical"}, [
                    item.displayPrz
                ]),
                m("td", {class: " table-tr-td-vertical"}, [
                    item.Qty
                ]),
                m("td", {class: " table-tr-td-vertical"}, [
                    item.PrzF
                ]),
                m("td", {class: " table-tr-td-vertical"}, [
                    item.QtyF
                ]),
                m("td", {class: "table-tr-td-vertical"}, [
                    item.cond
                ]),
                m("td", {class: "table-tr-td-vertical"}, [
                    item.AtStr
                ]),
                m("td", {class: "table-tr-td-vertical"}, [
                    m("button", {class: "button is-primary " + (item.loading ? ' is-loading' : ''),onclick: function () {
                            obj.delOrder(item)
                        }
                    }, [
                        gDI18n.$t('10082') //'撤单'
                    ])
                ])
            ])
        })
    },

    getTheadList: function () {
        return this.theadList.map(function (item, i) {
            return m("th", { key: "ordertHeadItem" + i, class: "" + item.class }, [
                item.title
            ])
        })
    },
    //渲染主体
    getContent: function () {
        if (window.isMobile) {
            return null
        } else {
            let colgroup = m('colgroup', {}, [
                m('col', { name: "pub-table-1", width: 160 }),
                m('col', { name: "pub-table-2", width: 100 }),
                m('col', { name: "pub-table-3", width: 100 }),
                m('col', { name: "pub-table-4", width: 100 }),
                m('col', { name: "pub-table-5", width: 100 }),
                m('col', { name: "pub-table-6", width: 100 }),
                m('col', { name: "pub-table-7", width: 100 }),
                m('col', { name: "pub-table-8", width: 150 }),
                m('col', { name: "pub-table-9", width: 150 }),
                m('col', { name: "pub-table-10", width: 100 }),
            ])
            return m('div', { class: " table-container" }, [
                m('div', { class: "pub-table-head-box", style: "width: 1160px" }, [
                    m("table", { class: "table is-hoverable ", width: '1160px', cellpadding: 0, cellspacing: 0 }, [
                        colgroup,
                        m("tr", { class: "" }, [
                            obj.getTheadList()
                        ])
                    ]),
                ]),
                m('div', { class: "pub-table-body-box", style: "width: 1160px" }, [
                    m("table", { class: "table is-hoverable ", width: '1160px', cellpadding: 0, cellspacing: 0 }, [
                        colgroup,
                        obj.getOrdList()
                    ])
                ]),
            ])
        }
    }
}

export default {
    oninit: function (vnode) {
        obj.initLanguage()
    },
    oncreate: function (vnode) {
        obj.initEVBUS()
        obj.initObj()
    },
    view: function (vnode) {

        return m("div", { class: "pub-order" }, [
            obj.getContent()
        ])
    },
    onremove: function () {
        obj.rmEVBUS()
    }
}