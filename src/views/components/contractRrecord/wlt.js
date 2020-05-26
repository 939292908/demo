var m = require("mithril")

let obj = {
    spotInfo: {},

    //初始化全局广播
    initEVBUS: function(){
        let that = this
        

        //当前选中合约变化全局广播
        if(this.EV_CHANGESYM_UPD_unbinder){
            this.EV_CHANGESYM_UPD_unbinder()
        }
        this.EV_CHANGESYM_UPD_unbinder = window.gEVBUS.on(gMkt.EV_CHANGESYM_UPD,arg=> {
            that.updateSpotInfo(arg)
        })
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD, arg => {
            that.updateSpotInfo()
        })
    },
    //删除全局广播
    rmEVBUS: function(){
        if(this.EV_CHANGESYM_UPD_unbinder){
            this.EV_CHANGESYM_UPD_unbinder()
        }
    },
  
    updateSpotInfo: function(){
        let Sym = window.gMkt.CtxPlaying.Sym
        let ass = window.gMkt.AssetD[Sym] || null
        if (ass && ass.TrdCls != 1) {
            let info = {
                disSym: utils.getSymDisplayName(window.gMkt.AssetD, Sym), // 合约显示名称
                ExpireStr: ass.TrdCls == 3 ? gDI18n.$t('10422'/*'永续'*/) : new Date(ass.Expire).format('yyyy-MM-dd'), // 到期日
                FundingNext: new Date(ass.FundingNext).format('yyyy-MM-dd'), 
                PrzMinInc: utils.getFullNum(ass.PrzMinInc), //最小价格变动
                FundingLongR: (ass.FundingLongR * 100).toSubstrFixed(4) + '%', //资金费率
                FundingPredictedR: (ass.FundingPredictedR * 100).toSubstrFixed(4) + '%',  //预测下一资金费率
                Mult: utils.getFullNum(ass.Mult), //最小数量变动
                FromC: ass.FromC,
                ToC: ass.ToC,
                SettleCoin: ass.SettleCoin, //计价货币
                QuoteCoin: ass.QuoteCoin,  //计算货币
                typeName: '', //合约类型名称
                LotSz: '', //合约大小
            };
            if (ass.TrdCls == 2) {
                info.typeName = gDI18n.$t('10105')//'交割合约'
                info.LotSz = ass.LotSz + ' ' + ass.QuoteCoin + ' / ' +  gDI18n.$t('10423')//'张'
            } else if (ass.TrdCls == 3 && (ass['Flag']&1) == 1) {
                info.typeName = gDI18n.$t('10106')//'反向永续'
                info.LotSz = ass.LotSz + ' ' + ass.QuoteCoin + ' / ' + gDI18n.$t('10423')//'张'
            } else if (ass.TrdCls == 3) {
                info.typeName = gDI18n.$t('10107')//'正向永续'
                info.LotSz = ass.LotSz + ' ' + ass.ToC + ' / ' + gDI18n.$t('10423')//'张'
            }
            this.spotInfo = info;
        }else{
            this.spotInfo = {
                disSym: '--',
                ExpireStr: '--',
                FundingNext: '--',
                PrzMinInc: '--',
                FundingLongR: '--',
                FundingPredictedR: '--',
                Mult: '--',
                FromC: '--',
                ToC: '--',
                SettleCoin: '--',
                QuoteCoin: '--',
                typeName: '--',
                LotSz: '--',
            }
        }
    },
}

export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
        obj.initEVBUS()
        obj.updateSpotInfo()

    },
    view: function(vnode) {
        
        return m("div",{class:"pub-spot-info box "},[
            m('div', {class:"pub-spot-info-content"}, [
                m('div', {class: 'level pos-info'}, [
                    m('div', {class: 'level-left text--secondary'}, [
                        gDI18n.$t('10110')//'合约名称'
                    ]),
                    m('div', {class: 'level-right-m'}, [
                        obj.spotInfo.disSym || '--'
                    ])
                ]),
                m('div', {class: 'level pos-info'}, [
                    m('div', {class: 'level-left text--secondary'}, [
                        gDI18n.$t('10111')//'到期日'
                    ]),
                    m('div', {class: ''}, [
                        obj.spotInfo.ExpireStr || '--'
                    ])
                ]),
                m('div', {class: 'level pos-info'}, [
                    m('div', {class: 'level-left text--secondary'}, [
                        gDI18n.$t('10112')//'计价货币'
                    ]),
                    m('div', {class: ''}, [
                        obj.spotInfo.QuoteCoin || '--'
                    ])
                ]),
                m('div', {class: 'level pos-info'}, [
                    m('div', {class: 'level-left text--secondary'}, [
                        gDI18n.$t('10113')//'结算货币'
                    ]),
                    m('div', {class: ''}, [
                        obj.spotInfo.SettleCoin || '--'
                    ])
                ]),
                m('div', {class: 'level pos-info'}, [
                    m('div', {class: 'level-left text--secondary'}, [
                        gDI18n.$t('10114')//'合约大小'
                    ]),
                    m('div', {class: ''}, [
                        obj.spotInfo.LotSz || '--'
                    ])
                ]),
                m('div', {class: 'level pos-info'}, [
                    m('div', {class: 'level-left text--secondary'}, [
                        gDI18n.$t('10115')//'最小价格变动'
                    ]),
                    m('div', {class: ''}, [
                        obj.spotInfo.PrzMinInc || '--'
                    ])
                ]),
                m('div', {class: 'level pos-info'}, [
                    m('div', {class: 'level-left text--secondary'}, [
                        gDI18n.$t('10116')//'最小数量变动'
                    ]),
                    m('div', {class: ''}, [
                        obj.spotInfo.Mult || '--'
                    ])
                ]),
            ])
            
          ])
    },
    onbeforeremove: function(vnode) {
        obj.rmEVBUS()
    },
}