/*
* https://github.com/hexiaoyuan/gmex.api/blob/master/gmex-unofficial-api-docs/WebSocket_API_for_GMEX_v1.md
* */
// TODO 当新的K线到达的时候，填充空缺
// TODO 对订阅进行管理
// TODO Empty_CheckAndReq 可能对重复的区域进行，考虑先进行合并。再请求
// TODO 优化 util_KlineFindLESec
// TODO 优化 util_KlineFindGESec



let Stately = require('stately.js');
let md5 = require('md5')
let consts = require("./consts")

let objectDefault = require('../futureCalc/objectDefault').default

const AUTH_ST_NO = 0;
const AUTH_ST_WT = 1; //等待
const AUTH_ST_OK = 2; //OK

const DBG_MKT = false
const DBG_STATELY = false

const DBG_ONMESSAGE = false
const DBG_WSCALL = false
const DBG_RefreshEmptyRange = false;

const ENABLE_TRADE_UPDATE_KLINE = true;

const ST_IDLE = 'IDLE'
const ST_PRECONNECT = 'PRECONNECT'
const ST_CONNECTING = 'CONNECTING'
const ST_AUTHORIZING = 'AUTHORIZING'
const ST_WORKING = 'AUTHORIZING'

const WT_REQ = 1;

const EV_LOGIN_TRADE = "ev_login_trade"
const EV_HIST_UPD = "evHistUpd"
const EV_REALTIME_UPD = "evRealtimeUpd";
const EV_ORDER20_UPD = "evOrder20Upd"
const EV_WLT_POS_ORDER_UPD = "evWltPosOrderUpd"
const EV_GET_POS_READY = "EV_GET_POS_READY"
const EV_POS_UPD = "EV_POS_UPD"
const EV_GET_WLT_READY = "EV_GET_WLT_READY"
const EV_WLT_UPD = "EV_WLT_UPD"
const EV_GET_ORD_READY = 'EV_GET_ORD_READY';
const EV_ORD_UPD = 'EV_ORD_UPD';
const EV_GET_HISTORY_ORD_READY = 'EV_GET_HISTORY_ORD_READY';
const EV_GET_HISTORY_TRD_READY = 'EV_GET_HISTORY_TRD_READY';
const EV_GET_WLT_LOG_READY = 'EV_GET_WLT_LOG_READY';
const EV_WLTLOG_UPD = 'EV_WLTLOG_UPD'

const EV_ASSETD_UPD = "evAssetDUpd"
const EV_TICK_UPD = "evTickUpd"
const EV_INDEX_UPD = "evIndexUpd"
const EV_NEWTRADE_UPD = "evNewTradeUpd"
const EV_KLINE_UPD = "evKlineUpd"

const WEBAPI_EV_WEB_LOGIN = "EV_WEB_LOGIN"
const WEBAPI_EV_WEB_LOGOUT = "EV_WEB_LOGOUT"

const EV_PAGETRADESTATUS_UPD = 'EV_PAGETRADESTATUS_UPD'
const EV_CHANGESYM_UPD = 'EV_CHANGESYM_UPD'
const EV_CHANGEACTIVEPOS_UPD = 'EV_changeActivePos_UPD'
const EV_OPENLEVERAGEMODE_UPD = 'EV_openLeverageMode_UPD'
const EV_OPENSTOPPLMODE_UPD = 'EV_openStopPLMode_UPD'
const EV_POSABDWLTCALCOVER_UPD = 'EV_posAndWltCalcOver_UPD'

const EV_OPENORDADJUST_UPD = 'EV_OPENORDADJUST_UPD'
const EV_OPENIMPLEMENTED_UPD = 'EV_OPENIMPLEMENTED_UPD'
const EV_SWITCHALL_UPD = 'EV_SWITCHALL_UPD'
const EV_ORDTIPS_UPD = 'EV_ORDTIPS_UPD'
const EV_PLANTIPS_UPD = 'EV_PLANTIPS_UPD'
const EV_OPENORDERCOMMON_UPD = 'EV_OPENORDERCOMMON_UPD'
const EV_COMPOSITEINDEX_UPD = 'EV_COMPOSITEINDEX_UPD'
const EV_ASSETEX_UPD = 'EV_ASSETEX_UPD'

const EV_GETRISKLIMITSOVER_UPD = "EV_GETRISKLIMITSOVER_UPD"


const Typ2Sec = {
    "1m":60,
    "3m":60*3,
    "5m":60*5,
    "15m":60*15,
    "30m":60*30,
    "1h":60*60,
    "2h":60*60*2,
    "4h":60*60*4,
    "6h":60*60*6,
    "8h":60*60*8,
    "12h":60*60*12,
    "1d":60*60*24,
    "3d":60*60*24*3,
    "1w":60*60*24*7,
    "2w":60*60*24*14,
    "1M":60*60*24*30,
}

const Res2Typ = {
    "1":"1m",
    '3':"3m",
    "5":"5m",
    "15":"15m",
    "30":"30m",
    "60":"1h",
    '120':"2h",
    '240':"4h",
    '360':"6h",
    '480':"8h",
    '720':"12h",
    "D":"1d",
    '3D':"3d",
    "W":"1w",
    "M":"1M"
}

const Typ2Res = {
    "1m":"1",
    "3m":'3',
    "5m":"5",
    "15m":"15",
    "30m":"30",
    "1h":"60",
    "2h":'120',
    "4h":'240',
    "6h":'360',
    "8h":'480',
    "12h":'720',
    "1d":"D",
    "3d":'3D',
    "1w":"W",
    "1M":"M"
}

const supported_resolutions = ["1", '3', "5", "15", "30", "60", '120', '240', '360', '480', '720', "D", '3D', "W", "M"]


function FixObjWithSample(aWlt,aSample) {
    for(let k in aSample) {
        if(typeof aWlt === 'object'){
            if (!(k in aWlt)) {
                aWlt[k] = aSample[k]
            }
        }
    }
}



class Mkt {

    Typ2Sec = Typ2Sec;

    Res2Typ = Res2Typ;

    Typ2Res = Typ2Res;

