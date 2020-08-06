var m = require("mithril")
import Dropdown from '../common/Dropdown'
import Table from '../common/Table'
import kline from '../market/kline'

let obj = {
    spotInfo: {
        disSym: '--',
        ExpireStr: '--',
        FundingNext: '--',
        PrzMinInc: '--',
        FundingLongR: '--',
        FundingPredictedR: '--',
        Mult: '--',
        FromC: '--',
        ToC: '--',
        SettleCoin: '--',
        QuoteCoin: '--',
        typeName: '--',
        LotSz: '--',
    },

    contractList: [], // 合约详解列表
    tableColumns: [], // 表头
    tableData: [], // 表格

    //合约名称列表
    futureSymList: [],
    futureSymObj: {},

    dropdownActive: 0,
    tabelList: [
        {
            id: 0,
            label: "--"
        }
    ],

    // 初始化多语言
    initLanguage () {
        // 合约详解列表
        this.contractList = [
            {
                name: '合约名称',
                info: 'BTC/USDT永续'
            },
            {
                name: '到期日期',
                info: '永续'
            },
            {
                name: '计价货币',
                info: 'USDT'
            },
            {
                name: '结算货币',
                info: 'USDT'
            },
            {
                name: '合约大小',
                info: '0.001 BTC/张'
            },
        ]
        // 表头
        this.tableColumns = [
            {
                title: '风险限额档位',
                key: 'fx'
            },
            {
                title: '张数',
                key: 'zs'
            },
            {
                title: '仓位保证金率',
                key: 'cw'
            },
            {
                title: '委托保证金率',
                key: 'wt'
            },
            {
                title: '最高可用杠杆',
                key: 'zg'
            }
        ]
    },
    // 获取table数据
    getTableData () {
        this.tableData = [
            {
                fx: '1',
                zs: '0-999',
                cw: '0.50%',
                wt: '1.00%',
                zg: '100',
            },
            {
                fx: '2',
                zs: '0-999',
                cw: '0.50%',
                wt: '1.00%',
                zg: '100',
            },
            {
                fx: '3',
                zs: '0-999',
                cw: '0.50%',
                wt: '1.00%',
                zg: '100',
            },
        ]
    },
    //初始化全局广播
    initEVBUS: function () {
        let that = this

        //assetD合约详情全局广播
        if (this.EV_ASSETD_UPD_unbinder) {
            this.EV_ASSETD_UPD_unbinder()
        }
        this.EV_ASSETD_UPD_unbinder = window.gEVBUS.on(gMkt.EV_ASSETD_UPD, arg => {
            that.initSymList()
        })

        //页面交易类型全局广播
        if (this.EV_PAGETRADESTATUS_UPD_unbinder) {
            this.EV_PAGETRADESTATUS_UPD_unbinder()
        }
        this.EV_PAGETRADESTATUS_UPD_unbinder = window.gEVBUS.on(gMkt.EV_PAGETRADESTATUS_UPD, arg => {
            that.initSymList()
        })

    },

    rmEVBUS: function () {
        //assetD合约详情全局广播
        if (this.EV_ASSETD_UPD_unbinder) {
            this.EV_ASSETD_UPD_unbinder()
        }
        //页面交易类型全局广播
        if (this.EV_PAGETRADESTATUS_UPD_unbinder) {
            this.EV_PAGETRADESTATUS_UPD_unbinder()
        }
    },
    //初始化合约列表
    initSymList: function () {
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
        this.tabelList = tabelList

        this.updateSpotInfo()
        console.log(this.tabelList, 2222222222)
        console.log(this.futureSymList, 1111111111)
        // m.redraw();
        // setTimeout(() => m.redraw(), 0)
    },
    //初始化合约数据
    updateSpotInfo: function () {
        let dropdownActive = this.dropdownActive
        let Sym = this.futureSymList[dropdownActive]
        let ass = window.gMkt.AssetD[Sym] || null
        if (ass && ass.TrdCls != 1) {
            let info = {
                disSym: utils.getSymDisplayName(window.gMkt.AssetD, Sym), // 合约显示名称
                ExpireStr: ass.TrdCls == 2 ? new Date(ass.Expire).format('yyyy-MM-dd hh:mm:ss') : "没有到期日期", // 到期日
                FundingNext: new Date(ass.FundingNext).format('yyyy-MM-dd hh:mm:ss'),
                PrzMinInc: utils.getFullNum(ass.PrzMinInc), //最小价格变动
                FundingLongR: (ass.FundingLongR * 100).toSubstrFixed(4) + '%', //资金费率
                FundingPredictedR: (ass.FundingPredictedR * 100).toSubstrFixed(4) + '%',  //预测下一资金费率
                Mult: utils.getFullNum(ass.Mult), //最小数量变动
                FromC: ass.FromC,
                ToC: ass.ToC,
                SettleCoin: ass.SettleCoin, //计价货币
                QuoteCoin: ass.QuoteCoin,  //计算货币
                typeName: '', //合约类型名称
                LotSz: '', //合约大小
            };
            if (ass.TrdCls == 2) {
                info.typeName = gDI18n.$t('10105')//'交割合约'
                info.LotSz = ass.LotSz + ' ' + ass.QuoteCoin + ' / ' + gDI18n.$t('10423')//'张'
            } else if (ass.TrdCls == 3 && (ass['Flag'] & 1) == 1) {
                info.typeName = gDI18n.$t('10106')//'反向永续'
                info.LotSz = ass.LotSz + ' ' + ass.QuoteCoin + ' / ' + gDI18n.$t('10423')//'张'
            } else if (ass.TrdCls == 3) {
                info.typeName = gDI18n.$t('10107')//'正向永续'
                info.LotSz = ass.LotSz + ' ' + ass.ToC + ' / ' + gDI18n.$t('10423')//'张'
            }
            this.spotInfo = info;
        } else {
            this.spotInfo = {
                disSym: '--',
                ExpireStr: '--',
                FundingNext: '--',
                PrzMinInc: '--',
                FundingLongR: '--',
                FundingPredictedR: '--',
                Mult: '--',
                FromC: '--',
                ToC: '--',
                SettleCoin: '--',
                QuoteCoin: '--',
                typeName: '--',
                LotSz: '--',
            }
        }
    },
    //下拉列表
    getDownloadFuture: function () {
        return m(Dropdown, {
            activeId: cb => cb(obj, 'dropdownActive'),
            menuWidth: 110,
            onClick (itme) {
                // console.log(itme);
                obj.clickSelect(itme)
            },
            getList () {
                return obj.tabelList
            }
        })
    },
    //点击选中合约
    clickSelect: function (item) {
        this.updateSpotInfo()
    },

    //文案说明
    getTitleExplain: function () {
        let dropdownActive = obj.dropdownActive
        let spotInfo = obj.spotInfo
        let tabelList = obj.tabelList

        return m('div', { class: "inf_dropdown inf_body_conent" }, [
            m('div', { class: "inf_body_title_font" }, [
                tabelList[dropdownActive].label + ' 合约明细'
            ]),
            m('div', { class: "inf_body_TD" }, [
                tabelList[dropdownActive].label + '合约' + spotInfo.ExpireStr + '。每张合约大小' + spotInfo.LotSz + '。每' + '8' + '小时交换资金费用。下一个交换将发生在' + spotInfo.FundingNext + '。'
            ]),
            m('div', { class: " inf_body_TD" }, [
                window.$config.exchName + '交易平台利用利率与每分钟溢价指数的加权平均值计算出资金费率。',
                m('span', { class: "" }, [
                    m('a', { class: "" }, [
                        '阅读更多...'
                    ])
                ])
            ]),
        ])
    },

    //行情价格
    getFutureqQuotation: function () {
        let dropdownActive = obj.dropdownActive
        let spotInfo = obj.spotInfo
        let tabelList = obj.tabelList
        return m('div', { class: "inf_dropdown inf_body_conent" }, [
            m('div', { class: "inf_body_title_font inf_dropdown" }, [
                tabelList[dropdownActive].label + ' 行情价格'
            ]),
            m('div', { class: " inf_body_kline kline_border" }, [
                m(kline)
            ]),
        ])
    },

    //合约详解
    getFutureIntroduce: function () {
        return m('div', { class: "inf_dropdown inf_body_conent" }, [
            // title
            m('div', { class: "inf_body_title_font inf_dropdown" }, [
                `${obj.tabelList[obj.dropdownActive].label}合约详解`
            ]),
            // list
            m('div', { class: `` }, obj.contractList.map((item, index) => {
                return m('div', { class: `columns` }, [
                    m('div', { class: `column is-3` }, [item.name]),
                    m('div', { class: `column is-3` }, [item.info])
                ])
            })
            )
        ])
    },
    //table
    getTableView () {
        return m('div', { class: "inf_dropdown inf_body_conent" }, [
            // title
            m('div', { class: "inf_body_title_font inf_dropdown" }, [
                `${obj.tabelList[obj.dropdownActive].label}合约风险限额`
            ]),
            // table
            m(Table, {
                columns: obj.tableColumns,
                data: obj.tableData,
                defaultColumnWidth: "20%"
            })
        ])
    },
}


export default {
    oninit: function (vnode) {
        obj.initLanguage()
        obj.getTableData()
    },
    oncreate: function (vnode) {
        obj.initEVBUS()
        // obj.initSymList()
    },
    view: function (vnode) {
        let dropdownActive = obj.dropdownActive
        let spotInfo = obj.spotInfo
        let tabelList = obj.tabelList
        return m("div", { class: "" }, [
            m('div', { class: "inf_dropdown" }, [
                m('span', { class: "inf_body_span inf_body_font" }, [
                    '合约',
                ]),
                //下拉列表
                obj.getDownloadFuture(),
            ]),

            //文案说明
            obj.getTitleExplain(),

            //行情价格
            obj.getFutureqQuotation(),

            // 合约详解列表
            obj.getFutureIntroduce(),

            // 表格
            obj.getTableView(),


        ])
    },
    onremove: function (vnode) {
        obj.rmEVBUS()
    },
}