var m = require("mithril")


import headerTick from './market/headerTick'
import orderList from './orderList/index'
import placeOrder from './trade/index_m'
//杠杆调整
import leverageMode from './trade/leverageMode'
//市价加仓
import marketAddMode from './trade/marketAddMode'
//市价加仓
import someCloseMode from './trade/someCloseMode'
//设置仓位止盈止损
import stopPLMode from './trade/stopPLMode'
//二次验证google和sms
import validateMode from './userCenter/validateMode'

import dish from './market/dish'
import symSelect from './market/symSelect'
import selectPos from './trade/selectPos'

//引入手机k线页面
import klineM from "./market/kline_m"
// switch开关
import Switch from "./common/Switch"

let obj = {
    oldSubArr: [],
    rightMenu: false,
    leftMenu: false,
    klineOpen: false,
    //初始化全局广播
    initEVBUS: function () {
        let that = this

        //当前选中合约变化全局广播
        if (this.EV_CHANGESYM_UPD_unbinder) {
            this.EV_CHANGESYM_UPD_unbinder()
        }
        this.EV_CHANGESYM_UPD_unbinder = window.gEVBUS.on(gMkt.EV_CHANGESYM_UPD, arg => {
            that.unSubTick()
            that.subTick()
        })
        //body点击事件广播
        if (this.EV_ClICKBODY_unbinder) {
            this.EV_ClICKBODY_unbinder()
        }
        this.EV_ClICKBODY_unbinder = window.gEVBUS.on(gEVBUS.EV_ClICKBODY, arg => {
            that.leftMenu = false
            that.rightMenu = false
        })

        if (this.EV_ClOSEHEADERMENU_unbinder) {
            this.EV_ClOSEHEADERMENU_unbinder()
        }
        this.EV_ClOSEHEADERMENU_unbinder = window.gEVBUS.on(gEVBUS.EV_ClOSEHEADERMENU, arg => {
            if (arg.from != 'rightMenu') {
                that.rightMenu = false
            }
            if (arg.from != 'leftMenu') {
                that.leftMenu = false
            }
        })
    },
    rmEVBUS: function () {
        if (this.EV_CHANGESYM_UPD_unbinder) {
            this.EV_CHANGESYM_UPD_unbinder()
        }
        if (this.EV_ClICKBODY_unbinder) {
            this.EV_ClICKBODY_unbinder()
        }
    },
    getKline: function () {
        let type = window.$config.views.kline.type
        switch (type) {
            case 0:
                return m(kline)
            case 1:
                return this.customKline()
            default:
                return null;
        }
    },
    customKline: function () {

    },
    //获取手机端k线图
    getMobilekLine: function () {
        let type = window.$config.views.kline.type
        switch (type) {
            case 0:
                return m("div", { class: "pub-layout-m" }, [
                    m(klineM)
                ])
            case 1:
                return this.customKlineM()
            default:
                return null;
        }
    },
    customKlineM: function () {

    },

    getDishAndNewTrd: function () {
        let type = window.$config.views.dishAndNewTrd.type
        switch (type) {
            case 0:
                return m(dishAndNewTrade)
            case 1:
                return this.customDishAndNewTrd()
            default:
                return null;
        }
    },
    customDishAndNewTrd: function () {

    },
    getBottomList: function () {
        let type = window.$config.views.bottomList.type
        switch (type) {
            case 0:
                return m(orderList)
            case 1:
                return this.customBottomList()
            default:
                return null;
        }
    },
    customBottomList: function () {

    },
    getWallet: function () {
        let type = window.$config.views.wallet.type
        switch (type) {
            case 0:
                return m(wallet)
            case 1:
                return this.customWallet()
            default:
                return null;
        }
    },
    customWallet: function () {

    },
    getSpotInfo: function () {
        let type = window.$config.views.spotInfo.type
        switch (type) {
            case 0:
                return m(spotInfo)
            case 1:
                return this.customSpotInfo()
            default:
                return null;
        }
    },
    customSpotInfo: function () {

    },
    getPlaceOrd: function () {
        let type = window.$config.views.placeOrd.type
        switch (type) {
            case 0:
                return m(placeOrder)
            case 1:
                return this.customPlaceOrd()
            default:
                return null;
        }
    },
    customPlaceOrd: function () {

    },
    getValidateMode: function () {
        let type = window.$config.views.validateMode.type
        switch (type) {
            case 0:
                return m(validateMode)
            case 1:
                return this.customValidateMode()
            default:
                return null;
        }
    },
    customValidateMode: function () {

    },
    getLeverageMode: function () {
        let type = window.$config.views.leverageMode.type
        switch (type) {
            case 0:
                return m(leverageMode)
            case 1:
                return this.customLeverageMode()
            default:
                return null;
        }
    },
    customLeverageMode: function () {

    },
    getStopPLMode: function () {
        let type = window.$config.views.stopPLMode.type
        switch (type) {
            case 0:
                return m(stopPLMode)
            case 1:
                return this.customStopPLMode()
            default:
                return null;
        }
    },
    customStopPLMode: function () {

    },
    marketAddMode: function () {
        let type = window.$config.views.marketAddMode.type
        switch (type) {
            case 0:
                return m(marketAddMode)
            case 1:
                return this.customMarketAddMode()
            default:
                return null;
        }
    },
    customMarketAddMode: function () {

    },
    someCloseMode: function () {
        let type = window.$config.views.someCloseMode.type
        switch (type) {
            case 0:
                return m(someCloseMode)
            case 1:
                return this.customSomeCloseMode()
            default:
                return null;
        }
    },
    customSomeCloseMode: function () {

    },
    getSelectPos: function () {
        // 根据配置判断仓位选择是否显示
        let tradeType = window.$config.future.tradeType
        let show = false
        switch (tradeType) {
            case 0:
                show = true;
                break;
            case 1:
            case 2:
            case 3:
                show = false
                break;
            default:
                show = false
        }
        if (show) {
            return m(selectPos)
        } else {
            return null
        }
    },
    //订阅所需行情,pc界面行情订阅除了k线以外，其他所需订阅内容都在这里，各个组件内只是接收数据并渲染
    subTick: function () {
        let Sym = window.gMkt.CtxPlaying.Sym
        if (Sym) {
            let subArr = utils.setSubArrType('tick', [Sym])
            // subArr = subArr.concat(utils.setSubArrType('trade',[Sym]))
            subArr = subArr.concat(utils.setSubArrType('order20', [Sym]))
            subArr = subArr.concat(utils.setSubArrType('index', [utils.getGmexCi(window.gMkt.AssetD, Sym)]))
            window.gMkt.ReqSub(subArr)
            this.oldSubArr = subArr
        }
        m.redraw();
    },
    unSubTick () {
        let oldSubArr = this.oldSubArr
        window.gMkt.ReqUnSub(oldSubArr)
    },
    getUserInfoCon: function () {
        if (window.gWebAPI.isLogin()) {
            return m("ul", { class: "menu-list pub-layout-m-header-menu-user-info" }, [
                m("li", { class: "is-flex" }, [
                    m("div", { class: "" }, [
                        m("p", { class: "is-size-3 has-text-1" }, [
                            window.gWebAPI.CTX.account.accountName
                        ]),
                        m("p", { class: "is-size-7 has-text-2" }, [
                            'UID:' + window.gWebAPI.CTX.account.uid
                        ]),
                    ]),
                    m('.spacer'),

                    m("button", { class: "button is-white is-large is-background-3", onclick: obj.signOut }, [
                        m("span", { class: "icon is-large" }, [
                            m('i', { class: 'iconfont iconweibiaoti-- is-size-3 has-text-1' })
                        ]),
                    ]),
                ]),
            ])
        } else {
            return m("ul", { class: "menu-list pub-layout-m-header-menu-login has-text-1" }, [
                m("li", {
                    class: "is-flex", onclick: function () {
                        window.gWebAPI.needLogin()
                    }
                }, [
                    m("span", { class: "is-size-3" }, [
                        gDI18n.$t('10136')//'登录'
                    ]),
                    m('.spacer'),
                    m("span", { class: "icon is-large" }, [
                        m('i', { class: 'iconfont iconlogin is-size-3' })
                    ]),
                ]),
            ])
        }
    },
    signOut: function () {
        let loginType = window.$config.loginType
        switch (loginType) {
            case 0:
                window.gWebAPI.ReqSignOut({}, function (res) {
                    console.log('ReqSignOut success ==>> ', res)
                    if (res.result.code === 0) {
                        window.$message({ title: gDI18n.$t('10004'/*'退出登录成功！'*/), content: gDI18n.$t('10004'/*'退出登录成功！'*/), type: 'success' })
                    } else {
                        window.$message({ title: gDI18n.$t('10005'/*'退出登录失败！'*/), content: gDI18n.$t('10005'/*'退出登录失败！'*/), type: 'danger' })
                    }
                }, function (err) {
                    window.$message({ title: gDI18n.$t('10006'/*'操作超时'*/), content: gDI18n.$t('10006'/*'操作超时'*/), type: 'danger' })
                    console.log('ReqSignOut => ', err)
                })
                break;
            case 1:
                header.customSignOut({
                    onSuc: function (arg) {
                        let s = window.gWebAPI
                        s.CleanAccount()
                        gEVBUS.emit(s.EV_WEB_LOGOUT, { d: s.CTX })
                    }
                })
                break;
            default:

        }
    },
}



