const Stately = require('stately.js');
const API_TAG = 'WS';
const DBG_WSCALL = true;
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
    // 如果超过timeoutIdle,则会发送心跳
    timeoutIdle = 5000;
    // 如果超过15秒，就重连接
    timeoutClose = 15000;
    // 请求指令编号
    rid = 0;
    // 已发送，等待确认的消息体
    Reqs = {};
    // 限定接收到的数据
    NumDataLenMax = 100;
    // 限定接收的数据的量
    NumReqCountMax = 100;
    TickType = "__fast__"; // 行情模式，"__fast__":正常模式；"__slow__"：慢速模式；
    booking = {
        // "sub1": {want:true,done:false},
    };

    // 合约详情
    AssetD = {}
    // 合约详情补充参数
    AssetEx = {}
    displaySym = []
    // 合约最新行情
    lastTick = {}
    // 成交行情
    trades = []
    constructor(arg) {
        this.Conf = arg;
        this.initStately(arg);
    }

    initStately(arg) {
        this.stately = Stately.machine({
            IDLE: {
                do: (aObj) => {
                    window._console.log(API_TAG, 'IDLE', aObj, arg);

                    if (aObj.Conf && aObj.Conf.baseUrl) {
                        return 'PRECONNECT';
                    }
                }
            },
            PRECONNECT: {
                do: (aObj) => {
                    window._console.log(API_TAG, 'PRECONNECT', aObj);

                    // 清理订阅状态
                    for (var propName in aObj.booking) {
                        aObj.booking[propName].done = false;
                    }

                    if (aObj.ws) {
                        aObj.ws.close();
                    }

                    aObj.openStart = Date.now();
                    aObj.ws = new WebSocket(aObj.Conf.baseUrl);

                    if (!aObj.ws.onopen) {
                        aObj.ws.onopen = (arg) => {
                            aObj.ws_onopen(aObj, arg);
                        };
                    }

                    if (!aObj.ws.onmessage) {
                        aObj.ws.onmessage = (arg) => {
                            aObj.ws_onmessage(aObj, arg);
                        };
                    }
                    return 'CONNECTING';
                }
            },
            CONNECTING: {
                do: (aObj) => {
                    window._console.log(API_TAG, 'CONNECTING', aObj);
                    // return 'AUTHORIZING'
                    switch (aObj.ws.readyState) {
                    case WebSocket.CONNECTING:
                        if (Date.now() - aObj.openStart > aObj.timeoutOpen) {
                            return aObj.stately.PRECONNECT;
                        }
                        break;
                    case WebSocket.OPEN:
                        aObj.lastRecvTm = Date.now();
                        aObj.lastSendTm = aObj.lastRecvTm;

                        switch (aObj.Conf.Typ) {
                        case "mkt":
                            // window._console.log(API_TAG, 'mkt ws is open')
                            // aObj.ReqTime(arg => {
                            //     return aObj.stately.AUTHORIZING
                            // })
                            return 'AUTHORIZING';
                        case "trd":

                            break;
                        }
                        break;
                    case WebSocket.CLOSING:
                        break;
                    case WebSocket.CLOSED:
                        return aObj.stately.PRECONNECT;
                    }
                }
            },
            AUTHORIZING: {
                do: (aObj) => {
                    window._console.log(API_TAG, 'AUTHORIZING', aObj);
                    switch (aObj.Conf.Typ) {
                    case "mkt":
                        window._console.log(API_TAG, 'mkt ws is open');
                        aObj.ReqAssetD({ vp: window.exchId });
                        return 'WORKING';
                    case "trd":

                        break;
                    }
                    // return 'WORKING'
                }
            },
            WORKING: {
                do: (aObj) => {
                    window._console.log(API_TAG, 'WORKING', aObj);

                    if (aObj.CheckAndSendHeartbeat(aObj)) {
                        return 'PRECONNECT';
                    }

                    let books;
                    let unbooks;
                    let toberemove;
                    for (var propName in aObj.booking) {
                        const book = aObj.booking[propName];
                        if (book.want) {
                            if (!book.done) {
                                book.done = true;
                                if (!books) {
                                    books = [];
                                }
                                books.push(propName);
                            }
                        } else {
                            if (!book.done) {
                                book.done = true;
                                if (!unbooks) {
                                    unbooks = [];
                                }
                                unbooks.push(propName);
                                if (!toberemove) {
                                    toberemove = [];
                                }
                                toberemove.push(propName);
                            }
                        }
                    }
                    if (books && (books.length > 0)) {
                        aObj.ReqSub(books);
                    }
                    if (unbooks && unbooks.length > 0) {
                        aObj.ReqUnSub(unbooks);
                    }
                    if (toberemove) {
                        for (let i = toberemove.length - 1; i >= 0; i--) {
                            delete aObj.booking[toberemove[i]];
                        }
                    }
                }
            }
        });
    }

    wsOnOpen(aObj, evt) {
        window._console.log(API_TAG, 'ws_onopen', evt);
    }

    wsOnMessage(aObj, evt) {
        window._console.log(API_TAG, 'ws_onmessage', evt);
        // const s = this;
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
        const d = msg;
        // const d_data = d.data;

        switch (d.subj) {
        case "tick": {
            /**
                 {"subj":"tick","data":{"Sym":"BTC.USDT","At":1574523443124,"PrzBid1":7280.5,"SzBid1":134,"SzBid":4118258,"PrzAsk1":7281.5,"SzAsk1":3220,"SzAsk":4343293,"LastPrz":7281,"SettPrz":7279.7003499186,"Prz24":7129,"High24":7376.5,"Low24":7081,"Volume24":38848117,"Turnover24":1402379837.020001,"Volume":3345679193,"Turnover":0,"OpenInterest":870068,"FundingLongR":-0.0003143419,"FundingPredictedR":-0.0003143419,"SEQ":887726}}
                 **/
            const sym = d.data.Sym;
            if (sym) {
                aObj.lastTick[sym] = d.data;
                window.gBroadcast.emit({ cmd: window.gBroadcast.MSG_TICK_UPD, data: { Ev: window.gBroadcast.MSG_TICK_UPD, Sym: sym, data: d.data } });
            }
            break;
        }
        case "index": {
            /**
                 {"subj":"tick","data":{"Sym":"BTC.USDT","At":1574523443124,"PrzBid1":7280.5,"SzBid1":134,"SzBid":4118258,"PrzAsk1":7281.5,"SzAsk1":3220,"SzAsk":4343293,"LastPrz":7281,"SettPrz":7279.7003499186,"Prz24":7129,"High24":7376.5,"Low24":7081,"Volume24":38848117,"Turnover24":1402379837.020001,"Volume":3345679193,"Turnover":0,"OpenInterest":870068,"FundingLongR":-0.0003143419,"FundingPredictedR":-0.0003143419,"SEQ":887726}}
                 **/
            const sym = d.data.Sym;
            if (sym) {
                aObj.lastTick[sym] = d.data;
                window.gBroadcast.emit({ cmd: window.gBroadcast.MSG_INDEX_UPD, data: { Ev: window.gBroadcast.MSG_INDEX_UPD, Sym: sym, data: d.data } });
            }
            break;
        }
        case "kline": {
            /*
                {"subj":"kline","data":{"Sym":"BTC.USDT","Typ":"1m","Sec":1574523600,"PrzOpen":7257,"PrzClose":7257.5,"PrzHigh":7257.5,"PrzLow":7255.5,"Volume":2629,"Turnover":95390.5275}}
                */

            const sym = d.data.Sym;
            const typ = d.data.Typ;
            if (sym) {
                window.gBroadcast.emit({ cmd: window.gBroadcast.MSG_KLINE_UPD, data: { Ev: window.gBroadcast.MSG_KLINE_UPD, Sym: sym, Typ: typ, data: d.data } });
            }
            break;
        }
        case "trade": {
            /*
                {"subj":"trade","data":{"Sym":"BTC.USDT","At":1574573589537,"Prz":7182.5,"Dir":-1,"Sz":87,"Val":-3124.3875,"MatchID":"01DTDYCFZV3DCMX20744BQF5WW"}}
                */
            const sym = d.data.Sym;
            if (sym) {
                aObj.trades[sym] = aObj.utilPushToHead(aObj.trades[sym], d.data, aObj.NumDataLenMax);
                window.gBroadcast.emit({ cmd: window.gBroadcast.MSG_TRADE_UPD, data: { Ev: window.gBroadcast.MSG_TRADE_UPD, Sym: sym, data: d.data } });
            }
            break;
        }
        case "order20": {
            /*
                {"subj":"order20","data":{"Sym":"BTC.USDT","At":1574605382624,"Asks":[[7147.5,2385],[7148,76],[7148.5,172],[7149,474],[7149.5,1137],[7150,41],[7150.5,2547],[7151,4032],[7151.5,824],[7152,15],[7152.5,18],[7153,586],[7153.5,4675],[7154,379],[7154.5,1185],[7155,1123],[7155.5,8030],[7156,426],[7156.5,308],[7157,127]],"Bids":[[7146.5,2718],[7146,6953],[7145.5,10616],[7145,1257],[7144.5,841],[7144,582],[7143.5,3989],[7143,1711],[7142.5,1136],[7142,831],[7141.5,1668],[7141,198],[7140.5,541],[7140,813],[7139.5,488],[7139,135],[7138.5,74],[7138,131],[7137.5,1591],[7137,427]],"SEQ":2616505}}
                */
            const sym = d.data.Sym;
            if (sym) {
                aObj.order20[sym] = d.data;
                window.gBroadcast.emit({ cmd: window.gBroadcast.MSG_ORDER20_UPD, data: { Ev: window.gBroadcast.MSG_ORDER20_UPD, Sym: sym, data: d.data } });
            }
            break;
        }

        case "onOrder": { // 报单通知
            // aObj.OrderUpdate(aObj,d.data)
            break;
        }
        case "onPosition": { // 持仓通知
            // aObj.PosUpdate(aObj,d.data)
            break;
        }
        case "onWallet": {
            // aObj.WltUpdate(aObj,d.data)
            break;
        }
        case "onWltLog": {
            // aObj.WltLogUpdate(aObj,d.data)
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
                if ((req.cb) && (typeof req.cb === "function")) {
                    req.cb(aObj, msg);
                }
            }
            delete aObj.Reqs[rid];
        }
    }

    WSCallMkt(aCmd, aParam, aFunc) {
        const s = this;
        if (DBG_WSCALL) { window._console.log(API_TAG, __filename, "WSCallMkt", aCmd, aParam); }
        const tm = Date.now();
        s.lastSendTm = tm;

        var msg = {
            req: aCmd,
            rid: String(++s.rid),
            args: aParam,
            expires: tm + s.netLag + s.timeoutMsg
        };
        const msgStr = JSON.stringify(msg);
        try {
            s.ws.send(msgStr);
        } catch (e) {
            window._console(API_TAG, e);
        }
        msg.cb = aFunc;
        s.Reqs[msg.rid] = msg;
    }

    ReqTime(aFunc) {
        const s = this;
        const now = Date.now();
        s.WSCallMkt("Time", now, (aObj, arg) => {
            window._console.log(API_TAG, 'Time', arg);
            aObj.netLag = arg.data.time - Date.now();
            aObj.lastRecvTm = Date.now();
            aFunc && aFunc();
        });
    }

    // 获取合约详情
    ReqAssetD(aArg) {
        const s = this;
        s.WSCallMkt("GetAssetD", aArg, function (aMkt, aRaw) {
            /*
            {"rid":"1","code":0,"data":[
            {"Sym":"EOS.USDT","Expire":253402185600000,"PrzMaxChg":1000,"PrzMinInc":0.001,"PrzMax":100000000,"OrderMaxQty":20000,"LotSz":5,"PrzM":2.54801185548,"MIR":0.04,"MMR":0.02,"OrderMinVal":0.0001,"PrzLatest":2.547,"TotalVol":838130240,"OpenInterest":21288,"PrzIndex":2.54797,"FeeMkrR":0.0002,"FeeTkrR":0.00025,"Mult":1,"FromC":"USDT","ToC":"EOS","TrdCls":3,"MkSt":1,"SettleCoin":"USDT","QuoteCoin":"USDT","SettleR":0.002,"DenyOpenAfter":253402185600000,"OrderMinQty":0,"FundingLongR":0.0001010892,"FundingInterval":28800000,"FundingNext":1574611200000,"FundingPredictedR":0.0001010892,"FundingTolerance":0.00025,"FundingFeeR":0.1,"Lbl":"main"},
            {"Sym":"LTC.USDT","Expire":253402185600000,"PrzMaxChg":1000,"PrzMinInc":0.01,"PrzMax":100000000,"OrderMaxQty":20000,"LotSz":0.5,"PrzM":45.80077698824,"MIR":0.04,"MMR":0.02,"OrderMinVal":0.0001,"PrzLatest":45.8,"TotalVol":548694542,"OpenInterest":163602,"PrzIndex":45.8,"FeeMkrR":0.0002,"FeeTkrR":0.00025,"Mult":1,"FromC":"USDT","ToC":"LTC","TrdCls":3,"MkSt":1,"SettleCoin":"USDT","QuoteCoin":"USDT","SettleR":0.002,"DenyOpenAfter":253402185600000,"OrderMinQty":0,"FundingLongR":0.0001043988,"FundingInterval":28800000,"FundingNext":1574611200000,"FundingPredictedR":0.0001043988,"FundingTolerance":0.00025,"FundingFeeR":0.1,"Lbl":"main"},
            */
            const d = aRaw.data;
            s.displaySym = [];
            for (let i = 0; i < d.length; i++) {
                s.displaySym.push(d[i].Sym);
                s.AssetD[d[i].Sym] = d[i];
            }
            window.gBroadcast.emit({ cmd: window.gBroadcast.MSG_ASSETD_UPD, data: { Ev: window.gBroadcast.MSG_ASSETD_UPD, data: d } });
        });
        s.WSCallMkt("GetAssetEx", aArg, function (aMkt, aRaw) {
            /*
            {"rid":"1","code":0,"data":[
            {"Sym":"EOS.USDT","Expire":253402185600000,"PrzMaxChg":1000,"PrzMinInc":0.001,"PrzMax":100000000,"OrderMaxQty":20000,"LotSz":5,"PrzM":2.54801185548,"MIR":0.04,"MMR":0.02,"OrderMinVal":0.0001,"PrzLatest":2.547,"TotalVol":838130240,"OpenInterest":21288,"PrzIndex":2.54797,"FeeMkrR":0.0002,"FeeTkrR":0.00025,"Mult":1,"FromC":"USDT","ToC":"EOS","TrdCls":3,"MkSt":1,"SettleCoin":"USDT","QuoteCoin":"USDT","SettleR":0.002,"DenyOpenAfter":253402185600000,"OrderMinQty":0,"FundingLongR":0.0001010892,"FundingInterval":28800000,"FundingNext":1574611200000,"FundingPredictedR":0.0001010892,"FundingTolerance":0.00025,"FundingFeeR":0.1,"Lbl":"main"},
            {"Sym":"LTC.USDT","Expire":253402185600000,"PrzMaxChg":1000,"PrzMinInc":0.01,"PrzMax":100000000,"OrderMaxQty":20000,"LotSz":0.5,"PrzM":45.80077698824,"MIR":0.04,"MMR":0.02,"OrderMinVal":0.0001,"PrzLatest":45.8,"TotalVol":548694542,"OpenInterest":163602,"PrzIndex":45.8,"FeeMkrR":0.0002,"FeeTkrR":0.00025,"Mult":1,"FromC":"USDT","ToC":"LTC","TrdCls":3,"MkSt":1,"SettleCoin":"USDT","QuoteCoin":"USDT","SettleR":0.002,"DenyOpenAfter":253402185600000,"OrderMinQty":0,"FundingLongR":0.0001043988,"FundingInterval":28800000,"FundingNext":1574611200000,"FundingPredictedR":0.0001043988,"FundingTolerance":0.00025,"FundingFeeR":0.1,"Lbl":"main"},
            */
            const d = aRaw.data;
            for (let i = 0; i < d.length; i++) {
                s.AssetEx[d[i].Sym] = d[i];
            }
            window.gBroadcast.emit({ cmd: window.gBroadcast.MSG_ASSETEX_UPD, data: { Ev: window.gBroadcast.MSG_ASSETEX_UPD, data: d } });
        });
    }

    // 行情订阅
    ReqSub(aTpcArray) {
        const s = this;

        // const needSub = [];
        // aTpcArray.map(item => {
        //     if(!s.subList.includes(item)){
        //         s.subList.push(item)
        //         needSub.push(item)
        //     }
        // })
        if (!aTpcArray || aTpcArray.length === 0) {
            return;
        }
        aTpcArray.push(s.TickType);
        s.WSCallMkt("Sub", aTpcArray);
    }

    // 取消订阅
    ReqUnSub(aTpcArray) {
        const s = this;
        // aTpcArray.map(item => {
        //     let i = s.subList.findIndex(it =>{
        //         return it == item
        //     })
        //     if(i > -1){
        //         s.subList.splice(i, 1)
        //     }
        // })
        if (!aTpcArray || aTpcArray.length === 0) {
            return;
        }
        s.WSCallMkt("UnSub", aTpcArray);
    }

    // 添加需要请阅的内容
    TpcAdd(aTpc) {
        const s = this;
        if (s.booking) {
            if (aTpc in s.booking) {
                const book = s.booking[aTpc];
                if (!book.want) {
                    book.want = true;
                    book.done = false;
                }
            } else {
                s.booking[aTpc] = {
                    want: true,
                    done: false
                };
            }
        }
    }

    // 删除已订阅的内容
    TpcDel(aTpc) {
        const s = this;
        if (s.booking) {
            if (aTpc in s.booking) {
                const book = s.booking[aTpc];
                if (book) {
                    if (book.want) {
                        book.want = false;
                        book.done = false;
                    }
                }
            }
        }
    }

    CheckAndSendHeartbeat(aObj) {
        const now = Date.now();
        const diff = now - aObj.lastRecvTm;
        if (diff > aObj.timeoutClose) {
            return true;
        } else if (now - aObj.lastRecvTm > aObj.timeoutIdle) {
            if (now - aObj.lastSendTm > aObj.timeoutMsg) {
                aObj.ReqTime();
            }
        }
        return false;
    }

    utilPushToHead(aArray, aElement, aMaxLen) {
        if (!aArray) {
            aArray = [aElement];
        } else {
            aArray = [aElement].concat(aArray);
        }
        if (aMaxLen) {
            aArray = aArray.slice(0, aMaxLen);
        }
        return aArray;
    }
}
module.exports = Mkt;