const Stately = require('stately.js')
const API_TAG = 'WS'
const DBG_WSCALL = true

class Mkt {
    Conf = null;
    // websocket 
    ws = null;
    // 状态机
    stately = null;
    // 开始创建连接的时间戳
    openStart = 0;

    timeoutOpen = 5000;
    // 网络延迟
    netLag = 150;
    // 消息超时
    timeoutMsg = 5000;
    // 最近一次收到数据的时间戳
    lastRecvTm = 0;
    // 最近一次发送数据的时间戳
    lastSendTm = 0;
    //如果超过timeoutIdle,则会发送心跳
    timeoutIdle = 5000;
    // 如果超过15秒，就重连接
    timeoutClose = 15000;
    //请求指令编号
    rid = 0;
    //已发送，等待确认的消息体
    Reqs = {};

    // 限定接收到的数据
    NumDataLenMax = 100;
    // 限定接收的数据的量
    NumReqCountMax = 100;

    AssetD = {}

    AssetEx = {}

    displaySym = []

    constructor(arg){

        this.Conf = arg
        this.initStately(arg)
        
    }

    initStately(arg){
        this.stately = Stately.machine({
            'IDLE': {
                'do': (aObj)=>{
                    _console.log(API_TAG, 'IDLE', aObj, arg)

                    if(aObj.Conf && aObj.Conf.baseUrl){
                        return 'PRECONNECT'
                    }
                }
            },
            'PRECONNECT': {
                'do': (aObj)=>{
                    _console.log(API_TAG, 'PRECONNECT', aObj)
                    if(aObj.ws){
                        aObj.ws.close()
                    }

                    aObj.openStart = Date.now();
                    aObj.ws = new WebSocket(aObj.Conf.baseUrl)

                    if(!aObj.ws.onopen){
                        aObj.ws.onopen = (arg) => {
                            aObj.ws_onopen(aObj, arg)
                        }
                    }

                    if(!aObj.ws.onmessage){
                        aObj.ws.onmessage = (arg) => {
                            aObj.ws_onmessage(aObj, arg)
                        }
                    }
                    return 'CONNECTING'
                }
            },
            'CONNECTING': {
                'do': (aObj)=>{
                    _console.log(API_TAG, 'CONNECTING', aObj)
                    // return 'AUTHORIZING'
                    switch (aObj.ws.readyState) {
                        case WebSocket.CONNECTING:
                            if (Date.now() - aObj.openStart > aObj.timeoutOpen) {
                                return aObj.stately.PRECONNECT
                            }
                            break;
                        case WebSocket.OPEN:
                            aObj.lastRecvTm = Date.now()
                            aObj.lastSendTm = aObj.lastRecvTm


                            switch (aObj.Conf.Typ) {
                                case "mkt":
                                    // _console.log(API_TAG, 'mkt ws is open')
                                    // aObj.ReqTime(arg => {
                                    //     return aObj.stately.AUTHORIZING
                                    // })
                                    return 'AUTHORIZING'
                                    break;
                                case "trd": 
                                    
                                    break;
                            }
                        case WebSocket.CLOSING:
                            break;
                        case WebSocket.CLOSED:
                            return aObj.stately.PRECONNECT;
                    }
                }
            },
            'AUTHORIZING': {
                'do': (aObj)=>{
                    _console.log(API_TAG, 'AUTHORIZING', aObj)
                    switch (aObj.Conf.Typ) {
                        case "mkt":
                            _console.log(API_TAG, 'mkt ws is open')
                            aObj.ReqAssetD({vp: window.exchId})
                            return 'WORKING'
                        case "trd": 
                            
                            break;
                    }
                    // return 'WORKING'
                }
            },
            'WORKING': {
                'do': (aObj)=>{
                    _console.log(API_TAG, 'WORKING', aObj)

                    if (aObj.CheckAndSendHeartbeat(aObj)) {
                        return 'PRECONNECT';
                    }
                    // return 'IDLE'
                }
            }
        });
    }

    ws_onopen(aObj, evt){
        _console.log(API_TAG, 'ws_onopen', evt)
    }