import login from './userCenter/login'
export default {
    oninit: function (vnode) {

    },
    oncreate: function (vnode) {
        obj.initEVBUS()
        document.querySelector('body').setAttribute('id', window.$theme)
    },
    view: function (vnode) {
        return m("div", { class: "" }, [
            m('div', { class: 'pub-m-kline-box has-background-white ' + (obj.klineOpen ? ' open' : '') }, [
                m("nav", { class: "pub-layout-m-header is-fixed-top navbar is-transparent ", role: "navigation", "aria-label": "main navigation" }, [
                    m('div', { class: "navbar-brand is-flex" }, [
                        m('a', {
                            class: "navbar-item", onclick: function (e) {
                                obj.klineOpen = false
                            }
                        }, [
                            m('span', { class: "icon is-medium" }, [
                                m('i', { class: "iconfont iconarrow-left" }),
                            ]),
                        ]),
                        m('.spacer'),
                        m(symSelect),
                        m('.spacer'),
                        m('.spacer'),
                    ]),
                ]),
                //右进k线
                m("div", { class: "kLine-body-list" }, [
                    obj.getMobilekLine()
                ])
            ]),
            m("nav", { class: "pub-layout-m-header is-fixed-top navbar is-transparent", role: "navigation", "aria-label": "main navigation" }, [
                m('div', { class: "navbar-brand is-flex" }, [
                    m('a', {
                        class: "navbar-item", onclick: function (e) {
                            obj.leftMenu = !obj.leftMenu
                            gEVBUS.emit(gEVBUS.EV_ClOSEHEADERMENU, { ev: gEVBUS.EV_ClOSEHEADERMENU, from: 'leftMenu' })
                            window.stopBubble(e)
                        }
                    }, [
                        m('span', { class: "icon is-medium" }, [
                            m('i', { class: "iconfont icontoolbar-side" }),
                        ]),
                    ]),
                    m('.spacer'),
                    m(symSelect),
                    m('.spacer'),
                    m('a', { class: "navbar-item" }, [
                        m('span', {
                            class: "icon is-medium", onclick: function () {
                                obj.klineOpen = true
                            }
                        }, [
                            m('i', { class: "iconfont iconhangqing" }),
                        ]),
                    ]),
                ]),

                m("div", { class: "pub-layout-m-header-menu navbar-menu is-hidden-desktop is-background-2" + (obj.leftMenu ? ' is-active' : ' is-hidden') }, [
                    m("div", { class: "navbar-end" }, [
                        m("aside", { class: "menu" + (window.$config.loginType == 0 ? "" : " is-hidden") }, [
                            obj.getUserInfoCon()
                        ]),
                        m('hr', { class: "is-primary" + (window.$config.loginType == 0 ? "" : " is-hidden") }),
                        m("div", { class: "navbar-item has-dropdown is-hoverable" }, [
                            m("a", {
                                class: "navbar-link ", onclick: function () {
                                    return false;
                                }
                            }, [
                                gDI18n.$t('10236')//'合约记录'
                            ]),
                            m("div", { class: "navbar-dropdown" }, [
                                m("a", {
                                    class: "navbar-item", onclick: function () {
                                        router.push('/delegation')
                                    }
                                }, [
                                    gDI18n.$t('10077')//'历史委托'
                                ]),
                                m("a", {
                                    class: "navbar-item", onclick: function () {
                                        router.push('/deal')
                                    }
                                }, [
                                    gDI18n.$t('10237')//'历史成交'
                                ]),
                                m("a", {
                                    class: "navbar-item", onclick: function () {
                                        router.push('/contractbill')
                                    }
                                }, [
                                    gDI18n.$t('10079')//'合约账单'
                                ]),
                            ]),
                            m("a", {
                                class: "navbar-link", onclick: function () {
                                    return false;
                                }
                            }, [
                                gDI18n.$t('10464')//'设置'
                            ]),
                            m("div", { class: "navbar-dropdown" }, [
                                m("a", {
                                    class: "navbar-item", onclick: function () {
                                        router.push('/setlanguages')
                                    }
                                }, [
                                    gDI18n.$t('10434')//"切换语言"
                                ]),
                                m("a", {
                                    class: "navbar-item", onclick: function () {
                                        router.push('/switchLines')
                                    }
                                }, [
                                    "切换线路" //"切换线路"
                                ]),
                                m("a", {
                                    class: "navbar-item", onclick: function (event) {
                                        event.stopPropagation()
                                    }
                                }, [
                                    "切换主题", //"切换主题"
                                    m(Switch, {
                                        class: 'is-pulled-right',
                                        type: window.$theme == 'light',
                                        onclick (type) {
                                            console.log('switch', type)
                                            utils.switchTheme()
                                            .then((them) => {
                                                console.log(them);
                                            })
                                        },
                                    })
                                ]),
                            ])
                        ])

                    ])
                ])
            ]),
            m("div", { class: "pub-layout-m" }, [
                obj.getSelectPos(),
                m('div', { class: "pub-layout-m-content is-flex" }, [
                    m('div', { class: "pub-layout-m-content-left" }, [
                        obj.getPlaceOrd()
                    ]),
                    m('.spacer'),
                    m('div', { class: "pub-layout-m-content-right" }, [
                        m(dish)
                    ])
                ]),
                obj.getBottomList(),

            ]),

            obj.getStopPLMode(),
            obj.getLeverageMode(),
            obj.getValidateMode(),
            obj.marketAddMode(),
            obj.someCloseMode(),
            window.$config.loginType == 0 ? m(login) : ''
        ])
    },
    onremove: function () {
        obj.rmEVBUS()
    }
}