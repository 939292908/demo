var m = require("mithril")
import Dropdown from '../common/Dropdown'
import Table from '../common/Table'
import kline from '../market/kline'

let obj = {
    showMenu: false,
    spotInfo: {
        disSym: '--',
        ExpireStr: '--',
        SettleCoin: '--',
        QuoteCoin: '--',
        LotSz: '--',
        PrzMinInc: '--',
        Mult: '--',
        MIRLve: '--',
        SIGN: '--',
        PrzM: '--',
        OpenOrd: '--',
        MIR: '--',
        MMR: '--',
        FeeMkrR: '--',
        FeeTkrR: '--',
        MIRm: '--',
        MMRg: '--',
        FundingLongR: '--',
        Chargein: '--',
        FundingPredictedR: '--',
        FundingNext: '--',
        FromC: '--',
        ToC: '--',
        typeName: '--',
        Base: '--',
        Step: '--',
        StepIR: '--',
        StepMR: '--',
        BaseMIR: '--',
        BaseMMR: '--',
    },
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
    tableColumns : [
        {
            title: '风险限额档位',
            key: 'fx'
        },
        {
            title: '张数',
            render (params) { // 自定义 列内容
                return m('div',`${params.zs[0]}-${params.zs[1]}`)
            }
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
    ],
    contractList : [
        {
            name: '合约名称',
            info: '--'
        },
        {
            name: '到期日期',
            info: '--'
        },
        {
            name: '计价货币',
            info: '--'
        },
        {
            name: '结算货币',
            info: '--'
        },
        {
            name: '合约大小',
            info: '--'
        },
        {
            name: '最小价格变动',
            info: '--'
        },
        {
            name: '最小数量变动',
            info: '--'
        },
        {
            name: '杠杆模式',
            info: '--'
        },
        {
            name: '标记方法',
            info: '--'
        },
        {
            name: '标记价格',
            info: '--'
        },
        {
            name: '启用自动减仓',
            info: '--'
        },
        {
            name: '委托保证金率',
            info: '--'
        },
        {
            name: '仓位保证金率',
            info: '--'
        },
        {
            name: '流动性提供方(Maker)手续费率：',
            info: '--'
        },
        {
            name: '流动性提取方(Taker)手续费率：',
            info: '--'
        },
        {
            name: '委托保证金',
            info: '--'
        },
        {
            name: '仓位保证金',
            info: '--'
        },
        {
            name: '资金费率',
            info: '--'
        },
        {
            name: '资金费用收取间隔',
            info: '--'
        },
        {
            name: '下一个资金费率',
            info: '--'
        },
        {
            name: '风险限额',
            info: '--'
        },
        {
            name: '风险限额递增额',
            info: '--'
        },
        {
            name: '委托保证金递增值',
            info: '--'
        },
        {
            name: '仓位保证金递增值',
            info: '--'
        },
    ],

    // 初始化多语言
    initLanguage () {
        // 合约详解列表
        this.contractList = [
            {
                name: '合约名称',
                info: '--'
            },
            {
                name: '到期日期',
                info: '--'
            },
            {
                name: '计价货币',
                info: '--'
            },
            {
                name: '结算货币',
                info: '--'
            },
            {
                name: '合约大小',
                info: '--'
            },
            {
                name: '最小价格变动',
                info: '--'
            },
            {
                name: '最小数量变动',
                info: '--'
            },
            {
                name: '杠杆模式',
                info: '--'
            },
            {
                name: '标记方法',
                info: '--'
            },
            {
                name: '标记价格',
                info: '--'
            },
            {
                name: '启用自动减仓',
                info: '--'
            },
            {
                name: '委托保证金率',
                info: '--'
            },
            {
                name: '仓位保证金率',
                info: '--'
            },
            {
                name: '流动性提供方(Maker)手续费率：',
                info: '--'
            },
            {
                name: '流动性提取方(Taker)手续费率：',
                info: '--'
            },
            {
                name: '委托保证金',
                info: '--'
            },
            {
                name: '仓位保证金',
                info: '--'
            },
            {
                name: '资金费率',
                info: '--'
            },
            {
                name: '资金费用收取间隔',
                info: '--'
            },
            {
                name: '下一个资金费率',
                info: '--'
            },
            {
                name: '风险限额',
                info: '--'
            },
            {
                name: '风险限额递增额',
                info: '--'
            },
            {
                name: '委托保证金递增值',
                info: '--'
            },
            {
                name: '仓位保证金递增值',
                info: '--'
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
                render (params) { // 自定义 列内容
                    return m('div',`${params.zs[0]}-${params.zs[1]}`)
                }
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
    //初始化全局广播
    initEVBUS: function () {
        let that = this

        //风险限额
        if (this.EV_GETRISKLIMITSOVER_UPD_unbinder) {
            this.EV_GETRISKLIMITSOVER_UPD_unbinder()
        }
        this.EV_GETRISKLIMITSOVER_UPD_unbinder = window.gEVBUS.on(gTrd.EV_GETRISKLIMITSOVER_UPD, arg => {
            that.initSymList()
            that.updateSpotInfo()
        })

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
        //风险限额
        if (this.EV_GETRISKLIMITSOVER_UPD_unbinder) {
            this.EV_GETRISKLIMITSOVER_UPD_unbinder()
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
    },
    //初始化合约数据
    updateSpotInfo: function () {
        let dropdownActive = this.dropdownActive
        let Sym = this.futureSymList[dropdownActive]
        let ass = window.gMkt.AssetD[Sym] || null

        let RS = window.gTrd.RS[Sym] || null
        if (ass && ass.TrdCls != 1) {
            let info = {
                // 合约显示名称
                disSym: utils.getSymDisplayName(window.gMkt.AssetD, Sym), 
                // 到期日
                ExpireStr: ass.TrdCls == 2 ? new Date(ass.Expire).format('yyyy-MM-dd hh:mm:ss') : 0, 
                //计价货币
                SettleCoin: ass.SettleCoin, 
                //结算货币
                QuoteCoin: ass.QuoteCoin, 
                //合约大小
                LotSz: '', 
                //最小价格变动
                PrzMinInc: utils.getFullNum(ass.PrzMinInc), 
                //最小数量变动 
                Mult: utils.getFullNum(ass.Mult), 
                //杠杆模式
                MIRLve:1/Number(ass.MIR)+"X",
                //标记方法
                SIGN:"合理价格",
                //标记价格
                PrzM:Number(ass.PrzM).toFixed2(2,8),
                //启用自动减仓
                OpenOrd:"是：通过自动减仓来处理杠杆交易所造成的穿仓损失",
                //委托保证金率
                MIR:(ass.MIR * 100).toSubstrFixed(4) + '%',
                //仓位保证金率
                MMR:(ass.MMR * 100).toSubstrFixed(4) + '%',
                //流动性提供方(Maker)手续费率：
                FeeMkrR:(ass.FeeMkrR * 100).toSubstrFixed(4) + '%',
                //流动性提取方(Taker)手续费率：
                FeeTkrR:(ass.FeeTkrR * 100).toSubstrFixed(4) + '%',
                //委托保证金
                MIRm:(ass.MIR * 100).toSubstrFixed(4) + '%',
                //仓位保证金
                MMRg:(ass.MMR * 100).toSubstrFixed(4) + '%',
                //资金费率
                FundingLongR: (ass.FundingLongR * 100).toSubstrFixed(4) + '%',
                //资金费用收取间隔
                Chargein:8,
                //预测下一资金费率
                FundingPredictedR: (ass.FundingPredictedR * 100).toSubstrFixed(4) + '%',  
                //资金交换时间
                FundingNext: new Date(ass.FundingNext).format('yyyy-MM-dd hh:mm:ss'),
                //单位
                FromC: ass.FromC,
                ToC: ass.ToC,
                //合约类型名称
                typeName: '', 
                //风险限额
                Base:RS.Base,
                //风险限额递增额
                Step:RS.Step,
                //委托保证金递增值
                StepIR:RS.StepIR,
                //仓位保证金递增值
                StepMR:RS.StepMR,
                BaseMIR:RS.BaseMIR,
                BaseMMR:RS.BaseMMR
                
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
            this.getFutureData()
            this.getBaseData()
        } else {
            this.spotInfo = {
                disSym: '--',
                ExpireStr: '--',
                SettleCoin: '--',
                QuoteCoin: '--',
                LotSz: '--',
                PrzMinInc: '--',
                Mult: '--',
                MIRLve: '--',
                SIGN: '--',
                PrzM: '--',
                OpenOrd: '--',
                MIR: '--',
                MMR: '--',
                FeeMkrR: '--',
                FeeTkrR: '--',
                MIRm: '--',
                MMRg: '--',
                FundingLongR: '--',
                Chargein: '--',
                FundingPredictedR: '--',
                FundingNext: '--',
                FromC: '--',
                ToC: '--',
                typeName: '--',
                Base: '--',
                Step: '--',
                StepIR: '--',
                StepMR: '--',
                BaseMIR: '--',
                BaseMMR: '--',   
            }
        }
    },
    //合约详解数据
    getFutureData:function(){
        this.contractList[0].info = this.spotInfo.disSym
        this.contractList[1].info = this.spotInfo.ExpireStr == 0?"永续":this.spotInfo.ExpireStr
        this.contractList[2].info = this.spotInfo.SettleCoin
        this.contractList[3].info = this.spotInfo.QuoteCoin
        this.contractList[4].info = this.spotInfo.LotSz
        this.contractList[5].info = this.spotInfo.PrzMinInc
        this.contractList[6].info = this.spotInfo.Mult
        this.contractList[7].info = "全仓、逐仓(1-" + this.spotInfo.MIRLve + ")"
        this.contractList[8].info = this.spotInfo.SIGN
        this.contractList[9].info = this.spotInfo.PrzM
        this.contractList[10].info = this.spotInfo.OpenOrd
        this.contractList[11].info = this.spotInfo.MIR
        this.contractList[12].info = this.spotInfo.MMR
        this.contractList[13].info = this.spotInfo.FeeMkrR
        this.contractList[14].info = this.spotInfo.FeeTkrR
        this.contractList[15].info = this.spotInfo.MIRm + ("*委托价值+亏损+手续费")
        this.contractList[16].info = this.spotInfo.MMRg + ("*仓位价值")
        this.contractList[17].info = this.spotInfo.FundingLongR
        this.contractList[18].info = "每" +this.spotInfo.Chargein + "小时"
        this.contractList[19].info = this.spotInfo.FundingNext
        this.contractList[20].info = this.spotInfo.Base
        this.contractList[21].info = this.spotInfo.Step
        this.contractList[22].info = this.spotInfo.StepIR
        this.contractList[23].info = this.spotInfo.StepMR
    },
    //下拉列表
    getDownloadFuture: function (vnode) {
        return m(Dropdown, {
            activeId: cb => cb(obj, 'dropdownActive'),
            showMenu: obj.showMenu,
            setShowMenu: type => obj.showMenu = type,
            menuWidth: 110,
            onClick (itme) {
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

    //获取风险限额数据
    getBaseData:function(){
        let Qty1 = 0
        let arr = []
        for(let i =1;i <=10;){
            let Qty2 = (this.spotInfo.Base - 1) + (this.spotInfo.Step * (i - 1))
            let MMR = (this.spotInfo.BaseMMR) + (this.spotInfo.StepMR * (i - 1))
            let MIR = (this.spotInfo.BaseMIR) + (this.spotInfo.StepIR * (i - 1))
            let LeverMax = 1 / MIR
            let BA = {
                fx : i,
                zs : [Qty1,Qty2],
                cw : (MMR * 100).toFixed(2) + '%',
                wt : (MIR * 100).toFixed(2) + '%',
                zg : LeverMax.toFixed(2)
            }
            arr.push(BA);
            i +=1;
            Qty1 = Qty2 + 1
        }

        let showData = {
            fx : "...",
            zs : ["...","..."],
            cw : "...",
            wt : "...",
            zg : "..."
        }

        arr.push(showData)

        this.tableData = arr
    },

    //文案说明
    getTitleExplain: function () {
        let dropdownActive = obj.dropdownActive
        let spotInfo = obj.spotInfo
        let tabelList = obj.tabelList

        return m('div', { class: "inf_dropdown inf_body_conent" }, [
            m('div', { class: "inf_body_title_font" }, [
                (tabelList[dropdownActive]?tabelList[dropdownActive].label : "--") + ' 合约明细'
            ]),
            m('div', { class: "inf_body_TD" }, [
                (tabelList[dropdownActive]?tabelList[dropdownActive].label : "--") + '合约' + (spotInfo.ExpireStr == 0?"没有到期日":spotInfo.ExpireStr) + '。每张合约大小' + spotInfo.LotSz + '。每' + '8' + '小时交换资金费用。下一个交换将发生在' + spotInfo.FundingNext + '。'
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
                (tabelList[dropdownActive]?tabelList[dropdownActive].label : "--") + ' 行情价格'
            ]),
            m('div', { class: " inf_body_kline kline_border" }, [
                m(kline)
            ]),
        ])
    },

    //合约详解
    getFutureIntroduce: function () {
        let dropdownActive = obj.dropdownActive
        let spotInfo = obj.spotInfo
        let tabelList = obj.tabelList
        return m('div', { class: "inf_dropdown inf_body_conent" }, [
            // title
            m('div', { class: "inf_body_title_font inf_dropdown" }, [
                // `${tabelList[dropdownActive]?tabelList[dropdownActive].label : "--"}合约详解`
                (tabelList[dropdownActive]?tabelList[dropdownActive].label : "--") + ' 合约详解'
            ]),
            // list
            m('div', { class: `` }, obj.contractList.map((item, index) => {
                let info = item.info
                return m('div', { class: "columns inf_columns" +(index % 2 == 0 ? ' is-active-bg1' : '') }, [
                    m('div', { class: "column is-3" }, [item.name]),
                    m('div', { class: "column is-6" }, [item.info])
                ])
            })
            )
        ])
    },
    //table
    getTableView () {
        let dropdownActive = obj.dropdownActive
        let spotInfo = obj.spotInfo
        let tabelList = obj.tabelList
        return m('div', { class: "inf_dropdown inf_body_conent" }, [
            // title
            m('div', { class: "inf_body_title_font inf_dropdown" }, [
                // `${tabelList[dropdownActive]?tabelList[dropdownActive].label : "--"}合约风险限额`
                (tabelList[dropdownActive]?tabelList[dropdownActive].label : "--") + ' 合约风险限额'
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
    },
    oncreate: function (vnode) {
        obj.initEVBUS()
        obj.initSymList()
        obj.updateSpotInfo()
    },
    view: function (vnode) {
        return m("div", { class: "" }, [
            m('div', { class: "inf_dropdown" }, [
                m('span', { class: "inf_body_span inf_body_font" }, [
                    '合约',
                ]),
                //下拉列表
                obj.getDownloadFuture(vnode),
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