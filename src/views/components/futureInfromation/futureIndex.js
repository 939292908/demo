var m = require("mithril")
import Dropdown from '../common/Dropdown'
import Table from '../common/Table'



let obj = {
    // 合约下拉选中   
    contractId: 1,
    // 指数下拉选中   
    exponentId: 1,
    // 合约下拉
    contractList: [],
    // 指数下拉
    exponentList: [],
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
        // 指数下拉
        this.exponentList = [
            {
                id: 1,
                label: '指数1'
            },
            {
                id: 2,
                label: '指数2'
            },
            {
                id: 3,
                label: '指数3'
            },
        ]
        // 表头
        this.tableColumns = [
            {
                title: '交易所',
                key: 'jys'
            },
            {
                title: '货币对',
                key: 'hbd'
            },
            {
                title: '当前报价',
                key: 'dqbj'
            },
            {
                title: '权重',
                key: 'qz'
            }
        ]
    },
    // 获取table数据
    getTableData () {
        this.tableData = [
            {
                jys: 'Binance',
                hbd: 'BTC/USDT',
                dqbj: '9500.5',
                qz: '1/3'
            },
            {
                jys: 'OKEx',
                hbd: 'BTC/USDT',
                dqbj: '9500.5',
                qz: '1/3'
            },
            {
                jys: 'Huobi',
                hbd: 'BTC/USDT',
                dqbj: '9500.5',
                qz: '1/3'
            }
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
                // 指数下拉列表
                m('div', { class: "inf_dropdown" }, [
                    m('span', { class: "inf_body_span inf_body_font" }, ['指数']),
                    m(Dropdown, {
                        activeId: cb => cb(obj, 'exponentId'),
                        onClick (itme) {
                            console.log(itme);
                        },
                        getList () {
                            return obj.exponentList
                        }
                    })
                ]),
            ]),
            // 信息介绍
            m('div', { class: `futureIndex-info inf_dropdown inf_body_conent` }, [
                m('div', { class: `inf_body_title_font` }, [
                    'BTC币币指数'
                ]),
                m('div', { class: `inf_body_TD` }, [
                    "BTC指数跟踪BTC/USDT币币价格，该指数代表了标的资产的市场共识价格，其价格源自于多个现货交易所。通过数据可用性验证的参考交易所报价，将经过加权计算后得到最终的指数。具体参考交易所报价的来源和权重，请参考下面的“指数成分分解”。"
                ])
            ]),
            // k线
            m('div', { class: `futureIndex-kline inf_dropdown inf_body_conent` }, [
                m('div', { class: `inf_body_title_font` }, [
                    'BTC指数历史价值'
                ]),
                m('div', { class: `` }, ["k线box"])
            ]),
            // 表格
            m('div', { class: `futureIndex-table inf_dropdown inf_body_conent` }, [
                m('div', { class: `inf_body_title_font` }, [
                    'BTC指数成分分解'
                ]),
                // table
                m(Table, {
                    columns: obj.tableColumns,
                    data: obj.tableData,
                    defaultColumnWidth: "25%"
                })
            ]),
        ])
    }
}