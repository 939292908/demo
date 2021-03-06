var m = require("mithril")
import Modal from "../common/Modal"


let obj = {
    EV_OPENSOMECLOSEMODE_UPD: 'EV_openSomeCloseMode_UPD',
    open: false,
    tabsActive: 1,
    form: {
        prz: '',
        num: '',
        maxNum: 0,  //最大可平数量
        lockNum: 0, //冻结数量
    },
    param: {

    },
    quickBtn: [0.25, 0.5, 0.75, 1],
    MgnNeed: '', //市价加仓所需委托保证金
    //初始化全局广播
    initEVBUS: function () {
        let that = this

        if (this.EV_OPENMARKETADDMODE_UPD_unbinder) {
            this.EV_OPENMARKETADDMODE_UPD_unbinder()
        }
        this.EV_OPENMARKETADDMODE_UPD_unbinder = window.gEVBUS.on(this.EV_OPENSOMECLOSEMODE_UPD, arg => {
            that.open = true
            that.initInfo(arg.param)
        })
    },
    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_OPENMARKETADDMODE_UPD_unbinder) {
            this.EV_OPENMARKETADDMODE_UPD_unbinder()
        }
    },
    submit: function () {
        let that = this
        console.log('some close submit', this.form)
        if (this.tabsActive == 0) {
            if (this.form.prz === '0') {
                return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10180'/*'平仓价格不能为0'*/), type: 'danger' })
            } else if (!this.form.prz) {
                return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10181'/*'平仓价格不能为空'*/), type: 'danger' })
            }
        }

        if (this.form.num === '0') {
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10182'/*'平仓数量不能为0'*/), type: 'danger' })
        } else if (!this.form.num) {
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10183'/*'平仓数量不能为空'*/), type: 'danger' })
        }

        let Sym = this.param.pos.Sym
        let AId = this.param.pos.AId
        let PId = this.param.pos.PId
        let Dir = this.param.pos.Sz > 0 ? -1 : 1

        let Lever = this.param.pos.Lever || 0
        let MIRMy = this.param.pos.MIRMy || 0

        let p = null;
        if (this.tabsActive == 0) {
            p = {
                Sym: Sym,
                PId: PId,
                AId: AId,
                COrdId: new Date().getTime() + '',
                Dir: Dir,
                OType: 1,
                Prz: Number(this.form.prz),
                Qty: Number(this.form.num),
                QtyDsp: 0,
                Tif: 0,
                OrdFlag: 2, //只减仓
                PrzChg: 0,
                lvr: Lever,
                MIRMy: MIRMy,
            }
        } else {
            p = {
                Sym: Sym,
                PId: PId,
                AId: AId,
                COrdId: new Date().getTime() + '',
                Dir: Dir,
                OType: 2,
                Prz: 1,
                Qty: Number(this.form.num),
                QtyDsp: 0,
                Tif: 1,
                OrdFlag: 2, //只减仓
                PrzChg: 10,
                lvr: Lever,
                MIRMy: MIRMy,
            }
        }
        if (!p) return
        window.gTrd.ReqTrdOrderNew(p, function (aTrd, aArg) {
            console.log('ReqTrdOrderNew ==> ', aArg)
            if (aArg.code == 0 && !aArg.data.ErrCode) {
                that.open = false
            } else {
                window.$message({ title: gDI18n.$t('10037'/*"提示"*/), content: utils.getTradeErrorCode(aArg.code || aArg.data.ErrCode), type: 'danger' })
            }
        })
    },
    // setTabsActive: function (param) {
    //     this.tabsActive = param
    // },
    initInfo: function (param) {
        this.form = {
            prz: '',
            num: '',
        }
        let maxNum = 0
        let lockNum = 0
        if (param.pos.Sz > 0) {
            lockNum = param.pos.aQtySell
        } else if (param.pos.Sz < 0) {
            lockNum = param.pos.aQtyBuy
        }
        lockNum = Math.min(Math.abs(param.pos.Sz), lockNum)
        maxNum = Math.max(Math.abs(param.pos.Sz) - lockNum, 0)
        this.maxNum = maxNum
        this.lockNum = lockNum

        this.param = param
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
        gEVBUS.emit(obj.EV_OPENSOMECLOSEMODE_UPD, { Ev: obj.EV_OPENSOMECLOSEMODE_UPD, param: param })
    },
    closeMode: function () {
        this.open = false
        this.form.prz = ''
        this.form.num = ''
    },
    onPrzInput: function (e) {
        let Sym = this.param.pos.Sym
        let ass = window.gMkt.AssetD[Sym]
        let maxPrz = Number(ass ? ass.PrzMax : 0)
        if (Number(e.target.value) > maxPrz) {
            this.form.prz = maxPrz
        } else {
            this.form.prz = e.target.value
        }
    },
    onNumInput: function (e) {
        let Sym = this.param.pos.Sym
        let ass = window.gMkt.AssetD[Sym]
        let maxNum = this.maxNum || Number(ass ? ass.OrderMaxQty : 0)
        if (Number(e.target.value) > maxNum) {
            this.form.num = maxNum
        } else if (Number(e.target.value) < 0){
            this.form.num = 0
        }else{
            // this.form.num = e.target.value
            if (e.target.value.includes(".")){
                this.form.num = e.target.value.split(".")[0]
            }else{
                this.form.num = e.target.value
            }
        }
    },
    setTabsActive: function (param) {
        this.tabsActive = param
    },
    getQuickBtns: function () {
        return this.quickBtn.map(function (item) {
            return m('button', {
                key: 'someCloseQuickBtn' + item, class: "button is-outline level-item is-primary has-text-white", onclick: function (e) {
                    obj.clickQuickBtn(item)
                }
            }, [
                (item * 100) + '%'
            ])
        })
    },
    clickQuickBtn: function (param) {
        console.log('clickQuickBtn', param)
        this.form.num = (this.maxNum * param).toFixed(0)
    }
}

