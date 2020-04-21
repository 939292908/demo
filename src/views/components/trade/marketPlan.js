var m = require("mithril")

import * as clacMgnNeed from '../../../futureCalc/calcMgnNeed.js'

let obj = {
    form: {
        Prz: '',
        Num: '',
        triggerPrz: '',
        Lever: 0,
        maxLever: 0,
    },
    faceValue: '= 0.0000 USDT',
    wlt: {},
    MgnNeedForBuy: 0,
    MgnNeedForSell: 0,
    
    //初始化全局广播
    initEVBUS: function () {
        let that = this

        if (this.EV_CHANGEACTIVEPOS_UPD_unbinder) {
            this.EV_CHANGEACTIVEPOS_UPD_unbinder()
        }
        this.EV_CHANGEACTIVEPOS_UPD_unbinder = window.gEVBUS.on(gTrd.EV_CHANGEACTIVEPOS_UPD, arg => {
            that.initPos(arg)
            that.setFaceV()
        })

        //tick行情全局广播
        if (this.EV_TICK_UPD_unbinder) {
            this.EV_TICK_UPD_unbinder()
        }
        this.EV_TICK_UPD_unbinder = window.gEVBUS.on(gMkt.EV_TICK_UPD, arg => {
            this.onTick(arg)
            that.setFaceV()
        })

        //当前选中合约变化全局广播
        if(this.EV_CHANGESYM_UPD_unbinder){
            this.EV_CHANGESYM_UPD_unbinder()
        }
        this.EV_CHANGESYM_UPD_unbinder = window.gEVBUS.on(gMkt.EV_CHANGESYM_UPD,arg=> {
            that.updateSpotInfo(arg)
            that.initPos()
            that.setFaceV()
            that.initWlt()
            that.setMgnNeed()
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


    },
    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_CHANGEACTIVEPOS_UPD_unbinder) {
            this.EV_CHANGEACTIVEPOS_UPD_unbinder()
        }
        if (this.EV_TICK_UPD_unbinder) {
            this.EV_TICK_UPD_unbinder()
        }
    },
    initPos: function (param) {
        let PId = window.gTrd.CtxPlaying.activePId
        let pos = window.gTrd.Poss[PId]

        let Lever = 0, maxLever = 0
        if (pos) {
            let ass = window.gMkt.AssetD[pos.Sym]
            if (ass) {
                maxLever = 1 / ass.MIR
            }
            Lever = pos.Lever
        } else {
            let Sym = window.gMkt.CtxPlaying.Sym
            let ass = window.gMkt.AssetD[Sym]
            if (ass) {
                maxLever = 1 / ass.MIR
            }
        }
        this.form.Lever = Lever
        this.form.maxLever = maxLever
        
    },
    getLever: function () {
        if (this.form.Lever == 0) {
            return (this.form.maxLever ? '全仓' + this.form.maxLever + 'X' : '杠杆')
        } else {
            return '逐仓' + Number(this.form.Lever).toFixed2(2) + 'X'
        }
    },
    onTick: function (arg) {
        if (arg.Sym == window.gMkt.CtxPlaying.Sym ) {
            if(!this.form.Prz){
                let lastTick = window.gMkt.lastTick[arg.Sym]
                this.form.Prz = Number(lastTick && lastTick.LastPrz || 0)
            }
        }
    },
    updateSpotInfo: function(){
        this.form = {
            Prz: '',
            Num: '',
            Lever: 0,
            maxLever: 0,
        }
    },
    submit: function(dir){
        if(this.form.Prz === 0){
            return $message({content: '下单价格不能为0', type: 'danger'})
        }else if(!this.form.Prz){
            return $message({content: '下单价格不能为空', type: 'danger'})
        }

        if(this.form.Num === 0){
            return $message({content: '下单数量不能为0', type: 'danger'})
        }else if(!this.form.Num){
            return $message({content: '下单数量不能为空', type: 'danger'})
        }

        let Sym = window.gMkt.CtxPlaying.Sym
        let AId = window.gWebAPI.CTX.account.uid+'01'
        let PId = window.gTrd.CtxPlaying.activePId
        if(!PId){
            return window.$message({content: '请先选择您要下单的仓位！', type: 'danger'})
        }

        let aWdrawable = Number(obj.wlt.aWdrawable || 0 )
        if(aWdrawable == 0){
            return window.$message({content: '可用资金不足！', type: 'danger'})
        }else if(dir == 1 && aWdrawable < Number(this.MgnNeedForBuy)){
            return window.$message({content: '可用资金不足！', type: 'danger'})
        }else if(dir == -1 && aWdrawable < Number(this.MgnNeedForSell)){
            return window.$message({content: '可用资金不足！', type: 'danger'})
        }

        let p = {
            Sym: Sym,
            PId: PId,
            AId: AId,
            COrdId: new Date().getTime() + '',
            Dir: dir,
            OType: 4,
            Prz:1,
            Qty: Number(this.form.Num),
            QtyDsp: 0,
            Tif: 0,
            OrdFlag: 0,
            PrzChg: 0,
            StopPrz: Number(this.form.triggerPrz),
            StopBy: 1
        }

        window.gTrd.ReqTrdOrderNew(p, function(arg){
            console.log('ReqTrdOrderNew ==> ', arg)
        })
    },
    setLeverage: function(){
        let that = this
        let Sym = window.gMkt.CtxPlaying.Sym
        let PId = window.gTrd.CtxPlaying.activePId
        if(!PId){
            return window.$message({content: '请先选择您要调整的仓位！', type: 'danger'})
        }
        window.$openLeverageMode({
            Sym: Sym,
            PId: PId, //仓位PId
            Lever: this.form.Lever, //杠杆
            MIRMy: 0, //自定义委托保证金率
            needReq: true, //是否需要向服务器发送修改杠杆请求
            cb: function(arg){
                console.log('change Lever callback', arg)
                that.form.Lever = arg.Lever
                that.form.MIRMy = arg.MIRMy
                that.setMgnNeed()
            }
        })
    },
    setFaceV: function() {
        let Sym = window.gMkt.CtxPlaying.Sym
        let ass = window.gMkt.AssetD[Sym]
        if (!ass) return
        let num = Number(this.form.Num)
        if (isNaN(num)) {
          return
        }
        this.faceValue = ass.LotSz * num
        this.faceValue = Number(this.faceValue).toPrecision2(6,8)
        if (ass.TrdCls == 2) {
          this.faceValue = '= ' + this.faceValue + ass.QuoteCoin
        } else if ((ass.Flag & 1) == 1) { //反向
          this.faceValue = '= ' + this.faceValue + ass.QuoteCoin
        } else {
          let spot = utils.getSpotName(ass.ToC, 'USDT', window.gMkt.AssetD);
          let lastTick = window.gMkt.lastTick
          let LastPrz = (lastTick[spot] && lastTick[spot].LastPrz) || (ass && ass.PrzLatest) || 0
          this.faceValue = `= ${this.faceValue + ass.ToC}(${(Number(this.faceValue) * Number(LastPrz)).toFixed(2)}USDT)`
        }
    },
    onInputForNum: function(e){
        let Sym = window.gMkt.CtxPlaying.Sym
        let ass = window.gMkt.AssetD[Sym]
        let maxNum = Number(ass?ass.OrderMaxQty:0)
        if(Number(e.target.value) > maxNum){
            this.form.Num = maxNum
        }else {
            this.form.Num = e.target.value
        }
        this.setFaceV()
        this.setMgnNeed()
    },
    onInputForPrz: function(e){
        let Sym = window.gMkt.CtxPlaying.Sym
        let ass = window.gMkt.AssetD[Sym]
        let maxPrz = Number(ass?ass.PrzMax:0)
        if(Number(e.target.value) > maxPrz){
            this.form.Prz = maxPrz
        }else {
            this.form.Prz = e.target.value
        }
        this.setMgnNeed()
    },
    onInputFortriggerPrz: function(e){
        let Sym = window.gMkt.CtxPlaying.Sym
        let ass = window.gMkt.AssetD[Sym]
        let maxPrz = Number(ass?ass.PrzMax:0)
        if(Number(e.target.value) > maxPrz){
            this.form.triggerPrz = maxPrz
        }else {
            this.form.triggerPrz = e.target.value
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
    },
    setMgnNeed() {
        let that = this;
        let Sym = window.gMkt.CtxPlaying.Sym
        let Prz = Number(this.form.Prz)
        let QtyLong = Number(this.form.Num)
        let QtyShort = Number(this.form.Num)
        let PId = window.gTrd.CtxPlaying.activePId
        let Lever = this.form.Lever
        
        let posObj = window.gTrd.Poss
        let pos = []
        for(let key in posObj){
            pos.push(posObj[key])
        }
        let order = window.gTrd.Orders['01']
        let wallet = window.gTrd.Wlts['01']
        let lastTick = window.gMkt.lastTick
        let assetD = window.gMkt.AssetD
        let RSdata = window.gTrd.RS

        Prz = (lastTick[Sym] && lastTick[Sym].LastPrz) || (assetD[Sym] && assetD[Sym].PrzLatest) || 0

        let newOrderForBuy = {
            Sym: Sym,
            Prz: Prz,
            Qty: QtyLong,
            QtyF: 0,
            Dir: 1,
            PId: PId, 
            Lvr: Lever,
            MIRMy: 0
        }
        clacMgnNeed.calcFutureWltAndPosAndMI(pos, wallet, order, RSdata, assetD, lastTick, '1', newOrderForBuy, 0, res => {
            console.log('bug 成本计算结果： ', res)
            that.MgnNeedForBuy = Number(res || 0)
        })

        let newOrderForSell = {
            Sym: Sym,
            Prz: Prz,
            Qty: QtyShort,
            QtyF: 0,
            Dir: -1,
            PId: PId, 
            Lvr: Lever,
            MIRMy: 0
        }
        clacMgnNeed.calcFutureWltAndPosAndMI(pos, wallet, order, RSdata, assetD, lastTick, '1', newOrderForSell, 0, res => {
            console.log('sell 成本计算结果： ', res)
            that.MgnNeedForSell = Number(res || 0)
        })
        
    },
}
export default {
    oninit: function (vnode) {

    },
    oncreate: function (vnode) {
        obj.initEVBUS()
        obj.initPos()
        obj.setFaceV()
    },
    view: function (vnode) {

        return m("div", { class: "pub-place-order-form has-text-centered" }, [
            m("div", { class: "pub-place-order-form-lever-input field" }, [
                m("div", { class: "control" }, [
                    m("input", {
                        class: " input", type: 'text', placeholder: obj.getLever(), readonly: true, onclick: function () {
                            obj.setLeverage()
                        }
                    })
                ])
            ]),
            m("div", { class: "pub-place-order-form-prz-input field" }, [
                m("div", { class: "control" }, [
                    m("input", { class: "input", type: 'number', placeholder: "市价", readonly: true})
                ])
            ]),
            m("div", { class: "pub-place-order-form-num-input field" }, [
                m("div", { class: "control" }, [
                    m("input", { class: "input", type: 'number', placeholder: "请输入数量", value: obj.form.Num,oninput: function(e) {
                        obj.onInputForNum(e)
                    } }),
                    m('span', {class: 'pub-place-order-form-num-input-face-value'}, [
                        obj.faceValue
                    ])
                ])
            ]),
            m("div", { class: "pub-place-order-form-trigger-prz-input field" }, [
                m("div", { class: "control" }, [
                    m("input", { class: "input", type: 'number', placeholder: "请输入触发价格", value: obj.form.triggerPrz,oninput: function(e) {
                        obj.onInputFortriggerPrz(e)
                    }})
                ])
            ]),
            m("div", { class: "pub-place-order-form-buttons field" }, [
                m("div", { class: "level" }, [
                    m("div", { class: "level-left" }, [
                        m('div', {}, [
                            m("button", { class: "button is-success is-fullwidth", onclick: function(){
                                obj.submit(1)
                            }}, [
                                "买入/做多(看涨)"
                            ]),
                            m('div', {class: "pub-place-order-form-need-mgn level"}, [
                                m('div', {class: "level-left"}, [
                                    '所需保证金'
                                ]),
                                m('div', {class: "level-right"}, [
                                    Number(obj.MgnNeedForBuy).toPrecision2(6,8)
                                ])
                            ])
                        ])
                    ]),
                    m("div", { class: "level-right" }, [
                        m('div', {}, [
                            m("button", { class: "button is-danger is-fullwidth", onclick: function(){
                                obj.submit(-1)
                            }}, [
                                "卖出/做空(看跌)"
                            ]),
                            m('div', {class: "pub-place-order-form-need-mgn level"}, [
                                m('div', {class: "level-left"}, [
                                    '所需保证金'
                                ]),
                                m('div', {class: "level-right"}, [
                                    Number(obj.MgnNeedForSell).toPrecision2(6,8)
                                ])
                            ])
                        ]),
                    ])
                ]),
            ]),
            
            m('div', {class: "pub-place-order-form-wallet level field"}, [
                m('div', {class: "level-left"}, [
                    '可用保证金'
                ]),
                m('div', {class: "level-right"}, [
                    obj.wlt.aWdrawable?Number(obj.wlt.aWdrawable).toFixed2(8): (0).toFixed2(8)
                ])
            ])
        ])
    },
    onremove: function () {
        obj.rmEVBUS()
    }
}