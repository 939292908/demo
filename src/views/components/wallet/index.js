var m = require("mithril")

let obj = {
    wlt: {},
    //初始化全局广播
    initEVBUS: function(){
        let that = this
        

        //当前选中合约变化全局广播
        if(this.EV_CHANGESYM_UPD_unbinder){
            this.EV_CHANGESYM_UPD_unbinder()
        }
        this.EV_CHANGESYM_UPD_unbinder = window.gEVBUS.on(gMkt.EV_CHANGESYM_UPD,arg=> {
            that.initWlt()
        })

        if(this.EV_GET_WLT_READY_unbinder){
            this.EV_GET_WLT_READY_unbinder()
        }
        this.EV_GET_WLT_READY_unbinder = window.gEVBUS.on(gTrd.EV_GET_WLT_READY,arg=> {
            that.initWlt()
        })

        if(this.EV_WLT_UPD_unbinder){
            this.EV_WLT_UPD_unbinder()
        }
        this.EV_WLT_UPD_unbinder = window.gEVBUS.on(gTrd.EV_WLT_UPD,arg=> {
            that.initWlt()
        })

        if(this.EV_POSABDWLTCALCOVER_UPD_unbinder){
            this.EV_POSABDWLTCALCOVER_UPD_unbinder()
        }
        this.EV_POSABDWLTCALCOVER_UPD_unbinder = window.gEVBUS.on(window.gTrd.EV_POSABDWLTCALCOVER_UPD,arg=> {
            that.initWlt()
        })
        

        
    },
    //删除全局广播
    rmEVBUS: function(){
        if(this.EV_CHANGESYM_UPD_unbinder){
            this.EV_CHANGESYM_UPD_unbinder()
        }
        if(this.EV_GET_WLT_READY_unbinder){
            this.EV_GET_WLT_READY_unbinder()
        }
        if(this.EV_WLT_UPD_unbinder){
            this.EV_WLT_UPD_unbinder()
        }
        if(this.EV_POSABDWLTCALCOVER_UPD_unbinder){
            this.EV_POSABDWLTCALCOVER_UPD_unbinder()
        }
    },

    initWlt: function(arg){
        let Sym = window.gMkt.CtxPlaying.Sym
        let assetD = window.gMkt.AssetD[Sym] || {}
        let wallets = []
        if(assetD.TrdCls == 2 || assetD.TrdCls == 3){
            wallets = window.gTrd.Wlts['01']
        }
        for(let i = 0;i < wallets.length; i++){
            let item = wallets[i]
            if(item.AId && item.Coin == assetD.SettleCoin){
                this.wlt = item
            }
        }
        if(!isUpdate){
            this.wlt = {}
        }
        m.redraw()
    }
}

export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
        obj.initEVBUS()
    },
    view: function(vnode) {
        
        return m("div",{class:"pub-wallet box has-text-centered"},[
            m("div",{class:"pub-wallet-tabs tabs"},[
                m("ul",[
                  m("li",{class:""},[
                    m("a",{class:"", href:"javascript:void(0);", onclick: function(){
                      
                    }},[
                      '合约资产'
                    ])
                  ]),
                //   m("li",{class:""},[
                //     m("a",{class:"", href:"javascript:void(0);", onclick: function(){
                      
                //     }},[
                //       '资产划转'
                //     ])
                //   ])
                ]),
            ]),
            m('div', {class:"pub-wallet-content"}, [
                m('div', {class: 'level'}, [
                    m('div', {class: 'level-left text--secondary'}, [
                        '账户权益'
                    ]),
                    m('div', {class: 'level-right'}, [
                        obj.wlt.WltBal?Number(obj.wlt.WltBal).toFixed2(8): (0).toFixed2(8)
                    ])
                ]),
                m('div', {class: 'level'}, [
                    m('div', {class: 'level-left text--secondary'}, [
                        '未实现盈亏'
                    ]),
                    m('div', {class: 'level-right'}, [
                        obj.wlt.aUPNL?Number(obj.wlt.aUPNL).toFixed2(8): (0).toFixed2(8)
                    ])
                ]),
                m('div', {class: 'level'}, [
                    m('div', {class: 'level-left text--secondary'}, [
                        '仓位保证金'
                    ]),
                    m('div', {class: 'level-right'}, [
                        obj.wlt.aMM?Number(obj.wlt.aMM).toFixed2(8): (0).toFixed2(8)
                    ])
                ]),
                m('div', {class: 'level'}, [
                    m('div', {class: 'level-left text--secondary'}, [
                        '委托保证金'
                    ]),
                    m('div', {class: 'level-right'}, [
                        obj.wlt.aMI?Number(obj.wlt.aMI).toFixed2(8): (0).toFixed2(8)
                    ])
                ]),
                m('div', {class: 'level'}, [
                    m('div', {class: 'level-left text--secondary'}, [
                        '可用保证金'
                    ]),
                    m('div', {class: 'level-right'}, [
                        obj.wlt.aWdrawable?Number(obj.wlt.aWdrawable).toFixed2(8): (0).toFixed2(8)
                    ])
                ]),
                m('div', {class: 'level'}, [
                    m('div', {class: 'level-left text--secondary'}, [
                        '可用赠金'
                    ]),
                    m('div', {class: 'level-right'}, [
                        obj.wlt.aGift?Number(obj.wlt.aGift).toFixed2(8): (0).toFixed2(8)
                    ])
                ]),
                m('div', {class: 'level'}, [
                    m('div', {class: 'level-left text--secondary'}, [
                        '风险度'
                    ]),
                    m('div', {class: 'level-right'}, [
                        obj.wlt.walletRate?(Number(obj.wlt.walletRate)*100).toFixed2(2)+'%': (0).toFixed2(2)+'%'
                    ])
                ]),
            ])
        ])
    },
    onremove: function(){
        obj.rmEVBUS()
    }
}