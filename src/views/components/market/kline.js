var m = require("mithril")

const DBG_getBars = true;
const DBG_TDataFeeder = true;
let Sym = ""
let Typ = ""

const container_id = "TradingViewContainer"
const MY_TIMEZONE = "Asia/Shanghai"

const EV_FUNC_PTR = "evFuncPtr"

class TDataFeeder {
    onReady(cb) {
        var cfgdata = {
            supported_resolutions: gMkt.Getsupported_resolutions()
        }
        setTimeout(function () {
            cb(cfgdata)
        }, 0)
    }
    searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
        /*
        ### searchSymbols(userInput, exchange, symbolType, onResultReadyCallback)

        1. `userInput`: string. It is text entered by user in the symbol search field.
        1. `exchange`: string. The requested exchange (chosen by user). Empty value means no filter was specified.
        1. `symbolType`: string. The requested symbol type: `index`, `stock`, `forex`, etc (chosen by user).
            Empty value means no filter was specified.
        1. `onResultReadyCallback`: function(result)
            1. `result`: array (see below)

        This call is intended to provide the list of symbols that match the user's search query. `result` is expected to look like the following:

        ```javascript
        [
            {
                "symbol": "<short symbol name>",
                "full_name": "<full symbol name>", // e.g. BTCE:BTCUSD
                "description": "<symbol description>",
                "exchange": "<symbol exchange name>",
                "ticker": "<symbol ticker name, optional>",
                "type": "stock" // or "futures" or "bitcoin" or "forex" or "index"
            },
            {
                //    .....
            }
        ]
        If no symbols are found, then callback should be called with an empty array. See more details about `ticker` value [here](Symbology#ticker)
        */
        if (DBG_TDataFeeder) { console.log(__filename, "TDataFeeder.searchSymbols", userInput, exchange, symbolType) }

    }
    resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
        /*
        ### resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback)

        1. `symbolName`: string. Symbol name or `ticker` if provided.
        1. `onSymbolResolvedCallback`: function([SymbolInfo](Symbology#symbolinfo-structure))
        1. `onResolveErrorCallback`: function(reason)

        Charting Library will call this function when it needs to get [SymbolInfo](Symbology#symbolinfo-structure) by symbol name.
        */

        var info = {
            "name": symbolName,//utils.getSymDisplayName(window.gMkt.AssetD, symbolName),
            "full_name": utils.getSymDisplayName(window.gMkt.AssetD, symbolName),
            "exchange-traded": symbolName,
            //"exchange-listed": symbolName,
            "timezone": MY_TIMEZONE,
            "minmov": 1,
            "minmov2": 0,
            "pointvalue": 1,
            "session": "24x7",
            "has_no_volume": false,
            // "description": 'https://www.gmex.io',
            "type": "bitcoin",
            "has_intraday": true,
            "supported_resolutions": gMkt.Getsupported_resolutions(),
            "intraday_multipliers": gMkt.Getsupported_resolutions(),
            "has_empty_bars": true,
            "force_session_rebuild": true,
            "data_status": "streaming",
            "pricescale": Math.pow(10, utils.KLine_pow(window.gMkt.AssetD, symbolName)),
            "ticker": symbolName,
            "volume_precision": 1,
        }
        setTimeout(function () {
            onSymbolResolvedCallback(info)
        }, 0)

        if (DBG_TDataFeeder) { console.log(__filename, "TDataFeeder.resolveSymbol", symbolName) }

    }

    getBars(symbolInfo, resolution, fromSec, toSec, onHistoryCallback, onErrorCallback, firstDataRequest) {
        /*
        ### getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest)

    1. `symbolInfo`: [SymbolInfo](Symbology#symbolinfo-structure) object
    1. `resolution`: string
    1. `from`: unix timestamp, leftmost required bar time
    1. `to`: unix timestamp, rightmost required bar time
    1. `onHistoryCallback`: function(array of `bar`s, `meta` = `{ noData = false }`)
        1. `bar`: object `{time, close, open, high, low, volume}`
        1. `meta`: object `{noData = true | false, nextTime - unix time}`
    1. `onErrorCallback`: function(reason)
    1. `firstDataRequest`: boolean to identify the first call of this method for the particular symbol resolution.
        When it is set to `true` you can ignore `to` (which depends on browser's `Date.now()`) and return bars up to the latest bar.

    This function is called when the chart needs a history fragment defined by dates range.

    The charting library assumes `onHistoryCallback` to be called **just once**.

    **Important**: `nextTime` is a time of the next bar in the history. It should be set if the requested period represents a gap in the data. Hence there is available data prior to the requested period.

    **Important**: `noData` should be set if there is no data in the requested period.

    **Remark**: `bar.time` is expected to be the amount of milliseconds since Unix epoch start in **UTC** timezone.

    **Remark**: `bar.time` for daily bars is expected to be a trading day (not session start day) at 00:00 UTC.
    Charting Library adjusts time according to [Session](Symbology#session) from SymbolInfo

    **Remark**: `bar.time` for monthly bars is the first trading day of the month without the time part
        symbolInfo = {
        name: "BTC.USDT", exchange-traded: "BTC.USDT", timezone: "Asia/Shanghai", minmov: 1, minmov2: 0, …}
        base_name: ["BTC.USDT"]
        data_status: "streaming"
        description: "https://www.gmex.io"
        exchange: undefined
        exchange-traded: "BTC.USDT"
        force_session_rebuild: true
        full_name: "BTC.USDT"
        has_empty_bars: true
        has_intraday: true
        has_no_volume: false
        intraday_multipliers: (15) ["1", "3", "5", "15", "30", "60", "120", "240", "360", "480", "720", "D", "3D", "W", "M"]
        legs: ["BTC.USDT"]
        minmov: 1
        minmov2: 0
        name: "BTC.USDT"
        pointvalue: 1
        pricescale: 100
        pro_name: "BTC.USDT"
        session: "24x7"
        supported_resolutions: (15) ["1", "3", "5", "15", "30", "60", "120", "240", "360", "480", "720", "1D", "3D", "1W", "1M"]
        ticker: "BTC.USDT"
        timezone: "Asia/Shanghai"
        type: "bitcoin"
        volume_precision: 1
        }
        */
        if(symbolInfo.name == 'new'){
            onHistoryCallback([], { noData: true });
            obj.setSymbol()
            return
        }
        let _Sym = symbolInfo.name == 'new'? gMkt.CtxPlaying.Typ: symbolInfo.name
        let _Typ = gMkt.Res2Typ[resolution];
        
        let assetD = window.gMkt.AssetD

        if (gMkt&& (Sym != _Sym || Typ != _Typ)) {
            if (Sym && Typ) {
                if (assetD[Sym]) {
                    gMkt.ReqUnSub(["kline_" + Typ + "_" + Sym, "trade_" + Sym])
                }
            }
            if (assetD[_Sym]) {
                gMkt.ReqSub(["kline_" + _Typ + "_" + _Sym, "trade_" + _Sym])
            }
            
            Typ = _Typ
            gMkt.CtxPlaying.Typ = _Typ
            Sym = _Sym
        }

        gMkt.CtxPlaying.Typ = _Typ;
        let interval = gMkt.Typ2Sec[_Typ]
        if (DBG_TDataFeeder) {
            console.log(__filename, "TDataFeeder.getBars", _Sym, resolution, fromSec, toSec, firstDataRequest, Math.floor((toSec - fromSec) / interval))
        }
        let start = Math.floor(fromSec / interval) * interval;
        let end = Math.ceil(toSec / interval) * interval;
        let bars = gMkt.AffirmKlineReqIfNeeded(_Sym, Typ, start, end, Math.floor((end - start) / interval))
        //        onHistoryCallback(bars,{noData:!firstDataRequest} );
        onHistoryCallback(bars, { noData: false });
    }

    subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
        /*
            ### subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback)

            1. `symbolInfo`: [SymbolInfo](Symbology#symbolinfo-structure) object
            1. `resolution`: string
            1. `onRealtimeCallback`: function(bar)
            1. `bar`: object `{time, close, open, high, low, volume}`
            1. `subscriberUID`: object
            1. `onResetCacheNeededCallback` *(since version 1.7)*: function() to be executed when bar data has changed

            Charting Library calls this function when it wants to receive real-time updates for a symbol. The Library assumes that you will call `onRealtimeCallback` every time you want to update the most recent bar or to add a new one.

            **Remark**: When you call `onRealtimeCallback` with bar having time equal to the most recent bar's time then the entire last bar is replaced with the `bar` object you've passed into the call.

            Example:

                1. The most recent bar is `{1419411578413, 10, 12, 9, 11}`
            1. You call `onRealtimeCallback({1419411578413, 10, 14, 9, 14})`
            1. Library finds out that the bar with the time `1419411578413` already exists and is the most recent one
            1. Library replaces the entire bar making the most recent bar `{1419411578413, 10, 14, 9, 14}`

        **Remark 2**: Is it possible either to update the most recent bar or to add a new one with `onRealtimeCallback`.
            You'll get an error if you call this function when trying to update a historical bar.

        **Remark 3**: There is no way to change historical bars once they've been received by the chart currently.
       */
        if (DBG_TDataFeeder) { console.log(__filename, "TDataFeeder.subscribeBars", symbolInfo.name, resolution) }
        gEVBUS.emit(EV_FUNC_PTR, { Ev: EV_FUNC_PTR, Name: "onResetCacheNeededCallback", Func: onResetCacheNeededCallback })
        gEVBUS.emit(EV_FUNC_PTR, { Ev: EV_FUNC_PTR, Name: "onRealtimeCallback", Func: onRealtimeCallback })

    }
    unsubscribeBars(subscriberUID) {
        if (DBG_TDataFeeder) { console.log(__filename, "TDataFeeder.unsubscribeBars", subscriberUID) }

        /*
        ### unsubscribeBars(subscriberUID)
        1. `subscriberUID`: object

        Charting Library calls this function when it doesn't want to receive updates for this subscriber any more. `subscriberUID` will be the same object that Library passed to `subscribeBars` before.
        */
    }


    onResetCacheNeededCallback() {

    }

}

