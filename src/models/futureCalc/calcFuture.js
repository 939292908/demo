/**
 * 本文件为合约持仓信息以及资产信息计算相关
 */
import library from './library';

/**
 * 合约数据计算主函数
 * @param {Array} posArr 持仓数据，数组
 * @param {Array} wallets 合约钱包数据，数组
 * @param {Array} orderArr 合约未完成报单数据，数组
 * @param {Object} RSObj 基础风险限额数据，Sym做key
 * @param {Object} assetD 合约详情，Sym做key
 * @param {Object} lastTick 最新tick行情，Sym做key
 * @param {String} UPNLPrzActive 未实现盈亏计算选择，'1':最新价， '2'：标记价
 * @param {String} MMType 保证金率公式选择，0: 默认，1: 开仓价值/杠杆
 * @param {String} PrzLiqType 强平价计算公式选择，0: 默认，1: 默认公式中的MMR风险修改为MAX(MIRMy/2，MMR风险)
 * @param {Function} cb
 * 用该函数处理完成后各个参数新增字段如下：
 * posArr各个持仓新增：
 *    aMIR：风险限额，aMMR：风险限额，aSzNetLong：当前委托净买量，aSzNetShort：当前委托净卖量，aMM：仓位保证金，
 *    aUrP：仓位未实现盈利，aUrl：仓位未实现亏损，aUPNLforLast：仓位未实现盈亏（最新价），aUPNLforM： 仓位未实现盈亏（标记价），
 *    aProfitPer：合约回报率，aLeverEffective：仓位实际杠杆，aAdjustLevelMax仓位最大可调杠杆，仓位最小可调杠杆，
 *    aPrzLiq：强平价格，aMgnRateforPrzM：保证金率（实际值），aMgnRateforLiq：保证金率(参考值)，aAvailMgnISO：逐仓可取保证金
 * wallets中各个币种新增：
 *    MgnBal:账户权益，aMM:总仓位保证金 , aMI:总委托保证金, aUPNL: 总未实现盈亏, aGift可用赠金, aWdrawable可用保证金， maxTransfer最大划转， walletRate保证金使用率
 */
export function calcFutureWltAndPosAndMI(posArr, wallets, orderArr, RSObj, assetD, lastTick, UPNLPrzActive, MMType, PrzLiqType, cb) {
    // 缺少字段补充
    library.addFieldForPosAndWltAndOrd(posArr, wallets, orderArr, assetD);

    const orderForPid = library.orderArrToPId(orderArr);
    const walletObj = library.walletArrToSym(wallets);
    const sumMI = {}; const WltBalObj = {};
    for (let i = 0; i < posArr.length; i++) {
        const pos = posArr[i];
        const orderForPidArr = orderForPid[pos.PId] || []; const tick = lastTick[pos.Sym] || {}; const ass = assetD[pos.Sym] || {}; const RS = RSObj[pos.Sym] || {};
        const { orderBuy, orderSell, QtyBuy, QtySell } = library.orderSplitAndSort(orderForPidArr);
        const SettPrz = tick.SettPrz || 0; const SettleCoin = ass.SettleCoin;

        const wallet = walletObj[SettleCoin] || {};
        const WltBal = (wallet.Depo || 0) - (wallet.WDrw || 0) + (wallet.PNL || 0) + (wallet.PNLG || 0) + (wallet.Gift || 0) + (wallet.Spot || 0);
        WltBalObj[SettleCoin] = WltBal;
        const { aMIR, aMMR, aSzNetLong, aSzNetShort } = library.calcMMRAndMIR(pos.StopP || pos.StopL, orderBuy, orderSell, pos.Sz, RS);

        const aMI = library.calcOrderMI(pos.StopP || pos.StopL, orderBuy, orderSell, SettPrz, ass, aMIR, pos.Lever, pos.Sz, null, pos.MIRMy);

        pos.aMI = aMI;
        pos.aMIR = aMIR;
        pos.aMMR = aMMR;
        pos.aSzNetLong = aSzNetLong;
        pos.aSzNetShort = aSzNetShort;
        pos.aQtyBuy = QtyBuy;
        pos.aQtySell = QtySell;

        if (!sumMI[SettleCoin]) {
            sumMI[SettleCoin] = 0;
        }
        sumMI[SettleCoin] += aMI;
    }
    const { UsedWltBal } = calcPos(posArr, sumMI, assetD, lastTick, UPNLPrzActive, WltBalObj, MMType, PrzLiqType);

    calcfutureWallet(wallets, posArr, UPNLPrzActive, sumMI, UsedWltBal, assetD);
    const param = { posArr, wallets };
    cb && cb(param);
}

