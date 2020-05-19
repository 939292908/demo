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
            m("nav",{class:"pub-layout-m-header is-fixed-top navbar is-transparent", role:"navigation", "aria-label":"main navigation"},[
                m('div', {class:"navbar-brand is-flex"}, [
                m('a', {class:"navbar-item"}, [
                    m('a', {class:"",href:"/#!/delegation"}, [
                        m('span', {class:"icon icon-right-i"}, [
                            m('i', {class:"iconfont iconarrow-left"}),
                        ]),
                    ]),
                ]),
                m('.spacer'),
                m("p",{class : "delegation-list-phistory navbar-item has-text-black"},[
                    "委托详情"
                    ]),
                m('.spacer'),
                ]),
            ]),
            //中间内容
            m("div",{class : "details-body pub-layout-m pub-layout-m-details"},[
                
                m("hr",{class : ""}),
                m("div",{class : "details-body-list",},[
                   m("p",{class : "details-body-title"},[
                        utils.getSymDisplayName(window.gMkt.AssetD, item.Sym)
                    ]), 
                   m("p",{class : "details-body-title2 has-text-primary"},[
                    item.displayLever
                    ]), 
                   m("p",{class : "details-body-title2 has-text-primary"},[
                    item.StatusStr
                    ]), 
                ]),
                m("div",{class : "details-body-conent",},[
                    m("div",{class : "font-div has-text-grey-light"},[
                        "委托数量(张)",
                        m("p",{class : "font-p has-text-black"},[
                            item.Qty
                        ])
                    ]),
                    m("div",{class : "font-div has-text-grey-light"},[
                        "委托价格",
                        m("p",{class : "font-p has-text-black"},[
                            item.Qty
                        ])
                    ]),
                    m("div",{class : "font-div has-text-grey-light"},[
                        "手续费用(" + item.FeeCoin + ")",
                        m("p",{class : "font-p p-only has-text-black"},[
                            item.Fee
                        ])
                    ]),
                ]), 
                m("div",{class : "details-body-conent",},[
                    m("div",{class : "font-div has-text-grey-light"},[
                        "成交数量(张)",
                        m("p",{class : "font-p  has-text-danger"},[
                            item.QtyF
                        ])
                    ]),
                    m("div",{class : "font-div has-text-grey-light"},[
                        "成交均价",
                        m("p",{class : "font-p has-text-black"},[
                            item.PrzF
                        ])
                    ]),
                    m("div",{class : "font-div has-text-grey-light"},[
                        "平仓盈亏(" + item.FeeCoin + ")",
                        m("p",{class : "font-p p-only has-text-danger"},[
                            item.PnlCls
                        ])
                    ]),
                ]), 
                m("div",{class : "details-body-conent",},[
                    m("div",{class : "font-div has-text-grey-light"},[
                        "触发条件",
                        m("p",{class : "font-p has-text-black"},[
                            item.cond
                        ])
                    ]),
                    m("div",{class : "font-div has-text-grey-light"},[
                        "委托类型 ",
                        m("p",{class : "font-p has-text-black"},[
                            item.OTypeStr
                        ])
                    ]),
                    m("div",{class : "font-div has-text-grey-light"},[
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
                    m("div",{class : "font-div-bottom has-text-black"},[
                        "成交时间",
                    ]),
                    m("div",{class : "font-div-bottom has-text-black"},[
                        " ",
                    ]),
                    m("div",{class : "font-div-bottom has-text-black"},[
                        item.AtStr,
                    ]),
                ]), 
                m("div",{class : "details-body-conent",},[
                    m("div",{class : "font-div-bottom has-text-black"},[
                        "仓位ID",
                    ]),
                    m("div",{class : "font-div has-text-grey-light"},[
                        " ",
                    ]),
                    m("div",{class : "font-div-bottom has-text-black"},[
                        m("div",{class:"cursor-pointer theadList-profit-loss-p2"+(" historyOrdTableListItemCopy"), "data-clipboard-text": item.PId, onclick: function(e){
                            window.$copy(".historyOrdTableListItemCopy")
                        }},[
                            m("p",{class : "font-color"},[
                                item.PId,
                                m("i",{class : ""}),
                                m("i",{class:"iconfont iconcopy"}),
                            ])  
                        ]),
                    ]),
                ]), 
                m("div",{class : "details-body-conent",},[
                    m("div",{class : "font-div-bottom has-text-black"},[
                        "委托来源",
                    ]),
                    m("div",{class : "font-div"},[
                        " ",
                    ]),
                    m("div",{class : "font-div-bottom has-text-black"},[
                        item.OrdFromStr,
                    ]),
                ]),
            ]),
            
            m("div",{class : "details-body pub-layout-m-details"},[
                m("hr",{class : ""}),
                //底部成交记录
                m("div",{class : ""},[
                    m("div",{class : "bottom-sty" },[
                        "成交记录"
                    ]),
                    m("div",{class : "details-body-conent",},[
                        m("div",{class : "font-div has-text-black"},[
                            "成交数量",
                            m("p",{class : "font-p has-text-grey-light"},[
                                item.Qty
                            ])
                        ]),
                        m("div",{class : "font-div has-text-black"},[
                            "成交价格 ",
                            m("p",{class : "font-p has-text-grey-light"},[
                                item.Prz
                            ])
                        ]),
                        m("div",{class : "font-div has-text-black" ,style: "text-align: right"},[
                            "时间",
                            m("p",{class : "p-only has-text-grey-light"},[
                                item.AtStr
                            ])
                        ]),
                    ]),
                ]) 
            ])

        ])
    }
}