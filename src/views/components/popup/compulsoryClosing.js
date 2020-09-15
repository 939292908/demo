var m = require("mithril")
import Calculator from '../../../futureCalc/calculator'

let obj = {
    open: false,        //页面开关
    tabsActive: 0,      //默认显示项
    leverClose:false,   //杠杆输入框X按钮
    leverMultiple:"",   //杠杆输入倍数
    Dir: 1,             //做多/做空         :1/0
    buyModel: 1,        //全仓/逐仓         :1/0
    AssetD: {},         //合约数据填充

    //初始化全局广播
    initEVBUS: function () {
        let that = this

        //当前选中合约变化全局广播
        if(this.EV_CHANGESYM_UPD_unbinder){
            this.EV_CHANGESYM_UPD_unbinder()
        }
        this.EV_CHANGESYM_UPD_unbinder = window.gEVBUS.on(gMkt.EV_CHANGESYM_UPD,arg=> {
            that.initFuture()
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
    },
    //做多/做空判断
    setDirType:function(type){
        this.Dir = type
    },
    //全仓/逐仓判断
    setBuyModelType:function(type){
        this.buyModel = type
    },
    //杠杆倍数输入栏
    getLever:function(e){
        let val = e.target.value
        if(val < 0){
            this.leverMultiple = ''
        }else {
            this.leverMultiple = val
        }
        if(this.leverMultiple != ""){
            this.leverClose = true
        }else {
            this.leverClose = false
        }
    },
}

export default {
    oninit: function (vnode) {

    },
    oncreate: function (vnode) {
        obj.initFuture()
        obj.initEVBUS()
    },
    view: function (vnode) {
        return m('div',{class:"calculator is-flex is-text-3 has-text-2"},[
            //左边计算区域
            m('div',{class:"calculator-public-left pr-3"},[
                m('div',{class:"is-flex calculator-button-title mb-3"},[
                    m('button',{class:"button calculator-button-item is-background-3 has-text-2 has-border-gry  is-text-3" + (obj.Dir == 1 ? " has-border-primary" : ""),onclick:function(){
                        obj.setDirType(1)
                    }},[
                        "做多"
                    ]),
                    m('button',{class:"button calculator-button-item is-background-3 has-text-2 has-border-gry is-text-3" + (obj.Dir == -1 ? " has-border-primary" : ""),onclick:function(){
                        obj.setDirType(-1)
                    }},[
                        "做空"
                    ]),
                ]),
                m('p',{class:" mb-3"},[
                    '账户模式'
                ]),
                m('div',{class:"is-flex calculator-button-title mb-3"},[
                    m('button',{class:"button button calculator-button-item is-background-3 has-text-2 has-border-gry is-text-3" + (obj.buyModel == 1?" has-border-primary" : ""),onclick:function(){
                        obj.setBuyModelType(1)
                    }},[
                        "全仓"
                    ]),
                    m('button',{class:"button button calculator-button-item is-background-3 has-text-2 has-border-gry is-text-3" + (obj.buyModel == -1?" has-border-primary" : ""),onclick:function(){
                        obj.setBuyModelType(-1)
                    }},[
                        "逐仓"
                    ]),
                ]),
                m('div',{class:"is-flex input-border-lable mb-3 px-3" + (window.$config.future.setMIRMy ? "": " is-hidden")},[
                    m('div',{class:"input-left"},[
                        "杠杆倍数"
                    ]),
                    m('input',{class:"input input-border-line",type: 'number',value : obj.leverMultiple,oninput:function(e){
                        obj.getLever(e)
                    }}),
                    m('div',{class:"input-right"},[
                        m('i',{class:"iconfont cursor-pointer " + (obj.leverClose?" iconclose" : ""),onclick:function(){
                            obj.leverClose = false
                            obj.leverMultiple = ''
                        }})
                    ])
                ]),
                m('div',{class:"is-flex input-border-lable mb-3 px-3"},[
                    m('div',{class:"input-left"},[
                        "保证金余额"
                    ]),
                    m('input',{class:"input input-border-line",type: 'number'}),
                    m('div',{class:"input-right"},[
                        obj.AssetD.QuoteCoin || ''
                    ])
                ]),
                m('div',{class:"is-flex input-border-lable mb-3 px-3"},[
                    m('div',{class:"input-left"},[
                        "开仓数量"
                    ]),
                    m('input',{class:"input input-border-line",type: 'number'}),
                    m('div',{class:"input-right"},[
                        "张"
                    ])
                ]),
                m('div',{class:"is-flex input-border-lable mb-3 px-3"},[
                    m('div',{class:"input-left"},[
                        "开仓价格"
                    ]),
                    m('input',{class:"input input-border-line",type: 'number'}),
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
                            '--'
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