    ws_onmessage(aObj, evt){
        _console.log(API_TAG, 'ws_onmessage', evt)
        let s = this
        aObj.lastRecvTm = Date.now();
        try {
            var msg = JSON.parse(evt.data);
        } catch (e) {
            return;
        }
        /* 这个是下线的指令？
        if (msg.subj === CMD_KICK) {
            self.onPush(msg.subj, msg.data);
            return;
        }
        */
        let d = msg
        let d_data = d.data

        switch (d.subj) {
            case "tick": {
                /**
                 {"subj":"tick","data":{"Sym":"BTC.USDT","At":1574523443124,"PrzBid1":7280.5,"SzBid1":134,"SzBid":4118258,"PrzAsk1":7281.5,"SzAsk1":3220,"SzAsk":4343293,"LastPrz":7281,"SettPrz":7279.7003499186,"Prz24":7129,"High24":7376.5,"Low24":7081,"Volume24":38848117,"Turnover24":1402379837.020001,"Volume":3345679193,"Turnover":0,"OpenInterest":870068,"FundingLongR":-0.0003143419,"FundingPredictedR":-0.0003143419,"SEQ":887726}}
                 **/
                // let sym = d_data.Sym
                // if (sym) {
                //     aObj.ticks[sym] = aObj.util_PushToHead(aObj.ticks[sym], d_data, aObj.NumDataLenMax)
                //     aObj.lastTick[sym] = d_data
                //     gEVBUS.emit(EV_TICK_UPD, {Ev: EV_TICK_UPD, Sym: sym, data: d_data})
                // }
                break;
            }
            case "index": {
                /**
                 {"subj":"tick","data":{"Sym":"BTC.USDT","At":1574523443124,"PrzBid1":7280.5,"SzBid1":134,"SzBid":4118258,"PrzAsk1":7281.5,"SzAsk1":3220,"SzAsk":4343293,"LastPrz":7281,"SettPrz":7279.7003499186,"Prz24":7129,"High24":7376.5,"Low24":7081,"Volume24":38848117,"Turnover24":1402379837.020001,"Volume":3345679193,"Turnover":0,"OpenInterest":870068,"FundingLongR":-0.0003143419,"FundingPredictedR":-0.0003143419,"SEQ":887726}}
                 **/
                // let sym = d_data.Sym
                // if (sym) {
                //     aObj.ticks[sym] = aObj.util_PushToHead(aObj.ticks[sym], d_data, aObj.NumDataLenMax)
                //     gEVBUS.emit(EV_INDEX_UPD, {Ev: EV_INDEX_UPD, Sym: sym, data: d_data})
                // }
                break;
            }
            case "kline": {
                /*
                {"subj":"kline","data":{"Sym":"BTC.USDT","Typ":"1m","Sec":1574523600,"PrzOpen":7257,"PrzClose":7257.5,"PrzHigh":7257.5,"PrzLow":7255.5,"Volume":2629,"Turnover":95390.5275}}
                */

                // let sym = d_data.Sym;
                // let typ = d_data.Typ;
                // let intervalInSec = aObj.Typ2Sec[typ];
                // if (sym) {
                //     let roundedInMS = Math.floor(d_data.Sec / intervalInSec) * intervalInSec * 1000;
                //     let converted = [{
                //         Ms: roundedInMS,
                //         Turnover: d_data.Turnover,
                //         //下面的数据采用TradingView格式
                //         time: roundedInMS,
                //         close: d_data.PrzClose,
                //         open: d_data.PrzOpen,
                //         high: d_data.PrzHigh,
                //         low: d_data.PrzLow,
                //         volume: d_data.Volume,
                //     }]
                    
                //     gEVBUS.emit(EV_KLINE_UPD, {Ev: EV_KLINE_UPD, Sym: d_data.Sym, Typ: d_data.Typ, data: converted[0]})


                // }
                break;
            }
            case "trade": {
                /*
                {"subj":"trade","data":{"Sym":"BTC.USDT","At":1574573589537,"Prz":7182.5,"Dir":-1,"Sz":87,"Val":-3124.3875,"MatchID":"01DTDYCFZV3DCMX20744BQF5WW"}}
                */
                // let sym = d_data.Sym
                // if (sym) {
                //     aObj.trades[sym] = aObj.util_PushToHead(aObj.trades[sym], d_data, aObj.NumDataLenMax)
                // }
                // gEVBUS.emit(EV_NEWTRADE_UPD, {Ev: EV_NEWTRADE_UPD, data: d_data})
                // if (ENABLE_TRADE_UPDATE_KLINE) {
                //     // 这里要发送事件了
                //     gEVBUS.emit(EV_REALTIME_UPD, {Ev: EV_REALTIME_UPD, data: d_data})
                // }
                break;
            }
            case "order20": {
                let sym = d_data.Sym
                /*
                {"subj":"order20","data":{"Sym":"BTC.USDT","At":1574605382624,"Asks":[[7147.5,2385],[7148,76],[7148.5,172],[7149,474],[7149.5,1137],[7150,41],[7150.5,2547],[7151,4032],[7151.5,824],[7152,15],[7152.5,18],[7153,586],[7153.5,4675],[7154,379],[7154.5,1185],[7155,1123],[7155.5,8030],[7156,426],[7156.5,308],[7157,127]],"Bids":[[7146.5,2718],[7146,6953],[7145.5,10616],[7145,1257],[7144.5,841],[7144,582],[7143.5,3989],[7143,1711],[7142.5,1136],[7142,831],[7141.5,1668],[7141,198],[7140.5,541],[7140,813],[7139.5,488],[7139,135],[7138.5,74],[7138,131],[7137.5,1591],[7137,427]],"SEQ":2616505}}
                */
                // let order20s = aObj.order20[sym];
                // if (!order20s) {
                //     order20s = [d_data, d_data]
                //     aObj.order20[sym] = order20s;
                // } else {
                //     order20s[1] = order20s[0]
                //     order20s[0] = d_data;
                // }
                
                // gEVBUS.emit(EV_ORDER20_UPD, {Ev: EV_ORDER20_UPD, Sym: sym, data: d_data})
                break;
            }

            case "onOrder": {   //报单通知
                // aObj.OrderUpdate(aObj,d_data)
                break;
            }
            case "onPosition": { //持仓通知
                // aObj.PosUpdate(aObj,d_data)
                break;
            }
            case "onWallet": {
                // aObj.WltUpdate(aObj,d_data)
                break;
            }
            case "onWltLog": {
                // aObj.WltLogUpdate(aObj,d_data)
                break;
            }
            case "onTrade": {
                // aObj.MyTradesReplace(aObj,{data:[d.data]},"01")

                break;
            }
        }

        var rid = msg.rid;
        if (aObj.Reqs) {
            var req = aObj.Reqs[rid];
            if (req) {
                if ((req.cb) && (typeof req.cb == "function")) {
                    req.cb(aObj, msg);
                }
                if (msg.subj) {

                    let evbus = window.gEVBUS
                    if (evbus) {
                        evbus.emit(msg.subj,msg.data)
                    }
                }
            }
            delete aObj.Reqs[rid];
        }
    }

