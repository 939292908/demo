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
    tabsList:[
        "全部","USDT","BTC","ETH","UT"
    ],
    tabsActive:0,
    tabsListOpen: false,
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
    getOptions:function (val){
        this.navCoinInfo.Coin = val
        console.log(val,"币种名称")

    },
    //重置按钮
    resetNavDrawerInfo:function(){
        obj.navCoinInfo.Coin = "全部";
        obj.navCoinInfo.Stat = "全部";
        obj.initObj()
        obj.tabsActive = 0;
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
    closeLeverageMode: function(){
        this.setType = false
    },
    setTabsActive: function(param){
        this.tabsActive = param
    },
    getTabsList: function(){
        return this.tabsList.map(function(item,i){
            return m("p",{class:"a-text-left"+(obj.tabsActive == i?' is-active':'')},[
                m("a",{class:"has-text-black",key: "orderListTabsItem"+i, class:"", href:"javascript:void(0);", onclick: function(){
                    obj.setTabsActive(i)
                    obj.tabsListOpen = !obj.tabsListOpen
                    obj.getOptions(obj.tabsList[obj.tabsActive])
                }},[
                    item
                ])
            ])
        })
    },
    getTabsList: function(){
        return this.tabsList.map((item, i)=>{
            return m('dev', {key: 'dropdown-item'+item+i, class: ""}, [
                // m('hr', {class: "dropdown-divider "}),
                m('a', { href: "javascript:void(0);", class: "dropdown-item"+(obj.tabsActive == i?' has-text-primary':''), onclick: function(){
                    obj.setTabsActive(i)
                    obj.tabsListOpen = !obj.tabsListOpen
                    obj.getOptions(obj.tabsList[obj.tabsActive])
                }},[
                    item
                ])
            ])
            
        })
    },
    getSelectOptions:function (){
        return m('div', {class: 'pub-set-lever'}, [
            m("div", { class: "modal" + (obj.setType ? " is-active" : ''), }, [
                m("div", { class: "modal-background" }),
                m("div", { class: "modal-card" }, [
                m("header", { class: "pub-set-lever-head modal-card-head modal-card-body-list" }, [
                    m("p", { class: "modal-card-title" }, [
                        '筛选'
                        ]),
                    m("button", {class: "delete", "aria-label": "close", onclick: function () {
                        obj.closeLeverageMode()
                    }
                    }),
                ]),
                m("section", { class: "pub-set-lever-content modal-card-body modal-card-body-list" }, [
                    m("div",{class : "search-bi-name"},[
                        m("p",{class : "search-bi-name-p"},[
                            "币种名称"
                        ]),
                        m("div",{class:" pub-place-order-m pub-order-m"},[
                            m('div', {class: "dropdown pub-place-order-select is-hidden-desktop" + (obj.tabsListOpen?' is-active':'')}, [
                                m('.dropdown-trigger', {}, [
                                    m('button', {class: "button is-white is-fullwidth",'aria-haspopup':true, "aria-controls": "dropdown-menu2", onclick: function(e){
                                        obj.tabsListOpen = !obj.tabsListOpen
                                    }}, [
                                        m('div', {}, [
                                            m('span',{ class: "",id:"selectId"}, obj.tabsList[obj.tabsActive]),
                                            m('span', {class: "icon "},[
                                                m('i', {class: "iconfont iconxiala has-text-primary", "aria-hidden": true })
                                            ]),
                                        ])
                                    ]),
                                ]),
                                m('.dropdown-menu', {class:"scroll-y", id: "dropdown-menu2", role: "menu"}, [
                                    m('.dropdown-content', {class:"has-text-centered"}, [
                                        obj.getTabsList()
                                    ]),
                                ]),
                            ]),
                        ])

                    ]),
                    m("div",{class : "search-bi-name"},[
                        m("p",{class : "search-bi-name-p"},[
                            "类型"
                        ]),
                        m("div",{class : "search-k-d"},[
                            obj.type.map(function (item,i){
                                return m("a",{class : "button is-primary is-outlined button-styl",onclick:function(i){
                                    obj.navCoinInfo.Stat = item.name
                                    console.log(obj.navCoinInfo.Stat,"类型")
                                }},[
                                    item.name
                                ])
                            })
                        ]),
                    ])
                ]),
                m("footer", { class: "pub-set-lever-foot modal-card-foot modal-card-body-list" }, [
                    m("div",{class : "reset-complete"},[
                        m("a",{class : "reset-button button is-primary is-outlined", onclick:function(){
                            obj.resetNavDrawerInfo()
                        }},[
                            "重置"
                        ]),
                        m("a",{class : "reset-button button is-primary is-outlined",onclick:function (){
                            obj.submitNavDrawer()
                        }},[
                            "完成"
                        ]),
                    ])
                ])
            ]),
            ])
        ])
    },
    getContentList: function () {
        return m("div",{class : "delegation-list"},[
            m("div",{class : "delegation-list-header"},[
                m("nav",{class:"pub-layout-m-header is-fixed-top navbar is-transparent", role:"navigation", "aria-label":"main navigation"},[
                    m('div', {class:"navbar-brand is-flex"}, [
                        m('a', {class:"navbar-item"}, [
                            m('a', {class:"",href:"/#!/future",onclick :function(){
                                obj.resetNavDrawerInfo()
                            }}, [
                                m('span', {class:"icon icon-right-i"}, [
                                    m('i', {class:"iconfont iconarrow-left has-text-black"}),
                                ]),
                            ]),
                        ]),
                        m('.spacer'),
                        m("p",{class : "delegation-list-phistory navbar-item has-text-black"},[
                            "合约账单"
                            ]),
                        m('.spacer'),
                        m('a', {class:"navbar-item"}, [
                            m('a', {class:"icon icon-right-i navbar-item transform-for-icon",onclick: function(){
                                obj.setType = true
                            }}, [
                                m('i', {class:"iconfont icontoolbar-side"}),
                            ]),
                        ]),
                    ]),
                ]),
            ]),
            // 搜索框
            obj.getSelectOptions(),

            m("div",{class : "pub-trade-list  pub-layout-m"},[
            this.list.length !=0?
            this.list.map(function (item, i) {
                return m("div",{ key: "historyOrdtHeadItem" + i, class: "card"},[
                    m("div",{class : "card-content mobile-list"},[
                    //顶部排列
                    m("div",{class : "mobile-div has-text-black"},[
                        item.Coin,
                        m("span",{class : "mobile-font has-text-black"},[
                        item.ViaStr 
                        ]),
                    ]),
                    m("hr",{class :""}),
                    //底部排列
                    m("div",{class : "theadList-profit-loss" },[
                        m("div",{class  : "theadList-profit-loss-p1"},[
                            "金额：" ,
                            m("p",{class : "" + item.Qty>0?"has-text-danger" : "has-text-primary"},[
                                item.Qty
                            ])
                        ]),
                        m("div",{class  : "theadList-time"},[
                            "时间：" ,
                            m("p",{class : ""},[
                                item.AtStr
                            ])
                        ]),
                    ]),
                ])
            ])
            }):m("div",{class : "text-none has-text-grey-light"},[
                m("i",{class : "iconfont icon-box" ,style:"font-size: 60px",},[
                    
                ]),
                "暂无账单记录"
            ])
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