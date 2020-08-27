var m = require("mithril")
import Dropdown from '../common/Dropdown'
import Table from '../common/Table'
import utils from '../../../utils/utils'


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
    pageIndex: 1,
    Chargein : null,
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
                key: 'Tm'
            },
            {
                title: '合约',
                key: 'Sym'
            },
            {
                title: '资金费率间隔',
                key: 'interval'
            },
            {
                title: '资金费率',
                key: 'FundingRate'
            }
        ]
    },
    // 获取allTable总数据
    getAllTableData () {
        let ass = window.gMkt.AssetD[this.contractId] || null
        //资金费率时间间隔
        if(ass && ass.TrdCls != 1){
            this.Chargein = Number(ass.FundingInterval)/(60 * 60 * 1000)
        }
        let params = {
            collection: 'FundingRateHistory',
            Sym: obj.contractId,
            pageSize: 20,
            pageNo: this.pageIndex
        }
        window.gWebAPI.ReqFundRateHistory(params, data => {
            if(typeof data.result.data.msg == "object"){
                // obj.tableData 
                let oldTableData = data.result.data.msg
                let tableData = []
                oldTableData.map((item,i)=>{
                    let Tm = item.Tm
                    let _d = {
                        Sym : utils.getSymDisplayName(window.gMkt.AssetD, item.Sym) || "--",
                        Tm : new Date(Tm).format('yyyy-MM-dd hh:mm:ss') || "--",
                        FundingRate: (Number(utils.getFullNum(item.FundingRate))*100).toFixed2(6,8) + "%" || "--",
                        interval : this.Chargein
                    }
                    tableData.push(_d)
                })
                this.tableData = this.tableData.concat(tableData)
            }
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
                            obj.pageIndex = 1
                            obj.tableData = []
                            obj.Chargein = null
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
                        obj.pageIndex ++
                        obj.getAllTableData()
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