var m = require("mithril")

import footer from './components/footer'
import header from './components/header'
import layout from './components/layout'

import * as futureCalc from '../futureCalc/calcFuture'

let main = {
    TICKCLACTNTERVAL: 1000,
    lastTmForTick: 0,
    messageContent: [],
    initEVBUS: function(){
        let that = this
        
        if(this.EV_MESSAGE_UPD_unbinder){
            this.EV_MESSAGE_UPD_unbinder()
        }
        this.EV_MESSAGE_UPD_unbinder = window.gEVBUS.on(window.EV_MESSAGE_UPD,arg=> {
            that.addMessageDom(arg)
        })

        if(this.EV_GET_POS_READY_unbinder){
            this.EV_GET_POS_READY_unbinder()
        }
        this.EV_GET_POS_READY_unbinder = window.gEVBUS.on(gTrd.EV_GET_POS_READY,arg=> {
            that.setDisplayTrdInfo()
        })
    
        if(this.EV_POS_UPD_unbinder){
          this.EV_POS_UPD_unbinder()
        }
        this.EV_POS_UPD_unbinder = window.gEVBUS.on(gTrd.EV_POS_UPD,arg=> {
            that.setDisplayTrdInfo()
        })
    
        //assetD合约详情全局广播
        if(this.EV_ASSETD_UPD_unbinder){
          this.EV_ASSETD_UPD_unbinder()
        }
        this.EV_ASSETD_UPD_unbinder = window.gEVBUS.on(gMkt.EV_ASSETD_UPD,arg=> {
            that.getRiskLimits()
        })

        if (this.EV_GET_ORD_READY_unbinder) {
            this.EV_GET_ORD_READY_unbinder()
        }
        this.EV_GET_ORD_READY_unbinder = window.gEVBUS.on(gTrd.EV_GET_ORD_READY, arg => {
            that.setDisplayTrdInfo()

        })
        
        if (this.EV_ORD_UPD_unbinder) {
            this.EV_ORD_UPD_unbinder()
        }
        this.EV_ORD_UPD_unbinder = window.gEVBUS.on(gTrd.EV_ORD_UPD, arg => {
            that.setDisplayTrdInfo()
        })

        if(this.EV_GET_WLT_READY_unbinder){
            this.EV_GET_WLT_READY_unbinder()
        }
        this.EV_GET_WLT_READY_unbinder = window.gEVBUS.on(gTrd.EV_GET_WLT_READY,arg=> {
            that.setDisplayTrdInfo()
        })

        if(this.EV_WLT_UPD_unbinder){
            this.EV_WLT_UPD_unbinder()
        }
        this.EV_WLT_UPD_unbinder = window.gEVBUS.on(gTrd.EV_WLT_UPD,arg=> {
            that.setDisplayTrdInfo()
        })

        //tick行情全局广播
        if(this.EV_TICK_UPD_unbinder){
            this.EV_TICK_UPD_unbinder()
        }
        this.EV_TICK_UPD_unbinder = window.gEVBUS.on(gMkt.EV_TICK_UPD,arg=> {
            this.onTick(arg)
        })
    },
    rmEVBUS: function(){
        let that = this
        
        if(this.EV_MESSAGE_UPD_unbinder){
            this.EV_MESSAGE_UPD_unbinder()
        }

        if(this.EV_GET_POS_READY_unbinder){
            this.EV_GET_POS_READY_unbinder()
        }
    
        if(this.EV_POS_UPD_unbinder){
          this.EV_POS_UPD_unbinder()
        }
    
        //assetD合约详情全局广播
        if(this.EV_ASSETD_UPD_unbinder){
          this.EV_ASSETD_UPD_unbinder()
        }

        if (this.EV_GET_ORD_READY_unbinder) {
            this.EV_GET_ORD_READY_unbinder()
        }

        if (this.EV_ORD_UPD_unbinder) {
            this.EV_ORD_UPD_unbinder()
        }

        if(this.EV_GET_WLT_READY_unbinder){
            this.EV_GET_WLT_READY_unbinder()
        }

        if(this.EV_WLT_UPD_unbinder){
            this.EV_WLT_UPD_unbinder()
        }
    },
    addMessageDom: function(arg){
        let that = this;
        let msg = this.createMsg(arg.data)
        msg.delTimer = setTimeout(function(){
            that.delMsg(msg.key)
        }, arg.DEL_INTERVAL)
        this.messageContent.push(msg)
        if(this.messageContent.length > 3){
            let needDelMsgArr = this.messageContent.slice(0, -3)
            for(let i = 0; i < needDelMsgArr.length; i++){
                let item = needDelMsgArr[i]
                this.delMsg(item.key)
            }
        }
    },
    createMsg: function({title, content, type}){
        let that = this
        let tm = Date.now()
        return m('article', {class: "message box " + (' is-'+type), key: tm}, [
            m('div', {class:"message-header"},[
                m('p', {class:""},[
                    title
                ]),
                m('button', {class:"delete", "aria-label": "delete", onclick: function(){
                    that.delMsg(tm)
                }})
            ]),
            m('div', {class:"message-body"},[
                content
            ])
        ])
    },
    delMsg: function(key){
        let i = this.messageContent.findIndex(item => {
            return item.key == key
        })
        if(i > -1){
            if(this.messageContent[i].delTimer){
                clearTimeout(this.messageContent[i].delTimer)
            }
            this.messageContent.splice(i, 1)
        }
    },
    getHeader: function(){
        let type = window.$config.views.header.type
        switch(type){
            case 0:
                return m(header)
            case 1:
                return this.customHeader()
            default:
                return null
        }
    },
    customHeader: function(){
        
    },
    getLayout: function(){
        let type = window.$config.views.layout.type
        switch(type){
            case 0:
                return m(layout)
            case 1:
                return this.customLayout()
            default:
                return null
        }
    },
    customLayout: function(){
        
    },
    getFooter: function(){
        let type = window.$config.views.footer.type
        switch(type){
            case 0:
                return m(footer)
            case 1:
                return this.customFooter()
            default:
                return null
        }
    },
    customFooter: function(){
        
    },
    getMessage: function(){
        let type = window.$config.views.message.type
        switch(type){
            case 0:
                return m('div', {class: "window-message-box "}, main.messageContent)
            case 1:
                return this.customMessage()
            default:
                return null
        }
    },
    customMessage: function(){
        
    },

    //计算合约持仓资产相关数据
    setDisplayTrdInfo: function(){
        let s = window.gTrd
        
        let info = s.trdInfoStatus
        
        if(info.pos && info.ord && info.wlt && info.rs){
            

            let posObj = s.Poss
            let pos = []
            for(let key in posObj){
                pos.push(posObj[key])
            }

            let wallet = s.Wlts['01']
            let order = s.Orders['01']
            let RS = s.RS
            let assetD = window.gMkt.AssetD
            let lastTick = window.gMkt.lastTick
            let UPNLPrzActive = window.$config.future.UPNLPrzActive//'1'
            let MMType = window.$config.future.MMType//0;
            let PrzLiqType = window.$config.future.PrzLiqType//0

            let cb = function(arg){
                gEVBUS.emit(window.gTrd.EV_POSABDWLTCALCOVER_UPD, {Ev: window.gTrd.EV_POSABDWLTCALCOVER_UPD, data: arg})
            }
            futureCalc.calcFutureWltAndPosAndMI(pos, wallet, order, RS, assetD, lastTick, UPNLPrzActive, MMType, PrzLiqType, cb)
            
        }
    },
    //获取风险限额
    getRiskLimits: function(){
        let that = this
        let s = window.gTrd

        if(!s.RT["UserId"]) return
        // 筛选合约名称
        let assetD = window.gMkt.AssetD
        console.log('ReqTrdGetRiskLimits ==>> ', assetD)
        let SymArr = []
        for(let key in assetD){
            let item = assetD[key]
            if(item.TrdCls == 2 || item.TrdCls == 3){
                SymArr.push(key)
            }
        }
        if(SymArr.length > 0){
            s.ReqTrdGetRiskLimits({
                "AId":s.RT["UserId"]+"01",
                "Sym": SymArr.join(',')
            }, function(){
                that.setDisplayTrdInfo()
            })
        }
    },
    onTick: function(param){
        let tm = Date.now()
        if(tm - this.lastTmForTick > this.TICKCLACTNTERVAL){
            this.setDisplayTrdInfo()
            this.lastTmForTick = tm
        }
    },
}
export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
        main.initEVBUS()
    },
    view: function(vnode) {
        
        return m("section",{class: ""}, [
            main.getHeader(),
            
            main.getLayout(),
            
            main.getFooter(),
            
            main.getMessage(),
        ])
    },
    onremove: function(){
        main.rmEVBUS()
    }
}