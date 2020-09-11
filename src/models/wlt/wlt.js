const Http = require('@/api').webApi;
const broadcast = require('@/broadcast/broadcast');
const { gMktApi, gTrdApi } = require('@/api').wsApi;
const utils = require('@/util/utils').default;
const ActiveLine = require('@/api').ActiveLine;
const { Conf } = require('@/api');
const l180n = require('@/languages/I18n').default;
const { calcFutureWltAndPosAndMI } = require('../futureCalc/calcFuture.js');

module.exports = {
    name: "modelsForWlt",
    isInitOnMsg: false,
    wltItemEx: {}, // 资产数据处理中间量
    coinInfo: {}, // 币种简介
    wltFullName: {}, // 币种简介 --- 添加全称使用
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
    walletState: 0, // 资产获取状态，0:未获取，1:已获取
    // 总USDT估值
    totalValueForUSDT: 0,
    // 总BTC估值
    totalValueForBTC: 0,
    // 总人民币总估值
    totalValueForCNY: 0,

    // 人民币总估值
    totalCNYValue: 0,

    prz: 7,

    // 我的钱包总USDT估值
    walletTotalValueForUSDT: 0,
    // 我的钱包总BTC估值
    walletTotalValueForBTC: 0,
    // 我的钱包总人民币估值
    walletTotalValueForCNY: 0,

    // 交易账户总USDT估值
    tradingAccountTotalValueForUSDT: 0,
    // 交易账户总BTC估值
    tradingAccountTotalValueForBTC: 0,
    // 交易账户总人民币估值
    tradingAccountTotalValueForCNY: 0,

    // 交易账户总USDT估值
    otherAccountTotalValueForUSDT: 0.0000,
    // 交易账户总BTC估值
    otherAccountTotalValueForBTC: 0.00000000,
    // 交易账户总人民币估值
    otherAccountTotalValueForCNY: 0.00000000,

    // 币币交易总USDT估值
    coinTotalValueForUSDT: 0,
    // 币币交易总BTC估值
    coinTotalValueForBTC: 0,
    // 币币交易总人民币估值
    coinTotalValueForCNY: 0,

    // 法币交易总USDT估值
    legalTotalValueForUSDT: 0,
    // 法币交易总BTC估值
    legalTotalValueForBTC: 0,
    // 法币交易总人民币估值
    legalTotalValueForCNY: 0,

    // 合约交易总USDT估值
    contractTotalValueForUSDT: 0,
    // 合约交易总BTC估值
    contractTotalValueForBTC: 0,
    // 合约交易总人民币估值
    contractTotalValueForCNY: 0,

    // 获取资产的接口是否正在请求
    isWltReq: false,

    // 获取币种全称是否正在请求
    isCoinFullNameReq: false,

    // 获取币种简介是否正在请求
    isCoinInfoReq: false,

    // 最后一次计算交易资产的时间
    calcTrdWltLastTm: 0,
    // 计算交易资产的时间间隔
    calcTrdWltInterval: 1000,

    init: function () {
        // 初始化
        const that = this;

        if (Object.keys(that.coinInfo).length < 1) {
            that.getCoinquanname();
        } else {
            // 更新资产
            this.updWlt();
        }

        if (this.isInitOnMsg) {
            return;
        }
        this.isInitOnMsg = true;
        // 添加ASSETD全局广播，用于资产估值计算
        broadcast.onMsg({
            key: this.name,
            cmd: broadcast.MSG_ASSETD_UPD,
            cb: function () {
                that.initWlt();
                that.getRiskLimits();
            }
        });
        broadcast.onMsg({
            key: this.name,
            cmd: broadcast.MSG_LANGUAGE_UPD,
            cb: function () {
                that.getCoinquanname();
            }
        });
        // 仓位获取完成广播
        broadcast.onMsg({
            key: this.name,
            cmd: broadcast.EV_GET_POS_READY,
            cb: function (arg) {
                // console.log('EV_GET_POS_READY', arg);
                that.trdDataOnFun();
                that.getRiskLimits();
            }
        });
        // 仓位更新广播
        broadcast.onMsg({
            key: this.name,
            cmd: broadcast.EV_POS_UPD,
            cb: function (arg) {
                // console.log('EV_POS_UPD', arg);
                that.trdDataOnFun();
            }
        });
        // 委托获取完成广播
        broadcast.onMsg({
            key: this.name,
            cmd: broadcast.EV_GET_ORD_READY,
            cb: function (arg) {
                // console.log('EV_GET_ORD_READY', arg);
                that.trdDataOnFun();
            }
        });
        // 委托更新广播
        broadcast.onMsg({
            key: this.name,
            cmd: broadcast.EV_ORD_UPD,
            cb: function (arg) {
                // console.log('EV_ORD_UPD', arg);
                that.trdDataOnFun();
            }
        });
        // 资产获取完成广播
        broadcast.onMsg({
            key: this.name,
            cmd: broadcast.EV_GET_WLT_READY,
            cb: function (arg) {
                // console.log('EV_GET_WLT_READY', arg);
                that.trdDataOnFun();
            }
        });
        // 资产更新广播
        broadcast.onMsg({
            key: this.name,
            cmd: broadcast.EV_WLT_UPD,
            cb: function (arg) {
                // console.log('EV_WLT_UPD', arg);
                that.trdDataOnFun();
            }
        });
        // 交易风险限额数据获取完成广播
        broadcast.onMsg({
            key: this.name,
            cmd: broadcast.EV_GET_RS_READY,
            cb: function (arg) {
                // console.log('EV_GET_RS_READY', arg);
                that.trdDataOnFun();
            }
        });
        // tick行情全局广播
        broadcast.onMsg({
            key: this.name,
            cmd: broadcast.MSG_TICK_UPD,
            cb: function (arg) {
                // console.log('MSG_TICK_UPD', arg);
                that.trdDataOnFun();
            }
        });
    },
    remove: function () {
        broadcast.offMsg({
            key: this.name,
            isall: true
        });
        this.isInitOnMsg = false;
    },
    initWlt: function () {
        // 计算之前先将估值归0
        this.totalValueForUSDT = 0;
        this.totalValueForBTC = 0;
        this.totalValueForCNY = 0;

        this.walletTotalValueForUSDT = 0;
        this.walletTotalValueForBTC = 0;
        this.walletTotalValueForCNY = 0;

        this.tradingAccountTotalValueForUSDT = 0;
        this.tradingAccountTotalValueForBTC = 0;
        this.tradingAccountTotalValueForCNY = 0;

        this.coinTotalValueForUSDT = 0;
        this.coinTotalValueForBTC = 0;
        this.coinTotalValueForCNY = 0;

        this.legalTotalValueForUSDT = 0;
        this.legalTotalValueForBTC = 0;
        this.legalTotalValueForCNY = 0;

        this.contractTotalValueForUSDT = 0;
        this.contractTotalValueForBTC = 0;
        this.contractTotalValueForCNY = 0;

        const wlt = this.wallet_obj;

        for (const type in wlt) {
            // this.wallet_obj[type] = this.wallet_obj[type] ? this.wallet_obj[type] : {};
            this.wallet[type] = [];
            for (const coin in wlt[type]) {
                // 如果是合约账户，则选择部分字段进行赋值
                if (type === '01') {
                    // if (this.walletState === 0) {
                    this.wallet_obj[type][coin] = this.wltHandle(type, wlt[type][coin]);
                    // } else {
                    //     const wltHandleData = this.wltHandle(type, wlt[type][coin]);
                    //     for (const key in wltHandleData) {
                    //         switch (key) {
                    //         case 'MgnBal':
                    //         case 'Gift':
                    //         case 'NL':
                    //         case 'NLToCRN':
                    //         case 'NLToBTC':
                    //         case 'MI':
                    //         case 'MM':
                    //         case 'PNL':
                    //         case 'UPNL':
                    //         case 'UPNLToCRN':
                    //         case 'UPNLToBTC':
                    //         case 'wdrawable':
                    //             // 此处跳过数据更新
                    //             break;
                    //         default:
                    //             this.wallet_obj[type][coin][key] = wltHandleData[key];
                    //         }
                    //     }
                    // }
                } else {
                    this.wallet_obj[type][coin] = this.wltHandle(type, wlt[type][coin]);
                }
                this.wallet[type].push(this.wallet_obj[type][coin]);

                wlt[type][coin].valueForUSDT = utils.toFixedForFloor(wlt[type][coin].valueForUSDT, 4);
                wlt[type][coin].valueForBTC = utils.toFixedForFloor(wlt[type][coin].valueForBTC, 8);

                // 总USDT估值
                this.totalValueForUSDT += Number(this.wallet_obj[type][coin].valueForUSDT);
                // 总BTC估值
                this.totalValueForBTC += Number(this.wallet_obj[type][coin].valueForBTC);
            }
        }

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
        this.totalCNYValue = Number(this.totalValueForUSDT) * this.prz;

        this.totalValueForUSDT = utils.toFixedForFloor(this.totalValueForUSDT, 4);
        this.totalValueForBTC = utils.toFixedForFloor(this.totalValueForBTC, 8);
        this.totalValueForCNY = utils.toFixedForFloor(Number(this.totalValueForUSDT) * this.prz, 2);

        this.walletTotalValueForUSDT = utils.toFixedForFloor(this.walletTotalValueForUSDT, 4);
        this.walletTotalValueForBTC = utils.toFixedForFloor(this.walletTotalValueForBTC, 8);
        this.walletTotalValueForCNY = utils.toFixedForFloor(Number(this.walletTotalValueForUSDT) * this.prz, 2);

        this.tradingAccountTotalValueForUSDT = utils.toFixedForFloor(this.tradingAccountTotalValueForUSDT, 4);
        this.tradingAccountTotalValueForBTC = utils.toFixedForFloor(this.tradingAccountTotalValueForBTC, 8);
        this.tradingAccountTotalValueForCNY = utils.toFixedForFloor(Number(this.tradingAccountTotalValueForUSDT) * this.prz, 2);

        this.otherAccountTotalValueForUSDT = utils.toFixedForFloor(this.otherAccountTotalValueForUSDT, 4);
        this.otherAccountTotalValueForBTC = utils.toFixedForFloor(this.otherAccountTotalValueForBTC, 8);
        this.otherAccountTotalValueForCNY = utils.toFixedForFloor(Number(this.otherAccountTotalValueForUSDT) * this.prz, 2);

        this.coinTotalValueForUSDT = utils.toFixedForFloor(this.coinTotalValueForUSDT, 4);
        this.coinTotalValueForBTC = utils.toFixedForFloor(this.coinTotalValueForBTC, 8);
        this.coinTotalValueForCNY = utils.toFixedForFloor(Number(this.coinTotalValueForUSDT) * this.prz, 2);

        this.legalTotalValueForUSDT = utils.toFixedForFloor(this.legalTotalValueForUSDT, 4);
        this.legalTotalValueForBTC = utils.toFixedForFloor(this.legalTotalValueForBTC, 8);
        this.legalTotalValueForCNY = utils.toFixedForFloor(Number(this.legalTotalValueForUSDT) * this.prz, 2);

        this.contractTotalValueForUSDT = utils.toFixedForFloor(this.contractTotalValueForUSDT, 4);
        this.contractTotalValueForBTC = utils.toFixedForFloor(this.contractTotalValueForBTC, 8);
        this.contractTotalValueForCNY = utils.toFixedForFloor(Number(this.contractTotalValueForUSDT) * this.prz, 2);

        this.totalCNYValue = utils.toFixedForFloor(this.totalCNYValue, 2);

        // console.log('nzm', 'this.wallet', this.wallet);
        // console.log('\n');
        // console.log('nzm', 'totalCNYValue', this.totalCNYValue, 'totalValueForUSDT', this.totalValueForUSDT);
        // console.log('\n');
        // console.log('nzm', 'tradingAccountTotalValueForBTC', this.tradingAccountTotalValueForBTC, 'tradingAccountTotalValueForUSDT', this.tradingAccountTotalValueForUSDT);
        // console.log('\n');
        // console.log('nzm', 'legalTotalValueForBTC', this.legalTotalValueForBTC, 'legalTotalValueForUSDT', this.legalTotalValueForUSDT);
        // console.log('\n');
        // console.log('nzm', 'coinTotalValueForBTC', this.coinTotalValueForBTC, 'coinTotalValueForUSDT', this.coinTotalValueForUSDT);
        // console.log('\n');
        // console.log('nzm', 'contractTotalValueForBTC', this.contractTotalValueForBTC, 'contractTotalValueForUSDT', this.contractTotalValueForUSDT);
        // console.log('\n');
        // console.log('nzm', 'walletTotalValueForBTC', this.walletTotalValueForBTC, 'walletTotalValueForUSDT', this.walletTotalValueForUSDT);
        broadcast.emit({
            cmd: broadcast.MSG_WLT_UPD,
            data: {
                wallet_obj: this.wallet_obj, // 资产
                wallet: this.wallet
            }
        });
    },
    updWlt: function() {
        const that = this;
        if (this.isWltReq) {
            return;
        }
        this.isWltReq = true;
        Http.getWallet({
            exChannel: window.exchId
        }).then(function(arg) {
            console.log('ht', 'getWallet success', arg);
            if (arg.result.code === 0) {
                // 初始化资产数据
                that.setWallet(arg);
                that.initWlt();
                broadcast.emit({
                    cmd: broadcast.MSG_WLT_READY,
                    data: {
                        wallet_obj: that.wallet_obj, // 资产
                        wallet: that.wallet
                    }
                });
                that.isWltReq = false;
                that.walletState = 1;
            }
        }).catch(function(err) {
            console.log('ht', 'getWallet error', err);
        });
    },
    getCoinquanname: function (arg) {
        if (this.isCoinFullNameReq) {
            return;
        }
        this.isCoinFullNameReq = true;
        const that = this;
        const params = { locale: l180n.getLocale(), vp: Conf.exchId };
        Http.getCurrenciesIntro(params).then(res => {
            if (res.result.code === 0) {
                res.result.data.forEach(item => {
                    that.wltFullName[item.coin] = item;
                });
            }
            that.isCoinFullNameReq = false;
        }).catch(e => { console.log(e, '获取coin全称失败'); }).finally(res => { that.getCoinInfo(); });
    },
    getCoinInfo: function () {
        if (this.isCoinInfoReq) {
            return;
        }
        this.isCoinInfoReq = true;
        const that = this;
        const params = { locale: l180n.getLocale(), vp: Conf.exchId };
        Http.getCoinInfo(params).then(res => {
            if (res.result.code === 0) {
                that.coinInfo = res.result.data;
            }
            that.isCoinInfoReq = false;
        }).finally(res => { that.updWlt(); });
    },
    setWallet(data) {
        this.wallet['01'] = data.assetLists01; // 合约资产
        this.wallet['02'] = data.assetLists02; // 现货资产
        this.wallet['03'] = data.assetLists03; // 主钱包
        this.wallet['04'] = data.assetLists04; // 法币资产

        for (const item of data.assetLists01) {
            // 合约账户由于交易服务器在更新数据，所以此处只更新部分数据
            if (this.walletState === 0) {
                this.wallet_obj['01'][item.wType] = item;
            } else {
                for (const key in item) {
                    switch (key) {
                    case 'MgnBal':
                    case 'Gift':
                    case 'NL':
                    case 'NLToCRN':
                    case 'NLToBTC':
                    case 'MI':
                    case 'MM':
                    case 'PNL':
                    case 'UPNL':
                    case 'UPNLToCRN':
                    case 'UPNLToBTC':
                    case 'wdrawable':
                        console.log(key, item[key]);
                        // 此处跳过数据更新
                        break;
                    default:
                        console.log('default', key, item[key]);
                        this.wallet_obj['01'][item.wType][key] = item[key];
                    }
                }
            }
        }
        for (const item of data.assetLists02) {
            this.wallet_obj['02'][item.wType] = item;
        }
        for (const item of data.assetLists03) {
            this.wallet_obj['03'][item.wType] = item;
        }
        for (const item of data.assetLists04) {
            this.wallet_obj['04'][item.wType] = item;
        }
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
            this.wltItemEx.MgnBal = utils.toFixedForFloor(TOTAL, 8);
            // 可用赠金
            this.wltItemEx.Gift = utils.toFixedForFloor(this.wltItemEx.Gift || 0, 8);
            // 可用保证金
            NL = Number(this.wltItemEx.wdrawable || 0) + Number(this.wltItemEx.Gift || 0);
            this.wltItemEx.NL = utils.toFixedForFloor(NL, 8);
            // 可用保证金人民币估值
            // const NLToCRN = this.wltItemEx.NL * coinPrz;
            this.wltItemEx.NLToCRN = utils.toFixedForFloor(Number(this.wltItemEx.NL * coinPrz) * this.prz, 2);
            // 可用保证金BTC估值
            this.wltItemEx.NLToBTC = utils.toFixedForFloor(Number(this.wltItemEx.NL * coinPrz / btcPrz) * this.prz || 0, 8);
            // 委托保证金
            this.wltItemEx.MI = utils.toFixedForFloor(this.wltItemEx.MI || 0, 8);
            // 仓位保证金
            this.wltItemEx.MM = utils.toFixedForFloor(this.wltItemEx.MM || 0, 8);
            // 已实现盈亏
            this.wltItemEx.PNL = utils.toFixedForFloor(this.wltItemEx.PNL || 0, 8);
            // 未实现盈亏
            this.wltItemEx.UPNL = utils.toFixedForFloor(this.wltItemEx.UPNL || 0, 8);
            // 为实现盈亏人民币估值
            this.wltItemEx.UPNLToCRN = utils.toFixedForFloor(Number(this.wltItemEx.UPNL * coinPrz) * this.prz, 2);
            // 为实现盈亏BTC估值
            this.wltItemEx.UPNLToBTC = utils.toFixedForFloor(Number(this.wltItemEx.UPNL * coinPrz / btcPrz) || 0, 8);
            // 账户可提金额，用于资产划转
            this.wltItemEx.wdrawable = utils.toFixedForFloor(this.wltItemEx.wdrawable || 0, 8);
            break;
        case '02':
            // 币币账户
            // console.log('ht', type, this.wltItemEx); c
            TOTAL = Number(this.wltItemEx.wdrawable || 0) + Number(this.wltItemEx.Frz || 0);
            // 账户总额
            this.wltItemEx.TOTAL = utils.toFixedForFloor(TOTAL, 8);

            // 冻结金额
            // console.log('nzm', 'this.wltItemEx.Gift   ', this.wltItemEx.Gift);
            this.wltItemEx.Frz = utils.toFixedForFloor(this.wltItemEx.Frz || 0, 8);

            // 可用金额
            this.wltItemEx.NL = utils.toFixedForFloor(this.wltItemEx.wdrawable, 8);
            // 账户可提金额，用于资产划转
            this.wltItemEx.wdrawable = utils.toFixedForFloor(this.wltItemEx.wdrawable, 8);
            break;
        case '03':
            // 主钱包
            // console.log('ht', type, this.wltItemEx);
            TOTAL = Number(this.wltItemEx.mainBal || 0) + Number(this.wltItemEx.financeBal || 0) + Number(this.wltItemEx.mainLock || 0) + Number(this.wltItemEx.depositLock || 0) + Number(this.wltItemEx.pawnBal || 0) + Number(this.wltItemEx.creditNum || 0);
            // 账户总额
            this.wltItemEx.TOTAL = utils.toFixedForFloor(TOTAL, 8);
            // 矿池
            this.wltItemEx.mainLock = utils.toFixedForFloor(this.wltItemEx.mainLock || 0, 8);
            // 锁定
            this.wltItemEx.depositLock = utils.toFixedForFloor(this.wltItemEx.depositLock || 0, 8);
            // 理财
            this.wltItemEx.financeBal = utils.toFixedForFloor(this.wltItemEx.financeBal || 0, 8);
            // 质押
            this.wltItemEx.pawnBal = utils.toFixedForFloor(this.wltItemEx.pawnBal || 0, 8);
            // 可用金额
            this.wltItemEx.NL = utils.toFixedForFloor(this.wltItemEx.mainBal, 8);
            // 账户可提金额，用于资产划转以及提现
            this.wltItemEx.wdrawable = utils.toFixedForFloor(this.wltItemEx.mainBal, 8);
            break;
        case '04':
            // 法币钱包
            // console.log('ht', type, this.wltItemEx);
            TOTAL = Number(this.wltItemEx.otcLock || 0) + Number(this.wltItemEx.otcBal || 0);
            // 账户总额
            this.wltItemEx.TOTAL = utils.toFixedForFloor(TOTAL, 8);
            // 锁定(冻结)
            this.wltItemEx.otcLock = utils.toFixedForFloor(this.wltItemEx.otcLock || 0, 8);
            // 理财
            this.wltItemEx.financeBal = utils.toFixedForFloor(this.wltItemEx.financeBal || 0, 8);
            // 质押
            this.wltItemEx.pawnBal = utils.toFixedForFloor(this.wltItemEx.pawnBal || 0, 8);
            // 可用金额
            this.wltItemEx.NL = utils.toFixedForFloor(this.wltItemEx.otcBal, 8);
            // 账户可提金额，用于资产划转以及提现
            this.wltItemEx.wdrawable = utils.toFixedForFloor(this.wltItemEx.otcBal, 8);
            break;
        case '05':
            // 算力钱包
            console.log('ht', type, this.wltItemEx);
            break;
        case '06':
            // 跟单钱包
            console.log('ht', type, this.wltItemEx);
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
        this.wltItemEx.valueForUSDT = utils.toFixedForFloor(valueForUSDT, 8);
        // BTC估值
        valueForBTC = TOTAL * coinPrz / btcPrz;
        // console.log('ht', 'btc value', TOTAL, coinPrz, btcPrz, TOTAL * coinPrz);
        this.wltItemEx.valueForBTC = utils.toFixedForFloor(valueForBTC, 8);
        // console.log('ht', 'btc value', valueForUSDT, valueForBTC);
        // 币种价格
        this.wltItemEx.coinPrz = coinPrz;
        // btc价格
        this.wltItemEx.btcPrz = btcPrz;
        // 图标
        this.wltItemEx.icon = ActiveLine.WebAPI + this.wltItemEx.icon;

        return this.wltItemEx;
    },
    /**
     * 获取币种的价值
     * @param {*|string} coin 需要获取价值的币种
     * @returns {*|number}
     */
    getPrz(coin) {
        if (coin === 'USDT') {
            const InitValue = (this.wallet_obj['03'] && this.wallet_obj['03'][coin] && this.wallet_obj['03'][coin].initValue) || 0;
            return InitValue;
        } else {
            const AssetD = gMktApi.AssetD;
            const SymName = utils.getSpotName(AssetD, coin, 'USDT');
            const InitValue = (this.wallet_obj['03'] && this.wallet_obj['03'][coin] && this.wallet_obj['03'][coin].initValue) || 0;
            const Prz = (AssetD[SymName] && AssetD[SymName].PrzLatest) || InitValue;
            return Prz;
        }
    },
    trdDataOnFun: function() {
        const tm = Date.now();
        if (tm - this.calcTrdWltLastTm > this.calcTrdWltInterval) {
            this.checkPosNeedSubSym();
            this.calcTrdWlt();
            this.calcTrdWltLastTm = tm;
        }
    },
    calcTrdWlt: function(arg) {
        const that = this;
        const { Poss, Wlts, Orders, RS, trdInfoStatus } = gTrdApi;
        const { lastTick, AssetD } = gMktApi;

        if ((trdInfoStatus.pos === 0 ||
            trdInfoStatus.ord === 0 ||
            trdInfoStatus.wlt === 0 ||
            trdInfoStatus.rs === 0)) {
            return;
        }
        // 将仓位数据Poss、资产数据Wlts，以及委托数据Orders拷贝至新的对象或数组，防止后边计算影响原数据；
        const posArr = [];
        for (const key in Poss) {
            const item = {};
            utils.copyTab(item, Poss[key]);
            posArr.push(item);
        }
        // console.log('posArr', posArr);

        const wallets = [];
        for (const key in Wlts['01']) {
            const item = {};
            utils.copyTab(item, Wlts['01'][key]);
            wallets.push(item);
        }
        // console.log('wallets', wallets);

        const orderArr = [];
        for (const key in Orders['01']) {
            const item = {};
            utils.copyTab(item, Orders['01'][key]);
            orderArr.push(item);
        }
        // console.log('orderArr', orderArr);
        calcFutureWltAndPosAndMI(posArr, wallets, orderArr, RS, AssetD, lastTick, '1', 0, 0, arg => {
            // console.log('calcFutureWltAndPosAndMI CallBack', arg);
            that.updTrdWlt(arg.wallets);
        });
        // console.log('calcFutureWltAndPosAndMI', calcFutureWltAndPosAndMI, Poss, Wlts, Orders, RS, lastTick, AssetD);
    },
    updTrdWlt: function(param) {
        // MgnBal:账户权益，aMM:总仓位保证金 , aMI:总委托保证金, aUPNL: 总未实现盈亏, aGift可用赠金, aWdrawable可用保证金， maxTransfer最大划转， walletRate保证金使用率
        for (const item of param) {
            if (this.wallet_obj['01'][item.Coin]) {
                const coinPrz = this.getPrz(item.Coin);
                const btcPrz = this.getPrz('BTC');
                this.wallet_obj['01'][item.Coin].MgnBal = utils.toFixedForFloor(item.MgnBal, 8);
                // 可用赠金
                this.wallet_obj['01'][item.Coin].Gift = utils.toFixedForFloor(item.aGift, 8);
                // 可用保证金
                this.wallet_obj['01'][item.Coin].NL = utils.toFixedForFloor(item.aWdrawable, 8);
                // 可用保证金人民币估值
                this.wallet_obj['01'][item.Coin].NLToCRN = utils.toFixedForFloor(Number(item.aWdrawable * coinPrz) * this.prz, 2);
                // 可用保证金BTC估值
                this.wallet_obj['01'][item.Coin].NLToBTC = utils.toFixedForFloor(Number(item.aWdrawable * coinPrz / btcPrz) * this.prz || 0, 8);
                // 委托保证金
                this.wallet_obj['01'][item.Coin].MI = utils.toFixedForFloor(item.aMI || 0, 8);
                // 仓位保证金
                this.wallet_obj['01'][item.Coin].MM = utils.toFixedForFloor(item.aMM || 0, 8);
                // 已实现盈亏
                this.wallet_obj['01'][item.Coin].PNL = utils.toFixedForFloor(item.PNL || 0, 8);
                // 未实现盈亏
                this.wallet_obj['01'][item.Coin].UPNL = utils.toFixedForFloor(item.aUPNL || 0, 8);
                // 为实现盈亏人民币估值
                this.wallet_obj['01'][item.Coin].UPNLToCRN = utils.toFixedForFloor(Number(item.aUPNL * coinPrz) * this.prz, 2);
                // 为实现盈亏BTC估值
                this.wallet_obj['01'][item.Coin].UPNLToBTC = utils.toFixedForFloor(Number(item.aUPNL * coinPrz / btcPrz) || 0, 8);
                // 账户可提金额，用于资产划转
                this.wallet_obj['01'][item.Coin].wdrawable = utils.toFixedForFloor(item.maxTransfer || 0, 8);
            }
        }
        broadcast.emit({
            cmd: broadcast.MSG_WLT_UPD,
            data: {
                wallet_obj: this.wallet_obj, // 资产
                wallet: this.wallet
            }
        });
    },
    checkPosNeedSubSym: function() {
        const Pos = gTrdApi.Poss;
        let needSubSymArr = [];
        // 检查仓位列表内仓位数量不为0的仓位，并订阅对应合约的行情，用于未实现盈亏计算
        for (const key in Pos) {
            const item = Pos[key];
            if (item.Sz !== 0) {
                if (needSubSymArr.includes(item.Sym) === false) {
                    needSubSymArr.push(item.Sym);
                }
            }
        }
        needSubSymArr = utils.setSubArrType('tick', needSubSymArr);
        if (needSubSymArr.length > 0) {
            for (const item of needSubSymArr) {
                gMktApi.TpcAdd(item);
            }
        }
    },
    // 获取钱包计算所需风险限额
    getRiskLimits: function() {
        // ReqTrdGetRiskLimits
        const Authrized = gTrdApi.RT.Authrized;// aObj.AUTH_ST_OK
        const AssetD = gMktApi.AssetD;
        if (Authrized === gTrdApi.AUTH_ST_OK && Object.keys(AssetD).length > 0) {
            const aymArr = [];
            for (const key in AssetD) {
                const item = AssetD[key];
                if (item.TrdCls !== 1) {
                    aymArr.push(item.Sym);
                }
            }
            if (aymArr.length > 0) {
                gTrdApi.ReqTrdGetRiskLimits({
                    AId: gTrdApi.RT.UserId + "01",
                    Sym: aymArr.join(',')
                });
            }
        }
    }
};