    EV_LOGIN_TRADE = EV_LOGIN_TRADE
    EV_HIST_UPD = EV_HIST_UPD;
    EV_REALTIME_UPD = EV_REALTIME_UPD;
    EV_ORDER20_UPD = EV_ORDER20_UPD;
    EV_WLT_POS_ORDER_UPD = EV_WLT_POS_ORDER_UPD;
    EV_GET_POS_READY = EV_GET_POS_READY;
    EV_POS_UPD = EV_POS_UPD;
    EV_GET_WLT_READY = EV_GET_WLT_READY;
    EV_WLT_UPD = EV_WLT_UPD;
    EV_GET_ORD_READY = EV_GET_ORD_READY;
    EV_ORD_UPD = EV_ORD_UPD;
    EV_GET_HISTORY_ORD_READY = EV_GET_HISTORY_ORD_READY;
    EV_GET_HISTORY_TRD_READY = EV_GET_HISTORY_TRD_READY;
    EV_GET_WLT_LOG_READY = EV_GET_WLT_LOG_READY;
    EV_WLTLOG_UPD = EV_WLTLOG_UPD;

    EV_ASSETD_UPD = EV_ASSETD_UPD;
    EV_PAGETRADESTATUS_UPD = EV_PAGETRADESTATUS_UPD;
    EV_TICK_UPD = EV_TICK_UPD
    EV_INDEX_UPD = EV_INDEX_UPD
    EV_CHANGESYM_UPD = EV_CHANGESYM_UPD
    EV_NEWTRADE_UPD = EV_NEWTRADE_UPD
    EV_KLINE_UPD = EV_KLINE_UPD
    EV_CHANGEACTIVEPOS_UPD = EV_CHANGEACTIVEPOS_UPD
    EV_OPENLEVERAGEMODE_UPD = EV_OPENLEVERAGEMODE_UPD
    EV_OPENSTOPPLMODE_UPD = EV_OPENSTOPPLMODE_UPD
    EV_POSABDWLTCALCOVER_UPD = EV_POSABDWLTCALCOVER_UPD
    EV_OPENORDADJUST_UPD = EV_OPENORDADJUST_UPD
    EV_OPENIMPLEMENTED_UPD = EV_OPENIMPLEMENTED_UPD
    EV_SWITCHALL_UPD = EV_SWITCHALL_UPD
    EV_ORDTIPS_UPD = EV_ORDTIPS_UPD
    EV_PLANTIPS_UPD = EV_PLANTIPS_UPD
    EV_OPENORDERCOMMON_UPD = EV_OPENORDERCOMMON_UPD
    EV_GETRISKLIMITSOVER_UPD = EV_GETRISKLIMITSOVER_UPD
    EV_COMPOSITEINDEX_UPD = EV_COMPOSITEINDEX_UPD
    EV_ASSETEX_UPD = EV_ASSETEX_UPD
    Conf = {
        Host: "",
        ApiKey: "",
        Type: "mkt", //mkt/ trd
        SecretKey : "从用户个人信息中查询",
        UserName:""
    }

    RT = {
        Authrized:AUTH_ST_NO,
    }

    // websocket handle
    ws = null;
    // 状态机
    stately = null;
    // 主题订阅状态
    booking = {
        "sub1": {want:true,done:false},
        "sub2": {want:true,done:false},
    }
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
    klines = {
        // "BTC.USDT": {
        //     "1m": [{time:1, close:1, open:2, high:4, low:1, volume:100}] //格式
        // }
    }

    kline_lastSec = {
        // "BTC.USDT": {
        //     "1m": 0
        // }
    }

    //已没有历史数据的k线
    kline_data_over = {
        // "BTC.USDT": {
        //     "1m": 0
        // }
    }

    //这个
    trades = {
        // "BTC.USDT": []
    }

    ticks = {
        // "BTC.USDT": []
    }

    lastTick = {}

    orderl2 = {
        // "BTC.USDT": {}
    }
    order20 = {
        // "BTC.USDT": {"Sym":"BTC.USDT","At":0,"Asks":[],"Bids":[],"SEQ":0}
    }

    displaySym = []//['BTC.USDT']

    currencyIndex = []//['BTC']

    AssetD = {
        // "BTC.USDT":{}
    }

    AssetEx = {
        // "BTC.USDT":{}
    }


    //尚未从服务器获取kline数据的范围
    EmptyRange = {
        // "BTC.USDT": {
        //     "1m":[[0,0,0]]
        // }
    }

    Wlts = {
        "01":[]
        ,"02":[]
        ,"03":[]
    }

    Poss = {}

    Orders = {
        "01":[]
        ,"02":[]
    }

    HistoryOrders = {
        "01":[]
        ,"02":[]
    }

    MyTrades = {
        "01": [],
        "02": []
    }

