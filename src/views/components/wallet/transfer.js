var m = require("mithril")
import Dropdown from "../common/Dropdown"

let obj = {
    form: {
        coin: 'USDT', // 合约
        transferFrom: '03', // 从xx账户
        transferTo: '01', // 到xx账户
        num: '',
        maxTransfer: 0,
    },
    canTransferListOpen: false,
    canTransferCoin: [],
    // 钱包 下拉列表
    wltList: {
        '01': gDI18n.$t('10217'),//'合约账户',
        '02': gDI18n.$t('10218'),//'币币账户',
        '03': gDI18n.$t('10219'),//'我的钱包',
        '04': gDI18n.$t('10220'),//'法币账户',
    },
    newWltList: [],
    wlt: {},
    //初始化全局广播 
    initEVBUS: function(){
        let that = this
        

        if(this.EV_GET_WLT_READY_unbinder){
            this.EV_GET_WLT_READY_unbinder()
        }
        this.EV_GET_WLT_READY_unbinder = window.gEVBUS.on(gTrd.EV_GET_WLT_READY,arg=> {
            that.setMaxTransfer()
        })

        if(this.EV_WLT_UPD_unbinder){
            this.EV_WLT_UPD_unbinder()
        }
        this.EV_WLT_UPD_unbinder = window.gEVBUS.on(gTrd.EV_WLT_UPD,arg=> {
            that.setMaxTransfer()
        })

        if(this.EV_POSABDWLTCALCOVER_UPD_unbinder){
            this.EV_POSABDWLTCALCOVER_UPD_unbinder()
        }
        this.EV_POSABDWLTCALCOVER_UPD_unbinder = window.gEVBUS.on(window.gTrd.EV_POSABDWLTCALCOVER_UPD,arg=> {
            that.setMaxTransfer()
        })
        if(this.EV_WEB_LOGOUT_unbinder){
            this.EV_WEB_LOGOUT_unbinder()
        }
        this.EV_WEB_LOGOUT_unbinder = window.gEVBUS.on(gWebAPI.EV_WEB_LOGOUT,arg=> {
            that.setMaxTransfer()
        })

        if(this.EV_WEB_LOGIN_unbinder){
            this.EV_WEB_LOGIN_unbinder()
        }
        this.EV_WEB_LOGIN_unbinder = window.gEVBUS.on(gWebAPI.EV_WEB_LOGIN,arg=> {
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
            that.setTransferInfo()
            that.initTransferInfo()
        })
        
    },
    initLanguage: function(){
        this.wltList = {
            '01': gDI18n.$t('10217'),//'合约账户',
            '02': gDI18n.$t('10218'),//'币币账户',
            '03': gDI18n.$t('10219'),//'我的钱包',
            '04': gDI18n.$t('10220'),//'法币账户',
        }
        this.newWltList = [
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
    rmEVBUS: function(){
        if(this.EV_CHANGESYM_UPD_unbinder){
            this.EV_CHANGESYM_UPD_unbinder()
        }
        if(this.EV_GET_WLT_READY_unbinder){
            this.EV_GET_WLT_READY_unbinder()
        }
        if(this.EV_WLT_UPD_unbinder){
            this.EV_WLT_UPD_unbinder()
        }
        if(this.EV_POSABDWLTCALCOVER_UPD_unbinder){
            this.EV_POSABDWLTCALCOVER_UPD_unbinder()
        }
        if(this.EV_WEB_LOGOUT_unbinder){
            this.EV_WEB_LOGOUT_unbinder()
        }
        if(this.EV_WEB_LOGIN_unbinder){
            this.EV_WEB_LOGIN_unbinder()
        }
        if (this.EV_PAGETRADESTATUS_UPD_unbinder) {
            this.EV_PAGETRADESTATUS_UPD_unbinder()
        }
    },

    initWlt: function(arg){
        let Sym = window.gMkt.CtxPlaying.Sym
        let assetD = window.gMkt.AssetD[Sym] || {}
        let wallets = []
        if(assetD.TrdCls == 2 || assetD.TrdCls == 3){
            wallets = window.gTrd.Wlts['01']
        }
        let isUpdate = false
        for(let i = 0;i < wallets.length; i++){
            let item = wallets[i]
            if(item.AId && item.Coin == assetD.SettleCoin){
                isUpdate = true
                this.wlt = item
            }
        }
        if(!isUpdate){
            this.wlt = {}
        }
        m.redraw()
    },
    onInputForNum: function(e){
        if(Number(e.target.value) < 0){
            this.form.num = 0
        }else{
            this.form.num = e.target.value
        }
    },
    switchTransfer: function(){
        console.log(obj.form.transferTo);
        [this.form.transferFrom, this.form.transferTo] = [this.form.transferTo, this.form.transferFrom]
        this.form.num = ''
        this.setMaxTransfer()
    },
    getWallet: function(){
        let that = this
        if(window.gWebAPI.isLogin()){
            window.gWebAPI.ReqGetAssets({
                exChannel: window.$config.exchId
            }, function(arg){
                that.initTransferInfo()
            })
        }
    },
    setTransferInfo:function(){
        let pageTradeStatus = window.gMkt.CtxPlaying.pageTradeStatus // 1:合约/2:币币 模式
        switch(pageTradeStatus){
            case 1:
                this.form.transferTo = "01";
                this.form.transferFrom = "03"
                break;
            case 2:
                this.form.transferTo = "02";
                this.form.transferFrom = "03"
                break;
        }
    },
    initTransferInfo: function(){
        let wallets = window.gWebAPI.CTX.wallets
        obj.setTransferInfo()

        let canTransferFor01 = []
        let pageTradeStatus = window.gMkt.CtxPlaying.pageTradeStatus
        switch(pageTradeStatus){
            case 1:
                for(let item of wallets['01']){
                    if(item.Setting.canTransfer){
                        canTransferFor01.push(item.wType)
                    }
                }
                break;
            case 2:
                for(let item of wallets['02']){
                    if(item.Setting.canTransfer){
                        canTransferFor01.push(item.wType)
                    }
                }
                break;
        }
        let canTransferFor03 = []
        for(let item of wallets['03']){
            if(item.Setting.canTransfer){
                canTransferFor03.push(item.wType)
            }
        }

        let canTransfer = canTransferFor01.filter(function(item){
            return canTransferFor03.includes(item)
        })
        this.canTransferCoin = canTransfer  
        this.form.coin = canTransfer[0]
        this.setMaxTransfer()
    },
    // 合约 下拉列表
    getCoinList: function(){
        return this.canTransferCoin.map(function(item, i){
            return m('a', {key: "canTransferCoinItem"+i, class:"dropdown-item cursor-pointer"+(obj.form.coin == item?' has-text-primary':''), onclick: function(){
                obj.setTransferCoin(item)
            }}, [
                item
            ])
        })
    },
    setTransferCoin: function(param){
        this.form.coin = param
        this.canTransferListOpen = false
        this.form.num = ''
        this.setMaxTransfer()
    },
    setMaxTransfer: function(){
        let coin = this.form.coin
        switch(this.form.transferFrom){
            case '01':
                let wallet01 = window.gTrd.Wlts['01']
                for(let item of wallet01){
                    if(item.Coin == coin){
                        this.form.maxTransfer = Number(item.maxTransfer || 0).toFixed2(8)
                    }
                }
                break;
            
            case '02':
                let wallet02 = window.gTrd.Wlts['02']
                for(let item of wallet02){
                    if(item.Coin == coin){
                        this.form.maxTransfer = Number(item.Wdrawable || 0).toFixed2(8)
                    }
                }
                break;

            case '03':
                let wallet03 = window.gWebAPI.CTX.wallets_obj['03']
                this.form.maxTransfer = Number(wallet03[coin] && wallet03[coin].mainBal || 0).toFixed2(8)
                break;
            default:

        }
    },
    setTransferNum: function(param){
        this.form.num = param
    },
    submit: function(){
        let that = this

        if(this.form.num === '0'){
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10221'/*'划转数量不能为0'*/), type: 'danger'})
        }else if(!this.form.num){
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10222'/*'划转数量不能为空'*/), type: 'danger'})
        }else if(Number(this.form.num) == 0){
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10221'/*'划转数量不能为0'*/), type: 'danger'})
        }else if(Number(this.form.num) > Number(this.form.maxTransfer)){
            return $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10223'/*'划转数量不能大于最大可划'*/), type: 'danger'})
        }
        this.loading = true
        window.gWebAPI.ReqTransfer({
            aTypeFrom: this.form.transferFrom,
            aTypeTo: this.form.transferTo,
            wType: this.form.coin,
            num: Number(this.form.num || 0),
        }, function(arg){
            if(arg.result.code == 0){
                setTimeout(function(){
                    $message({content: gDI18n.$t('10224'/*'划转成功！'*/), type: 'success'})
                    that.form.num = ''
                    that.loading = false
                    that.getWallet()
                    obj.setTransferInfo()
                }, 2500)
            }else{
                window.$message({ title: gDI18n.$t('10037'/*"提示"*/), content: utils.getWebApiErrorCode(arg.result.code), type: 'danger'})
                that.loading = false
            }
        }, function(error){
            $message({content: gDI18n.$t('10225'/*'操作超时，请稍后重试！'*/), type: 'danger'})
            that.loading = false
        })
    }
}

export default {
    oninit: function(vnode){
        obj.initLanguage()
    },
    oncreate: function(vnode){
        obj.initEVBUS()
        obj.getWallet()
        obj.initTransferInfo()
    },
    view: function(vnode) {
        
        return m("div",{class:"pub-transfer"},[
            m('div', {class:"pub-transfer-coin-dropdown field"}, [
                m('div', {class:"dropdown"+(obj.canTransferListOpen?' is-active':'')}, [
                    m('div', {class:"dropdown-trigger"}, [
                        m('button', {class:"button is-outline is-fullwidth", onclick: function(){
                            obj.canTransferListOpen = !obj.canTransferListOpen
                        }}, [
                            m('div', {class:"button-content is-flex"}, [
                                obj.form.coin,
                                m('.spacer'),
                                m('span', {class:"icon"}, [
                                    m('i', {class:"iconfont iconxiala has-text-primary is-size-7"})
                                ]),
                            ]),
                        ]),
                    ]),
                    m('div', {class:"dropdown-menu"}, [
                        m('div', {class:"dropdown-content"}, [
                            obj.getCoinList()
                        ]),
                    ]),
                ]),
            ]),
            // 选择账户
            m('div', {class:"pub-transfer-transfer-select field  has-addons"}, [
                // m("div", { class: "pub-transfer-transfer-select-left control is-expanded" }, [
                //     m('div', {class:"dropdown is-hoverable"}, [
                //         m('div', {class:"dropdown-trigger"}, [
                //             m('button', {class:"button button-default-padding is-outline is-fullwidth"}, [
                //                 obj.wltList[obj.form.transferFrom],
                //             ]),
                //         ]),
                //     ]),
                // ]),
                m('div', { class: `pub-transfer-transfer-select field has-addons` }, [
                    m(Dropdown, {
                        // activeId: obj.form.transferFrom,
                        btnHeight: 40,
                        activeId: cb => cb(obj.form, 'transferFrom'),
                        onClick (item) {
                            obj.form.transferFrom = item.id
                            console.log(item);
                        },
                        getList () {
                            return obj.newWltList
                        }
                    })
                ]),
                m("div", { class: "pub-transfer-transfer-select-center control is-expanded cursor-pointer"}, [
                    gDI18n.$t('10227')//'划至'
                ]),
                // m("div", { class: "pub-transfer-transfer-select-right control is-expanded" }, [
                //     m('div', {class:"dropdown is-hoverable"}, [
                //         m('div', {class:"dropdown-trigger"}, [
                //             m('button', {class:"button button-default-padding is-outline is-fullwidth"}, [
                //                 obj.wltList[obj.form.transferTo],
                //             ]),
                //         ]),
                //     ]),
                // ]),
                m('div', { class: `pub-transfer-transfer-select-right control is-expanded` }, [
                    m(Dropdown, {
                        // activeId: obj.form.transferTo,
                        btnHeight: 40,
                        activeId: cb => cb(obj.form, 'transferTo'),
                        onClick (item) {
                            obj.form.transferTo = item.id
                            console.log(item);
                        },
                        getList () {
                            return obj.newWltList
                        }
                    })
                ]),
                m("div", { class: "pub-transfer-transfer-select-center control is-expanded cursor-pointer", onclick: function(){
                    obj.switchTransfer()
                }}, [
                    m('span', {class:"icon is-medium"}, [
                        m('i', {class:"iconfont iconswitch has-text-primary is-size-4"})
                    ]),
                ]),
            ]),

            m("div", { class: "pub-transfer-num-input field" }, [
                m("div", { class: "control" }, [
                    m("input", { class: "input", type: 'number', placeholder: gDI18n.$t('10228'/*"请输划转入数量"*/), value: obj.form.num, oninput: function(e) {
                        obj.onInputForNum(e)
                    } })
                ])
            ]),
            m("div", { class: "pub-transfer-wlt field cursor-pointer is-size-7", onclick: function(){
                obj.setTransferNum(obj.form.maxTransfer)
            }}, [
                gDI18n.$t('10229',{value : obj.form.maxTransfer})
                // '最大可划：'+obj.form.maxTransfer
            ]),
            m("div", { class: "pub-transfer-btn field" }, [
                m("button", { class: "button is-primary is-fullwidth"+(obj.loading? ' is-loading':''), onclick: function(){
                    obj.submit()
                }}, [
                    gDI18n.$t('10230')//'划转'
                ])
            ]),
        ])
    },
    onremove: function(){
        obj.rmEVBUS()
    }
}