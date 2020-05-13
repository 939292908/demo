//详情信息
let m = require("mithril")
let qs = require('qs');


export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){

    },
    view:function(vnode){
        let item =qs.parse(vnode.attrs.item)
        return m("div",{class: "details-header"},[
            //顶部导航栏
            m("div",{class : "details"},[
                m('a', {class:"navbar-item",href:"/#!/delegation"}, [
                    m('span', {class:"icon is-medium", }, [
                      m('i', {class:"iconfont iconarrow-left"}),
                    ]), 
                ]),
                m("p",{class : "details-conent"},[
                    "委托详情"
                ])
            ]),
            //中间内容
            m("div",{class : "details-body"},[
                m("div",{class : "details-body-list",},[
                   m("p",{class : "details-body-title"},[
                        utils.getSymDisplayName(window.gMkt.AssetD, item.Sym)
                    ]), 
                   m("p",{class : "details-body-title2"},[
                    item.displayLever
                    ]), 
                   m("p",{class : "details-body-title3"},[
                    item.StatusStr
                    ]), 
                ]),
                m("div",{class : "details-body-conent",},[
                    m("div",{class : "font-div"},[
                        "委托数量(张)",
                        m("p",{class : "font-p"},[
                            item.Qty
                        ])
                    ]),
                    m("div",{class : "font-div"},[
                        "委托价格",
                        m("p",{class : "font-p"},[
                            item.Qty
                        ])
                    ]),
                    m("div",{class : "font-div"},[
                        "手续费用(" + item.FeeCoin + ")",
                        m("p",{class : "font-p p-only"},[
                            item.Fee
                        ])
                    ]),
                ]), 
                m("div",{class : "details-body-conent",},[
                    m("div",{class : "font-div"},[
                        "成交数量(张)",
                        m("p",{class : "font-p  font-default-color"},[
                            item.QtyF
                        ])
                    ]),
                    m("div",{class : "font-div"},[
                        "成交均价",
                        m("p",{class : "font-p"},[
                            item.PrzF
                        ])
                    ]),
                    m("div",{class : "font-div"},[
                        "平仓盈亏(" + item.FeeCoin + ")",
                        m("p",{class : "font-p p-only font-default-color"},[
                            item.PnlCls
                        ])
                    ]),
                ]), 
                m("div",{class : "details-body-conent",},[
                    m("div",{class : "font-div"},[
                        "触发条件",
                        m("p",{class : "font-p"},[
                            item.cond
                        ])
                    ]),
                    m("div",{class : "font-div"},[
                        "委托类型 ",
                        m("p",{class : "font-p"},[
                            item.OTypeStr
                        ])
                    ]),
                    m("div",{class : "font-div"},[
                        "交易类型",
                        item.Dir == 1?
                        m("p",{class : "font-default-color2" },[
                            item.DirStr
                        ])
                        :
                        m("p",{class : "font-default-color" },[
                            item.DirStr
                        ]),
                    ]),
                ]), 
                m("div",{class : "details-body-conent",},[
                    m("div",{class : "font-div-bottom"},[
                        "成交时间",
                    ]),
                    m("div",{class : "font-div-bottom"},[
                        " ",
                    ]),
                    m("div",{class : "font-div-bottom"},[
                        item.AtStr,
                    ]),
                ]), 
                m("div",{class : "details-body-conent",},[
                    m("div",{class : "font-div-bottom"},[
                        "仓位ID",
                    ]),
                    m("div",{class : "font-div"},[
                        " ",
                    ]),
                    m("div",{class : "font-div-bottom"},[
                        m("div",{class:"cursor-pointer theadList-profit-loss-p2"+(" historyOrdTableListItemCopy"), "data-clipboard-text": item.PId, onclick: function(e){
                            window.$copy(".historyOrdTableListItemCopy")
                        }},[
                            m("p",{class : "font-color"},[
                                item.PId,
                                m("i",{class:"iconfont iconcopy"}),
                            ])  
                        ]),
                    ]),
                ]), 
                m("div",{class : "details-body-conent",},[
                    m("div",{class : "font-div-bottom"},[
                        "委托来源",
                    ]),
                    m("div",{class : "font-div"},[
                        " ",
                    ]),
                    m("div",{class : "font-div-bottom"},[
                        item.OrdFromStr,
                    ]),
                ]),
                //底部成交记录
                m("div",{class : ""},[
                    m("div",{class : "bottom-sty" },[
                        "成交记录"
                    ]),
                    m("div",{class : "details-body-conent",},[
                        m("div",{class : "font-div"},[
                            "成交数量",
                            m("p",{class : "font-p font-default-color"},[
                                item.Qty
                            ])
                        ]),
                        m("div",{class : "font-div"},[
                            "成交价格 ",
                            m("p",{class : "font-p"},[
                                item.Prz
                            ])
                        ]),
                        m("div",{class : "font-div" ,style: "text-align: right"},[
                            "时间",
                            m("p",{class : "p-only"},[
                                item.AtStr
                            ])
                        ]),
                    ]),
                ]) 
            ])

        ])
    }
}