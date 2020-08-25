// const m = require('mithril');
const Http = require('@/newApi');

module.exports = {
    name: "modelsForWlt",
    wltItemEx: {}, // 资产数据处理中间量
    wallet_obj: {
        '01': {}, // 合约账户
        '02': {}, // 币币账户
        '03': {}, // 主钱包
        '04': {} // 法币账户
    }, // 资产
    wallet: {
        '01': [], // 合约账户
        '02': [], // 币币账户
        '03': [], // 主钱包
        '04': [] // 法币账户
    },
    // 总USDT估值
    totalValueForUSDT: 0,
    // 总BTC估值
    totalValueForBTC: 0,

    // 人民币总BTC估值
    totalCNYValueForBTC: 0,
    // 人民币总USDT估值
    totalCNYValueForUSDT: 0,

    prz: 7,

    // 我的钱包总USDT估值
    walletTotalValueForUSDT: 0,
    // 我的钱包总BTC估值
    walletTotalValueForBTC: 0,

    // 交易账户总USDT估值
    tradingAccountTotalValueForUSDT: 0,
    // 交易账户总BTC估值
    tradingAccountTotalValueForBTC: 0,

    // 币币交易总USDT估值
    coinTotalValueForUSDT: 0,
    // 币币交易总BTC估值
    coinTotalValueForBTC: 0,

    // 法币交易总USDT估值
    legalTotalValueForUSDT: 0,
    // 法币交易总BTC估值
    legalTotalValueForBTC: 0,

    // 合约交易总USDT估值
    contractTotalValueForUSDT: 0,
    // 合约交易总BTC估值
    contractTotalValueForBTC: 0,

    init: function () {
        // 初始化
        const that = this;
        // 添加ASSETD全局广播，用于资产估值计算
        window.gBroadcast.onMsg({
            key: this.name,
            cmd: window.gBroadcast.MSG_ASSETD_UPD,
            cb: function () {
                that.initWlt();
            }
        });

        // 更新资产
        this.updWlt();
    },
    remove: function () {
        window.gBroadcast.offMsg({
            key: this.name,
            isall: true
        });
    },
    initWlt: function () {
        // 计算之前先将估值归0
        this.totalValueForUSDT = 0;
        this.totalValueForBTC = 0;

        this.walletTotalValueForUSDT = 0;
        this.walletTotalValueForBTC = 0;

        this.tradingAccountTotalValueForUSDT = 0;
        this.tradingAccountTotalValueForBTC = 0;

        this.coinTotalValueForUSDT = 0;
        this.coinTotalValueForBTC = 0;

        this.legalTotalValueForUSDT = 0;
        this.legalTotalValueForBTC = 0;

        this.contractTotalValueForUSDT = 0;
        this.contractTotalValueForBTC = 0;

        const wlt = window.gWebApi.wallet_obj;
        for (const type in wlt) {
            this.wallet_obj[type] = this.wallet_obj[type] ? this.wallet_obj[type] : {};
            this.wallet[type] = [];
            for (const coin in wlt[type]) {
                this.wallet_obj[type][coin] = this.wltHandle(type, wlt[type][coin]);
                this.wallet[type].push(this.wallet_obj[type][coin]);
                // 总USDT估值
                this.totalValueForUSDT += Number(this.wallet_obj[type][coin].valueForUSDT);
                // 总BTC估值
                this.totalValueForBTC += Number(this.wallet_obj[type][coin].valueForBTC);
            }
        }
        window._console.log('ht', 'initWlt ', this.wallet_obj, this.totalValueForUSDT, this.totalValueForBTC);
        for (const type in this.wallet) {
            if (type === '03') {
                for (const coin in this.wallet[type]) {
                    if (this.wallet[type][coin].TOTAL === '0.00000000') {
                        continue;
                    } else {
                        // 我的钱包总估值
                        this.walletTotalValueForBTC += Number(this.wallet[type][coin].valueForBTC);
                        this.walletTotalValueForUSDT += Number(this.wallet[type][coin].valueForUSDT);
                    }
                }
            } else if (type === '01') {
                for (const coin in this.wallet[type]) {
                    if (this.wallet[type][coin].TOTAL === '0.00000000') {
                        continue;
                    } else {
                        this.contractTotalValueForBTC += Number(this.wallet[type][coin].valueForBTC);
                        this.contractTotalValueForUSDT += Number(this.wallet[type][coin].valueForUSDT);
                    }
                }
            } else if (type === '02') {
                for (const coin in this.wallet[type]) {
                    if (this.wallet[type][coin].TOTAL === '0.00000000') {
                        continue;
                    } else {
                        this.coinTotalValueForBTC += Number(this.wallet[type][coin].valueForBTC);
                        this.coinTotalValueForUSDT += Number(this.wallet[type][coin].valueForUSDT);
                    }
                }
            } else if (type === '04') {
                for (const coin in this.wallet[type]) {
                    if (this.wallet[type][coin].TOTAL === '0.00000000') {
                        continue;
                    } else {
                        this.legalTotalValueForBTC += Number(this.wallet[type][coin].valueForBTC);
                        this.legalTotalValueForUSDT += Number(this.wallet[type][coin].valueForUSDT);
                    }
                }
            }
        }
        this.tradingAccountTotalValueForBTC = Number(this.legalTotalValueForBTC) + Number(this.contractTotalValueForBTC) + Number(this.coinTotalValueForBTC);
        this.tradingAccountTotalValueForUSDT = Number(this.legalTotalValueForUSDT) + Number(this.contractTotalValueForUSDT) + Number(this.coinTotalValueForUSDT);
    },
    updWlt: function() {
        const that = this;
        Http.getWallet({
            exChannel: window.exchId
        }).then(function(arg) {
            window._console.log('ht', 'getWallet success', arg);
            if (arg.result.code === 0) {
                // 初始化资产数据
                that.initWlt();
            }
        }).catch(function(err) {
            window._console.log('ht', 'getWallet error', err);
        });
    },
    wltHandle: function (type, wlt) {
        this.wltItemEx = {};
        this.wltItemEx = Object.assign({}, wlt);
        let TOTAL = 0;
        let NL = 0;
        let valueForUSDT = 0;
        let valueForBTC = 0;
        const AssetD = window.gWsApi.AssetD;
        // window._console.log('ht', AssetD);
        // 取BTC的价格 start
        const btcSymName = window.utils.getSpotName(AssetD, 'BTC', 'USDT');
        const btcInitValue = (window.gWebApi.wallet_obj['03'] && window.gWebApi.wallet_obj['03'].BTC && window.gWebApi.wallet_obj['03'].BTC.initValue) || 0;
        const btcPrz = (AssetD[btcSymName] && AssetD[btcSymName].PrzLatest) || btcInitValue;
        // window._console.log('ht', 'btc prz', btcSymName, btcInitValue, AssetD[btcSymName] && AssetD[btcSymName].PrzLatest, btcPrz);
        // 取BTC的价格 end
        switch (type) {
        case '01':
            // 合约账户
            // window._console.log('ht', type, this.wltItemEx);
            TOTAL = Number(this.wltItemEx.Num || 0) + Number(this.wltItemEx.PNL || 0) + Number(this.wltItemEx.PNLISO || 0) + Number(this.wltItemEx.UPNL || 0);
            // 账户权益
            this.wltItemEx.MgnBal = window.utils.toFixedForFloor(TOTAL, 8);
            // 可用赠金
            this.wltItemEx.Gift = window.utils.toFixedForFloor(this.wltItemEx.Gift || 0, 8);
            // 可用保证金
            NL = Number(this.wltItemEx.NL || 0) + Number(this.wltItemEx.Gift || 0);
            this.wltItemEx.NL = window.utils.toFixedForFloor(NL, 8);
            // 委托保证金
            this.wltItemEx.MI = window.utils.toFixedForFloor(this.wltItemEx.MI || 0, 8);
            // 仓位保证金
            this.wltItemEx.MM = window.utils.toFixedForFloor(this.wltItemEx.MM || 0, 8);
            // 已实现盈亏
            this.wltItemEx.PNL = window.utils.toFixedForFloor(this.wltItemEx.PNL || 0, 8);
            // 未实现盈亏
            this.wltItemEx.UPNL = window.utils.toFixedForFloor(this.wltItemEx.UPNL || 0, 8);
            // 账户可提金额，用于资产划转
            this.wltItemEx.wdrawable = window.utils.toFixedForFloor(this.wltItemEx.wdrawable || 0, 8);
            break;
        case '02':
            // 币币账户
            // window._console.log('ht', type, this.wltItemEx);
            TOTAL = Number(this.wltItemEx.wdrawable || 0) + Number(this.wltItemEx.Frz || 0);
            // 账户总额
            this.wltItemEx.TOTAL = window.utils.toFixedForFloor(TOTAL, 8);
            // 冻结金额
            this.wltItemEx.Frz = window.utils.toFixedForFloor(this.wltItemEx.Gift || 0, 8);
            // 可用金额
            this.wltItemEx.NL = window.utils.toFixedForFloor(this.wltItemEx.wdrawable, 8);
            // 账户可提金额，用于资产划转
            this.wltItemEx.wdrawable = window.utils.toFixedForFloor(this.wltItemEx.wdrawable, 8);
            break;
        case '03':
            // 主钱包
            // window._console.log('ht', type, this.wltItemEx);
            TOTAL = Number(this.wltItemEx.mainBal || 0) + Number(this.wltItemEx.financeBal || 0) + Number(this.wltItemEx.mainLock || 0) + Number(this.wltItemEx.depositLock || 0) + Number(this.wltItemEx.pawnBal || 0) + Number(this.wltItemEx.creditNum || 0);
            // 账户总额
            this.wltItemEx.TOTAL = window.utils.toFixedForFloor(TOTAL, 8);
            // 矿池
            this.wltItemEx.mainLock = window.utils.toFixedForFloor(this.wltItemEx.mainLock || 0, 8);
            // 锁定
            this.wltItemEx.depositLock = window.utils.toFixedForFloor(this.wltItemEx.depositLock || 0, 8);
            // 理财
            this.wltItemEx.financeBal = window.utils.toFixedForFloor(this.wltItemEx.financeBal || 0, 8);
            // 质押
            this.wltItemEx.pawnBal = window.utils.toFixedForFloor(this.wltItemEx.pawnBal || 0, 8);
            // 可用金额
            this.wltItemEx.NL = window.utils.toFixedForFloor(this.wltItemEx.mainBal, 8);
            // 账户可提金额，用于资产划转以及提现
            this.wltItemEx.wdrawable = window.utils.toFixedForFloor(this.wltItemEx.mainBal, 8);
            break;
        case '04':
            // 法币钱包
            // window._console.log('ht', type, this.wltItemEx);
            TOTAL = Number(this.wltItemEx.mainBal || 0) + Number(this.wltItemEx.financeBal || 0) + Number(this.wltItemEx.mainLock || 0) + Number(this.wltItemEx.depositLock || 0) + Number(this.wltItemEx.pawnBal || 0) + Number(this.wltItemEx.creditNum || 0);
            // 账户总额
            this.wltItemEx.TOTAL = window.utils.toFixedForFloor(TOTAL, 8);
            // 锁定(冻结)
            this.wltItemEx.otcLock = window.utils.toFixedForFloor(this.wltItemEx.otcLock || 0, 8);
            // 理财
            this.wltItemEx.financeBal = window.utils.toFixedForFloor(this.wltItemEx.financeBal || 0, 8);
            // 质押
            this.wltItemEx.pawnBal = window.utils.toFixedForFloor(this.wltItemEx.pawnBal || 0, 8);
            // 可用金额
            this.wltItemEx.NL = window.utils.toFixedForFloor(this.wltItemEx.otcBal, 8);
            // 账户可提金额，用于资产划转以及提现
            this.wltItemEx.wdrawable = window.utils.toFixedForFloor(this.wltItemEx.otcBal, 8);
            break;
        case '05':
            // 算力钱包
            window._console.log('ht', type, this.wltItemEx);
            break;
        case '06':
            // 跟单钱包
            window._console.log('ht', type, this.wltItemEx);
            break;
        }
        // 当前币种价格 start
        const coinInitValue = Number(this.wltItemEx.initValue || 1);
        const coinSym = window.utils.getSpotName(AssetD, this.wltItemEx.wType, 'USDT');
        const coinPrz = (AssetD[coinSym] && AssetD[coinSym].PrzLatest) || coinInitValue;
        // window._console.log('ht', 'value', coinInitValue, coinSym, AssetD[coinSym] && AssetD[coinSym].PrzLatest, coinPrz);
        // 当前币种价格 end
        // USDT估值
        valueForUSDT = TOTAL * coinPrz;
        // window._console.log('ht', 'value', TOTAL, coinPrz, TOTAL * coinPrz);
        this.wltItemEx.valueForUSDT = window.utils.toFixedForFloor(valueForUSDT, 8);
        // BTC估值
        valueForBTC = TOTAL * coinPrz / btcPrz;
        // window._console.log('ht', 'value', TOTAL, coinPrz, btcPrz, TOTAL * coinPrz);
        this.wltItemEx.valueForBTC = window.utils.toFixedForFloor(valueForBTC, 8);
        // window._console.log('ht', 'value', valueForUSDT, valueForBTC);
        // 图标
        this.wltItemEx.icon = window.gWebApi.baseUrl + this.wltItemEx.icon;

        // !!!
        this.totalCNYValueForBTC = valueForBTC * this.prz;
        this.totalCNYValueForUSDT = valueForUSDT * this.prz;

        return this.wltItemEx;
    }
};