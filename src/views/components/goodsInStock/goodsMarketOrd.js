import utils from "../../../utils/utils"

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
            obj.getTotalValue()
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
            Total:''      //价值
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
        //获取市价值
        this.form.Prz = this.getLastTick().LastPrz

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
        m.redraw()
    },
    setPercentageType:function(pram){
        this.percentageType = pram
    },
    setNumTotalValue:function(val){
        let Percentage = null
        switch(val){
            case 0:
                Percentage = 0.25;
                break;
            case 1:
                Percentage = 0.5;
                break;
            case 2:
                Percentage = 0.75;
                break;
            case 3:
                Percentage = 1;
                break;
        }
        if(this.buttonType){
            this.form.Total = Percentage * (obj.USDTWlt.NL || 0)

            let formNum = (this.form.Total / this.form.Prz).toString()
            console.log(formNum,11111)
            let Sym = window.gMkt.CtxPlaying.Sym
            let ass = window.gMkt.AssetD[Sym]
            let maxPrz = utils.getFullNum(Number(ass?ass.PrzMax:0))//Number(ass?ass.PrzMax:0)
            let minPrz = utils.getFullNum(Number(ass?ass.PrzMinInc:0))//Number(ass?ass.PrzMinInc:0)
            //使用getFullNum转换科学计数法为小数
            let numb = utils.getFullNum(ass.PrzMinInc).toString()
            this.form.Num = utils.getNumDecimal(formNum,maxPrz,minPrz,numb)

        }else{
            let Num = (Percentage * (obj.wlt.NL || 0)).toString()

            let Sym = window.gMkt.CtxPlaying.Sym
            let ass = window.gMkt.AssetD[Sym]
            let maxNum = Number(ass?ass.OrderMaxQty:0)
            let minNum = Number(ass?ass.OrderMinQty:0)
            //使用getFullNum转换科学计数法为小数
            let numb = utils.getFullNum(ass.OrderMinQty).toString()
            
            this.form.Num = utils.getNumDecimal(Num,maxNum,minNum,numb)
            obj.getTotalValue()
        }
    },
    //价值
    getTotalValue:function(){
        let Sym = window.gMkt.CtxPlaying.Sym
        let ass = window.gMkt.AssetD[Sym]
        //使用getFullNum转换科学计数法为小数
        let numb = utils.getFullNum(ass.PrzMinInc).toString()
        let total = ((this.form.Num || 0) * (this.form.Prz || 0)).toString()
        this.form.Total = utils.getTotalDecimal(total,numb)
        
    },
    getPercentage:function(){
        return obj.percentage.map(function(item,i){
            return m('div',{class:"pub-div-sty text-background cursor-pointer"/* + (obj.percentageType == i?" is-primary is-primary-font":"")*/,key: "percentageListItem" + i,onclick:function(){
                    obj.setPercentageType(i)
                    obj.setNumTotalValue(i)
                }},[
                    item
            ])
        })
    },
    //数量
    getInputNum:function(e){
        let _e = e.target.value
        let Sym = window.gMkt.CtxPlaying.Sym
        let ass = window.gMkt.AssetD[Sym]
        let maxNum = Number(ass?ass.OrderMaxQty:0)
        let minNum = Number(ass?ass.OrderMinQty:0)
        //使用getFullNum转换科学计数法为小数
        let numb = utils.getFullNum(ass.OrderMinQty).toString()
        
        this.form.Num = utils.getNumDecimal(_e,maxNum,minNum,numb)
        obj.getTotalValue()
    },

    // 校验
    submitVerify () {
        if(this.form.Prz === '0'){
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10141'/*'下单价格不能为0'*/), type: 'danger'})
        }else if(!this.form.Prz){
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10142'/*'下单价格不能为空'*/), type: 'danger'})
        }else if(Number(this.form.Prz) == 0){
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10141'/*'下单价格不能为0'*/), type: 'danger'})
        }else if(isNaN(Number(this.form.Prz))){
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10143'/*'请输入正确的价格'*/), type: 'danger'})
        }

        if(this.form.Num === '0'){
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10144'/*'下单数量不能为0'*/), type: 'danger'})
        }else if(!this.form.Num){
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10145'/*'下单数量不能为空'*/), type: 'danger'})
        }else if(Number(this.form.Num) == 0){
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10144'/*'下单数量不能为0'*/), type: 'danger'})
        }else if(isNaN(Number(this.form.Num))){
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10146'/*'请输入正确的数量'*/), type: 'danger'})
        }
        if(this.buttonType){
            if(Number(this.form.Total) > Number((obj.USDTWlt.NL || 0))){
                return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10038'/*"可用资金不足"*/), type: 'danger'})
            }
        }else{
            if(Number(this.form.Num) > Number((obj.wlt.NL || 0))){
                return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10038'/*"可用资金不足"*/), type: 'danger'})
            }
        }
        
        return true
    },

    //提交数据
    submit:function(){
        if(!window.gWebAPI.isLogin()){
            return window.gWebAPI.needLogin()
        }
        if ( !this.submitVerify() ) return; // 校验

        let Sym = window.gMkt.CtxPlaying.Sym
        let AId = window.gTrd.RT["UserId"]+'02'
        let dir = this.buttonType? 1 : -1;

        let p = {
            Sym: Sym,
            AId: AId,
            COrdId: new Date().getTime() + '',
            Dir: dir,
            OType: 2,
            Prz: Number(this.form.Prz),
            Qty: Number(this.form.Num),
            QtyDsp: 0,
            Tif: 0,
            OrdFlag: 0,
            PrzChg: 0
        }
        console.log(p)
        window.gTrd.ReqTrdOrderNew(p, function(aTrd, arg){
            if (arg.code != 0 || arg.data.ErrCode) {
                window.$message({ title: gDI18n.$t('10037'/*"提示"*/), content: utils.getTradeErrorCode(arg.code || arg.data.ErrCode), type: 'danger'})
            }
        })
    }
    
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
        let pageTradeStatus = window.gMkt.CtxPlaying.pageTradeStatus
        return m("div", { class: "pub-place-order-form has-text-2" }, [
            m('div',{class:"pub-bibi-order"},[
                m("div",{class:"pub-bibi-order-type is-hidden-touch"},[
                    gDI18n.$t('10102'/*"类型"*/)
                ]),
                m("div",{class:"pub-bibi-order-BS cursor-pointer" + (obj.buttonType?" pub-bibi-order-BS-color1" :" pub-bibi-order-BS-color2")  + (pageTradeStatus == 1?" pub-bibi-type1" : " pub-bibi-type2"),onclick:function(){
                    obj.buttonType = !obj.buttonType
                }},[
                    (obj.buttonType?gDI18n.$t('10326'/*"买入"*/) :gDI18n.$t('10327'/*"卖出"*/)) + " " + (obj.getLastTick().ToC || gDI18n.$t('10420'/*"币种"*/)),
                    m('i',{class:"iconfont iconswitch icon-position" + (obj.buttonType?" iconfont-switch1" :" iconfont-switch2")})
                ]),
            ]),
            m("div",{class:"pub-bibi-price"},[
                m('div',{class:"pub-bibi-price-til is-hidden-touch"},[
                    gDI18n.$t('10186'/*"价格"*/)
                ]),
                m('div',{class:"pub-bibi-price-inp" + (pageTradeStatus == 1?" pub-bibi-price-inp1" : " pub-bibi-price-inp2")},[
                    m("div",{class:"pub-bibi-price-US"},[
                        m("div",{class:"pub-bibi-price-text text-background"},[
                            (obj.getLastTick().FromC || gDI18n.$t('10420'/*"币种"*/))
                        ]),
                        m("input",{class:"input pub-bibi-price-US-input",step: obj.PrzStep,pattern:"\d*",type:"number",placeholder:gDI18n.$t('10081'/*"市价"*/),readonly:"readonly"}),
                    ]),
                    // m("div",{class:"text-size"},[
                    //     "估值 ￥ 63398.6645"
                    // ]),
                ]),
            ]),
            m("div",{class:"pub-bibi-price"},[
                m('div',{class:"pub-bibi-price-til is-hidden-touch"},[
                    gDI18n.$t('10087'/*"数量"*/)
                ]),
                m('div',{class:"pub-bibi-price-inp" + (pageTradeStatus == 1?" pub-bibi-price-inp1" : " pub-bibi-price-inp2")},[
                    m("div",{class:"pub-bibi-price-US"},[
                        m("div",{class:"pub-bibi-price-text text-background"},[
                            (obj.getLastTick().ToC || gDI18n.$t('10420'/*"币种"*/))
                        ]),
                        m("input",{class:"input pub-bibi-price-US-input",step: obj.NumStep,pattern:"\d*",value:obj.form.Num,type:"number",placeholder:gDI18n.$t('10087'/*"数量"*/),oninput:function(e){
                            obj.getInputNum(e)
                        }}),
                    ]),
                    m("div",{class:"text-size pub-button-div"},[
                        obj.getPercentage()
                    ]),
                ]),
            ]),
            m('.spacer'),
            m("div",{class:"pub-bibi-price"},[
                m('div',{class:"pub-bibi-price-til is-hidden-touch"},[
                    "余额"
                ]),
                m('div',{class:"pub-bibi-price-inp" + (pageTradeStatus == 1?" pub-bibi-price-inp1" : " pub-bibi-price-inp2")},[
                    m("div",{class:"pub-balance"},[
                        obj.buttonType?
                        obj.USDTWlt.NL?Number(obj.USDTWlt.NL).toFixed2(8)+ " " + obj.getLastTick().FromC: (0).toFixed2(8)+ " " + (obj.getLastTick().FromC || "") :
                        obj.wlt.NL?Number(obj.wlt.NL).toFixed2(8) + " " + obj.getLastTick().ToC: (0).toFixed2(8) + " " + (obj.getLastTick().ToC || "")
                        
                    ]),
                    m("div",{class:"pub-balance-button cursor-pointer is-primary-font" + (obj.buttonType?" pub-buy-sell-1" :" pub-buy-sell-2"),onclick:function(){
                        obj.submit()
                    }},[
                        (obj.buttonType?gDI18n.$t('10326'/*"买入"*/) :gDI18n.$t('10327'/*"卖出"*/)) + " " + (obj.getLastTick().ToC || gDI18n.$t('10420'/*"币种"*/)),
                    ]),
                ]),
            ]),
        ])
            
    },
    onremove: function () {
        obj.rmEVBUS()
    }
}