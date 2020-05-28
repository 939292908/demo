var m = require("mithril")

let obj = {
    posList: [],
    posListTwo:[],
    posItem:[],
    arrPosItem : [],
    setType : false,
    contract:[],
    purchase: [],
    stateType: [],
    //
    tabsActive:0,
    tabsListOpen: false,
    
    tabsActive2:0,
    tabsListOpen2: false,

    navDrawerInfo:{
        Sym: gDI18n.$t('10394'),//'全部',
        dir: gDI18n.$t('10394'),//'全部',
        status: gDI18n.$t('10394'),//'全部'
    },
    oldNavDrawerInfo:{
        Sym: gDI18n.$t('10394'),//'全部',
        dir: gDI18n.$t('10394'),//'全部',
        status: gDI18n.$t('10394'),//'全部'
    },
    dirStrList:[
        gDI18n.$t('10394'),//"全部",
        gDI18n.$t('10326'),//"买入",
        gDI18n.$t('10327'),//"卖出",
        gDI18n.$t('10445'),//"买入强平",
        gDI18n.$t('10446'),//"卖出强平",
        gDI18n.$t('10447'),//"买入开多",
        gDI18n.$t('10448'),//"卖出开空",
        gDI18n.$t('10449'),//"买入平空",
        gDI18n.$t('10450'),//"卖出平多",
        gDI18n.$t('10451'),//"买入强制平空",
        gDI18n.$t('10452'),//"卖出强制平多",
        gDI18n.$t('10453'),//"买入ADL平空",
        gDI18n.$t('10454'),//"卖出ADL平多",
        gDI18n.$t('10455'),//"买入平空并开多",
        gDI18n.$t('10456'),//"卖出平多并开空"
    ],
    statusStrList:[
        {
            name: gDI18n.$t('10394'),//"全部",
            id:0
        },
        {
            name: gDI18n.$t('10457'),//"成交",
            id:1
        },
        {
            name: gDI18n.$t('10082'),//"撤单",
            id:2
        },
    ],
    theadList: [
        {
            title: gDI18n.$t('10053'),//'合约',
            class: ""
        }, {
            title: gDI18n.$t('10054'),//'杠杆',
            class: ""
        }, {
            title: gDI18n.$t('10055'),//'交易类型',
            class: ""
        }, {
            title: gDI18n.$t('10056'),//'委托类型',
            class: ""
        }, {
            title: gDI18n.$t('10057'),//'状态',
            class: ""
        }, {
            title: gDI18n.$t('10058'),//'委托价格',
            class: ""
        }, {
            title: gDI18n.$t('10059'),//'委托数量',
            class: ""
        }, {
            title: gDI18n.$t('10060'),//'成交均价',
            class: ""
        }, {
            title: gDI18n.$t('10061'),//'成交数量',
            class: ""
        }, {
            title: gDI18n.$t('10062'),//'平仓盈亏',
            class: ""
        }, {
            title: gDI18n.$t('10063'),//'手续费',
            class: ""
        }, {
            title: gDI18n.$t('10064'),//'触发条件',
            class: ""
        }, {
            title: gDI18n.$t('10065'),//'委托时间',
            class: ""
        }, {
            title: gDI18n.$t('10066'),//'委托来源',
            class: ""
        }, {
            title: gDI18n.$t('10067'),//'仓位ID',
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
        
        //添加监听交易登录
        if (this.EV_LOGIN_TRADE_unbinder) {
            this.EV_LOGIN_TRADE_unbinder()
        }
        this.EV_LOGIN_TRADE_unbinder = window.gEVBUS.on(gTrd.EV_LOGIN_TRADE, arg => {
            that.getHistoryOrd()
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
    },
    initLanguage: function(){
        this.theadList = [
            {
                title: gDI18n.$t('10053'),//'合约',
                class: ""
            }, {
                title: gDI18n.$t('10054'),//'杠杆',
                class: ""
            }, {
                title: gDI18n.$t('10055'),//'交易类型',
                class: ""
            }, {
                title: gDI18n.$t('10056'),//'委托类型',
                class: ""
            }, {
                title: gDI18n.$t('10057'),//'状态',
                class: ""
            }, {
                title: gDI18n.$t('10058'),//'委托价格',
                class: ""
            }, {
                title: gDI18n.$t('10059'),//'委托数量',
                class: ""
            }, {
                title: gDI18n.$t('10060'),//'成交均价',
                class: ""
            }, {
                title: gDI18n.$t('10061'),//'成交数量',
                class: ""
            }, {
                title: gDI18n.$t('10062'),//'平仓盈亏',
                class: ""
            }, {
                title: gDI18n.$t('10063'),//'手续费',
                class: ""
            }, {
                title: gDI18n.$t('10064'),//'触发条件',
                class: ""
            }, {
                title: gDI18n.$t('10065'),//'委托时间',
                class: ""
            }, {
                title: gDI18n.$t('10066'),//'委托来源',
                class: ""
            }, {
                title: gDI18n.$t('10067'),//'仓位ID',
                class: ""
            }, 
        ]
        this.statusStrList = [
            {
                name: gDI18n.$t('10394'),//"全部",
                id:0
            },
            {
                name: gDI18n.$t('10457'),//"成交",
                id:1
            },
            {
                name: gDI18n.$t('10082'),//"撤单",
                id:2
            },
        ]
        this.navDrawerInfo = {
            Sym: gDI18n.$t('10394'),//'全部',
            dir: gDI18n.$t('10394'),//'全部',
            status: gDI18n.$t('10394'),//'全部'
        }
        this.oldNavDrawerInfo = {
            Sym: gDI18n.$t('10394'),//'全部',
            dir: gDI18n.$t('10394'),//'全部',
            status: gDI18n.$t('10394'),//'全部'
        }
        this.dirStrList = [
            gDI18n.$t('10394'),//"全部",
            gDI18n.$t('10326'),//"买入",
            gDI18n.$t('10327'),//"卖出",
            gDI18n.$t('10445'),//"买入强平",
            gDI18n.$t('10446'),//"卖出强平",
            gDI18n.$t('10447'),//"买入开多",
            gDI18n.$t('10448'),//"卖出开空",
            gDI18n.$t('10449'),//"买入平空",
            gDI18n.$t('10450'),//"卖出平多",
            gDI18n.$t('10451'),//"买入强制平空",
            gDI18n.$t('10452'),//"卖出强制平多",
            gDI18n.$t('10453'),//"买入ADL平空",
            gDI18n.$t('10454'),//"卖出ADL平多",
            gDI18n.$t('10455'),//"买入平空并开多",
            gDI18n.$t('10456'),//"卖出平多并开空"
        ]
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
        
        //添加监听交易登录
        if (this.EV_LOGIN_TRADE_unbinder) {
            this.EV_LOGIN_TRADE_unbinder()
        }  
        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
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
                    obj.displayLever = lvr == 0 ? gDI18n.$t('10068',{value :maxLever }) : gDI18n.$t('10069',{value :Number(lvr || 0).toFixed2(2) })
                    //obj.displayLever = lvr == 0 ? '全仓' + maxLever + 'X' : '逐仓' + Number(lvr || 0).toFixed2(2) + 'X'
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
                    obj.cond = obj.StopBy == 2 ? gDI18n.$t('10070'): obj.StopBy == 1 ?  gDI18n.$t('10046'): gDI18n.$t('10048')
                    // obj.cond = obj.StopBy == 2 ? '指数价' : obj.StopBy == 1 ? '最新价' : '标记价'
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
        this.posListTwo = posList
        console.log(this.posListTwo,"原始数据")
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
    getOptions:function (val){
        let value = val
        obj.navDrawerInfo.Sym = value
        console.log(obj.navDrawerInfo.Sym,"合约名称")
    },
    getOptions2:function(val){
        let value2 = val
        obj.navDrawerInfo.dir = value2
        console.log(obj.navDrawerInfo.dir,"买入卖出")
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
        obj.navDrawerInfo.Sym = gDI18n.$t('10394'),//'全部';
        obj.navDrawerInfo.dir = gDI18n.$t('10394'),//'全部';
        obj.navDrawerInfo.status = gDI18n.$t('10394'),//'全部';
        obj.initObj()
        obj.tabsActive2 = 0;
        obj.tabsActive = 0;
    },
    closeLeverageMode: function(){
        this.setType = false   
    },
    setTabsActive: function(param){
        this.tabsActive = param
    },
    setTabsActive2: function(param){
        this.tabsActive2 = param
    },
    getTabsList: function(){
        return this.posItem.map(function(item,i){
            return m("p",{class:"a-text-left"+(obj.tabsActive == i?' is-active':'')},[
                m("a",{class:"",key: "orderListTabsItem"+i, class:"", href:"javascript:void(0);", onclick: function(){
                    obj.setTabsActive(i)
                    obj.tabsListOpen = !obj.tabsListOpen
                    obj.getOptions(obj.arrPosItem[obj.tabsActive])
                }},[
                    item
                ])
            ])
        })
    },
    getTabsList: function(){
        return this.posItem.map((item, i)=>{
            return m('dev', {key: 'dropdown-item'+item+i, class: ""}, [
                // m('hr', {class: "dropdown-divider "}),
                m('a', { href: "javascript:void(0);", class: "dropdown-item"+(obj.tabsActive == i?' has-text-primary':''), onclick: function(){
                    obj.setTabsActive(i)
                    obj.tabsListOpen = !obj.tabsListOpen
                    obj.getOptions(obj.arrPosItem[obj.tabsActive])
                }},[
                    item
                ])
            ])
            
        })
    },
    getTabsList2: function(){
        return this.dirStrList.map(function(item,i){
            return m("p",{class:"a-text-left"+(obj.tabsActive2 == i?' is-active':'')},[
                m("a",{key: "orderListTabsItem"+i, class:"", href:"javascript:void(0);", onclick: function(){
                    obj.setTabsActive2(i)
                    obj.tabsListOpen2 = !obj.tabsListOpen2
                    obj.getOptions2(obj.dirStrList[obj.tabsActive2])
                }},[
                    item
                ])
            ])
        })
    },
    getTabsList2: function(){
        return this.dirStrList.map((item, i)=>{
            return m('dev', {key: 'dropdown-item'+item+i, class: ""}, [
                // m('hr', {class: "dropdown-divider "}),
                m('a', { href: "javascript:void(0);", class: "dropdown-item"+(obj.tabsActive2 == i?' has-text-primary':''), onclick: function(){
                    obj.setTabsActive2(i)
                    obj.tabsListOpen2 = !obj.tabsListOpen2
                    obj.getOptions2(obj.dirStrList[obj.tabsActive2])
                }},[
                    item
                ])
            ])
            
        })
    },
    getContractList:function (){
        let arr =[]
        let arrPos=[]
        this.posListTwo.map(function(item,i){
            arr[i]=utils.getSymDisplayName(window.gMkt.AssetD, item.Sym);
            arrPos[i] = item.Sym;
        })
        //去除重复元素
        this.posItem =arr.filter(function(value,index,self){
            return self.indexOf(value) ===index;
        });
        this.arrPosItem = arrPos.filter(function(value,index,self){
            return self.indexOf(value) ===index;
        })
        
        this.posItem.unshift(gDI18n.$t('10394'/*"全部"*/))
        this.arrPosItem.unshift(gDI18n.$t('10394'/*"全部"*/))
    },
    getSelectOptions: function (){
        return m('div', {class: 'pub-set-lever'}, [
            m("div", { class: "modal" + (obj.setType ? " is-active" : ''), }, [
              m("div", { class: "modal-background" }),
              m("div", { class: "modal-card" }, [
                m("header", { class: "pub-set-lever-head modal-card-head modal-card-body-list" }, [
                    m("p", { class: "modal-card-title" }, [
                        gDI18n.$t('10458'),//'筛选'
                      ]),
                    m("button", {
                    class: "delete", "aria-label": "close", onclick: function () {
                        obj.closeLeverageMode()
                    }
                    }),
                ]),
                m("section", { class: "pub-set-lever-content modal-card-body modal-card-body-list" }, [
                    m("div",{class : "search-bi-name"},[
                        m("p",{class : "search-bi-name-p has-text-black"},[
                            gDI18n.$t('10110'),//"合约名称"
                        ]),
                        m("div",{class:" pub-place-order-m pub-order-m"},[
                            m('div', {class: "dropdown pub-place-order-select is-hidden-desktop" + (obj.tabsListOpen?' is-active':'')}, [
                                m('.dropdown-trigger', {}, [
                                    m('button', {class: "button is-white is-fullwidth",'aria-haspopup':true, "aria-controls": "dropdown-menu2", onclick: function(e){
                                        obj.tabsListOpen = !obj.tabsListOpen
                                    }}, [
                                        m('div', {}, [
                                            m('span',{ class: "",id:"selectId"}, obj.posItem[obj.tabsActive]),
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
                            gDI18n.$t('10459'),//"买入/卖出"
                        ]),
                        m("div",{class:" pub-place-order-m pub-order-m"},[
                            m('div', {class: "dropdown pub-place-order-select is-hidden-desktop" + (obj.tabsListOpen2?' is-active':'')}, [
                                m('.dropdown-trigger', {}, [
                                    m('button', {class: "button is-white is-fullwidth",'aria-haspopup':true, "aria-controls": "dropdown-menu3", onclick: function(e){
                                        obj.tabsListOpen2 = !obj.tabsListOpen2
                                    }}, [
                                        m('div', {}, [
                                            m('span',{ class: "",id:"selectId2"}, obj.dirStrList[obj.tabsActive2]),
                                            m('span', {class: "icon "},[
                                                m('i', {class: "iconfont iconxiala has-text-primary", "aria-hidden": true })
                                            ]),
                                        ])
                                    ]),
                                ]),
                                m('.dropdown-menu', {class:"scroll-y", id: "dropdown-menu3", role: "menu"}, [
                                    m('.dropdown-content', {class:"has-text-centered"}, [
                                        obj.getTabsList2()
                                    ]),
                                ]),
                            ]),
                        ])
                    ]),
                    m("div",{class : "search-bi-name"},[
                        m("p",{class : "search-bi-name-p"},[
                            gDI18n.$t('10057'),//"状态"
                        ]),
                        m("div",{class : "search-k-d"},[
                            obj.statusStrList.map(function (item,i){
                                return m("a",{class : "button is-primary is-outlined button-styl",onclick:function(i){
                                    if(item.name == gDI18n.$t('10460'/*"成交"*/)){
                                        obj.navDrawerInfo.status = gDI18n.$t('10398'/*"全部成交"*/)
                                    }else if (item.name == gDI18n.$t('10082'/*"撤单"*/)){
                                        obj.navDrawerInfo.status = gDI18n.$t('10399'/*"已撤单"*/)
                                    }else{
                                        obj.navDrawerInfo.status = item.name
                                    }
                                }},[
                                    item.name
                                ])
                            })
                        ]),
                    ]),
                ]),
                m("footer", { class: "pub-set-lever-foot modal-card-foot modal-card-body-list" }, [
                    m("div",{class : "reset-complete"},[
                        m("a",{class : "reset-button button is-primary is-outlined",onclick: function (){
                            obj.resetNavDrawerInfo()
                        }},[
                            gDI18n.$t('10461'/*"重置"*/)
                        ]),
                        m("a",{class : "reset-button button is-primary is-outlined",onclick:function(){
                            obj.submitNavDrawer()
                        }},[
                            gDI18n.$t('10462'/*"完成"*/)
                        ]),
                    ])
                ])
            ]),
            ])
        ])     
    },
    //移动端历史成交列表
    getMobileList: function () {
        let qs = require('qs');
        return m("div",{class : ""},[
                m("nav",{class:"pub-layout-m-header is-fixed-top navbar is-transparent", role:"navigation", "aria-label":"main navigation"},[
                    m('div', {class:"navbar-brand is-flex"}, [
                        m('a', {class:"navbar-item"}, [
                            m('a', {class:"",onclick :function (){
                                router.back()
                                obj.resetNavDrawerInfo()
                            }}, [
                            m('span', {class:"icon icon-right-i"}, [
                                m('i', {class:"iconfont iconarrow-left  has-text-black"}),
                            ]),
                            ]),
                        ]),
                        m('.spacer'),
                        m("p",{class : "delegation-list-phistory navbar-item has-text-black"},[
                            gDI18n.$t('10077'/*"历史委托"*/)
                            ]),
                        m('.spacer'),
                        m('a', {class:"navbar-item"}, [
                            m('a', {class:"icon icon-right-i navbar-item transform-for-icon",onclick: function(){
                                obj.setType = true
                                obj.getContractList()
                            }}, [
                                m('i', {class:"iconfont icontoolbar-side"}),
                            ]),
                        ]),
                    ]),
                ]),
                //搜索框
                obj.getSelectOptions(),
                m("div",{class : "pub-trade-list  pub-layout-m"},[
                        this.posList.length !=0 ? this.posList.map(function (item, i) {
                            return m("div",{ key: "historyOrdtHeadItem" + i, class: "card" },[
                                m("div",{class : "card-content mobile-list"},[
                                //顶部排列
                                m("header",{class : ""},[
                                    item.StatusStr == gDI18n.$t('10398'/*"全部成交"*/)?
                                    m('a',{class : "theadList-transaction has-text-black",onclick: function(){
                                        router.push({
                                            path:"/details",
                                            data: item
                                        })
                                    }},[
                                        m("p",{class : "theadList-transaction-p1 header-flex"},[
                                            utils.getSymDisplayName(window.gMkt.AssetD, item.Sym),
                                            m("p",{class : " padd-left theadList-transaction-p2 has-text-primary"},[
                                                item.displayLever
                                            ]),
                                        ]),
                                        
                                        m("p",{class : "theadList-transaction-p2" + utils.getColorStr(item.Dir, 'font') },[
                                            item.DirStr
                                        ]),
                                        m('p',{class : 'theadList-transaction-p2 has-text-primary',},[
                                            item.StatusStr,
                                            m('i',{class : "iconfont iconarrow-right icon-font-size"})
                                        ])
                                    ]):
                                    m('a',{class : "theadList-transaction has-text-black",},[
                                        m("p",{class : "theadList-transaction-p1 header-flex"},[
                                            utils.getSymDisplayName(window.gMkt.AssetD, item.Sym),
                                            m("p",{class : "padd-left theadList-transaction-p2 has-text-primary"},[
                                                item.displayLever
                                            ]),
                                        ]),
                                        
                                        m("p",{class : "theadList-transaction-p2" + utils.getColorStr(item.Dir, 'font') },[
                                            item.DirStr
                                        ]),
                                        m('p',{class : 'theadList-transaction-p2 has-text-grey',disabled:"disabled"},[
                                            item.StatusStr
                                        ])
                                    ])
                                    
                                ]),
                                m("hr",{class :" "}),
                                //中间排列
                                m("div",{class : ""},[
                                    m("div",{class : "theadList-profit-loss" },[
                                        m("div",{class  : "theadList-profit-loss-p1 has-text-grey-light"},[
                                            gDI18n.$t('10058') + ":",//"委托价格："
                                            m("p",{class : "has-text-black"},[
                                                item.Prz
                    
                                            ])
                                        ]),
                                        m("div",{class  : "theadList-profit-loss-p1  has-text-grey-light"},[
                                            gDI18n.$t('10060') + ":",//"成交均价：",
                                            m("p",{class : "has-text-black"},[
                                                item.PrzF
                                            ])
                                        ]),
                                        m("div",{class  : "theadList-profit-loss-p2 font-right has-text-grey-light"},[
                                            gDI18n.$t('10059') + ":",//"委托数量：",
                                            m("p",{class : "has-text-black"},[
                                                item.Qty
                                            ])
                                        ]),
                                    ]),
                                    //平仓手续
                                    m("div",{class : "theadList-profit-loss"},[
                                        m("div",{class  : "theadList-profit-loss-p2 has-text-grey-light"},[
                                            gDI18n.$t('10061') + ":",//"成交数量：" ,
                                            m("p",{class : "has-text-black"},[
                                                item.QtyF
                                            ])
                                        ]),
                                        m("div",{class  : "theadList-profit-loss-p2 has-text-grey-light"},[
                                            gDI18n.$t('10062') + ":",//"平仓盈亏：",
                                            m("p",{class : "has-text-black"},[
                                                item.PnlCls
                                            ])
                                        ]),
                                        m("div",{class  : "theadList-profit-loss-p2 font-right has-text-grey-light"},[
                                            gDI18n.$t('10063'/*手续费*/) + ":" + item.FeeCoin,
                                            m("p",{class : "has-text-black"},[
                                                item.Fee
                                            ])
                                        ]),
                                    ]),
                    
                                    m("div",{class : "theadList-profit-loss"},[
                                        m("div",{class  : "theadList-profit-loss-p2 has-text-grey-light"},[
                                            gDI18n.$t('10056') + ":",//"委托类型：" ,
                                            m("p",{class : "has-text-black"},[
                                                item.OTypeStr
                                            ])
                                        ]),
                                        m("div",{class  : "theadList-profit-loss-p2 has-text-grey-light"},[
                                            gDI18n.$t('10064') + ":",//"触发条件：",
                                            m("p",{class : "has-text-black"},[
                                                item.cond
                                            ])
                                        ]),
                                        m("div",{class  : "theadList-profit-loss-p2 font-right has-text-grey-light"},[
                                            gDI18n.$t('10065') + ":",//"委托时间：",
                                            m("p",{class : "has-text-black"},[
                                                item.AtStr
                                            ])
                                        ]),
                                    ]),
                                    m("hr",{class : ""})
                                ]),
                                m("footer",{class : "theadList-profit-loss" ,},[
                                    m("div",{class  : "theadList-profit-loss-p2 has-text-grey-light theadList-profit2"},[
                                        m("p",{class :""},[
                                            gDI18n.$t('10066') + "：",//"委托来源：" 
                                        ]),
                                        
                                    ]),
                                    m("div",{class  : "theadList-profit-loss-p2 has-text-grey-light"},[
                                        " ",
                                        m("p",{class : "has-text-black"},[
                                            item.OrdFromStr
                                        ])
                                    ]),
                                    m("div",{class:"cursor-pointer theadList-profit-loss-p2 has-text-grey-light flex-right fomt-blacl"+(" historyOrdTableListItemCopy"+i), "data-clipboard-text": item.PId, onclick: function(e){
                                        window.$copy(".historyOrdTableListItemCopy"+i)
                                        obj.copyPid(item.PId)
                                    }},[
                                        m("p",{class :""},[
                                            gDI18n.$t('10067') + "：",//"仓位ID：" 
                                         ]),
                                        
                                        m("p",{class : "has-text-black"},[
                                            item.PId.substr(-4),
                                            m("i",{class : ""},[ " "]),
                                            m("i",{class:"iconfont iconcopy"}),
                                        ])  
                                    ]),
                                ]),
                            ])
                        ])
                        }):m("div",{class : "text-none has-text-grey-light"},[
                            m("i",{class : "iconfont iconbox" ,style:"font-size: 60px",},[
                                
                            ]),
                            gDI18n.$t('10463')//"暂无委托记录"
                        ])
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
        obj.initLanguage()
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