/**
 * 杠杆调整验证
 * @param {Object} pos 需要调整的持仓信息
 * @param {Array} orderForPId 需要调整的仓位对应的委托单
 * @param {Object} assetD 需要调整的持仓对应的合约的assetD
 * @param {Object} lastTick 需要调整的持仓对应的合约的最新行情
 * @param {Number} newLever 新调整的杠杆
 * @param {Function} cb cb({
                      code: 0, //code为0时可正常调整，-1调整后会导致仓位被强平， -2保证金不足，
                      changeNeedMM: 0//调整杠杆所需保证金
                    })
 *
 */
export function calcChangeLever(pos, orderForPId, assetD, lastTick, newLever, cb) {
    let CBParam = {};
    if (!pos || pos.Lever === newLever) {
        CBParam = {
            code: 0,
            changeNeedMM: 0
        };
        cb && cb(CBParam);
        return;
    }
    let NewAvailBal = 0; let NewMgnCalcAndMgnISO = 0; let NewMIR = 0; let NewMI = 0; let NewMgn = 0;
    const _aUrL = Math.abs(pos.aUrL); const _aMM = pos.aMM; const _aMI = pos.aMI; const aValIni = Math.abs(pos.aValIni);

    if (pos.Lever === 0) {
        NewAvailBal = pos.aAvailBal + _aUrL + _aMM + _aMI;
    } else {
        NewAvailBal = pos.aAvailBal + _aMM + _aMI;
    }

    NewMIR = 1 / Math.min(newLever, 1 / pos.aMIR);
    NewMgnCalcAndMgnISO = aValIni * NewMIR + (pos.MgnISO || 0);

    const { orderBuy, orderSell } = library.orderSplitAndSort(orderForPId);
    NewMI = library.calcOrderMI(pos.StopP || pos.StopL, orderBuy, orderSell, lastTick.SettPrz || 0, assetD, pos.aMIR, newLever, pos.Sz, NewMIR, pos.MIRMy);// aValIni*NewMIR + (pos.FeeIni || 0)

    NewMgn = NewMgnCalcAndMgnISO + NewMI;

    let changeNeedMM = 0;

    if (pos.Lever === 0 && newLever !== 0) {
        changeNeedMM = NewMgnCalcAndMgnISO - _aUrL - _aMM - _aMI;
    } else if (pos.Lever !== 0 && newLever !== 0) {
        changeNeedMM = NewMgnCalcAndMgnISO - _aMM - _aMI;
    }

    changeNeedMM = changeNeedMM > 0 ? changeNeedMM : 0;

    if (pos.Sz === 0 || newLever === 0) {
        CBParam = {
            code: 0,
            changeNeedMM: 0
        };
        cb && cb(CBParam);
    } else if (newLever > 1 / pos.aMIR) {
        CBParam = {
            code: -3,
            errorText: '超出风险限额最大可调整杠杆，杠杆调整失败！',
            changeNeedMM: 0
        };
        cb && cb(CBParam);
    } else if (newLever !== 0 && NewMgn <= NewAvailBal && (_aUrL + aValIni * pos.aMMR < NewMgnCalcAndMgnISO)) {
        CBParam = {
            code: 0,
            changeNeedMM
        };
        cb && cb(CBParam);
    } else if (newLever !== 0 && NewMgn <= NewAvailBal && (_aUrL + aValIni * pos.aMMR >= NewMgnCalcAndMgnISO)) {
        CBParam = {
            code: -1,
            errorText: "该操作导致仓位强平，调整杠杆失败！",
            changeNeedMM
        };
        cb && cb(CBParam);
    } else if (newLever !== 0 && NewMgn > NewAvailBal) {
        CBParam = {
            code: -2,
            errorText: '可用保证金不足，调整杠杆失败！',
            changeNeedMM
        };
        cb && cb(CBParam);
    }
}

