var m = require("mithril")
// Header
import Header from "../common/Header_m"
import Modal from "../common/Modal"

let obj = {
    list: [],
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
        })

        //assetD合约详情全局广播
        if (this.EV_ASSETD_UPD_unbinder) {
            this.EV_ASSETD_UPD_unbinder()
        }
        this.EV_ASSETD_UPD_unbinder = window.gEVBUS.on(gMkt.EV_ASSETD_UPD, arg => {
            that.initObj()
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
        let WltLog = window.gTrd.WltLog['02']
        console.log(WltLog,11111111111)

        let list = []
        for (let k of WltLog) {
            
            let item = {}
            utils.copyTab(item, k)

            //金额
            item.Qty = Number(item.Qty || 0).toPrecision2(6, 8)

            item.ViaStr = utils.WltViaStr(item.Via)
            //成交时间
            item.AtStr = new Date(item.At).format('MM/dd hh:mm:ss')

            list.push(item)
            
            
        }
        list.sort(function (a, b) {
            return b.At - a.At
        })
        this.list = list
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
                    // item.ViaStr
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
    getContent: function () {
        if (window.isMobile) {
            return null
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
    }
}