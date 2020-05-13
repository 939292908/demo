var m = require("mithril")
let obj = {
    list: [],
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

    getContentList: function () {
        return this.list.map(function (item, i) {
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
        })
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