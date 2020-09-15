var m = require("mithril")

let obj = {
    open: false,
    tabsActive: 0, //默认显示项

    //初始化全局广播
    initEVBUS: function () {
        let that = this
        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD, arg => {
            that.initLanguage()
        })
    },
    //删除全局广播
    rmEVBUS: function () {
        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder() 
        }
    },
    //初始化多语言
    initLanguage: function () {
        
    },
}

export default {
    oninit: function (vnode) {

    },
    oncreate: function (vnode) {
        obj.initEVBUS()
    },
    view: function (vnode) {
        return m('div',{class:"calculator is-flex is-text-3 has-text-2"},[
            //左边计算区域
            m('div',{class:"calculator-public-left pr-3"},[
                m('div',{class:"is-flex calculator-button-title mb-3"},[
                    m('button',{class:"button calculator-button-item is-background-3 has-text-2 has-border-gry has-border-primary is-text-3"},[
                        "做多"
                    ]),
                    m('button',{class:"button calculator-button-item is-background-3 has-text-2 has-border-gry is-text-3"},[
                        "做空"
                    ]),
                ]),
                m('p',{class:" mb-3"},[
                    '账户模式'
                ]),
                m('div',{class:"is-flex calculator-button-title mb-3"},[
                    m('button',{class:"button button calculator-button-item is-background-3 has-text-2 has-border-gry has-border-primary is-text-3"},[
                        "全仓"
                    ]),
                    m('button',{class:"button button calculator-button-item is-background-3 has-text-2 has-border-gry is-text-3"},[
                        "逐仓"
                    ]),
                ]),
                m('div',{class:"is-flex input-border-lable mb-3 pr-3"},[
                    m('input',{class:"input input-border-line",placeholder:"杠杆倍数"}),
                    m('div',{class:"input-right"},[
                        m('i',{class:"iconfont iconclose"})
                    ])
                ]),
                m('div',{class:"is-flex input-border-lable mb-3 pr-3"},[
                    m('input',{class:"input input-border-line",type: 'number',placeholder:"开仓数量"}),
                    m('div',{class:"input-right"},[
                       "张"
                    ])
                ]),
                m('div',{class:"is-flex input-border-lable mb-3 pr-3"},[
                    m('input',{class:"input input-border-line",type: 'number',placeholder:"开仓价格"}),
                    m('div',{class:"input-right"},[
                        "USDT"
                    ])
                ]),
                m('div',{class:"is-flex input-border-lable mb-3 pr-3"},[
                    m('input',{class:"input input-border-line",type: 'number',placeholder:"平仓价格"}),
                    m('div',{class:"input-right"},[
                        "USDT"
                    ])
                ]),
            ]),
            //右边显示区域
            m('div',{class:"calculator-public-right pl-3"},[
                m('div',{class:"calculator-public-right-item"},[
                    m('div',{class:""},[
                        '计算结果'
                    ]),
                    m('div',{class:"is-flex"},[
                        m('div',{class:""},[
                            '仓位价值(USDT)'
                        ]),
                        m('div',{class:""},[
                            '--'
                        ]),
                    ]),
                    m('div',{class:"is-flex"},[
                        m('div',{class:""},[
                            '仓位价值(USDT)'
                        ]),
                        m('div',{class:""},[
                            '--'
                        ]),
                    ]),
                    m('div',{class:"is-flex"},[
                        m('div',{class:""},[
                            '仓位价值(USDT)'
                        ]),
                        m('div',{class:""},[
                            '--'
                        ]),
                    ]),
                    m('div',{class:"is-flex"},[
                        m('div',{class:""},[
                            '仓位价值(USDT)'
                        ]),
                        m('div',{class:""},[
                            '--'
                        ]),
                    ]),
                ])
            ]),
        ])
    },
    onremove: function (vnode) {
        obj.rmEVBUS()
    },
}