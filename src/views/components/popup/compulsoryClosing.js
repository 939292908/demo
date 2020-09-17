var m = require("mithril")
import Calculator from '../../../futureCalc/calculator'

let obj = {
    open: false,        //页面开关
    leverClose:false,   //杠杆输入框X按钮
    AssetD: {},         //合约数据填充

    params: { 
        type: 1,        // 合约类型 1：正向 ，-1：反向， 0：定期
        model: 3,       // 1:盈亏计算 2：平仓价格 3：强平价格
        Dir: 1,         // 1: 【做多】 -1: 【做空】
        buyModel: 1,    // 1: 【全仓】 -1：【逐仓】
        Lever: null,    // 杠杆Lever
        SZ: null,       // 开仓数量
        PrzIni: null,   // 开仓价格
        PrzCls: null,   // 平仓价格
        profit: null,   // 目标收益 平仓
        profitType: 1,  // 目标收益类型 1【目标收益】 2【目标收益率】
        WltBal: null,   // 钱包余额
        MgnISO: 0,      // 追加保证金
        aMMType: 0,
      },
      riskParams: {
        Base: null,     // 基础风险限额：Base
        Step: null,     // 基础风险限额：步长Step
        BaseMIR: null,
        StepIR: null, 
        BaseMMR: null, 
        StepMR: null,  
      },
      result:{
        
      },
      maxLever:100,
      wlt: {},//钱包数据

    //初始化全局广播
    initEVBUS: function () {
        let that = this

        //当前选中合约变化全局广播
        if(this.EV_CHANGESYM_UPD_unbinder){
            this.EV_CHANGESYM_UPD_unbinder()
        }
        this.EV_CHANGESYM_UPD_unbinder = window.gEVBUS.on(gMkt.EV_CHANGESYM_UPD,arg=> {
            that.initFuture()
            that.initWlt()
        })

        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD, arg => {
            that.initLanguage()
        })
    },
    //删除全局广播
    rmEVBUS: function () {
        //当前选中合约变化全局广播
        if(this.EV_CHANGESYM_UPD_unbinder){
            this.EV_CHANGESYM_UPD_unbinder()
        }
        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder() 
        }
    },
    //初始化多语言
    initLanguage: function () {
        
    },
    //初始化合约数据
    initFuture:function(){
        let Sym = window.gMkt.CtxPlaying.Sym
        let assetD = window.gMkt.AssetD[Sym] || {}
        this.AssetD = assetD
        if (assetD.TrdCls == 2) {
            this.params.type = 0//交割合约
            }else if (assetD.TrdCls == 3) {
            if ((assetD.Flag&1) == 1) {
              this.params.type = -1//反向永续
            }else {
              this.params.type = 1//正向永续
            }
        }
        let calculator = new Calculator(assetD);
        let RS = window.gTrd.RS[Sym] || null
        if(RS){
            this.maxLever = 1/RS.BaseMIR

            if(!window.$config.future.setMIRMy){
                this.params.Lever = this.maxLever
            }

            for(let key in this.riskParams){
            this.riskParams[key] = RS[key]
            }
            this.result = calculator.getResult({...this.params,...this.riskParams});
        }
    },
    //初始化钱包数据
    initWlt: function (arg) {
        let Sym = window.gMkt.CtxPlaying.Sym
        let assetD = window.gMkt.AssetD[Sym] || {}
        let wallets = []
        if (assetD.TrdCls == 2 || assetD.TrdCls == 3) {
            wallets = window.gTrd.Wlts['01']
        }
        let isUpdate = false
        for (let i = 0; i < wallets.length; i++) {
            let item = wallets[i]
            if (item.AId && item.Coin == assetD.SettleCoin) {
                isUpdate = true
                this.wlt = item
            }
        }
        if (!isUpdate) {
            this.wlt = {}
        }
        //判断是否含有该字段
        if(this.wlt.hasOwnProperty('aWdrawable')){
            this.params.WltBal = Number(obj.wlt.aWdrawable).toFixed2(8)
        }
    },
    //做多/做空判断
    setDirType:function(type){
        this.params.Dir = type
        this.initFuture()
    },
    //全仓/逐仓判断
    setBuyModelType:function(type){
        this.params.buyModel = type
        this.initFuture()
    },
    //杠杆倍数输入栏
    getLever:function(e){
        let val = e.target.value
        if(val < 0){
            this.params.Lever = ''
        }else if(val > this.maxLever){
            this.params.Lever = this.maxLever
        }else {
            this.params.Lever = val
        }
        // if(this.params.Lever){
        //     this.leverClose = true
        // }else {
        //     this.leverClose = false
        // }
        this.initFuture()
    },
    //清除杠杆数据
    closeLever:function(){
        obj.leverClose = false
        obj.params.Lever = null
        this.initFuture()
    },
    //开仓数量
    getPosSz:function(e){
        let val = e.target.value
        if(val < 0){
            this.params.SZ = ''
        }else {
            this.params.SZ = val
        }
        this.initFuture()
    },
    //开仓价格
    getPrzIni:function(e){
        let val = e.target.value
        if(val < 0){
            this.params.PrzIni = ''
        }else {
            this.params.PrzIni = val
        }
        this.initFuture()
    },
    //保证金余额
    getWltBal:function(e){
        let val = e.target.value
        if(val < 0){
            this.params.WltBal = ''
        }else {
            this.params.WltBal = val
        }
        this.initFuture()
    },
}

