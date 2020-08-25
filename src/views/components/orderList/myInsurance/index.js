// 我的保险
var m = require("mithril")
import Table from '../../common/Table' // 表格
import Dropdown from '../../common/Dropdown' // 下拉
import CompensateModal from './components/CompensateModal' // 申请赔付弹框
import DetailModal from './components/DetailModal' // 详情弹框
import BuyModal from './components/BuyModal' // 买保险弹框
let obj = {
    showMenu: false,
    dropdownActive: 1, // 下拉选中
    tableColumns: [], // 表头
    tableData: [], // 表格
    isShowDetailModal: false, // 详情 弹框
    isShowCompensateModal: false, // 申请赔付 弹框
    isShowBuyModal: true, // 买保险 弹框
    currentCompensateData: {}, // 申请赔付 点击的data
    // 申请赔付 click
    onCompensateClick(params) { 
        obj.currentCompensateData = params
        obj.isShowCompensateModal = true
    },
    //初始化全局广播
    initEVBUS () {
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
    // 初始化多语言
    initLanguage () {
        this.tableColumns = [
            {
                title: '保险状态',
                key: 'state',
                width: 200,
                className: 'baoxian',
                align: 'left',
                render (params) {
                    let btn = [
                        m('button', { class: `button is-primary `, style: "width: 96px;" }, params.state == 0 ? gDI18n.$t('10632' /*"申请赔付"*/) : "审核中")
                    ]
                    return m('div', {
                        class: `baoxian-hehe`, onclick () {
                            console.log(params, "row数据");
                            
                            obj.onCompensateClick(params)
                        }
                    }, btn)
                }
            },
            {
                title: gDI18n.$t('10053'), //'合约',
                key: 'sym'
            },
            {
                title: gDI18n.$t('10172'), //'方向',
                key: 'direction'
            },
            {
                title: gDI18n.$t('10054'), //'杠杆',
                key: 'lever'
            },
            {
                title: gDI18n.$t('10087'), //'数量',
                key: 'num'
            },
            {
                title: '开仓价格',
                key: 'openPic'
            },
            {
                title: '平仓价格',
                key: 'closePic'
            },
            {
                title: gDI18n.$t('10062'), //'平仓盈亏',
                key: 'closeProfitAndLoss'
            },
            {
                title: gDI18n.$t('10063'), //'手续费',
                key: 'commissionCharge'
            },
            {
                title: '保险金额（USDT）',
                key: 'insuranceAmount'
            },
            {
                title: '赔付金额（USDT）',
                key: 'compensationAmount'
            },
            {
                title: '开仓时间',
                key: 'openTime'
            },
            {
                title: '平仓时间',
                key: 'closeTime'
            },
            {
                title: '订单编号',
                key: 'orderNum'
            },
        ]
    },
    //删除全局广播
    rmEVBUS () {
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
    // 初始化 数据
    initObj () {
        let tableData = [
            {
                state: 0,
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
            {
                state: 1,
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
            {
                state: 1,
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
            {
                state: 0,
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
            {
                state: 0,
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
            {
                state: 0,
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
            {
                state: 0,
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
            {
                state: 0,
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
            {
                state: 0,
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
            {
                state: 0,
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
            {
                state: 0,
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
            {
                state: 0,
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
            {
                state: 0,
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
            {
                state: 0,
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
        this.tableData = tableData
    },
    // 组件内容 m/pc 端
    getContent () {
        if (window.isMobile) {
            return []
        } else {
            return [
                // top
                m('div', { class: `my-insurance-top is-flex has-text-1` }, [
                    m('div', { class: `my-insurance-top-item`,onclick(){obj.isShowDetailModal = true} }, [
                        "保险金额：1000 USDT"
                    ]),
                    m('div', { class: `my-insurance-top-item`,onclick(){obj.isShowBuyModal = true} }, [
                        "赔付金额：1000 USDT"
                    ]),
                    m('.spacer'),
                    m('div', { class: `` }, [
                        m( Dropdown, {
                            class: 'my-insurance-dropdown',
                            activeId: cb => cb(obj, 'dropdownActive'),
                            showMenu: obj.showMenu,
                            setShowMenu: type => obj.showMenu = type,
                            menuWidth:110,
                            onClick (itme) {
                                console.log(itme);
                            },
                            getList () {
                                return [
                                    {
                                        id: 1,
                                        label: "全部"
                                    },
                                    {
                                        id: 2,
                                        label: "未申请"
                                    },
                                    {
                                        id: 3,
                                        label: "审核中"
                                    },
                                    {
                                        id: 4,
                                        label: "已结束"
                                    },
                                    {
                                        id: 5,
                                        label: "审核失败"
                                    },
                                    {
                                        id: 6,
                                        label: "用户撤单"
                                    },
                                    {
                                        id: 7,
                                        label: "购买失败"
                                    },
                                ]
                            }
                        })
                    ])
                ]),
                // 表格
                m(Table, {
                    columns: obj.tableColumns,
                    data: obj.tableData
                }),
                // 申请赔付 弹框
                m(CompensateModal, {
                    isShow: obj.isShowCompensateModal,
                    data: obj.currentCompensateData,
                    onClose: () => obj.isShowCompensateModal = false, // 关闭事件
                    onOk: () => { // 确定事件
                        console.log('确定了！！！！！');
                        
                    }
                }),
                // 详情 弹框
                m(DetailModal, {
                    isShow: obj.isShowDetailModal,
                    onClose () {
                        obj.isShowDetailModal = false
                    }
                }),
                // 买保险 弹框
                m(BuyModal, {
                    isShow: obj.isShowBuyModal,
                    onClose () {
                        obj.isShowBuyModal = false
                    }
                })
            ]
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
        return m("div", { class: "my-insurance" }, obj.getContent())
    },
    onremove () {
        obj.rmEVBUS()
    }
}