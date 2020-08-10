var m = require("mithril")
import Dropdown from '../common/Dropdown'
import Table from '../common/Table'



let obj = {
    // 指数下拉选中   
    exponentId: 0,
    // 指数下拉
    exponentList: [],
    //已订阅的行情列表
    oldSubArr:[],
    //行情广播数据
    tableData:[],
    //合约名称列表
    futureSymList: [],
    // 表头
    tableColumns: [
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
    ],

    //初始化全局广播
    initEVBUS: function(){
        let that = this

        //assetD合约详情全局广播
        if (this.EV_ASSETD_UPD_unbinder) {
            this.EV_ASSETD_UPD_unbinder()
        }
        this.EV_ASSETD_UPD_unbinder = window.gEVBUS.on(gMkt.EV_ASSETD_UPD, arg => {
            that.initSymList()
            that.subTick()
        })

        //页面交易类型全局广播
        if (this.EV_PAGETRADESTATUS_UPD_unbinder) {
            this.EV_PAGETRADESTATUS_UPD_unbinder()
        }
        this.EV_PAGETRADESTATUS_UPD_unbinder = window.gEVBUS.on(gMkt.EV_PAGETRADESTATUS_UPD, arg => {
            
            that.initSymList()
            that.subTick()
        })
        //指数行情全局广播
        if(this.EV_INDEX_UPD_unbinder){
            this.EV_INDEX_UPD_unbinder()
        }
        this.EV_INDEX_UPD_unbinder = window.gEVBUS.on(gMkt.EV_INDEX_UPD,arg=> {
            // console.log(arg,33333333333)
            that.tableData = arg.data.RefThirdParty
            console.log(arg.data.RefThirdParty,2222222222)
            console.log(that.tableData,333333333)
            that.subTick()
            that.getTableData()
        })
        //当前选中合约变化全局广播
        if(this.EV_CHANGESYM_UPD_unbinder){
            this.EV_CHANGESYM_UPD_unbinder()
        }
        this.EV_CHANGESYM_UPD_unbinder = window.gEVBUS.on(gMkt.EV_CHANGESYM_UPD,arg=> {
            that.unSubTick()
            that.subTick()
        })
    },

    rmEVBUS: function(){
        //assetD合约详情全局广播
        if (this.EV_ASSETD_UPD_unbinder) {
            this.EV_ASSETD_UPD_unbinder()
        }
        //页面交易类型全局广播
        if (this.EV_PAGETRADESTATUS_UPD_unbinder) {
            this.EV_PAGETRADESTATUS_UPD_unbinder()
        }
        //当前选中合约变化全局广播
        if(this.EV_CHANGESYM_UPD_unbinder){
            this.EV_CHANGESYM_UPD_unbinder()
        }
        //指数行情全局广播
        if(this.EV_INDEX_UPD_unbinder){
            this.EV_INDEX_UPD_unbinder()
        }
    },


    //初始化币币列表
    initSymList: function () {
        let currencyIndex = window.gMkt.currencyIndex
        let arr = []
        arr = currencyIndex.filter(itme=> !itme.includes("GMEX"))
        arr = arr.map((itme,i)=>{
            return {
                id: i,
                label: itme.split("_")[1] + " 币币指数",
                name: itme,
                vie: itme.split("_")[1]
            }  
        })
        this.exponentList = arr
    },
    //订阅指数行情
    subTick:function(){
        let exponentId = this.exponentId
        let Sym = this.exponentList[exponentId] && this.exponentList[exponentId].name || null
        if(Sym){
            let subArr = utils.setSubArrType('tick',[Sym])
            subArr = subArr.concat(utils.setSubArrType('trade',[Sym]))
            subArr = subArr.concat(utils.setSubArrType('order20',[Sym]))
            subArr = subArr.concat(utils.setSubArrType('index',[utils.getGmexCi(window.gMkt.AssetD, Sym)]))
            window.gMkt.ReqSub(subArr)
            this.oldSubArr = subArr
        }
        m.redraw();
    },
    unSubTick(){
        let oldSubArr = this.oldSubArr
        window.gMkt.ReqUnSub(oldSubArr)
    },

    //改变选中id
    changeId:function(itme){
        this.exponentId = itme.id
        this.subTick()
    },

    // 初始化多语言
    initLanguage () {
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
        console.log(this.tableData,1111111)
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
        // obj.getTableData()
    },
    oncreate: function (vnode) {
        obj.initEVBUS()
        obj.subTick()
        obj.initSymList()
    },
    view: function (vnode) {
        let exponent = obj.exponentId
        return m("div", { class: "" }, [
            // 下拉筛选
            m('div', { class: `futureIndex-filter is-flex` }, [
                // 指数下拉列表
                m('div', { class: "inf_dropdown" }, [
                    m('span', { class: "inf_body_span inf_body_font" }, ['指数']),
                    m(Dropdown, {
                        activeId: cb => cb(obj, 'exponentId'),
                        onClick (itme) {
                            obj.changeId(itme)
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
                    // 'BTC币币指数'
                    obj.exponentList[exponent] ? obj.exponentList[exponent].label :"--"
                ]),
                m('div', { class: `inf_body_TD` }, [
                    (obj.exponentList[exponent] ? obj.exponentList[exponent].label :"--") + "指数跟踪" + (obj.exponentList[exponent] ? obj.exponentList[exponent].vie :"--") + "/USDT币币价格，该指数代表了标的资产的市场共识价格，其价格源自于多个现货交易所。通过数据可用性验证的参考交易所报价，将经过加权计算后得到最终的指数。具体参考交易所报价的来源和权重，请参考下面的“指数成分分解”。"
                ])
            ]),
            // k线
            m('div', { class: `futureIndex-kline inf_dropdown inf_body_conent` }, [
                m('div', { class: `inf_body_title_font` }, [
                    (obj.exponentList[exponent] ? obj.exponentList[exponent].vie :"--") + '指数历史价值'
                ]),
                m('div', { class: `` }, ["k线box"])
            ]),
            // 表格
            m('div', { class: `futureIndex-table inf_dropdown inf_body_conent` }, [
                m('div', { class: `inf_body_title_font` }, [
                    (obj.exponentList[exponent] ? obj.exponentList[exponent].vie :"--") + '指数成分分解'
                ]),
                // table
                m(Table, {
                    columns: obj.tableColumns,
                    data: obj.tableData,
                    defaultColumnWidth: "25%"
                })
            ]),
        ])
    },
    onremove: function(){
        obj.rmEVBUS()
    }
}