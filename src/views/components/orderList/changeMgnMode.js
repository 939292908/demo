var m = require("mithril")


let obj = {
    EV_OPENCHANGEMGNMODE_UPD: 'EV_openChangeMgnMode_UPD',
    open: false,
    tabsActive: 0,
    form: {
        num: '',
    },
    param: {},
    wlt: {},
    maxAddMgn:'0.00000000',
    minDelMgn:'0.00000000',
    LastPrz: '0.00',
    SettPrz: '0.00',
    placeholder: gDI18n.$t('10415'),//'金额(USDT)',
    //初始化全局广播
    initEVBUS: function () {
        let that = this

        if (this.EV_OPENCHANGEMGNMODE_UPD_unbinder) {
            this.EV_OPENCHANGEMGNMODE_UPD_unbinder()
        }
        this.EV_OPENCHANGEMGNMODE_UPD_unbinder = window.gEVBUS.on(this.EV_OPENCHANGEMGNMODE_UPD, arg => {
            that.open = true
            that.initInfo(arg.param)
        })

        if (this.EV_WLT_UPD_unbinder) {
            this.EV_WLT_UPD_unbinder()
        }
        this.EV_WLT_UPD_unbinder = window.gEVBUS.on(gTrd.EV_WLT_UPD, arg => {
            that.initWlt()
        })

        //tick行情全局广播
        if(this.EV_TICK_UPD_unbinder){
            this.EV_TICK_UPD_unbinder()
        }
        this.EV_TICK_UPD_unbinder = window.gEVBUS.on(gMkt.EV_TICK_UPD,arg=> {
            that.onTick(arg)
        })
    },
    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_OPENCHANGEMGNMODE_UPD_unbinder) {
            this.EV_OPENCHANGEMGNMODE_UPD_unbinder()
        }
        if (this.EV_WLT_UPD_unbinder) {
            this.EV_WLT_UPD_unbinder()
        }
        //tick行情全局广播
        if(this.EV_TICK_UPD_unbinder){
            this.EV_TICK_UPD_unbinder()
        }
    },
    submit: function () {
        let that = this

        
        if (this.form.num === '0') {
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10035'/*'调整金额不能为0'*/), type: 'danger' })
        } else if (!this.form.num) {
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10036'/*'调整金额不能为空'*/), type: 'danger' })
        }else if(Number(this.form.num) == 0){
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10035'/*'调整金额不能为0'*/), type: 'danger' })
        }

        let Sym = this.param.pos.Sym
        let AId = this.param.pos.AId
        let PId = this.param.pos.PId
        let num = this.tabsActive == 0? Number(this.form.num):-Number(this.form.num)


        if(this.tabsActive == 0){
            let aWdrawable = Number(obj.wlt.aWdrawable || 0)
            if (aWdrawable == 0) {
                return window.$message({ title: gDI18n.$t('10037'/*'提示'*/), content: gDI18n.$t('10038'/*'可用资金不足！'*/), type: 'danger' })
            } else if (aWdrawable < Number(this.form.num)) {
                return window.$message({ title: gDI18n.$t('10037'/*'提示'*/), content: gDI18n.$t('10039'/*'调整金额不能大于最多可增加资产！'*/), type: 'danger' })
            }
        }else{
            if (Number(this.minDelMgn) < Number(this.form.num)) {
                return window.$message({ title: gDI18n.$t('10037'/*'提示'*/), content: gDI18n.$t('10040'/*'调整金额不能大于最多可减少资产！'*/), type: 'danger' })
            }
        }
        let p = {
            "AId": AId,  // 账号的AId, 必须有
            "Sym": Sym,   // 交易对名称, 必须有
            "PId": PId,   // 仓位的ID, 必须有
            "Param": num      // float64 值,必须有,正数表示增加，负数表示减少.
        }

        window.gTrd.ReqTrdPosTransMgn(p, function (aTrd, aArg) {
            console.log('ReqTrdPosTransMgn ==> ', aArg)
            if (aArg.code == 0) {
                window.$message({ title: gDI18n.$t('10037'/*'提示'*/), content: gDI18n.$t('10041'/*'操作成功！'*/), type: 'success' })
                that.open = false
            }
        })
    },
    setTabsActive: function (param) {
        this.tabsActive = param
    },
    initInfo: function (param) {
        this.form = {
            num: '',
        }
        this.param = param
        this.minDelMgn = Number(param.pos.aAvailMgnISO).toFixed2(8)
        this.placeholder = gDI18n.$t('10042',{value :param.pos.SettleCoin})//`金额(${param.pos.SettleCoin})`
        this.initWlt()
    },
    openMode: function (param) {
        /** param = {
          pos: {
            AId: 'xxxxxx'
            Sym: 'BTC.USDT',
            PId: '', //仓位PId
            Sz: 0, //持仓数量
          },
          cb: function(){}
        }*/
        gEVBUS.emit(obj.EV_OPENCHANGEMGNMODE_UPD, { Ev: obj.EV_OPENCHANGEMGNMODE_UPD, param: param })
    },
    closeMode: function () {
        this.open = false
        this.form.num = ''
    },
    onNumInput: function (e) {
        if (Number(e.target.value) < 0) {
            this.form.num = 0
        }else {
            this.form.num = e.target.value
        }
    },
    initWlt: function (arg) {
        let Sym = this.param.pos ? this.param.pos.Sym : ''
        if (!Sym) return
        let assetD = window.gMkt.AssetD[Sym] || {}
        let wallets = []
        if (assetD.TrdCls == 2 || assetD.TrdCls == 3) {
            wallets = window.gTrd.Wlts['01']
        }
        for (let i = 0; i < wallets.length; i++) {
            let item = wallets[i]
            if (item.AId && item.Coin == assetD.SettleCoin) {
                this.wlt = item
                this.maxAddMgn = Number(item.aWdrawable || 0).toFixed2(8)
            }
        }
        m.redraw()
    },
    onTick: function(param){
        if(obj.open && obj.param.pos && param.Sym == obj.param.pos.Sym){
            let obj = utils.getTickObj(window.gMkt.AssetD, window.gMkt.AssetEx, param.data)
            if(obj){
                this.LastPrz = obj.LastPrz
                this.SettPrz = obj.SettPrz
            }
        }
    },
}

