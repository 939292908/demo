var m = require("mithril")

let obj = {
    wlt: {},
    //需要显示的行情数据
    lastTick: {},
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
    //获取当前合约最新行情
    getLastTick: function(){
        let Sym = window.gMkt.CtxPlaying.Sym
        return this.lastTick[Sym] || {}
    },

    initWlt: function(arg){
        let Sym = window.gMkt.CtxPlaying.Sym
        let assetD = window.gMkt.AssetD[Sym] || {}
        let wallets = []
        if(assetD.TrdCls == 1){
            wallets = window.gTrd.Wlts['02']
        }
        let isUpdate = false
        for(let i = 0;i < wallets.length; i++){
            let item = wallets[i]
            if(item.AId && item.Coin == assetD.SettleCoin){
                isUpdate = true

                this.wlt = utils.formateWallet(item)//item
            }
        }
        if(!isUpdate){
            this.wlt = {}
        }
        m.redraw()
        console.log(this.wlt,22222222222)
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
                        '总额'
                    ]),
                    m('div', {class: 'has-text-1'}, [
                        obj.wlt.TOTAL?Number(obj.wlt.TOTAL).toFixed2(8): (0).toFixed2(8)
                    ])
                ]),
                m('div', {class: 'level-item'}, [
                    m('div', {class: 'text--secondary has-text-2'}, [
                        '冻结'
                    ]),
                    m('div', {class: 'has-text-1 '}, [
                        obj.wlt.Frz?Number(obj.wlt.Frz).toFixed2(8): (0).toFixed2(8)
                    ])
                ]),
                m('div', {class: 'level-item'}, [
                    m('div', {class: 'text--secondary has-text-2'}, [
                        '可用'
                    ]),
                    m('div', {class: 'has-text-1'}, [
                        obj.wlt.NL?Number(obj.wlt.NL).toFixed2(8): (0).toFixed2(8)
                    ])
                ]),
                m('div', {class: 'level-item'}, [
                    m('div', {class: 'text--secondary has-text-2'}, [
                        'USDT估值'
                    ]),
                    m('div', {class: 'has-text-1'}, [
                        obj.wlt.aMI?Number(obj.wlt.aMI).toFixed2(8): (0).toFixed2(8)
                    ])
                ])
            ])
        ])
    },
    onremove: function(){
        obj.rmEVBUS()
    }
}