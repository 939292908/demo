const Stately = require('stately.js');
const API_TAG = 'WS';
const DBG_WSCALL = true;
const broadcast = require('@/broadcast/broadcast');
const md5 = require('md5');
class Mkt {
    Conf = null;
    RT = {
        Authrized: this.AUTH_ST_NO
    };

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

    AUTH_ST_NO = 0;
    AUTH_ST_WT = 1; // 等待
    AUTH_ST_OK = 2; // OK

    // 合约详情
    AssetD = {}
    // 合约详情补充参数
    AssetEx = {}
    displaySym = []
    // 合约最新行情
    lastTick = {}
    // 成交行情
    trades = []

    OrdStatus = {
        // 正在排队
        Queueing: 1,
        // 有效
        Matching: 2,
        // 提交失败
        PostFail: 3,
        // 已执行
        Executed: 4,

        Status_5: 5,
        Status_6: 6
    };

    Wlts = {
        "01": [],
        "02": [],
        "03": []
    }

    Poss = {}

    Orders = {
        "01": [],
        "02": []
    }

    HistoryOrders = {
        "01": [],
        "02": []
    }

    MyTrades = {
        "01": [],
        "02": []
    }

    MyTradesObj = {
        "01": {},
        "02": {}
    }

    WltLog = {
        "01": [],
        "02": []
    }

    RS = {}

    trdInfoStatus = {
        pos: 0,
        ord: 0,
        wlt: 0,
        rs: 0,
        historyOrd: {
            '01': 0,
            '02': 0
        },
        trade: {
            '01': 0,
            '02': 0
        },
        wltLog: {
            '01': 0,
            '02': 0
        }
    }

    constructor(arg) {
        this.Conf = arg;
        this.initStately(arg);
    }

