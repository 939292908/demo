var m = require("mithril")
let obj = {
    list: [],
    setType : false,
    navCoinInfo:{
        Coin: '全部',
        Stat: '全部',
    },
    oldNavCoinInfo:{
        Coin: '全部',
        Stat: '全部',
    },
    theadList: [
        {
            title: '币种',
            class: ""
        }, {
            title: '类型',
            class: ""
        }, {
            title: '金额',
            class: ""
        }, {
            title: '时间',
            class: ""
        }
    ],
    type:[
        {
            name:"全部"
        },
        {
            name:"强制平仓"
        },
        {
            name:"自动减仓"
        },
        {
            name:"交割结算"
        },
        {
            name:"平仓盈亏"
        },
        {
            name:"手续费"
        },
        {
            name:"账户划入"
        },
        {
            name:"账户划出"
        },
        {
            name:"资金费用"
        },
        {
            name:"合约赠金"
        },
    ],
    biName : [
        {
            name:"全部"
        },
        {
            name:"USDT"
        },
        {
            name:"BTC"
        },
        {
            name:"ETH"
        },
        {
            name:"UT"
        },
    ],
    //初始化全局广播
    initEVBUS: function () {
        let that = this

        if (this.EV_GET_WLT_LOG_READY_unbinder) {
            this.EV_GET_WLT_LOG_READY_unbinder()
        }
        this.EV_GET_WLT_LOG_READY_unbinder = window.gEVBUS.on(gTrd.EV_GET_WLT_LOG_READY, arg => {
            that.initObj()
        })
        if (this.EV_WEB_LOGOUT_unbinder) {
            this.EV_WEB_LOGOUT_unbinder()
        }
        this.EV_WEB_LOGOUT_unbinder = window.gEVBUS.on(gWebAPI.EV_WEB_LOGOUT, arg => {
            that.initObj()
        })

    },
    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_GET_WLT_LOG_READY_unbinder) {
            this.EV_GET_WLT_LOG_READY_unbinder()
        }
        if (this.EV_WEB_LOGOUT_unbinder) {
            this.EV_WEB_LOGOUT_unbinder()
        }
    },
    getHistoryList: function () {
        let that = this
        let s = window.gTrd
        let aType = '01'
        let Sym = window.gMkt.CtxPlaying.Sym
        let AssetD = window.gMkt.AssetD[Sym] || {}
        if (AssetD.TrdCls == 1) {
            aType = '02'
        } else {
            aType = '01'
        }
        let uid = s.RT["UserId"]
        let isReq = s.trdInfoStatus.wltLog[aType]
        if (!uid || !s || isReq) return
        s.getHistoryOrdAndTrdAndWltlog({
            AId: uid + aType,
        })
    },
    initObj: function () {
        let WltLog = window.gTrd.WltLog['01']

        let list = []
        for (let k of WltLog) {
            let item = {}
            utils.copyTab(item, k)


            //金额
            item.Qty = Number(item.Qty || 0).toPrecision2(6, 8)

            item.ViaStr = utils.WltViaStr(item.Via)

            item.AtStr = new Date(item.At).format('MM/dd hh:mm:ss'),

                list.push(item)
        }
        list.sort(function (a, b) {
            return b.At - a.At
        })
        // this.list = list
        //根据 obj.navCoinInfo 筛选this.list数据
        if(this.navCoinInfo.Coin == this.oldNavCoinInfo.Coin && this.navCoinInfo.Stat == this.oldNavCoinInfo.Stat){
            this.list = list
            console.log(list,"原始未改变数据")
        }else if(this.navCoinInfo.Coin != this.oldNavCoinInfo.Coin && this.navCoinInfo.Stat == this.oldNavCoinInfo.Stat){
            let newList = []
            for (let i=0; i<list.length;i++){
                if(list[i].Coin == this.navCoinInfo.Coin){
                    newList.push(list[i])
                }   
            }
            this.list = newList
            console.log(newList,"币种名称选择后数据")
        }else if(this.navCoinInfo.Coin == this.oldNavCoinInfo.Coin && this.navCoinInfo.Stat != this.oldNavCoinInfo.Stat){
            let newList = []
            for (let i=0; i<list.length;i++){
                if(list[i].ViaStr == this.navCoinInfo.Stat){
                    newList.push(list[i])
                }   
            }
            this.list = newList
            console.log(newList,"类型选择后数据")
        }else if(this.navCoinInfo.Coin != this.oldNavCoinInfo.Coin && this.navCoinInfo.Stat != this.oldNavCoinInfo.Stat){
            let newList = []
            for (let i=0; i<list.length;i++){
                if(list[i].ViaStr == this.navCoinInfo.Stat && list[i].Coin == this.navCoinInfo.Coin){
                    newList.push(list[i])
                }   
            }
            this.list = newList
            console.log(newList,"币种名称和类型选择后数据")
        }

    },
    getTheadItem: function () {
        return this.theadList.map(function (item, i) {
            return m("th", { key: "historyOrdtHeadItem" + i, class: "" + item.class }, [
                item.title
            ])
        })
    },
    getListItem: function () {
        return this.list.map(function (item, i) {
            return m("tr", { key: "historyOrdTableListItem" + i, class: "" }, [

                m("td", { class: "" }, [
                    m("p", { class: " " }, [
                        item.Coin
                    ])
                ]),
                m("td", { class: " " }, [
                    item.ViaStr
                ]),
                m("td", { class: " " }, [
                    item.Qty
                ]),
                m("td", { class: "" }, [
                    item.AtStr
                ])
            ])
        })
    },

    //移动端列表
    getOptions:function (){
        let selectId =document.getElementById("selectId")
        let val = selectId.options[selectId.selectedIndex].innerHTML
        this.navCoinInfo.Coin = val
        console.log(val,"币种名称")

    },
    //重置按钮
    resetNavDrawerInfo:function(){
        obj.navCoinInfo.Coin = "全部";
        obj.navCoinInfo.Stat = "全部";
        obj.initObj()
        let selectId = document.getElementById("selectId");
        selectId.options.selectedIndex = 0;
    },
    //提交按钮
    submitNavDrawer:function(){
        let that = this
        obj.initObj()
        setTimeout(function(){
            that.setType = false
        },200)
        console.log(obj.navCoinInfo,"选择后状态")
    },

    getContentList: function () {
        return m("div",{class : "delegation-list"},[
            m("div",{class : "delegation-list-header"},[
                m('a', {class:"",href:"/#!/future"}, [
                    m('span', {class:"icon is-medium", }, [
                    m('i', {class:"iconfont iconarrow-left"}),
                    ]), 
                ]),
                m("p",{class : "delegation-list-phistory"},[
                    "合约账单"
                ]),
                m('a', {class:"icon is-medium transform-for-icon",onclick: function(){
                    obj.setType = true
                }}, [
                    m('i', {class:"iconfont icontoolbar-side"}),
                ]),
            ]),
            //搜索框
            obj.setType ?m("div",{class : "search-bar"},[
                m("div",{class : "search-bar-header"},[
                    m("div",{class : "search-gmex"},[
                        "Gmex"
                    ]),
                    m("button", {class: "delete", "aria-label": "close",onclick: function(){
                        obj.setType = false
                    }}),
                ]),
                m("div",{class : "search-bi-name"},[
                    m("p",{class : "search-bi-name-p"},[
                        "币种名称"
                    ]),
                    m("div",{class : "search-k-d select is-small",onchange:function(){
                        obj.getOptions()
                    }},[
                        m("select",{class : "select-sty",style:"select",id:"selectId"},[
                            obj.biName.map(function (item,i){
                                return m("option",{class : "option-list"},[
                                    item.name
                                ])
                            })
                        ])
                    ]),
                ]),
                m("div",{class : "search-bi-name"},[
                    m("p",{class : "search-bi-name-p"},[
                        "类型"
                    ]),
                    m("div",{class : "search-k-d"},[
                        obj.type.map(function (item,i){
                            return m("a",{class : "button is-primary is-outlined is-small",onclick:function(i){
                                obj.navCoinInfo.Stat = item.name
                                console.log(obj.navCoinInfo.Stat,"类型")
                            }},[
                                item.name
                            ])
                        })
                    ]),
                ]),
                m("div",{class : "reset-complete"},[
                    m("a",{class : "reset-button button is-primary is-outlined is-small", onclick:function(){
                        obj.resetNavDrawerInfo()
                    }},[
                        "重置"
                    ]),
                    m("a",{class : "reset-button button is-primary is-outlined is-small",onclick:function (){
                        obj.submitNavDrawer()
                    }},[
                        "完成"
                    ]),
                ])
            ]):"",  
            this.list.length !=0?    
            this.list.map(function (item, i) {
                return m("div",{ key: "historyOrdtHeadItem" + i, class: "mobile-list "},[
                    //顶部排列
                    m("div",{class : "mobile-div"},[
                        item.Coin,
                        m("span",{class : "mobile-font"},[
                        item.ViaStr 
                        ]),
                    ]),
                    //底部排列
                    m("div",{class : "theadList-profit-loss" ,style : "font-size: 10px"},[
                        m("div",{class  : "theadList-profit-loss-p1"},[
                            "金额：" ,
                            m("p",{class : "font-color-2"},[
                                item.Qty
                            ])
                        ]),
                        m("div",{class  : "theadList-time"},[
                            "时间：" ,
                            m("p",{class : "font-color"},[
                                item.AtStr
                            ])
                        ]),
                    ]),
                ])
            }):m("div",{class : "text-none"},[
                m("i",{class : "iconfont icon-box" ,style:"font-size: 60px",},[
                    
                ]),
                "暂无账单记录"
            ])
        ])
    },
    getContent: function () {
        if (window.isMobile) {
            return obj.getContentList()
        } else {
            let colgroup = m('colgroup', {}, [
                m('col', { name: "pub-table-1", width: '25%' }),
                m('col', { name: "pub-table-2", width: '25%' }),
                m('col', { name: "pub-table-3", width: '25%' }),
                m('col', { name: "pub-table-4", width: '25%' }),
            ])
            return m('div', { class: " table-container" }, [

                m('div', { class: "pub-table-head-box", style: "width: 890px" }, [
                    m("table", { class: "table is-hoverable ", width: '890px', cellpadding: 0, cellspacing: 0 }, [
                        colgroup,
                        m("tr", { class: "" }, [
                            obj.getTheadItem()
                        ])
                    ]),
                ]),
                m('div', { class: "pub-table-body-box", style: "width: 890px" }, [
                    m("table", { class: "table is-hoverable ", width: '890px', cellpadding: 0, cellspacing: 0 }, [
                        colgroup,
                        obj.getListItem()
                    ])
                ]),
            ])
        }
    },
}

export default {
    oninit: function (vnode) {

    },
    oncreate: function (vnode) {
        obj.initEVBUS()
        obj.getHistoryList()
        obj.initObj()
    },
    view: function (vnode) {

        return m("div", { class: "pub-history-trade " }, [
            obj.getContent()
        ])
    },
    onbeforeremove: function () {
        obj.rmEVBUS()
    }
}