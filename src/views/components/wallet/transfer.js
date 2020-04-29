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
        
        return m("div",{class:"pub-transfer"},[
            m('div', {class:"pub-transfer-coin-dropdown field"}, [
                m('div', {class:"dropdown is-hoverable"}, [
                    m('div', {class:"dropdown-trigger"}, [
                        m('button', {class:"button is-outline is-fullwidth"}, [
                            m('div', {class:"button-content is-flex"}, [
                                "USDT",
                                m('.spacer'),
                                m('span', {class:"icon"}, [
                                    m('i', {class:"iconfont iconxiala has-text-primary is-size-7"})
                                ]),
                            ]),
                        ]),
                    ]),
                    m('div', {class:"dropdown-menu"}, [
                        m('div', {class:"dropdown-content"}, [
                            m('div', {class:"dropdown-item"}, [
                                'USDT'
                            ]),
                        ]),
                    ]),
                ]),
            ]),
            m('div', {class:"pub-transfer-transfer-select field  has-addons"}, [
                m("div", { class: "pub-transfer-transfer-select-left control is-expanded" }, [
                    m('div', {class:"dropdown is-hoverable"}, [
                        m('div', {class:"dropdown-trigger"}, [
                            m('button', {class:"button is-outline is-fullwidth"}, [
                                m('div', {class:"button-content is-flex"}, [
                                    "我的钱包",
                                    m('.spacer'),
                                    m('span', {class:"icon"}, [
                                        m('i', {class:"iconfont iconxiala has-text-primary is-size-7"})
                                    ]),
                                ]),
                            ]),
                        ]),
                        m('div', {class:"dropdown-menu"}, [
                            m('div', {class:"dropdown-content"}, [
                                m('div', {class:"dropdown-item"}, [
                                    '我的钱包'
                                ]),
                            ]),
                        ]),
                    ]),
                ]),
                m("div", { class: "pub-transfer-transfer-select-center control is-expanded cursor-pointer" }, [
                    m('span', {class:"icon is-medium"}, [
                        m('i', {class:"iconfont iconswitch has-text-primary is-size-4"})
                    ]),
                ]),
                m("div", { class: "pub-transfer-transfer-select-right control is-expanded" }, [
                    m('div', {class:"dropdown is-hoverable"}, [
                        m('div', {class:"dropdown-trigger"}, [
                            m('button', {class:"button is-outline is-fullwidth"}, [
                                m('div', {class:"button-content is-flex"}, [
                                    "合约账户",
                                    m('.spacer'),
                                    m('span', {class:"icon"}, [
                                        m('i', {class:"iconfont iconxiala has-text-primary is-size-7"})
                                    ]),
                                ]),
                            ]),
                        ]),
                        m('div', {class:"dropdown-menu"}, [
                            m('div', {class:"dropdown-content"}, [
                                m('div', {class:"dropdown-item"}, [
                                    '合约账户'
                                ]),
                            ]),
                        ]),
                    ]),
                ]),
            ]),
            m("div", { class: "pub-transfer-num-input field" }, [
                m("div", { class: "control" }, [
                    m("input", { class: "input", type: 'number', placeholder: "请输划转入数量", /*step: obj.NumStep, value: obj.form.Num,*/oninput: function(e) {
                        obj.onInputForNum(e)
                    } })
                ])
            ]),
            m("div", { class: "pub-transfer-wlt field" }, [
                '最大可划：0.00'
            ]),
            m("div", { class: "pub-transfer-btn field" }, [
                m("button", { class: "button is-primary is-fullwidth" }, [
                    '划转'
                ])
            ]),
        ])
    },
    onbeforeremove: function(){
        obj.rmEVBUS()
    }
}