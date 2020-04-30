var m = require("mithril")

import * as clacMgnNeed from '../../../futureCalc/calcMgnNeed.js'

let obj = {
    form: {
        Prz: '',        // 委托价格
        Num: '',        // 委托数量
        triggerPrz: '', // 触发价格
        Lever: 0,       // 杠杠
        maxLever: 0,    // 最大杠杆
        stopP: '',      // 止盈价
        stopL: '',       // 止损价
        MIRMy: 0,     // 自定义委托保证金率
    },
    faceValue: '= 0.0000 USDT',
    LeverInputValue: '杠杠',
    wlt: {},
    MgnNeedForBuy: 0,
    MgnNeedForSell: 0,
    // 是否已经自动填入价格
    isAutoPrz: false,
    PrzStep: 1,
    NumStep: 1,
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
            that.isAutoPrz = false
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

        if(this.EV_WEB_LOGOUT_unbinder){
            this.EV_WEB_LOGOUT_unbinder()
        }
        this.EV_WEB_LOGOUT_unbinder = window.gEVBUS.on(gWebAPI.EV_WEB_LOGOUT,arg=> {
            that.wlt = {}
        })

        if(this.EV_CHANGEPLACEORDPRZABDNUM_unbinder){
            this.EV_CHANGEPLACEORDPRZABDNUM_unbinder()
        }
        this.EV_CHANGEPLACEORDPRZABDNUM_unbinder = window.gEVBUS.on(gEVBUS.EV_CHANGEPLACEORDPRZABDNUM ,arg=> {
            console.log('EV_CHANGEPLACEORDPRZABDNUM==>>>', arg)
            switch(arg.type){
                case 'prz':
                    that.form.Prz = arg.val
                    break;
                case 'num':
                    that.form.Num = arg.val
                    break;
                default:

            }
            that.setMgnNeed()
        })

    },
    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_CHANGEACTIVEPOS_UPD_unbinder) {
            this.EV_CHANGEACTIVEPOS_UPD_unbinder()
        }
        //tick行情全局广播
        if (this.EV_TICK_UPD_unbinder) {
            this.EV_TICK_UPD_unbinder()
        }
        //当前选中合约变化全局广播
        if(this.EV_CHANGESYM_UPD_unbinder){
            this.EV_CHANGESYM_UPD_unbinder()
        }

        if(this.EV_GET_WLT_READY_unbinder){
            this.EV_GET_WLT_READY_unbinder()
        }

        if(this.EV_WLT_UPD_unbinder){
            this.EV_WLT_UPD_unbinder()
        }
        if(this.EV_WEB_LOGOUT_unbinder){
            this.EV_WEB_LOGOUT_unbinder()
        }

        if(this.EV_CHANGEPLACEORDPRZABDNUM_unbinder){
            this.EV_CHANGEPLACEORDPRZABDNUM_unbinder()
        }
    },
    initPos: function (param) {
        let PId = window.gTrd.CtxPlaying.activePId
        let pos = window.gTrd.Poss[PId]

        let Lever = 0, maxLever = 0,MIRMy = 0;
        if (pos) {
            let ass = window.gMkt.AssetD[pos.Sym]
            if (ass) {
                maxLever = 1 / Math.max(ass.MIR, pos.MIRMy || 0)
            }
            MIRMy = pos.MIRMy
            Lever = pos.Lever
        } else {
            let Sym = window.gMkt.CtxPlaying.Sym
            let ass = window.gMkt.AssetD[Sym]
            if (ass) {
                maxLever = 1 / ass.MIR
            }
        }
        this.form.MIRMy = MIRMy
        this.form.Lever = Lever
        this.form.maxLever = maxLever
        this.setLever()
        
    },
    setLever: function () {
        if (this.form.Lever == 0) {
            this.LeverInputValue = (this.form.maxLever ? '全仓' + this.form.maxLever + 'X' : '杠杆')
        } else {
            this.LeverInputValue = '逐仓' + Number(this.form.Lever).toFixed2(2) + 'X'
        }
    },
    onTick: function (arg) {
        if (arg.Sym == window.gMkt.CtxPlaying.Sym && !this.isAutoPrz) {
            if(!this.form.Prz){
                let lastTick = window.gMkt.lastTick[arg.Sym]
                this.form.Prz = Number(lastTick && lastTick.LastPrz || 0)
                this.isAutoPrz = true
            }
        }
    },
    updateSpotInfo: function(){
        this.form = {
            Prz: '',        // 委托价格
            Num: '',        // 委托数量
            triggerPrz: '', // 触发价格
            Lever: 0,       // 杠杠
            maxLever: 0,    // 最大杠杆
            stopP: '',      // 止盈价
            stopL: ''       // 止损价
        }
        this.MgnNeedForBuy = this.MgnNeedForSell = 0
        this.isAutoPrz = false
        let Sym = window.gMkt.CtxPlaying.Sym
        let ass = window.gMkt.AssetD[Sym]
        if(ass){
            this.PrzStep = Number(ass.PrzMinInc)
            this.NumStep = Number(ass.OrderMinQty)
        }
        this.setLever()
    },
    submit: function(dir){
        if(!window.gWebAPI.isLogin()){
            return window.gWebAPI.needLogin()
        }
        if(this.form.Prz === '0'){
            return $message({title: '下单价格不能为0', content: '下单价格不能为0', type: 'danger'})
        }else if(!this.form.Prz){
            return $message({title: '下单价格不能为空', content: '下单价格不能为空', type: 'danger'})
        }

        if(this.form.Num === '0'){
            return $message({title: '下单数量不能为0', content: '下单数量不能为0', type: 'danger'})
        }else if(!this.form.Num){
            return $message({title: '下单数量不能为空', content: '下单数量不能为空', type: 'danger'})
        }

        if(this.form.triggerPrz === '0'){
            return $message({title: '触发价格不能为0', content: '触发价格不能为0', type: 'danger'})
        }else if(!this.form.triggerPrz){
            return $message({title: '触发价格不能为空', content: '触发价格不能为空', type: 'danger'})
        }

        
        

        let Sym = window.gMkt.CtxPlaying.Sym
        let AId = window.gTrd.RT["UserId"]+'01'
        let PId = window.gTrd.CtxPlaying.activePId

        let Orders = window.gTrd.Orders['01']
        if(PId){
            let planList = Orders.filter(function(item){
                return (item.OType == 3 || item.OType == 4) && item.PId == PId
            })
            console.log(planList)
            if(planList.length >= 5){
                return $message({title: '同一仓位ID计划单最多5条！', content: '同一仓位ID计划单最多5条！', type: 'danger'})
            }
        }else{
            let planList = Orders.filter(function(item){
                return (item.OType == 3 || item.OType == 4) && item.Sym == Sym
            })
            if(planList.length >= 10){
                return $message({title: '同一合约计划单最多10条！', content: '同一合约计划单最多10条！', type: 'danger'})
            }
        }

        let p = {
            Sym: Sym,
            PId: PId,
            AId: AId,
            COrdId: new Date().getTime() + '',
            Dir: dir,
            OType: 3,
            Prz: Number(this.form.Prz),
            Qty: Number(this.form.Num),
            QtyDsp: 0,
            Tif: 0,
            OrdFlag: 0,
            PrzChg: 0,
            StopPrz: Number(this.form.triggerPrz),
            StopBy: 1
        }

        if (p.StopPrz >= p.Prz) {
            p.OrdFlag = (p.OrdFlag | 8)
        } else {
            p.OrdFlag = (p.OrdFlag | 16)
        }

        // 根据配置判断处理
        let tradeType = window.$config.future.tradeType
        switch(tradeType){
            case 0:
            case 1:
            case 2:
                if(!PId){
                    return window.$message({title: '请先选择您要调整的仓位！', content: '请先选择您要调整的仓位！', type: 'danger'})
                }
                break;
            case 3:
                p.PId = 'new'
                // 只开仓标志
                p.OrdFlag = (p.OrdFlag | 4)

                p.lvr = this.form.Lever

                let stopP = Number(this.form.stopP), stopL = Number(this.form.stopL);
                stopP > 0 ? p.StopP = stopP : ''
                stopL > 0 ? p.StopL = stopL : ''
                if (stopP > 0 || stopL > 0) {
                    p.StopLPBy = 1
                }
                // 模式3判断仓位数量是否超限 start
                let Poss = window.gTrd.Poss
                let posArr = []
                for(let key in Poss){
                    let pos = Poss[key]
                    if(pos.Sym == Sym && pos.Sz != 0){
                        posArr.push(pos)
                    }
                }
                if(posArr.length >= window.$config.future.maxPosNum){
                    return window.$message({title: '提示', content: '同一合约最多同时存在'+window.$config.future.maxPosNum+'个仓位!', type: 'danger'})
                }
            // 判断仓位数量是否超限 end
                break;
            default:
                
        }

        // 判断是否开启了全仓杠杠调节 start
        if(window.$config.future.setMIRMy){
            p.MIRMy = this.form.MIRMy
        }
        // 判断是否开启了全仓杠杠调节 end


        let aWdrawable = Number(obj.wlt.aWdrawable || 0 )
        if(aWdrawable == 0){
            return window.$message({title: '可用资金不足！', content: '可用资金不足！', type: 'danger'})
        }else if(dir == 1 && aWdrawable < Number(this.MgnNeedForBuy)){
            return window.$message({title: '可用资金不足！', content: '可用资金不足！', type: 'danger'})
        }else if(dir == -1 && aWdrawable < Number(this.MgnNeedForSell)){
            return window.$message({title: '可用资金不足！', content: '可用资金不足！', type: 'danger'})
        }

        window.gTrd.ReqTrdOrderNew(p, function(aTrd, arg){
            if (arg.code != 0 || arg.data.ErrCode) {
                window.$message({title: utils.getTradeErrorCode(arg.code || arg.data.ErrCode), content: utils.getTradeErrorCode(arg.code || arg.data.ErrCode), type: 'danger'})
            }
        })
    },
    setLeverage: function(){
        let that = this

        if(!window.gWebAPI.isLogin()){
            return window.gWebAPI.needLogin()
        }
        let Sym = window.gMkt.CtxPlaying.Sym
        let PId = window.gTrd.CtxPlaying.activePId
        let ass = window.gMkt.AssetD[Sym]
        if(!ass) return 

        // 根据配置判断处理杠杠修改
        let tradeType = window.$config.future.tradeType
        switch(tradeType){
            case 0:
            case 1:
            case 2:
                if(!PId){
                    return window.$message({title: '请先选择您要调整的仓位！', content: '请先选择您要调整的仓位！', type: 'danger'})
                }
                window.$openLeverageMode({
                    Sym: Sym,
                    PId: PId, //仓位PId
                    Lever: this.form.Lever, //杠杆
                    MIRMy: this.form.MIRMy, //自定义委托保证金率
                    needReq: true, //是否需要向服务器发送修改杠杆请求
                    cb: function(arg){
                        console.log('change Lever callback', arg)
                        that.form.Lever = arg.Lever
                        that.form.MIRMy = arg.MIRMy
                        that.form.maxLever = 1/Math.max(arg.MIRMy || 0, ass.MIR)
                        that.setMgnNeed()
                        that.setLever()
                    }
                })
                break;
            case 3:
                window.$openLeverageMode({
                    Sym: Sym,
                    PId: PId, //仓位PId
                    Lever: this.form.Lever, //杠杆
                    MIRMy: this.form.MIRMy, //自定义委托保证金率
                    needReq: false, //是否需要向服务器发送修改杠杆请求
                    cb: function(arg){
                        console.log('change Lever callback', arg)
                        that.form.Lever = arg.Lever
                        that.form.MIRMy = arg.MIRMy
                        that.form.maxLever = 1/Math.max(arg.MIRMy || 0, ass.MIR)
                        that.setMgnNeed()
                        that.setLever()
                    }
                })
                break;
            default:
                
        }
        
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
        let minNum = Number(ass?ass.OrderMinQty:0)
        if(Number(e.target.value) > maxNum){
            this.form.Num = maxNum
        }else if(Number(e.target.value) < 0){
            this.form.Num = minNum
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
        let minPrz = Number(ass?ass.PrzMinInc:0)
        if(Number(e.target.value) > maxPrz){
            this.form.Prz = maxPrz
        }else if(Number(e.target.value) < 0){
            this.form.Prz = minPrz
        }else {
            this.form.Prz = e.target.value
        }
        this.setMgnNeed()
    },
    onStopPInput: function(e){
        let Sym = window.gMkt.CtxPlaying.Sym
        let ass = window.gMkt.AssetD[Sym]
        let maxPrz = Number(ass?ass.PrzMax:0)
        let minPrz = Number(ass?ass.PrzMinInc:0)
        if(Number(e.target.value) > maxPrz){
            this.form.stopP = maxPrz
        }else if(Number(e.target.value) < 0){
            this.form.stopP = minPrz
        }else {
            this.form.stopP = e.target.value
        }
    },
    onStopLInput: function(e){
        let Sym = window.gMkt.CtxPlaying.Sym
        let ass = window.gMkt.AssetD[Sym]
        let maxPrz = Number(ass?ass.PrzMax:0)
        let minPrz = Number(ass?ass.PrzMinInc:0)
        if(Number(e.target.value) > maxPrz){
            this.form.stopL = maxPrz
        }else if(Number(e.target.value) < 0){
            this.form.stopL = minPrz
        }else {
            this.form.stopL = e.target.value
        }
    },
    onInputFortriggerPrz: function(e){
        let Sym = window.gMkt.CtxPlaying.Sym
        let ass = window.gMkt.AssetD[Sym]
        let maxPrz = Number(ass?ass.PrzMax:0)
        let minPrz = Number(ass?ass.PrzMinInc:0)
        if(Number(e.target.value) > maxPrz){
            this.form.triggerPrz = maxPrz
        }else if(Number(e.target.value) < 0){
            this.form.triggerPrz = minPrz
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
    setMgnNeed() {
        let that = this;
        let Sym = window.gMkt.CtxPlaying.Sym
        let Prz = Number(this.form.Prz)
        let QtyLong = Number(this.form.Num)
        let QtyShort = Number(this.form.Num)
        let PId = window.gTrd.CtxPlaying.activePId
        let Lever = this.form.Lever
        let MIRMy = this.form.MIRMy
        
        let posObj = window.gTrd.Poss
        let pos = []
        for(let key in posObj){
            pos.push(posObj[key])
        }
        let order = window.gTrd.Orders['01']
        // 筛选出当前委托，不要计划委托
        let _order = order.filter(function(item){
            return item.OType == 1 || item.OType == 2
        })
        let wallet = window.gTrd.Wlts['01']
        let lastTick = window.gMkt.lastTick
        let assetD = window.gMkt.AssetD
        let RSdata = window.gTrd.RS

        let newOrderForBuy = {
            Sym: Sym,
            Prz: Prz,
            Qty: QtyLong,
            QtyF: 0,
            Dir: 1,
            PId: PId, 
            Lvr: Lever,
            MIRMy: MIRMy
        }
        clacMgnNeed.calcFutureWltAndPosAndMI(pos, wallet, _order, RSdata, assetD, lastTick, window.$config.future.UPNLPrzActive, newOrderForBuy, window.$config.future.MMType, res => {
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
            MIRMy: MIRMy
        }
        clacMgnNeed.calcFutureWltAndPosAndMI(pos, wallet, _order, RSdata, assetD, lastTick, window.$config.future.UPNLPrzActive, newOrderForSell, window.$config.future.MMType, res => {
            console.log('sell 成本计算结果： ', res)
            that.MgnNeedForSell = Number(res || 0)
        })
        
    },
    getStopPL: function(){
        // 根据配置判断下单止盈止损是否显示
        let tradeType = window.$config.future.tradeType
        let show = false
        switch(tradeType){
            case 0:
            case 1:
            case 2:
                show = false;
                break;
            case 3:
                show = true
                break;
            default:
                show = false
        }
        if(show){
            return m('div', { class: 'pub-place-order-form-stop-pl field' }, [
                m("label", { class: "pub-place-order-form-stop-pl-label label" }, [
                    '止盈止损设置（选填）'
                ]),
                m("div", { class: "pub-place-order-form-stop-pl-input field has-addons" }, [
                    
                    m("div", { class: "pub-place-order-form-stop-pl-input-p control is-expanded" }, [
                        m("input", { class: "input", type: 'number', placeholder: "止盈价", step: obj.PrzStep, value: obj.form.stopP, oninput: function(e){
                            obj.onStopPInput(e)
                        }})
                    ]),
                    m("div", { class: "pub-place-order-form-stop-pl-input-center control" }, [
                        '&'
                    ]),
                    m("div", { class: "pub-place-order-form-stop-pl-input-l control is-expanded" }, [
                        m("input", { class: "input", type: 'number', placeholder: "止损价", step: obj.PrzStep, value: obj.form.stopL, oninput: function(e){
                            obj.onStopLInput(e)
                        }})
                    ])
                ])
            ])
        }
    }
}
export default {
    oninit: function (vnode) {

    },
    oncreate: function (vnode) {
        obj.initEVBUS()
        obj.updateSpotInfo()
        obj.initPos()
        obj.setFaceV()
        obj.initWlt()
    },
    view: function (vnode) {

        return m("div", { class: "pub-place-order-form" }, [
            m("div", { class: "pub-place-order-form-lever-input field" }, [
                m("div", { class: "control" }, [
                    m("input", {
                        class: " input", type: 'text', placeholder: obj.LeverInputValue, readonly: true, onclick: function () {
                            obj.setLeverage()
                        }
                    })
                ])
            ]),
            m("div", { class: "pub-place-order-form-prz-input field" }, [
                m("div", { class: "control" }, [
                    m("input", { class: "input", type: 'number', placeholder: "请输入价格", step: obj.PrzStep, value: obj.form.Prz,oninput: function(e) {
                        obj.onInputForPrz(e)
                    } })
                ])
            ]),
            m("div", { class: "pub-place-order-form-num-input field" }, [
                m("div", { class: "control" }, [
                    m("input", { class: "input", type: 'number', placeholder: "请输入数量", step: obj.NumStep, value: obj.form.Num,oninput: function(e) {
                        obj.onInputForNum(e)
                    } }),
                    m('span', {class: 'pub-place-order-form-num-input-face-value'}, [
                        obj.faceValue
                    ])
                ])
            ]),
            obj.getStopPL(),
            m("div", { class: "pub-place-order-form-trigger-prz-input field" }, [
                m("div", { class: "control" }, [
                    m("input", { class: "input", type: 'number', placeholder: "请输入触发价格", step: obj.PrzStep, value: obj.form.triggerPrz,oninput: function(e) {
                        obj.onInputFortriggerPrz(e)
                    }})
                ])
            ]),
            m('.spacer'),
            m("div", { class: "pub-place-order-form-buttons field" }, [
                m("div", { class: "level" }, [
                    m("div", { class: "level-left" }, [
                        m('div', {}, [
                            m("button", { class: "button is-success is-fullwidth", onclick: function(){
                                obj.submit(1)
                            }}, [
                                "买入/做多(看涨)"
                            ]),
                            m('div', {class: "pub-place-order-form-need-mgn is-flex"}, [
                                m('div', {class: ""}, [
                                    '所需保证金'
                                ]),
                                m('.spacer'),
                                m('div', {class: ""}, [
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
                            m('div', {class: "pub-place-order-form-need-mgn is-flex"}, [
                                m('div', {class: ""}, [
                                    '所需保证金'
                                ]),
                                m('.spacer'),
                                m('div', {class: ""}, [
                                    Number(obj.MgnNeedForSell).toPrecision2(6,8)
                                ])
                            ])
                        ]),
                    ])
                ]),
            ]),
            
            m('div', {class: "pub-place-order-form-wallet is-flex field"}, [
                m('div', {class: ""}, [
                    '可用保证金'
                ]),
                m('.spacer'),
                m('div', {class: ""}, [
                    obj.wlt.aWdrawable?Number(obj.wlt.aWdrawable).toFixed2(8): (0).toFixed2(8)
                ])
            ])
        ])
    },
    onbeforeremove: function () {
        obj.rmEVBUS()
    }
}