    WSCall_Mkt(aCmd, aParam, aFunc) {
        let s = this
        if(DBG_WSCALL){_console.log(API_TAG, __filename,"WSCall_Mkt",aCmd,aParam)}
        let tm = Date.now();
        s.lastSendTm = tm;

        var msg = {
            req: aCmd,
            rid: String(++s.rid),
            args: aParam,
            expires: tm + s.netLag + s.timeoutMsg
        };
        let msgStr = JSON.stringify(msg)
        try {
            s.ws.send(msgStr);
        } catch (e) {

        }
        msg.cb = aFunc
        s.Reqs[msg.rid] = msg;
    }

    ReqTime(aFunc){
        let s = this
        let now = Date.now()
        s.WSCall_Mkt("Time", now, (aObj ,arg) => {
            _console.log(API_TAG, 'Time', arg)
            aObj.netLag = arg.data.time - Date.now();
            aObj.lastRecvTm = Date.now()
            aFunc && aFunc()
        })
    }

    ReqAssetD(aArg) {
        let s = this
        s.WSCall_Mkt("GetAssetD",aArg,function(aMkt, aRaw) {
            /*
            {"rid":"1","code":0,"data":[
            {"Sym":"EOS.USDT","Expire":253402185600000,"PrzMaxChg":1000,"PrzMinInc":0.001,"PrzMax":100000000,"OrderMaxQty":20000,"LotSz":5,"PrzM":2.54801185548,"MIR":0.04,"MMR":0.02,"OrderMinVal":0.0001,"PrzLatest":2.547,"TotalVol":838130240,"OpenInterest":21288,"PrzIndex":2.54797,"FeeMkrR":0.0002,"FeeTkrR":0.00025,"Mult":1,"FromC":"USDT","ToC":"EOS","TrdCls":3,"MkSt":1,"SettleCoin":"USDT","QuoteCoin":"USDT","SettleR":0.002,"DenyOpenAfter":253402185600000,"OrderMinQty":0,"FundingLongR":0.0001010892,"FundingInterval":28800000,"FundingNext":1574611200000,"FundingPredictedR":0.0001010892,"FundingTolerance":0.00025,"FundingFeeR":0.1,"Lbl":"main"},
            {"Sym":"LTC.USDT","Expire":253402185600000,"PrzMaxChg":1000,"PrzMinInc":0.01,"PrzMax":100000000,"OrderMaxQty":20000,"LotSz":0.5,"PrzM":45.80077698824,"MIR":0.04,"MMR":0.02,"OrderMinVal":0.0001,"PrzLatest":45.8,"TotalVol":548694542,"OpenInterest":163602,"PrzIndex":45.8,"FeeMkrR":0.0002,"FeeTkrR":0.00025,"Mult":1,"FromC":"USDT","ToC":"LTC","TrdCls":3,"MkSt":1,"SettleCoin":"USDT","QuoteCoin":"USDT","SettleR":0.002,"DenyOpenAfter":253402185600000,"OrderMinQty":0,"FundingLongR":0.0001043988,"FundingInterval":28800000,"FundingNext":1574611200000,"FundingPredictedR":0.0001043988,"FundingTolerance":0.00025,"FundingFeeR":0.1,"Lbl":"main"},
            */
            let d = aRaw.data;
            s.displaySym = []
            for(let i = 0; i< d.length; i++){
                s.displaySym.push(d[i].Sym)
                s.AssetD[d[i].Sym] = d[i]
            }

        });
        s.WSCall_Mkt("GetAssetEx",aArg,function(aMkt, aRaw) {
            /*
            {"rid":"1","code":0,"data":[
            {"Sym":"EOS.USDT","Expire":253402185600000,"PrzMaxChg":1000,"PrzMinInc":0.001,"PrzMax":100000000,"OrderMaxQty":20000,"LotSz":5,"PrzM":2.54801185548,"MIR":0.04,"MMR":0.02,"OrderMinVal":0.0001,"PrzLatest":2.547,"TotalVol":838130240,"OpenInterest":21288,"PrzIndex":2.54797,"FeeMkrR":0.0002,"FeeTkrR":0.00025,"Mult":1,"FromC":"USDT","ToC":"EOS","TrdCls":3,"MkSt":1,"SettleCoin":"USDT","QuoteCoin":"USDT","SettleR":0.002,"DenyOpenAfter":253402185600000,"OrderMinQty":0,"FundingLongR":0.0001010892,"FundingInterval":28800000,"FundingNext":1574611200000,"FundingPredictedR":0.0001010892,"FundingTolerance":0.00025,"FundingFeeR":0.1,"Lbl":"main"},
            {"Sym":"LTC.USDT","Expire":253402185600000,"PrzMaxChg":1000,"PrzMinInc":0.01,"PrzMax":100000000,"OrderMaxQty":20000,"LotSz":0.5,"PrzM":45.80077698824,"MIR":0.04,"MMR":0.02,"OrderMinVal":0.0001,"PrzLatest":45.8,"TotalVol":548694542,"OpenInterest":163602,"PrzIndex":45.8,"FeeMkrR":0.0002,"FeeTkrR":0.00025,"Mult":1,"FromC":"USDT","ToC":"LTC","TrdCls":3,"MkSt":1,"SettleCoin":"USDT","QuoteCoin":"USDT","SettleR":0.002,"DenyOpenAfter":253402185600000,"OrderMinQty":0,"FundingLongR":0.0001043988,"FundingInterval":28800000,"FundingNext":1574611200000,"FundingPredictedR":0.0001043988,"FundingTolerance":0.00025,"FundingFeeR":0.1,"Lbl":"main"},
            */
            let d = aRaw.data;
            for(let i = 0; i< d.length; i++){
                s.AssetEx[d[i].Sym] = d[i]
            }
            // gEVBUS.EmitDeDuplicate(EV_ASSETD_UPD,50,EV_ASSETD_UPD, {Ev: EV_ASSETD_UPD})
        })
        
    }

    CheckAndSendHeartbeat(aObj) {
        let now = Date.now()
        let diff = now -  aObj.lastRecvTm
        if (diff > aObj.timeoutClose) {
            return true;
        } else if (now -  aObj.lastRecvTm>aObj.timeoutIdle) {
            if (now - aObj.lastSendTm > aObj.timeoutMsg) {
                aObj.ReqTime()
            }
        }
        return false;
    }
}

module.exports = Mkt