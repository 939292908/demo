var m = require("mithril")

let obj = {
    wlt: {},
    USDTWlt:{},
    form:{
        Prz: '',      //委托价格
        Num: '',      //委托数量
        Total:''      //价值
    },
    // 是否已经自动填入价格
    isAutoPrz: false,
    buttonType:true,
    //需要显示的行情数据
    lastTick: {},
    //行情数据接收
    tickObj: {},
    //数据变动区间
    PrzStep: 1,
    NumStep: 1,
    percentageType:null,
    //百分比
    percentage:[
        "25%",
        "50%",
        "75%",
        "100%"

    ],
    //初始化全局广播
    initEVBUS: function () {
        let that = this
        //tick行情全局广播
        if(this.EV_TICK_UPD_unbinder){
            this.EV_TICK_UPD_unbinder()
        }
        this.EV_TICK_UPD_unbinder = window.gEVBUS.on(gMkt.EV_TICK_UPD,arg=> {
            that.onTick(arg)
            that.autoTick(arg)
        })
        //当前选中合约变化全局广播
        if(this.EV_CHANGESYM_UPD_unbinder){
            this.EV_CHANGESYM_UPD_unbinder()
        }
        this.EV_CHANGESYM_UPD_unbinder = window.gEVBUS.on(gMkt.EV_CHANGESYM_UPD,arg=> {
            that.initWlt()
            that.isAutoPrz = false
            that.updateSpotInfo()
            that.getTotalValue()
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
        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        } 
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD, arg => {
            that.initLanguage()
        })
        if(this.EV_WEB_LOGOUT_unbinder){
            this.EV_WEB_LOGOUT_unbinder()
        }
        this.EV_WEB_LOGOUT_unbinder = window.gEVBUS.on(gWebAPI.EV_WEB_LOGOUT,arg=> {
            that.wlt = {}
        })

        //点选行情数据
        if(this.EV_CHANGEPLACEORDPRZABDNUM_unbinder){
            this.EV_CHANGEPLACEORDPRZABDNUM_unbinder()
        }
        this.EV_CHANGEPLACEORDPRZABDNUM_unbinder = window.gEVBUS.on(gEVBUS.EV_CHANGEPLACEORDPRZABDNUM ,arg=> {
            switch(arg.type){
                case 'prz':
                    that.form.Prz = arg.val
                    break;
                case 'num':
                    that.form.Num = arg.val
                    break;
                default:

            }
        })

    },
    initLanguage : function (){
        obj.updateSpotInfo()
    },
    //删除全局广播
    rmEVBUS: function () {
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
        if(this.EV_TICK_UPD_unbinder){
            this.EV_TICK_UPD_unbinder()
        }
        //点选行情数据
        if(this.EV_CHANGEPLACEORDPRZABDNUM_unbinder){
            this.EV_CHANGEPLACEORDPRZABDNUM_unbinder()
        }
    },
       
    updateSpotInfo: function(){
        this.form = {
            Prz: '',      //委托价格
            Num: '',      //委托数量
        }
        this.isAutoPrz = false
        let Sym = window.gMkt.CtxPlaying.Sym
        let ass = window.gMkt.AssetD[Sym]
        if(ass){
            this.PrzStep = Number(ass.PrzMinInc)
            this.NumStep = Number(ass.OrderMinQty)
        }


    },
    autoTick: function(param){
        this.tickObj[param.Sym] = param.data
        for(let key in this.tickObj){
            let item = this.tickObj[key];
            let gmexCI = utils.getGmexCi(window.gMkt.AssetD, item.Sym)
            let indexTick = this.lastTick[gmexCI]
            
            let obj = utils.getTickObj(window.gMkt.AssetD, window.gMkt.AssetEx, item, this.lastTick[key], indexTick)
            obj?this.lastTick[key] = obj:''
        }
        m.redraw()
    },
    onTick: function (arg) {
        if (arg.Sym == window.gMkt.CtxPlaying.Sym && !this.isAutoPrz) {
            if(!this.form.Prz){
                let lastTick = window.gMkt.lastTick[arg.Sym]
                this.form.Prz = Number(lastTick && lastTick.LastPrz || 0)
                this.isAutoPrz = true
            }
        }
        m.redraw()
    },
    //获取当前合约最新行情
    getLastTick: function(){
        let Sym = window.gMkt.CtxPlaying.Sym
        return this.lastTick[Sym] || {}
    },
    initWlt: function(arg){
        let Sym = window.gMkt.CtxPlaying.Sym
        let assetD = window.gMkt.AssetD[Sym] || {}
        // console.log(assetD,44444444444)
        let LastPrz = obj.getLastTick().LastPrz || " "
        let wallets = []
        if(assetD.TrdCls == 1){
            wallets = window.gTrd.Wlts['02']
        }
        let isUpdate = false
        let isUSDTP = false
        for(let i = 0;i < wallets.length; i++){
            let item = wallets[i]
            if(item.AId && item.Coin == assetD.SettleCoin){
                isUpdate = true

                this.wlt = utils.formateWallet(item,LastPrz)//item
            }
            if(item.AId && item.Coin == assetD.QuoteCoin){
                isUSDTP = true

                this.USDTWlt = utils.formateWallet(item)//item
            }
        }
        if(!isUpdate){
            this.wlt = {}
        }
        if(!isUSDTP){
            this.USDTWlt = {}
        }

        // console.log(this.wlt,11111111111)
        // console.log(this.USDTWlt,2222222222)
        // console.log(this.getLastTick(),333333333333)
        m.redraw()
    },
    setPercentageType:function(pram){
        this.percentageType = pram
    },
    getPercentage:function(){
        return obj.percentage.map(function(item,i){
            return m('div',{class:"pub-div-sty text-background cursor-pointer" + (obj.percentageType == i?" is-primary is-primary-font":""),key: "percentageListItem" + i,onclick:function(){
                    obj.setPercentageType(i)
                }},[
                    item
            ])
        })
    },
    getInputPrz:function(e){
        let Sym = window.gMkt.CtxPlaying.Sym
        let ass = window.gMkt.AssetD[Sym]
        console.log(ass,1111111111)
        let maxPrz = utils.getFullNum(Number(ass?ass.PrzMax:0))//Number(ass?ass.PrzMax:0)
        let minPrz = utils.getFullNum(Number(ass?ass.PrzMinInc:0))//Number(ass?ass.PrzMinInc:0)
        console.log(maxPrz,minPrz,222222)
        //获取合约允许变动的最小区间
        //使用getFullNum转换科学计数法为小数
        let numb = utils.getFullNum(ass.PrzMinInc).toString()
        //获取合约允许的小数点长度
        let numb2 = numb.split(".")[1]
        let numb2Length = numb2.length
        //获取合约允许的小数最后一位数字
        let lastNumbMin =  numb2.substr(numb2.length-1,1)
        //根据输入的是否含有“.”判断是否为小数
        if(e.target.value.includes(".")){
            let beforValue = e.target.value.split(".")[0]?e.target.value.split(".")[0] :"0"
            let eValue = e.target.value.split(".")[1] ? e.target.value.split(".")[1] : ""
            //获取输入数字小数点后长度
            let eValueLength = eValue.length
            let lastValue = eValue.substr(eValue.length-1,1)
            //判断小数长度是否与合约要求长度相等
            if(numb2Length == eValueLength){
                //判断输入小数最后一位是否与合约要求的最后一位相等
                if(lastValue == "0" || lastValue == lastNumbMin){
                    if(Number(e.target.value) > maxPrz){
                        this.form.Prz = maxPrz
                    }else if(Number(e.target.value) < 0){
                        this.form.Prz = minPrz
                    }else {
                        this.form.Prz = beforValue + "." + eValue
                    }
                }else if(Number(lastValue) % Number(lastNumbMin) == 0){
                    //不相等的情况下判断输入的最后一位能否将合约要求的最后一位数字取余为0
                    if(Number(e.target.value) > maxPrz){
                        this.form.Prz = maxPrz
                    }else if(Number(e.target.value) < 0){
                        this.form.Prz = minPrz
                    }else {
                        this.form.Prz = beforValue + "." + eValue
                    }
                }  
            }else{
                this.form.Prz = beforValue + "." + eValue.substring(0,numb2Length)
            }
        }else{
            if(Number(e.target.value) > maxPrz){
                this.form.Prz = maxPrz
            }else if(Number(e.target.value) < 0){
                this.form.Prz = minPrz
            }else {
                this.form.Prz = e.target.value
            }
        }

        obj.getTotalValue()
    },
    getInputNum:function(e){
        let val = e.target.value
        let Sym = window.gMkt.CtxPlaying.Sym
        let ass = window.gMkt.AssetD[Sym]
        let maxNum = Number(ass?ass.OrderMaxQty:0)
        let minNum = Number(ass?ass.OrderMinQty:0)
        if(Number(val) > maxNum){
            this.form.Num = maxNum
        }else if(Number(val) < 0){
            this.form.Num = minNum
        }else {
            this.form.Num = val
        }

        obj.getTotalValue()
    },
    getTotalValue:function(){
        this.form.Total = (this.form.Num || 0) * (this.form.Prz || 0)
    },
    
}
export default {
    oninit: function (vnode) {
        obj.initLanguage()
    },
    oncreate: function (vnode) {
        obj.initEVBUS()
        obj.updateSpotInfo()
    },
    view: function (vnode) {

        return m("div", { class: "pub-place-order-form has-text-2" }, [
            m('div',{class:"pub-bibi-order"},[
                m("div",{class:"pub-bibi-order-type"},[
                    '类型'
                ]),
                m("div",{class:"pub-bibi-order-BS cursor-pointer" + (obj.buttonType?" pub-bibi-order-BS-color1" :" pub-bibi-order-BS-color2"),onclick:function(){
                    obj.buttonType = !obj.buttonType
                }},[
                    (obj.buttonType?" 买入" :" 卖出") + (obj.getLastTick().ToC || "币种"),
                    m('i',{class:"iconfont iconswitch icon-position" + (obj.buttonType?" iconfont-switch1" :" iconfont-switch2")})
                ]),
            ]),
            m("div",{class:"pub-bibi-price"},[
                m('div',{class:"pub-bibi-price-til"},[
                    "价格"
                ]),
                m('div',{class:"pub-bibi-price-inp"},[
                    m("div",{class:"pub-bibi-price-US"},[
                        m("div",{class:"pub-bibi-price-text text-background"},[
                            (obj.getLastTick().FromC || "币种")
                        ]),
                        m("input",{class:"input pub-bibi-price-US-input",step: obj.PrzStep,pattern:"\d*",value:obj.form.Prz,type:"number",placeholder:"请输入价格",oninput:function(e){
                            obj.getInputPrz(e)
                        }}),
                    ]),
                    // m("div",{class:"text-size"},[
                    //     "估值 ￥ 63398.6645"
                    // ]),
                ]),
            ]),
            m("div",{class:"pub-bibi-price"},[
                m('div',{class:"pub-bibi-price-til"},[
                    "数量"
                ]),
                m('div',{class:"pub-bibi-price-inp"},[
                    m("div",{class:"pub-bibi-price-US"},[
                        m("div",{class:"pub-bibi-price-text text-background"},[
                            (obj.getLastTick().ToC || "币种")
                        ]),
                        m("input",{class:"input pub-bibi-price-US-input",step: obj.NumStep,pattern:"\d*",value:obj.form.Num,type:"number",placeholder:"请输入数量",oninput:function(e){
                            obj.getInputNum(e)
                        }}),
                    ]),
                    m("div",{class:"text-size pub-button-div"},[
                        obj.getPercentage()
                    ]),
                ]),
            ]),
            m("div",{class:"pub-bibi-price"},[
                m('div',{class:"pub-bibi-price-til"},[
                    "价值"
                ]),
                m('div',{class:"pub-bibi-price-inp"},[
                    m("div",{class:"pub-bibi-price-US"},[
                        m("div",{class:"pub-bibi-price-text text-background"},[
                            (obj.getLastTick().FromC || "币种")
                        ]),
                        m("input",{class:"input pub-bibi-price-US-input",type:"number",value:obj.form.Total}),
                    ]),
                ]),
            ]),
            m("div",{class:"pub-bibi-price"},[
                m('div',{class:"pub-bibi-price-til"},[
                    "余额"
                ]),
                m('div',{class:"pub-bibi-price-inp"},[
                    m("div",{class:"pub-balance"},[
                        obj.buttonType?
                        obj.USDTWlt.NL?Number(obj.USDTWlt.NL).toFixed2(8)+ " " + obj.getLastTick().FromC: (0).toFixed2(8)+ " " + (obj.getLastTick().FromC || "") :
                        obj.wlt.NL?Number(obj.wlt.NL).toFixed2(8) + " " + obj.getLastTick().ToC: (0).toFixed2(8) + " " + (obj.getLastTick().ToC || "")
                        
                    ]),
                    m("div",{class:"pub-balance-button cursor-pointer is-primary-font" + (obj.buttonType?" pub-buy-sell-1" :" pub-buy-sell-2")},[
                        (obj.buttonType?" 买入" :" 卖出") + (obj.getLastTick().ToC || "币种"),
                    ]),
                ]),
            ]),
        ])
            
    },
    onremove: function () {
        obj.rmEVBUS()
    }
}