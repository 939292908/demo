var m = require("mithril")
import Tooltip from "../common/Tooltip/Tooltip.view"

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
        if(this.EV_WEB_LOGOUT_unbinder){
            this.EV_WEB_LOGOUT_unbinder()
        }
        this.EV_WEB_LOGOUT_unbinder = window.gEVBUS.on(gWebAPI.EV_WEB_LOGOUT,arg=> {
            that.wlt = {}
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
        if(this.EV_WEB_LOGOUT_unbinder){
            this.EV_WEB_LOGOUT_unbinder()
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
        
        return m("div",{class:"pub-wallet"},[
            m('div', {class:"pub-wallet-content"}, [
                m('div', {class: 'level-item'}, [
                    m('div', {class: 'text--secondary has-text-2'}, [
                        m(Tooltip, {
                            dashed: true,
                            label: gDI18n.$t('10231'),//'账户权益'
                            content: gDI18n.$t('10574'), //'存入-取出+已实现盈亏+未实现盈亏'
                        }),
                    ]),
                    m('div', {class: 'has-text-1'}, [
                        obj.wlt.WltBal?Number(obj.wlt.WltBal).toFixed2(8): (0).toFixed2(8)
                    ])
                ]),
                m('div', {class: 'level-item'}, [
                    m('div', {class: 'text--secondary has-text-2'}, [
                        m(Tooltip, {
                            dashed: true,
                            label: gDI18n.$t('10427'),//'未实现盈亏'
                            content: gDI18n.$t('10575'), //'所有未平仓合约的当前盈亏'
                        }),
                    ]),
                    m('div', {class: 'has-text-1 '}, [
                        Number(obj.wlt.aUPNL)>=0?m('div',{class:"has-text-success"},[
                            obj.wlt.aUPNL?Number(obj.wlt.aUPNL).toFixed2(8): (0).toFixed2(8)
                        ]):m('div',{class:"has-text-danger "},[
                            obj.wlt.aUPNL?Number(obj.wlt.aUPNL).toFixed2(8): (0).toFixed2(8)
                        ])
                        
                    ])
                ]),
                m('div', {class: 'level-item'}, [
                    m('div', {class: 'text--secondary has-text-2'}, [
                        m(Tooltip, {
                            dashed: true,
                            label: gDI18n.$t('10232'),//'仓位保证金'
                            content: gDI18n.$t('10576'), //'保留所持仓位所需要的保证金'
                        }),
                    ]),
                    m('div', {class: 'has-text-1'}, [
                        obj.wlt.aMM?Number(obj.wlt.aMM).toFixed2(8): (0).toFixed2(8)
                    ])
                ]),
                m('div', {class: 'level-item'}, [
                    m('div', {class: 'text--secondary has-text-2'}, [
                        m(Tooltip, {
                            dashed: true,
                            label: gDI18n.$t('10167'),//'委托保证金'
                            content: gDI18n.$t('10577'), //'委托所需要的保证金'
                        }),
                    ]),
                    m('div', {class: 'has-text-1'}, [
                        obj.wlt.aMI?Number(obj.wlt.aMI).toFixed2(8): (0).toFixed2(8)
                    ])
                ]),
                m('div', {class: 'level-item'}, [
                    m('div', {class: 'text--secondary has-text-2'}, [
                        m(Tooltip, {
                            dashed: true,
                            label: gDI18n.$t('10157'),//'可用保证金'
                            content: gDI18n.$t('10578'), //'当前可用于开仓的保证金'
                        }),
                    ]),
                    m('div', {class: 'has-text-1'}, [
                        obj.wlt.aWdrawable?Number(obj.wlt.aWdrawable).toFixed2(8): (0).toFixed2(8)
                    ])
                ]),
                m('div', {class: 'level-item'}, [
                    m('div', {class: 'text--secondary has-text-2'}, [
                        m(Tooltip, {
                            dashed: true,
                            label: gDI18n.$t('10233'),//'可用赠金'
                            content: gDI18n.$t('10579'), //'当前可用于开仓的赠金'
                        }),
                    ]),
                    m('div', {class: 'has-text-1'}, [
                        obj.wlt.aGift?Number(obj.wlt.aGift).toFixed2(8): (0).toFixed2(8)
                    ])
                ]),
                m('div', {class: 'level-item mb-0-important'}, [
                    m('div', {class: 'text--secondary has-text-2'}, [
                        gDI18n.$t('10234')//'资金使用率'
                    ]),
                    m('div', {class: 'has-text-1'}, [
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