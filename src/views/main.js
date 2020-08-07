var m = require("mithril")



let header = require('./components/header').default
let footer = require('./components/footer').default
let message = require('./components/message')

let futureCalc = require('../futureCalc/calcFuture')

let main = {
    TICKCLACTNTERVAL: 1000,
    lastTmForTick: 0,
    // 上次获取风险限额的时间
    getRSLastTm: 0,
    delNullPosPlanTimer: null, 
    initEVBUS: function () {
        let that = this

        if (this.EV_GET_POS_READY_unbinder) {
            this.EV_GET_POS_READY_unbinder()
        }
        this.EV_GET_POS_READY_unbinder = window.gEVBUS.on(gTrd.EV_GET_POS_READY, arg => {
            that.setDisplayTrdInfo()
            that.getRiskLimits()
        })

        if (this.EV_POS_UPD_unbinder) {
            this.EV_POS_UPD_unbinder()
        }
        this.EV_POS_UPD_unbinder = window.gEVBUS.on(gTrd.EV_POS_UPD, arg => {
            that.setDisplayTrdInfo()
        })

        //assetD合约详情全局广播
        if (this.EV_ASSETD_UPD_unbinder) {
            this.EV_ASSETD_UPD_unbinder()
        }
        this.EV_ASSETD_UPD_unbinder = window.gEVBUS.on(gMkt.EV_ASSETD_UPD, arg => {
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
            that.onOrderMsg(arg.data)
        })

        if (this.EV_GET_WLT_READY_unbinder) {
            this.EV_GET_WLT_READY_unbinder()
        }
        this.EV_GET_WLT_READY_unbinder = window.gEVBUS.on(gTrd.EV_GET_WLT_READY, arg => {
            that.setDisplayTrdInfo()
        })

        if (this.EV_WLT_UPD_unbinder) {
            this.EV_WLT_UPD_unbinder()
        }
        this.EV_WLT_UPD_unbinder = window.gEVBUS.on(gTrd.EV_WLT_UPD, arg => {
            that.setDisplayTrdInfo()
        })

        //tick行情全局广播
        if (this.EV_TICK_UPD_unbinder) {
            this.EV_TICK_UPD_unbinder()
        }
        this.EV_TICK_UPD_unbinder = window.gEVBUS.on(gMkt.EV_TICK_UPD, arg => {
            this.onTick(arg)
        })
    },
    rmEVBUS: function () {
        let that = this

        if (this.EV_GET_POS_READY_unbinder) {
            this.EV_GET_POS_READY_unbinder()
        }

        if (this.EV_POS_UPD_unbinder) {
            this.EV_POS_UPD_unbinder()
        }

        //assetD合约详情全局广播
        if (this.EV_ASSETD_UPD_unbinder) {
            this.EV_ASSETD_UPD_unbinder()
        }

        if (this.EV_GET_ORD_READY_unbinder) {
            this.EV_GET_ORD_READY_unbinder()
        }

        if (this.EV_ORD_UPD_unbinder) {
            this.EV_ORD_UPD_unbinder()
        }

        if (this.EV_GET_WLT_READY_unbinder) {
            this.EV_GET_WLT_READY_unbinder()
        }

        if (this.EV_WLT_UPD_unbinder) {
            this.EV_WLT_UPD_unbinder()
        }
    },
    
    customLayout: function () {

    },

    getFooter: function () {
        let type = window.$config.views.footer.type
        switch (type) {
            case 0:
                return m(footer)
            case 1:
                return this.customFooter()
            default:
                return null
        }
    },

    getHeader: function () {
        let type = window.$config.views.header.type
        switch (type) {
            case 0:
                return (!window.isMobile?m(header):'')
            case 1:
                return this.customHeader()
            default:
                return null
        }
    },
    customHeader: function () {

    },

    //计算合约持仓资产相关数据
    setDisplayTrdInfo: function () {
        let s = window.gTrd

        let info = s.trdInfoStatus

        if (info.pos && info.ord && info.wlt && info.rs) {

            // 距上次获取风险限额的时间超过1小时则重新获取风险限额
            if(Date.now() - this.getRSLastTm >= 3600 * 1000){
                this.getRiskLimits()
            }


            let posObj = s.Poss
            let pos = []
            for (let key in posObj) {
                pos.push(posObj[key])
            }

            let wallet = s.Wlts['01']
            let order = s.Orders['01'] || []
            // 筛选出当前委托，不要计划委托
            let _order = order.filter(function(item){
                return item.OType == 1 || item.OType == 2
            })
            let RS = s.RS
            let assetD = window.gMkt.AssetD
            let lastTick = window.gMkt.lastTick
            let UPNLPrzActive = window.$config.future.UPNLPrzActive//'1'
            let MMType = window.$config.future.MMType//0;
            let PrzLiqType = window.$config.future.PrzLiqType//0

            let cb = function (arg) {
                gEVBUS.emit(window.gTrd.EV_POSABDWLTCALCOVER_UPD, { Ev: window.gTrd.EV_POSABDWLTCALCOVER_UPD, data: arg })
            }
            futureCalc.calcFutureWltAndPosAndMI(pos, wallet, _order, RS, assetD, lastTick, UPNLPrzActive, MMType, PrzLiqType, cb)

        }
    },
    //获取风险限额
    getRiskLimits: function () {
        let that = this
        let s = window.gTrd

        if (!s.RT["UserId"]) return
        // 筛选合约名称
        let assetD = window.gMkt.AssetD
        console.log('ReqTrdGetRiskLimits ==>> ', assetD)
        let SymArr = []
        for (let key in assetD) {
            let item = assetD[key]
            if (item.TrdCls == 2 || item.TrdCls == 3) {
                SymArr.push(key)
            }
        }
        if (SymArr.length > 0) {
            s.ReqTrdGetRiskLimits({
                "AId": s.RT["UserId"] + "01",
                "Sym": SymArr.join(',')
            }, function () {
                that.getRSLastTm = Date.now()
                that.setDisplayTrdInfo()
                gEVBUS.emit(gTrd.EV_GETRISKLIMITSOVER_UPD, {Ev: gTrd.EV_GETRISKLIMITSOVER_UPD})
            })
        }
    },
    onTick: function (param) {
        let tm = Date.now()
        if (tm - this.lastTmForTick > this.TICKCLACTNTERVAL) {
            this.setDisplayTrdInfo()
            this.lastTmForTick = tm
        }
    },
    //下单提示
    onOrderMsg: function(ret) {
        let stopErr = ret.Status == 4 && ret.QtyF == 0 && ret.Via == 15
        if (stopErr) {
            return
        }
        let _Status = ret.Status
        let _OType = ret.OType
        let _AId = ret.AId.substr(-2)
        let _Title = '',
            _Color = '';
        if (_OType == 1) {
            if (_Status == 1) {
                _Title = gDI18n.$t('10238'/*'委托已挂单！'*/);
                _Color = 'success';
            } else if (_Status == 2) {
                if (ret.QtyF != 0) {
                    _Title = gDI18n.$t('10239'/*'委托已成交！'*/);
                    _Color = 'success';
                } else {
                    _Title = gDI18n.$t('10238'/*'委托已挂单！'*/);
                    _Color = 'success';
                }
            } else if (_Status == 3) {
                if (ret.ErrCode) {
                    _Title = utils.getTradeErrorCode(ret.ErrCode)
                    _Color = 'danger';
                } else {
                    _Title = gDI18n.$t('10240'/*'委托提交失败！'*/);
                    _Color = 'danger';
                }
            } else if (_Status == 4) {
                if (ret.ErrCode) {
                    _Title = utils.getTradeErrorCode(ret.ErrCode)
                    _Color = 'danger';
                } else if (ret.QtyF != ret.Qty) {
                    _Title = gDI18n.$t('10241'/*'委托已撤销！'*/);
                    _Color = 'danger';
                } else {
                    _Title = gDI18n.$t('10242'/*'委托已全部成交'*/);
                    _Color = 'success';
                }
            }
        } else if (_OType == 3 || _OType == 4) {
            if (_AId == '01') {
                if (_Status == 1) {
                    _Title = gDI18n.$t('10243'/*'计划委托已提交！'*/);
                    _Color = 'success';
                } else if (_Status == 2) {
                    _Title = gDI18n.$t('10244'/*'计划委托已触发！'*/);
                    _Color = 'success';
                } else if (_Status == 3) {
                    if (ret.ErrCode) {
                        _Title = utils.getTradeErrorCode(ret.ErrCode)
                        _Color = 'danger';
                    } else {
                        _Title = gDI18n.$t('10245'/*'计划委托提交失败！'*/);
                        _Color = 'danger';
                    }
                } else if (_Status == 4) {
                    _Title = gDI18n.$t('10246'/*'计划委托已删除！'*/);
                    _Color = 'danger';
                }
            } else if (_AId == '02') {
                if (_Status == 1) {
                    _Title = gDI18n.$t('10247'/*'止盈止损已提交！'*/);
                    _Color = 'success';
                } else if (_Status == 2) {
                    _Title = gDI18n.$t('10248'/*'止盈止损已触发！'*/);
                    _Color = 'success';
                } else if (_Status == 3) {
                    if (ret.ErrCode) {
                        _Title = utils.getTradeErrorCode(ret.ErrCode)
                        _Color = 'danger';
                    } else {
                        _Title = gDI18n.$t('10249'/*'止盈止损提交失败！'*/);
                        _Color = 'danger';
                    }
                } else if (_Status == 4) {
                    _Title = gDI18n.$t('10250'/*'止盈止损已删除！'*/);
                    _Color = 'danger';
                }
            }
        } else if (_OType == 2) {
            if (_Status == 4) {
                if (ret.ErrCode) {
                    _Title = utils.getTradeErrorCode(ret.ErrCode)
                    _Color = 'danger';
                } else if (ret.Qty && ret.QtyF && ret.Qty == ret.QtyF) {
                    _Title = gDI18n.$t('10251'/*`委托全部成交`*/);
                    _Color = 'success';
                } else {
                    _Title = gDI18n.$t('10252'/*`委托已取消`*/);
                    _Color = 'danger';
                }
            } else if (ret.ErrCode) {
                _Title = utils.getTradeErrorCode(ret.ErrCode)
                _Color = 'danger'
            }
        } else {
            if (ret.ErrCode) {
                _Title = utils.getTradeErrorCode(ret.ErrCode)
                _Color = 'danger'
            }
        }
        if (!_Title && !_Color) return;
        window.$message({title: _Title,content:_Title, type: _Color})
    },
    // 模式3空白仓位删除计划，空白仓位是指：不是合约默认仓位、没有持仓、没有委托、没有计划单的仓位
    delNullPosPlan: function(){
        if(window.$config.future.tradeType == 3){
            this.delNullPosPlanTimer = setInterval(function(){
                let Poss = window.gTrd.Poss
                let needDelPos = []
                for(let key in Poss){
                    let item = Poss[key]
                    // 判断是否为默认仓位
                    if((item.Flg&1) == 0){
                        // 判断是否有持仓和委托
                        if(item.Sz == 0 && item.aQtyBuy == 0 && item.aQtySell == 0){
                            // 检查仓位是否有计划单
                            let Orders = window.gTrd.Orders['01']
                            let i = Orders.findIndex(function(ord){
                                return ord.PId == key
                            })
                            if(i == -1){
                                needDelPos.push(item)
                            }
                        }
                    }
                }
                // 一次只删除一条
                if(needDelPos.length > 0){
                    let delPos = needDelPos[0]
                    window.gTrd.ReqTrdPosOp({
                        "AId":delPos.AId,
                        "Sym": delPos.Sym,
                        "PId": delPos.PId,
                        "Op": 1, //删除
                      },function(gTrd, arg){})
                }
            }, 10 * 1000)
        }
    }
}
module.exports = {
    oninit: function (vnode) {
        console.log('oninit main')
        
    },
    oncreate: function (vnode) {
        main.initEVBUS()
        main.delNullPosPlan()

    },
    view: function (vnode) {

        return m("div", { class: "" }, [
            main.getHeader(),
            m('div.route-box'),
            main.getFooter(),
            m(message)
        ])
    },
    onremove: function () {
        main.rmEVBUS()
    }
}