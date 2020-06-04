var m = require("mithril")

import * as clacMgnNeed from '../../../futureCalc/calcMgnNeed.js'

let obj = {
    form: {
        Prz: '',        // 委托价格
        Num: '',        // 委托数量
        triggerPrz: '', // 触发价格
        Lever: 0,       // 杠杆
        maxLever: 0,    // 最大杠杆
        stopP: '',      // 止盈价
        stopL: '',       // 止损价
        MIRMy: 0,     // 自定义委托保证金率
        // 交易模式2相关内容 start
        PIdForBuy: '',
        PIdForSell: '',
        LeverForBuy: 0,
        LeverForSell: 0,
        LeverForBuyInputValue: gDI18n.$t('10133'),//'买 杠杆',
        LeverForSellInputValue: gDI18n.$t('10134'),//'卖 杠杆',
        MIRMyForBuy: 0,
        MIRMyForSell: 0,
        maxLeverForBuy: 0,
        maxLeverForSell: 0,
        // 交易模式2相关内容 end
    },
    faceValue: '= 0.0000 USDT',
    LeverInputValue: gDI18n.$t('10135'),//'杠杆',
    wlt: {},
    MgnNeedForBuy: 0,
    MgnNeedForSell: 0,
    // tick行情最后刷新时间
    lastTmForTick: 0,
    // tick行情刷新时间间隔
    TICKCLACTNTERVAL: 1*1000,
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

        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        } 
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD, arg => {
            that.initLanguage()
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
        if(this.EV_GET_POS_READY_unbinder){
            this.EV_GET_POS_READY_unbinder()
        }
        this.EV_GET_POS_READY_unbinder = window.gEVBUS.on(gTrd.EV_GET_POS_READY,arg=> {
            that.setPId()
        })
    
        if(this.EV_POS_UPD_unbinder){
          this.EV_POS_UPD_unbinder()
        }
        this.EV_POS_UPD_unbinder = window.gEVBUS.on(gTrd.EV_POS_UPD,arg=> {
            that.onPosUpd(arg)
        })

    },
    initLanguage : function (){
        obj.updateSpotInfo()
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
        if(this.EV_GET_POS_READY_unbinder){
            this.EV_GET_POS_READY_unbinder()
        }
    
        if(this.EV_POS_UPD_unbinder){
          this.EV_POS_UPD_unbinder()
        }
    },
    initPos: function (param) {
        
        let tradeType = window.$config.future.tradeType
        switch(tradeType){
            case 2:
                this.setPId()
                break;
            default:
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
        }
        
    },
    setLever: function (type) {
        let tradeType = window.$config.future.tradeType
        switch(tradeType){
            case 2:
                if(!type || type == 'buy'){
                    if (this.form.LeverForBuy == 0) {
                        this.form.LeverForBuyInputValue = (this.form.maxLeverForBuy ? gDI18n.$t('10137'/*'买 全仓*/) + this.form.maxLeverForBuy + 'X' : gDI18n.$t('10133'/*'买 杠杆'*/))
                    } else {
                        this.form.LeverForBuyInputValue = gDI18n.$t('10138'/*'买 逐仓'*/) + Number(this.form.LeverForBuy).toFixed2(2) + 'X'
                    }
                }
                if(!type || type == 'sell'){
                    if (this.form.LeverForSell == 0) {
                        this.form.LeverForSellInputValue = (this.form.maxLeverForSell ? gDI18n.$t('10139'/*'卖 全仓'*/) + this.form.maxLeverForSell + 'X' : gDI18n.$t('10134'/*'卖 杠杆'*/))
                    } else {
                        this.form.LeverForSellInputValue = gDI18n.$t('10140'/*'卖 逐仓'*/) + Number(this.form.LeverForSell).toFixed2(2) + 'X'
                    }
                }
                break;
            default:
                if (this.form.Lever == 0) {
                    this.LeverInputValue = (this.form.maxLever ? gDI18n.$t('10068',{value : this.form.maxLever}): gDI18n.$t('10054'))
                    // this.LeverInputValue = (this.form.maxLever ? '全仓' + this.form.maxLever + 'X' : '杠杆')
                } else {
                    this.LeverInputValue = gDI18n.$t('10069',{value : Number(this.form.Lever).toFixed2(2)})
                    // this.LeverInputValue = '逐仓' + Number(this.form.Lever).toFixed2(2) + 'X'
                } 
        }
    },
    onTick: function (arg) {
        if (arg.Sym == window.gMkt.CtxPlaying.Sym ) {
            if(!this.form.Prz){
                let lastTick = window.gMkt.lastTick[arg.Sym]
                this.form.Prz = Number(lastTick && lastTick.LastPrz || 0)
            }
        }
        let tm = Date.now()
        if(tm - this.lastTmForTick > this.TICKCLACTNTERVAL){
            this.setMgnNeed()
            this.lastTmForTick = tm
        }
    },
    updateSpotInfo: function(){
        this.form = {
            Prz: '',        // 委托价格
            Num: '',        // 委托数量
            triggerPrz: '', // 触发价格
            Lever: 0,       // 杠杆
            maxLever: 0,    // 最大杠杆
            stopP: '',      // 止盈价
            stopL: '',       // 止损价
            // 交易模式2相关内容 start
            LeverForBuy: 0, 
            LeverForSell: 0,
            LeverForBuyInputValue: gDI18n.$t('10133'),//'买 杠杆',
            LeverForSellInputValue: gDI18n.$t('10134'),//'卖 杠杆',
            MIRMyForBuy: 0,
            MIRMyForSell: 0,
            // 交易模式2相关内容 end
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
            return $message({title: gDI18n.$t('10141'/*'下单价格不能为0'*/), content: gDI18n.$t('10141'/*'下单价格不能为0'*/), type: 'danger'})
        }else if(!this.form.Prz){
            return $message({title: gDI18n.$t('10142'/*'下单价格不能为空'*/), content: gDI18n.$t('10142'/*'下单价格不能为空'*/), type: 'danger'})
        }else if(Number(this.form.Prz) == 0){
            return $message({title: gDI18n.$t('10141'/*'下单价格不能为0'*/), content: gDI18n.$t('10141'/*'下单价格不能为0'*/), type: 'danger'})
        }else if(isNaN(Number(this.form.Prz))){
            return $message({title: gDI18n.$t('10143'/*'请输入正确的价格'*/), content: gDI18n.$t('10143'/*'请输入正确的价格'*/), type: 'danger'})
        }

        if(this.form.Num === '0'){
            return $message({title: gDI18n.$t('10144'/*'下单数量不能为0'*/), content: gDI18n.$t('10144'/*'下单数量不能为0'*/), type: 'danger'})
        }else if(!this.form.Num){
            return $message({title: gDI18n.$t('10145'/*'下单数量不能为空'*/), content: gDI18n.$t('10145'/*'下单数量不能为空'*/), type: 'danger'})
        }else if(Number(this.form.Num) == 0){
            return $message({title: gDI18n.$t('10144'/*'下单数量不能为0'*/), content: gDI18n.$t('10144'/*'下单数量不能为0'*/), type: 'danger'})
        }else if(isNaN(Number(this.form.Num))){
            return $message({title: gDI18n.$t('10146'/*'请输入正确的数量'*/), content: gDI18n.$t('10146'/*'请输入正确的数量'*/), type: 'danger'})
        }

        if(this.form.triggerPrz === '0'){
            return $message({title: gDI18n.$t('10158'/*'触发价格不能为0'*/), content: gDI18n.$t('10158'/*'触发价格不能为0'*/), type: 'danger'})
        }else if(!this.form.triggerPrz){
            return $message({title: gDI18n.$t('10159'/*'触发价格不能为空'*/), content: gDI18n.$t('10159'/*'触发价格不能为空'*/), type: 'danger'})
        }else if(Number(this.form.triggerPrz) == 0){
            return $message({title: gDI18n.$t('10158'/*'触发价格不能为0'*/), content: gDI18n.$t('10158'/*'触发价格不能为0'*/), type: 'danger'})
        }else if(isNaN(Number(this.form.triggerPrz))){
            return $message({title: gDI18n.$t('10160'/*'请输入正确的触发价格'*/), content: gDI18n.$t('10160'/*'请输入正确的触发价格'*/), type: 'danger'})
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
                return $message({title: gDI18n.$t('10161'/*'同一仓位ID计划单最多5条！'*/), content: gDI18n.$t('10161'/*'同一仓位ID计划单最多5条！'*/), type: 'danger'})
            }
        }else{
            let planList = Orders.filter(function(item){
                return (item.OType == 3 || item.OType == 4) && item.Sym == Sym
            })
            if(planList.length >= 10){
                return $message({title: gDI18n.$t('10162'/*'同一合约计划单最多10条！'*/), content: gDI18n.$t('10162'/*'同一合约计划单最多10条！'*/), type: 'danger'})
            }
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

        let lastTick = window.gMkt.lastTick
        let assetD = window.gMkt.AssetD

        let prz = (lastTick[Sym] && lastTick[Sym].LastPrz) || (assetD[Sym] && assetD[Sym].PrzLatest) || 0
        if (prz) {
            if (p.StopPrz >= prz) {
                p.OrdFlag = (p.OrdFlag | 8)
            } else {
                p.OrdFlag = (p.OrdFlag | 16)
            }
        } else {
            if (dir == 1) {
                p.OrdFlag = (p.OrdFlag | 8)
            } else {
                p.OrdFlag = (p.OrdFlag | 16)
            }
        }

        // 根据配置判断处理
        let tradeType = window.$config.future.tradeType
        switch(tradeType){
            case 2:
                // 只开仓标志
                p.OrdFlag = (p.OrdFlag | 4)
                // 仓位合并标志
                p.OrdFlag = (p.OrdFlag | 1024)
                if(dir == 1){
                    p.PId = this.form.PIdForBuy || ''
                    p.lvr = this.form.LeverForBuy
                    // 判断是否开启了全仓杠杠调节 start
                    if(window.$config.future.setMIRMy && p.lvr == 0){
                        p.MIRMy = this.form.MIRMyForBuy
                    }
                    // 判断是否开启了全仓杠杠调节 end
                }else{
                    p.PId = this.form.PIdForSell || ''
                    p.lvr = this.form.LeverForSell
                    // 判断是否开启了全仓杠杠调节 start
                    if(window.$config.future.setMIRMy && p.lvr == 0){
                        p.MIRMy = this.form.MIRMyForSell
                    }
                    // 判断是否开启了全仓杠杠调节 end
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
                        return window.$message({title: gDI18n.$t('10037'), content: gDI18n.$t('10147',{value : window.$config.future.maxPosNum}), type: 'danger'})
                        // return window.$message({title: '提示', content: '同一合约最多同时存在'+window.$config.future.maxPosNum+'个仓位!', type: 'danger'})
                    }
                // 判断仓位数量是否超限 end
                // 判断是否开启了全仓杠杠调节 start
                if(window.$config.future.setMIRMy && p.lvr == 0){
                    p.MIRMy = this.form.MIRMy
                }
                // 判断是否开启了全仓杠杠调节 end
                break;
            default:
                if(!PId){
                    return window.$message({title: gDI18n.$t('10148'), content: gDI18n.$t('10148'), type: 'danger'})
                    // return window.$message({title: '请先选择您要调整的仓位！', content: '请先选择您要调整的仓位！', type: 'danger'})
                }
                // 判断是否开启了全仓杠杠调节 start
                if(window.$config.future.setMIRMy && p.lvr == 0){
                    p.MIRMy = this.form.MIRMy
                }
                // 判断是否开启了全仓杠杠调节 end
        }


        let aWdrawable = Number(obj.wlt.aWdrawable || 0 )
        if(aWdrawable == 0){
            return window.$message({title: gDI18n.$t('10038'/*'可用资金不足！'*/), content: gDI18n.$t('10038'/*'可用资金不足！'*/), type: 'danger'})
        }else if(dir == 1 && aWdrawable < Number(this.MgnNeedForBuy)){
            return window.$message({title: gDI18n.$t('10038'/*'可用资金不足！'*/), content: gDI18n.$t('10038'/*'可用资金不足！'*/), type: 'danger'})
        }else if(dir == -1 && aWdrawable < Number(this.MgnNeedForSell)){
            return window.$message({title: gDI18n.$t('10038'/*'可用资金不足！'*/), content: gDI18n.$t('10038'/*'可用资金不足！'*/), type: 'danger'})
        }

        window.gTrd.ReqTrdOrderNew(p, function(aTrd, arg){
            if (arg.code != 0 || arg.data.ErrCode) {
                window.$message({title: utils.getTradeErrorCode(arg.code || arg.data.ErrCode), content: utils.getTradeErrorCode(arg.code || arg.data.ErrCode), type: 'danger'})
            }
        })
    },
    setLeverage: function(dir){
        let that = this

        if(!window.gWebAPI.isLogin()){
            return window.gWebAPI.needLogin()
        }
        let Sym = window.gMkt.CtxPlaying.Sym
        let PId = window.gTrd.CtxPlaying.activePId
        let Lever = this.form.Lever
        let MIRMy = this.form.MIRMy
        let ass = window.gMkt.AssetD[Sym]
        if(!ass) return 

        // 根据配置判断处理杠杠修改
        let tradeType = window.$config.future.tradeType
        switch(tradeType){
            case 2:
                PId = dir == 1?this.form.PIdForBuy:this.form.PIdForSell
                Lever = dir == 1?this.form.LeverForBuy:this.form.LeverForSell
                MIRMy = dir == 1?this.form.MIRMyForBuy:this.form.MIRMyForSell
                window.$openLeverageMode({
                    Sym: Sym,
                    PId: PId, //仓位PId
                    Lever: Lever, //杠杆
                    MIRMy: MIRMy, //自定义委托保证金率
                    needReq: !!PId, //是否需要向服务器发送修改杠杆请求
                    cb: function(arg){
                        console.log('change Lever callback', arg, typeof dir, dir == 1, dir)
                        if(dir == 1){
                            that.form.LeverForBuy = arg.Lever
                            that.form.MIRMyForBuy = arg.MIRMy
                            that.form.maxLeverForBuy = 1/Math.max(arg.MIRMy || 0, ass.MIR)
                        }else{
                            that.form.LeverForSell = arg.Lever
                            that.form.MIRMyForSell = arg.MIRMy
                            that.form.maxLeverForSell = 1/Math.max(arg.MIRMy || 0, ass.MIR)
                        }
                        
                        that.setMgnNeed()
                        that.setLever()
                    }
                })
                break;
            case 3:
                window.$openLeverageMode({
                    Sym: Sym,
                    PId: PId, //仓位PId
                    Lever: Lever, //杠杆
                    MIRMy: MIRMy, //自定义委托保证金率
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
                if(!PId){
                    return window.$message({title: gDI18n.$t('10148'/*'请先选择您要调整的仓位！'*/), content: gDI18n.$t('10148'/*'请先选择您要调整的仓位！'*/), type: 'danger'})
                }
                window.$openLeverageMode({
                    Sym: Sym,
                    PId: PId, //仓位PId
                    Lever: Lever, //杠杆
                    MIRMy: MIRMy, //自定义委托保证金率
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
        let val = e.target.value
        let value = val.split(".")[0]
        let Sym = window.gMkt.CtxPlaying.Sym
        let ass = window.gMkt.AssetD[Sym]
        let maxNum = Number(ass?ass.OrderMaxQty:0)
        let minNum = Number(ass?ass.OrderMinQty:0)
        if(Number(value) > maxNum){
            this.form.Num = maxNum
        }else if(Number(value) < 0){
            this.form.Num = minNum
        }else {
            this.form.Num = value
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
        //获取合约允许变动的最小区间
        let numb = ass.PrzMinInc.toString()
        //获取合约允许的小数点长度
        let numb2 = numb.split(".")[1]
        let numb2Length = numb2.length
        //获取合约允许的小数最后一位数字
        let lastNumbMin =  numb2.substr(numb2.length-1,1)
        //根据输入的是否含有“.”判断是否为小数
        if(e.target.value.includes(".")){
            let beforValue = e.target.value.split(".")[0]? e.target.value.split(".")[0] : "0"
            let eValue = e.target.value.split(".")[1] ? e.target.value.split(".")[1] : ""
            //获取输入数字小数点后长度
            let eValueLength = eValue.length
            let lastValue = eValue.substr(eValue.length-1,1)
            //判断小数长度是否与合约要求长度相等
            if(numb2Length == eValueLength){
                //判断输入小数最后一位是否与合约要求的最后一位相等
                if(lastValue == "0" || lastValue == lastNumbMin){
                    if(Number(e.target.value) > maxPrz){
                        this.form.stopP = maxPrz
                    }else if(Number(e.target.value) < 0){
                        this.form.stopP = minPrz
                    }else {
                        this.form.stopP = beforValue + "." + eValue
                    }
                }else if(Number(lastValue) % Number(lastNumbMin) == 0){
                    //不相等的情况下判断输入的最后一位能否将合约要求的最后一位数字取余为0
                    if(Number(e.target.value) > maxPrz){
                        this.form.stopP = maxPrz
                    }else if(Number(e.target.value) < 0){
                        this.form.stopP = minPrz
                    }else {
                        this.form.stopP = beforValue + "." + eValue
                    } 
                }  
            }else{
                this.form.stopP = beforValue + "." + eValue.substring(0,numb2Length)
            }
        }else{
            if(Number(e.target.value) > maxPrz){
                this.form.stopP = maxPrz
            }else if(Number(e.target.value) < 0){
                this.form.stopP = minPrz
            }else {
                this.form.stopP = e.target.value
            }
        }
        //
        
    },
    onStopLInput: function(e){
        let Sym = window.gMkt.CtxPlaying.Sym
        let ass = window.gMkt.AssetD[Sym]
        let maxPrz = Number(ass?ass.PrzMax:0)
        let minPrz = Number(ass?ass.PrzMinInc:0)
        //获取合约允许变动的最小区间
        let numb = ass.PrzMinInc.toString()
        //获取合约允许的小数点长度
        let numb2 = numb.split(".")[1]
        let numb2Length = numb2.length
        //获取合约允许的小数最后一位数字
        let lastNumbMin =  numb2.substr(numb2.length-1,1)
        //根据输入的是否含有“.”判断是否为小数
        if(e.target.value.includes(".")){
            let beforValue = e.target.value.split(".")[0]? e.target.value.split(".")[0] : "0"
            let eValue = e.target.value.split(".")[1] ? e.target.value.split(".")[1] : ""
            //获取输入数字小数点后长度
            let eValueLength = eValue.length
            let lastValue = eValue.substr(eValue.length-1,1)
            //判断小数长度是否与合约要求长度相等
            if(numb2Length == eValueLength){
                //判断输入小数最后一位是否与合约要求的最后一位相等
                if(lastValue == "0" || lastValue == lastNumbMin){
                    if(Number(e.target.value) > maxPrz){
                        this.form.stopL = maxPrz
                    }else if(Number(e.target.value) < 0){
                        this.form.stopL = minPrz
                    }else {
                        this.form.stopL = beforValue + "." + eValue
                    }
                }else if(Number(lastValue) % Number(lastNumbMin) == 0){
                    //不相等的情况下判断输入的最后一位能否将合约要求的最后一位数字取余为0
                    if(Number(e.target.value) > maxPrz){
                        this.form.stopL = maxPrz
                    }else if(Number(e.target.value) < 0){
                        this.form.stopL = minPrz
                    }else {
                        this.form.stopL = beforValue + "." + eValue
                    }
                }  
            }else{
                this.form.stopL = beforValue + "." + eValue.substring(0,numb2Length)
            }
        }else{
            if(Number(e.target.value) > maxPrz){
                this.form.stopL = maxPrz
            }else if(Number(e.target.value) < 0){
                this.form.stopL = minPrz
            }else {
                this.form.stopL = e.target.value
            }
        }
        //
        
    },
    onInputFortriggerPrz: function(e){
        let Sym = window.gMkt.CtxPlaying.Sym
        let ass = window.gMkt.AssetD[Sym]
        let maxPrz = Number(ass?ass.PrzMax:0)
        let minPrz = Number(ass?ass.PrzMinInc:0)
        //获取合约允许变动的最小区间
        let numb = ass.PrzMinInc.toString()
        //获取合约允许的小数点长度
        let numb2 = numb.split(".")[1]
        let numb2Length = numb2.length
        //获取合约允许的小数最后一位数字
        let lastNumbMin =  numb2.substr(numb2.length-1,1)
        //根据输入的是否含有“.”判断是否为小数
        if(e.target.value.includes(".")){
            let beforValue = e.target.value.split(".")[0]? e.target.value.split(".")[0] : "0"
            let eValue = e.target.value.split(".")[1] ? e.target.value.split(".")[1] : ""
            //获取输入数字小数点后长度
            let eValueLength = eValue.length
            let lastValue = eValue.substr(eValue.length-1,1)
            //判断小数长度是否与合约要求长度相等
            if(numb2Length == eValueLength){
                //判断输入小数最后一位是否与合约要求的最后一位相等
                if(lastValue == "0" || lastValue == lastNumbMin){
                    if(Number(e.target.value) > maxPrz){
                        this.form.triggerPrz = maxPrz
                    }else if(Number(e.target.value) < 0){
                        this.form.triggerPrz = minPrz
                    }else {
                        this.form.triggerPrz = beforValue + "." + eValue
                    }
                }else if(Number(lastValue) % Number(lastNumbMin) == 0){
                    //不相等的情况下判断输入的最后一位能否将合约要求的最后一位数字取余为0
                    if(Number(e.target.value) > maxPrz){
                        this.form.triggerPrz = maxPrz
                    }else if(Number(e.target.value) < 0){
                        this.form.triggerPrz = minPrz
                    }else {
                        this.form.triggerPrz = beforValue + "." + eValue
                    } 
                }  
            }else{
                this.form.triggerPrz = beforValue + "." + eValue.substring(0,numb2Length)
            }
        }else{
            if(Number(e.target.value) > maxPrz){
                this.form.triggerPrz = maxPrz
            }else if(Number(e.target.value) < 0){
                this.form.triggerPrz = minPrz
            }else {
                this.form.triggerPrz = e.target.value
            }
        }
        //  
        
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
        let Prz = 0
        let QtyLong = Number(this.form.Num)
        let QtyShort = Number(this.form.Num)
        let PId = window.gTrd.CtxPlaying.activePId
        let Lever = this.form.Lever
        let MIRMy = this.form.MIRMy

        let PIdForBuy = this.form.PIdForBuy
        let LeverForBuy = this.form.LeverForBuy
        let MIRMyForBuy = this.form.MIRMyForBuy

        let PIdForSell = this.form.PIdForSell
        let LeverForSell = this.form.LeverForSell
        let MIRMyForSell = this.form.MIRMyForSell

        
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

        Prz = (lastTick[Sym] && lastTick[Sym].LastPrz) || (assetD[Sym] && assetD[Sym].PrzLatest) || 0

        let newOrderForBuy = {}

        let tradeType = window.$config.future.tradeType
        switch(tradeType){
            case 2:
                newOrderForBuy = {
                    Sym: Sym,
                    Prz: Prz,
                    Qty: QtyLong,
                    QtyF: 0,
                    Dir: 1,
                    PId: PIdForBuy, 
                    Lvr: LeverForBuy,
                    MIRMy: MIRMyForBuy
                }
                break;
            default:
                newOrderForBuy = {
                    Sym: Sym,
                    Prz: Prz,
                    Qty: QtyLong,
                    QtyF: 0,
                    Dir: 1,
                    PId: PId, 
                    Lvr: Lever,
                    MIRMy: MIRMy
                }
        }
        clacMgnNeed.calcFutureWltAndPosAndMI(pos, wallet, _order, RSdata, assetD, lastTick, window.$config.future.UPNLPrzActive, newOrderForBuy, window.$config.future.MMType, res => {
            // console.log('bug 成本计算结果： ', res)
            that.MgnNeedForBuy = Number(res || 0)
        })

        let newOrderForSell = {}
        switch(tradeType){
            case 2:
                newOrderForSell = {
                    Sym: Sym,
                    Prz: Prz,
                    Qty: QtyShort,
                    QtyF: 0,
                    Dir: -1,
                    PId: PIdForSell, 
                    Lvr: LeverForSell,
                    MIRMy: MIRMyForSell
                }
                break;
            default:
                newOrderForSell = {
                    Sym: Sym,
                    Prz: Prz,
                    Qty: QtyShort,
                    QtyF: 0,
                    Dir: -1,
                    PId: PId, 
                    Lvr: Lever,
                    MIRMy: MIRMy
                }
        }
        clacMgnNeed.calcFutureWltAndPosAndMI(pos, wallet, _order, RSdata, assetD, lastTick, window.$config.future.UPNLPrzActive, newOrderForSell, window.$config.future.MMType, res => {
            // console.log('sell 成本计算结果： ', res)
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
                    gDI18n.$t('10149')//'止盈止损设置（选填）'
                ]),
                m("div", { class: "pub-place-order-form-stop-pl-input field has-addons" }, [
                    
                    m("div", { class: "pub-place-order-form-stop-pl-input-p control is-expanded" }, [
                        m("input", { class: "input", type: 'number', placeholder: gDI18n.$t('10150'/*"止盈价"*/), step: obj.PrzStep, value: obj.form.stopP, pattern:"\d*", oninput: function(e){
                            obj.onStopPInput(e)
                        }})
                    ]),
                    m("div", { class: "pub-place-order-form-stop-pl-input-center control" }, [
                        '&'
                    ]),
                    m("div", { class: "pub-place-order-form-stop-pl-input-l control is-expanded" }, [
                        m("input", { class: "input", type: 'number', placeholder: gDI18n.$t('10151'/*"止损价"*/), step: obj.PrzStep, value: obj.form.stopL, pattern:"\d*", oninput: function(e){
                            obj.onStopLInput(e)
                        }})
                    ])
                ])
            ])
        }
    },
    getLeverChange: function(){
        // 根据配置判断杠杠调整显示内容
        let tradeType = window.$config.future.tradeType
        switch(tradeType){
            case 2:
                return m("div", { class: "pub-place-order-form-lever-input field" +(!window.isMobile?" has-addons":"")}, [
                    m("div", { class: "control is-expanded" }, [
                        m("button", { class: "button is-outline is-fullwidth is-background-3 has-text-success", onclick: function () {
                            obj.setLeverage(1)
                        }}, [
                            obj.form.LeverForBuyInputValue
                        ])
                    ]),
                    m("div", { class: "control" }, [
                        m("div", { class: "" }, [
                            ' '
                        ]),
                    ]),
                    m("div", { class: "control is-expanded" }, [
                        m("button", { class: "button is-outline is-fullwidth is-background-3 has-text-danger", onclick: function () {
                            obj.setLeverage(-1)
                        }}, [
                            obj.form.LeverForSellInputValue
                        ])
                    ])
                ])
            default:
                return m("div", { class: "pub-place-order-form-lever-input field" }, [
                    m("div", { class: "control" }, [
                        m("input", {
                            class: " input", type: 'text', placeholder: obj.LeverInputValue, readonly: true, onclick: function () {
                                obj.setLeverage()
                            }
                        })
                    ])
                ])
        }
    },
    setPId(){
        let Sym = window.gMkt.CtxPlaying.Sym
        let Poss = window.gTrd.Poss
        let ass = window.gMkt.AssetD[Sym]
        if(!ass) return

        let PIdForBuy = [], PIdForSell = [], PIdForSz0 = [];
        // 筛选买卖仓位
        for(let key in Poss){
            let item = Poss[key]
            if(item.Sym == Sym){
                if(item.hasOwnProperty('Flg') && (item.Flg&8) != 0){ //禁止做空标志
                    if(item.Sz > 0 || item.aQtyBuy > 0){
                        PIdForBuy.push(item.PId)
                    }else{
                        PIdForBuy.push(item.PId)
                    }
                }else if(item.hasOwnProperty('Flg') && (item.Flg&16) != 0){//禁止做多标志
                    if(item.Sz < 0 || item.aQtySell > 0){
                        PIdForSell.push(item.PId)
                    }else{
                        PIdForSell.push(item.PId)
                    }
                }else{
                    if(item.Sz > 0 || item.aQtyBuy > 0){
                        PIdForBuy.push(item.PId)
                    }else if(item.Sz < 0 || item.aQtySell > 0){
                        PIdForSell.push(item.PId)
                    }else {
                        PIdForSz0.push(item.PId)
                    }
                }
            }
        }
        
        // 选取买卖仓位PId
        if(PIdForBuy.length > 0){
            this.form.PIdForBuy = PIdForBuy[0]
        }else{
            this.form.PIdForBuy = PIdForSz0[0] || ''
        }
        PIdForSz0 = PIdForSz0.filter(item => {
            return item != this.form.PIdForBuy
        })
        if(PIdForSell.length > 0){
            this.form.PIdForSell = PIdForSell[0]
        }else{
            this.form.PIdForSell = PIdForSz0[0] || ''
        }
        
        
        // 获取买卖仓位对应杠杠以及
        let posForBuy = Poss[this.form.PIdForBuy] || {}
        this.form.LeverForBuy = posForBuy.Lever || 0
        this.form.MIRMyForBuy = posForBuy.MIRMy || 0
        this.form.maxLeverForBuy = 1 / Math.max(ass.MIR, posForBuy.MIRMy || 0)

        let posForSell = Poss[this.form.PIdForSell] || {}
        this.form.LeverForSell = posForSell.Lever || 0
        this.form.MIRMyForSell = posForSell.MIRMy || 0
        this.form.maxLeverForSell = 1 / Math.max(ass.MIR, posForSell.MIRMy || 0)

        this.setLever()
    },
    onPosUpd(param){
        let Sym = window.gMkt.CtxPlaying.Sym
        let Poss = window.gTrd.Poss
        let ass = window.gMkt.AssetD[Sym]
        if(!ass) return
        
        if(this.form.PIdForBuy && this.form.PIdForSell){
            this.setPId()
        }else if(this.form.PIdForBuy){
            let posForBuy = Poss[this.form.PIdForBuy] || {}
            this.form.LeverForBuy = posForBuy.Lever || 0
            this.form.MIRMyForBuy = posForBuy.MIRMy || 0
            this.form.maxLeverForBuy = 1 / Math.max(ass.MIR, posForBuy.MIRMy || 0)
            this.setLever('buy')
        }else if(this.form.PIdForSell){
            let posForSell = Poss[this.form.PIdForSell] || {}
            this.form.LeverForSell = posForSell.Lever || 0
            this.form.MIRMyForSell = posForSell.MIRMy || 0
            this.form.maxLeverForSell = 1 / Math.max(ass.MIR, posForSell.MIRMy || 0)
            this.setLever('sell')
        }else{
            this.setPId()
        }
        this.setMgnNeed()
    }
}
export default {
    oninit: function (vnode) {
        obj.initLanguage()
    },
    oncreate: function (vnode) {
        obj.initEVBUS()
        obj.updateSpotInfo()
        obj.initPos()
        obj.setFaceV()
        obj.initWlt()
    },
    view: function (vnode) {

        return m("div", { class: "pub-place-order-form has-text-2" }, [
            obj.getLeverChange(),
            m("div", { class: "pub-place-order-form-prz-input field" }, [
                m("div", { class: "control" }, [
                    m("input", { class: "input", type: 'number', placeholder: gDI18n.$t('10081'/*"市价"*/), readonly: true})
                ])
            ]),
            m("div", { class: "pub-place-order-form-num-input field" }, [
                m("div", { class: "control" }, [
                    m("input", { class: "input", type: 'number', placeholder: gDI18n.$t('10153'/*"请输入数量"*/), step: obj.NumStep, value: obj.form.Num, pattern:"\d*",oninput: function(e) {
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
                    m("input", { class: "input", type: 'number', placeholder: gDI18n.$t('10164'/*"请输入触发价格"*/), step: obj.PrzStep, value: obj.form.triggerPrz, pattern:"\d*",oninput: function(e) {
                        obj.onInputFortriggerPrz(e)
                    }})
                ])
            ]),
            m('.spacer'),
            m("div", { class: "pub-place-order-form-buttons field" }, [
                m("div", { class: "level" }, [
                    m("div", { class: "level-left button-width" }, [
                        m('div', {class:"button-default-width"}, [
                            m("button", { class: "button is-success is-fullwidth", onclick: function(){
                                obj.submit(1)
                            }}, [
                                gDI18n.$t('10154')//"买入/做多(看涨)"
                            ]),
                            m('div', {class: "pub-place-order-form-need-mgn is-flex"}, [
                                m('div', {class: ""}, [
                                    gDI18n.$t('10155')//'所需保证金'
                                ]),
                                m('.spacer'),
                                m('div', {class: ""}, [
                                    Number(obj.MgnNeedForBuy).toPrecision2(6,8)
                                ])
                            ])
                        ])
                    ]),
                    m("div", { class: "level-right button-width" }, [
                        m('div', {class:"button-default-width"}, [
                            m("button", { class: "button is-danger is-fullwidth", onclick: function(){
                                obj.submit(-1)
                            }}, [
                                gDI18n.$t('10156')//"卖出/做空(看跌)"
                            ]),
                            m('div', {class: "pub-place-order-form-need-mgn is-flex"}, [
                                m('div', {class: ""}, [
                                    gDI18n.$t('10155')//'所需保证金'
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
                    gDI18n.$t('10157')//'可用保证金'
                ]),
                m('.spacer'),
                m('div', {class: ""}, [
                    window.isMobile?(obj.wlt.aWdrawable?Number(obj.wlt.aWdrawable).toFixed2(2): (0).toFixed2(2)):
                    (obj.wlt.aWdrawable?Number(obj.wlt.aWdrawable).toFixed2(8): (0).toFixed2(8))
                ])
            ])
        ])
    },
    onbeforeremove: function () {
        obj.rmEVBUS()
    }
}