/**
 *
 * @param {Array} posArr 持仓数据
 * @param {Object} 总委托保证金，Coin做key
 * @param {Object} assetD 合约详情
 * @param {Object} lastTick 最新tick行情，Sym做key
 * @param {String} UPNLPrzActive 未实现盈亏计算选择，'1':最新价， '2'：标记价
 * @param {Object} WltBalObj 钱包余额，Coin做key
 */
export function calcPos(posArr, sumMI, assetD, lastTick, UPNLPrzActive, WltBalObj, MMType, PrzLiqType) {
    const UsedWltBal = {}; const UsedWltBalForDeduction = {}; const SumUrlForLever0 = {}; const SumMM = {}; const SumMMForLever0 = {}; let SumMgnCalcAndMgnISO = 0; const SumUPNLForM = {};
    for (let i = 0; i < posArr.length; i++) {
        const pos = posArr[i];
        const Sym = pos.Sym;
        const ass = assetD[Sym] || {}; const tick = lastTick[Sym] || {}; let ValIni = 0; let ValM = 0; let ValL = 0; let MgnCalcAndMgnISO = 0;

        const isReverse = (ass.Flag & 1) === 1 || ass.TrdCls === 2 ? 1 : 0;
        ValIni = library.calcVal(isReverse, pos.PrzIni, pos.Sz, (ass.LotSz || 0));
        ValM = library.calcVal(isReverse, tick.SettPrz, pos.Sz, (ass.LotSz || 0));
        ValL = library.calcVal(isReverse, tick.LastPrz, pos.Sz, (ass.LotSz || 0));

        if (pos.Lever !== 0) {
            MgnCalcAndMgnISO = Math.abs(ValIni) / Math.min(pos.Lever, 1 / pos.aMIR) + pos.MgnISO;
        }

        SumMgnCalcAndMgnISO += MgnCalcAndMgnISO;

        let MM = 0; let _MM = 0; let UPNLforM = 0; let UPNLforLast = 0; let UrP = 0; let UrL = 0; let profitPer = 0; let AvailMgnISO = 0;

        UPNLforLast = (ValL !== 0 && ValIni !== 0) ? ValL - ValIni : 0;
        UPNLforM = (ValM !== 0 && ValIni !== 0) ? ValM - ValIni : 0;

        UrP = UPNLforM > 0 ? UPNLforM : 0;
        UrL = UPNLforM < 0 ? UPNLforM : 0;

        if (!SumUrlForLever0[ass.SettleCoin]) {
            SumUrlForLever0[ass.SettleCoin] = 0;
        }
        if (pos.Lever === 0) {
            SumUrlForLever0[ass.SettleCoin] += UrL;
        }

        if (pos.Lever === 0) {
            if (MMType === 1) {
                const Lever = 1 / Math.max(pos.MIRMy, pos.aMIR);
                MM = Math.abs(ValIni) / Lever;
            } else {
                MM = Math.abs(ValIni) * pos.aMMR;
            }
            if (PrzLiqType && pos.Lever === 0) {
                const MMR = Math.max(pos.MIRMy / 2, pos.aMMR);
                _MM = Math.abs(ValIni) * MMR;
            } else {
                _MM = Math.abs(ValIni) * pos.aMMR;
            }
        } else {
            _MM = MM = MgnCalcAndMgnISO + pos.PNLISO;
            AvailMgnISO = Math.max(pos.MgnISO + UrL, 0);
        }

        // 累计全部仓位保证金
        if (!SumMM[ass.SettleCoin]) {
            SumMM[ass.SettleCoin] = 0;
        }
        SumMM[ass.SettleCoin] += (_MM || 0);

        if (pos.Lever === 0) { // 累计全仓相关保证金
            if (!SumMMForLever0[ass.SettleCoin]) {
                SumMMForLever0[ass.SettleCoin] = 0;
            }
            SumMMForLever0[ass.SettleCoin] += (_MM || 0);
        }

        SumUPNLForM[ass.SettleCoin] = SumUPNLForM[ass.SettleCoin] || 0;
        if (pos.Lever === 0) {
            SumUPNLForM[ass.SettleCoin] += (UPNLforM || 0);
        }

        if (!UsedWltBal[ass.SettleCoin]) {
            UsedWltBal[ass.SettleCoin] = 0;
        }
        if (!UsedWltBalForDeduction[ass.SettleCoin]) {
            UsedWltBalForDeduction[ass.SettleCoin] = 0;
        }

        if (pos.Lever === 0) {
            UsedWltBal[ass.SettleCoin] += Math.abs(UrL) + (MM || 0);
            UsedWltBalForDeduction[ass.SettleCoin] += (MM || 0);
        } else {
            UsedWltBal[ass.SettleCoin] += MgnCalcAndMgnISO;
            UsedWltBalForDeduction[ass.SettleCoin] += MgnCalcAndMgnISO;
        }

        if (UPNLPrzActive === '1') {
            profitPer = UPNLforLast / MM;
        } else if (UPNLPrzActive === '2') {
            profitPer = UPNLforM / MM;
        }

        pos.aMM = MM;
        pos._MM = _MM;

        pos.aUrP = UrP;
        pos.aUrL = UrL;
        pos.aUPNLforLast = UPNLforLast;
        pos.aUPNLforM = UPNLforM;

        pos.aMgnCalcAndMgnISO = MgnCalcAndMgnISO;
        pos.aSumMgnCalcAndMgnISO = SumMgnCalcAndMgnISO;
        pos.aValIni = ValIni;
        pos.aValM = ValM;
        pos.aValL = ValL;
        pos.aProfitPer = profitPer;
        pos.aAvailMgnISO = AvailMgnISO;
    }

    for (const key in UsedWltBal) {
        UsedWltBal[key] += (sumMI[key] || 0);
    }
    for (const key in UsedWltBalForDeduction) {
        UsedWltBalForDeduction[key] += Math.abs(Math.min(SumUPNLForM[key] || 0, 0));
    }
    calcPos1(posArr, SumUrlForLever0, SumMM, UsedWltBal, sumMI, assetD, lastTick, WltBalObj, SumUPNLForM, SumMMForLever0, PrzLiqType);

    return { posArr, UsedWltBal };
}

