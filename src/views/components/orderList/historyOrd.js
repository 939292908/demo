var m = require("mithril")

let obj = {
    posList: [],
    setType : false,
    contract:[],
    purchase: [],
    stateType: [],
    //
    navDrawerInfo:{
        Sym: '全部',
        dir: '全部',
        status: '全部'
    },
    oldNavDrawerInfo:{
        Sym: '全部',
        dir: '全部',
        status: '全部'
    },
    contractName : [
        {
            name:"全部"
        },
        {
            name:"BTC/USDT永续"
        },
        {
            name:"ETH/USDT永续"
        },
        {
            name:"XRP/USDT永续"
        },
        {
            name:"EOS/USDT永续"
        },
        {
            name:"LTC/USDT永续"
        },
        {
            name:"ETC/USDT永续"
        },
        {
            name:"BCH/USDT永续"
        },
        {
            name:"BTC永续"
        },
        {
            name:"ETH永续"
        },
        {
            name:"BTC 季度0626"
        },
        {
            name:"ETH 季度0626"
        },
        {
            name:"BTC/UT永续"
        },
    ],
    dirStrList:[
        {
            name:"全部"
        },
        {
            name:"买入"
        },
        {
            name:"卖出"
        },
        {
            name:"买入强平"
        },
        {
            name:"卖出强平"
        },
        {
            name:"买入开多"
        },
        {
            name:"卖出开空"
        },
        {
            name:"买入平空"
        },
        {
            name:"卖出平多"
        },
        {
            name:"买入强制平空"
        },
        {
            name:"卖出强制平多"
        },
        {
            name:"买入ADL平空"
        },
        {
            name:"卖出ADL平多"
        },
        {
            name:"买入平空并开多"
        },
        {
            name:"卖出平多并开空"
        },
    ],
    statusStrList:[
        {
            name:"全部",
            id:0
        },
        {
            name:"成交",
            id:1
        },
        {
            name:"撤单",
            id:2
        },
    ],
    theadList: [
        {
            title: '合约',
            class: ""
        }, {
            title: '杠杆',
            class: ""
        }, {
            title: '交易类型',
            class: ""
        }, {
            title: '委托类型',
            class: ""
        }, {
            title: '状态',
            class: ""
        }, {
            title: '委托价格',
            class: ""
        }, {
            title: '委托数量',
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
            title: '触发条件',
            class: ""
        }, {
            title: '委托时间',
            class: ""
        }, {
            title: '委托来源',
            class: ""
        }, {
            title: '仓位ID',
            class: ""
        }, 
    ],
    //初始化全局广播
    initEVBUS: function () {
        let that = this

        if (this.EV_GET_HISTORY_ORD_READY_unbinder) {
            this.EV_GET_HISTORY_ORD_READY_unbinder()
        }
        this.EV_GET_HISTORY_ORD_READY_unbinder = window.gEVBUS.on(gTrd.EV_GET_HISTORY_ORD_READY, arg => {
            that.initObj()
        })

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
        if (this.EV_GET_HISTORY_ORD_READY_unbinder) {
            this.EV_GET_HISTORY_ORD_READY_unbinder()
        }
        if (this.EV_GET_HISTORY_TRD_READY_unbinder) {
            this.EV_GET_HISTORY_TRD_READY_unbinder()
        }
        if (this.EV_WEB_LOGOUT_unbinder) {
            this.EV_WEB_LOGOUT_unbinder()
        }
    },
    initObj() {
        let Orders = window.gTrd.HistoryOrders['01']
        let posList = []
        for (let key in Orders) {
            let order = Orders[key]
            let obj = {}
            let ass = window.gMkt.AssetD[order.Sym]
            if (ass) {
                utils.copyTab(obj, order)

                let PrzMinIncSize = utils.getFloatSize(utils.getFullNum(ass.PrzMinInc || 6));
                let VolMinValSize = utils.getFloatSize(ass.Mult || 2);

                let pos = window.gTrd.Poss[obj.PId] || {}

                //杠杆
                if (ass.MIR) {
                    let lvr = obj.Lvr || pos.Lever || 0
                    let maxLever = Number(1 / Math.max(ass.MIR || 0, obj.MIRMy || 0)).toFixed2(2)
                    obj.displayLever = lvr == 0 ? '全仓' + maxLever + 'X' : '逐仓' + Number(lvr || 0).toFixed2(2) + 'X'
                } else {
                    obj.displayLever = '--'
                }

                obj.DirStr = utils.getDirByStr(obj.Dir)

                obj.OTypeStr = utils.getOtypeByStr(obj.OType, ass)

                //委托价格
                obj.Prz = Number(obj.Prz).toFixed2(PrzMinIncSize)
                // 成交均价
                obj.PrzF = Number(obj.PrzF || 0).toFixed2(PrzMinIncSize)
                //委托数量
                obj.Qty = Number(obj.Qty).toFixed2(VolMinValSize)
                //成交数量
                obj.QtyF = Number(obj.QtyF || 0).toFixed2(VolMinValSize)

                if (obj.StopPrz) {
                    obj.cond = obj.StopBy == 2 ? '指数价' : obj.StopBy == 1 ? '最新价' : '标记价'
                    obj.cond += (obj.OrdFlag & 8) ? '≥' : '≤'
                    obj.cond += obj.StopPrz.toFixed2(PrzMinIncSize)
                } else {
                    obj.cond = '--'
                }
                
                // 委托状态 start
                if (obj.Status ==3 || obj.Status ==5 ) {
                    let status= obj.QtyF>0? 10: obj.Status
                    obj.StatusStr =  utils.ordersStatusStr(status)
                }   else if (obj.Status ==4 && obj.ErrCode) {
                    let status= obj.QtyF>0? 10: 5
                    obj.StatusStr =  utils.ordersStatusStr(status)
                }else if (obj.Status ==4 && obj.QtyF==0) {
                    obj.StatusStr =  utils.ordersStatusStr(5)
                }else if((obj.Status == 4 || obj.Status == 5) && (obj.QtyF>0&&obj.QtyF<obj.Qty)){
                    obj.StatusStr =  utils.ordersStatusStr(10)
                } else{
                    obj.StatusStr =  utils.ordersStatusStr(obj.Status)
                } 
                // 委托状态 end

                // 委托来源
                obj.OrdFromStr = utils.getOrderFrom(obj.Via)

                // 平仓盈亏
                obj.PnlCls = 0
                // 手续费
                obj.Fee = 0
                obj.FeeCoin = ''
                // 从成交记录里边累计委托对应的盈亏以及手续费 start
                let trades = window.gTrd.MyTrades_Obj['01'][obj.OrdId] || []
                for(let item of trades){
                    obj.PnlCls += Number(item.PnlCls || 0)
                    obj.Fee += Number(item.Fee || 0)
                    obj.FeeCoin = item.FeeCoin
                }

                obj.PnlCls = obj.PnlCls.toFixed2(8)
                obj.Fee = obj.Fee.toFixed2(8)
                // 从成交记录里边累计委托对应的盈亏以及手续费 end

                obj.AtStr = new Date(obj.At).format('MM/dd hh:mm:ss'),


                //止盈价
                obj.StopP = obj.StopP ? Number(obj.StopP || 0).toFixed2(PrzMinIncSize) : '--'
                //止损价
                obj.StopL = obj.StopL ? Number(obj.StopL || 0).toFixed2(PrzMinIncSize) : '--'

                posList.push(obj)
                
            }

        }
        posList.sort(function (a, b) {
            return b.At - a.At
        })
        // this.posList = posList
        //根据 obj.navDrawerInfo筛选this.posList数据
        if(this.navDrawerInfo.Sym == this.oldNavDrawerInfo.Sym && this.navDrawerInfo.dir == this.oldNavDrawerInfo.dir && this.navDrawerInfo.status == this.oldNavDrawerInfo.status){
            this.posList = posList
            console.log(posList,"原始数据2")
         }else if(this.navDrawerInfo.Sym != this.oldNavDrawerInfo.Sym && this.navDrawerInfo.dir == this.oldNavDrawerInfo.dir && this.navDrawerInfo.status == this.oldNavDrawerInfo.status){
            let newposList=[]
            for (let i=0; i<posList.length;i++){
                if(posList[i].Sym == this.navDrawerInfo.Sym){
                    newposList.push(posList[i])
                }   
            }
            this.posList = newposList
            console.log(newposList,"合约名称选择后数据")
         }else if(this.navDrawerInfo.Sym == this.oldNavDrawerInfo.Sym && this.navDrawerInfo.dir != this.oldNavDrawerInfo.dir && this.navDrawerInfo.status == this.oldNavDrawerInfo.status){
            let newposList=[]
            for (let i=0; i<posList.length;i++){
                if(posList[i].DirStr == this.navDrawerInfo.dir){
                    newposList.push(posList[i])
                }   
            }
            this.posList = newposList
            console.log(newposList,"买入卖出选择后数据")
         }else if(this.navDrawerInfo.Sym == this.oldNavDrawerInfo.Sym && this.navDrawerInfo.dir == this.oldNavDrawerInfo.dir && this.navDrawerInfo.status != this.oldNavDrawerInfo.status){
            let newposList=[]
            for (let i=0; i<posList.length;i++){
                if(posList[i].StatusStr == this.navDrawerInfo.status){
                    newposList.push(posList[i])
                }   
            }
            this.posList = newposList
            console.log(newposList,"状态选择后数据")
         }else if(this.navDrawerInfo.Sym != this.oldNavDrawerInfo.Sym && this.navDrawerInfo.dir != this.oldNavDrawerInfo.dir && this.navDrawerInfo.status == this.oldNavDrawerInfo.status){
            let newposList=[]
            for (let i=0; i<posList.length;i++){
                if(posList[i].Sym == this.navDrawerInfo.Sym && posList[i].DirStr == this.navDrawerInfo.dir){
                    newposList.push(posList[i])
                }   
            }
            this.posList = newposList
            console.log(newposList,"名称和买卖选择后数据")
         }else if(this.navDrawerInfo.Sym != this.oldNavDrawerInfo.Sym && this.navDrawerInfo.dir == this.oldNavDrawerInfo.dir && this.navDrawerInfo.status != this.oldNavDrawerInfo.status){
            let newposList=[]
            for (let i=0; i<posList.length;i++){
                if(posList[i].Sym == this.navDrawerInfo.Sym && posList[i].StatusStr == this.navDrawerInfo.status){
                    newposList.push(posList[i])
                }   
            }
            this.posList = newposList
            console.log(newposList,"名称和状态选择后数据")
         }else if(this.navDrawerInfo.Sym == this.oldNavDrawerInfo.Sym && this.navDrawerInfo.dir != this.oldNavDrawerInfo.dir && this.navDrawerInfo.status != this.oldNavDrawerInfo.status){
            let newposList=[]
            for (let i=0; i<posList.length;i++){
                if(posList[i].DirStr == this.navDrawerInfo.dir && posList[i].StatusStr == this.navDrawerInfo.status){
                    newposList.push(posList[i])
                }   
            }
            this.posList = newposList
            console.log(newposList,"买卖和状态选择后数据")
         }else if(this.navDrawerInfo.Sym != this.oldNavDrawerInfo.Sym && this.navDrawerInfo.dir != this.oldNavDrawerInfo.dir && this.navDrawerInfo.status != this.oldNavDrawerInfo.status){
            let newposList=[]
            for (let i=0; i<posList.length;i++){
                if(posList[i].DirStr == this.navDrawerInfo.dir && posList[i].StatusStr == this.navDrawerInfo.status && posList[i].Sym == this.navDrawerInfo.Sym){
                    newposList.push(posList[i])
                }   
            }
            this.posList = newposList
            console.log(newposList,"名称和买卖和状态选择后数据")
         }
    },

    getTheadList: function () {
        return this.theadList.map(function (item, i) {
            return m("th", { key: "historyOrdtHeadItem" + i, class: " " + item.class }, [
                item.title
            ])
        })
    },

    getPosList: function () {
        return this.posList.map(function (item, i) {
            return m("tr", { key: "historyOrdTableListItem" + i, class: " "}, [
                m("td", { class: "" }, [
                    m("p", { class: " " }, [
                        utils.getSymDisplayName(window.gMkt.AssetD, item.Sym)
                    ])
                ]),
                m("td", { class: "" }, [
                    m("p", { class: " " }, [
                        item.displayLever
                    ]),
                ]),
                m("td", { class: " " + utils.getColorStr(item.Dir, 'font') }, [
                    item.DirStr
                ]),
                m("td", { class: " " }, [
                    item.OTypeStr
                ]),
                m("td", { class: " " }, [
                    item.StatusStr
                ]),
                m("td", { class: " " }, [
                    item.Prz
                ]),
                m("td", { class: " " }, [
                    item.Qty
                ]),
                m("td", { class: " " }, [
                    item.PrzF
                ]),
                m("td", { class: " " }, [
                    item.QtyF
                ]),
                m("td", { class: " " }, [
                    item.PnlCls
                ]),
                m("td", { class: " " }, [
                    item.Fee,
                    ' ',
                    item.FeeCoin
                ]),
                m("td", { class: "" }, [
                    item.cond
                ]),
                m("td", { class: "" }, [
                    item.AtStr
                ]),
                m("td", { class: "" }, [
                    item.OrdFromStr
                ]),
                m("td",{class:"cursor-pointer"+(" historyOrdTableListItemCopy"+i), "data-clipboard-text": item.PId, onclick: function(e){
                    window.$copy(".historyOrdTableListItemCopy"+i)
                }},[
                    item.PId.substr(-4),
                    ' ',
                    m("i",{class:"iconfont iconcopy"}),
                ]),
            ])
        })
    },
    //获取select筛选
    getOptions:function (){
        let selectId = document.getElementById("selectId");
        let value = selectId.options[selectId.selectedIndex].innerHTML
        if(value.includes('/' && '永续')){
            value = value.replace("/",".").slice(0,-2)
        }else if(value.includes('季度')){
            value = value.slice(0,-7)
        }else if(value.includes('永续')){
            value = value.slice(0,-2)
        }else {
            value = value
        }
        obj.navDrawerInfo.Sym = value
        console.log(obj.navDrawerInfo.Sym,"合约名称")
    },
    getOptions2:function(){
        let selectId = document.getElementById("selectId2");
        let value2 = selectId.options[selectId.selectedIndex].innerHTML
        obj.navDrawerInfo.dir = value2
    },
    //完成按钮
    submitNavDrawer:function(){
        let that = this
        obj.initObj()
        setTimeout(function(){
            that.setType = false
        },200)
        console.log(obj.navDrawerInfo,"新状态")
    },
    //重置按钮
    resetNavDrawerInfo(){
        obj.navDrawerInfo.Sym = '全部';
        obj.navDrawerInfo.dir = '全部';
        obj.navDrawerInfo.status = '全部';
        obj.initObj()
        let selectId = document.getElementById("selectId");
        let selectId2 = document.getElementById("selectId2");
        selectId.options.selectedIndex = 0;
        selectId2.options.selectedIndex = 0;
    },

    //移动端历史成交列表
    getMobileList: function () {
        let qs = require('qs');
        return m("div",{class : "delegation-list"},[
                m("div",{class : "delegation-list-header"},[
                    m('a', {class:"",href:"/#!/future"}, [
                        m('span', {class:"icon is-medium", }, [
                        m('i', {class:"iconfont iconarrow-left"}),
                        ]), 
                    ]),
                    m("p",{class : "delegation-list-phistory"},[
                        "历史委托"
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
                            "合约名称"
                        ]),
                        m("div",{class : "search-k-d select is-small",onchange:function(){
                            obj.getOptions()
                        }},[
                            m("select",{class : "select-sty",style:"select",id:"selectId",},[
                                obj.contractName.map(function (item,i){
                                    return m("option",{class : "option-list",},[
                                        item.name
                                    ])
                                })
                            ])
                        ]),
                    ]),
                    m("div",{class : "search-bi-name"},[
                        m("p",{class : "search-bi-name-p"},[
                            "买入/卖出"
                        ]),
                        m("div",{class : "search-k-d select is-small",onchange:function(){
                            obj.getOptions2()
                        }},[
                            m("select",{class : "select-sty",style:"select",id:"selectId2"},[
                                obj.dirStrList.map(function (item,i){
                                    return m("option",{class : "option-list",},[
                                        item.name
                                    ])
                                })
                            ])
                        ]),
                    ]),
                    m("div",{class : "search-bi-name"},[
                        m("p",{class : "search-bi-name-p"},[
                            "状态"
                        ]),
                        m("div",{class : "search-k-d"},[
                            obj.statusStrList.map(function (item,i){
                                return m("a",{class : "button is-primary is-outlined is-small",onclick:function(i){
                                    if(item.name == "成交"){
                                        obj.navDrawerInfo.status = "全部成交"
                                    }else if (item.name == "撤单"){
                                        obj.navDrawerInfo.status = "已撤单"
                                    }else{
                                        obj.navDrawerInfo.status = item.name
                                    }
                                    
                                    // console.log(obj.navDrawerInfo.status,"状态")
                                }},[
                                    item.name
                                ])
                            })
                        ]),
                    ]),
                    m("div",{class : "reset-complete"},[
                        m("a",{class : "reset-button button is-primary is-outlined is-small",onclick: function (){
                            obj.resetNavDrawerInfo()
                        }},[
                            "重置"
                        ]),
                        m("a",{class : "reset-button button is-primary is-outlined is-small",onclick:function(){
                            obj.submitNavDrawer()
                        }},[
                            "完成"
                        ]),
                    ])
                ]):"",
                
                this.posList.length !=0 ? this.posList.map(function (item, i) {
                    return m("div",{ key: "historyOrdtHeadItem" + i, class: "mobile-list "},[
                        //顶部排列
                        m("div",{class : "theadList-transaction"},[
                            m("p",{class : "theadList-transaction-p1"},[
                                utils.getSymDisplayName(window.gMkt.AssetD, item.Sym),
                            ]),
                            m("p",{class : "theadList-transaction-p2"},[
                                item.displayLever
                            ]),
                            m("p",{class : "theadList-transaction-p3" + utils.getColorStr(item.Dir, 'font') },[
                                item.DirStr
                            ]),
                            item.StatusStr == "全部成交"?
                            m('a',{class : 'button is-white is-primary is-inverted theadList-transaction-p4',href:"/#!/details" + qs.stringify(item)},[
                                item.StatusStr
                            ])
                            :
                            m('a',{class : 'button is-white theadList-transaction-p4',disabled:"disabled"},[
                                item.StatusStr
                            ])
                        ]),
                        //中间排列
                        m("div",{class : "theadList-profit-loss" ,style : "font-size: 10px"},[
                            m("div",{class  : "theadList-profit-loss-p1"},[
                                "委托价格：" ,
                                m("p",{class : "font-color"},[
                                    item.Prz
        
                                ])
                            ]),
                            m("div",{class  : "theadList-profit-loss-p1"},[
                                "成交均价：",
                                m("p",{class : "font-color"},[
                                    item.PrzF
                                ])
                            ]),
                            m("div",{class  : "theadList-profit-loss-p2"},[
                                "委托数量：",
                                m("p",{class : "font-color"},[
                                    item.Qty
                                ])
                            ]),
                        ]),
                        //平仓手续
                        m("div",{class : "theadList-profit-loss" ,style : "font-size: 10px"},[
                            m("div",{class  : "theadList-profit-loss-p2"},[
                                "成交数量：" ,
                                m("p",{class : "font-color"},[
                                    item.QtyF
                                ])
                            ]),
                            m("div",{class  : "theadList-profit-loss-p2"},[
                                "平仓盈亏：",
                                m("p",{class : "font-color"},[
                                    item.PnlCls
                                ])
                            ]),
                            m("div",{class  : "theadList-profit-loss-p2"},[
                                "手续费：" + item.FeeCoin,
                                m("p",{class : "font-color"},[
                                    item.Fee
                                ])
                            ]),
                        ]),
        
                        m("div",{class : "theadList-profit-loss border-lise" ,style : "font-size: 10px"},[
                            m("div",{class  : "theadList-profit-loss-p2"},[
                                "委托类型：" ,
                                m("p",{class : "font-color"},[
                                    item.OTypeStr
                                ])
                            ]),
                            m("div",{class  : "theadList-profit-loss-p2"},[
                                "触发条件：",
                                m("p",{class : "font-color"},[
                                    item.cond
                                ])
                            ]),
                            m("div",{class  : "theadList-profit-loss-p2"},[
                                "委托时间：",
                                m("p",{class : "font-color"},[
                                    item.AtStr
                                ])
                            ]),
                        ]),
                        m("div",{class : "theadList-profit-loss" ,style : "font-size: 10px"},[
                            
                            m("div",{class  : "theadList-profit-loss-p2"},[
                                "委托来源：",
                                m("p",{class : "font-color"},[
                                    item.OrdFromStr
                                ])
                            ]),
                            m("div",{class  : "theadList-profit-loss-p2"},[
                                " ",
                                m("p",{class : "font-color"},[
                                    " "
                                ])
                            ]),
                            m("div",{class:"cursor-pointer theadList-profit-loss-p2"+(" historyOrdTableListItemCopy"+i), "data-clipboard-text": item.PId, onclick: function(e){
                                window.$copy(".historyOrdTableListItemCopy"+i)
                            }},[
                                "仓位ID：",
                                m("p",{class : "font-color"},[
                                    item.PId.substr(-4),
                                    m("i",{class:"iconfont iconcopy"}),
                                ])  
                            ]),
                        ]),
                    ])
                }):m("div",{class : "text-none"},[
                    m("i",{class : "iconfont icon-box" ,style:"font-size: 60px",},[
                        
                    ]),
                    "暂无委托记录"
                ])
            ])
        
    },

    subPosNeedSymTick: function () {
        let oldSubList = window.gMkt.CtxPlaying.subList
        let needSub = []
        for (let key in window.gTrd.Poss) {
            let pos = window.gTrd.Poss[key]
            let str = 'tick_' + pos.Sym
            if (pos.Sz != 0 && !oldSubList.includes(str)) {
                needSub.push(str)
            }
        }
        if (needSub.length > 0) {
            window.gMkt.ReqSub(needSub)
        }
    },
    getHistoryOrd: function () {
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
        let isReq = s.trdInfoStatus.historyOrd[aType]
        if (!uid || !s || isReq) return
        s.getHistoryOrdAndTrdAndWltlog({
            AId: uid + aType,
        })
    },
    getContent: function () {
        if (window.isMobile) {
            return obj.getMobileList()
        } else {
            let colgroup = m('colgroup', {}, [
                m('col', { name: "pub-table-2", width: 160 }),
                m('col', { name: "pub-table-3", width: 130 }),
                m('col', { name: "pub-table-4", width: 80 }),
                m('col', { name: "pub-table-5", width: 80 }),
                m('col', { name: "pub-table-5", width: 80 }),
                m('col', { name: "pub-table-6", width: 100 }),
                m('col', { name: "pub-table-7", width: 100 }),
                m('col', { name: "pub-table-8", width: 100 }),
                m('col', { name: "pub-table-9", width: 100 }),
                m('col', { name: "pub-table-9", width: 150 }),
                m('col', { name: "pub-table-9", width: 150 }),
                m('col', { name: "pub-table-10", width: 150 }),
                m('col', { name: "pub-table-10", width: 150 }),
                m('col', { name: "pub-table-9", width: 100 }),
                m('col', { name: "pub-table-1", width: 100 }),
            ])
            return m('div', { class: " table-container" }, [
                m('div', { class: "pub-table-head-box", style: "width: 1730px" }, [
                    m("table", { class: "table is-hoverable ", width: '1730px', cellpadding: 0, cellspacing: 0 }, [
                        colgroup,
                        m("tr", { class: "" }, [
                            obj.getTheadList()
                        ])
                    ]),
                ]),
                m('div', { class: "pub-table-body-box", style: "width: 1730px" }, [
                    m("table", { class: "table is-hoverable ", width: '1730px', cellpadding: 0, cellspacing: 0 }, [
                        colgroup,
                        obj.getPosList()
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
        obj.initObj()
        obj.getHistoryOrd()
    },
    view: function (vnode) {

        return m("div", { class: "pub-history-order" }, [
            obj.getContent()
        ])
    },
    onbeforeremove: function () {
        obj.rmEVBUS()
    }
}