export default {
    oninit: function (vnode) {

    },
    oncreate: function (vnode) {
        obj.initEVBUS()

        window.$openSomeCloseMode = obj.openMode
    },
    view: function (vnode) {
        let modalBody = [
            m("div", { class: "tabs " }, [
                m("ul", [
                    m("li", { class: "" + (obj.tabsActive == 0 ? ' is-active' : '') }, [
                        m("a", {
                            class: "", onclick: function () {
                                obj.setTabsActive(0)
                            }
                        }, [
                            gDI18n.$t('10185')//'限价'
                        ])
                    ]),
                    m("li", { class: "" + (obj.tabsActive == 1 ? ' is-active' : '') }, [
                        m("a", {
                            class: "", onclick: function () {
                                obj.setTabsActive(1)
                            }
                        }, [
                            gDI18n.$t('10081')//'市价'
                        ])
                    ]),
                ])
            ]),
            m('div', { class: "field" + (obj.tabsActive == 0 ? '' : ' is-hidden') }, [
                m('div', { class: "pub-some-close-content-stopp-input field" }, [
                    m('div', { class: "control is-expanded" }, [
                        m("input", {
                            class: "input", type: 'number', placeholder: gDI18n.$t('10186'/*"价格"*/), value: obj.form.prz, oninput: function (e) {
                                obj.onPrzInput(e)
                            }
                        })
                    ])
                ]),
                m('div', { class: "pub-some-close-content-stopl-input field" }, [
                    m('div', { class: "control is-expanded" }, [
                        m('input', {
                            class: "input ", type: 'number', placeholder: gDI18n.$t('10163'/*"数量(张)"*/), value: obj.form.num, oninput: function (e) {
                                obj.onNumInput(e)
                            }
                        })
                    ])
                ]),
            ]),
            m('div', { class: "field" + (obj.tabsActive == 1 ? '' : ' is-hidden') }, [
                m('div', { class: "pub-some-close-content-stopp-input field" }, [
                    m('div', { class: "control is-expanded" }, [
                        m("input", { class: "input", type: 'number', placeholder: gDI18n.$t('10081'/*"市价"*/), readonly: true })
                    ])
                ]),
                m('div', { class: "pub-some-close-content-stopl-input field" }, [
                    m('div', { class: "control is-expanded" }, [
                        m('input', {
                            class: "input ", type: 'number', placeholder: gDI18n.$t('10163'/*"数量(张)"*/), value: obj.form.num, oninput: function (e) {
                                obj.onNumInput(e)
                            }
                        })
                    ])
                ]),
            ]),
            m('.buttons.level', {}, [
                obj.getQuickBtns()
            ]),
            m('div', { class: "level has-text-2" }, [
                m('div', { class: "level-left" }, [
                    gDI18n.$t('10187', { value: obj.maxNum })
                    // '可平数量：'+ obj.maxNum
                ]),
                m('div', { class: "level-left" }, [
                    gDI18n.$t('10188', { value: obj.lockNum })
                    // '冻结数量：'+ obj.lockNum
                ]),
            ]),

        ]
        let modalFooter = [
            m("button", {
                class: "button is-primary has-text-white", onclick: function () {
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
        ]
        return m('div', { class: `pub-some-close` }, [
            m(Modal, {
                isShow: obj.open,
                onClose: () => obj.closeMode(), // 关闭事件
                slot: {
                    header: gDI18n.$t('10184'),//'部分平仓'
                    body: modalBody,
                    footer: modalFooter
                }
            }),

        ])
    },
    onremove: function (vnode) {
        obj.rmEVBUS()
        window.$openSomeCloseMode = null
    },
}