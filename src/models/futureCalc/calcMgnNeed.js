/**
 * 本文件为成本价算相关
 */
import library from './library';
/**
 * 成本数据计算主函数
 * @param {Array} posArr 持仓数据，数组
 * @param {Array} wallets 合约钱包数据，数组
 * @param {Array} orderArr 合约未完成报单数据，数组
 * @param {Object} RSObj 基础风险限额数据，Sym做key
 * @param {Object} assetD 合约详情，Sym做key
 * @param {Object} lastTick 最新tick行情，Sym做key
 * @param {String} UPNLPrzActive 未实现盈亏计算选择，'1':最新价， '2'：标记价
 * @param {Object} newOrder 计算成本所需下单板数据模版：{
                    Sym: 'BTC.USDT',
                    Prz: 6456,
                    Qty: 100,
                    QtyF: 0, //默认为0
                    Dir: 1,
                    PId: '01DYM4S43QPM5KY5FZ9Y022ZPD',
                    Lvr: 0, //杠杆
                    MIRMy: 0 //自定义委托保证金率
                }
 * @param {String} MMType 仓位保证金公式选择，0: 默认，1: 开仓价值/杠杆
 * @param {Function} cb 返回成本计算结果
 *
 */
export function calcFutureWltAndPosAndMI(posArr, wallets, orderArr, RSObj, assetD, lastTick, UPNLPrzActive, newOrder, MMType, cb) {
    // 缺少字段补充
    library.addFieldForPosAndWltAndOrd(posArr, wallets, orderArr, assetD);

    const _newOrder = Object.assign({}, newOrder);
    _newOrder.PId = _newOrder.PId ? _newOrder.PId : 'new';
    let posCallVal = {};
    const _orderArr = addNewOrder(orderArr, _newOrder);
    const orderForPid = library.orderArrToPId(_orderArr);
    const wallet_obj = library.walletArrToSym(wallets);
    const sumMI = {}; const WltBal_obj = {};
    const _posArr = [];

    for (let i = 0; i < posArr.length; i++) {
        _posArr.push(posArr[i]);
    }

    if (_newOrder.PId == 'new') {
        _posArr.push({
            Sym: _newOrder.Sym,
            PId: _newOrder.PId,
            Lever: newOrder.Lvr,
            Sz: 0
        });
    }

    for (let i = 0; i < _posArr.length; i++) {
        const pos = _posArr[i];
        const orderForPidArr = orderForPid[pos.PId] || []; const tick = lastTick[pos.Sym] || {}; const ass = assetD[pos.Sym] || {}; const RS = RSObj[pos.Sym] || {};

        const { orderBuy, orderSell, QtyBuy, QtySell } = library.orderSplitAndSort(orderForPidArr);
        const SettPrz = tick.SettPrz || 0; const LastPrz = tick.LastPrz || 0; const Sz = 0; const SettleCoin = ass.SettleCoin;
        const wallet = wallet_obj[SettleCoin] || {};
        const WltBal = (wallet.Depo || 0) - (wallet.WDrw || 0) + (wallet.PNL || 0) + (wallet.PNLG || 0) + (wallet.Gift || 0) + (wallet.Spot || 0);
        WltBal_obj[SettleCoin] = WltBal;
        const Lever = pos.PId == _newOrder.PId ? newOrder.Lvr : pos.Lever;

        const { aMIR, aMMR, aSzNetLong, aSzNetShort } = library.calcMMRAndMIR(pos.StopP || pos.StopL, orderBuy, orderSell, pos.Sz, RS);

        const aMI = library.calcOrderMI(pos.StopP || pos.StopL, orderBuy, orderSell, SettPrz, ass, aMIR, Lever, pos.Sz, null, pos.MIRMy);

        posCallVal[pos.PId] = posCallVal[pos.PId] ? posCallVal[pos.PId] : {};
        posCallVal[pos.PId].aMIR = aMIR;
        posCallVal[pos.PId].aMMR = aMMR;
        posCallVal[pos.PId].aSzNetLong = aSzNetLong;
        posCallVal[pos.PId].aSzNetShort = aSzNetShort;
        posCallVal[pos.PId].aQtyBuy = QtyBuy;
        posCallVal[pos.PId].aQtySell = QtySell;

        if (!sumMI[SettleCoin]) {
            sumMI[SettleCoin] = 0;
        }
        sumMI[SettleCoin] += aMI;
    }

    const { pos1, UsedWltBal } = calcPos(posArr, sumMI, assetD, lastTick, UPNLPrzActive, WltBal_obj, posCallVal, MMType);
    posCallVal = Object.assign(posCallVal, pos1);

    const walletCallbackVal = calcfutureWallet(wallets, posArr, UPNLPrzActive, sumMI, UsedWltBal, assetD, posCallVal);
    const ass1 = assetD[newOrder.Sym] || {};
    const Coin = ass1.SettleCoin;
    let MgnNeed = (walletCallbackVal[Coin] ? walletCallbackVal[Coin].aMI + walletCallbackVal[Coin].aMM : 0) - (wallet_obj[Coin] ? wallet_obj[Coin].aMI + wallet_obj[Coin].aMM : 0);

    MgnNeed = MgnNeed <= 0 ? 0 : MgnNeed;
    cb && cb(MgnNeed);
}

