//详情信息
let m = require("mithril")
let qs = require('qs');
let message = require('../message').default
let Header = require("../common/Header_m").default


module.exports = {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){

    },
    view:function(vnode){
        // let item =qs.parse(vnode.attrs.item)
        let item = m.route.param()
        console.log(item,111111)
        return m("div",{class: "details-header"},[
            // 头部
            m( Header, {
                slot: {
                    center: gDI18n.$t('10431'),//"委托详情"
                }
            }),
            //中间内容
            m("div",{class : "details-body pub-layout-m pub-layout-m-details"},[
                
                m("hr",{class : "is-primary"}),
                m("div",{class : "details-body-list has-text-1",},[
                   m("p",{class : "details-body-title2 title-header"},[
                        utils.getSymDisplayName(window.gMkt.AssetD, item.Sym)
                    ]), 
                   m("p",{class : "details-body-title2 has-text-primary title-header padd-left"},[
                    item.displayLever
                    ]), 
                   m("p",{class : "details-body-title2 has-text-primary title-header font-right"},[
                    item.StatusStr
                    ]), 
                ]),
                m("div",{class : "details-body-title"},[
                    item.Dir == 1 ? 
                    m("p",{class : "title-btn has-border-success has-text-success" },[ item.DirStr ]) :
                    m("p",{class : "title-btn has-border-danger has-text-danger" },[ item.DirStr ])
                ]),
                m("div",{class : "details-body-conent",},[
                    m("div",{class : "font-div has-text-2"},[
                        gDI18n.$t('10059') + "(" + gDI18n.$t('10423') + ")",//"委托数量(张)",
                        m("p",{class : "font-p has-text-1"},[
                            item.Qty
                        ])
                    ]),
                    m("div",{class : "font-div has-text-2 padd-left"},[
                        gDI18n.$t('10058'),//"委托价格",
                        m("p",{class : "font-p has-text-1"},[
                            // item.Prz
                            item.OTypeStr
                        ])
                    ]),
                    m("div",{class : "font-div font-right has-text-2"},[
                        gDI18n.$t('10063'),// "手续费",
                        m("p",{class : "font-p p-only has-text-1"},[
                            item.Fee,
                        ])
                    ]),
                ]), 
                m("div",{class : "details-body-conent",},[
                    m("div",{class : "font-div has-text-2"},[
                        gDI18n.$t('10061') + "(" + gDI18n.$t('10423') + ")",//"成交数量(张)",
                        m("p",{class : "font-p  has-text-danger"},[
                            item.QtyF
                        ])
                    ]),
                    m("div",{class : "font-div has-text-2 padd-left"},[
                        gDI18n.$t('10060'),//"成交均价",
                        m("p",{class : "font-p has-text-1"},[
                            item.PrzF
                        ])
                    ]),
                    m("div",{class : "font-div font-right has-text-2"},[
                        m('div',{class : ""},[
                            gDI18n.$t('10616'), //"成交金额"
                        ]),
                        m("p",{class : "font-p has-text-1"},[
                            item.PrzM
                        ])
                    ]),
                ]), 
                m("div",{class : "details-body-conent",},[
                    m("div",{class : "font-div has-text-2"},[
                        gDI18n.$t('10064'),//"触发条件",
                        m("p",{class : "font-p has-text-1"},[
                            item.cond
                        ])
                    ]),
                ]), 
                m("div",{class : "details-body-conent",},[
                    m("div",{class : "font-div-bottom has-text-2"},[
                        gDI18n.$t('10073'),//"成交时间",
                    ]),
                    m("div",{class : "font-div-bottom has-text-1"},[
                        " ",
                    ]),
                    m("div",{class : "font-div-bottom has-text-1"},[
                        item.AtStr,
                    ]),
                ]), 
            ]),
            m("div",{class : "details-body pub-layout-m-details"},[
                m("hr",{class : "is-primary"}),
                //底部成交记录
                m("div",{class : ""},[
                    m("div",{class : "bottom-sty has-text-1" },[
                        gDI18n.$t('10078'),//"成交记录"
                    ]),
                    m("div",{class : "details-body-conent",},[
                        m("div",{class : "font-div has-text-1"},[
                            gDI18n.$t('10061'),//"成交数量",
                            m("p",{class : "font-p has-text-2"},[
                                item.Qty
                            ])
                        ]),
                        m("div",{class : "font-div has-text-1 padd-left"},[
                            gDI18n.$t('10433'),//"成交价格 ",
                            m("p",{class : "font-p has-text-2"},[
                                item.Prz
                            ])
                        ]),
                        m("div",{class : "font-div has-text-1" ,style: "text-align: right"},[
                            gDI18n.$t('10103'),//"时间",
                            m("p",{class : "p-only has-text-2"},[
                                item.AtStr
                            ])
                        ]),
                    ]),
                ]) 
            ]),

            m(message)

        ])
    }
}