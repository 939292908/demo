var m = require("mithril")

let obj = {
    posList: [],
    theadList: [
        {
            title: '操作', //'',
            class: ""
        }, {
            title: '交易对', //'',
            class: ""
        }, {
            title: gDI18n.$t('10055'/*"交易类型"*/), //'',
            class: ""
        }, {
            title: gDI18n.$t('10058'/*"委托价格"*/), //'',
            class: ""
        }, {
            title: gDI18n.$t('10087'/*"数量"*/), //'',
            class: ""
        }, {
            title: gDI18n.$t('10064'/*'触发条件'*/), //'',
            class: ""
        }, {
            title: '生成时间', //'',
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

        })

        if (this.EV_ORD_UPD_unbinder) {
            this.EV_ORD_UPD_unbinder()
        }
        this.EV_ORD_UPD_unbinder = window.gEVBUS.on(gTrd.EV_ORD_UPD, arg => {
            that.initObj()
        })

        //监听多元改变
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
                title: gDI18n.$t('10590'), //'操作', //'',
                class: ""
            }, {
                title: '交易对', //'',
                class: ""
            }, {
                title: gDI18n.$t('10055'/*"交易类型"*/), //'',
                class: ""
            }, {
                title: gDI18n.$t('10058'/*"委托价格"*/), //'',
                class: ""
            }, {
                title: gDI18n.$t('10087'/*"数量"*/), //'',
                class: ""
            }, {
                title: gDI18n.$t('10064'/*'触发条件'*/), //'',
                class: ""
            }, {
                title: '生成时间', //'',
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
        if (this.EV_STOPDROPDOWN_UP_unbinder) {
            this.EV_STOPDROPDOWN_UP_unbinder()
        }
        if (this.EV_CHANGESYM_UPD_unbinder) {
            this.EV_CHANGESYM_UPD_unbinder()
        }
    },
    initObj() {
        let Orders = window.gTrd.Orders['02']
        let posList = []
        for (let key in Orders) {
            let order = Orders[key]
            let obj = {}
            let ass = window.gMkt.AssetD[order.Sym]
            //当前计划只显示OType为3的委托单
            if (ass && (order.OType == 3)) {
                utils.copyTab(obj, order)
                let PrzMinIncSize = utils.getFloatSize(utils.getFullNum(ass.PrzMinInc || 6));
                let VolMinValSize = utils.getFloatSize(ass.Mult || 2);

                //交易方向
                obj.DirStr = utils.getDirByStr(obj.Dir)
                //委托价格
                obj.displayPrz = Number(obj.Prz).toFixed2(PrzMinIncSize)
                //委托数量
                obj.Qty = Number(obj.Qty).toFixed2(VolMinValSize)
                //触发条件
                if (obj.StopPrz) {
                    obj.cond = obj.StopBy == 2 ? gDI18n.$t('10070') : obj.StopBy == 1 ? gDI18n.$t('10046') : gDI18n.$t('10048')
                    // obj.cond = obj.StopBy == 2 ? '指数价' : obj.StopBy == 1 ? '最新价' : '标记价'
                    obj.cond += (obj.OrdFlag & 8) ? '≥' : '≤'
                    obj.cond += obj.StopPrz.toFixed2(PrzMinIncSize)
                } else {
                    obj.cond = '--'
                }

                //生成时间
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
        this.posList = posList
    },

    getTheadList: function () {
        return this.theadList.map(function (item, i) {
            return m("th", {
                key: "goodsPlanListTHeadItem" + i,
                class: "" + item.class
            }, [
                item.title
            ])
        })
    },
    //设置合约
    setSym(Sym) {
        window.gMkt.CtxPlaying.Sym = Sym // window 保存选中
        utils.setItem('goodsActiveSymbol', Sym)
        gEVBUS.emit(gMkt.EV_CHANGESYM_UPD, {
            Ev: gMkt.EV_CHANGESYM_UPD,
            Sym: Sym
        })
    },
    getOrdList: function () {
        return this.posList.map(function (item, i) {
            return m("tr", {key: "goodsPlanListTableListItem1" + i,class: ""}, [
                m("td", {class: "table-tr-td-vertical"}, [
                    m("button", {class: "button is-primary " + (item.loading ? ' is-loading' : ''),onclick: function () {
                            obj.delOrder(item)
                        }
                    }, [
                        gDI18n.$t('10085') //'删除'
                    ])
                ]),
                m("td", {class: " table-tr-td-vertical cursor-pointer",onclick:function(){
                    obj.setSym(item.Sym)
                }}, [
                    m("p", { class: " " }, [
                        utils.getSymDisplayName(window.gMkt.AssetD, item.Sym)
                    ])
                ]),
                m("td", {class: "table-tr-td-vertical" + utils.getColorStr(item.Dir, 'font')}, [
                    item.DirStr
                ]),
                m("td", {class: "table-tr-td-vertical"}, [
                    item.displayPrz
                ]),
                m("td", {class: " table-tr-td-vertical" + utils.getColorStr(item.Dir, 'font')}, [
                    item.Qty
                ]),
                m("td", {class: " table-tr-td-vertical"}, [
                    item.cond
                ]),
                m("td", {class: " table-tr-td-vertical"}, [
                    item.AtStr
                ]),
                
            ])
        })
    },
    // m端列表
    getOrdListForM: function () {
        return this.posList.map(function (item, i) {
            return m('.card', { key: "goodsPlanTableListItemForM2" + i }, [
                m('div', { class: 'card-content card-content-bb' }, [
                    // 1
                    m('div', { class: "columns is-mobile" }, [
                        // 左
                        m('div', { class: "column card-content-title" }, [
                            m('span', { class: "" }, [
                                m("span", {class: "" + utils.getColorStr(item.Dir, 'font')}, [
                                    item.DirStr
                                ]),
                                utils.getSymDisplayName(window.gMkt.AssetD, item.Sym)
                            ])
                        ]),
                        // 右
                        m('div', { class: `column has-text-right` }, [
                            item.AtStr
                        ])
                    ]),
                    // 2
                    m('div', { class: "columns is-mobile" }, [
                        // 左
                        m('div', { class: "column" }, [
                            gDI18n.$t('10059')//'委托数量'
                        ]),
                        // 右
                        m('div', { class: `column has-text-right` }, [
                            gDI18n.$t('10058')//'委托价格'
                        ])
                    ]),
                    // 3
                    m('div', { class: "columns is-mobile" }, [
                        // 左
                        m('div', { class: "column" }, [
                            item.Qty //'委托数量'
                        ]),
                        // 右
                        m('div', { class: `column has-text-right` }, [
                            item.Prz //'委托价格'
                        ])
                    ]),
                    // 4
                    m('div', { class: "columns is-mobile" }, [
                        // 左
                        m('div', { class: "column" }, [
                            m('p', {}, [
                                gDI18n.$t('10064')//'触发条件'
                            ]),
                            m('p', { class: "" + utils.getColorStr(item.UPNLColor, 'font') }, [
                                item.cond
                            ])
                        ]),
                        // 右
                        m('div', { class: `column has-text-right` }, [
                            m("button", {
                                class: "button is-primary is-small" + (item.loading ? ' is-loading' : ''),
                                onclick: function () {
                                    obj.delOrder(item)
                                }
                            }, [
                                gDI18n.$t('10085')//'删除'
                            ])
                        ])
                    ])
                ])
            ])
        })
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
                window.$message({
                    title: gDI18n.$t('10037' /*"提示"*/ ),
                    content: utils.getTradeErrorCode(arg.code || arg.data.ErrCode),
                    type: 'danger'
                })
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
                m('col', {name: "pub-table-1",width: 143}),
                m('col', {name: "pub-table-2",width: 150}),
                m('col', {name: "pub-table-3",width: 150}),
                m('col', {name: "pub-table-4",width: 150}),
                m('col', {name: "pub-table-5",width: 150}),
                m('col', {name: "pub-table-6",width: 150}),
                m('col', {name: "pub-table-7",width: 150}),
            ])
            return m('div', {class: " table-container"}, [
                m('div', {class: `pub-table-head-box ${window.gWebAPI.isLogin() ? '' : 'is-hidden'}`,style: "width: 1043px"}, [
                    m("table", {class: "table is-hoverable ",width: '1043px',cellpadding: 0,cellspacing: 0}, [
                        colgroup,
                        m("tr", {class: ""}, [
                            obj.getTheadList()
                        ])
                    ]),
                ]),
                m('div', {class: "pub-table-body-box",style: "width: 1043px"}, [
                    m("table", {class: "table is-hoverable ",width: '1043px',cellpadding: 0,cellspacing: 0
                    }, [
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

        return m("div", {class: "pub-plan "}, [
            obj.getContent()
        ])
    },
    onremove: function () {
        obj.rmEVBUS()
    }
}