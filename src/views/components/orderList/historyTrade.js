var m = require("mithril")
let obj = {
    list: [],
    theadList: [
        {
            title: '合约',
            class: ""
        },{
            title: '交易类型',
            class: ""
        }, {
            title: '成交均价',
            class: ""
        }, {
            title: '成交数量',
            class: ""
        }, {
            title: '平仓盈亏',
            class: ""
        }, {
            title: '手续费',
            class: ""
        }, {
            title: '成交时间',
            class: ""
        },{
            title: '仓位ID',
            class: ""
        }
    ],
    //初始化全局广播
    initEVBUS: function () {
        let that = this

        if (this.EV_GET_HISTORY_TRD_READY_unbinder) {
            this.EV_GET_HISTORY_TRD_READY_unbinder()
        }
        this.EV_GET_HISTORY_TRD_READY_unbinder = window.gEVBUS.on(gTrd.EV_GET_HISTORY_TRD_READY, arg => {
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
        if (this.EV_GET_HISTORY_TRD_READY_unbinder) {
            this.EV_GET_HISTORY_TRD_READY_unbinder()
        }
        if (this.EV_WEB_LOGOUT_unbinder) {
            this.EV_WEB_LOGOUT_unbinder()
        }
    },
    getHistoryList: function(){
        let that = this
        let s = window.gTrd
        let aType = '01'
        let Sym = window.gMkt.CtxPlaying.Sym
        let AssetD = window.gMkt.AssetD[Sym] || {}
        if(AssetD.TrdCls == 1){
            aType = '02'
        }else{
            aType = '01'
        }
        let uid = s.RT["UserId"]
        let isReq = s.trdInfoStatus.trade[aType]
        if(!uid || !s || isReq) return
        s.getHistoryOrdAndTrdAndWltlog({
            AId: uid + aType,
        })
    },
    initObj: function(){
        let trade = window.gTrd.MyTrades['01']
        let list = []
        for(let k of trade){
            let item = {}
            let Sym = k.Sym
            let ass = window.gMkt.AssetD[Sym]
            if(ass){
                utils.copyTab(item, k)

                let PrzMinIncSize = utils.getFloatSize(utils.getFullNum(ass.PrzMinInc || 6));
                let VolMinValSize = utils.getFloatSize(ass.Mult || 2);

                item.displaySym = utils.getSymDisplayName(window.gMkt.AssetD, item.Sym)
                // 成交均价
                item.Prz = Number(item.Prz || 0).toFixed2(PrzMinIncSize)
                //成交数量
                item.Sz = Number(item.Sz || 0).toFixed2(VolMinValSize)

                item.PnlCls = Number(item.PnlCls || 0).toPrecision2(6,8)
                item.Fee = Number(-item.Fee || 0).toPrecision2(6,8)

                item.Dir = item.Sz > 0?1:-1
                item.DirStr = utils.getDirByStr(item.Dir)

                item.AtStr = new Date(item.At).format('MM/dd hh:mm:ss'),

                list.push(item)
            }
        }
        list.sort(function(a,b){
            return b.At - a.At
        })
        this.list = list
    },
    getTheadItem: function () {
        return this.theadList.map(function (item, i) {
            return m("th", { key: "historyOrdtHeadItem" + i, class: ""+item.class }, [
                item.title
            ])
        })
    },
    getListItem: function () {
        return this.list.map(function (item, i) {
            return m("tr", { key: "historyTrdTableListItem" + i, class: "" }, [
                
                m("td", { class: "" }, [
                    m("p", { class: " " }, [
                        item.displaySym
                    ])
                ]),
                m("td", { class: " " + utils.getColorStr(item.Dir, 'font') }, [
                    item.DirStr
                ]),
                m("td", { class: " " }, [
                    item.Prz
                ]),
                m("td", { class: " " }, [
                    item.Sz
                ]),
                m("td", { class: " " }, [
                    item.PnlCls
                ]),
                m("td", { class: " " }, [
                    item.Fee
                ]),
                m("td", { class: "" }, [
                    item.AtStr
                ]),
                m("td",{class:"cursor-pointer"+(" historyTrdTableListItemCopy"+i), "data-clipboard-text": item.PId, onclick: function(e){
                    window.$copy(".historyTrdTableListItemCopy"+i)
                }},[
                    item.PId.substr(-4),
                    ' ',
                    m("i",{class:"iconfont iconcopy"}),
                ]),
            ])
        })
    },

    //
    getMobileHistoryList: function (){
        return m("div",{class: "details-header"},[
            m("nav",{class:"pub-layout-m-header is-fixed-top navbar is-transparent", role:"navigation", "aria-label":"main navigation"},[
                m('div', {class:"navbar-brand is-flex"}, [
                m('a', {class:"navbar-item"}, [
                    m('a', {class:"",href:"/#!/future"}, [
                        m('span', {class:"icon"}, [
                            m('i', {class:"iconfont iconarrow-left"}),
                        ]),
                    ]),
                ]),
                m('.spacer'),
                m("p",{class : "delegation-list-phistory navbar-item has-text-black"},[
                    "历史成交"
                    ]),
                m('.spacer'),
                ]),
            ]),
            m("div",{class : "pub-trade-list  pub-layout-m"},[
            this.list.length !=0?
            this.list.map(function (item, i) {
                return m("div",{ key: "historyOrdtHeadItem" + i, class: "card "},[
                    //顶部排列
                    m("div",{class : "card-content mobile-list"},[
                        m("div",{class : "theadList-transaction"},[
                            m("p",{class : "theadList-transaction-p1"},[
                                utils.getSymDisplayName(window.gMkt.AssetD, item.displaySym)
                            ]),
                            m("p",{class : " " + utils.getColorStr(item.Dir, 'font') },[
                                item.DirStr
                            ]),
                            m("div",{class  : ""},[
                                " ",
                                m("p",{class : " "},[
                                    " "
                                ])
                            ]),
                            m("p",{class : " "},[
                                item.AtStr
                            ])
                        ]),
                        m("hr",{class : ""}),
                        //中间排列
                        m("div",{class :  ""},[
                            m("div",{class : "theadList-profit-loss" ,},[
                                m("div",{class  : "theadList-profit-loss-p1 has-text-grey"},[
                                    "成交均价：" ,
                                    m("p",{class : "has-text-dark"},[
                                        item.Prz
                                    ])
                                ]),
                                m("div",{class  : "theadList-profit-loss-p1 has-text-grey"},[
                                    "成交数量：" ,
                                    m("p",{class : "has-text-dark"},[
                                        item.Sz
                                    ])
                                ]),
                                m("div",{class  : "theadList-profit-loss-p1 has-text-grey"},[
                                    "平仓盈亏：" ,
                                    m("p",{class : "has-text-dark"},[
                                        item.PnlCls
                                    ])
                                ]),
                            ]),
                            //底部排列
                            m("div",{class : "theadList-profit-loss" ,},[
                                m("div",{class  : "theadList-profit-loss-p1 has-text-grey theadList-profit2"},[
                                    m("p",{class: ""},[
                                       "手续费：" 
                                    ]),
                                    m("p",{class : "has-text-dark" + item.Fee>0?"has-text-danger" :"has-text-primary"},[
                                        item.Fee
                                    ])
                                ]),
                                m("div",{class  : "theadList-profit-loss-p2"},[
                                    " ",
                                ]),
                                m("div",{class:"cursor-pointer theadList-profit-loss-p2 has-text-grey theadList-profit2 fomt-blacl text-right"+(" historyOrdTableListItemCopy"+i), "data-clipboard-text": item.PId, onclick: function(e){
                                    window.$copy(".historyOrdTableListItemCopy"+i)
                                }},[
                                    "仓位ID：",
                                    m("p",{class : "has-text-dark"},[
                                        item.PId.substr(-4),
                                        m("i",{class : ""},[ " "]),
                                        m("i",{class:"iconfont iconcopy"}),
                                    ])  
                                ]),
                            ]),
                        ])
                    ])
                ])
            }):m("div",{class : "text-none has-text-grey"},[
                m("i",{class : "iconfont icon-box" ,style:"font-size: 60px",},[
                    
                ]),
                "暂无历史成交记录"
            ])
        ])
    ])
    },
    getContent: function () {
        if (window.isMobile) {
            //移动端列表
            return obj.getMobileHistoryList()
        } else {
            let colgroup = m('colgroup', {}, [
                m('col', { name: "pub-table-1", width: 160 }),
                m('col', { name: "pub-table-2", width: 100 }),
                m('col', { name: "pub-table-3", width: 100 }),
                m('col', { name: "pub-table-4", width: 100 }),
                m('col', { name: "pub-table-5", width: 100 }),
                m('col', { name: "pub-table-6", width: 100 }),
                m('col', { name: "pub-table-7", width: 150 }),
                m('col', { name: "pub-table-8", width: 80 }),
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
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
        obj.initEVBUS()
        obj.getHistoryList()
        obj.initObj()
    },
    view: function(vnode) {
        
        return m("div", { class: "pub-history-trade " }, [
            obj.getContent()
        ])
    },
    onbeforeremove: function(){
        obj.rmEVBUS()
    }
}