let obj = {
    Sym: '',
    Typ: '',
    tradingviewReady: false,
    targetList: [
        // {
        //     name: 'VOL',
        //     title: 'Volume'
        // },
        // {
        //     name: 'MA',
        //     title: 'Moving Average'
        // },
        {
            name: 'MACD',
            title: 'Moving Average Convergence / Divergence'
        },
        {
            name: 'KDJ',
            title: 'Stochastic'
        },
        {
            name: 'BOLL',
            title: 'Bollinger Bands'
        },
        {
            name: 'EMA',
            title: 'Moving Average Exponential'
        },
        {
            name: 'StochRSI',
            title: 'Stochastic RSI'
        },
        {
            name: 'RSI',
            title: 'Relative Strength Index'
        },
        {
            name: 'CCI',
            title: 'Commodity Channel Index'
        },
        {
            name: 'ATR',
            title: 'Average True Range'
        },
        {
            name: 'SAR',
            title: 'Parabolic SAR'
        },
        {
            name: 'DMI',
            title: 'Directional Movement'
        },
        {
            name: 'OBV',
            title: 'On Balance Volume'
        },
        {
            name: 'ROC',
            title: 'Rate Of Change'
        },
    ],
    targetActive: {}, //tradingview选中的指标
    timeList: {
        '0': {
            type: '0',
            name: gDI18n.$t('10023'),//"分时",
            title: gDI18n.$t('10024'),//"分时图"
        },
        '1': {
            type: '1',
            name: "1m",
            title: gDI18n.$t('10025'),//"1分钟"
        },
        '3': {
            type: '3',
            name: "3m",
            title: gDI18n.$t('10026'),//"3分钟"
        },
        '5': {
            type: '5',
            name: "5m",
            title: gDI18n.$t('10027'),//"5分钟"
        },
        '30': {
            type: '30',
            name: "30m",
            title: gDI18n.$t('10028'),//"30分钟"
        },
        '60': {
            type: '60',
            name: "1h",
            title: gDI18n.$t('10029'),//"1小时"
        },
        '120': {
            type: '120',
            name: "2h",
            title: gDI18n.$t('10030'),//"2小时"
        },
        // '240': {
        //     type: '240',
        //     name: "4h",
        //     title: gDI18n.$t('10031'),//"4小时"
        // },
        'D': {
            type: 'D',
            name: "D",
            title: gDI18n.$t('10032'),//"1天"
        },
        'W': {
            type: 'W',
            name: "W",
            title: gDI18n.$t('10033'),//"1周"
        },
        'M': {
            type: 'M',
            name: "M",
            title: gDI18n.$t('10034'),//"1月"
        },
    },
    klineTimeListOpen: false,
    klineTargetListOpen: false,
    //平均线指标信息
    targetAverage: {
        MA5: {},
        MA10: {},
        MA60: {}
    },
    //初始化全局广播
    initEVBUS: function () {
        let that = this
        this.onResetCacheNeededCallback = null;
        this.onRealtimeCallback = null;

        //当前选中合约变化全局广播
        if (this.EV_CHANGESYM_UPD_unbinder) {
            this.EV_CHANGESYM_UPD_unbinder()
        }
        this.EV_CHANGESYM_UPD_unbinder = window.gEVBUS.on(gMkt.EV_CHANGESYM_UPD, arg => {
            that.setSymbol()
        })


        if (this.EV_HIST_UPD_unbinder) {
            this.EV_HIST_UPD_unbinder();
        }
        this.EV_HIST_UPD_unbinder = gEVBUS.on(gMkt.EV_HIST_UPD, arg => {
            let tv = window.gTvWidgetFT
            if (tv) {
                try {
                    tv = tv.chart();
                    if (tv) {
                        if ((tv.symbolExt().symbol == arg.Sym) && (gMkt.Res2Typ[tv.resolution()] == arg.Typ)) {
                            if (this.onResetCacheNeededCallback) {
                                this.onResetCacheNeededCallback();
                            }
                            tv.resetData();
                        }
                    }
                } catch (e) {
                    // 可以忽略这个错误，因为这时候Tradingview还没正确的初始化
                }
            }
        })

        if (this.EV_FUNC_PTR_unbinder) {
            this.EV_FUNC_PTR_unbinder();
        }
        this.EV_FUNC_PTR_unbinder = gEVBUS.on(EV_FUNC_PTR, arg => {
            switch (arg.Name) {
                case "onResetCacheNeededCallback":
                    this.onResetCacheNeededCallback = arg.Func
                    break;
                case "onRealtimeCallback":
                    this.onRealtimeCallback = arg.Func;
                    break;
            }
        })

        if (this.EV_REALTIME_UPD_unbinder) {
            this.EV_REALTIME_UPD_unbinder();
        }
        this.EV_REALTIME_UPD_unbinder = gEVBUS.on(gMkt.EV_REALTIME_UPD, arg => {
            /*
            {"subj":"trade","data":{"Sym":"BTC.USDT","At":1574573589537,"Prz":7182.5,"Dir":-1,"Sz":87,"Val":-3124.3875,"MatchID":"01DTDYCFZV3DCMX20744BQF5WW"}}
            */
            if (this.onRealtimeCallback) {
                let tv = window.gTvWidgetFT
                if (tv) {
                    try {
                        tv = tv.chart();
                        let d_d = arg.data;
                        if (tv && tv.symbolExt().symbol == d_d.Sym) {
                            let typ = gMkt.Res2Typ[tv.resolution()]
                            let kline = gMkt.AffirmKline(tv.symbolExt().symbol, typ)
                            let intervalInSec = gMkt.Typ2Sec[typ]
                            if (kline && kline.length > 0) {
                                let knode = kline[kline.length - 1]
                                let roundedAtInSec = Math.floor(d_d.At / (intervalInSec * 1000)) * intervalInSec
                                let rounded_knode_timeInSec = Math.floor(knode.time / (intervalInSec * 1000)) * intervalInSec;
                                let roundedAtInMS = roundedAtInSec * 1000

                                if (rounded_knode_timeInSec == roundedAtInSec) {
                                    this.onRealtimeCallback({
                                        Sec: roundedAtInMS,
                                        Turnover: knode.Turnover,
                                        //下面的数据采用TradingView格式
                                        time: roundedAtInMS,
                                        close: d_d.Prz,
                                        open: knode.open,
                                        high: knode.high > d_d.Prz ? knode.high : d_d.Prz,
                                        low: knode.low < d_d.Prz ? knode.low : d_d.Prz,
                                        volume: knode.volume + Math.abs(d_d.Sz),
                                    });
                                } else if (rounded_knode_timeInSec + intervalInSec == roundedAtInSec) {
                                    // 啥也别干了，直接等就是了。
                                    if (false) {
                                        // TODO 这里实际上需要取1条。
                                        gMkt.FillAndReqHistKLine2(d_d.Sym, typ, rounded_knode_timeInSec + intervalInSec, intervalInSec, (roundedAtInSec - rounded_knode_timeInSec) / intervalInSec);
                                        let roundedAtInMS = roundedAtInSec * 1000
                                        this.onRealtimeCallback({
                                            Sec: roundedAtInMS,
                                            Turnover: knode.Turnover,
                                            //下面的数据采用TradingView格式
                                            time: roundedAtInMS,
                                            close: d_d.Prz,
                                            open: knode.close,
                                            high: d_d.Prz,
                                            low: d_d.Prz,
                                            volume: Math.abs(d_d.Sz),
                                        });
                                    }
                                } else if (rounded_knode_timeInSec + intervalInSec < roundedAtInSec) {
                                    if (roundedAtInSec > rounded_knode_timeInSec) {
                                        gMkt.FillAndReqHistKLine2(d_d.Sym, typ, rounded_knode_timeInSec + intervalInSec, intervalInSec, (roundedAtInSec - rounded_knode_timeInSec) / intervalInSec);
                                        console.error("EV_REALTIME_UPD", d_d.Sym, "rounded_knode_time", rounded_knode_timeInSec, "roundedAt", "knode.time", knode.time, roundedAtInSec, "d_d.At", d_d.At)
                                    }
                                }
                            }
                        }
                    } catch (e) { }
                }
            }
        })

        if (this.EV_KLINE_UPD_unbinder) {
            this.EV_KLINE_UPD_unbinder();
        }
        this.EV_KLINE_UPD_unbinder = gEVBUS.on(gMkt.EV_KLINE_UPD, arg => {
            /*
            {"subj":"trade","data":{"Sym":"BTC.USDT","At":1574573589537,"Prz":7182.5,"Dir":-1,"Sz":87,"Val":-3124.3875,"MatchID":"01DTDYCFZV3DCMX20744BQF5WW"}}
            */
            if (this.onRealtimeCallback) {
                let tv = window.gTvWidgetFT
                if (tv) {
                    try {
                        tv = tv.chart();
                        let d_d = arg.data;
                        if (tv && tv.symbolExt().symbol == d_d.Sym) {
                            this.onRealtimeCallback(arg.data);
                        }
                    } catch (e) { }
                }
            }
        })

        //body点击事件广播
        if(this.EV_ClICKBODY_unbinder){
            this.EV_ClICKBODY_unbinder()
        }
        this.EV_ClICKBODY_unbinder = window.gEVBUS.on(gEVBUS.EV_ClICKBODY,arg=> {
            that.klineTimeListOpen = false
            that.klineTargetListOpen = false
        })

        if(this.EV_CHANGELOCALE_UPD_unbinder){
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD,arg=> {
            that.setKlineLanguage()
        })
        


    },
    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_CHANGESYM_UPD_unbinder) {
            this.EV_CHANGESYM_UPD_unbinder()
        }
        if (this.EV_HIST_UPD_unbinder) {
            this.EV_HIST_UPD_unbinder();
        }
        if (this.EV_FUNC_PTR_unbinder) {
            this.EV_FUNC_PTR_unbinder();
        }
        if (this.EV_REALTIME_UPD_unbinder) {
            this.EV_REALTIME_UPD_unbinder();
        }
        if (this.EV_KLINE_UPD_unbinder) {
            this.EV_KLINE_UPD_unbinder();
        }
        if(this.EV_ClICKBODY_unbinder){
            this.EV_ClICKBODY_unbinder()
        }
        if(this.EV_CHANGELOCALE_UPD_unbinder){
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
    },
    initKline: function () {
        let that = this

        // 设置k线模块高度 start
        if(window.isMobile){
            let height = window.innerHeight
            document.querySelector('.pub-layout-m .pub-kline .pub-kline-iframe').style.height = height/2+'px'
        }
        // 设置k线模块高度 end】

        window.gTvWidgetFT = new TradingView.widget({
            debug: false, // uncomment this line to see Library errors and warnings in the console
            fullscreen: false,
            autosize: true,
            symbol: gMkt.CtxPlaying.Sym || "new",
            interval: gMkt.Typ2Res[gMkt.CtxPlaying.Typ],
            container_id: "tv_chart_container",
            preset: window.isMobile?"mobile":'',
            //	BEWARE: no trailing slash is expected in feed URL
            datafeed: new TDataFeeder(),//new Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
            library_path: "./libs/tradingview/",
            locale: gDI18n.locale, //'zh',//this.getParameterByName('lang') || "en",
            timezone: "Asia/Shanghai",

            disabled_features: [
                "timeframes_toolbar",
                "go_to_date",
                "volume_force_overlay",
                'edit_buttons_in_legend',
                "control_bar",
                "header_screenshot",
                "header_saveload",
                "header_symbol_search",
                "legend_context_menu",
                "header_compare",
                "header_undo_redo",
                // "header_resolutions",
                // "header_interval_dialog_button",
                // "show_interval_dialog_on_key_press",
                "header_chart_type",
                // "header_indicators"
            ],
            enabled_features: [],
            charts_storage_url: 'http://saveload.tradingview.com',
            charts_storage_api_version: "1.1",
            client_id: 'tradingview.com',
            user_id: 'public_user_id',
            theme: 'Light',//this.getParameterByName('theme'),
            loading_screen: {
                backgroundColor: "#fff",
                foregroundColor: "#fff"
            },
            overrides: {
                'mainSeriesProperties.candleStyle.upColor': "#4DC49F",
                'mainSeriesProperties.candleStyle.downColor': "#FF5935",
                'mainSeriesProperties.candleStyle.drawWick': true,
                'mainSeriesProperties.candleStyle.drawBorder': true,
                'mainSeriesProperties.candleStyle.borderColor': "#fff",
                'mainSeriesProperties.candleStyle.borderUpColor': "#4DC49F",
                'mainSeriesProperties.candleStyle.borderDownColor': "#FF5935",
                'mainSeriesProperties.candleStyle.wickUpColor': '#4DC49F',
                'mainSeriesProperties.candleStyle.wickDownColor': '#FF5935',
                "paneProperties.legendProperties.showLegend": false, //左侧ma默认收缩
                // 'scalesProperties.showLeftScale': false,
                'paneProperties.legendProperties.showSeriesTitle': false, // 隐藏合约名称显示
            },
            favorites: {
                intervals: ["1", "5", "15", "30", "60", "120", "240", "D", "3D", "W"],
                chartTypes: [],//["candles", "Line"]
            },
            widgetbar: {
                details: false,
                watchlist: false,
            },
        });
        window.gTvWidgetFT.onChartReady(function () {
            that.tradingviewReady = true
            if (that.Sym) {
                that.setSymbol()
            }
            that.setMA()
        })
        window.gTvWidgetFT.headerReady().then(function () {
            function createHeaderButton(text, title, clickHandler, options) {
                var button = window.gTvWidgetFT.createButton(options);
                button.setAttribute('title', title);
                button.textContent = text;
                button.addEventListener('click', clickHandler);
            }

            // for(let key in that.timeList){
            //     let item = that.timeList[key]
            //     createHeaderButton(item.name, item.title, function() {
            //         that.setKCrossTime(item.type)
            //     });
            // }
            createHeaderButton(that.timeList[0].name, that.timeList[0].title, function () {
                that.setKCrossTime(that.timeList[0].type)
            });

            // for(let key in that.targetList){
            //     let item = that.targetList[key]
            //     createHeaderButton(item.name, item.title, function() {
            //         that.createTarget(item.name)
            //     },{
            //         align: 'right'
            //     });
            // }

        });

    },
    getParameterByName: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    setSymbol: function () {
        let that = this
        console.log(Sym)
        that.Sym = window.gMkt.CtxPlaying.Sym
        that.Typ = window.gMkt.CtxPlaying.Typ || '1m'
        if (window.gTvWidgetFT && that.tradingviewReady) {
            window.gTvWidgetFT.chart().setSymbol(that.Sym, function () {

            })
            console.log("tvWidget.setResolution", window.gTvWidgetFT.setResolution)

            window.gTvWidgetFT.chart().setResolution(gMkt.Typ2Res[that.Typ], function () {
            })
        }
    },
    createTarget: function (param) {
        if (this.targetActive.id) {
            gTvWidgetFT.chart().removeEntity(this.targetActive.id)
        }

        if (param == this.targetActive.name) {
            this.targetActive = {};
            return;
        };
        this.targetActive = {
            name: param
        }

        switch (param) {
            case 'VOL':
                gTvWidgetFT.chart().createStudy('Volume', false, false, null, (data) => {
                    this.targetActive.id = data;
                })
                break;
            case 'MA':
                gTvWidgetFT.chart().createStudy('Moving Average', false, false, [30], (data) => {
                    this.targetActive.id = data;
                }, {
                    "Plot.color.0": '#02AE8D',
                    'Plot.linewidth': 2
                })
                break;
            case 'MACD':
                gTvWidgetFT.chart().createStudy("MACD", false, false, [14, 30, "close", 9], (data) => {
                    this.targetActive.id = data;
                }, {
                    "Histogram.color": '#D04B65',
                    "MACD.color": '#84aad5',
                    "Signal.color": '#02AE8D',
                    "Histogram.linewidth": 2,
                    "MACD.linewidth": 4,
                    "Signal.linewidth": 4,
                })

                break;
            case 'KDJ':
                gTvWidgetFT.chart().createStudy('Stochastic', false, false, [26], (data) => {
                    this.targetActive.id = data;
                }, {
                    "%d.color": '#02AE8D',
                    "%k.color": '#84aad5',
                    "%d.linewidth": 4,
                    "%k.linewidth": 4,
                    "UpperLimit.color": '#6577A4', //dark：'#385181',
                    "UpperLimit.linewidth": 4,
                    "LowerLimit.color": '#6577A4', //dark：'#385181',
                    "LowerLimit.linewidth": 4,
                    "Hlines Background.color": '#EAF0FF', //dark： '#1C2332',
                })
                break;
            case 'BOLL':
                gTvWidgetFT.chart().createStudy('Bollinger Bands', false, false, [20], (data) => {
                    this.targetActive.id = data;
                }, {
                    'Median.color': '#84aad5',
                    'Median.linewidth': 4,
                    'Upper.color': '#02AE8D',
                    'Upper.linewidth': 4,
                    'Lower.color': '#965fc4',
                    'Lower.linewidth': 4,
                    "Plots Background.color": '#EAF0FF', //dark： '#1C2332',
                })
                break;
            case 'EMA':
                gTvWidgetFT.chart().createStudy('Moving Average Exponential', false, false, [26], (data) => {
                    this.targetActive.id = data;
                }, {
                    "Plot.color": '#84aad5',
                    'Plot.linewidth': 4
                })
                break;
            case 'StochRSI':
                gTvWidgetFT.chart().createStudy('Stochastic RSI', false, false, [20], (data) => {
                    this.targetActive.id = data;
                }, {
                    "%d.color": '#02AE8D',
                    "%k.color": '#84aad5',
                    "%d.linewidth": 4,
                    "%k.linewidth": 4,
                    "UpperLimit.color": '#6577A4', //dark：'#385181',
                    "UpperLimit.linewidth": 4,
                    "LowerLimit.color": '#6577A4', //dark：'#385181',
                    "LowerLimit.linewidth": 4,
                    "Hlines Background.color": '#EAF0FF', //dark： '#1C2332',
                })
                break;
            case 'RSI':
                gTvWidgetFT.chart().createStudy('Relative Strength Index', false, false, [14], (data) => {
                    this.targetActive.id = data;
                }, {
                    'Plot.color': '#84aad5',
                    'Plot.linewidth': 4,
                    "UpperLimit.color": '#6577A4', //dark：'#385181',
                    "UpperLimit.linewidth": 4,
                    "LowerLimit.color": '#6577A4', //dark：'#385181',
                    "LowerLimit.linewidth": 4,
                    "Hlines Background.color": '#EAF0FF', //dark： '#1C2332',
                })
                break;
            case 'CCI':
                gTvWidgetFT.chart().createStudy('Commodity Channel Index', false, false, [20], (data) => {
                    this.targetActive.id = data;
                }, {
                    'Plot.color': '#84aad5',
                    'Plot.linewidth': 4,
                    "UpperLimit.color": '#6577A4', //dark：'#385181',
                    "UpperLimit.linewidth": 4,
                    "LowerLimit.color": '#6577A4', //dark：'#385181',
                    "LowerLimit.linewidth": 4,
                    "Hlines Background.color": '#EAF0FF', //dark： '#1C2332',
                })
                break;
            case 'ATR':
                gTvWidgetFT.chart().createStudy('Average True Range', false, false, [14], (data) => {
                    this.targetActive.id = data;
                }, {
                    'Plot.color': '#84aad5',
                    'Plot.linewidth': 4
                })
                break;
            case 'SAR':
                gTvWidgetFT.chart().createStudy('Parabolic SAR', false, false, [0.02], (data) => {
                    this.targetActive.id = data;
                }, {
                    'Plot.color': '#84aad5',
                    'Plot.linewidth': 2
                })
                break;
            case 'DMI':
                gTvWidgetFT.chart().createStudy('Directional Movement', false, false, [14], (data) => {
                    this.targetActive.id = data;
                }, {
                    "+DI.color": '#02AE8D',
                    "+DI.linewidth": 4,
                    "-DI.color": '#84aad5',
                    "-DI.linewidth": 4,
                    "ADX.color": '#965fc4',
                    "ADX.linewidth": 4,
                })
                break;
            case 'OBV':
                gTvWidgetFT.chart().createStudy('On Balance Volume', false, false, null, (data) => {
                    this.targetActive.id = data;
                }, {
                    'Plot.color': '#84aad5',
                    'Plot.linewidth': 4
                })
                break;
            case 'ROC':
                gTvWidgetFT.chart().createStudy('Rate Of Change', false, false, [14], (data) => {
                    this.targetActive.id = data;
                }, {
                    'ROC.color': '#84aad5',
                    'ROC.linewidth': 4
                })
                break;
        }
    },
    setKCrossTime: function (val) {
        let that = this;

        if (!window.gTvWidgetFT) return
        if (val != '0') {
            window.gTvWidgetFT.chart().setChartType(1)
            this.setMA();
        }
        switch (val) {
            case '0':
                if (window.gTvWidgetFT.chart().chartType() == 1) {
                    if (this.targetAverage.MA5.id) {
                        gTvWidgetFT.chart().removeEntity(this.targetAverage.MA5.id)
                        this.targetAverage.MA5.id = null;
                    }
                    if (this.targetAverage.MA10.id) {
                        gTvWidgetFT.chart().removeEntity(this.targetAverage.MA10.id)
                        this.targetAverage.MA10.id = null;
                    }
                    window.gTvWidgetFT.chart().setChartType(3)
                    window.gTvWidgetFT.chart().setResolution('1', () => { // 1代表1分钟

                    });
                } else if (window.gTvWidgetFT.chart().chartType() == 3) {
                    window.gTvWidgetFT.chart().setChartType(1)
                    this.setMA();
                }
                break;
            default:
                window.gTvWidgetFT.setSymbol(this.selectInst, val, function () {

                })
        }
    },
    setMA: function () {
        let that = this;
        if (this.targetAverage.MA60.id) {
            gTvWidgetFT.chart().removeEntity(this.targetAverage.MA60.id)
            this.targetAverage.MA60.id = null
        }
        if (!that.targetAverage.MA5.id) {
            gTvWidgetFT.chart().createStudy('Moving Average', false, false, [5], (data) => {
                that.targetAverage.MA5.id = data;
            }, {
                "Plot.color.0": '#965fc4',
                "Plot.linewidth": 4
            })
        }
        if (!that.targetAverage.MA10.id) {
            gTvWidgetFT.chart().createStudy('Moving Average', false, false, [10], (data) => {
                that.targetAverage.MA10.id = data;
            }, {
                "Plot.color.0": '#84aad5',
                "Plot.linewidth": 4
            })
        }
    },
    getTimeList: function(){
        let that = this
        let timeList = Object.keys(this.timeList)
        return timeList.map((key, i) =>{
            let item = that.timeList[key]
            return m('button', {key: "klineTimeListItem"+i,class: "button"+(gMkt.CtxPlaying.Typ == item.name?' has-text-primary':''), onclick: function(){
                obj.setKCrossTime(item.type)
            }}, [
                item.title
            ])
        })
    },
    getTargetList: function(){
        let that = this
        let timeList = Object.keys(this.targetList)
        return timeList.map((key, i) =>{
            let item = that.targetList[key]
            return m('button', {key: "klineTimeListItem"+i,class: "button"+(obj.targetActive.name == item.name?' has-text-primary':''), onclick: function(){
                obj.createTarget(item.name)
                
            }}, [
                item.name
            ])
        })
    },
    setKlineLanguage(){
        let locale = gDI18n.locale
        if(locale == "zh" || locale == "tw"){
            window.gTvWidgetFT?window.gTvWidgetFT.setLanguage('zh'):''
        }else {
            window.gTvWidgetFT?window.gTvWidgetFT.setLanguage('en'):''
        }
    }
}

