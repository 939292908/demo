var m = require("mithril")
import Dropdown from '../common/Dropdown'

let obj = {
  spotInfo:{},
  //合约名称列表
  futureSymList: [],
  futureSymObj: {},

  dropdownActive : 0,
  tabelList:[],

  //初始化全局广播
  initEVBUS:function(){
    let that = this

    //assetD合约详情全局广播
    if (this.EV_ASSETD_UPD_unbinder) {
      this.EV_ASSETD_UPD_unbinder()
    }
    this.EV_ASSETD_UPD_unbinder = window.gEVBUS.on(gMkt.EV_ASSETD_UPD, arg => {
        that.initSymList()
    })

    //页面交易类型全局广播
    if (this.EV_PAGETRADESTATUS_UPD_unbinder) {
        this.EV_PAGETRADESTATUS_UPD_unbinder()
    }
    this.EV_PAGETRADESTATUS_UPD_unbinder = window.gEVBUS.on(gMkt.EV_PAGETRADESTATUS_UPD, arg => {
        that.initSymList()
    })

  },

  rmEVBUS:function(){
    //assetD合约详情全局广播
    if (this.EV_ASSETD_UPD_unbinder) {
      this.EV_ASSETD_UPD_unbinder()
    }
    //页面交易类型全局广播
    if (this.EV_PAGETRADESTATUS_UPD_unbinder) {
      this.EV_PAGETRADESTATUS_UPD_unbinder()
    }
  },
  //初始化合约列表
  initSymList: function () {
    let displaySym = window.gMkt.displaySym
    let assetD = window.gMkt.AssetD
    let futureSymList = []
    displaySym.map(function (Sym) {
        let ass = assetD[Sym]
        if (ass.TrdCls == 3) {
            futureSymList.push(Sym)
        } else if (ass.TrdCls == 2) {
            futureSymList.push(Sym)
        }
    })
    this.futureSymList = futureSymList
    futureSymList.map((key,i)=>{
      let obj = {
        id:i,
        label:utils.getSymDisplayName(window.gMkt.AssetD, key)
      }
      this.tabelList.push(obj)
    })

    this.updateSpotInfo()
    console.log(this.tabelList,2222222222)
    console.log(this.futureSymList,1111111111)
    m.redraw();
},
  //初始化合约数据
  updateSpotInfo: function(){
    let dropdownActive = this.dropdownActive
    let Sym = this.futureSymList[dropdownActive]
    let ass = window.gMkt.AssetD[Sym] || null
    if (ass && ass.TrdCls != 1) {
        let info = {
            disSym: utils.getSymDisplayName(window.gMkt.AssetD, Sym), // 合约显示名称
            ExpireStr: ass.TrdCls == 2 ?new Date(ass.Expire).format('yyyy-MM-dd hh:mm:ss') : "没有到期日期", // 到期日
            FundingNext: new Date(ass.FundingNext).format('yyyy-MM-dd hh:mm:ss'), 
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

    console.log(this.spotInfo,333333333333)
  },
  //下拉列表
  getDownloadFuture:function(){
    return m( Dropdown, {
      class: 'pub-trade-list-tabs-dropdown is-hidden-mobile',
      activeId: cb => cb(obj, 'dropdownActive'),
      menuWidth:110,
      onClick (itme) {
          // console.log(itme);
          obj.clickSelect(itme)
      },
      getList () {
          return obj.tabelList
      }
    })
  },
  //点击选中合约
  clickSelect:function(item){
    this.updateSpotInfo()
  },
  
}


export default {
    oninit: function(vnode){
      
    },
    oncreate: function(vnode){
        obj.initEVBUS()
        // obj.initSymList()
    },
    view: function(vnode) {
      let dropdownActive = obj.dropdownActive
        return m("div",{class: ""}, [
          m('div',{class:"inf_dropdown"},[
            m('span',{class:"inf_body_span inf_body_font"},[
              '合约',
            ]),
            //下拉列表
            obj.getDownloadFuture(),
          ]),
          //文案说明
          m('div',{class:"inf_dropdown inf_body_conent"},[
            m('div',{class:"inf_body_title_font"},[
              // obj.tabelList[dropdownActive].label + '合约明细'
            ]),
            m('div',{class:"inf_body_TD"},[
              // obj.tabelList[dropdownActive].label + '合约没有到期日。每张合约大小0.01个BTC。每8小时交换资金费用。下一个交换将发生在UTC+8 2020/7/15 16:00。'
            ]),
            m('div',{class:" inf_body_TD"},[
              window.$config.exchName + '交易平台利用利率与每分钟溢价指数的加权平均值计算出资金费率。',
              m('span',{class:""},[
                m('a',{class:""},[
                  '阅读更多...'
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