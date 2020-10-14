const Http = require('@/api').webApi;
const ActiveLine = require('@/api').ActiveLine;
// const broadcast = require('@/broadcast/broadcast');

module.exports = {
    name: 'FOLLOW_DATA',
    entrepotIds: [], // 当前已存在的仓位pid
    wallet_obj: {}, // 跟单 数据
    wallet: [], // 跟单 数据

    init: function () {
        // 初始化
        const that = this;
        that.updWlt();

        // if (this.isInitOnMsg) {
        //     return;
        // }
        // this.isInitOnMsg = true;
        // // 添加ASSETD全局广播，用于资产估值计算
        // broadcast.onMsg({
        //     key: this.name,
        //     cmd: broadcast.MSG_ASSETD_UPD,
        //     cb: function () {
        //         that.initWlt();
        //         that.getRiskLimits();
        //     }
        // });
        // // 交易风险限额数据获取完成广播
        // broadcast.onMsg({
        //     key: this.name,
        //     cmd: broadcast.EV_GET_RS_READY,
        //     cb: function (arg) {
        //         // console.log('EV_GET_RS_READY', arg);
        //         that.trdDataOnFun();
        //     }
        // });
        // // tick行情全局广播
        // broadcast.onMsg({
        //     key: this.name,
        //     cmd: broadcast.MSG_TICK_UPD,
        //     cb: function (arg) {
        //         // console.log('MSG_TICK_UPD', arg);
        //         that.trdDataOnFun();
        //     }
        // });
    },

    updWlt: function () {
        const that = this;
        Http.subAssets({ exChannel: window.exchId, aType: '018' }).then(res => {
            if (res.result.code === 0) {
                that.setWallet(res.assetLists03);
                console.log(this);
            }
        }).finally(res => { that.getFollowPosition(); });
    },

    getFollowPosition: function () {
        const that = this;
        Http.getFollowPosition({ positions: JSON.stringify(that.entrepotIds) }).then(res => {
            console.log(res);
        });
    },

    initWlt: function () {
        // 计算之前先将估值归0
        this.totalValueForUSDT = 0;
        this.totalValueForBTC = 0;
        this.totalValueForCNY = 0;

        // for (const item in this.wallet) {
        //
        // }

        // for (const type in this.wallet_obj) {
        //     // this.wallet_obj[type] = this.wallet_obj[type] ? this.wallet_obj[type] : {};
        //     this.wallet[type] = [];
        //     for (const coin in wlt[type]) {
        //         this.wallet_obj[type][coin] = this.wltHandle(type, wlt[type][coin]);
        //         this.wallet[type].push(this.wallet_obj[type][coin]);
        //
        //         wlt[type][coin].valueForUSDT = this.toFixedForFloor(wlt[type][coin].valueForUSDT, 4);
        //         wlt[type][coin].valueForBTC = this.toFixedForFloor(wlt[type][coin].valueForBTC, 8);
        //
        //         // 总USDT估值
        //         this.totalValueForUSDT += Number(this.wallet_obj[type][coin].valueForUSDT);
        //         // 总BTC估值
        //         this.totalValueForBTC += Number(this.wallet_obj[type][coin].valueForBTC);
        //     }
        // }
    },

    wltHandle: function (type, wlt) {
        this.wltItemEx = {};
        this.wltItemEx = Object.assign({}, wlt);
        let TOTAL = 0;
        let NL = 0;
        let valueForUSDT = 0;
        let valueForBTC = 0;
        const coinPrz = this.getPrz(this.wltItemEx.wType);
        // console.log('ht', AssetD);
        // 取BTC的价格 start
        // const btcSymName = utils.getSpotName(AssetD, 'BTC', 'USDT');
        // const btcInitValue = (this.wallet_obj['03'] && this.wallet_obj['03'].BTC && this.wallet_obj['03'].BTC.initValue) || 0;
        // const btcPrz = (AssetD[btcSymName] && AssetD[btcSymName].PrzLatest) || btcInitValue;
        const btcPrz = this.getPrz('BTC');
        // console.log('ht', 'btc prz', btcSymName, btcInitValue, AssetD[btcSymName] && AssetD[btcSymName].PrzLatest, btcPrz);
        // 取BTC的价格 end
        switch (type) {
        case '01':
            // 合约账户
            // console.log('ht', type, this.wltItemEx);
            TOTAL = Number(this.wltItemEx.Num || 0) + Number(this.wltItemEx.PNL || 0) + Number(this.wltItemEx.PNLISO || 0) + Number(this.wltItemEx.UPNL || 0) + Number(this.wltItemEx.Gift || 0);
            // 账户权益
            this.wltItemEx.MgnBal = this.toFixedForFloor(TOTAL, 8);
            // 可用赠金
            this.wltItemEx.Gift = this.toFixedForFloor(this.wltItemEx.Gift || 0, 8);
            // 可用保证金
            NL = Number(this.wltItemEx.wdrawable || 0) + Number(this.wltItemEx.Gift || 0);
            this.wltItemEx.NL = this.toFixedForFloor(NL, 8);
            // 可用保证金人民币估值
            // const NLToCRN = this.wltItemEx.NL * coinPrz;
            this.wltItemEx.NLToCRN = this.toFixedForFloor(Number(this.wltItemEx.NL * coinPrz) * this.prz, 2);
            // 可用保证金BTC估值
            this.wltItemEx.NLToBTC = this.toFixedForFloor(Number(this.wltItemEx.NL * coinPrz / btcPrz) * this.prz || 0, 8);
            // 委托保证金
            this.wltItemEx.MI = this.toFixedForFloor(this.wltItemEx.MI || 0, 8);
            // 仓位保证金
            this.wltItemEx.MM = this.toFixedForFloor(this.wltItemEx.MM || 0, 8);
            // 已实现盈亏
            this.wltItemEx.PNL = this.toFixedForFloor(this.wltItemEx.PNL || 0, 8);
            // 未实现盈亏
            this.wltItemEx.UPNL = this.toFixedForFloor(this.wltItemEx.UPNL || 0, 8);
            // 为实现盈亏人民币估值
            this.wltItemEx.UPNLToCRN = this.toFixedForFloor(Number(this.wltItemEx.UPNL * coinPrz) * this.prz, 2);
            // 为实现盈亏BTC估值
            this.wltItemEx.UPNLToBTC = this.toFixedForFloor(Number(this.wltItemEx.UPNL * coinPrz / btcPrz) || 0, 8);
            // 账户可提金额，用于资产划转
            this.wltItemEx.wdrawable = this.toFixedForFloor(this.wltItemEx.wdrawable || 0, 8);
            break;
        case '02':
            // 币币账户
            // console.log('ht', type, this.wltItemEx); c
            TOTAL = Number(this.wltItemEx.wdrawable || 0) + Number(this.wltItemEx.Frz || 0);
            // 账户总额
            this.wltItemEx.TOTAL = this.toFixedForFloor(TOTAL, 8);

            // 冻结金额
            // console.log('nzm', 'this.wltItemEx.Gift   ', this.wltItemEx.Gift);
            this.wltItemEx.Frz = this.toFixedForFloor(this.wltItemEx.Frz || 0, 8);

            // 可用金额
            this.wltItemEx.NL = this.toFixedForFloor(this.wltItemEx.wdrawable, 8);
            // 账户可提金额，用于资产划转
            this.wltItemEx.wdrawable = this.toFixedForFloor(this.wltItemEx.wdrawable, 8);
            break;
        case '03':
            // 主钱包
            // console.log('ht', type, this.wltItemEx);
            TOTAL = Number(this.wltItemEx.mainBal || 0) + Number(this.wltItemEx.financeBal || 0) + Number(this.wltItemEx.mainLock || 0) + Number(this.wltItemEx.depositLock || 0) + Number(this.wltItemEx.pawnBal || 0) + Number(this.wltItemEx.creditNum || 0);
            // 账户总额
            this.wltItemEx.TOTAL = this.toFixedForFloor(TOTAL, 8);
            // 矿池
            this.wltItemEx.mainLock = this.toFixedForFloor(this.wltItemEx.mainLock || 0, 8);
            // 锁定
            this.wltItemEx.depositLock = this.toFixedForFloor(this.wltItemEx.depositLock || 0, 8);
            // 理财
            this.wltItemEx.financeBal = this.toFixedForFloor(this.wltItemEx.financeBal || 0, 8);
            // 质押
            this.wltItemEx.pawnBal = this.toFixedForFloor(this.wltItemEx.pawnBal || 0, 8);
            // 可用金额
            this.wltItemEx.NL = this.toFixedForFloor(this.wltItemEx.mainBal, 8);
            // 账户可提金额，用于资产划转以及提现
            this.wltItemEx.wdrawable = this.toFixedForFloor(this.wltItemEx.mainBal, 8);
            break;
        case '04':
            // 法币钱包
            // console.log('ht', type, this.wltItemEx);
            TOTAL = Number(this.wltItemEx.otcLock || 0) + Number(this.wltItemEx.otcBal || 0);
            // 账户总额
            this.wltItemEx.TOTAL = this.toFixedForFloor(TOTAL, 8);
            // 锁定(冻结)
            this.wltItemEx.otcLock = this.toFixedForFloor(this.wltItemEx.otcLock || 0, 8);
            // 理财
            this.wltItemEx.financeBal = this.toFixedForFloor(this.wltItemEx.financeBal || 0, 8);
            // 质押
            this.wltItemEx.pawnBal = this.toFixedForFloor(this.wltItemEx.pawnBal || 0, 8);
            // 可用金额
            this.wltItemEx.NL = this.toFixedForFloor(this.wltItemEx.otcBal, 8);
            // 账户可提金额，用于资产划转以及提现
            this.wltItemEx.wdrawable = this.toFixedForFloor(this.wltItemEx.otcBal, 8);
            break;
        case '05':
            // 算力钱包
            console.log('ht', type, this.wltItemEx);
            break;
        case '06':
            // 跟单钱包
            TOTAL = Number(this.wltItemEx.mainBal || 0) + Number(this.wltItemEx.financeBal || 0) + Number(this.wltItemEx.mainLock || 0) + Number(this.wltItemEx.depositLock || 0) + Number(this.wltItemEx.pawnBal || 0) + Number(this.wltItemEx.creditNum || 0);
            // 账户权益
            this.wltItemEx.MgnBal = this.toFixedForFloor(TOTAL, 8);
            // 可用保证金
            this.wltItemEx.NL = this.toFixedForFloor(this.wltItemEx.mainBal, 8);
            // // 未实现盈亏
            // this.wltItemEx.UPNL = this.toFixedForFloor(this.wltItemEx.UPNL || 0, 8);
            // 账户可提金额，用于资产划转以及提现
            this.wltItemEx.wdrawable = this.toFixedForFloor(this.wltItemEx.mainBal, 8);
            break;
        }
        // 当前币种价格 start
        // const coinInitValue = Number(this.wltItemEx.initValue || 1);
        // const coinSym = utils.getSpotName(AssetD, this.wltItemEx.wType, 'USDT');
        // const coinPrz = (AssetD[coinSym] && AssetD[coinSym].PrzLatest) || coinInitValue;
        // console.log('ht', 'value', coinPrz);
        // 当前币种价格 end
        // USDT估值
        valueForUSDT = TOTAL * coinPrz;
        // console.log('ht', 'usdt value', TOTAL, coinPrz, TOTAL * coinPrz);
        this.wltItemEx.valueForUSDT = this.toFixedForFloor(valueForUSDT, 8);
        // BTC估值
        valueForBTC = TOTAL * coinPrz / btcPrz;
        // console.log('ht', 'btc value', TOTAL, coinPrz, btcPrz, TOTAL * coinPrz);
        this.wltItemEx.valueForBTC = this.toFixedForFloor(valueForBTC, 8);
        // console.log('ht', 'btc value', valueForUSDT, valueForBTC);
        // 币种价格
        this.wltItemEx.coinPrz = coinPrz;
        // btc价格
        this.wltItemEx.btcPrz = btcPrz;
        // 图标
        this.wltItemEx.icon = ActiveLine.WebAPI + this.wltItemEx.icon;

        // for (const i in this.wltItemEx) {
        //     console.log(isNaN(this.wltItemEx[i]) ? '非数字' : '数字', this.wltItemEx[i], 'nzm');
        // }

        return this.wltItemEx;
    },

    setWallet: function (data = []) {
        this.wallet = data;
        for (const item of data) {
            this.wallet_obj[item.wType] = item;
        }
    },

    remove: function () {
    }
};