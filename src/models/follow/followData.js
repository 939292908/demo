const Http = require('@/api').webApi;
const broadcast = require('@/broadcast/broadcast');
const ActiveLine = require('@/api').ActiveLine;
const { gMktApi, gTrdApi } = require('@/api').wsApi;
const utils = require('@/util/utils').default;
const { calcFutureWltAndPosAndMIFollow } = require('../futureCalc/calcFuture');
const { getRiskLimits } = require('@/models/market/model');
const config = require('@/config.js');

module.exports = {
    name: 'FOLLOW_DATA',
    wltItemEx: {}, // 数据处理中间量
    entrepotS: [], // 当前持仓数据
    entrepotIds: [], // 当前已存在的仓位pid
    wallet_obj: {}, // 跟单 数据
    wallet: [], // 跟单 数据

    totalValueForUSDT: 0, // 总USDT估值
    totalValueForBTC: 0, // 总BTC估值
    totalValueForCNY: 0, // 总CNY估值

    prz: 7,

    walletState: 0, // 资产获取状态，0:未获取，1:已获取
    entrepotState: 0, // 持仓获取状态，0:未获取，1:已获取

    // 最后一次计算交易资产的时间
    calcTrdWltLastTm: 0,
    // 计算交易资产的时间间隔
    calcTrdWltInterval: 1000,
    // 跟单数据刷新间隔
    entrepotDataInterval: 15000,
    // 定时器
    TIME_INTERVER: null,

    init: function () {
        // 初始化
        const that = this;
        that.walletState = 0;
        that.entrepotState = 0;

        // 获取钱包计算所需风险限额
        getRiskLimits();

        that.updWlt();

        if (!that.TIME_INTERVER) clearInterval(that.TIME_INTERVER);

        that.TIME_INTERVER = setInterval(() => {
            that.updWlt();
        }, that.entrepotDataInterval);

        // 添加ASSETD全局广播，用于资产估值计算 和合约 仓位 数据计算
        broadcast.onMsg({
            key: this.name,
            cmd: broadcast.MSG_ASSETD_UPD,
            cb: function () {
                that.calcTrdWlt();
            }
        });
        // 交易风险限额数据获取完成广播
        broadcast.onMsg({
            key: this.name,
            cmd: broadcast.EV_GET_RS_READY,
            cb: function (arg) {
                // console.log('EV_GET_RS_READY', arg);
                that.calcTrdWlt();
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
    // 获取跟单数据
    updWlt: function () {
        const that = this;
        Http.subAssets({ exChannel: window.exchId, aType: '018' }).then(res => {
            if (res.result.code === 0) {
                that.walletState = 1;
                that.setWallet(res.assetLists03);
            }
        }).finally(res => { that.getFollowPosition(); });
    },
    // 获取跟单持仓数据
    getFollowPosition: function () {
        const that = this;
        Http.getFollowPosition({ positions: JSON.stringify(that.entrepotIds) }).then(res => {
            if (res.code === 0) {
                that.entrepotState = 1;
                const list = that.entrepotS.map(item => res.delPos.find(del => del === item.PId) < 0);
                that.entrepotS = [...list, ...res.data];
                that.entrepotIds = that.entrepotS.map(item => item.PId);
                that.checkPosNeedSubSym();
            }
        });
    },

    setWallet: function (data = []) {
        this.wallet = data;
        for (const item of data) {
            this.wallet_obj[item.wType] = item;
        }
    },

    initWlt: function () {
        // 计算之前先将估值归0
        this.totalValueForUSDT = 0;
        this.totalValueForBTC = 0;
        this.totalValueForCNY = 0;

        this.wallet = [];

        for (const coin in this.wallet_obj) {
            this.wallet_obj[coin] = this.wltHandle(this.wallet_obj[coin]);

            this.wallet.push(this.wallet_obj[coin]);

            this.wallet_obj[coin].valueForUSDT = this.toFixedForFloor(this.wallet_obj[coin].valueForUSDT, 4);
            this.wallet_obj[coin].valueForBTC = this.toFixedForFloor(this.wallet_obj[coin].valueForBTC, 8);

            // 总USDT估值
            this.totalValueForUSDT += Number(this.wallet_obj[coin].valueForUSDT);
            // 总BTC估值
            this.totalValueForBTC += Number(this.wallet_obj[coin].valueForBTC);
        }

        this.totalCNYValue = Number(this.totalValueForUSDT) * this.prz;
        broadcast.emit({
            cmd: broadcast.MSG_FOLLOW_UPD,
            data: {
                wallet_obj: this.wallet_obj, // 资产
                wallet: this.wallet
            }
        });
    },

    wltHandle: function (wlt) {
        this.wltItemEx = {};
        this.wltItemEx = Object.assign({}, wlt);
        const coinPrz = this.getPrz(this.wltItemEx.wType);
        // console.log('ht', AssetD);
        // 取BTC的价格 start
        // const btcSymName = utils.getSpotName(AssetD, 'BTC', 'USDT');
        // const btcInitValue = (this.wallet_obj['03'] && this.wallet_obj['03'].BTC && this.wallet_obj['03'].BTC.initValue) || 0;
        // const btcPrz = (AssetD[btcSymName] && AssetD[btcSymName].PrzLatest) || btcInitValue;
        const btcPrz = this.getPrz('BTC');
        // console.log('ht', 'btc prz', btcSymName, btcInitValue, AssetD[btcSymName] && AssetD[btcSymName].PrzLatest, btcPrz);
        // 取BTC的价格 end

        const TOTAL = Number(this.wltItemEx.mainBal || 0) + Number(this.wltItemEx.financeBal || 0) + Number(this.wltItemEx.mainLock || 0) + Number(this.wltItemEx.depositLock || 0) + Number(this.wltItemEx.pawnBal || 0) + Number(this.wltItemEx.creditNum || 0);
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
        // MgnBal:账户权益 aUPNL: 总未实现盈亏
        this.wltItemEx.aUPNL = this.toFixedForFloor(Number(this.wltItemEx.aUPNL) || 0, 8);
        this.wltItemEx.MgnBal = this.toFixedForFloor(Number(this.wltItemEx.mainBal) + Number(this.wltItemEx.depositLock) + Number(this.wltItemEx.mainLock) + Number(this.wltItemEx.aUPNL) || 0, 8);

        // 当前币种价格 start
        // const coinInitValue = Number(this.wltItemEx.initValue || 1);
        // const coinSym = utils.getSpotName(AssetD, this.wltItemEx.wType, 'USDT');
        // const coinPrz = (AssetD[coinSym] && AssetD[coinSym].PrzLatest) || coinInitValue;
        // console.log('ht', 'value', coinPrz);
        // 当前币种价格 end
        // USDT估值
        const valueForUSDT = TOTAL * coinPrz;
        // console.log('ht', 'usdt value', TOTAL, coinPrz, TOTAL * coinPrz);
        this.wltItemEx.valueForUSDT = this.toFixedForFloor(valueForUSDT, 8);
        // BTC估值
        const valueForBTC = TOTAL * coinPrz / btcPrz;
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

    // 获取钱包计算所需风险限额
    // getRiskLimits: function() {
    //     // ReqTrdGetRiskLimits
    //     const that = this;
    //     const Authrized = gTrdApi.RT.Authrized;// aObj.AUTH_ST_OK
    //     const AssetD = gMktApi.AssetD;
    //     if (Authrized === gTrdApi.AUTH_ST_OK && Object.keys(AssetD).length > 0) {
    //         const aymArr = [];
    //         for (const key in AssetD) {
    //             const item = AssetD[key];
    //             if (item.TrdCls !== 1) {
    //                 aymArr.push(item.Sym);
    //             }
    //         }
    //         if (aymArr.length > 0) {
    //             if (this.isReqRiskLimits) {
    //                 return;
    //             }
    //             this.isReqRiskLimits = true;
    //             gTrdApi.ReqTrdGetRiskLimits({
    //                 AId: gTrdApi.RT.UserId + "01",
    //                 Sym: aymArr.join(',')
    //             }, function() {
    //                 that.isReqRiskLimits = false;
    //             });
    //         }
    //     }
    // },

    toFixedForFloor (value, n) {
        if (isNaN(value)) {
            return 0;
        }
        // 处理浮点数
        let num = value;
        // 处理科学计数法数字
        const str = num.toString();
        if (/e/i.test(str)) {
            num = Number(num).toFixed(18).replace(/\.?0+$/, "");
        }
        const index = num.toString().split('.')[1]?.length;
        if (index < n) {
            for (let i = 0; i < n - index; i++) {
                num += '0';
            }
            return num;
        }
        const pow = Math.pow(10, n);
        num = Number(num) * pow;
        num = Math.floor(num);
        num = num / pow;
        num = num.toFixed(n);
        return num;
    },

    trdDataOnFun: function() {
        const tm = Date.now();
        if (tm - this.calcTrdWltLastTm > this.calcTrdWltInterval) {
            // this.checkPosNeedSubSym();
            this.calcTrdWlt();
            this.calcTrdWltLastTm = tm;
        }
    },

    checkPosNeedSubSym: function() {
        const Pos = this.entrepotS; // 跟单仓位信息
        let needSubSymArr = [];
        // 检查仓位列表内仓位数量不为0的仓位，并订阅对应跟单的行情，用于未实现盈亏计算
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

    calcTrdWlt: function(arg) {
        const that = this;
        const { Orders, RS, trdInfoStatus } = gTrdApi;
        const { lastTick, AssetD } = gMktApi;

        if ((that.walletState === 0 /* 跟单仓位数据 */ ||
            that.entrepotState === 0 /* 跟单资产数据 */ ||
            trdInfoStatus.rs === 0 /* 风险限额数据 */
        )) {
            return;
        }
        // 将仓位数据Poss、资产数据Wlts，以及委托数据Orders拷贝至新的对象或数组，防止后边计算影响原数据；
        const posArr = [];
        for (const key in this.entrepotS) {
            const item = {};
            utils.copyTab(item, this.entrepotS[key]);
            posArr.push(item);
        }
        // console.log('posArr', posArr, gTrdApi);

        const wallets = [];
        for (const key in this.wallet_obj) {
            const item = {};
            utils.copyTab(item, this.wallet_obj[key]);
            wallets.push(item);
        }
        // console.log('wallets', wallets);

        const orderArr = [];
        for (const key in Orders['01']) {
            const item = {};
            if (Orders['01'][key].OType === 1 || Orders['01'][key].OType === 2) {
                utils.copyTab(item, Orders['01'][key]);
                orderArr.push(item);
            }
        }

        calcFutureWltAndPosAndMIFollow(
            posArr,
            wallets,
            orderArr,
            RS,
            AssetD,
            lastTick,
            config.future.UPNLPrzActive,
            config.future.MMType,
            config.future.PrzLiqType,
            arg => {
                that.setWallet(arg.wallets);
                that.initWlt();
                console.log(this);
            });
        // console.log('calcFutureWltAndPosAndMI', calcFutureWltAndPosAndMI, Poss, Wlts, Orders, RS, lastTick, AssetD);
    },

    remove: function () {
        !this.TIME_INTERVER && clearInterval(this.TIME_INTERVER);
        this.TIME_INTERVER = null;
        this.walletState = 0;
        this.entrepotState = 0;
        broadcast.offMsg({
            key: this.name,
            isall: true
        });
    }
};