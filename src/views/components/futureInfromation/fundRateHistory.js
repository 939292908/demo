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
    pageIndex: 0,
     // 一次性获取所有表格数据
    allTableData: [],
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
        // 3. 获取allTable数据
        this.getAllTableData()
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
    // 获取allTable总数据
    getAllTableData () {
        this.allTableData = []
        this.tableData = []
        this.pageIndex = 0
        for (var i = 0; i < 500; i++) {
            this.allTableData.push({
                sj: '2020-01-22 12:20:00',
                hy: 'BTC/USDT 永续',
                zj: i + '小时',
                fl: '0.3344%'
            })
        }
        // 把数据切割成分页
        this.allTableData = utils.splitList(this.allTableData,20)
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
        // 获取table数据
        this.getTableDataByPageIndex()
    },
    // 从总数据中添加table列表
    getTableDataByPageIndex () {
        console.log(this.pageIndex);
        let newData = this.allTableData[this.pageIndex]
        if(newData) this.tableData = this.tableData.concat(newData)
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
                            obj.getAllTableData()
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
                defaultColumnWidth: "25%",
                height: 580,
                onscroll (e) {
                    utils.triggerScroll(e, () => {
                        obj.pageIndex++
                        obj.getTableDataByPageIndex()
                        console.log('快到底了!!!!');
                    })
                }
            })
        ])
        
    },
    onremove (vnode) {
        obj.rmEVBUS()
    }
}