function calcPos1(posArr, SumUrlForLever0, SumMM, UsedWltBal, sumMI, assetD, lastTick, WltBalObj, SumUPNLForM, SumMMForLever0, PrzLiqType) {
    for (let i = 0; i < posArr.length; i++) {
        const pos = posArr[i];
        const Sym = pos.Sym;
        const ass = assetD[Sym] || {}; const tick = lastTick[Sym] || {};
        let UrL2 = 0; let WltBal = 0; let WltForPos = 0; let LeverEffective = 0; let AdjustLevelMax = 0; let AdjustLeverMin = 0;

        let FeeTkrR = ass.FeeTkrR;
        FeeTkrR = 0;
        WltBal = WltBalObj[ass.SettleCoin] || 0;

        // if((ass.Flag&1) == 16384){
        //   UrL2 = Number(Math.abs(Math.min((SumUPNLForM[ass.SettleCoin] || 0) - pos.aUPNLforM,0))+ sumMI[ass.SettleCoin])
        // }else{
        //   UrL2 = Number(Math.abs((SumUPNLForM[ass.SettleCoin] || 0) - pos.aUPNLforM)+ sumMI[ass.SettleCoin])
        // }
        UrL2 = Number(Math.abs(SumUrlForLever0[ass.SettleCoin] - pos.aUrL) + sumMI[ass.SettleCoin]);

        // 计算强平价相关的WltForPos用原公式的仓位保证金计算公式
        if (pos.Lever === 0) {
            WltForPos = WltBal - pos.aMgnCalcAndMgnISO - UrL2 - Math.abs(SumMM[ass.SettleCoin] - pos._MM);// Math.abs(SumMMForLever0[ass.SettleCoin] - pos._MM)
        } else {
            WltForPos = pos.aMM;
            AdjustLevelMax = pos.aValIni / (pos.aMM - pos.aUrL - pos.MgnISO - pos.PNLISO);
            AdjustLeverMin = pos.aValIni / (pos.aMM + WltBal - UsedWltBal[ass.SettleCoin]);
        }

        LeverEffective = Math.abs(pos.aValIni) / WltForPos;

        pos.aLeverEffective = LeverEffective;
        pos.aAdjustLevelMax = AdjustLevelMax;
        pos.aAdjustLeverMin = AdjustLeverMin;

        const isReverse = ((ass.Flag & 1) === 1 || ass.TrdCls === 2) ? 1 : 0;
        let MMR = 0;
        if (PrzLiqType && pos.Lever === 0) {
            MMR = Math.max(pos.MIRMy / 2, pos.aMMR);
        } else {
            MMR = pos.aMMR;
        }
        const PrzLiq = library.calcPrzLiq(isReverse, pos.PrzIni, pos.aValIni, WltForPos, FeeTkrR, MMR, ass.LotSz, pos.Sz, ass.PrzMinInc, ass.PrzMax);

        pos.aPrzLiq = PrzLiq;
        // pos.aPrzBr = PrzBr

        let MgnRateforPrzM = 0; let MgnRateforLiq = 0;

        if ((ass.Flag & 1) === 1 || ass.TrdCls === 2) {
            MgnRateforPrzM = tick.SettPrz ? 1 - pos.PrzIni / tick.SettPrz : 0;
            MgnRateforLiq = 1 - pos.PrzIni / PrzLiq;
        } else {
            MgnRateforPrzM = tick.SettPrz / pos.PrzIni - 1;
            MgnRateforLiq = PrzLiq / pos.PrzIni - 1;
        }

        pos.aMgnRateforPrzM = MgnRateforPrzM;
        pos.aMgnRateforLiq = MgnRateforLiq;

        pos.aAvailBal = (WltBal - (UsedWltBal[ass.SettleCoin] || 0));
        pos.aAvailBal = pos.aAvailBal > 0 ? pos.aAvailBal : 0;
    }
}

