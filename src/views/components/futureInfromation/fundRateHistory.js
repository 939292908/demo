var m = require("mithril")
import Dropdown from '../common/Dropdown'
import Table from '../common/Table'



let obj = {
    showMenu: false,
    // 合约下拉选中   
    contractId: 1,
    // 合约下拉
    contractList: [],
    // 表头
    tableColumns: [],
    // 表格
    tableData: [],
    // 初始化合约列表
    initSymList () {
        let displaySym = window.gMkt.displaySym
        let assetD = window.gMkt.AssetD
        let futureSymList = []
        let tabelList = []
        displaySym.map(function (Sym) {
            let ass = assetD[Sym]
            if (ass.TrdCls == 3) {
                futureSymList.push(Sym)
            } else if (ass.TrdCls == 2) {
                futureSymList.push(Sym)
            }
        })
        this.futureSymList = futureSymList
        futureSymList.map((key, i) => {
            let obj = {
                id: i,
                label: utils.getSymDisplayName(window.gMkt.AssetD, key)
            }
            tabelList.push(obj)
        })
        this.contractList = tabelList
    },
    // 初始化多语言
    initLanguage () {
        // 表头
        this.tableColumns = [
            {
                title: '时间',
                key: 'sj'
            },
            {
                title: '合约',
                key: 'hy'
            },
            {
                title: '资金费率间隔',
                key: 'zj'
            },
            {
                title: '资金费率',
                key: 'fl'
            }
        ]
    },
    // 获取table数据
    getTableData () {
        this.tableData = [
            {
                sj: '2020-07-16 08:00:00',
                hy: 'BTC/USDT 永续',
                zj: '8小时',
                fl: '0.1234%'
            },
            {
                sj: '2020-01-22 12:20:00',
                hy: 'BTC/USDT 永续',
                zj: '1小时',
                fl: '0.3344%'
            },
        ]

        let params = {
            collection: 'FundingRateHistory',
            Sym: "BTC.USDT",
            pageSize: 20,
            pageNo: 1
        }
        window.gWebAPI.ReqFundRateHistory(params, data => {
            console.log(data, 6666666);
        }, err => {
            console.log(err)
        })
    },
    //初始化全局广播
    initEVBUS () {
        let that = this
        //assetD合约详情全局广播
        if (this.EV_ASSETD_UPD_unbinder) this.EV_ASSETD_UPD_unbinder()
        this.EV_ASSETD_UPD_unbinder = window.gEVBUS.on(gMkt.EV_ASSETD_UPD, arg => {
            that.initSymList()
        })
    },
    //删除全局广播
    rmEVBUS () {
        //assetD合约详情全局广播
        if (this.EV_ASSETD_UPD_unbinder) this.EV_ASSETD_UPD_unbinder()
    },
}


export default {
    oninit (vnode) {
        obj.initLanguage()
        obj.initSymList()
        obj.getTableData()
    },
    oncreate (vnode) {
        obj.initEVBUS()
    },
    view (vnode) {
        return m("div", { class: "" }, [
            // 下拉筛选
            m('div', { class: `futureIndex-filter is-flex` }, [
                // 合约下拉列表
                m('div', { class: "inf_dropdown" }, [
                    m('span', { class: "inf_body_span inf_body_font" }, ['合约']),
                    m(Dropdown, {
                        activeId: cb => cb(obj, 'contractId'),
                        showMenu: obj.showMenu,
                        setShowMenu: type => obj.showMenu = type,
                        placeholder: '--',
                        onClick (itme) {
                            console.log(itme);
                        },
                        getList () {
                            return obj.contractList
                        }
                    })
                ]),
            ]),

            // 表格
            m(Table, {
                columns: obj.tableColumns,
                data: obj.tableData,
                defaultColumnWidth: "25%"
            })
        ])
    },
    onremove (vnode) {
        obj.rmEVBUS()
    }
}