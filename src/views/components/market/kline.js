import {dispose, init} from 'klinecharts'
var m = require("mithril")


let obj = {
    Sym: '',
    Typ: '',
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
    inter_obj: {
        "1": 60000,
        '3': 180000,
        "5": 300000,
        "15": 900000,
        "30": 1800000,
        "60": 3600000,
        '120': 7200000,
        '240': 14400000,
        '360': 21600000,
        '480': 28800000,
        '720': 43200000,
        "D": 86400000,
        '3D': 259200000,
        "W": 604800000
    },
    TypK: {
        '1': '1m',
        '3': '3m',
        '5': '5m',
        '15': '15m',
        '30': '30m',
        '60': '1h',
        '120': '2h',
        '240': '4h',
        '360': '6h',
        '480': '8h',
        '720': '12h',
        'D': '1d',
        '3D': '3d',
        'W': '1w',
        'M': '1M'
    },
    TypK2: {
        '1m': '1',
        '3m': '3',
        '5m': '5',
        '15m': '15',
        '30m': '30',
        '1h': '60',
        '2h': '120',
        '4h': '240',
        '6h': '360',
        '8h': '480',
        '12h': '720',
        '1d': 'D',
        '3d': '3D',
        '1w': 'W',
        '1M': 'M'
    },
    historyKline: {},
    isGetKlineDataLoading: false, //是否正在获取数据
    getKlineTimeoutTimer: null,
    klineShow: false,
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

        if (this.EV_REALTIME_UPD_unbinder) {
            this.EV_REALTIME_UPD_unbinder();
        }
        this.EV_REALTIME_UPD_unbinder = gEVBUS.on(gMkt.EV_REALTIME_UPD, arg => {
            /*
            {"subj":"trade","data":{"Sym":"BTC.USDT","At":1574573589537,"Prz":7182.5,"Dir":-1,"Sz":87,"Val":-3124.3875,"MatchID":"01DTDYCFZV3DCMX20744BQF5WW"}}
            */
            this.updateKlineForTrade(arg)
        })

        if (this.EV_KLINE_UPD_unbinder) {
            this.EV_KLINE_UPD_unbinder();
        }
        this.EV_KLINE_UPD_unbinder = gEVBUS.on(gMkt.EV_KLINE_UPD, arg => {
            /*
            {"subj":"kline","data":{}}
            */
            this.updateKline(arg)
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
            // that.setKlineLanguage()
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
    
    setSymbol: function () {
        let that = this
        this.Sym = window.gMkt.CtxPlaying.Sym
        this.Typ = window.gMkt.CtxPlaying.Typ || '1m'
        this.setKcross()
    },
    createTarget: function (param) {
        return
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
        return

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
                window.gTvWidgetFT.setSymbol(this.Sym, val, function () {

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
    setKcross() {
        console.log(window._chart, this.Sym)
        this.klineShow = true
        if (window._chart) {
            if (this.Sym) {
                this.setKlineData()
            }
        } else{
            this.initChart();
        }
    },
    initChart() {
        let self = this;
        if (window._chart) return;
        let lineColor = "#f4f4f4"
        let fontPrimary = "#111"
        let fontSecondary = "#8e8e8e"
        let upColor = "#48c774"
        let downColor = "#f14668"
        let promptFont = "#f6f6f6"
        let fontSize = window.isMobile? 8: 12
        console.log('init chart')
        // 初始化图表
        window._chart = init("tv_chart_container", {
            grid: {
                display: true,
                horizontal: {
                    display: true,
                    size: 1,
                    color: lineColor,
                    // 'solid'|'dash'
                    style: "dash",
                    dashValue: [2, 2]
                },
                vertical: {
                    display: true,
                    size: 1,
                    color: lineColor,
                    // 'solid'|'dash'
                    style: "dash",
                    dashValue: [2, 2]
                }
            },
            candleStick: {
                bar: {
                    // 'solid'|'stroke'|'up_stroke'|'down_stroke'|'ohlc'
                    style: "solid",
                    upColor: upColor, //"#26A69A",
                    downColor: downColor, //"#EF5350",
                    noChangeColor: upColor, //"#666666"
                },
                priceMark: {
                    display: true,
                    high: {
                        display: true,
                        color: fontPrimary,
                        textMargin: 5,
                        textSize: fontSize,
                        textFamily: "Roboto"
                    },
                    low: {
                        display: true,
                        color: fontPrimary,
                        textMargin: 5,
                        textSize: fontSize,
                        textFamily: "Roboto"
                    },
                    last: {
                        display: true,
                        upColor: upColor,
                        downColor: downColor,
                        noChangeColor: "#666666",
                        line: {
                            display: true,
                            // 'solid'|'dash'
                            style: "dash",
                            dashValue: [4, 4],
                            size: 1
                        },
                        text: {
                            display: true,
                            size: fontSize,
                            paddingLeft: 2,
                            paddingTop: 2,
                            paddingRight: 2,
                            paddingBottom: 2,
                            color: "#FFFFFF",
                            family: "Roboto"
                        }
                    }
                }
            },
            realTime: {
                timeLine: {
                    color: "#1e88e5",
                    size: 1,
                    areaFillColor: "rgba(30, 136, 229, 0.08)"
                },
                averageLine: {
                    display: true,
                    color: "#F5A623",
                    size: 1
                }
            },
            technicalIndicator: {
                bar: {
                    upColor: upColor, //"#26A69A",
                    downColor: downColor, //"#EF5350",
                    noChangeColor: upColor, //"#666666"
                },
                line: {
                    size: 1,
                    colors: [
                        '#965fc4', 
                        '#84aad5',
                        '#02AE8D',
                        "#F601FF", 
                        "#1587DD", 
                        "#1e88e5"
                    ]
                },
                lastValueMark: {
                    display: false,
                    textColor: "#ffffff",
                    textSize: fontSize,
                    textFamily: "Roboto",
                    textPaddingLeft: 3,
                    textPaddingTop: 2,
                    textPaddingRight: 3,
                    textPaddingBottom: 2
                }
            },
            xAxis: {
                display: true,
                maxHeight: 50,
                minHeight: 10,
                axisLine: {
                    display: true,
                    color: lineColor ,
                    size: 1
                },
                tickText: {
                    display: true,
                    color: fontSecondary,
                    family: "Roboto",
                    size: fontSize,
                    margin: 6
                },
                tickLine: {
                    display: true,
                    size: 1,
                    length: 3,
                    color: lineColor
                }
            },
            yAxis: {
                display: true,
                maxWidth: 100,
                minWidth: 60,
                // 'left' | 'right'
                position: "right",
                // 'normal' | 'percentage'
                type: "normal",
                axisLine: {
                    display: true,
                    color: lineColor,
                    size: 1
                },
                tickText: {
                    // 'outside' | 'inside'
                    position: "inside",
                    display: true,
                    color: fontSecondary,
                    family: "Roboto",
                    size: fontSize,
                    margin: 6
                },
                tickLine: {
                    display: true,
                    size: 1,
                    length: 3,
                    color: lineColor
                }
            },
            separator: {
                size: 1,
                color: lineColor,
                fill: true
            },
            floatLayer: {
                crossHair: {
                    display: true,
                    horizontal: {
                        display: true,
                        line: {
                            display: true,
                            // 'solid'|'dash'
                            style: "dash",
                            dashValue: [4, 2],
                            size: 1,
                            color: fontSecondary
                        },
                        text: {
                            display: true,
                            color: fontPrimary, // "#D9D9D9",
                            size: fontSize,
                            family: "Roboto",
                            paddingLeft: 0,
                            paddingRight: 0,
                            paddingTop: 2,
                            paddingBottom: 2,
                            borderSize: 1,
                            borderColor: lineColor,
                            backgroundColor: lineColor
                        }
                    },
                    vertical: {
                        display: true,
                        line: {
                            display: true,
                            // 'solid'|'dash'
                            style: "dash",
                            dashValue: [4, 2],
                            size: 1,
                            color: fontSecondary
                        },
                        text: {
                            display: true,
                            color: fontPrimary, //"#D9D9D9",
                            size: fontSize,
                            family: "Roboto",
                            paddingLeft: 0,
                            paddingRight: 0,
                            paddingTop: 2,
                            paddingBottom: 2,
                            borderSize: 1,
                            borderColor: lineColor,
                            backgroundColor: lineColor
                        }
                    }
                },
                prompt: {
                    // 'always' | 'follow_cross' | 'none'
                    displayRule: "follow_cross",
                    candleStick: {
                        // 'standard' | 'rect'
                        showType: window.isMobile?"rect":"standard",
                        //   ["时间", "开", "收", "高", "低", "成交量"],
                        labels: ["时间", "开", "收", "高", "低", "成交量"],
                        values: null,
                        rect: {
                            paddingLeft: 6,
                            paddingRight: 6,
                            paddingTop: 6,
                            paddingBottom: 6,
                            left: 8,
                            top: 8,
                            right: 30,
                            borderRadius: 4,
                            borderSize: 1,
                            borderColor: lineColor, //"#3f4254",
                            fillColor: "rgba(17, 17, 17, .7)"
                        },
                        text: {
                            size: fontSize,
                            color: window.isMobile?promptFont:fontPrimary,
                            family: "Roboto",
                            marginLeft: 0,
                            marginTop: 0,
                            marginRight: 0,
                            marginBottom: 6
                        }
                    },
                    technicalIndicator: {
                        text: {
                            size: fontSize,
                            family: "Roboto",
                            color: fontPrimary,
                            marginTop: 6,
                            marginRight: 8,
                            marginBottom: 0,
                            marginLeft: 0
                        },
                        point: {
                            display: false,
                            radius: 3
                        }
                    }
                }
            },
            graphicMark: {
                line: {
                    color: "#1e88e5",
                    size: 1
                },
                point: {
                    backgroundColor: "#1e88e5",
                    borderColor: "#1e88e5",
                    borderSize: 1,
                    radius: 4,
                    activeBackgroundColor: "#1e88e5",
                    activeBorderColor: "#1e88e5",
                    activeBorderSize: 1,
                    activeRadius: 6
                },
                text: {
                    color: "#1e88e5",
                    size: fontSize,
                    family: "Roboto",
                    marginLeft: 2,
                    marginRight: 2,
                    marginTop: 2,
                    marginBottom: 6
                }
            }
        });
        window._chart.setDataSpace(1)
        window._chart.addTechnicalIndicator('VOL', 80, false)
        window._chart.setTechnicalIndicatorParams('VOL', [])
        // window._chart.setOffsetRightSpace(50)
        // window._chart.setLeftMinVisibleBarCount(50)
        // window._chart.setRightMinVisibleBarCount(50)
        // 设置k线柱的宽度
        window._chart.setDataSpace(8)
        window._chart.loadMore(this.loadMoreKline)
        window._chart.Sym = ''
        window._chart.Typ = ''
        this.setKlineData()

    },
    setKlineData(){
        if(!window._chart || !this.Sym || !this.Typ) return
        this.klineShow = true
        // 清除图表数据
        window._chart.clearData();
        let Sym = this.Sym
        let Typ = this.Typ;
        let ass = window.gMkt.AssetD[Sym] || {}
        if(Typ == '0'){
            window._chart.setCandleStickChartType('real_time')
        }else{
            window._chart.setCandleStickChartType('candle_stick')
        }
        Typ = Typ == '0'?'1':Typ
        if(window._chart.Sym != Sym || window._chart.Typ != Typ){
            if(window._chart.Sym && window._chart.Typ){
                gMkt.ReqUnSub(["kline_" + Typ + "_" + Sym])
            }
            gMkt.ReqSub(["kline_" + Typ + "_" + Sym])
            // 此时更改k线获取状态为false，可以继续获取k线数据
            this.isGetKlineDataLoading = false
            window._chart.Sym = Sym
            window._chart.Typ = Typ
        }
        
        // 检查是否有历史数据
        if(!this.historyKline[Sym]){
            this.historyKline[Sym] = {}
            this.historyKline[Sym][Typ] = []
            // 此时没有数据，需要获取最新k线历史数据
            this.getLastKlineData()
            window._chart.applyNewData([]);
        }else if(!this.historyKline[Sym][Typ]){
            this.historyKline[Sym][Typ] = []
            // 此时没有数据，需要获取最新k线历史数据
            this.getLastKlineData()
            window._chart.applyNewData([]);
        }else if(this.historyKline[Sym][Typ] && this.historyKline[Sym][Typ].length > 0 && this.historyKline[Sym][Typ].length < 100){
            window._chart.applyNewData(this.historyKline[Sym][Typ]);
            window._chart.setOffsetRightSpace(50)
            // 小于100条时重新获取最新数据，此时获取最新数据并覆盖原有数据
            this.getLastKlineData()
        }else if(this.historyKline[Sym][Typ] && this.historyKline[Sym][Typ].length > 0){
            window._chart.applyNewData(this.historyKline[Sym][Typ]);
            window._chart.setOffsetRightSpace(50)
            // 检查是否需要补充最新数据
            let now = Date.now()
            let historyKline = this.historyKline[Sym][Typ]
            let lastKlineData = historyKline[historyKline.length - 1]
            let interval = this.inter_obj[Typ]
            if(now - lastKlineData.timestamp >= interval){
                let count = Math.ceil((now - lastKlineData.timestamp)/interval)
                this.loadMoreKline(now, count+10, 'addNew')
            }
            this.klineShow = false
        }else{
            // 此时没有数据，需要获取最新k线历史数据
            this.getLastKlineData()
            window._chart.applyNewData([]);
        }
        let PrzMinIncSize = utils.getFloatSize( utils.getFullNum(ass.PrzMinInc || 0) );
        let VolMinValSize = utils.getFloatSize(ass.Mult || 0);

        if(Sym.includes('GMEX_CI')){
            // 处理指数小数位
            let lastPrz = (this.lastTick[Sym] && this.lastTick[Sym].Prz || 0).toPrecision2(6,8)
            lastPrz = lastPrz.toString().split('.')[1]
            PrzMinIncSize = lastPrz.length
        }
        window._chart.setPrecision(PrzMinIncSize, VolMinValSize)
    },
    // 获取最近历史数据
    getLastKlineData() {
        let that = this
        if(!window._chart || !this.Sym) return
        
        let Sym = window._chart.Sym
        let Typ = window._chart.Typ || '1m';
        Typ = Typ == '0'?'1':Typ
        if(this.isGetKlineDataLoading) return
        this.isGetKlineDataLoading = true
        gMkt.ReqKLineLastest({
            Sym: Sym,
            Typ: Typ,
            Count: 300
        }, function(aTrd, arg){
            console.log("GetLatestKLine", arg);
            if (arg.code == 0) {
                that.applyNewDataToChart(arg)
            }
            if(that.getKlineTimeoutTimer){
                clearTimeout(that.getKlineTimeoutTimer)
                that.getKlineTimeoutTimer = null
            }
            that.isGetKlineDataLoading = false
        })

        if(this.getKlineTimeoutTimer){
            clearTimeout(that.getKlineTimeoutTimer)
            this.getKlineTimeoutTimer = null
        }
        this.getKlineTimeoutTimer = setTimeout(()=>{
            that.isGetKlineDataLoading = false
            that.getLastKlineData()
        }, 3*1000)
    },
    // 获取更多历史k线
    loadMoreKline(tm, count, type) {
        console.log('loadMoreKline need more data', tm, count, this.isGetKlineDataLoading, window._chart, this.Sym, window._chart.Sym)
        let that = obj
        if(!window._chart || !window._chart.Sym) return
        let Count = count?count:100
        let Sym = window._chart.Sym
        let Typ = window._chart.Typ || '1m';
        Typ = Typ == '0'?'1m':Typ
        let Sec = Math.floor((tm - that.inter_obj[that.TypK2[Typ]] * Count) / 1000)
        if(that.isGetKlineDataLoading) return
        that.isGetKlineDataLoading = true
        gMkt.ReqKLineHist({
            Sym: Sym,
            Typ: Typ,
            Sec: Sec,
            Offset: 0,
            Count: Count
        }, function(aTrd, arg){
            console.log("GetLatestKLine", arg);
            if (arg.code == 0) {
                that.applyNewDataToChart(arg, type || 'upd', arg.data.Count == Count)
            }
            if(that.getKlineTimeoutTimer){
                clearTimeout(that.getKlineTimeoutTimer)
                that.getKlineTimeoutTimer = null
            }
            that.isGetKlineDataLoading = false
        })
        
        if(that.getKlineTimeoutTimer){
            clearTimeout(that.getKlineTimeoutTimer)
            that.getKlineTimeoutTimer = null
        }
        that.getKlineTimeoutTimer = setTimeout(()=>{
            that.isGetKlineDataLoading = false
            that.loadMoreKline(tm, count, type)
        }, 3*1000)
    },
    // k线数据填充
    applyNewDataToChart(arg, type, more) {
        console.log(arg, type, more)
        if(!window._chart) return
        
        let Sym = arg.data.Sym
        let Typ = arg.data.Typ
        Typ = Typ == '0'?'1m':Typ
        let klineList = [];0
        if (arg.data.Sec && arg.data.Sec.length > 0) {
            let interval = this.inter_obj[this.TypK2[Typ]] || 1000
            for (let i = 0; i < arg.data.Sec.length; i++) {
                let obj = {
                    open: arg.data.PrzOpen[i],
                    close: arg.data.PrzClose[i],
                    high: arg.data.PrzHigh[i],
                    low: arg.data.PrzLow[i],
                    volume: arg.data.Volume[i],
                    turnover: (arg.data.PrzOpen[i] + arg.data.PrzClose[i] + arg.data.PrzHigh[i] + arg.data.PrzLow[i]) / 4 * arg.data.Volume[i],
                    timestamp: arg.data.Sec[i] * 1000
                }
                if (type == 'addNew') {
                    // 更新最近几条数据时，检查是否可以更新
                    let historyKline = this.historyKline[Sym] && this.historyKline[Sym][Typ] || []
                    if(historyKline.length > 0){
                        if(obj.timestamp >= historyKline[historyKline.length - 1].timestamp){
                            klineList.push(obj);
                        }
                    }else{
                        klineList.push(obj);
                    }
                }else if(this.historyKline[Sym] && this.historyKline[Sym][Typ]){
                    let i = this.historyKline[Sym][Typ].findIndex(item =>{
                        return item.timestamp == obj.timestamp
                    })
                    if(i == -1){
                        klineList.push(obj);
                    }
                }else{
                    klineList.push(obj);
                }
                
            }
            klineList.sort(function(a, b) {
                return a.timestamp - b.timestamp;
            });
        }
        
        if(this.historyKline[Sym] && this.historyKline[Sym][Typ]){
            // if(!type && this.historyKline[Sym][Typ].length > 0){
            //     // 此时最新历史数据已经存在，不需要继续填充数据
            //     return
            // }
            for(let item of klineList){
                let i = this.historyKline[Sym][Typ].findIndex(it =>{
                    return item.timestamp == it.timestamp
                })
                if(i != -1){
                    // 此时需要新增的数据有重复，需进行数据覆盖
                    this.historyKline[Sym][Typ][i] = item
                }else{
                    this.historyKline[Sym][Typ].push(item)
                }
            }
            // this.historyKline[Sym][Typ] = klineList.concat(this.historyKline[Sym][Typ])
            this.historyKline[Sym][Typ].sort(function(a, b) {
                return a.timestamp - b.timestamp;
            });
        }

        if (type == 'addNew') {
            // window._chart.applyNewDataToChart(this.historyKline[Sym][Typ]);
            for(let item of klineList){
                // console.log('update for new Data ', item.timestamp, new Date(item.timestamp), item, this.historyKline[Sym][Typ])
                window._chart.updateData(item)
            }
        } else if (type == 'upd') {
            window._chart.applyMoreData(klineList, more == false ? false : true);
        } else {
            window._chart.applyNewData(this.historyKline[Sym][Typ]);
            window._chart.setOffsetRightSpace(50)
        }
        this.klineShow = false
    },
    updateKlineForTrade(param){
        let arg = param.data
        console.log('updateKlineForTrade', arg)
        let Sym = window._chart.Sym
        let Typ = window._chart.Typ || '1m';
        if (window._chart && Sym == window._chart.Sym) {
            Typ = Typ == '0'?'1m':Typ
            let historyKline = this.historyKline[Sym] && this.historyKline[Sym][Typ]
            let lastKlineData = historyKline && historyKline[historyKline.length - 1]
            let interval = this.inter_obj[this.TypK2[Typ]]
            if (historyKline && historyKline.length > 0) {
                let roundedAtInSec = arg.At - lastKlineData.timestamp >= interval?Math.floor(arg.At / (interval)) * interval:lastKlineData.timestamp
                let rounded_knode_timeInSec = Math.floor(lastKlineData.timestamp / (interval)) * interval;
                let roundedAtInMS = roundedAtInSec
                if (rounded_knode_timeInSec == roundedAtInSec) {
                    let obj = {
                        open: lastKlineData.open,
                        close: arg.Prz,
                        high: lastKlineData.high > arg.Prz ? lastKlineData.high : arg.Prz,
                        low: lastKlineData.low < arg.Prz ? lastKlineData.low : arg.Prz,
                        volume: lastKlineData.volume + Math.abs(arg.Sz),
                        turnover: lastKlineData.turnover,
                        timestamp: roundedAtInMS
                    }
                    // console.log('update for trade ', obj.timestamp, new Date(obj.timestamp), obj,obj.turnover)
                    window._chart.updateData(obj)
                } else if (rounded_knode_timeInSec + interval == roundedAtInSec) {
                    let obj = {
                        open: lastKlineData.close,
                        close: arg.Prz,
                        high: lastKlineData.close > arg.Prz ? lastKlineData.close : arg.Prz,
                        low: lastKlineData.close < arg.Prz ? lastKlineData.close : arg.Prz,
                        volume: Math.abs(arg.Sz),
                        turnover: lastKlineData.turnover,
                        timestamp: roundedAtInMS
                    }
                    // console.log('update for trade ', obj.timestamp, new Date(obj.timestamp), obj,obj.turnover)
                    window._chart.updateData(obj)
                } else if (rounded_knode_timeInSec + interval < roundedAtInSec) {
                    // console.log('chart updateData error', rounded_knode_timeInSec, interval, roundedAtInSec, arg)
                }
            }
        }
    },
    updateKline(param){
        let arg = param.data
        console.log('updateKline', arg)
        let Typ = arg.Typ
        let Sym = arg.Sym
        let _Typ = window._chart.Typ == '0'?'1m':window._chart.Typ
        if(Sym != window._chart.Sym || Typ != _Typ) return
        let interval = this.inter_obj[this.TypK2[arg.Typ]] || 1000
        
        if(window._chart){
            let obj = {
                open: arg.PrzOpen,
                close: arg.PrzClose,
                high: arg.PrzHigh,
                low: arg.PrzLow,
                volume: arg.Volume,
                turnover: (arg.PrzOpen + arg.PrzClose + arg.PrzHigh + arg.PrzLow) / 4 * arg.Volume,
                timestamp: arg.Sec * 1000
            }
            // console.log('updateKline', obj,obj.turnover,arg.Turnover)
            // 将数据放入历史数据中
            if(this.historyKline[Sym] && this.historyKline[Sym][Typ]){
                let historyKline = this.historyKline[Sym][Typ]
                if(historyKline && historyKline.length > 0){
                    let lastKlineData = historyKline && historyKline[historyKline.length - 1]
                    if(lastKlineData.timestamp == obj.timestamp){
                        historyKline[historyKline.length - 1] = obj
                        // console.log('update for kline ', obj.timestamp, new Date(obj.timestamp), obj, this.historyKline[Sym][Typ])
                        window._chart.updateData(obj)
                    }else if(lastKlineData.timestamp < obj.timestamp){
                        if(obj.timestamp - lastKlineData.timestamp > interval){
                            // 此时正在获取最新的数据，用于补充缺少的k线数据，等最新数据回来之后，再更新
                        }else{
                            this.historyKline[Sym][Typ].push(obj)
                            // console.log('update for kline ', obj.timestamp, new Date(obj.timestamp), obj, this.historyKline[Sym][Typ])
                            window._chart.updateData(obj)
                        }
                    }
                }else{
                    // console.log('update for kline ', obj.timestamp, new Date(obj.timestamp), obj)
                    window._chart.updateData(obj)
                }
            }
            
        }
    },
}

export default {
    oninit: function (vnode) {

    },
    oncreate: function (vnode) {
        obj.initEVBUS()
        obj.setKcross()
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