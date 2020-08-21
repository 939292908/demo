var m = require("mithril")

let header = {
    islogin: false,
    userName: '',
    uid: '',
    headerMenu: false,
    // 资产菜单列表
    assetMenuList: [],
    // 订单菜单列表
    orderMenuList: [
        {
            id: 1,
            label: '合约订单'
        },
        {
            id: 2,
            label: '币币订单'
        },
        {
            id: 3,
            label: '法币订单'
        },
        {
            id: 4,
            label: '跟单订单'
        },
    ],
    // 线路切换弹框
    netLineOpen: false,
    informationOpen: false,
    informationList: [],
    initLanguage:function(){
        // 资产菜单列表
        this.assetMenuList = [
            {
                id: 1,
                label: `${gDI18n.$t('10219')}（充币&提币）`, //'我的钱包（充币&提币）'
            },
            {
                id: 2,
                label: gDI18n.$t('10217'), //'合约账户'
            },
            {
                id: 3,
                label: gDI18n.$t('10218'), //'币币账户'
            },
            {
                id: 4,
                label: gDI18n.$t('10220'), //'法币账户'
            },
        ]
        this.informationList = [
            {
                id:0,
                name: gDI18n.$t('10529'), //"合约详解"
            },
            {
                id:1,
                name: gDI18n.$t('10530'), //"币币指数"
            },
            {
                id:2,
                name: gDI18n.$t('10531'), //"资金费率历史"
            },
        ]
    },
    initEVBUS: function () {
        let that = this

        if (this.EV_WEB_LOGIN_unbinder) {
            this.EV_WEB_LOGIN_unbinder()
        }
        this.EV_WEB_LOGIN_unbinder = window.gEVBUS.on(gWebAPI.EV_WEB_LOGIN, arg => {
            that.islogin = true
            that.initUserInfo()
            m.redraw()
        })

        if (this.EV_WEB_LOGOUT_unbinder) {
            this.EV_WEB_LOGOUT_unbinder()
        }
        this.EV_WEB_LOGOUT_unbinder = window.gEVBUS.on(gWebAPI.EV_WEB_LOGOUT, arg => {
            that.islogin = false
            that.userName = ''
            m.redraw()
        })
        // 切换语言 广播
        this.EV_CHANGELOCALE_UPD_unbinder && this.EV_CHANGELOCALE_UPD_unbinder();
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD, arg => this.initLanguage())

    },
    rmEVBUS: function () {
        if (this.EV_WEB_LOGIN_unbinder) {
            this.EV_WEB_LOGIN_unbinder()
        }
        if (this.EV_WEB_LOGOUT_unbinder) {
            this.EV_WEB_LOGOUT_unbinder()
        }
        this.EV_CHANGELOCALE_UPD_unbinder && this.EV_CHANGELOCALE_UPD_unbinder();
    },
    initTradeStatus: function () {
        // 读取地址栏参数并赋值,地址参数为加密参数
        let p = utils.queryParams('p')
        if (p) {
            p = JSON.parse(utils.uncompileStr(p))
            let Page = p.Page
            if (Page) {
                this.setTradeStatus(Number(Page))
            }
        }
    },
    setTradeStatus: function (status) {
        window.gMkt.CtxPlaying.pageTradeStatus = status
        gEVBUS.EmitDeDuplicate(window.gMkt.EV_PAGETRADESTATUS_UPD, 50, window.gMkt.EV_PAGETRADESTATUS_UPD, { Ev: window.gMkt.EV_PAGETRADESTATUS_UPD })
    },
    initUserInfo () {
        let account = window.gWebAPI.CTX.account
        this.userName = account.accountName
        this.uid = account.uid
    },
    getLoginDom: function () {
        if (this.islogin) {
            return m("div", { class: "navbar-item has-dropdown is-hoverable" }, [
                m("a", { class: "navbar-link" }, [
                    this.userName
                ]),
                m("div", { class: "navbar-dropdown navbar-dropdown-left" }, [
                    m("a", { class: "navbar-item" }, [
                        this.userName
                    ]),
                    m("a", { class: "navbar-item" }, [
                        `UID:${this.uid}`
                    ]),
                    m("a", { class: "navbar-item" }, [
                        '账户安全'
                    ]),
                    m("a", { class: "navbar-item" }, [
                        '身份认证'
                    ]),
                    m("a", { class: "navbar-item" }, [
                        'API管理'
                    ]),
                    m("a", { class: "navbar-item" }, [
                        '邀请返佣'
                    ]),
                    m("a", { class: "navbar-item", onclick: this.signOut }, [
                        gDI18n.$t('10003'/*'退出'*/)
                    ])
                ])
            ])
        } else {
            let loginType = window.$config.loginType
            switch (loginType) {
                case 0:
                    return m("div", { class: "navbar-item" }, [
                        m("div", { class: "buttons" }, [
                            header.getLogin()
                        ])
                    ])
                case 1:
                    return null
            }

        }
    },
    // 设置主题
    setTheme: function () {
        // header.theme = header.theme == 'light' ? 'dark' : 'light'
        window.$theme = window.$theme == "light" ? "dark" : "light"

        let theme = header.theme
        // localStorage.setItem("theme", header.theme)
        utils.setItem("theme", window.$theme)
        document.querySelector('body').setAttribute('id', window.$theme)
        window.$message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10516'/*"主题设置成功"*/), type: 'success' })


        gEVBUS.emit(gEVBUS.EV_THEME_UP, { Ev: gEVBUS.EV_THEME_UP, data: { theme: window.$theme } })
    },
    getSwitchTheme: function () {
        return m("a", {
            class: "navbar-item", onclick: function () {
                header.setTheme()
            }
        }, [
            gDI18n.$t('10522')//'切换主题',
        ])
    },
    signOut: function () {
        let loginType = window.$config.loginType
        switch (loginType) {
            case 0:
                window.gWebAPI.ReqSignOut({}, function (res) {
                    console.log('ReqSignOut success ==>> ', res)
                    if (res.result.code === 0) {
                        window.$message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10004'/*'退出登录成功！'*/), type: 'success' })
                    } else {
                        window.$message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10005'/*'退出登录失败！'*/), type: 'danger' })
                    }
                }, function (err) {
                    window.$message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10006'/*'操作超时'*/), type: 'danger' })
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
    customSignOut: function ({ onSuc }) {
        // 在此处定义退出登录请求处理，退出登录成功后调用onSuc
    },
    getGoodsInStock: function () {
        let GIS = window.$config.goodsInStock
        switch (GIS) {
            case 1:
                return m('a', {
                    class: "navbar-item" + (window.gMkt.CtxPlaying.pageTradeStatus == 2 ? ' has-text-primary' : ''), onclick: function () {
                        header.setTradeStatus(2)
                        router.push({ path: "/future" })
                        header.clearInType()
                    }
                }, [
                    gDI18n.$t('10524'), // '币币交易',
                ])
            case 0:
                return null
        }
    },
    setChangeModle: function (item) {
        window.$inType = item.id
        utils.setItem("InfromationType", item.id)
        router.push({ path: "/information" })
    },
    getImationList: function () {
        let infromationType = utils.getItem("InfromationType") ? utils.getItem("InfromationType") : window.$inType
        return this.informationList.map(function (item, i) {
            return m('div', {
                class: "contract-information cursor-pointer" + (infromationType == i ? " has-text-primary is-background-2" : ""), key: "contractinformation" + i, onclick: function () {
                    header.setTradeStatus(3)
                    header.setChangeModle(item)
                }
            }, [
                item.name
            ])
        })
    },
    //清除保存的状态
    clearInType: function () {
        utils.setItem("InfromationType", null)
        window.$inType = null
    },
    //合约信息
    getContractInformation: function () {
        let ciformation = window.$config.ConInformation
        if (ciformation) {
            return m("div", {
                class: "navbar-item has-dropdown" + (header.informationOpen ? ' is-active' : ''),
                onmouseover: function () {
                    header.informationOpen = true
                }, onmouseout: function () {
                    header.informationOpen = false
                }
            }, [
                m("a", { class: "navbar-item" }, [
                    gDI18n.$t('10109'), //'合约信息',
                    m('span', { class: "icon " }, [
                        m('i', { class: "my-trigger-icon iconfont iconxiala1 has-text-primary", "aria-hidden": true })
                    ]),
                ]),
                m("div", { class: "navbar-dropdown dropdown-width-styl" }, [
                    header.getImationList()
                ])
            ])
        } else {
            return null
        }
    },
    getLeftCon: function () {
        let type = window.$config.views.header.left.type
        if (type == 0) {
            return m("div", { class: "navbar-menu" }, [
                m("div", { class: "navbar-start" }, [
                    m('a', {
                        class: "navbar-item" + (window.gMkt.CtxPlaying.pageTradeStatus == 1 ? ' has-text-primary' : ''), onclick: function () {
                            header.setTradeStatus(1)
                            router.push({ path: "/future" })
                            header.clearInType()
                        }
                    }, [
                        gDI18n.$t('10001'/*合约交易*/),
                    ]),
                    header.getGoodsInStock(),
                    header.getContractInformation(),

                ])
            ])
        } else {
            return this.customLeft()
        }
    },
    customLeft: function () {

    },
    // 右边菜单栏
    getRightCon: function () {
        let type = window.$config.views.header.right.type
        let isLogin = window.gWebAPI.isLogin()
        if (type == 0) {
            return m("div", { class: "navbar-menu" }, [
                m("div", { class: "navbar-end" }, [
                    isLogin ? header.getAssetMenu() : '', // 资产菜单
                    isLogin ? header.getOrderMenu() : '', // 订单菜单
                    header.getSwitchLine(),
                    header.getSwitchTheme(),
                    header.getChangeLangDom(),
                    header.getLoginDom()
                ])
            ])
        } else {
            return this.customRight()
        }
    },
    customRight: function () {

    },
    getLogoCon: function () {
        let type = window.$config.views.header.logo.type
        if (type == 0) {
            return m('div', { class: "navbar-brand" }, [
                m('a', { class: "navbar-item" }, [
                    m('img', { src: headerLogo, height: "28" }),
                ]),
                m('a', {
                    role: "button", class: "navbar-burger burger", "aria-label": "menu", "aria-expanded": "false", "data-target": "navbarBasicExample", onclick: function () {
                        header.headerMenu = !header.headerMenu
                    }
                }, [
                    m('span', { "aria-hidden": "true" }, []),
                    m('span', { "aria-hidden": "true" }, []),
                    m('span', { "aria-hidden": "true" }, []),
                ]),
            ])
        } else {
            return this.customLogo()
        }
    },
    customLogo: function () {

    },
    getLogin: function () {
        let type = window.$config.views.login.type
        if (type == 0) {
            return m(login)
        } else {
            return this.customLogin()
        }
    },
    customLogin: function () {

    },
    getMenuCon: function () {
        let type = window.$config.views.login.type
        if (type == 0) {
            return m("div", { class: "navbar-menu is-hidden-desktop" + (header.headerMenu ? ' is-active' : ' is-hidden') }, [
                m("div", { class: "navbar-end" }, [
                    header.getLoginDom()
                ])
            ])
        } else {
            return this.customMenu()
        }
    },
    customMenu: function () {

    },
    getChangeLangDom: function () {
        return m("div", { class: "navbar-item has-dropdown is-hoverable" }, [
            m("a", { class: "navbar-link" }, [
                gDI18n.langList[gDI18n.locale].language
            ]),
            m("div", { class: "navbar-dropdown" }, [
                header.getChangeLangList()
            ])
        ])
    },
    getChangeLangList: function () {
        let langList = []
        for (let key in gDI18n.langList) {
            let item = gDI18n.langList[key]
            if (item.open) {
                langList.push(item)
            }
        }
        return langList.map(function (item, i) {
            return m("a", {
                key: "ChangeLangListItem" + i + item, class: "navbar-item" + (item.key == gDI18n.locale ? ' has-text-primary' : ''), onclick: function () {
                    header.setLang(item.key)
                }
            }, [
                item.language
            ])
        })
    },
    setLang: function (param) {
        gDI18n.setLocale(param, arg => {
            console.log('change lang suc', arg)
            gEVBUS.emit(gDI18n.EV_CHANGELOCALE_UPD, { Ev: gDI18n.EV_CHANGELOCALE_UPD, locale: arg })
        })
    },
    getSwitchLine: function () {
        return m("div", {
            class: "navbar-item has-dropdown" + (header.netLineOpen ? ' is-active' : ''),
            onmouseover: function () {
                header.netLineOpen = true
                gEVBUS.emit(gEVBUS.EV_OPEN_NET_SWITCH, { Ev: gEVBUS.EV_OPEN_NET_SWITCH, lines: header.netLineOpen })
            }, onmouseout: function () {
                header.netLineOpen = false
            }
        }, [
            m("a", { class: "navbar-item" }, [
                m('span', { class: "icon " }, [
                    m('i', { class: "iconfont iconsignal", "aria-hidden": true })
                ]),
            ]),
            m("div", { class: "navbar-dropdown" }, [
                m(netLines)
            ])
        ])
    },
    // 资产菜单
    getAssetMenu: function () {
        return m("div", { class: "navbar-item has-dropdown is-hoverable" }, [
            m("a", { class: "navbar-item" }, ["资产"]),
            m("div", { class: "navbar-dropdown" },
                header.assetMenuList.map(item => {
                    return m('a', { class: `navbar-item` }, [item.label])
                })
            )
        ])
    },
    // 订单菜单
    getOrderMenu: function () {
        return m("div", { class: "navbar-item has-dropdown is-hoverable" }, [
            m("a", { class: "navbar-item" }, ["订单"]),
            m("div", { class: "navbar-dropdown" },
                header.orderMenuList.map(item => {
                    return m('a', { class: `navbar-item` }, [item.label])
                })
            )
        ])
    },
}
import headerLogo from '../../../tplibs/img/header-logo.png'
import login from './userCenter/login'
import netLines from './network/netLines'
import utils from '../../utils/utils'
export default {
    oninit: function (vnode) {

    },
    oncreate: function (vnode) {
        header.initLanguage()
        header.initTradeStatus()
        header.initEVBUS()
        header.theme = window.$theme ? window.$theme : header.theme
    },
    view: function (vnode) {

        return m("nav", { class: "navbar is-fixed-top is-transparent"/*pub-header*/, role: "navigation", "aria-label": "main navigation" }, [
            header.getLogoCon(),
            header.getLeftCon(),
            header.getRightCon(),
            header.getMenuCon()
        ])
    },
    onremove: function (vnode) {
        header.rmEVBUS()
    },
}