export default {
    oninit: function (vnode) {

    },
    oncreate: function (vnode) {
        obj.initWlt()
        obj.initFuture()
        obj.initEVBUS()
    },
    view: function (vnode) {
        return m('div',{class:"calculator is-flex is-text-3 has-text-2"},[
            //左边计算区域
            m('div',{class:"calculator-public-left pr-3"},[
                m('div',{class:"is-flex calculator-button-title mb-3"},[
                    m('button',{class:"button calculator-button-item is-background-3 has-text-2 has-border-gry  is-text-3" + (obj.params.Dir == 1 ? " has-border-primary" : ""),onclick:function(){
                        obj.setDirType(1)
                    }},[
                        "做多"
                    ]),
                    m('button',{class:"button calculator-button-item is-background-3 has-text-2 has-border-gry is-text-3" + (obj.params.Dir == -1 ? " has-border-primary" : ""),onclick:function(){
                        obj.setDirType(-1)
                    }},[
                        "做空"
                    ]),
                ]),
                m('p',{class:" mb-3"},[
                    '账户模式'
                ]),
                m('div',{class:"is-flex calculator-button-title mb-3"},[
                    m('button',{class:"button button calculator-button-item is-background-3 has-text-2 has-border-gry is-text-3" + (obj.params.buyModel == 1?" has-border-primary" : ""),onclick:function(){
                        obj.setBuyModelType(1)
                    }},[
                        "全仓"
                    ]),
                    m('button',{class:"button button calculator-button-item is-background-3 has-text-2 has-border-gry is-text-3" + (obj.params.buyModel == -1?" has-border-primary" : ""),onclick:function(){
                        obj.setBuyModelType(-1)
                    }},[
                        "逐仓"
                    ]),
                ]),
                m('div',{class:"is-flex input-border-lable mb-3 px-3" + (window.$config.future.setMIRMy ? "": " is-hidden")},[
                    m('div',{class:"input-left"},[
                        "杠杆倍数"
                    ]),
                    m('input',{class:"input input-border-line",type: 'number',value : obj.params.Lever,oninput:function(e){
                        obj.getLever(e)
                    }}),
                    m('div',{class:"input-right"},[
                        // m('i',{class:"iconfont cursor-pointer " + (obj.leverClose?" iconclose" : ""),onclick:function(){
                        //     obj.closeLever()
                        // }})
                        "X"
                    ])
                ]),
                m('div',{class:"is-flex input-border-lable mb-3 px-3"},[
                    m('div',{class:"input-left"},[
                        "保证金余额"
                    ]),
                    m('input',{class:"input input-border-line",type: 'number',value : obj.params.WltBal,oninput:function(e){
                        obj.getWltBal(e)
                    }}),
                    m('div',{class:"input-right"},[
                        obj.AssetD.QuoteCoin || ''
                    ])
                ]),
                m('div',{class:"is-flex input-border-lable mb-3 px-3"},[
                    m('div',{class:"input-left"},[
                        "开仓数量"
                    ]),
                    m('input',{class:"input input-border-line",type: 'number',value : obj.params.SZ,oninput:function(e){
                        obj.getPosSz(e)
                    }}),
                    m('div',{class:"input-right"},[
                        "张"
                    ])
                ]),
                m('div',{class:"is-flex input-border-lable mb-3 px-3"},[
                    m('div',{class:"input-left"},[
                        "开仓价格"
                    ]),
                    m('input',{class:"input input-border-line",type: 'number',value : obj.params.PrzIni,oninput:function(e){
                        obj.getPrzIni(e)
                    }}),
                    m('div',{class:"input-right"},[
                        obj.AssetD.QuoteCoin || ''
                    ])
                ]),
            ]),
            //右边显示区域
            m('div',{class:"calculator-public-right pl-3"},[
                m('div',{class:"calculator-public-right-item py-3 px-3"},[
                    m('div',{class:"pb-3"},[
                        '计算结果'
                    ]),
                    m('div',{class:"is-flex pb-3 calculator-public-right-item-list"},[
                        m('div',{class:""},[
                            '平仓价格' + "(" + (obj.AssetD.SettleCoin || '--') + ")"
                        ]),
                        m('div',{class:""},[
                            obj.result.QiangPingPrice || '--'
                        ]),
                    ]),
                    m('div',{class:""},[
                        m('p',{class:"calculator-text py-3 pr-3 is-text-2"},[
                            '*计算结果仅供参考。实际操作中可能会因为手续费、资金费率等导致结果存在偏差。'
                        ])
                    ])
                ]),
            ]),
        ])
    },
    onremove: function (vnode) {
        obj.rmEVBUS()
    },
}