export default {
    oninit: function (vnode) {

    },
    oncreate: function (vnode) {
        obj.initEVBUS()
        obj.initKline()
    },
    view: function (vnode) {

        return m("div", { class: "pub-kline"+(window.isMobile?'':' box') }, [
            m('div', {class:"pub-kline-btns buttons has-addons is-hidden-desktop"}, [
                // m('button', {class:"button is-selected"}, [
                //     '分时'
                // ]),
                m('div', {class:"dropdown is-hidden-desktop"+(obj.klineTimeListOpen?' is-active':'')}, [
                    m('div', {class:"dropdown-trigger", onclick: function(e){
                        obj.klineTimeListOpen = !obj.klineTimeListOpen
                        window.stopBubble(e)
                    }}, [
                        m('button', {class:"button is-selected"+(obj.klineTimeListOpen?' has-text-primary':'')}, [
                            gDI18n.$t('10023')//'分时'
                        ]),
                    ]),
                    m('div', {class:"dropdown-menu"}, [
                        m('div', {class:"dropdown-content"}, [
                            obj.getTimeList()
                        ]),
                    ]),
                ]),
                m('button', {class:"button is-selected"+(gMkt.CtxPlaying.Typ == '1m'?' has-text-primary':''), onclick: function(){
                    obj.setKCrossTime('1')
                    // obj.klineTimeListOpen = false
                }}, [
                    gDI18n.$t('10442')//'1分'
                ]),
                m('button', {class:"button is-selected"+(gMkt.CtxPlaying.Typ == '30m'?' has-text-primary':''), onclick: function(){
                    obj.setKCrossTime('30')
                    // obj.klineTimeListOpen = false
                }}, [
                    gDI18n.$t('10443')//'30分'
                ]),
                m('button', {class:"button is-selected"+(gMkt.CtxPlaying.Typ == '1h'?' has-text-primary':''), onclick: function(){
                    obj.setKCrossTime('60')
                    // obj.klineTimeListOpen = false
                }}, [
                    gDI18n.$t('10469')//'1小时'
                ]),
                
                m('div', {class:"dropdown is-hidden-desktop is-right"+(obj.klineTargetListOpen?' is-active':'')}, [
                    m('div', {class:"dropdown-trigger", onclick: function(e){
                        obj.klineTargetListOpen = !obj.klineTargetListOpen
                        window.stopBubble(e)
                    }}, [
                        m('button', {class:"button is-selected"}, [
                            gDI18n.$t('10435')//'指标'
                        ]),
                    ]),
                    m('div', {class:"dropdown-menu"}, [
                        m('div', {class:"dropdown-content"}, [
                            obj.getTargetList()
                        ]),
                    ]),
                ]),
            ]),
            
            /**
             * <div class="buttons has-addons">
                <button class="button is-success is-selected">Yes</button>
                <button class="button">Maybe</button>
                <button class="button">No</button>
                </div>
             */
            m("div", { class: "pub-kline-iframe"}, [
                m('#tv_chart_container', { class: "" })
            ])
        ])
    },
    onbeforeremove: function (vnode) {
        if (window.gTvWidgetFT) {
            window.gTvWidgetFT.remove()
            window.gTvWidgetFT = null
        }
        obj.rmEVBUS()
    },
}