/**
 * 钱包数据计算
 * @param {Array} wallets
 * @param {Array} posArr
 * @param {String} UPNLPrzActive
 * @param {Object} sumMI
 * @param {Object} UsedWltBal
 * @param {Object} assetD
 * 计算后钱包数据新增字段，MgnBal:保证金余额，aMM:总仓位保证金 , aMI:总委托保证金, aUPNL: 总未实现盈亏, aGift可用赠金, aWdrawable可用保证金， maxTransfer最大划转
 */
export function calcfutureWallet(wallets, posArr, UPNLPrzActive, sumMI, UsedWltBal, assetD) {
    for (let i = 0; i < wallets.length; i++) {
        const wallet = wallets[i]; let MgnBal = 0; let AvailBal = 0; let GiftRemain = 0; let Wdrawable = 0; let WltBal = 0; let PNLISO = 0; let aUPNL = 0; let aPNL = 0; const SumMM = {};

        for (let i = 0; i < posArr.length; i++) {
            const pos = posArr[i];
            const ass = assetD[pos.Sym] || {};
            if (ass.SettleCoin === wallet.Coin) {
                PNLISO += (pos.PNLISO || 0);
                aUPNL += (pos.aUPNLforM || 0);
                aPNL += (pos.RPNL || 0);
                if (!SumMM[ass.SettleCoin]) {
                    SumMM[ass.SettleCoin] = 0;
                }
                SumMM[ass.SettleCoin] += (pos.aMM || 0);
            }
        }
        WltBal = (wallet.Depo || 0) - (wallet.WDrw || 0) + (wallet.PNL || 0) + (wallet.PNLG || 0) + (wallet.Gift || 0) + (wallet.Spot || 0);
        MgnBal = WltBal + PNLISO + aUPNL;// SumUrP + SumUrlForLever0

        AvailBal = WltBal - (UsedWltBal[wallet.Coin] || 0);
        AvailBal = AvailBal > 0 ? AvailBal : 0;

        GiftRemain = (wallet.Gift || 0) + (wallet.PNLG || 0);
        GiftRemain = GiftRemain > 0 ? GiftRemain : 0;

        Wdrawable = WltBal - GiftRemain - (UsedWltBal[wallet.Coin] > GiftRemain ? (UsedWltBal[wallet.Coin] || 0) - GiftRemain : 0);

        WltBal = WltBal > 0 ? WltBal : 0;
        MgnBal = MgnBal > 0 ? MgnBal : 0;
        Wdrawable = Wdrawable > 0 ? Wdrawable : 0;

        wallet.WltBal = WltBal;
        wallet.MgnBal = MgnBal;
        wallet.aMI = (sumMI[wallet.Coin] || 0);
        wallet.aMM = SumMM[wallet.Coin] || 0;
        wallet.aUPNL = aUPNL;
        wallet.aPNL = aPNL;
        wallet.aGift = GiftRemain;
        wallet.aWdrawable = AvailBal;
        wallet.maxTransfer = Wdrawable;
        wallet.walletRate = 1 - AvailBal / WltBal;
    }
}