/**
 *
 * @param {Array} posArr 持仓数据
 * @param {Object} 总委托保证金，Coin做key
 * @param {Object} assetD 合约详情
 * @param {Object} lastTick 最新tick行情，Sym做key
 * @param {String} UPNLPrzActive 未实现盈亏计算选择，'1':最新价， '2'：标记价
 * @param {Object} WltBal_obj 钱包余额，Coin做key
 */
export function calcPos(posArr, sumMI, assetD, lastTick, UPNLPrzActive, WltBal_obj, posCallVal, MMType) {
    const UsedWltBal = {}; const SumUrl = {}; const SumMM = {}; const SumMMForLever0 = {}; let SumMgnCalcAndMgnISO = 0;
    for (let i = 0; i < posArr.length; i++) {
        const pos = posArr[i];
        const Sym = pos.Sym;
        const ass = assetD[Sym] || {}; const tick = lastTick[Sym] || {}; let ValIni = 0; let ValM = 0; let ValL = 0; let MgnCalcAndMgnISO = 0;

        const isReverse = (ass.Flag & 1) == 1 || ass.TrdCls == 2 ? 1 : 0;
        ValIni = library.calcVal(isReverse, pos.PrzIni, pos.Sz, (ass.LotSz || 0));
        ValM = library.calcVal(isReverse, tick.SettPrz, pos.Sz, (ass.LotSz || 0));
        ValL = library.calcVal(isReverse, tick.LastPrz, pos.Sz, (ass.LotSz || 0));

        if (pos.Lever != 0) {
            MgnCalcAndMgnISO = Math.abs(ValIni) / Math.min(pos.Lever, 1 / posCallVal[pos.PId].aMIR) + pos.MgnISO;
        }

        SumMgnCalcAndMgnISO += MgnCalcAndMgnISO;

        let MM = 0; let _MM = 0; let UPNLforM = 0; let UPNLforLast = 0; let UrP = 0; let UrL = 0; let profitPer = 0; let AvailMgnISO = 0;

        UPNLforLast = ValL - ValIni;
        UPNLforM = ValM - ValIni;

        UrP = UPNLforM > 0 ? UPNLforM : 0;
        UrL = UPNLforM < 0 ? UPNLforM : 0;

        if (!SumUrl[ass.SettleCoin]) {
            SumUrl[ass.SettleCoin] = 0;
        }
        SumUrl[ass.SettleCoin] += (UrL || 0);

        if (pos.Lever == 0) {
            if (MMType == 1) {
                const Lever = 1 / Math.max(pos.MIRMy, posCallVal[pos.PId].aMIR);
                MM = Math.abs(ValIni) / Lever;
            } else {
                MM = Math.abs(ValIni) * posCallVal[pos.PId].aMMR;
            }
            _MM = Math.abs(ValIni) * posCallVal[pos.PId].aMMR;
        } else {
            _MM = MM = MgnCalcAndMgnISO + pos.PNLISO;
            AvailMgnISO = Math.max(pos.MgnISO + UrL, 0);
        }

        if (!SumMM[ass.SettleCoin]) {
            SumMM[ass.SettleCoin] = 0;
        }
        SumMM[ass.SettleCoin] += (_MM || 0);
        if (pos.Lever == 0) {
            if (!SumMMForLever0[ass.SettleCoin]) {
                SumMMForLever0[ass.SettleCoin] = 0;
            }
            SumMMForLever0[ass.SettleCoin] += (_MM || 0);
        }

        if (!UsedWltBal[ass.SettleCoin]) {
            UsedWltBal[ass.SettleCoin] = 0;
        }
        if (pos.Lever == 0) {
            UsedWltBal[ass.SettleCoin] += (Math.abs(UrL) + MM + MgnCalcAndMgnISO);
        } else {
            UsedWltBal[ass.SettleCoin] += (MM + MgnCalcAndMgnISO);
        }

        if (UPNLPrzActive == '1') {
            profitPer = UPNLforLast / MM;
        } else if (UPNLPrzActive == '2') {
            profitPer = UPNLforM / MM;
        }

        posCallVal[pos.PId] = posCallVal[pos.PId] ? posCallVal[pos.PId] : {};
        posCallVal[pos.PId].aMM = MM;
        posCallVal[pos.PId]._MM = _MM;
        posCallVal[pos.PId].aUrP = UrP;
        posCallVal[pos.PId].aUrL = UrL;
        posCallVal[pos.PId].aUPNLforLast = UPNLforLast;
        posCallVal[pos.PId].aUPNLforM = UPNLforM;

        posCallVal[pos.PId].aMgnCalcAndMgnISO = MgnCalcAndMgnISO;
        posCallVal[pos.PId].aSumMgnCalcAndMgnISO = SumMgnCalcAndMgnISO;
        posCallVal[pos.PId].aValIni = ValIni;
        posCallVal[pos.PId].aValM = ValM;
        posCallVal[pos.PId].aValL = ValL;
        posCallVal[pos.PId].aProfitPer = profitPer;
    }

    for (const key in UsedWltBal) {
        UsedWltBal[key] += (sumMI[key] || 0);
    }

    for (let i = 0; i < posArr.length; i++) {
        const pos = posArr[i];
        const Sym = pos.Sym;
        const ass = assetD[Sym] || {}; const tick = lastTick[Sym] || {};
        let UrL2 = 0; let WltBal = 0; const MM2 = 0; let WltForPos = 0; let LeverEffective = 0; let AdjustLevelMax = 0; let AdjustLeverMin = 0;

        let FeeTkrR = ass.FeeTkrR;
        FeeTkrR = 0;
        WltBal = WltBal_obj[ass.SettleCoin] || {};
        UrL2 = Number(Math.abs(SumUrl[ass.SettleCoin] - pos.aUrL) + sumMI[ass.SettleCoin]);

        if (pos.Lever == 0) {
            WltForPos = WltBal - pos.aSumMgnCalcAndMgnISO - UrL2 - Math.abs(SumMM[ass.SettleCoin] - pos._MM);
        } else {
            WltForPos = pos.aMM;// pos.aMgnCalcAndMgnISO + pos.PNLISO
            AdjustLevelMax = pos.aValIni / (pos.aMM - pos.aUrL - pos.MgnISO - pos.PNLISO);
            AdjustLeverMin = pos.aValIni / (pos.aMM + WltBal - UsedWltBal[ass.SettleCoin]);
        }

        LeverEffective = Math.abs(pos.aValIni) / WltForPos;

        posCallVal[pos.PId].aLeverEffective = LeverEffective;
        posCallVal[pos.PId].aAdjustLevelMax = AdjustLevelMax;
        posCallVal[pos.PId].aAdjustLeverMin = AdjustLeverMin;

        const isReverse = (ass.Flag & 1) == 1 || ass.TrdCls == 2 ? 1 : 0;
        const PrzLiq = library.calcPrzLiq(isReverse, pos.PrzIni, pos.aValIni, WltForPos, FeeTkrR, posCallVal[pos.PId].aMMR, ass.LotSz, pos.Sz, ass.PrzMinInc, ass.PrzMax);

        posCallVal[pos.PId].aPrzLiq = PrzLiq;
        // posCallVal[pos.PId].aPrzBr = PrzBr

        let MgnRateforPrzM = 0; let MgnRateforLiq = 0;

        if ((ass.Flag & 1) == 1 || ass.TrdCls == 2) {
            MgnRateforPrzM = tick.SettPrz ? 1 - pos.PrzIni / tick.SettPrz : 0;
            MgnRateforLiq = 1 - pos.PrzIni / PrzLiq;
        } else {
            MgnRateforPrzM = tick.SettPrz / pos.PrzIni - 1;
            MgnRateforLiq = PrzLiq / pos.PrzIni - 1;
        }

        posCallVal[pos.PId].aMgnRateforPrzM = MgnRateforPrzM;
        posCallVal[pos.PId].aMgnRateforLiq = MgnRateforLiq;
    }
    return { posCallVal, UsedWltBal };
}

