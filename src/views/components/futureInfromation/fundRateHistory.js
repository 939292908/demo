var m = require("mithril")
import Dropdown from '../common/Dropdown'
import Table from '../common/Table'



let obj = {
    // 合约下拉选中   
    contractId: 1,
    // 合约下拉
    contractList: [],
    // 表头
    tableColumns: [],
    // 表格
    tableData: [],

    // 初始化多语言
    initLanguage () {
        // 合约详解列表
        this.contractList = [
            {
                id: 1,
                label: '合约1'
            },
            {
                id: 2,
                label: '合约2'
            },
            {
                id: 3,
                label: '合约3'
            },
        ]
       
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
    },
}


export default {
    oninit: function (vnode) {
        obj.initLanguage()
        obj.getTableData()
    },
    oncreate: function (vnode) {

    },
    view: function (vnode) {
        return m("div", { class: "" }, [
            // 下拉筛选
            m('div', { class: `futureIndex-filter is-flex` }, [
                // 合约下拉列表
                m('div', { class: "inf_dropdown" }, [
                    m('span', { class: "inf_body_span inf_body_font" }, ['合约']),
                    m(Dropdown, {
                        activeId: cb => cb(obj, 'contractId'),
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
    }
}