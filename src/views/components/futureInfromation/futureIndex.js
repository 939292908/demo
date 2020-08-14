var m = require("mithril")
import Dropdown from '../common/Dropdown'
import Table from '../common/Table'
import kline from '../market/kline'



let obj = {
    showMenuContract: false,
    showMenuExponent: false,
    // 指数下拉选中   
    exponentId: 0,
    // 指数下拉
    exponentList: [],
    //已订阅的行情列表
    oldSubArr:[],
    //行情广播数据
    tableData:[],
    //行情广播列表
    tableList:[],
    SymList: ['CI_ETH'],
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

        //指数详情全局广播
        if (this.EV_COMPOSITEINDEX_UPD_unbinder) {
            this.EV_COMPOSITEINDEX_UPD_unbinder()
        }
        this.EV_COMPOSITEINDEX_UPD_unbinder = window.gEVBUS.on(gMkt.EV_COMPOSITEINDEX_UPD, arg => {
            that.initSymList()
            that.subTick()
            that.setSymName()
        })
        //指数行情全局广播
        if(this.EV_INDEX_UPD_unbinder){
            this.EV_INDEX_UPD_unbinder()
        }
        this.EV_INDEX_UPD_unbinder = window.gEVBUS.on(gMkt.EV_INDEX_UPD,arg=> {
            let exponentId = this.exponentId
            let Sym = this.exponentList[exponentId] && this.exponentList[exponentId].name || null
            if(arg.Sym = Sym){
                that.tableData = arg.data.RefThirdParty
                that.getTableData()
            }
        })
        
    },

    rmEVBUS: function(){
        //指数详情全局广播
        if (this.EV_COMPOSITEINDEX_UPD_unbinder) {
            this.EV_COMPOSITEINDEX_UPD_unbinder()
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
        let barr = []
        arr.map((item,i)=>{
            barr[i] = item.name
        })
        this.SymList = barr
    },
    //订阅指数行情
    subTick:function(){
        let exponentId = this.exponentId
        let Sym = this.exponentList[exponentId] && this.exponentList[exponentId].name || null
        if(Sym){
            let subArr = []
            subArr = subArr.concat(utils.setSubArrType('index',[Sym]))
            window.gMkt.ReqSub(subArr)
            this.oldSubArr = subArr
        }
        m.redraw();
    },
    //清除订阅指数行情
    unSubTick(){
        let oldSubArr = this.oldSubArr
        window.gMkt.ReqUnSub(oldSubArr)
    },

    //改变选中id
    changeId:function(itme){
        this.exponentId = itme.id
        //先清除之前的广播数据
        this.unSubTick()
        //再订阅指数行情广播
        this.subTick()
        //初始化指数数据
        this.getTableData()
        this.setSymName()
    },
    //当前选中合约名称广播
    setSymName:function(){
        let exponentId = this.exponentId
        let Sym = this.SymList[exponentId]
        gEVBUS.emit(gMkt.EV_CHANGESYM_UPD, { Ev: gMkt.EV_CHANGESYM_UPD, Sym: Sym })
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
        let tableKeys = Object.keys(this.tableData)
        let exponentId = this.exponentId
        let Sym = this.exponentList[exponentId].vie
        let tableList = []
        tableKeys.map((itme)=>{
            let d = {
                jys: itme,
                hbd: Sym + "/USDT",
                dqbj: (this.tableData[itme].prz).toFixed2(2),
                qz: "1/" + tableKeys.length
            }
            tableList.push(d)
        })
        this.tableList = tableList
    },
}


export default {
    oninit: function (vnode) {
        obj.initLanguage()
        
    },
    oncreate: function (vnode) {
        obj.initEVBUS()
        obj.subTick()
        obj.initSymList()
        //延时操作
        setTimeout(()=>{
            obj.unSubTick()
            obj.setSymName()
        },0)
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
                        showMenu: obj.showMenuExponent,
                        setShowMenu: type => obj.showMenuExponent = type,
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
                    (obj.exponentList[exponent] ? obj.exponentList[exponent].vie :"--") + "指数跟踪" + (obj.exponentList[exponent] ? obj.exponentList[exponent].vie :"--") + "/USDT币币价格，该指数代表了标的资产的市场共识价格，其价格源自于多个现货交易所。通过数据可用性验证的参考交易所报价，将经过加权计算后得到最终的指数。具体参考交易所报价的来源和权重，请参考下面的“指数成分分解”。"
                ])
            ]),
            // k线
            m('div', { class: `futureIndex-kline inf_dropdown inf_body_conent` }, [
                m('div', { class: `inf_body_title_font` }, [
                    (obj.exponentList[exponent] ? obj.exponentList[exponent].vie :"--") + '指数历史价值'
                ]),
                m('div', { class: " inf_body_kline kline_border" }, [
                    m(kline)
                ]),
            ]),
            // 表格
            m('div', { class: `futureIndex-table inf_dropdown inf_body_conent` }, [
                m('div', { class: `inf_body_title_font` }, [
                    (obj.exponentList[exponent] ? obj.exponentList[exponent].vie :"--") + '指数成分分解'
                ]),
                // table
                m(Table, {
                    columns: obj.tableColumns,
                    data: obj.tableList,
                    defaultColumnWidth: "25%"
                })
            ]),
        ])
    },
    onremove: function(){
        obj.rmEVBUS()
    }
}