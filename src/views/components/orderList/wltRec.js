var m = require("mithril")
// Header
import Header from "../common/Header_m"
import Modal from "../common/Modal"

let obj = {
    list: [],
    newList:[],
    newLenget: 0,
    scrollList:[],
    //行情限制数据处理时间间隔
    TRADECLACTNTERVAL: 100,
    //成交最后更新时间
    lastTmForTrade: 0,
    updateTradeTimer: null,

    setType : false,
    navCoinInfo:{
        Coin: gDI18n.$t('10394'),//'全部',
        Stat: gDI18n.$t('10394'),//'全部',
    },
    oldNavCoinInfo:{
        Coin: gDI18n.$t('10394'),//'全部',
        Stat: gDI18n.$t('10394'),//'全部',
    },
    theadList: [
        {
            title: gDI18n.$t('10420'),//'币种',
            class: ""
        }, {
            title: gDI18n.$t('10102'),//'类型',
            class: ""
        }, {
            title: gDI18n.$t('10421'),//'金额',
            class: ""
        }, {
            title: gDI18n.$t('10103'),//'时间',
            class: ""
        }
    ],
    tabsList:[
        gDI18n.$t('10394'),//"全部",
        "USDT",
        "BTC",
        "ETH",
        "UT"
    ],
    tabsActive:0,
    tabsListOpen: false,
    type:[
        {
            name: gDI18n.$t('10394')//"全部"
        },
        {
            name: gDI18n.$t('10385')//"强制平仓"
        },
        {
            name: gDI18n.$t('10386')//"自动减仓"
        },
        {
            name: gDI18n.$t('10387')//"交割结算"
        },
        {
            name: gDI18n.$t('10062')//"平仓盈亏"
        },
        {
            name: gDI18n.$t('10063')//"手续费"
        },
        {
            name: gDI18n.$t('10389')//"账户划入"
        },
        {
            name: gDI18n.$t('10390')//"账户划出"
        },
        {
            name: gDI18n.$t('10391')//"资金费用"
        },
        {
            name: gDI18n.$t('10393')//"合约赠金"
        },
        {
            name: gDI18n.$t('10388')//"普通交易"
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

        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }  
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD, arg => {
            that.initLanguage()
            that.initObj()
        })
        
        //添加监听交易登录
        if (this.EV_LOGIN_TRADE_unbinder) {
            this.EV_LOGIN_TRADE_unbinder()
        }   
        this.EV_LOGIN_TRADE_unbinder = window.gEVBUS.on(gTrd.EV_LOGIN_TRADE, arg => {
            that.getHistoryList()
            that.initObj()
        })

        //assetD合约详情全局广播
        if (this.EV_ASSETD_UPD_unbinder) {
            this.EV_ASSETD_UPD_unbinder()
        }
        this.EV_ASSETD_UPD_unbinder = window.gEVBUS.on(gMkt.EV_ASSETD_UPD, arg => {
            that.initObj()
        })
        //单条数据推送
        if (this.EV_WLTLOG_UPD_unbinder) {
            this.EV_WLTLOG_UPD_unbinder()
        }
        this.EV_WLTLOG_UPD_unbinder = window.gEVBUS.on(gMkt.EV_WLTLOG_UPD, arg => {
            that.onTrade(arg)
        })

        
    },
    initLanguage: function(){
        this.theadList = [
            {
                title: gDI18n.$t('10420'),//'币种',
                class: ""
            }, {
                title: gDI18n.$t('10102'),//'类型',
                class: ""
            }, {
                title: gDI18n.$t('10421'),//'金额',
                class: ""
            }, {
                title: gDI18n.$t('10103'),//'时间',
                class: ""
            }
        ]
        this.type = [
            {
                name: gDI18n.$t('10394')//"全部"
            },
            {
                name: gDI18n.$t('10385')//"强制平仓"
            },
            {
                name: gDI18n.$t('10386')//"自动减仓"
            },
            {
                name: gDI18n.$t('10387')//"交割结算"
            },
            {
                name: gDI18n.$t('10062')//"平仓盈亏"
            },
            {
                name: gDI18n.$t('10063')//"手续费"
            },
            {
                name: gDI18n.$t('10389')//"账户划入"
            },
            {
                name: gDI18n.$t('10390')//"账户划出"
            },
            {
                name: gDI18n.$t('10391')//"资金费用"
            },
            {
                name: gDI18n.$t('10393')//"合约赠金"
            },
            {
                name: gDI18n.$t('10388')//"普通交易"
            },
        ]
        this.tabsList = [
            gDI18n.$t('10394'),//"全部",
            "USDT",
            "BTC",
            "ETH",
            "UT"
        ]
        this.navCoinInfo = {
            Coin: gDI18n.$t('10394'),//'全部',
            Stat: gDI18n.$t('10394'),//'全部',
        }
        this.oldNavCoinInfo = {
            Coin: gDI18n.$t('10394'),//'全部',
            Stat: gDI18n.$t('10394'),//'全部',
        }
    },
    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_GET_WLT_LOG_READY_unbinder) {
            this.EV_GET_WLT_LOG_READY_unbinder()
        }
        if (this.EV_WEB_LOGOUT_unbinder) {
            this.EV_WEB_LOGOUT_unbinder()
        }
        if (this.EV_ASSETD_UPD_unbinder) {
            this.EV_ASSETD_UPD_unbinder()
        }
        //单条数据推送
        if (this.EV_WLTLOG_UPD_unbinder) {
            this.EV_WLTLOG_UPD_unbinder()
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
    //单条数据推送
    onTrade: function (param) {
        let that = this
        let tm = Date.now()
        if (!this.updateTradeTimer) {
            this.updateTradeTimer = setTimeout(() => {
                that.initObj()
                that.lastTmForTrade = tm
                this.updateTradeTimer = null
            }, this.TRADECLACTNTERVAL + 50)
        }
        if (tm - this.lastTmForTrade > this.TRADECLACTNTERVAL) {
            that.initObj()
            this.lastTmForTrade = tm
            if (this.updateTradeTimer) {
                clearTimeout(this.updateTradeTimer)
                this.updateTradeTimer = null
            }
        }
    },
    initObj: function () {
        let WltLog = window.gTrd.WltLog['01']

        let list = []
        for (let k of WltLog) {
            
            //Via == 14 是大钱包没钱，从逐仓保证金转钱出来抵扣资金费率
            if(k.Via != 14){
                let item = {}
                utils.copyTab(item, k)

                //金额
                item.Qty = Number(item.Qty || 0).toPrecision2(6, 8)

                item.ViaStr = utils.WltViaStr(item.Via)

                item.AtStr = new Date(item.At).format('MM/dd hh:mm:ss')

                if (item.ViaStr != "") {
                    list.push(item)
                }
            }
        }
        list.sort(function (a, b) {
            return b.At - a.At
        })
        this.newList = (utils.splitList(list,20)[0] || [])
        this.scrollList = (utils.splitList(list,20) || [])
        
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
        m.redraw()
    },

    getScroll:function(e){
        let contentH = e.target.clientHeight; //获取可见区域高度
        let scrollHight = e.target.scrollHeight; //获取全文高度
        let scrollTop = e.target.scrollTop //获取被卷去的高度
        let NL = this.scrollList.length-1
        let _H = contentH + scrollTop
        // let Num = this.newLenget + 1
        if(_H >=(scrollHight) && this.newLenget < NL){
            this.newLenget++
            this.newList =this.newList.concat(this.scrollList[this.newLenget])
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
        return this.newList.map(function (item, i) {
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
        obj.navCoinInfo.Coin = gDI18n.$t('10394');//"全部";
        obj.navCoinInfo.Stat = gDI18n.$t('10394');//"全部";
        obj.initObj()
        obj.tabsActive = 0;
    },
    //提交按钮
    submitNavDrawer:function(){
        let that = this
        obj.initObj()
        setTimeout(function(){
            that.setType = false
            m.redraw()
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
                m("a",{class:"has-text-1",key: "orderListTabsItem"+i, class:"", href:"javascript:void(0);", onclick: function(){
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
        // 弹框 body
         let modalBody = [
            m("div",{class : "search-bi-name"},[
                m("p",{class : "search-bi-name-p has-text-2"},[
                    gDI18n.$t('10466')//"币种名称"
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
                m("p",{class : "search-bi-name-p has-text-2"},[
                    gDI18n.$t('10102')//"类型"
                ]),
                m("div",{class : "search-k-d"},[
                    obj.type.map(function (item,i){
                        return m("a",{class : "button is-primary has-text-white is-outlined button-styl",onclick:function(i){
                            obj.navCoinInfo.Stat = item.name
                            console.log(obj.navCoinInfo.Stat,"类型")
                        }},[
                            item.name
                        ])
                    })
                ]),
            ])
        ]
        // 弹框 footer
        let modalFooter = [
            m("div",{class : "reset-complete"},[
                m("a",{class : "reset-button button is-primary has-text-white is-outlined", onclick:function(){
                    obj.resetNavDrawerInfo()
                }},[
                    gDI18n.$t('10461')//"重置"
                ]),
                m("a",{class : "reset-button button is-primary has-text-white is-outlined",onclick:function (){
                    obj.submitNavDrawer()
                }},[
                    gDI18n.$t('10462')//"完成"
                ]),
            ])
        ]
        // 弹框
        return m( Modal, {
            isShow: obj.setType,
            onClose: () => obj.closeLeverageMode(), // 关闭事件
            slot: {
                header: gDI18n.$t('10458'),//'筛选'
                body: modalBody,
                footer: modalFooter
            }
        })
    },
    getContentList: function () {
        return m("div",{class : "delegation-list"},[
            // 头部
            m(Header, {
                onLeftClick () {
                    obj.resetNavDrawerInfo()
                },
                onRightClick () {
                    obj.setType = true
                },
                slot: {
                    center: gDI18n.$t('10079'),//"合约账单"
                    right: m('i', { class: "iconfont icondaohang" })
                }
            }),
            // 搜索框
            obj.getSelectOptions(),

            m("div",{class : "pub-trade-list  pub-layout-m"},[
            this.list.length !=0?
            this.list.map(function (item, i) {
                return m("div",{ key: "historyOrdtHeadItem" + i, class: "card"},[
                    m("div",{class : "card-content mobile-list"},[
                    //顶部排列
                    m("div",{class : "mobile-div has-text-1"},[
                        item.Coin,
                        m("span",{class : "mobile-font has-text-1"},[
                        item.ViaStr 
                        ]),
                    ]),
                    m("hr",{class :"is-primary"}),
                    //底部排列
                    m("div",{class : "theadList-profit-loss" },[
                        m("div",{class  : "theadList-profit-loss-p1"},[
                            gDI18n.$t('10421'),//"金额" ,
                            m("p",{class : "" + item.Qty>0?"has-text-primary " : "has-text-danger"},[
                                item.Qty
                            ])
                        ]),
                        m("div",{class  : "theadList-time"},[
                            gDI18n.$t('10103'),//"时间" ,
                            m("p",{class : ""},[
                                item.AtStr
                            ])
                        ]),
                    ]),
                ])
            ])
            }):m("div",{class : "text-none has-text-grey-light"},[
                m("i",{class : "iconfont iconbox" ,style:"font-size: 60px",},[
                    
                ]),
                gDI18n.$t('10467')//"暂无账单记录"
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

                m('div', { class: `pub-table-head-box ${window.gWebAPI.isLogin() ? '' : 'is-hidden'}`, style: "width: 890px" }, [
                    m("table", { class: "table is-hoverable ", width: '890px', cellpadding: 0, cellspacing: 0 }, [
                        colgroup,
                        m("tr", { class: "" }, [
                            obj.getTheadItem()
                        ])
                    ]),
                ]),
                m('div', { class: "pub-table-body-box", style: "width: 890px",onscroll:function(e){
                    obj.getScroll(e)
                } }, [
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
        obj.initLanguage()
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
    onremove: function () {
        obj.rmEVBUS()
        obj.newLenget = 0
    }
}