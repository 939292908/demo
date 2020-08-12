var m = require("mithril")
import Dropdown from '../common/Dropdown'
import Table from '../common/Table'



let obj = {
    showMenu: false,
    // 合约下拉选中   
    contractId: '',
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
        let futureSymList = displaySym.filter(Sym => assetD[Sym].TrdCls == 2 || assetD[Sym].TrdCls == 3)
        // 1. 获取下拉列表
        this.contractList = futureSymList.map((key, i) => { 
            return {
                id: key,
                label: utils.getSymDisplayName(window.gMkt.AssetD, key)
            }
        })
        // 2. 默认选中第一个
        this.contractId = this.contractList[0] && this.contractList[0].id 
        // 3. 获取table数据
        this.getTableData()
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
            Sym: obj.contractId,
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
                            obj.getTableData()
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