/**
 * 钱包数据计算
 * @param {Array} wallets
 * @param {Array} posArr
 * @param {String} UPNLPrzActive
 * @param {Object} sumMI
 * @param {Object} UsedWltBal
 * @param {Object} assetD
 * 计算后钱包数据新增字段，WltBal:钱包余额,MgnBal:保证金余额，aMM:总维持保证金 , aMI:总委托保证金, aUPNL: 总未实现盈亏, aPNL总已实现盈亏，aGift可用赠金, aWdrawable可用资金， maxTransfer最大划转
 */
export function calcfutureWallet(wallets, posArr, UPNLPrzActive, sumMI, UsedWltBal, assetD, posCallVal) {
    const walletCallbackVal = {};
    for (let i = 0; i < wallets.length; i++) {
        const wallet = wallets[i]; let MgnBal = 0; let AvailBal = 0; let GiftRemain = 0; let Wdrawable = 0; let WltBal = 0; let PNLISO = 0; let SumUrP = 0; let SumUrl = 0; let profit = 0; let aUPNL = 0; let aPNL = 0; const maxTransfer = 0; const SumMM = {};

        for (let i = 0; i < posArr.length; i++) {
            const _pos = posArr[i];
            const pos = posCallVal[_pos.PId];
            const ass = assetD[_pos.Sym] || {};
            PNLISO += (_pos.PNLISO || 0);
            SumUrP += (pos.aUrP || 0);
            SumUrl += (pos.aUrl || 0);
            if (UPNLPrzActive == '1') {
                aUPNL += (pos.aUPNLforLast || 0);
            } else if (UPNLPrzActive == '2') {
                aUPNL += (pos.aUPNLforM || 0);
            }
            aPNL += (_pos.RPNL || 0);
            if (!SumMM[ass.SettleCoin]) {
                SumMM[ass.SettleCoin] = 0;
            }
            SumMM[ass.SettleCoin] += (pos.aMM || 0);
        }

        WltBal = (wallet.Depo || 0) - (wallet.WDrw || 0) + (wallet.PNL || 0) + (wallet.PNLG || 0) + (wallet.Gift || 0) + (wallet.Spot || 0);
        MgnBal = WltBal + PNLISO + SumUrP + SumUrl;
        AvailBal = WltBal - (UsedWltBal[wallet.Coin] || 0);
        GiftRemain = (wallet.Gift || 0) + (wallet.PNLG || 0);
        Wdrawable = WltBal - GiftRemain - (UsedWltBal[wallet.Coin] > GiftRemain ? (UsedWltBal[wallet.Coin] || 0) - GiftRemain : 0);
        profit = (UsedWltBal[wallet.Coin] || 0) / WltBal;
        // WltBal += PNLISO
        walletCallbackVal[wallet.Coin] = walletCallbackVal[wallet.Coin] ? walletCallbackVal[wallet.Coin] : {};
        walletCallbackVal[wallet.Coin].WltBal = WltBal;
        walletCallbackVal[wallet.Coin].MgnBal = MgnBal;
        walletCallbackVal[wallet.Coin].aMI = (sumMI[wallet.Coin] || 0);
        walletCallbackVal[wallet.Coin].aMM = SumMM[wallet.Coin] || 0;
        walletCallbackVal[wallet.Coin].aUPNL = aUPNL;
        walletCallbackVal[wallet.Coin].aPNL = aPNL;
        walletCallbackVal[wallet.Coin].aGift = GiftRemain;
        walletCallbackVal[wallet.Coin].aWdrawable = AvailBal;
        walletCallbackVal[wallet.Coin].maxTransfer = Wdrawable;
    }
    return walletCallbackVal;
}

export function addNewOrder(orderArr, newOrder) {
    const arr = [];
    for (let i = 0; i < orderArr.length; i++) {
        const order = orderArr[i];
        arr.push(order);
    }
    arr.push(newOrder);
    return arr;
}