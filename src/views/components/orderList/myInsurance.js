// 我的保险
var m = require("mithril")

let obj = {
    tableList: [],
    theadList: [],
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
    // 初始化 语言
    initLanguage () {
        this.theadList = [
            {
                title: '保险状态',
                key: 'state',
                class: ''
            },
            {
                title: '合约',
                key: 'sym',
                class: ''
            },
            {
                title: '方向',
                key: 'direction',
                class: ''
            },
            {
                title: '杠杆',
                key: 'lever',
                class: ''
            },
            {
                title: '数量',
                key: 'num',
                class: ''
            },
            {
                title: '开仓价格',
                key: 'openPic',
                class: ''
            },
            {
                title: '平仓价格',
                key: 'closePic',
                class: ''
            },
            {
                title: '平仓盈亏',
                key: 'closeProfitAndLoss',
                class: ''
            },
            {
                title: '手续费',
                key: 'commissionCharge',
                class: ''
            },
            {
                title: '保险金额（USDT）',
                key: 'insuranceAmount',
                class: ''
            },
            {
                title: '赔付金额（USDT）',
                key: 'compensationAmount',
                class: ''
            },
            {
                title: '开仓时间',
                key: 'openTime',
                class: ''
            },
            {
                title: '平仓时间',
                key: 'closeTime',
                class: ''
            },
            {
                title: '订单编号',
                key: 'orderNum',
                class: ''
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
    initObj () {
        let Orders = window.gTrd.Orders['01']
        let tableList = [
            {
                state: '申请赔付',
                sym: 'BTC/USDT永续',
                direction: '卖出',
                lever: '全仓50x',
                num: '1000',
                openPic: '6000.0',
                closePic: '5880.0',
                closeProfitAndLoss: '-0.2000 USDT',
                commissionCharge: '-0.2000 USDT',
                insuranceAmount: '100',
                compensationAmount: '200',
                openTime: '12：00',
                closeTime: '13：00',
                orderNum: '112211123',
            },
        ]
        this.tableList = tableList
    },
    // table 头部
    getTableHeadList () {
        return this.theadList.map(function (item, i) {
            return m("th", { key: "headItem" + i, class: "" + item.class }, [
                item.title
            ])
        })
    },
    // table body
    getTableList () {
        return this.tableList.map(function (item, i) {
            return m("tr", { key: "orderTableListItem" + i, class: "" }, [
                m("td", { class: " table-tr-td-vertical" }, [
                    item.state
                ]),
                m("td", { class: "table-tr-td-vertical cursor-pointer" }, [
                    item.sym
                ]),
                m("td", { class: "table-tr-td-vertical" }, [
                    item.direction
                ]),
                m("td", { class: " table-tr-td-vertical" }, [
                    item.lever
                ]),
                m("td", { class: " table-tr-td-vertical" }, [
                    item.num
                ]),
                m("td", { class: " table-tr-td-vertical" }, [
                    item.openPic
                ]),
                m("td", { class: " table-tr-td-vertical" }, [
                    item.closePic
                ]),
                m("td", { class: " table-tr-td-vertical" }, [
                    item.closeProfitAndLoss
                ]),
                m("td", { class: " table-tr-td-vertical" }, [
                    item.commissionCharge
                ]),
                m("td", { class: "table-tr-td-vertical" }, [
                    item.insuranceAmount
                ]),
                m("td", { class: "table-tr-td-vertical" }, [
                    item.compensationAmount
                ]),
                m("td", { class: "table-tr-td-vertical" }, [
                    item.openTime
                ]),
                m("td", { class: "table-tr-td-vertical" }, [
                    item.closeTime
                ]),
                m("td", { class: "table-tr-td-vertical" }, [
                    item.orderNum
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
                window.$message({ title: gDI18n.$t('10037'/*"提示"*/), content: utils.getTradeErrorCode(arg.code || arg.data.ErrCode), type: 'danger' })
            } else {
                param.loading = false
            }
        })
    },
    // 组件主体 m/ 端
    getContent () {
        if (window.isMobile) {
            return []
        } else {
            let colgroup = m('colgroup', {}, [
                m('col', { width: 160 }),
                m('col', { width: 160 }),
                m('col', { width: 130 }),
                m('col', { width: 80 }),
                m('col', { width: 80 }),
                m('col', { width: 100 }),
                m('col', { width: 100 }),
                m('col', { width: 100 }),
                m('col', { width: 100 }),
                m('col', { width: 150 }),
                m('col', { width: 150 }),
                m('col', { width: 150 }),
                m('col', { width: 100 }),
                m('col', { width: 500 }),
            ])
            return m('div', { class: " table-container" }, [
                m('div', { class: "pub-table-head-box", style: "width: 1470px" }, [
                    m("table", { class: "table is-hoverable ", width: '1470px', cellpadding: 0, cellspacing: 0 }, [
                        colgroup,
                        m("tr", { class: "" }, [
                            obj.getTableHeadList()
                        ])
                    ]),
                ]),
                m('div', { class: "pub-table-body-box", style: "width: 1470px" }, [
                    m("table", { class: "table is-hoverable ", width: '1470px', cellpadding: 0, cellspacing: 0 }, [
                        colgroup,
                        obj.getTableList()
                    ])
                ]),
            ])
        }
    }
}

export default {
    oninit (vnode) {
        obj.initLanguage()
    },
    oncreate (vnode) {
        obj.initEVBUS()
        obj.initObj()
    },
    view (vnode) {
        return m("div", { class: "pub-order" }, [
            obj.getContent()
        ])
    },
    onremove () {
        obj.rmEVBUS()
    }
}