    MyTrades_Obj = {
        "01": {},
        "02": {},
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
            '01':0,
            '02':0
        },
        trade: {
            '01':0,
            '02':0
        },
        wltLog: {
            '01':0,
            '02':0
        },
    }



    //当前正在操作的合约,相关的数据，各输入UI会 读写 这里的数据
    CtxPlaying = {
        pageTradeStatus: 1, //页面交易类型，1:合约，2:币币，3合约信息
        Sym:"",
        Typ:"15m",
        UId:"",
        AId:"",
        //当前正在编辑的委托
        Order: {

        },
        //当前正在操作的合约
        AssetD: {

        }
        // 合约的附加配置
        ,AssetCfg: {

        },
        TickType: "__fast__", //行情模式，"__fast__":正常模式；"__slow__"：慢速模式；
        subList: [],
        activePId: '', //当前选中的仓位
    }

    constructor(aArg) {
        let s = this;
        s.Conf = aArg
        if(DBG_MKT){console.log(__filename,"constructor")}
        s.booking = {}
        //开始连接的时间戳
        s.openStart = 0;
        s.klines = {}


        if (s.Conf.Type=="trd") {
            gEVBUS.on(WEBAPI_EV_WEB_LOGIN,data=> {
                let ctx = data.d
                let account = ctx.account
                s.Conf.UserName = account.accountName;
                s.Conf.AuthType = account.AuthType || 2;
                s.Conf.UserCred = account.token

            })
            gEVBUS.on(WEBAPI_EV_WEB_LOGOUT,data=> {
                s.Conf.UserName = '';
                s.Conf.AuthType = 2;
                s.Conf.UserCred = ''

                s.close()
            })
        }
        s.stately = Stately.machine({
                'IDLE': {
                    tick:function (aObj) {

                    }
                },
                'PRECONNECT': {
                    tick:function (aObj) {
                        if(DBG_STATELY){console.log(__filename,"tick",aObj.Conf.Type, "PRECONNECT")}
                        let stately = this;
//                        let stately = aObj.stately
                        switch (aObj.Conf.Type) {
                            case "mkt": {
                                if (true) {
                                    // 清理订阅状态
                                    for (var propName in aObj.booking) {
                                        aObj.booking[propName].done = false;
                                    }
                                }
                                break;
                            }
                            case "trd":
                                if (aObj.Conf.UserName.length==0) {
                                    return;
                                }
                                break;
                        }
                        if (aObj.ws) {
                            aObj.ws.close()
                        }
                        aObj.ws = new WebSocket(aObj.Conf.Host)
                        aObj.RT.Authrized = false;
                        aObj.openStart = Date.now();
                        aObj.Reqs = {}
                        if (!aObj.ws.onopen) {
                            aObj.ws.onopen = function (evt) {
                                aObj.ws_onopen(aObj, evt)
                            }
                        }
                        if (!aObj.ws.onmessage) {
                            aObj.ws.onmessage = function (evt) {
                                aObj.ws_onmessage(aObj, evt)
                            }
                        }
                        if (aObj.Conf.Host.length==0) {
                            return;
                        } else {
                            return stately.CONNECTING
                        }
                    }
                },
                'CONNECTING': {
                    tick:function (aObj) {
                        if(DBG_STATELY){console.log(__filename,"tick",aObj.Conf.Type,"CONNECTING")}
                        // 检查Websocket的连接状态，并切换到
                        let stately = this
                        let ws = aObj.ws
                        if (ws) {
                            switch (ws.readyState) {
                                case WebSocket.CONNECTING:
                                    if (Date.now() - aObj.openStart > aObj.timeoutOpen) {
                                        return stately.PRECONNECT
                                    }
                                    break;
                                case WebSocket.OPEN:
                                    aObj.lastRecvTm = Date.now()
                                    aObj.lastSendTm = aObj.lastRecvTm


                                    switch (aObj.Conf.Type) {
                                        case "trd":
                                        {
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


                                            aObj.Conf.Authrized = AUTH_ST_WT;
                                            // 登录交易前先校对时间
                                            aObj.ReqTime(arg => {
                                                aObj.ReqTrdLogin({                    			// 服务端所需的参数
                                                    "UserName":aObj.Conf.UserName,
                                                    "UserSecr":aObj.Conf.UserSecr,              // 如果有API Key
                                                    "UserCred":aObj.Conf.UserCred,              // token ,或者 UserCred
                                                    "AuthType":aObj.Conf.AuthType?aObj.Conf.AuthType:0,
                                                },function (aObj, aRaw) {
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
                                                    let d = aRaw.data
                                                    console.log("ReqTrdLogin",aRaw)
                                                    switch (aRaw.code) {
                                                        case 0:
    
                                                            aObj.RT.Authrized = AUTH_ST_OK;
                                                            for (let prop in d ) {
                                                                aObj.RT[prop] = d[prop]
                                                            }
                                                            aObj.CtxPlaying.UId = aObj.RT.UserId
    
                                                            break;
                                                        default:
                                                            aObj.RT.Authrized = AUTH_ST_NO;
                                                            break;
                                                    }
                                                    gEVBUS.emit(EV_LOGIN_TRADE, {ev: EV_LOGIN_TRADE})
                                                })
                                            })
                                            break;
                                        }
                                    }
                                    return stately.AUTHORIZING;
                                    break;
                                case WebSocket.CLOSING:
                                    break;
                                case WebSocket.CLOSED:
                                    return stately.PRECONNECT;
                                    break;
                            }
                        }
                    }
                },
                'AUTHORIZING': {
                    tick:function (aObj) {
                        let stately = this
                        if(DBG_STATELY){console.log(__filename,"tick",aObj.Conf.Type,"AUTHORIZING")}
                        switch (aObj.Conf.Type) {
                            case "mkt":
                            {
                                if (true) {
                                    aObj.ReqAssetD({vp:window.$config.exchId});
                                }
                                
                                if (true) {
                                    return stately.WORKING;
                                }
                                break;
                            }
                            case "trd":
                            {
                                switch (aObj.RT.Authrized) {
                                    case AUTH_ST_NO:
                                        return stately.PRECONNECT;
                                    case AUTH_ST_WT:
                                        break;
                                    case AUTH_ST_OK:
                                    {
                                        // 订阅仓位等。
                                        aObj.ReqTrdGetWallets(
                                            {
                                                "AId":aObj.RT["UserId"]+"01"
                                            },function (aTrd,aRaw) {
                                                aObj.WltsReplace(aTrd,aRaw,"01")
                                            })
                                        if (true) {
                                            aObj.ReqTrdGetWallets({
                                                "AId": aObj.RT["UserId"] + "02"
                                            }, function (aTrd, aRaw) {
                                                aObj.WltsReplace(aTrd,aRaw,"02")
    
                                            })
                                            // aObj.ReqTrdGetWallets({
                                            //     "AId": aObj.RT["UserId"] + "03"
                                            // }, function (aTrd, aRaw) {
                                            //     aObj.WltsReplace(aTrd,aRaw,"03")
                                            //     console.log("ReqTrdGetWallets 03", aRaw)

                                            // })
                                        }
                                        aObj.ReqTrdGetOrders({
                                            "AId":aObj.RT["UserId"]+"01"
                                        },function (aTrd, aRaw) {
                                            aObj.OrdersReplace(aTrd,aRaw,"01")
                                        })

                                        if(true){
                                            aObj.ReqTrdGetOrders({
                                                "AId":aObj.RT["UserId"]+"02"
                                            },function (aTrd, aRaw) {
                                                aObj.OrdersReplace(aTrd,aRaw,"02")
                                            })
                                        }
                                        

                                        aObj.ReqTrdGetPositions({
                                            "AId":aObj.RT["UserId"]+"01"
                                        },function (aTrd,aRaw) {
                                            console.log("ReqTrdGetPositions 03",aRaw)
                                            aObj.PossReplace(aTrd,aRaw)
                                        });

                                        

                                        return stately.WORKING;
                                    }
                                }
                                break;
                            }
                        }
                    }
                },
                'WORKING': {
                    tick:function (aObj) {
                        let stately = this
                        if(DBG_STATELY){console.log(__filename,"tick",aObj.Conf.Type,"WORKING")}
                        let ws = aObj.ws
                        if (ws) {
                            switch (ws.readyState) {
                                case WebSocket.OPEN:
                                    break;
                                default:
                                    return stately.PRECONNECT;
                                    break;
                            }
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

                        switch (aObj.Conf.Type) {
                            case "mkt":
                            {
                                break;
                            }
                            case "trd":
                            {
                                break;
                            }
                        }

                        if (true) {
                            if (aObj.CheckAndSendHeartbeat(aObj)) {
                                return stately.PRECONNECT;
                            }
                        }
                    }
                }
            }
            ,"PRECONNECT"   //初始状态
        );
        if(DBG_MKT){console.log(__filename,"constructor")}
    }

    Getsupported_resolutions() {
        return supported_resolutions;
    }

    WSCall_Mkt(aCmd, aParam, aFunc) {
        let s = this
        if(DBG_WSCALL){console.log(__filename,"WSCall_Mkt",aCmd,aParam)}
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

    close(){
        let s = this
        if(s.ws){
            s.ws.close()
            s.clearConf()
        }
    }

    clearConf(){
        let s = this
        s.Wlts = {
            "01":[]
            ,"02":[]
            ,"03":[]
        }
        s.Poss = {}
        s.Orders = {
            "01":[]
            ,"02":[]
        }
        s.MyTrades = {
            "01":[]
            ,"02":[]
        }
        s.HistoryOrders = {
            "01":[]
            ,"02":[]
        }
        s.WltLog = {
            "01": [],
            "02": []
        }
        s.trdInfoStatus = {
            pos: 0,
            ord: 0,
            wlt: 0,
            rs: 0,
            historyOrd: {
                '01':0,
                '02':0
            },
            trade: {
                '01':0,
                '02':0
            },
            wltLog: {
                '01':0,
                '02':0
            },
        }
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
            gEVBUS.EmitDeDuplicate(EV_ASSETD_UPD,50,EV_ASSETD_UPD, {Ev: EV_ASSETD_UPD})

            s.recoverMkt()

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
            gEVBUS.EmitDeDuplicate(EV_ASSETEX_UPD,50,EV_ASSETEX_UPD, {Ev: EV_ASSETEX_UPD})
        })
        s.WSCall_Mkt("GetCompositeIndex",aArg,function(aMkt, aRaw) {
            let d = aRaw.data;
            s.currencyIndex = []
            for(let i = 0; i< d.length; i++){
                s.currencyIndex.push(d[i])
            }
            
            gEVBUS.EmitDeDuplicate(EV_COMPOSITEINDEX_UPD,50,EV_COMPOSITEINDEX_UPD, {Ev: EV_COMPOSITEINDEX_UPD})
        })
        
    }

    ReqSub(aTpcArray) {
        let s = this
        
        let needSub = []
        aTpcArray.map(item => {
            if(!s.CtxPlaying.subList.includes(item)){
                s.CtxPlaying.subList.push(item)
                needSub.push(item)
            }
        })
        if(!needSub || needSub.length == 0){
           return 
        }
        needSub.push(s.CtxPlaying.TickType)
        s.WSCall_Mkt("Sub",needSub)
    }

    ReqUnSub(aTpcArray) {
        let s = this
        aTpcArray.map(item => {
            let i = s.CtxPlaying.subList.findIndex(it =>{
                return it == item
            })
            if(i > -1){
                s.CtxPlaying.subList.splice(i, 1)
            }
        })
        if(!aTpcArray || aTpcArray.length == 0){
            return 
         }
        s.WSCall_Mkt("UnSub",aTpcArray)
    }
    /**
     * 
     * @param {Object} aParam {"Sym":aSym,"Typ":aTyp,"Count":aCount}
     * @param {Function} aFunc 
     */
    ReqKLineLastest(aParam, aFunc) {
        let s = this;
        s.WSCall_Trade("GetLatestKLine",aParam, aFunc)
    }
    /**
     * 
     * @param {Object} aParam {
                                "Sym": "BTC.USDT",
                                "Typ": "1m",
                                "Sec": start - 100 * 60,
                                "Offset": 0,
                                "Count": 10
                            }
     * @param {Function} aFunc 
     */
    ReqKLineHist(aParam, aFunc) {
        let s = this;
        s.WSCall_Trade("GetHistKLine",aParam, aFunc)
    }

    WSCall_Trade(aCmd,aParam,aFunc) {
        let s = this
        if(DBG_WSCALL){console.log(__filename,"WSCall_Trade",aCmd,aParam)}
        let tm = Date.now();
        s.lastSendTm = tm;

        let msg = {
            req: aCmd,
            rid: String(++s.rid),
            args: aParam,
            expires: tm + s.netLag + s.timeoutMsg
        };
        if (aParam) {
            msg.args = aParam
        }
        let texts = [
            msg.req,
            msg.rid,
            aParam?JSON.stringify(msg.args):"",
            String(msg.expires),
            s.Conf.SecretKey
        ]
        let textjoined = texts.join("");
        let signature =md5(textjoined);
        msg.signature = signature;
        let msgStr = JSON.stringify(msg)
        try {
            s.ws.send(msgStr);
        } catch (e) {

        }
        msg.cb = aFunc
        s.Reqs[msg.rid] = msg;
    }

    ReqTrdLogin(aParam,aFunc) {
        let s = this;
        s.WSCall_Trade("Login",aParam,aFunc);
    };

    ReqTrdGetWallets(aParam,aFunc) {
        /*
            查询合约钱包： GetWallets （AId=UID+01）
            查询币币钱包： GetWallets （AId=UID+02）
            {
               "AId":"1525354501"
            }
        */
        let s = this;
        s.WSCall_Trade("GetWallets",aParam,aFunc);
    };

    ReqTrdGetCcsWallets(aParam,aFunc) {
        /*
            aParam 为 null
        */
        let s = this;
        s.WSCall_Trade("GetCcsWallets",null,aFunc);
    };

    ReqTrdGetTrades(aParam,aFunc) {
        /*
            {
                "AId":"123456701"
            }
        */
        let s = this;
        s.WSCall_Trade("GetTrades",aParam,aFunc);
    };

    ReqTrdGetOrders(aParam,aFunc) {
        /*
            {
                "AId":"123456701"
            }
        */
        let s = this;
        s.WSCall_Trade("GetOrders",aParam,aFunc);
    };

    ReqTrdGetPositions(aParam,aFunc) {
        /*
            {
                "AId":"123456701"
            }
        */
        let s = this;
        s.WSCall_Trade("GetPositions",aParam,aFunc);
    };


    ReqTrdGetHistOrders(aParam,aFunc) {
        /*
            {
                "AId":"123456701"
            }
        */
        let s = this;
        s.WSCall_Trade("GetHistOrders",aParam,aFunc);
    };
    ReqTrdGetWalletsLog(aParam,aFunc) {
        /*
            {
                "AId":"123456701"
            }
        */
        let s = this;
        s.WSCall_Trade("GetWalletsLog",aParam,aFunc);
    };

    ReqTrdGetRiskLimits(aParam,aFunc) {
        let s = this;

        /*
            {
                "AId":"123456701",
                "Sym":"BTC.USDT,BTC.BTC"
            }
        */
    
        s.WSCall_Trade("GetRiskLimits",aParam,function(aTrd,aRaw){
            if(aRaw.code == 0){
                let data = aRaw.data
                for(let i = 0; i < data.length; i++){
                    let item = data[i]
                    aTrd.RS[item.Sym] = item
                }
                aTrd.trdInfoStatus.rs = 1
                aFunc && aFunc()
            }
            
        });
        
    };

    ReqTrdOrderNew(aParam,aFunc) {
        /*
        {
            "AId":"123456701",
            "COrdId":"c4681144dc5b4051925f00e8339ee97f",
            "Sym":"BTC1809",
            "Dir":1,
            "OType":1,
            "Prz":6500,
            "Qty":2,
            "QtyDsp":0,
            "Tif":0,
            "OrdFlag":0,
            "PrzChg":0
        }
        */
        aParam.COrdId = 'pub_'+aParam.COrdId
        let s = this;
        s.WSCall_Trade("OrderNew",aParam,aFunc);
    };

    ReqTrdOrderDel(aParam,aFunc) {
        /*
        {
            "AId":"123456701",
            "OrdId":"01CQES0XMVV3SMWJ7N683FWJR8",
            "Sym":"BTC1809"
        }
        */
        let s = this;
        s.WSCall_Trade("OrderDel",aParam,aFunc);
    };

    ReqTrdPosLeverage(aParam,aFunc) {
        /*
        {
            "AId":"123456701",
            "Sym":"BTC1809",
            "PId": "xxxxxxxx",
            "Param": 15
        }
        */
        let s = this;
        s.WSCall_Trade("PosLeverage",aParam,aFunc);
    };
    
    ReqTrdPosOp(aParam,aFunc) {
        /*
        {
            "AId":"123456701",
            "Sym":"BTC1809",
            "PId": "xxxxxxxx",
            "Op"": 1    //0:New, 1:Del, 2:MIR
        }
        */
        let s = this;
        s.WSCall_Trade("PosOp",aParam,aFunc);
    };

    ReqTrdPosStopLP(aParam,aFunc) {
        /*
        设置止盈止损 PosStopLP
        {
            "AId": "123456701",  // 账号的AId, 必须有
            "Sym": "BTC.USDT",   // 交易对名称, 必须有
            "PId": "xxxxxxxx",   // 仓位的ID, 必须有
            "StopLBy": 1         // 参考 StopBy 值定义, 止损, 对应仓位的 StopLBy
            "StopPBy": 1         // 参考 StopBy 值定义, 止盈, 对应仓位的 StopPBy
            "Param": 8515.5      // float64 值, 参数值, 对应仓位的 StopL
            "P2": 9515.5         // float64 值, 参数值, 对应仓位的 StopP
        }
        */
        let s = this;
        s.WSCall_Trade("PosStopLP",aParam,aFunc);
    };

    ReqTrdPosTransMgn(aParam,aFunc) {
        /*
            调整仓位保证金 PosTransMgn
        {
            "AId": "123456701",  // 账号的AId, 必须有
            "Sym": "BTC.USDT",   // 交易对名称, 必须有
            "PId": "xxxxxxxx",   // 仓位的ID, 必须有
            "Param": 8515.5      // float64 值,必须有,正数表示增加，负数表示减少.
        }
        */
        let s = this;
        s.WSCall_Trade("PosTransMgn",aParam,aFunc);
    };

    ReqTime(aFunc){
        let s = this
        let now = Date.now()
        s.WSCall_Mkt("Time", now, (aObj ,arg) => {
            aObj.netLag = arg.data.time - Date.now();
            aFunc && aFunc()
        })
    }

    ws_onopen(aObj,evt) {
        //TODO 啥也别干
        if(DBG_MKT){console.log(__filename,"ws_onopen")}

    }

    ws_onmessage(aObj,evt) {
        if(DBG_ONMESSAGE){console.log(__filename,"ws_onmessage",evt.data)}

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
                let sym = d_data.Sym
                if (sym) {
                    aObj.ticks[sym] = aObj.util_PushToHead(aObj.ticks[sym], d_data, aObj.NumDataLenMax)
                    aObj.lastTick[sym] = d_data
                    gEVBUS.emit(EV_TICK_UPD, {Ev: EV_TICK_UPD, Sym: sym, data: d_data})
                }
                break;
            }
            case "index": {
                /**
                 {"subj":"tick","data":{"Sym":"BTC.USDT","At":1574523443124,"PrzBid1":7280.5,"SzBid1":134,"SzBid":4118258,"PrzAsk1":7281.5,"SzAsk1":3220,"SzAsk":4343293,"LastPrz":7281,"SettPrz":7279.7003499186,"Prz24":7129,"High24":7376.5,"Low24":7081,"Volume24":38848117,"Turnover24":1402379837.020001,"Volume":3345679193,"Turnover":0,"OpenInterest":870068,"FundingLongR":-0.0003143419,"FundingPredictedR":-0.0003143419,"SEQ":887726}}
                 **/
                let sym = d_data.Sym
                if (sym) {
                    aObj.ticks[sym] = aObj.util_PushToHead(aObj.ticks[sym], d_data, aObj.NumDataLenMax)
                    gEVBUS.emit(EV_INDEX_UPD, {Ev: EV_INDEX_UPD, Sym: sym, data: d_data})
                }
                break;
            }
            case "kline": {
                /*
                {"subj":"kline","data":{"Sym":"BTC.USDT","Typ":"1m","Sec":1574523600,"PrzOpen":7257,"PrzClose":7257.5,"PrzHigh":7257.5,"PrzLow":7255.5,"Volume":2629,"Turnover":95390.5275}}
                */

                let sym = d_data.Sym;
                let typ = d_data.Typ;
                let intervalInSec = aObj.Typ2Sec[typ];
                if (sym) {
                    let roundedInMS = Math.floor(d_data.Sec / intervalInSec) * intervalInSec * 1000;
                    let converted = [{
                        Ms: roundedInMS,
                        Turnover: d_data.Turnover,
                        //下面的数据采用TradingView格式
                        time: roundedInMS,
                        close: d_data.PrzClose,
                        open: d_data.PrzOpen,
                        high: d_data.PrzHigh,
                        low: d_data.PrzLow,
                        volume: d_data.Volume,
                    }]
                    
                    gEVBUS.emit(EV_KLINE_UPD, {Ev: EV_KLINE_UPD, Sym: d_data.Sym, Typ: d_data.Typ, data: converted[0]})


                }
                break;
            }
            case "trade": {
                /*
                {"subj":"trade","data":{"Sym":"BTC.USDT","At":1574573589537,"Prz":7182.5,"Dir":-1,"Sz":87,"Val":-3124.3875,"MatchID":"01DTDYCFZV3DCMX20744BQF5WW"}}
                */
                let sym = d_data.Sym
                if (sym) {
                    aObj.trades[sym] = aObj.util_PushToHead(aObj.trades[sym], d_data, aObj.NumDataLenMax)
                }
                gEVBUS.emit(EV_NEWTRADE_UPD, {Ev: EV_NEWTRADE_UPD, data: d_data})
                if (ENABLE_TRADE_UPDATE_KLINE) {
                    // 这里要发送事件了
                    gEVBUS.emit(EV_REALTIME_UPD, {Ev: EV_REALTIME_UPD, data: d_data})
                }
                break;
            }
            case "order20": {
                let sym = d_data.Sym
                /*
                {"subj":"order20","data":{"Sym":"BTC.USDT","At":1574605382624,"Asks":[[7147.5,2385],[7148,76],[7148.5,172],[7149,474],[7149.5,1137],[7150,41],[7150.5,2547],[7151,4032],[7151.5,824],[7152,15],[7152.5,18],[7153,586],[7153.5,4675],[7154,379],[7154.5,1185],[7155,1123],[7155.5,8030],[7156,426],[7156.5,308],[7157,127]],"Bids":[[7146.5,2718],[7146,6953],[7145.5,10616],[7145,1257],[7144.5,841],[7144,582],[7143.5,3989],[7143,1711],[7142.5,1136],[7142,831],[7141.5,1668],[7141,198],[7140.5,541],[7140,813],[7139.5,488],[7139,135],[7138.5,74],[7138,131],[7137.5,1591],[7137,427]],"SEQ":2616505}}
                */
                let order20s = aObj.order20[sym];
                if (!order20s) {
                    order20s = [d_data, d_data]
                    aObj.order20[sym] = order20s;
                } else {
                    order20s[1] = order20s[0]
                    order20s[0] = d_data;
                }
                
                gEVBUS.emit(EV_ORDER20_UPD, {Ev: EV_ORDER20_UPD, Sym: sym, data: d_data})
                break;
            }

            case "onOrder": {   //报单通知
                aObj.OrderUpdate(aObj,d_data)
                break;
            }
            case "onPosition": { //持仓通知
                aObj.PosUpdate(aObj,d_data)
                break;
            }
            case "onWallet": {
                aObj.WltUpdate(aObj,d_data)
                break;
            }
            case "onWltLog": {
                aObj.WltLogUpdate(aObj,d_data)
                break;
            }
            case "onTrade": {
                aObj.MyTradesReplace(aObj,{data:[d.data]},"01")

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
    convertHist(aD, aGEIdx, aLTIdx) {
        let converted = new Array(aD.Count)
        let sym = aD.Sym
        let Typ = aD.Typ
        let Sec = aD.Sec
        let PrzClose = aD.PrzClose
        let PrzHigh = aD.PrzHigh
        let PrzLow = aD.PrzLow
        let PrzOpen = aD.PrzOpen
        let Turnover = aD.Turnover
        let Volume = aD.Volume
        /*
            {"Sym":"BTC.USDT","Typ":"1m","Sec":1574523600,"PrzOpen":7257,"PrzClose":7257.5,"PrzHigh":7257.5,"PrzLow":7255.5,"Volume":2629,"Turnover":95390.5275}
        */
        let idx = 0;
        let timeInMs = 0;
        for (let i = aGEIdx; i < aLTIdx; i++) {
            timeInMs = Sec[i] * 1000;
            converted[idx] = {
//                Sym:sym,
//                Typ:Typ,
                Ms:timeInMs,
                Turnover:Turnover[i],
                //下面的数据采用TradingView格式
                time:timeInMs,
                close:PrzClose[i],
                open:PrzOpen[i],
                high:PrzHigh[i],
                low:PrzLow[i],
                volume:Volume[i],
            }
            idx++;
        }
        //按照时间排序
        converted.sort(function(a,b){
            return a.time - b.time
        })
        return converted
    }

    TpcAdd(aTpc) {
        let s = this;
        if (s.booking) {
            if (aTpc in s.booking) {
                let book = s.booking[aTpc]
                if (!book.want) {
                    book.want = true;
                    book.done = false;
                }
            } else {
                s.booking[aTpc] = {
                    want: true,
                    done: false,
                }
            }
        }
    }

    TpcDel(aTpc) {
        let s = this;
        if (s.booking) {
            if (aTpc in s.booking) {
                let book = s.booking[aTpc]
                if (book) {
                    if (book.want) {
                        book.want = false;
                        book.done = false;
                    }
                }
            }
        }
    }

    TpcAddArr(aTpcArr) {
        let s = this;
        if(aTpcArr.length > 0){
            for(let item of aTpcArr){
                s.TpcAdd(item)
            }
        }
    }

    TpcDelArr(aTpcArr) {
        let s = this;
        if(aTpcArr.length > 0){
            for(let item of aTpcArr){
                s.TpcDel(item)
            }
        }
    }


    WltsReplace(aTrd, aRaw, aId) {
        let items = aRaw.data
        switch (aId) {
            case "01":
            case "02":
            {
                for (let i = 0; i < items.length - 1; i++) {
                    FixObjWithSample(items[i],consts.Wlt)
                }
                break;
            }
            default:
        }
        aTrd.Wlts[aId] = items
        if(aId == '01'){
            aTrd.trdInfoStatus.wlt = 1
        }
        gEVBUS.emit(EV_GET_WLT_READY, {Ev: EV_GET_WLT_READY, aType: aId, data: items})
    }
    WltUpdate(aTrd,d_data) {
        let AId = d_data.AId
        let id = AId.slice(AId.length - 2);
        let wlts = aTrd.Wlts[id]
        let updated = false
        if (wlts) {
            for (let i = 0; i < wlts.length; i++) {
                let wlt = wlts[i]
                switch (id) {
                    case "01":
                    case "02": {
                        if ((wlt.AId == d_data.AId) && (wlt.Coin == d_data.Coin)) {
                            FixObjWithSample(d_data, consts.Wlt)
                            wlts[i] = d_data
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
                wlts.push(d_data)
            }
            gEVBUS.emit(EV_WLT_UPD, {Ev: EV_WLT_UPD, aType: id, data: d_data})
        }
    }

    PossReplace(aTrd, aRaw) {
        let items = aRaw.data
        let converted = {}
        for (let i = 0; i < items.length; i++) {
            let pos = items[i];
            FixObjWithSample(pos,consts.PosDefault)
            converted[pos.PId] = pos;
        }
        aTrd.Poss = converted
        aTrd.trdInfoStatus.pos = 1
        
        gEVBUS.emit(EV_GET_POS_READY,{Ev: EV_GET_POS_READY, data: items})
    }
    PosUpdate(aTrd,d_data) {
        FixObjWithSample(d_data,consts.PosDefault)

        
        if((d_data.DF&512) != 0){
            //删除
            delete aTrd.Poss[d_data.PId]
            gEVBUS.emit(EV_POS_UPD,{Ev: EV_POS_UPD, dType: 3, data: d_data})
            return
        }
        if(aTrd.Poss[d_data.PId]){
            //更新
            aTrd.Poss[d_data.PId] = d_data
            gEVBUS.emit(EV_POS_UPD,{Ev: EV_POS_UPD, dType: 2, data: d_data})
        }else{
            //新增
            aTrd.Poss[d_data.PId] = d_data
            gEVBUS.emit(EV_POS_UPD,{Ev: EV_POS_UPD, dType: 1, data: d_data})
        }
        
        
    }

    OrdersReplace(aTrd, aRaw, aId) {
        let items = aRaw.data
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            FixObjWithSample(item,consts.Ord)
        }
        aTrd.Orders[aId] = items;
        if(aId == '01'){
            aTrd.trdInfoStatus.ord = 1
        }
        gEVBUS.emit(EV_GET_ORD_READY, {Ev: EV_GET_ORD_READY, aType: aId, data: items})
    }

    OrderUpdate(aTrd,d_data) {
        FixObjWithSample(d_data,consts.Ord)
        let AId = d_data.AId
        let id = AId.slice(AId.length - 2);

        let ords = aTrd.Orders[id]
        let historyOrd = aTrd.HistoryOrders[id]
        let dType = 1 //1:新增， 2:更新， 3: 删除
        switch (d_data.Status ) {
            case consts.OrdStatus.Queueing:
            case consts.OrdStatus.Matching:
            case consts.OrdStatus.Status_6:
                for (let i = 0; i < ords.length; i++) {
                    let ord = ords[i];
                    if (ord.OrdId == d_data.OrdId) {
                        ords[i] = d_data;
                        dType = 2
                    }
                }
                break;
            default:
                dType = 3
                for (let i = 0; i < ords.length; i++) {
                    let ord = ords[i];
                    if (ord.OrdId == d_data.OrdId) {
                        ords.splice(i,1)
                    }
                }
                historyOrd.push(d_data)
                break;
        }
        if(dType == 1){
            ords.push(d_data)
        }
        
        gEVBUS.emit(EV_ORD_UPD, {Ev: EV_ORD_UPD, aType: id, dType: dType, data: d_data})
    }

    WltLogUpdate(aTrd,aRaw){
        let aId = aRaw.AId.substr(-2)
        let wktLog = aTrd.WltLog[aId]
        let isUpd = false
        let dType = 1 //dType 1:更新，2:新增
        for(let item of wktLog){
            if(aRaw.Seq == item.Seq){
                isUpd = true;
                dType = 1
                item = aRaw
            }
        }
        if(!isUpd){
            wktLog.push(aRaw)
            dType = 2
        }

        
        gEVBUS.emit(EV_WLTLOG_UPD, {Ev: EV_WLTLOG_UPD, aType: aId, dType: dType, data: aRaw})
    }

    MyTradesReplace (aTrd,aRaw,aId) {
        let trades = aTrd.MyTrades[aId]
        if (!trades) {
            trades = []
            aTrd.MyTrades[aId] = trades
        }
        aTrd.MyTrades[aId] = aRaw.data.concat(trades);
        for(let item of aRaw.data){
            if(!aTrd.MyTrades_Obj[aId][item.OrdId]){
                aTrd.MyTrades_Obj[aId][item.OrdId] = []
            }
            aTrd.MyTrades_Obj[aId][item.OrdId].push(item)
        }
        
        gEVBUS.EmitDeDuplicate(EV_WLT_POS_ORDER_UPD,50,EV_WLT_POS_ORDER_UPD, {Ev: EV_WLT_POS_ORDER_UPD})
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

    util_RangeCompact(empties) {
        let s = this;
        if (empties) {
            if (empties.length>0) {
                let newEmpties = []
                for (let i = empties.length - 1; i >=0 ; i--) {
                    let ms = empties[i];
                    newEmpties = s.util_RangeAdd(newEmpties,ms[0],ms[1])
                }
                empties = newEmpties;
            }
        } else {
            return []
        }
        return empties;
    }


    util_RangeAdd(empty, aGEInMS, aLTInMS) {
        let added = false;
        if (empty && empty.length > 0) {
            for (let i = empty.length - 1; i >=0 ; i--) {
                let ms = empty[i];
                if (aLTInMS < ms[0] || aGEInMS > ms[1]) {   //和本范围不交叉
                    continue;
                }
                if (aGEInMS >=ms[0] && aLTInMS <=ms[1]) // 如果被包容，则表示已添加过了。
                {
                    added = true;
                    break;
                } else {
                    if ((aGEInMS <= ms[0]) && (ms[1] <=aLTInMS)) {
                        ms[0] = aGEInMS;
                        ms[1] = aLTInMS;
                        added = true;
                        break;
                    } else {
                        if (aGEInMS < ms[0]) {
                            ms[0] = aGEInMS;
                        }
                        if (ms[1] < aLTInMS ) {
                            ms[1] = aLTInMS;
                        }
                        added = true;
                        break;
                    }
                }
            }
        }
        if (!added) {
            if (!empty) {
                empty = [[aGEInMS, aLTInMS,0]]
            } else {
                empty.push([aGEInMS, aLTInMS, 0])
            }
        }
        return empty;
    }
    util_RangeDel(empty, aGEInMS, aLTInMS) {
        if (empty && empty.length > 0) {
            let idxsTobeDel = new Array(empty.length);
            let delIdx = 0;
            let idxsTobeAdd = new Array(empty.length);
            let addIdx = 0;
            for (let i = 0; i < empty.length; i++) {
                let ms = empty[i];
                if (ms[0] >= ms[1]) {
                    idxsTobeDel[delIdx] = i;delIdx++;
                    continue;
                }
                if (aGEInMS <=ms[0] && aLTInMS>=ms[1]) {    //全包容
                    idxsTobeDel[delIdx] = i;delIdx++;
                    continue;
                };

                if (aGEInMS >=ms[1] || aLTInMS<ms[0]) { //完全不交叉
                    continue;
                }
                // 下面，一定是有交叉的了。
                if (aGEInMS<ms[0]) { //  头被覆盖住了。
                    ms[0]=aLTInMS;
                } else if (aLTInMS>=ms[1]) {   //尾巴被覆盖
                    ms[1]=aGEInMS;
                } else {        //这下就在中间了。
                    if (aLTInMS<ms[1]) {    //追加这部分
                        idxsTobeAdd[addIdx] = [aLTInMS,ms[1]];addIdx++;
                    }

                    if (aGEInMS>ms[0]) {
                        ms[1] = aGEInMS;
                    } else {
                        idxsTobeDel[delIdx] = i;
                        delIdx++;
                    }
                }
                if (ms[0] >= ms[1]) {
                    idxsTobeDel[delIdx] = i;delIdx++;
                    continue;
                }
            }
            if (delIdx>0) {
                for (let i = delIdx - 1 ; i >=0 ; i--) {
                    empty.splice(idxsTobeDel[i],1)
                };
            }
            if (addIdx>0) {
                for (let i = addIdx - 1 ; i >=0 ; i--) {
                    empty.push(idxsTobeAdd[i])
                };
            }
        }
        return empty;
    }

    util_PushToHead(aArray, aElement, aMaxLen) {
        if (!aArray) {
            aArray = [aElement]
        } else {
            aArray = [aElement].concat(aArray)
        }
        if (aMaxLen) {
            aArray = aArray.slice(0,aMaxLen);
        }
        return aArray
    }

    Empty_RangeCompact(aSym,aTyp) {
        let s = this;
        let empties = s.EmptyRange[aSym]
        if (!empties) {
            empties = {}
            s.EmptyRange[aSym] = empties
        }
        let empty = empties[aTyp]
        if (!empty) {
            empty = []
            empties[aTyp] = empty;
        }
        empty = s.util_RangeCompact(empty);
        empties[aTyp] = empty;
    }
    Empty_RangeAdd(aSym, aTyp, aGEInMS, aLTInMS) {
        let s = this;
        let empties = s.EmptyRange[aSym]
        if (!empties) {
            empties = {}
            s.EmptyRange[aSym] = empties
        }
        let empty = empties[aTyp]
        if (!empty) {
            empty = []
            empties[aTyp] = empty;
        }
        empty = s.util_RangeAdd(empty,aGEInMS,aLTInMS);
        empties[aTyp] = empty;
    }

    recoverMkt(){
        let s = this
        let subList = s.CtxPlaying.subList
        if(subList.length > 0){
            s.CtxPlaying.subList = []
            s.ReqSub(subList)
        }
    }

    getHistoryOrdAndTrdAndWltlog({AId}){
        let s = this
        let aType = AId.substr(-2)
        s.ReqTrdGetHistOrders({//历史委托
            AId: AId,
        }, function (aTrd, aArg) {
            if (aArg.code == 0) {
                for(let item of aArg.data){
                    FixObjWithSample(item,objectDefault.OrdDefault)//按照模板修改数据
                    aArg.data[item] = item
                }
                s.trdInfoStatus.historyOrd[aType] = 1
                s.HistoryOrders[aType] = aArg.data
                gEVBUS.emit(EV_GET_HISTORY_ORD_READY, {ev:EV_GET_HISTORY_ORD_READY, aType: aType, data: aArg.data})
            }
        })

        s.ReqTrdGetTrades({//成交记录
            AId: AId,
        }, function(aTrd, aArg){
            if(aArg.code == 0){
                // 获取历史数据之后先清空现有数据
                s.MyTrades_Obj[aType] = {}
                s.MyTrades[aType] = []
                //下边对数据进行储存
                s.trdInfoStatus.trade[aType] = 1
                s.MyTrades[aType] = aArg.data
                for(let item of aArg.data){
                    FixObjWithSample(item,objectDefault.TrdRecDefault)//按照模板修改数据
                    if(!s.MyTrades_Obj[aType][item.OrdId]){
                        s.MyTrades_Obj[aType][item.OrdId] = []
                    }
                    s.MyTrades_Obj[aType][item.OrdId].push(item)
                }
                gEVBUS.emit(EV_GET_HISTORY_TRD_READY, {ev:EV_GET_HISTORY_TRD_READY, aType: aType, data: aArg.data})
            }
        })

        s.ReqTrdGetWalletsLog({
            AId: AId,
        }, function(aTrd, aArg){
            if(aArg.code == 0){
                s.trdInfoStatus.wltLog[aType] = 1
                s.WltLog[aType] = aArg.data
                gEVBUS.emit(EV_GET_WLT_LOG_READY, {ev:EV_GET_WLT_LOG_READY, aType: aType, data: aArg.data})
            }
        })
    }

    setSocketUrl(url){
        let s = this
        s.Conf.Host = url
        s.close()
    }


}

export default Mkt
// {
//     Mkt
//     ,Typ2Sec
// }
