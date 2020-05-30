//详情信息
let m = require("mithril")
let qs = require('qs');
import message from '../message'


export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){

    },
    view:function(vnode){
        // let item =qs.parse(vnode.attrs.item)
        let item = m.route.param()
        return m("div",{class: "details-header"},[
            //顶部导航栏
            m("nav",{class:"pub-layout-m-header is-fixed-top navbar is-transparent", role:"navigation", "aria-label":"main navigation"},[
                m('div', {class:"navbar-brand is-flex"}, [
                m('a', {class:"navbar-item"}, [
                    m('a', {class:"",onclick : function (){
                        router.back()
                    }}, [
                        m('span', {class:"icon icon-right-i"}, [
                            m('i', {class:"iconfont iconarrow-left"}),
                        ]),
                    ]),
                ]),
                m('.spacer'),
                m("p",{class : "delegation-list-phistory navbar-item has-text-black"},[
                    gDI18n.$t('10431')//"委托详情"
                ]),
                m('.spacer'),
                m('.spacer'),
                ]),
            ]),
            //中间内容
            m("div",{class : "details-body pub-layout-m pub-layout-m-details"},[
                
                m("hr",{class : ""}),
                m("div",{class : "details-body-list",},[
                   m("p",{class : "details-body-title title-header"},[
                        utils.getSymDisplayName(window.gMkt.AssetD, item.Sym)
                    ]), 
                   m("p",{class : "details-body-title2 has-text-primary title-header padd-left"},[
                    item.displayLever
                    ]), 
                   m("p",{class : "details-body-title2 has-text-primary title-header font-right"},[
                    item.StatusStr
                    ]), 
                ]),
                m("div",{class : "details-body-conent",},[
                    m("div",{class : "font-div has-text-grey-light"},[
                        gDI18n.$t('10059') + "(" + gDI18n.$t('10423') + ")",//"委托数量(张)",
                        m("p",{class : "font-p has-text-black"},[
                            item.Qty
                        ])
                    ]),
                    m("div",{class : "font-div has-text-grey-light padd-left"},[
                        gDI18n.$t('10058'),//"委托价格",
                        m("p",{class : "font-p has-text-black"},[
                            item.Prz
                        ])
                    ]),
                    m("div",{class : "font-div font-right has-text-grey-light"},[
                        gDI18n.$t('10429',{value : item.FeeCoin}),
                        // "手续费用(" + item.FeeCoin + ")",
                        m("p",{class : "font-p p-only has-text-black"},[
                            item.Fee
                        ])
                    ]),
                ]), 
                m("div",{class : "details-body-conent",},[
                    m("div",{class : "font-div has-text-grey-light"},[
                        gDI18n.$t('10061') + "(" + gDI18n.$t('10423') + ")",//"成交数量(张)",
                        m("p",{class : "font-p  has-text-danger"},[
                            item.QtyF
                        ])
                    ]),
                    m("div",{class : "font-div has-text-grey-light padd-left"},[
                        gDI18n.$t('10060'),//"成交均价",
                        m("p",{class : "font-p has-text-black"},[
                            item.PrzF
                        ])
                    ]),
                    m("div",{class : "font-div font-right has-text-grey-light"},[
                        m('div',{class : ""},[
                            gDI18n.$t('10062') + "(" + item.FeeCoin + ")",
                        ]),
                        
                        // "平仓盈亏(" + item.FeeCoin + ")",
                        m("p",{class : "font-p p-only has-text-danger"},[
                            item.PnlCls
                        ])
                    ]),
                ]), 
                m("div",{class : "details-body-conent",},[
                    m("div",{class : "font-div has-text-grey-light"},[
                        gDI18n.$t('10064'),//"触发条件",
                        m("p",{class : "font-p has-text-black"},[
                            item.cond
                        ])
                    ]),
                    m("div",{class : "font-div has-text-grey-light padd-left"},[
                        gDI18n.$t('10056'),//"委托类型 ",
                        m("p",{class : "font-p has-text-black"},[
                            item.OTypeStr
                        ])
                    ]),
                    m("div",{class : "font-div font-right has-text-grey-light"},[
                        gDI18n.$t('10055'),//"交易类型",
                        item.Dir == 1?
                        m("p",{class : "has-text-success" },[
                            item.DirStr
                        ])
                        :
                        m("p",{class : "has-text-danger" },[
                            item.DirStr
                        ]),
                    ]),
                ]), 
                m("div",{class : "details-body-conent",},[
                    m("div",{class : "font-div-bottom has-text-black"},[
                        gDI18n.$t('10073'),//"成交时间",
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
                        gDI18n.$t('10067'),//"仓位ID",
                    ]),
                    m("div",{class : "has-text-grey-light"},[
                        " ",
                    ]),
                    m("div",{class : "font-div-bottom has-text-black"},[
                        m("div",{class:"cursor-pointer theadList-profit-loss-p2"+(" historyOrdTableListItemCopy"), "data-clipboard-text": item.PId, onclick: function(e){
                            window.$copy(".historyOrdTableListItemCopy")
                        }},[
                            m("p",{class : "font-color"},[
                                item.PId,
                                m("i",{class : ""},[ " "]),
                                m("i",{class:"iconfont iconcopy"}),
                            ])  
                        ]),
                    ]),
                ]), 
                m("div",{class : "details-body-conent",},[
                    m("div",{class : "font-div-bottom has-text-black"},[
                        gDI18n.$t('10066'),//"委托来源",
                    ]),
                    // m("div",{class : "font-div"},[
                    //     " ",
                    // ]),
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
                        gDI18n.$t('10078'),//"成交记录"
                    ]),
                    m("div",{class : "details-body-conent",},[
                        m("div",{class : "font-div has-text-black"},[
                            gDI18n.$t('10061'),//"成交数量",
                            m("p",{class : "font-p has-text-grey-light"},[
                                item.Qty
                            ])
                        ]),
                        m("div",{class : "font-div has-text-black padd-left"},[
                            gDI18n.$t('10433'),//"成交价格 ",
                            m("p",{class : "font-p has-text-grey-light"},[
                                item.Prz
                            ])
                        ]),
                        m("div",{class : "font-div has-text-black" ,style: "text-align: right"},[
                            gDI18n.$t('10103'),//"时间",
                            m("p",{class : "p-only has-text-grey-light"},[
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