export default {
    oninit: function (vnode) {

    },
    oncreate: function (vnode) {
        obj.initEVBUS()

        window.$openChangeMgnMode = obj.openMode
    },
    view: function (vnode) {
        return m('div', { class: 'pub-change-mgn' }, [
            m("div", { class: "modal" + (obj.open ? " is-active" : ''), }, [
                m("div", { class: "modal-background", onclick: () => { obj.open = false}}),
                m("div", { class: "modal-card" }, [
                    m("header", { class: "pub-change-mgn-head modal-card-head" }, [
                        m("p", { class: "modal-card-title" }, [
                            gDI18n.$t('10043')//'调节保证金'
                        ]),
                        m("button", {
                            class: "delete", "aria-label": "close", onclick: function () {
                                obj.closeMode()
                            }
                        }),
                    ]),
                    m("section", { class: "pub-change-mgn-content modal-card-body" }, [
                        m("div", { class: "tabs " }, [
                            m("ul", [
                                m("li", { class: "" + (obj.tabsActive == 0 ? ' is-active' : '') }, [
                                    m("a", {
                                        class: "", onclick: function () {
                                            obj.setTabsActive(0)
                                        }
                                    }, [
                                        gDI18n.$t('10044')//'增加保证金'
                                    ])
                                ]),
                                m("li", { class: "" + (obj.tabsActive == 1 ? ' is-active' : '') }, [
                                    m("a", {
                                        class: "", onclick: function () {
                                            obj.setTabsActive(1)
                                        }
                                    }, [
                                        gDI18n.$t('10045')//'减少保证金'
                                    ])
                                ]),
                            ])
                        ]),

                        m('div', { class: "is-flex field has-text-2" }, [
                            m('div', { class: ""}, [
                                m('span', { class: "" + utils.getColorStr(obj.param.pos&&obj.param.pos.Sz > 0?1:-1, 'font') }, [
                                    obj.param.pos && obj.param.pos.dirStr
                                ]),
                                m('span', { class: ""}, [
                                    utils.getSymDisplayName(window.gMkt.AssetD, obj.param.pos && obj.param.pos.Sym),
                                ]),
                            ]),
                            m('.spacer'),
                            m('div', { class: ""}, [
                                m('span', { class: ""}, [
                                    gDI18n.$t('10046')//'最新价：'
                                ]),
                                m('span', { class: ""}, [
                                    obj.LastPrz,
                                ]),
                            ]),
                        ]),
                        m('div', { class: "is-flex field has-text-2" }, [
                            m('div', { class: ""}, [
                                m('span', { class: ""}, [
                                    gDI18n.$t('10047')//'当前保证金：'
                                ]),
                                m('span', { class: ""}, [
                                    obj.param.pos && obj.param.pos.aMM
                                ]),
                            ]),
                            m('.spacer'),
                            m('div', { class: ""}, [
                                m('span', { class: ""}, [
                                    gDI18n.$t('10048')//'标记价：'
                                ]),
                                m('span', { class: ""}, [
                                    obj.SettPrz,
                                ]),
                            ]),
                        ]),
                        m('div', { class: "pub-change-mgn-content-stopl-input field has-text-2" }, [
                            m('div', { class: "control is-expanded" }, [
                                m('input', {
                                    class: "input ", type: 'number', placeholder: obj.placeholder, value: obj.form.num, oninput: function (e) {
                                        obj.onNumInput(e)
                                    }
                                })
                            ])
                        ]),
                        m('div', { class: "is-flex has-text-2"+(obj.tabsActive == 0?'':' is-hidden') }, [
                            m('div', { class: ""}, [
                                gDI18n.$t('10049')//'最多可增加资产'
                            ]),
                            m('.spacer'),
                            m('div', { class: "cursor-pointer", onclick: function(){
                                obj.form.num = obj.maxAddMgn
                            }}, [
                                obj.maxAddMgn
                            ]),
                        ]),
                        m('div', { class: "is-flex has-text-2"+(obj.tabsActive == 1?'':' is-hidden') }, [
                            m('div', { class: ""}, [
                                gDI18n.$t('10050')//'最多可减少资产'
                            ]),
                            m('.spacer'),
                            m('div', { class: "cursor-pointer", onclick: function(){
                                obj.form.num = obj.minDelMgn
                            }}, [
                                obj.minDelMgn
                            ]),
                        ]),

                    ]),
                    m("footer", { class: "pub-change-mgn-foot modal-card-foot" }, [
                        m("button", {
                            class: "button is-success", onclick: function () {
                                obj.submit()
                            }
                        }, [
                            gDI18n.$t('10051')//'确定'
                        ]),
                        m("button", {
                            class: "button", onclick: function () {
                                obj.closeMode()
                            }
                        }, [
                            gDI18n.$t('10052')//'取消'
                        ]),
                    ]),
                ])
            ])
        ])

    },
    onremove: function (vnode) {
        obj.rmEVBUS()
        window.$openMarketAddMode = null
    },
}