/**
 * 跟单数据计算主函数
 * @param {Array} posArr 持仓数据，数组
 * @param {Array} wallets 跟单钱包数据，数组
 * @param {Array} orderArr 跟单未完成报单数据，数组  (使用默认值： [])
 * @param {Object} RSObj 基础风险限额数据，Sym做key
 * @param {Object} assetD 合约详情，Sym做key
 * @param {Object} lastTick 最新tick行情，Sym做key
 * @param {String} UPNLPrzActive 未实现盈亏计算选择，'1':最新价， '2'：标记价
 * @param {String} MMType 保证金率公式选择，0: 默认，1: 开仓价值/杠杆
 * @param {String} PrzLiqType 强平价计算公式选择，0: 默认，1: 默认公式中的MMR风险修改为MAX(MIRMy/2，MMR风险)
 * @param {Function} cb
 * 用该函数处理完成后各个参数新增字段如下：
 * posArr各个持仓新增：
 *    aMIR：风险限额，aMMR：风险限额，aSzNetLong：当前委托净买量，aSzNetShort：当前委托净卖量，aMM：仓位保证金，
 *    aUrP：仓位未实现盈利，aUrl：仓位未实现亏损，aUPNLforLast：仓位未实现盈亏（最新价），aUPNLforM： 仓位未实现盈亏（标记价），
 *    aProfitPer：合约回报率，aLeverEffective：仓位实际杠杆，aAdjustLevelMax仓位最大可调杠杆，仓位最小可调杠杆，
 *    aPrzLiq：强平价格，aMgnRateforPrzM：保证金率（实际值），aMgnRateforLiq：保证金率(参考值)，aAvailMgnISO：逐仓可取保证金
 * wallets中各个币种新增：
 *    aUPNL: 总未实现盈亏
 */