    initStately(arg) {
        this.stately = Stately.machine({
            IDLE: {
                do: (aObj) => {
                    if (aObj.Conf && aObj.Conf.baseUrl) {
                        return 'PRECONNECT';
                    }
                }
            },
            PRECONNECT: {
                do: (aObj) => {
                    if (!aObj.Conf) {
                        return 'IDLE';
                    }
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
                            aObj.wsOnOpen(aObj, arg);
                        };
                    }

                    if (!aObj.ws.onmessage) {
                        aObj.ws.onmessage = (arg) => {
                            aObj.wsOnMessage(aObj, arg);
                        };
                    }
                    return 'CONNECTING';
                }
            },
            CONNECTING: {
                do: (aObj) => {
                    switch (aObj.ws.readyState) {
                    case WebSocket.CONNECTING:
                        if (Date.now() - aObj.openStart > aObj.timeoutOpen) {
                            return 'PRECONNECT';
                        }
                        break;
                    case WebSocket.OPEN:
                        aObj.lastRecvTm = Date.now();
                        aObj.lastSendTm = aObj.lastRecvTm;

                        switch (aObj.Conf.Typ) {
                        case "mkt":
                            return 'AUTHORIZING';
                        case "trd":
                            /*

                            如果 使用用户名获取的token
                            则:
                            ReqTrdLogin()
                            let userData = {
                                UserName: store.state.account.email ? store.state.account.email : store.state.account.phone,
                                AuthType: 2,
                                UserCred: store.state.account.token,
                            }
                            也就是获取到Token后，应该修改 Trd 的 Conf

                            */
                            aObj.RT.Authrized = aObj.AUTH_ST_WT;
                            // 登录交易前先校对时间
                            aObj.ReqTime(arg => {
                                aObj.ReqTrdLogin({ // 服务端所需的参数
                                    UserName: aObj.Conf.UserName,
                                    UserSecr: aObj.Conf.UserSecr, // 如果有API Key
                                    UserCred: aObj.Conf.UserCred, // token ,或者 UserCred
                                    AuthType: aObj.Conf.AuthType ? aObj.Conf.AuthType : 0
                                }, function (aObj, aRaw) {
                                    /*
                                    {
                                    "rid":"0",
                                    "code":0,
                                    "data":{
                                        "UserName":"gmex-test@gmail.com",
                                        "UserId":"1234567"
                                        }
                                    }
                                    */
                                    const d = aRaw.data;
                                    console.log("ReqTrdLogin", aRaw);
                                    switch (aRaw.code) {
                                    case 0:

                                        aObj.RT.Authrized = aObj.AUTH_ST_OK;
                                        for (const prop in d) {
                                            aObj.RT[prop] = d[prop];
                                        }
                                        // aObj.CtxPlaying.UId = aObj.RT.UserId;

                                        break;
                                    default:
                                        aObj.RT.Authrized = aObj.AUTH_ST_NO;
                                        break;
                                    }
                                });
                            });
                            return 'AUTHORIZING';
                        }
                        break;
                    case WebSocket.CLOSING:
                        break;
                    case WebSocket.CLOSED:
                        return 'PRECONNECT';
                    }
                }
            },
            AUTHORIZING: {
                do: (aObj) => {
                    if (!aObj.Conf) {
                        return 'IDLE';
                    }
                    switch (aObj.Conf.Typ) {
                    case "mkt":
                        aObj.ReqAssetD({ vp: aObj.Conf.vp });
                        return 'WORKING';
                    case "trd":
                        switch (aObj.RT.Authrized) {
                        case aObj.AUTH_ST_NO:
                            return 'PRECONNECT';
                        case aObj.AUTH_ST_WT:
                            break;
                        case aObj.AUTH_ST_OK:
                        {
                            // 订阅仓位等。
                            // 合约
                            aObj.ReqTrdGetWallets({
                                AId: aObj.RT.UserId + "01"
                            }, function (aTrd, aRaw) {
                                aObj.WltsReplace(aTrd, aRaw, "01");
                            });
                            aObj.ReqTrdGetOrders({
                                AId: aObj.RT.UserId + "01"
                            }, function (aTrd, aRaw) {
                                aObj.OrdersReplace(aTrd, aRaw, "01");
                            });

                            aObj.ReqTrdGetPositions({
                                AId: aObj.RT.UserId + "01"
                            }, function (aTrd, aRaw) {
                                console.log("ReqTrdGetPositions 03", aRaw);
                                aObj.PossReplace(aTrd, aRaw);
                            });
                            // 现货
                            aObj.ReqTrdGetWallets({
                                AId: aObj.RT.UserId + "02"
                            }, function (aTrd, aRaw) {
                                aObj.WltsReplace(aTrd, aRaw, "02");
                            });

                            return 'WORKING';
                        }
                        }
                    }
                }
            },
            WORKING: {
                do: (aObj) => {
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
        console.log(API_TAG, 'wsOnOpen', evt);
    }

    wsOnMessage(aObj, evt) {
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

        switch (d.subj) {
        case "tick": {
            /**
             {"subj":"tick","data":{"Sym":"BTC.USDT","At":1574523443124,"PrzBid1":7280.5,"SzBid1":134,"SzBid":4118258,"PrzAsk1":7281.5,"SzAsk1":3220,"SzAsk":4343293,"LastPrz":7281,"SettPrz":7279.7003499186,"Prz24":7129,"High24":7376.5,"Low24":7081,"Volume24":38848117,"Turnover24":1402379837.020001,"Volume":3345679193,"Turnover":0,"OpenInterest":870068,"FundingLongR":-0.0003143419,"FundingPredictedR":-0.0003143419,"SEQ":887726}}
             **/
            const sym = d.data.Sym;
            if (sym) {
                aObj.lastTick[sym] = d.data;
                broadcast.emit({ cmd: broadcast.MSG_TICK_UPD, data: { Ev: broadcast.MSG_TICK_UPD, Sym: sym, data: d.data } });
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
                broadcast.emit({ cmd: broadcast.MSG_INDEX_UPD, data: { Ev: broadcast.MSG_INDEX_UPD, Sym: sym, data: d.data } });
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
                broadcast.emit({ cmd: broadcast.MSG_KLINE_UPD, data: { Ev: broadcast.MSG_KLINE_UPD, Sym: sym, Typ: typ, data: d.data } });
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
                broadcast.emit({ cmd: broadcast.MSG_TRADE_UPD, data: { Ev: broadcast.MSG_TRADE_UPD, Sym: sym, data: d.data } });
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
                broadcast.emit({ cmd: broadcast.MSG_ORDER20_UPD, data: { Ev: broadcast.MSG_ORDER20_UPD, Sym: sym, data: d.data } });
            }
            break;
        }

        case "onOrder": { // 报单通知
            aObj.OrderUpdate(aObj, d.data);
            break;
        }
        case "onPosition": { // 持仓通知
            aObj.PosUpdate(aObj, d.data);
            break;
        }
        case "onWallet": {
            aObj.WltUpdate(aObj, d.data);
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
        if (DBG_WSCALL) { /** console.log(API_TAG, __filename, "WSCallMkt", aCmd, aParam); */ }
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
            console(API_TAG, e);
        }
        msg.cb = aFunc;
        s.Reqs[msg.rid] = msg;
    }

    ReqTime(aFunc) {
        const s = this;
        const now = Date.now();
        s.WSCallMkt("Time", now, (aObj, arg) => {
            // console.log(API_TAG, 'Time', arg);
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
            broadcast.emit({ cmd: broadcast.MSG_ASSETD_UPD, data: { Ev: broadcast.MSG_ASSETD_UPD, data: d } });
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
            broadcast.emit({ cmd: broadcast.MSG_ASSETEX_UPD, data: { Ev: broadcast.MSG_ASSETEX_UPD, data: d } });
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

    // 设置地址
    setSocketUrl(url) {
        const s = this;
        if (!s.Conf) {
            return;
        }
        s.Conf.baseUrl = url;
        s.close();
    }

    close() {
        const s = this;
        if (s.ws) {
            s.ws.close();
            s.clearConf();
        }
    }

    clearConf() {
        this.RT = {
            Authrized: this.AUTH_ST_NO
        };
    }

    WSCallTrade (aCmd, aParam, aFunc) {
        const s = this;
        if (DBG_WSCALL) { console.log(__filename, "WSCallTrade", aCmd, aParam); }
        const tm = Date.now();
        s.lastSendTm = tm;

        const msg = {
            req: aCmd,
            rid: String(++s.rid),
            args: aParam,
            expires: tm + s.netLag + s.timeoutMsg
        };
        if (aParam) {
            msg.args = aParam;
        }
        const texts = [
            msg.req,
            msg.rid,
            aParam ? JSON.stringify(msg.args) : "",
            String(msg.expires),
            s.Conf.SecretKey
        ];
        const textjoined = texts.join("");
        const signature = md5(textjoined);
        msg.signature = signature;
        const msgStr = JSON.stringify(msg);
        try {
            s.ws.send(msgStr);
        } catch (e) {
            console.log(e);
        }
        msg.cb = aFunc;
        s.Reqs[msg.rid] = msg;
    }

    ReqTrdLogin(aParam, aFunc) {
        const s = this;
        s.WSCallTrade("Login", aParam, aFunc);
    }

    ReqTrdGetWallets(aParam, aFunc) {
        /*
            查询合约钱包： GetWallets （AId=UID+01）
            查询币币钱包： GetWallets （AId=UID+02）
            {
               "AId":"1525354501"
            }
        */
        const s = this;
        s.WSCallTrade("GetWallets", aParam, aFunc);
    }

    ReqTrdGetCcsWallets(aParam, aFunc) {
        /*
            aParam 为 null
        */
        const s = this;
        s.WSCallTrade("GetCcsWallets", null, aFunc);
    }

    ReqTrdGetTrades(aParam, aFunc) {
        /*
            {
                "AId":"123456701"
            }
        */
        const s = this;
        s.WSCallTrade("GetTrades", aParam, aFunc);
    }

    ReqTrdGetOrders(aParam, aFunc) {
        /*
            {
                "AId":"123456701"
            }
        */
        const s = this;
        s.WSCallTrade("GetOrders", aParam, aFunc);
    }

    ReqTrdGetPositions(aParam, aFunc) {
        /*
            {
                "AId":"123456701"
            }
        */
        const s = this;
        s.WSCallTrade("GetPositions", aParam, aFunc);
    }

    ReqTrdGetHistOrders(aParam, aFunc) {
        /*
            {
                "AId":"123456701"
            }
        */
        const s = this;
        s.WSCallTrade("GetHistOrders", aParam, aFunc);
    }

    ReqTrdGetWalletsLog(aParam, aFunc) {
        /*
            {
                "AId":"123456701"
            }
        */
        const s = this;
        s.WSCallTrade("GetWalletsLog", aParam, aFunc);
    }

    ReqTrdGetRiskLimits(aParam, aFunc) {
        const s = this;

        /*
            {
                "AId":"123456701",
                "Sym":"BTC.USDT,BTC.BTC"
            }
        */
        s.WSCallTrade("GetRiskLimits", aParam, function(aTrd, aRaw) {
            if (aRaw.code === 0) {
                const data = aRaw.data;
                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    aTrd.RS[item.Sym] = item;
                }
                aTrd.trdInfoStatus.rs = 1;
                broadcast.emit({ cmd: broadcast.EV_GET_RS_READY, data: { Ev: broadcast.EV_GET_RS_READY, data: aTrd.RS } });
            }
        });
    }

    WltsReplace(aTrd, aRaw, aId) {
        const items = aRaw.data;
        aTrd.Wlts[aId] = items;
        if (aId === '01') {
            aTrd.trdInfoStatus.wlt = 1;
        }
        broadcast.emit({ cmd: broadcast.EV_GET_WLT_READY, data: { Ev: broadcast.EV_GET_WLT_READY, aType: aId, data: items } });
    }

    WltUpdate(aTrd, data) {
        const AId = data.AId;
        const id = AId.slice(AId.length - 2);
        const wlts = aTrd.Wlts[id];
        let updated = false;
        if (wlts) {
            for (let i = 0; i < wlts.length; i++) {
                const wlt = wlts[i];
                switch (id) {
                case "01":
                case "02": {
                    if ((wlt.AId === data.AId) && (wlt.Coin === data.Coin)) {
                        wlts[i] = data;
                        updated = true;
                    }
                    break;
                }
                default:
                }
                if (updated) {
                    break;
                }
            }
            if (!updated) {
                wlts.push(data);
            }
            broadcast.emit({ cmd: broadcast.EV_WLT_UPD, data: { Ev: broadcast.EV_WLT_UPD, aType: id, data: data } });
        }
    }

    PossReplace(aTrd, aRaw) {
        const items = aRaw.data;
        const converted = {};
        for (let i = 0; i < items.length; i++) {
            const pos = items[i];
            converted[pos.PId] = pos;
        }
        aTrd.Poss = converted;
        aTrd.trdInfoStatus.pos = 1;

        broadcast.emit({ cmd: broadcast.EV_GET_POS_READY, data: { Ev: broadcast.EV_GET_POS_READY, data: items } });
    }

    PosUpdate(aTrd, data) {
        if ((data.DF & 512) !== 0) {
            // 删除
            delete aTrd.Poss[data.PId];
            broadcast.emit({ cmd: broadcast.EV_POS_UPD, data: { Ev: broadcast.EV_POS_UPD, dType: 3, data: data } });
            return;
        }
        if (aTrd.Poss[data.PId]) {
            // 更新
            aTrd.Poss[data.PId] = data;
            broadcast.emit({ cmd: broadcast.EV_POS_UPD, data: { Ev: broadcast.EV_POS_UPD, dType: 2, data: data } });
        } else {
            // 新增
            aTrd.Poss[data.PId] = data;
            broadcast.emit({ cmd: broadcast.EV_POS_UPD, data: { Ev: broadcast.EV_POS_UPD, dType: 1, data: data } });
        }
    }

    OrdersReplace(aTrd, aRaw, aId) {
        const items = aRaw.data;
        aTrd.Orders[aId] = items;
        if (aId === '01') {
            aTrd.trdInfoStatus.ord = 1;
        }
        broadcast.emit({ cmd: broadcast.EV_GET_ORD_READY, data: { Ev: broadcast.EV_GET_ORD_READY, aType: aId, data: items } });
    }

    OrderUpdate(aTrd, data) {
        const AId = data.AId;
        const id = AId.slice(AId.length - 2);

        const ords = aTrd.Orders[id];
        const historyOrd = aTrd.HistoryOrders[id];
        let dType = 1; // 1:新增， 2:更新， 3: 删除
        switch (data.Status) {
        case aTrd.OrdStatus.Queueing:
        case aTrd.OrdStatus.Matching:
        case aTrd.OrdStatus.Status_6:
            for (let i = 0; i < ords.length; i++) {
                const ord = ords[i];
                if (ord.OrdId === data.OrdId) {
                    ords[i] = data;
                    dType = 2;
                }
            }
            break;
        default:
            dType = 3;
            for (let i = 0; i < ords.length; i++) {
                const ord = ords[i];
                if (ord.OrdId === data.OrdId) {
                    ords.splice(i, 1);
                }
            }
            historyOrd.push(data);
            break;
        }
        if (dType === 1) {
            ords.push(data);
        }

        broadcast.emit({ cmd: broadcast.EV_ORD_UPD, data: { Ev: broadcast.EV_ORD_UPD, aType: id, dType: dType, data: data } });
    }
}
module.exports = Mkt;