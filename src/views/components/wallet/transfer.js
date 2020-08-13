var m = require("mithril")
import Dropdown from "../common/Dropdown"

let obj = {
    showMenuFrom: false,
    showMenuTo: false,
    form: {
        // coin: 'USDT', // 合约下拉列表 value
        coin: window.gMkt.CtxPlaying.Sym, // 合约下拉列表 value
        transferFrom: '03', // 从xx钱包 value
        transferTo: '01', // 到xx钱包 value
        num: '',
        maxTransfer: 0, // 最大划转
    },

    allWalletList: [], // 所有账户
    contractList: [], // 合约账户
    bibiList: [], // 币币账户
    myWalletList: [], // 我的钱包
    legalTenderList: [], // 法币账户

    canTransferListOpen: false, // 合约下拉开关
    canTransferCoin: [],

    baseWltList: [], // 钱包列表 所有
    authWltList: [], // 钱包列表 当前币种有权限
    fromWltList: [], // 钱包列表 从xx  （from与to钱包 不能同一种类型相互划转）
    toWltList: [], // 钱包列表 到xx
    wlt: {},
    //初始化全局广播 
    initEVBUS: function () {
        let that = this


        if (this.EV_GET_WLT_READY_unbinder) {
            this.EV_GET_WLT_READY_unbinder()
        }
        this.EV_GET_WLT_READY_unbinder = window.gEVBUS.on(gTrd.EV_GET_WLT_READY, arg => {
            that.setMaxTransfer()
        })

        if (this.EV_WLT_UPD_unbinder) {
            this.EV_WLT_UPD_unbinder()
        }
        this.EV_WLT_UPD_unbinder = window.gEVBUS.on(gTrd.EV_WLT_UPD, arg => {
            that.setMaxTransfer()
        })

        if (this.EV_POSABDWLTCALCOVER_UPD_unbinder) {
            this.EV_POSABDWLTCALCOVER_UPD_unbinder()
        }
        this.EV_POSABDWLTCALCOVER_UPD_unbinder = window.gEVBUS.on(window.gTrd.EV_POSABDWLTCALCOVER_UPD, arg => {
            that.setMaxTransfer()
        })
        if (this.EV_WEB_LOGOUT_unbinder) {
            this.EV_WEB_LOGOUT_unbinder()
        }
        this.EV_WEB_LOGOUT_unbinder = window.gEVBUS.on(gWebAPI.EV_WEB_LOGOUT, arg => {
            that.setMaxTransfer()
        })

        if (this.EV_WEB_LOGIN_unbinder) {
            this.EV_WEB_LOGIN_unbinder()
        }
        this.EV_WEB_LOGIN_unbinder = window.gEVBUS.on(gWebAPI.EV_WEB_LOGIN, arg => {
            that.getWallet()
        })
        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD, arg => {
            that.initLanguage()
        })

        //页面交易类型全局广播
        if (this.EV_PAGETRADESTATUS_UPD_unbinder) {
            this.EV_PAGETRADESTATUS_UPD_unbinder()
        }
        this.EV_PAGETRADESTATUS_UPD_unbinder = window.gEVBUS.on(gMkt.EV_PAGETRADESTATUS_UPD, arg => {
            that.initFromAndToValueByAuthWalletList() // 2个钱包value 初始化
            that.initTransferInfo()
        })
        //当前选中合约变化全局广播
        if (this.EV_CHANGESYM_UPD_unbinder) {
            this.EV_CHANGESYM_UPD_unbinder()
        }
        this.EV_CHANGESYM_UPD_unbinder = window.gEVBUS.on(gMkt.EV_CHANGESYM_UPD, arg => {
            // 根据头部下拉 默认选中此处合约下拉
            obj.form.coin =  window.gMkt.AssetD[window.gMkt.CtxPlaying.Sym].SettleCoin
        })
    },
    initLanguage: function () {
        this.baseWltList = [
            {
                id: '01',
                label: gDI18n.$t('10217'),//'合约账户',
            },
            {
                id: '02',
                label: gDI18n.$t('10218'),//'币币账户',
            },
            {
                id: '03',
                label: gDI18n.$t('10219'),//'我的钱包',
            },
            {
                id: '04',
                label: gDI18n.$t('10220'),//'法币账户',
            },
        ]
    },
    //删除全局广播
    rmEVBUS: function () {
        if (this.EV_CHANGESYM_UPD_unbinder) {
            this.EV_CHANGESYM_UPD_unbinder()
        }
        if (this.EV_GET_WLT_READY_unbinder) {
            this.EV_GET_WLT_READY_unbinder()
        }
        if (this.EV_WLT_UPD_unbinder) {
            this.EV_WLT_UPD_unbinder()
        }
        if (this.EV_POSABDWLTCALCOVER_UPD_unbinder) {
            this.EV_POSABDWLTCALCOVER_UPD_unbinder()
        }
        if (this.EV_WEB_LOGOUT_unbinder) {
            this.EV_WEB_LOGOUT_unbinder()
        }
        if (this.EV_WEB_LOGIN_unbinder) {
            this.EV_WEB_LOGIN_unbinder()
        }
        if (this.EV_PAGETRADESTATUS_UPD_unbinder) {
            this.EV_PAGETRADESTATUS_UPD_unbinder()
        }
    },

    initWlt: function (arg) {
        let Sym = window.gMkt.CtxPlaying.Sym
        let assetD = window.gMkt.AssetD[Sym] || {}
        let wallets = []
        if (assetD.TrdCls == 2 || assetD.TrdCls == 3) {
            wallets = window.gTrd.Wlts['01']
        }
        let isUpdate = false
        for (let i = 0; i < wallets.length; i++) {
            let item = wallets[i]
            if (item.AId && item.Coin == assetD.SettleCoin) {
                isUpdate = true
                this.wlt = item
            }
        }
        if (!isUpdate) {
            this.wlt = {}
        }
        m.redraw()
    },
    onInputForNum: function (e) {
        if (Number(e.target.value) < 0) {
            this.form.num = 0
        } else {
            this.form.num = e.target.value
        }
    },
    // 切换按钮 click
    switchBtnClick () {
        this.form.num = ''
        this.switchTransfer() // 2个钱包value切换
        this.initFromAndToWalletListByValue() // 2个钱包列表 初始化 （依赖钱包value）
        this.setMaxTransfer() // 设置 最大划转
    },
    // 2个钱包value切换
    switchTransfer () {
        [this.form.transferFrom, this.form.transferTo] = [this.form.transferTo, this.form.transferFrom]
    },
    getWallet: function () {
        let that = this
        if (window.gWebAPI.isLogin()) {
            window.gWebAPI.ReqGetAssets({
                exChannel: window.$config.exchId
            }, function (arg) {
                that.initTransferInfo()
            })
        }
    },
    // 初始化 划转信息
    initTransferInfo () {
        let wallets = window.gWebAPI.CTX.wallets // all数据

        this.contractList = wallets['01'].filter(item => item.Setting.canTransfer) //'合约账户',
        this.bibiList = wallets['02'].filter(item => item.Setting.canTransfer) //'币币账户',
        this.myWalletList = wallets['03'].filter(item => item.Setting.canTransfer) //'我的钱包',
        this.legalTenderList = wallets['04'].filter(item => item.Setting.canTransfer) //'法币账户',

        // 钱包列表
        this.allWalletList = [
            {
                id: "01",
                list: this.contractList
            },
            {
                id: "02",
                list: this.bibiList
            },
            {
                id: "03",
                list: this.myWalletList
            },
            {
                id: "04",
                list: this.legalTenderList
            },
        ]

        // 获取币种下拉列表（ this.canTransferCoin ）：逻辑：每一项至少出现在2个钱包 且 列表去重
        this.allWalletList.forEach((data, index) => {
            // 遍历每个钱包的币种
            data.list.forEach(item => {
                // 币种是否出现在2个钱包
                let hasMore = this.allWalletList.some((data2, index2) => index != index2 && data2.list.some(item2 => item2.wType == item.wType))
                // 币种是否重复
                if (hasMore && !this.canTransferCoin.some(item3 => item3.wType == item.wType)) this.canTransferCoin.push(item) // push
            })
        })

        // if (this.canTransferCoin[0]) this.form.coin = this.canTransferCoin[0].wType  // 合约下拉列表 默认选中第一个
        if (this.canTransferCoin[0]) this.form.coin = window.gMkt.AssetD[window.gMkt.CtxPlaying.Sym].SettleCoin || this.canTransferCoin[0].wType  // 合约下拉列表 默认选中第一个

        this.initWalletListByWTypeAndValue(obj.form.coin) // 初始化钱包 list 和 value

        this.setMaxTransfer() // 设置 最大划转
    },
    // 合约 下拉列表
    getCoinList () {
        return this.canTransferCoin.map(function (item, i) {
            return m('a',
                {
                    key: "canTransferCoinItem" + i,
                    class: "dropdown-item cursor-pointer" + (obj.form.coin == item.wType ? ' has-text-primary' : ''),
                    onclick: () => obj.coinClick(item)
                },
                [item.wType]
            )
        })
    },
    // 合约下拉列表 click
    coinClick (item) {
        this.setTransferCoin(item.wType)// 设置 coin
        this.setMaxTransfer() // 设置 最大划转
        this.initWalletListByWTypeAndValue(item.wType) // 初始化钱包 list 和 value
    },
    // 初始化钱包 list 和 value
    initWalletListByWTypeAndValue (wType) {
        this.initAuthWalletListByWType(wType)// 1. 有权限的钱包list 初始化
        this.initFromAndToValueByAuthWalletList() // 2. 钱包value  初始化
        this.initFromAndToWalletListByValue() // 3. 2个钱包list 初始化 （依赖钱包value）
    },
    // 有权限的钱包列表 初始化（wType: 合约）
    initAuthWalletListByWType (wType) {
        // 遍历不同种类钱包
        this.authWltList = this.allWalletList.map(wallet => {
            // 当前钱包是否有该币种
            let hasWType = wallet.list.some(item1 => item1.wType == wType)
            if (hasWType) {
                // 有就用该id 去base钱包中找
                return this.baseWltList.find(item3 => item3.id == wallet.id)
            }
        })
        this.authWltList = this.authWltList.filter(item => item) // 钱包列表 去空
    },
    // 2个钱包value 初始化
    initFromAndToValueByAuthWalletList () {
        let pageMap = {
            1: '01',
            2: '02',
            3: '03',
            4: '04',
        }

        // 校验钱包value是否有权限 如果没权限默认选中第一个
        let verifyWalletValueByValue = (value) => {
            if (this.authWltList.some(item => item.id == value)) {
                return value
            } else {
                return this.authWltList[0] && this.authWltList[0].id
            }
        }

        // 从xx钱包
        this.form.transferFrom = verifyWalletValueByValue(pageMap[3])

        // 到xx钱包
        this.form.transferTo = verifyWalletValueByValue(pageMap[window.gMkt.CtxPlaying.pageTradeStatus])
    },
    // 2个钱包list 初始化 （依赖钱包value）
    initFromAndToWalletListByValue () {
        this.fromWltList = this.authWltList.filter(item => item.id != obj.form.transferTo)
        this.toWltList = this.authWltList.filter(item => item.id != obj.form.transferFrom)
        console.log("this.fromWltList", this.fromWltList, "this.toWltList", this.toWltList);
    },
    // 设置 选中合约
    setTransferCoin (param) {
        this.form.coin = param
        this.canTransferListOpen = false
        this.form.num = ''
    },
    // 设置 最大划转
    setMaxTransfer () {
        let coin = this.form.coin
        switch (this.form.transferFrom) {
            // 合约
            case '01':
                let wallet01 = window.gTrd.Wlts['01']
                for (let item of wallet01) {
                    if (item.Coin == coin) {
                        this.form.maxTransfer = Number(item.maxTransfer || 0).toFixed2(8)
                    }
                }
                break;
            // 币币
            case '02':
                let wallet02 = window.gTrd.Wlts['02']
                for (let item of wallet02) {
                    if (item.Coin == coin) {
                        this.form.maxTransfer = Number(item.Wdrawable || 0).toFixed2(8)
                    }
                }
                break;
            // 我的钱包
            case '03':
                let wallet03 = window.gWebAPI.CTX.wallets_obj['03']
                this.form.maxTransfer = Number(wallet03[coin] && wallet03[coin].mainBal || 0).toFixed2(8)
                break;

            // 法币
            case '04':
                let wallet04 = window.gWebAPI.CTX.wallets_obj['04']
                this.form.maxTransfer = Number(wallet04[coin] && wallet04[coin].otcBal || 0).toFixed2(8)
                break;
            default:
                this.form.maxTransfer = "--"
        }
    },
    setTransferNum: function (param) {
        this.form.num = param
    },
    submit: function () {
        let that = this

        if (this.form.num === '0') {
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10221'/*'划转数量不能为0'*/), type: 'danger' })
        } else if (!this.form.num) {
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10222'/*'划转数量不能为空'*/), type: 'danger' })
        } else if (Number(this.form.num) == 0) {
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10221'/*'划转数量不能为0'*/), type: 'danger' })
        } else if (Number(this.form.num) > Number(this.form.maxTransfer)) {
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10223'/*'划转数量不能大于最大可划'*/), type: 'danger' })
        }
        this.loading = true
        window.gWebAPI.ReqTransfer({
            aTypeFrom: this.form.transferFrom,
            aTypeTo: this.form.transferTo,
            wType: this.form.coin,
            num: Number(this.form.num || 0),
        }, function (arg) {
            if (arg.result.code == 0) {
                setTimeout(function () {
                    $message({ content: gDI18n.$t('10224'/*'划转成功！'*/), type: 'success' })
                    that.form.num = ''
                    that.loading = false
                    that.getWallet()
                    obj.initFromAndToValueByAuthWalletList() // 2个钱包value 初始化
                }, 2500)
            } else {
                window.$message({ title: gDI18n.$t('10037'/*"提示"*/), content: utils.getWebApiErrorCode(arg.result.code), type: 'danger' })
                that.loading = false
            }
        }, function (error) {
            $message({ content: gDI18n.$t('10225'/*'操作超时，请稍后重试！'*/), type: 'danger' })
            that.loading = false
        })
    }
}

