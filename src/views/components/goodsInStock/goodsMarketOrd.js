var m = require("mithril")

let obj = {
    buttonType:true,
    
    //初始化全局广播
    initEVBUS: function () {
        let that = this


    },
    initLanguage : function (){
        obj.updateSpotInfo()
    },
    //删除全局广播
    rmEVBUS: function () {
        
    },
       
    updateSpotInfo: function(){
        this.form = {
            
        }

    },
    initWlt: function(arg){
        let Sym = window.gMkt.CtxPlaying.Sym
        let assetD = window.gMkt.AssetD[Sym] || {}
        let wallets = []
        if(assetD.TrdCls == 2 || assetD.TrdCls == 3){
            wallets = window.gTrd.Wlts['01']
        }
        let isUpdate = false
        for(let i = 0;i < wallets.length; i++){
            let item = wallets[i]
            if(item.AId && item.Coin == assetD.SettleCoin){
                isUpdate = true
                this.wlt = item
            }
        }
        if(!isUpdate){
            this.wlt = {}
        }
    },
}
export default {
    oninit: function (vnode) {
        obj.initLanguage()
    },
    oncreate: function (vnode) {
        
    },
    view: function (vnode) {

        return m("div", { class: "pub-place-order-form has-text-2" }, [
            m('div',{class:"pub-bibi-order"},[
                m("div",{class:"pub-bibi-order-type"},[
                    '类型'
                ]),
                m("div",{class:"pub-bibi-order-BS cursor-pointer" + (obj.buttonType?" pub-bibi-order-BS-color1" :" pub-bibi-order-BS-color2"),onclick:function(){
                    obj.buttonType = !obj.buttonType
                }},[
                    (obj.buttonType?" 买入 BTC" :" 卖出 BTC"),
                    // "买入BTC",
                    m('i',{class:"iconfont iconswitch icon-position" + (obj.buttonType?" iconfont-switch1" :" iconfont-switch2")})
                ]),
            ]),
            m("div",{class:"pub-bibi-price"},[
                m('div',{class:"pub-bibi-price-til"},[
                    "价格"
                ]),
                m('div',{class:"pub-bibi-price-inp"},[
                    m("div",{class:"pub-bibi-price-US"},[
                        m("div",{class:"pub-bibi-price-text text-background"},[
                            'USDT'
                        ]),
                        m("input",{class:"input pub-bibi-price-US-input",type:"text",placeholder:"市价",readonly:"readonly"}),
                    ]),
                    // m("div",{class:"text-size"},[
                    //     "估值 ￥ 63398.6645"
                    // ]),
                ]),
            ]),
            m("div",{class:"pub-bibi-price"},[
                m('div',{class:"pub-bibi-price-til"},[
                    "数量"
                ]),
                m('div',{class:"pub-bibi-price-inp"},[
                    m("div",{class:"pub-bibi-price-US"},[
                        m("div",{class:"pub-bibi-price-text text-background"},[
                            'BTC'
                        ]),
                        m("input",{class:"input pub-bibi-price-US-input",type:"number",placeholder:"9122.11"}),
                    ]),
                    m("div",{class:"text-size pub-button-div"},[
                        m('div',{class:"pub-div-sty text-background cursor-pointer is-primary is-primary-font"},[
                            "25%"
                        ]),
                        m('div',{class:"pub-div-sty text-background cursor-pointer"},[
                            "50%"
                        ]),
                        m('div',{class:"pub-div-sty text-background cursor-pointer"},[
                            "75%"
                        ]),
                        m('div',{class:"pub-div-sty text-background cursor-pointer"},[
                            "100%"
                        ]),
                    ]),
                ]),
            ]),
            // m("div",{class:"pub-bibi-price"},[
            //     m('div',{class:"pub-bibi-price-til"},[
            //         "价值"
            //     ]),
            //     m('div',{class:"pub-bibi-price-inp"},[
            //         m("div",{class:"pub-bibi-price-US"},[
            //             m("div",{class:"pub-bibi-price-text text-background"},[
            //                 'USDT'
            //             ]),
            //             m("input",{class:"input pub-bibi-price-US-input",type:"number",placeholder:"9122.11"}),
            //         ]),
            //     ]),
            // ]),
            m("div",{class:"pub-bibi-price"},[
                m('div',{class:"pub-bibi-price-til"},[
                    "余额"
                ]),
                m('div',{class:"pub-bibi-price-inp"},[
                    m("div",{class:"pub-balance"},[
                        "34313929.08525448 USDT"
                    ]),
                    m("div",{class:"pub-balance-button cursor-pointer is-primary-font" + (obj.buttonType?" pub-buy-sell-1" :" pub-buy-sell-2")},[
                        (obj.buttonType?" 买入 BTC" :" 卖出 BTC"),
                    ]),
                ]),
            ]),
        ])
            
    },
    onremove: function () {
        obj.rmEVBUS()
    }
}