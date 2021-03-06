var m = require("mithril")

let obj = {
    posList: [],
    theadList: [
        {
            title: '全撤',
            class: ""
        }, {
            title: gDI18n.$t('10053'),//'合约',
            class: ""
        }, {
            title: gDI18n.$t('10055'),//'交易类型',
            class: ""
        }, {
            title: gDI18n.$t('10056'),//'委托类型',
            class: ""
        }, {
            title: gDI18n.$t('10061'),//'成交数量',
            class: ""
        }, {
            title: gDI18n.$t('10060'),//'成交均价',
            class: ""
        }, {
            title: gDI18n.$t('10059'),//'委托数量',
            class: ""
        }, {
            title: gDI18n.$t('10058'),//'委托价格',
            class: ""
        }, {
            title: gDI18n.$t('10080') + "/" +gDI18n.$t('10101'),//'止盈/止损',
            class: ""
        },
        //  {
        //     title: gDI18n.$t('10064'),//'触发条件',
        //     class: ""
        // }, 
        {
            title: gDI18n.$t('10065'),//'委托时间',
            class: ""
        },{
            title: gDI18n.$t('10067'),//'仓位ID',
            class: ""
        },
        
    ],
    //初始化全局广播
    initEVBUS: function () {
        let that = this

        if (this.EV_GET_ORD_READY_unbinder) {
            this.EV_GET_ORD_READY_unbinder()
        }
        this.EV_GET_ORD_READY_unbinder = window.gEVBUS.on(gTrd.EV_GET_ORD_READY, arg => {
            console.log('EV_GET_ORD_READY==>>>', arg)
            that.initObj()
            that.subPosNeedSymTick()

        })

        if (this.EV_ORD_UPD_unbinder) {
            this.EV_ORD_UPD_unbinder()
        }
        this.EV_ORD_UPD_unbinder = window.gEVBUS.on(gTrd.EV_ORD_UPD, arg => {
            that.initObj()
            that.subPosNeedSymTick()
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
            // console.log(obj.dropdownType, "筛选类型")
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
                title: '全撤',
                class: ""
            }, {
                title: gDI18n.$t('10053'),//'合约',
                class: ""
            }, {
                title: gDI18n.$t('10055'),//'交易类型',
                class: ""
            }, {
                title: gDI18n.$t('10056'),//'委托类型',
                class: ""
            }, {
                title: gDI18n.$t('10061'),//'成交数量',
                class: ""
            }, {
                title: gDI18n.$t('10060'),//'成交均价',
                class: ""
            }, {
                title: gDI18n.$t('10059'),//'委托数量',
                class: ""
            }, {
                title: gDI18n.$t('10058'),//'委托价格',
                class: ""
            }, {
                title: gDI18n.$t('10080') + "/" +gDI18n.$t('10101'),//'止盈/止损',
                class: ""
            }, 
            // {
            //     title: gDI18n.$t('10064'),//'触发条件',
            //     class: ""
            // }, 
            {
                title: gDI18n.$t('10065'),//'委托时间',
                class: ""
            }, {
                title: gDI18n.$t('10067'),//'仓位ID',
                class: ""
            },
            
        ]
    },
    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_GET_ORD_READY_unbinder) {
            this.EV_GET_ORD_READY_unbinder()
        }
        if (this.EV_ORD_UPD_unbinder) {
            this.EV_ORD_UPD_unbinder()
        }
        if (this.EV_ASSETD_UPD_unbinder) {
            this.EV_ASSETD_UPD_unbinder()
        }
        if (this.EV_WEB_LOGOUT_unbinder) {
            this.EV_WEB_LOGOUT_unbinder()
        }
        if (this.EV_DROPDOWN_UP_unbinder) {
            this.EV_DROPDOWN_UP_unbinder()
        }
        if (this.EV_CHANGESYM_UPD_unbinder) {
            this.EV_CHANGESYM_UPD_unbinder()
        }
    },
    initObj() {
        let Orders = window.gTrd.Orders['01']
        let posList = []
        for (let key in Orders) {
            let order = Orders[key]
            let obj = {}
            let ass = window.gMkt.AssetD[order.Sym]
            //当前委托只显示OType为1、2的委托单
            if (ass && (order.OType == 1 || order.OType == 2)) {
                utils.copyTab(obj, order)

                let PrzMinIncSize = utils.getFloatSize(utils.getFullNum(ass.PrzMinInc || 6));
                let VolMinValSize = utils.getFloatSize(ass.Mult || 2);

                let pos = window.gTrd.Poss[obj.PId]

                //杠杆
                if (ass.MIR) {
                    let lvr = obj.Lvr || (pos && pos.Lever) || 0
                    let maxLever = Number(1 / Math.max(ass.MIR || 0, obj.MIRMy || 0)).toFixed2(0)
                    obj.displayLever = lvr == 0 ? gDI18n.$t('10068',{value : maxLever}) : gDI18n.$t('10069',{value : Number(lvr || 0).toFixed2(0)})
                    // obj.displayLever = lvr == 0 ? '全仓' + maxLever + 'X' : '逐仓' + Number(lvr || 0).toFixed2(2) + 'X'
                } else {
                    obj.displayLever = '--'
                }

                obj.DirStr = utils.getDirByStr(obj.Dir)

                obj.OTypeStr = utils.getOtypeByStr(obj.OType, ass)

                //委托价格
                if (obj.OType == 2 || obj.OType == 4) {
                    obj.displayPrz = gDI18n.$t('10081')//'市价'
                } else {
                    obj.displayPrz = Number(obj.Prz).toFixed2(PrzMinIncSize)
                }
                // 成交均价
                obj.PrzF = Number(obj.PrzF || 0).toFixed2(PrzMinIncSize)
                //委托数量
                obj.Qty = Number(obj.Qty).toFixed2(VolMinValSize)
                //委托数量
                obj.QtyF = Number(obj.QtyF).toFixed2(VolMinValSize)

                if (obj.StopPrz) {
                    obj.cond = obj.StopBy == 2 ? gDI18n.$t('10070') : obj.StopBy == 1 ? gDI18n.$t('10046') : gDI18n.$t('10048')
                    // obj.cond = obj.StopBy == 2 ? '指数价' : obj.StopBy == 1 ? '最新价' : '标记价'
                    obj.cond += (obj.OrdFlag & 8) ? '≥' : '≤'
                    obj.cond += obj.StopPrz.toFixed2(PrzMinIncSize)
                } else {
                    obj.cond = '--'
                }

                obj.AtStr = new Date(obj.At).format('MM/dd hh:mm:ss'),


                    //止盈价
                    obj.StopP = obj.StopP ? Number(obj.StopP || 0).toFixed2(PrzMinIncSize) : '--'
                //止损价
                obj.StopL = obj.StopL ? Number(obj.StopL || 0).toFixed2(PrzMinIncSize) : '--'

                obj.loading = false

                if (window.$dropdownType == 1) {
                    posList.push(obj)
                } else {
                    let Sym = window.gMkt.CtxPlaying.Sym
                    if (obj.Sym == Sym) {
                        posList.push(obj)
                    }
                }
            }

        }
        this.posList = posList
    },

    //全撤
    CloseOrd:function(){
        if(this.posList.length > 0){
            gEVBUS.emit(gEVBUS.EV_ALL_CLOSE_LIST_UPD, { Ev: gEVBUS.EV_ALL_CLOSE_LIST_UPD ,data:{type :1 , posList : this.posList}})
        } 
    },

    getTheadList: function () {
        return this.theadList.map(function (item, i) {
            return m("th", { key: "ordertHeadItem" + i, class: "" + item.class  + (i == 0 ? " cursor-pointer" : ""),onclick:function(){
                if(i == 0){
                  obj.CloseOrd()
                }
              }}, [
                item.title
            ])
        })
    },
    //设置合约
    setSym(Sym, toUrl = true) {
        window.gMkt.CtxPlaying.Sym = Sym // window 保存选中
        utils.setItem('futureActiveSymbol', Sym)
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
    getOrdList: function () {
        return this.posList.map(function (item, i) {
            return m("tr", { key: "orderTableListItem" + i, class: "" }, [
                m("td", { class: "table-tr-td-vertical" }, [
                    m("button", {
                        class: "button is-primary " + (item.loading ? ' is-loading' : ''),
                        onclick: function () {
                            obj.delOrder(item)
                        }
                    }, [
                        gDI18n.$t('10082')//'撤单'
                    ])
                ]),
                m("td", { class: "table-tr-td-vertical cursor-pointer" ,onclick :function(){
                    obj.setSym(item.Sym)
                }}, [
                    m("span", { class: "table-tr-td-pr " }, [
                        utils.getSymDisplayName(window.gMkt.AssetD, item.Sym)
                    ]),
                    m("span", { class: " " }, [
                        item.displayLever
                    ]),
                ]),
                // m("td", { class: "table-tr-td-vertical" }, [
                    
                // ]),
                m("td", { class: " table-tr-td-vertical" + utils.getColorStr(item.Dir, 'font') }, [
                    item.DirStr
                ]),
                m("td", { class: " table-tr-td-vertical" }, [
                    item.OTypeStr
                ]),
                m("td", { class: " table-tr-td-vertical" }, [
                    item.QtyF
                ]),
                m("td", { class: " table-tr-td-vertical" }, [
                    item.PrzF
                ]),
                m("td", { class: " table-tr-td-vertical" }, [
                    item.Qty
                ]),
                m("td", { class: " table-tr-td-vertical" }, [
                    item.displayPrz
                ]),
                m("td", { class: "table-tr-td-vertical" }, [
                    (item.StopP || '--') + '/' + (item.StopL || '--')
                ]),
                // m("td", { class: "table-tr-td-vertical" }, [
                //     item.cond
                // ]),
                m("td", { class: "table-tr-td-vertical" }, [
                    item.AtStr
                ]),
                m("td", { class: " table-tr-td-vertical" }, [
                    item.PId ? item.PId.substr(-4) : '--'
                ]),
                
            ])
        })
    },
    getOrdListForM: function () {
        return this.posList.map(function (item, i) {
            return m('.card', { key: "orderTableListItemForM" + i }, [
                m('div', { class: 'card-content' }, [
                    m('div', { class: "pub-order-m-content-header" }, [
                        m('span', { class: "" }, [
                            utils.getSymDisplayName(window.gMkt.AssetD, item.Sym)
                        ]),
                        m('div', { class: "pub-order-change-lever" + utils.getColorStr(item.Sz > 0 ? 1 : -1, 'font') }, [
                            m('span', {}, [
                                item.displayLever,
                            ]),
                        ]),
                        m('.spacer'),
                        m('p', { class: '' }, [
                            gDI18n.$t('10067',/*'仓位ID: '*/) + item.PId.substr(-4)
                        ]),
                    ]),
                    m('div', { class: 'pub-order-m-content content is-flex' }, [
                        m('div', {}, [
                            m('p', {}, [
                                gDI18n.$t('10083')//'成交/委托数量'
                            ]),
                            m('p', {}, [
                                item.QtyF + '/' + item.Qty
                            ]),
                        ]),
                        m('.spacer'),
                        m('div', {}, [
                            m('p', {}, [
                                gDI18n.$t('10084')//'成交/委托价格'
                            ]),
                            m('p', {}, [
                                item.PrzF + '/' + item.Prz
                            ]),
                        ]),
                        m('.spacer'),
                        m('div', { class: "has-text-right" }, [
                            m('p', {}, [
                                gDI18n.$t('10064')//'触发条件'
                            ]),
                            m('p', { class: "" + utils.getColorStr(item.UPNLColor, 'font') }, [
                                item.cond
                            ]),
                        ]),
                    ]),
                    m('div', { class: "pub-order-m-content-footer" }, [
                        m('span', { class: "" }, [
                            item.AtStr
                        ]),
                        m('.spacer'),
                        m("button", {
                            class: "button is-primary is-small" + (item.loading ? ' is-loading' : ''),
                            onclick: function () {
                                obj.delOrder(item)
                            }
                        }, [
                            gDI18n.$t('10082')//'撤单'
                        ])
                    ]),
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
            window.gMkt.TpcAddArr(needSub)
        }
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
    getContent: function () {
        if (window.isMobile) {
            return obj.getOrdListForM()
        } else {
            let colgroup = m('colgroup', {}, [
                m('col', { name: "pub-table-1", width: 100 }),
                m('col', { name: "pub-table-2", width: 220 }),
                m('col', { name: "pub-table-3", width: 100 }),
                m('col', { name: "pub-table-4", width: 100 }),
                m('col', { name: "pub-table-5", width: 100 }),
                m('col', { name: "pub-table-6", width: 100 }),
                m('col', { name: "pub-table-7", width: 100 }),
                m('col', { name: "pub-table-8", width: 100 }),
                m('col', { name: "pub-table-9", width: 150 }),
                // m('col', { name: "pub-table-11", width: 150 }),
                m('col', { name: "pub-table-10", width: 150 }),
                m('col', { name: "pub-table-11", width: 70 }),
                
            ])
            return m('div', { class: " table-container" }, [
                m('div', { class: `pub-table-head-box ${window.gWebAPI.isLogin() ? '' : 'is-hidden'}`, style: "width: 1290px" }, [
                    m("table", { class: "table is-hoverable ", width: '1290px', cellpadding: 0, cellspacing: 0 }, [
                        colgroup,
                        m("tr", { class: "" }, [
                            obj.getTheadList()
                        ])
                    ]),
                ]),
                m('div', { class: "pub-table-body-box", style: "width: 1290px" }, [
                    m("table", { class: "table is-hoverable ", width: '1290px', cellpadding: 0, cellspacing: 0 }, [
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