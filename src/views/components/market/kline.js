// import {dispose, init} from 'klinecharts'
var m = require("mithril")


let obj = {
    Sym: '',
    Typ: '',
    // targetList: [
    //     // {
    //     //     name: 'VOL',
    //     //     title: 'Volume'
    //     // },
    //     {
    //         name: 'MA',
    //         title: 'Moving Average'
    //     },
    //     {
    //         name: 'MACD',
    //         title: 'Moving Average Convergence / Divergence'
    //     },
    //     {
    //         name: 'KDJ',
    //         title: 'Stochastic'
    //     },
    //     {
    //         name: 'BOLL',
    //         title: 'Bollinger Bands'
    //     },
    //     {
    //         name: 'EMA',
    //         title: 'Moving Average Exponential'
    //     },
    //     // {
    //     //     name: 'StochRSI',
    //     //     title: 'Stochastic RSI'
    //     // },
    //     {
    //         name: 'RSI',
    //         title: 'Relative Strength Index'
    //     },
    //     {
    //         name: 'CCI',
    //         title: 'Commodity Channel Index'
    //     },
    //     // {
    //     //     name: 'ATR',
    //     //     title: 'Average True Range'
    //     // },
    //     {
    //         name: 'SAR',
    //         title: 'Parabolic SAR'
    //     },
    //     {
    //         name: 'DMI',
    //         title: 'Directional Movement'
    //     },
    //     {
    //         name: 'OBV',
    //         title: 'On Balance Volume'
    //     },
    //     // {
    //     //     name: 'ROC',
    //     //     title: 'Rate Of Change'
    //     // },
    // ],
    targetList_main: [ //指标
        // {title:'VOL',name:"Volume"},
        {
            name: 'MA',
            title: "Moving Average",
            Lbl: "main"
        },
        {
            name: 'BOLL',
            title: "Bollinger Bands",
            Lbl: "main"
        },
        {
            name: 'EMA',
            title: "Moving Average Exponential",
            Lbl: "main"
        },
        {
            name: 'SAR',
            title: "Parabolic SAR",
            Lbl: "main"
        },
    ],
    targetList_second: [ //指标
        {
            name: 'MACD',
            title: "MACD",
            Lbl: "second"
        },
        {
            name: 'KDJ',
            title: "Stochastic",
            Lbl: "second"
        },
        {
            name: 'RSI',
            title: "Relative Strength Index",
            Lbl: "second"
        },
        {
            name: 'CCI',
            title: "Commodity Channel Index",
            Lbl: "second"
        },
        {
            name: 'DMI',
            title: "Directional Movement Index",
            Lbl: "second"
        },
        {
            name: 'OBV',
            title: "On Balance Volume",
            Lbl: "second"
        },
    ],
    targetActive: {}, //tradingview选中的指标 主图
    targetActive_second: {}, //tradingview选中的指标 幅图
    timeList: {
        '0': {
            type: '0',
            name: '0',//"分时",
            title: gDI18n.$t('10024'),//"分时图"
        },
        '1m': {
            type: '1',
            name: "1m",
            title: gDI18n.$t('10025'),//"1分钟"
        },
        '3m': {
            type: '3',
            name: "3m",
            title: gDI18n.$t('10026'),//"3分钟"
        },
        '5m': {
            type: '5',
            name: "5m",
            title: gDI18n.$t('10027'),//"5分钟"
        },
        '30m': {
            type: '30',
            name: "30m",
            title: gDI18n.$t('10028'),//"30分钟"
        },
        '1h': {
            type: '60',
            name: "1h",
            title: gDI18n.$t('10029'),//"1小时"
        },
        '2h': {
            type: '120',
            name: "2h",
            title: gDI18n.$t('10030'),//"2小时"
        },
        // '240': {
        //     type: '240',
        //     name: "4h",
        //     title: gDI18n.$t('10031'),//"4小时"
        // },
        '1d': {
            type: 'D',
            name: "1d",
            title: gDI18n.$t('10032'),//"1天"
        },
        '1w': {
            type: 'W',
            name: "1w",
            title: gDI18n.$t('10033'),//"1周"
        },
        '1M': {
            type: 'M',
            name: "1M",
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
    fullscreen: false, //是否为全屏
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

        //监听多元
        if(this.EV_CHANGELOCALE_UPD_unbinder){
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD,arg=> {
            // that.setKlineLanguage()
            that.initLanguage()
        })

        //监听主题变化
        if(this.EV_THEME_UP_unbinder){
            this.EV_THEME_UP_unbinder()
        }
        this.EV_THEME_UP_unbinder = window.gEVBUS.on(gEVBUS.EV_THEME_UP,arg=> {
            that.setKlineOptions()
        })
        

        if(this.EV_ONRESIZE_UPD_unbinder){
            this.EV_ONRESIZE_UPD_unbinder()
        }
        this.EV_ONRESIZE_UPD_unbinder = window.gEVBUS.on(gEVBUS.EV_ONRESIZE_UPD,arg=> {
            that.onResize()
        })
        
        if (window.addEventListener) {
            document.addEventListener('fullscreenchange', obj.fullScreenShange);
            document.addEventListener('webkitfullscreenchange', obj.fullScreenShange);
            document.addEventListener('mozfullscreenchange', obj.fullScreenShange);
            document.addEventListener('MSFullscreenChange', obj.fullScreenShange);
        }

    },
    initLanguage: function(){
        this.timeList = {
            '0': {
                type: '0',
                name: '0',//"分时",
                title: gDI18n.$t('10024'),//"分时图"
            },
            '1m': {
                type: '1',
                name: "1m",
                title: gDI18n.$t('10025'),//"1分钟"
            },
            '3m': {
                type: '3',
                name: "3m",
                title: gDI18n.$t('10026'),//"3分钟"
            },
            '5m': {
                type: '5',
                name: "5m",
                title: gDI18n.$t('10027'),//"5分钟"
            },
            '30m': {
                type: '30',
                name: "30m",
                title: gDI18n.$t('10028'),//"30分钟"
            },
            '1h': {
                type: '60',
                name: "1h",
                title: gDI18n.$t('10029'),//"1小时"
            },
            '2h': {
                type: '120',
                name: "2h",
                title: gDI18n.$t('10030'),//"2小时"
            },
            // '240': {
            //     type: '240',
            //     name: "4h",
            //     title: gDI18n.$t('10031'),//"4小时"
            // },
            '1d': {
                type: 'D',
                name: "1d",
                title: gDI18n.$t('10032'),//"1天"
            },
            '1w': {
                type: 'W',
                name: "1w",
                title: gDI18n.$t('10033'),//"1周"
            },
            '1M': {
                type: 'M',
                name: "1M",
                title: gDI18n.$t('10034'),//"1月"
            },
        }

        if(window.isMobile){
            // 注销k线重新加载
            if (window._chart) {
                klinecharts.dispose('tv_chart_container')
                window._chart = null
            }
        }
        // 重新设置k线配置，用于修改多语言
        if(window._chart){
            this.setKlineOptions()
        }
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

        if (window.removeEventListener) {
            document.removeEventListener('fullscreenchange', obj.fullScreenShange);
            document.removeEventListener('webkitfullscreenchange', obj.fullScreenShange);
            document.removeEventListener('mozfullscreenchange', obj.fullScreenShange);
            document.removeEventListener('MSFullscreenChange', obj.fullScreenShange);
        }
    },
    
    setSymbol: function () {
        let that = this
        this.Sym = window.gMkt.CtxPlaying.Sym
        this.Typ = window.gMkt.CtxPlaying.Typ || '1m'
        this.setKcross()
    },
    createTarget: function (param) {
        if(!window._chart)return
        // if (this.targetActive.id) {
        //     window._chart.removeTechnicalIndicator(this.targetActive.id)
        // }
        // if(this.targetActive.title == param.title){
        //     this.targetActive = {};
        //     return
        // }
        // this.targetActive = param;
        // this.targetActive.id = window._chart.createTechnicalIndicator(param.name, 60, false)

        if (param.Lbl == 'main') {
            if (this.targetActive.Lbl && this.targetActive.name == param.name) {
                // 主图指标清空
                window._chart.setCandleStickTechnicalIndicatorType('NO')
                this.targetActive = {};
                return
            }
            this.targetActive = param;
            // 设置主图指标
            this.targetActive.id = window._chart.setCandleStickTechnicalIndicatorType(param.name);
        } else if (param.Lbl == 'second') {
            if (this.targetActive_second.Lbl) {
                // 副图指标删除
                window._chart.removeTechnicalIndicator(this.targetActive_second.id)
                if (this.targetActive_second.name == param.name) {
                    this.targetActive_second = {};
                    return
                }
            }
            this.targetActive_second = param
            // 添加副图指标
            this.targetActive_second.id = window._chart.createTechnicalIndicator(param.name, 80, false)
        }

    },
    setKCrossTime: function (val) {
        let that = this;
        window.gMkt.CtxPlaying.Typ = this.Typ = val;
        console.log(obj.timeList[obj.Typ], this.Typ ,obj.timeList)
        this.setKlineData()
    },
    getTimeList: function(type){
        let that = this
        let timeList = Object.keys(this.timeList)
        if(window.isMobile){
            return timeList.map((key, i) =>{
                let item = that.timeList[key]
                return m('button', {key: "klineTimeListItem"+i,class: "button is-background-2 has-text-2"+(obj.Typ == item.name?' has-text-primary':''), onclick: function(){
                    obj.setKCrossTime(item.name)
                }}, [
                    item.title
                ])
            })
        }else if(type == 'dropdown'){
            return timeList.map((key, i) =>{
                let item = that.timeList[key]
                return m('a', {key: "klineTimeListItemForPC"+i,class: "dropdown-item"+(obj.Typ == item.name?' has-text-primary':''), onclick: function(){
                    obj.setKCrossTime(item.name)
                }}, [
                    item.title
                ])
            })
        }else{
            return timeList.map((key, i) =>{
                let item = that.timeList[key]
                return m('button', {key: "klineTimeListItemForPC"+i,class: "button is-background-2 has-text-2 is-flex-fullhd"+(obj.Typ == item.name?' has-text-primary':''), onclick: function(){
                    obj.setKCrossTime(item.name)
                }}, [
                    item.title
                ])
            })
        }
        
    },
    // getTargetList: function(){
    //     let that = this
    //     let timeList = Object.keys(this.targetList)
        
    //     if(window.isMobile){
    //         return timeList.map((key, i) =>{
    //             let item = that.targetList[key]
    //             return m('button', {key: "klineTimeListItem"+i,class: "button is-background-2 has-text-2"+(obj.targetActive.name == item.name?' has-text-primary':''), onclick: function(){
    //                 obj.createTarget(item)
                    
    //             }}, [
    //                 item.name
    //             ])
    //         })
    //     }else{
    //         return timeList.map((key, i) =>{
    //             let item = that.targetList[key]
    //             return m('a', {key: "klineTimeListItem"+i, class:"dropdown-item"+(obj.targetActive.name == item.name?' has-text-primary':''), onclick: function(){
    //                     obj.createTarget(item)
    //                 }}, [
    //                     item.name
    //             ])
    //         })
    //     }
    // },
    getTargetList: function () {
        let that = this
        let timeList_main = Object.keys(this.targetList_main)
        let timeList_second = Object.keys(this.targetList_second)

        if (window.isMobile) {
            return m('div', [
                m('div', { class: "" }, [
                    m("p", { class: "dropdown-item k-line-button2 has-text-2 is-background-3" }, [
                        gDI18n.$t('10510')//"主图"
                    ]),
                    timeList_main.map((key, i) => {
                        let item = that.targetList_main[key]
                        return m('button', {
                            key: "klineTimeListItemMain" + i, class: "button has-text-2 is-background-3" + (obj.targetActive.name == item.name ? ' has-text-primary' : ''), onclick: function () {
                                obj.createTarget(item)

                            }
                        }, [
                            item.name
                        ])
                    })
                ]),
                m('div', { class: "" }, [
                    m("p", { class: "dropdown-item k-line-button2 has-text-2 is-background-3" }, [
                        gDI18n.$t('10511')//"副图"
                    ]),
                    timeList_second.map((key, i) => {
                        let item = that.targetList_second[key]
                        return m('button', {
                            key: "klineTimeListItemSecond" + i, class: "button has-text-2 is-background-3" + (obj.targetActive_second.name == item.name ? ' has-text-primary' : ''), onclick: function () {
                                obj.createTarget(item)

                            }
                        }, [
                            item.name
                        ])
                    })
                ]),
            ])
        } else {
            return m('div', [
                m('div', { class: "" }, [
                    m("p", { class: "dropdown-item k-line-button2 has-text-2 is-background-3" }, [
                        gDI18n.$t('10510')//"主图"
                    ]),
                    timeList_main.map((key, i) => {
                        let item = that.targetList_main[key]
                        return m('a', {
                            key: "klineTimeListItemMain" + i, class: "dropdown-item k-line-button" + (obj.targetActive.name == item.name ? ' has-text-primary' : ''), onclick: function () {
                                obj.createTarget(item)
                            }
                        }, [
                            item.name
                        ])
                    })
                ]),
                m('div', { class: "" }, [
                    m("p", { class: "dropdown-item k-line-button2 has-text-2 is-background-3" }, [
                        gDI18n.$t('10511')//"副图"
                    ]),
                    timeList_second.map((key, i) => {
                        let item = that.targetList_second[key]
                        return m('a', {
                            key: "klineTimeListItemSecond" + i, class: "dropdown-item k-line-button" + (obj.targetActive_second.name == item.name ? ' has-text-primary' : ''), onclick: function () {
                                obj.createTarget(item)
                            }
                        }, [
                            item.name
                        ])
                    })
                ]),
            ])
        }
    },

    setKcross: function() {
        console.log(window._chart, this.Sym)

        // 动态设置k线高度
        if(window.isMobile){
            let h = parseInt(window.getComputedStyle(document.querySelector('body')).height)
            document.querySelector('.pub-kline-iframe-m').style.height = (h/2) + 'px'
        }
        

        this.klineShow = true
        if (window._chart) {
            if (this.Sym) {
                this.setKlineData()
            }
        } else{
            this.initChart();
        }
    },
    initChart: function() {
        let self = this;
        if (window._chart) return;
       
        console.log('init chart')
        // 初始化图表
        window._chart = klinecharts.init("tv_chart_container", {});
        this.setKlineOptions()
        window._chart.setDataSpace(1)
        window._chart.createTechnicalIndicator('VOL', 80, false)
        window._chart.setTechnicalIndicatorParams('VOL', [])
        // window._chart.setOffsetRightSpace(50)
        // window._chart.setLeftMinVisibleBarCount(50)
        // window._chart.setRightMinVisibleBarCount(50)

        // 根据是否选中指标来初始化k线指标
        if (this.targetActive.name) {
            window._chart.setCandleStickTechnicalIndicatorType(this.targetActive.name)
        } else if (!this.targetActive.name) {
            window._chart.setCandleStickTechnicalIndicatorType('NO')
        }
        if (this.targetActive_second.id) {
            window._chart.createTechnicalIndicator(this.targetActive_second.name, 80, false)
        }
        // 设置k线柱的宽度
        window._chart.setDataSpace(8)
        window._chart.loadMore(this.loadMoreKline)
        window._chart.Sym = ''
        window._chart.Typ = ''
        this.setKlineData()

    },
    setKlineOptions: function(){
        let $color = window.themeColors
        console.log(window.$theme,"主题类型")
        // let lineColor = "#f4f4f4"
        // let fontPrimary = "#111"
        // let fontSecondary = "#8e8e8e"
        // let upColor = "#48c774"
        // let downColor = "#f14668"
        // let promptFont = "#f6f6f6"
        let lineColor = "";
        let fontPrimary = "";
        let fontSecondary = "";
        let upColor = "";
        let downColor = "";
        let promptFont = "";
        if(window.$theme == "light"){
            lineColor =  $color.line.lighten
            fontPrimary = $color.font.lighten1
            fontSecondary = $color.font.lighten1
            upColor = $color.success.lighten1
            downColor = $color.error.lighten1
            promptFont = $color.font.lighten
        }else if(window.$theme == "dark"){
            lineColor =  $color.line.darken1
            fontPrimary = $color.font.darken1
            fontSecondary = $color.font.darken2
            upColor = $color.success.darken1
            downColor = $color.error.darken1
            promptFont = $color.font.darken
        }
        let fontSize = window.isMobile? 8: 12
        let options = {
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
                            paddingLeft: 6,
                            paddingRight: 6,
                            paddingTop: 6,
                            paddingBottom: 6,
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
                            paddingLeft: 6,
                            paddingRight: 6,
                            paddingTop: 6,
                            paddingBottom: 6,
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
                        // labels: ["时间", "开", "收", "高", "低", "成交量"],
                        labels: [
                            gDI18n.$t('10103'),//"时间"
                            gDI18n.$t('10501'),//"开",
                            gDI18n.$t('10502'),//"收",
                            gDI18n.$t('10503'),//"高",
                            gDI18n.$t('10504'),//"低",
                            gDI18n.$t('10505'),//"成交量"
                        ],
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
                            marginTop: 6,
                            marginRight: 6,
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
        }
        window._chart.setStyleOptions(options)
    },
    setKlineData: function(){
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
        Typ = Typ == '0'?'1m':Typ
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
    getLastKlineData: function() {
        let that = this
        if(!window._chart || !this.Sym) return
        
        let Sym = window._chart.Sym
        let Typ = window._chart.Typ || '1m';
        Typ = Typ == '0'?'1m':Typ
        if(this.isGetKlineDataLoading) return
        this.isGetKlineDataLoading = true
        gMkt.ReqKLineLastest({
            Sym: Sym,
            Typ: Typ,
            Count: window.isMobile?300:1500
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
    loadMoreKline: function(tm, count, type) {
        console.log('loadMoreKline need more data', tm, count, this.isGetKlineDataLoading, window._chart, this.Sym, window._chart.Sym)
        let that = obj
        if(!window._chart || !window._chart.Sym) return
        let Count = count?count:window.isMobile?300:1500
        let Sym = window._chart.Sym
        let Typ = window._chart.Typ || '1m';
        Typ = Typ == '0'?'1m':Typ
        let Sec = Math.floor((tm - that.inter_obj[that.TypK2[Typ]] * Count) / 1000)
        if(that.isGetKlineDataLoading || (typeof tm) != "number") return
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
    applyNewDataToChart: function(arg, type, more) {
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

        // 检查是否是当前选中的合约和时间，如果不是则不对k线增加数据
        let _Typ = window._chart.Typ
        _Typ = _Typ == '0'?'1':_Typ
        if(Sym != window._chart.Sym || Typ != _Typ) return

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
    updateKlineForTrade: function(param){
        if(!window._chart) return

        let arg = param.data
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
    updateKline: function(param){
        if(!window._chart) return
        
        let arg = param.data
        let Typ = param.Typ
        let Sym = param.Sym
        let _Typ = window._chart.Typ == '0'?'1m':window._chart.Typ
        if(Sym != window._chart.Sym || Typ != _Typ) return
        let interval = this.inter_obj[this.TypK2[param.Typ]] || 1000
        if(window._chart){
            let obj = {
                open: arg.open,
                close: arg.close,
                high: arg.high,
                low: arg.low,
                volume: arg.volume,
                turnover: (arg.open + arg.close + arg.high + arg.low) / 4 * arg.volume,
                timestamp: arg.time
            }
            // console.log('updateKline', obj,obj.turnover,arg.Turnover, param)
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
    // 控制全屏
    enterfullscreen: function(target) { //进入全屏
        let docElm = document.querySelector(target);
        //W3C
        if(docElm.requestFullscreen) {
            docElm.requestFullscreen();
        }
        //FireFox
        else if(docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        }
        //Chrome等
        else if(docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        }
        //IE11
        else if(elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    },

    exitfullscreen: function() { //退出全屏
        if(document.exitFullscreen) {
            document.exitFullscreen();
        } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if(document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    },
    setFullscreen: function(){
        if(this.fullscreen){
            this.exitfullscreen(".pub-kline")
        }else{
            this.enterfullscreen(".pub-kline")
        }
    },
    onResize: function(){
        if(window._chart){
            window._chart.resize()
        }
        console.log('checkFull', this.checkFull())
    },
    checkFull: function() {
        let isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
        //to fix : false || undefined == undefined
        if (isFull === undefined) {isFull = false;}
        return isFull;
    },
    fullScreenShange: function(e){
        if(window._chart){
            window._chart.resize()
        }
        obj.fullscreen = !obj.fullscreen
    }
}

export default {
    oninit: function (vnode) {
        obj.initLanguage()
    },
    oncreate: function (vnode) {
        obj.initEVBUS()
        obj.setKcross()
    },
    view: function (vnode) {

        return m("div", { class: "pub-kline"+(window.isMobile?'':' box') }, [
            m('div', {class:"pub-kline-btns buttons has-addons is-hidden-desktop"}, [
                m('div', {class:"dropdown is-hidden-desktop"+(obj.klineTimeListOpen?' is-active':'')}, [
                    m('div', {class:"dropdown-trigger", onclick: function(e){
                        obj.klineTimeListOpen = !obj.klineTimeListOpen
                        window.stopBubble(e)
                    }}, [
                        m('button', {class:"button kline-index-pad is-selected is-background-3 has-text-2"+(obj.klineTimeListOpen?' has-text-primary':'')}, [
                            gDI18n.$t('10023'),//'分时'
                            m('.spacer'),
                            m('span', {class:"icon"}, [
                                m('i', {class:"iconfont iconxiala has-text-primary is-size-7"})
                            ]),
                        ]),
                    ]),
                    m('div', {class:"dropdown-menu"}, [
                        m('div', {class:"dropdown-content"}, [
                            obj.getTimeList()
                        ]),
                    ]),
                ]),
                m('button', {class:"button kline-index-pad is-selected is-background-3 has-text-2"+(obj.Typ == '1m'?' has-text-primary':''), onclick: function(){
                    obj.setKCrossTime('1m')
                    // obj.klineTimeListOpen = false
                }}, [
                    gDI18n.$t('10442')//'1分'
                ]),
                m('button', {class:"button kline-index-pad is-selected is-background-3 has-text-2"+(obj.Typ == '30m'?' has-text-primary':''), onclick: function(){
                    obj.setKCrossTime('30m')
                    // obj.klineTimeListOpen = false
                }}, [
                    gDI18n.$t('10443')//'30分'
                ]),
                m('button', {class:"button kline-index-pad is-selected is-background-3 has-text-2"+(obj.Typ == '1h'?' has-text-primary':''), onclick: function(){
                    obj.setKCrossTime('1h')
                    // obj.klineTimeListOpen = false
                }}, [
                    gDI18n.$t('10469')//'1小时'
                ]),
                
                m('div', {class:"dropdown is-hidden-desktop is-right"+(obj.klineTargetListOpen?' is-active':'')}, [
                    m('div', {class:"dropdown-trigger", onclick: function(e){
                        obj.klineTargetListOpen = !obj.klineTargetListOpen
                        window.stopBubble(e)
                    }}, [
                        m('button', {class:"button kline-index-pad is-selected is-background-3 has-text-2"}, [
                            obj.targetActive.name || gDI18n.$t('10435'), //'指标'
                            m('.spacer'),
                            m('span', {class:"icon"}, [
                                m('i', {class:"iconfont iconxiala has-text-primary is-size-7"})
                            ]),
                        ]),
                    ]),
                    m('div', {class:"dropdown-menu"}, [
                        m('div', {class:"dropdown-content"}, [
                            obj.getTargetList()
                        ]),
                    ]),
                ]),
            ]),
            m('div', {class:"pub-kline-btns-pc is-hidden-touch"}, [
                m('div', { class: "pub-kline-btns-pc-time" }, [
                    obj.getTimeList(),
                ]),
                m('div', {class:"pub-kline-btns-pc-time-dropdown dropdown is-hidden-touch"+(obj.klineTimeListOpen?' is-active':'')}, [
                    m('div', {class:"dropdown-trigger", onclick: function(e){
                        obj.klineTimeListOpen = !obj.klineTimeListOpen
                        window.stopBubble(e)
                    }}, [
                        m('button', {class:"button is-background-2 has-text-2"}, [
                            obj.timeList[obj.Typ] && obj.timeList[obj.Typ].title || '时间',
                            m('.spacer'),
                            m('span', {class:"icon"}, [
                                m('i', {class:"iconfont iconxiala has-text-primary is-size-7"})
                            ]),
                        ]),
                    ]),
                    m('div', {class:"dropdown-menu"}, [
                        m('div', {class:"dropdown-content"}, [
                            obj.getTimeList('dropdown')
                        ]),
                    ]),
                ]),
                m('span',{class:"has-text-2"}, ['|']),
                m('div', {class:"dropdown is-hidden-touch"+(obj.klineTargetListOpen?' is-active':'')}, [
                    m('div', {class:"dropdown-trigger", onclick: function(e){
                        obj.klineTargetListOpen = !obj.klineTargetListOpen
                        window.stopBubble(e)
                    }}, [
                        m('button', {class:"button is-background-2 has-text-2"}, [
                            obj.targetActive.name || gDI18n.$t('10435'), //'指标'
                            m('.spacer'),
                            m('span', {class:"icon"}, [
                                m('i', {class:"iconfont iconxiala has-text-primary is-size-7"})
                            ]),
                        ]),
                    ]),
                    m('div', {class:"dropdown-menu"}, [
                        m('div', {class:"dropdown-content"}, [
                            obj.getTargetList()
                        ]),
                    ]),
                ]),
                m('span',{class:"has-text-2"}, ['|']),
                m('button', {class:"button is-background-2 has-text-2", onclick: function(){
                    obj.setFullscreen();
                }}, [
                    m('span', {class:"icon"}, [
                        m('i', {class:"iconfont"+(obj.fullscreen?" iconguanbiquanping1":" iconquanping1")})
                    ]),
                ]),
            ]),
            m('hr.is-hidden-touch'),
            m("div", { class: ""+(window.isMobile?" pub-kline-iframe-m":" pub-kline-iframe")}, [
                m('#tv_chart_container', { class: "" })
            ])
        ])
    },
    onremove: function (vnode) {
        if (window._chart) {
            klinecharts.dispose('tv_chart_container')
            window._chart = null
        }
        obj.rmEVBUS()
    },
}