export function calcFutureWltAndPosAndMIFollow(posArr, wallets, orderArr, RSObj, assetD, lastTick, UPNLPrzActive, MMType, PrzLiqType, cb) {
    // 缺少字段补充
    // library.addFieldForPosAndWltAndOrd(posArr, wallets, orderArr, assetD)

    // let orderForPid = library.orderArrToPId(orderArr);
    // let wallet_obj = library.walletArrToSym(wallets)
    const sumMI = {};
    for (let i = 0; i < posArr.length; i++) {
        const pos = posArr[i];
        // let orderForPidArr = orderForPid[pos.PId]||[],tick = lastTick[pos.Sym] || {}, ass = assetD[pos.Sym] || {},RS = RSObj[pos.Sym]||{}
        // let {orderBuy, orderSell, QtyBuy, QtySell} = library.orderSplitAndSort(orderForPidArr)
        const ass = assetD[pos.Sym] || {};
        const SettleCoin = ass.SettleCoin;
        const tick = lastTick[pos.Sym] || {};
        const SettPrz = tick.SettPrz || 0;//, LastPrz = tick.LastPrz || 0, Sz = 0, SettleCoin = ass.SettleCoin
        const RS = RSObj[pos.Sym] || {};

        // let {aMIR, aMMR, aSzNetLong, aSzNetShort} = library.calcMMRAndMIR(pos.StopP || pos.StopL, orderBuy, orderSell, pos.Sz, RS)
        const aMIR = RS.BaseMIR; const aMMR = RS.BaseMMR;

        // let aMI = library.calcOrderMI(pos.StopP || pos.StopL, orderBuy, orderSell, SettPrz, ass, aMIR, pos.Lever, pos.Sz, null, pos.MIRMy)
        const aMI = 0;
        pos.aMI = aMI;
        pos.aMIR = aMIR;
        pos.aMMR = aMMR;
        pos.aSzNetLong = 0;
        pos.aSzNetShort = 0;
        pos.aQtyBuy = 0;
        pos.aQtySell = 0;
        pos.aMM = pos.MI;
        pos.aLeverEffective = pos.Lever;
        pos.aUrP = pos.PNLISO > 0 ? pos.PNLISO : 0;
        pos.aUrl = pos.PNLISO < 0 ? pos.PNLISO : 0;
        pos.aPrzLiq = pos.PrzLiq;
        pos.aAvailMgnISO = 0;

        if (!sumMI[SettleCoin]) {
            sumMI[SettleCoin] = 0;
        }
        sumMI[SettleCoin] += aMI;

        // let ass = assetD[pos.Sym] || {}
        const isReverse = (ass.Flag & 1) === 1 || ass.TrdCls === 2 ? 1 : 0;
        const ValIni = library.calcVal(isReverse, pos.PrzIni, pos.Sz, (ass.LotSz || 0));
        const ValM = library.calcVal(isReverse, tick.SettPrz, pos.Sz, (ass.LotSz || 0));
        const ValL = library.calcVal(isReverse, tick.LastPrz, pos.Sz, (ass.LotSz || 0));

        // let MM = 0, _MM = 0, UPNLforM = 0, UPNLforLast = 0, UrP = 0, UrL = 0, profitPer = 0, AvailMgnISO = 0;
        pos.aValIni = ValIni;
        pos.aUPNLforLast = ValL - ValIni;
        pos.aUPNLforM = ValM - ValIni;

        const MgnCalcAndMgnISO = Math.abs(ValIni) / Math.min(pos.Lever, 1 / pos.aMIR);
        const MM = MgnCalcAndMgnISO + pos.PNLISO;
        if (UPNLPrzActive === '1') {
            pos.aProfitPer = pos.aUPNLforLast / MM;
        } else if (UPNLPrzActive === '2') {
            pos.aProfitPer = pos.aUPNLforM / MM;
        }

        if (isReverse) {
            pos.aMgnRateforPrzM = SettPrz ? 1 - pos.PrzIni / SettPrz : 0;
            pos.aMgnRateforLiq = 1 - pos.PrzIni / pos.PrzLiq;
        } else {
            pos.aMgnRateforPrzM = SettPrz / pos.PrzIni - 1;
            pos.aMgnRateforLiq = pos.PrzLiq / pos.PrzIni - 1;
        }
    }

    calcfutureWalletFollow(wallets, posArr, UPNLPrzActive, assetD);
    const param = { posArr };
    cb && cb(param);
}

/**
 * 跟单钱包数据计算
 * @param {Array} wallets
 * @param {Array} posArr
 * @param {Object} sumMI
 * @param {Object} UsedWltBal
 * @param {Object} assetD
 * 计算后钱包数据新增字段，MgnBal:保证金余额，aMM:总仓位保证金 , aMI:总委托保证金, aUPNL: 总未实现盈亏, aGift可用赠金, aWdrawable可用保证金， maxTransfer最大划转
 */
export function calcfutureWalletFollow(wallets, posArr, UPNLPrzActive, assetD) {
    for (let i = 0; i < wallets.length; i++) {
        const wallet = wallets[i]; let aUPNL = 0;
        for (let i = 0; i < posArr.length; i++) {
            const pos = posArr[i];
            if (pos.WId === wallet.wType) {
                if (UPNLPrzActive === '1') {
                    aUPNL += (pos.aUPNLforLast || 0);
                } else if (UPNLPrzActive === '2') {
                    aUPNL += (pos.aUPNLforM || 0);
                }
            }
        }
        wallet.aUPNL = Number(aUPNL).toFixed(8);
    }
}