export default {
    oninit: function (vnode) {
        obj.initLanguage()
        obj.initFromAndToValueByAuthWalletList() // 2个钱包value 初始化
    },
    oncreate: function (vnode) {
        obj.initEVBUS()
        obj.getWallet()
        obj.initTransferInfo()
    },
    view: function (vnode) {

        return m("div", { class: "pub-transfer" }, [
            m('div', { class: "pub-transfer-coin-dropdown field" }, [
                m('div', { class: "dropdown" + (obj.canTransferListOpen ? ' is-active' : '') }, [
                    m('div', { class: "dropdown-trigger" }, [
                        m('button', {
                            class: "button is-outline is-fullwidth", onclick: function () {
                                obj.canTransferListOpen = !obj.canTransferListOpen
                            }
                        }, [
                            m('div', { class: "button-content is-flex" }, [
                                obj.form.coin,
                                m('.spacer'),
                                m('span', { class: "icon" }, [
                                    m('i', { class: "iconfont iconxiala has-text-primary is-size-7" })
                                ]),
                            ]),
                        ]),
                    ]),
                    m('div', { class: "dropdown-menu" }, [
                        m('div', { class: "dropdown-content" }, [
                            obj.getCoinList()
                        ]),
                    ]),
                ]),
            ]),
            // 划转
            m('div', { class: "pub-transfer-transfer-select field  has-addons" }, [
                // 从 xx 钱包
                m('div', { class: `pub-transfer-transfer-select field has-addons` }, [
                    m(Dropdown, {
                        btnHeight: 40,
                        activeId: cb => cb(obj.form, 'transferFrom'),
                        showMenu: obj.showMenuFrom,
                        setShowMenu: type => {
                            obj.showMenuFrom = type
                            obj.showMenuTo = false
                        },
                        onClick (item) {
                            // console.log(obj.form.transferFrom);
                            obj.initFromAndToWalletListByValue() // 初始化 2个钱包下拉列表 （依赖钱包value）
                            obj.setMaxTransfer() // 设置 最大划转
                        },
                        getList () {
                            return obj.fromWltList
                        }
                    })
                ]),
                m("div", { class: "pub-transfer-transfer-select-center control is-expanded cursor-pointer" }, [
                    gDI18n.$t('10227')//'划至'
                ]),
                // 到 xx 钱包
                m('div', { class: `pub-transfer-transfer-select-right control is-expanded` }, [
                    m(Dropdown, {
                        btnHeight: 40,
                        activeId: cb => cb(obj.form, 'transferTo'),
                        showMenu: obj.showMenuTo,
                        setShowMenu: type => {
                            obj.showMenuTo = type
                            obj.showMenuFrom = false
                        },

                        onClick (item) {
                            // console.log(obj.form.transferTo);
                            obj.initFromAndToWalletListByValue() // 初始化 2个钱包下拉列表 （依赖钱包value）
                            obj.setMaxTransfer() // 设置 最大划转
                        },
                        getList () {
                            return obj.toWltList
                        }
                    })
                ]),
                m("div", {
                    class: "pub-transfer-transfer-select-center control is-expanded cursor-pointer", onclick () {
                        obj.switchBtnClick()
                    }
                }, [
                    m('span', { class: "icon is-medium" }, [
                        m('i', { class: "iconfont iconswitch has-text-primary is-size-4" })
                    ]),
                ]),
            ]),
            // 
            m("div", { class: "pub-transfer-num-input field" }, [
                m("div", { class: "control" }, [
                    m("input", {
                        class: "input", type: 'number', placeholder: gDI18n.$t('10228'/*"请输划转入数量"*/), value: obj.form.num, oninput: function (e) {
                            obj.onInputForNum(e)
                        }
                    })
                ])
            ]),
            m("div", {
                class: "pub-transfer-wlt field cursor-pointer is-size-7", onclick: function () {
                    obj.setTransferNum(obj.form.maxTransfer)
                }
            }, [
                gDI18n.$t('10229', { value: obj.form.maxTransfer })
                // '最大可划：'+obj.form.maxTransfer
            ]),
            m("div", { class: "pub-transfer-btn field" }, [
                m("button", {
                    class: "button is-primary is-fullwidth" + (obj.loading ? ' is-loading' : ''), onclick: function () {
                        obj.submit()
                    }
                }, [
                    gDI18n.$t('10230')//'划转'
                ])
            ]),
        ])
    },
    onremove: function () {
        obj.rmEVBUS()
    }
}